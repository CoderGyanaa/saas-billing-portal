const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');
const Invoice = require('../models/Invoice');
const User = require('../models/User');

// @route POST /api/subscriptions - Subscribe to a plan
exports.subscribe = async (req, res, next) => {
  try {
    const { planId, billingCycle = 'monthly' } = req.body;
    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });

    // Cancel existing subscription if any
    if (req.user.subscription) {
      await Subscription.findByIdAndUpdate(req.user.subscription, { status: 'cancelled', cancelledAt: new Date() });
    }

    const now = new Date();
    const periodEnd = new Date(now);
    billingCycle === 'yearly' ? periodEnd.setFullYear(periodEnd.getFullYear() + 1) : periodEnd.setMonth(periodEnd.getMonth() + 1);

    const subscription = await Subscription.create({
      user: req.user.id,
      plan: plan._id,
      billingCycle,
      status: 'active',
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      paymentMethod: { brand: 'visa', last4: '4242', expMonth: 12, expYear: 2026 }, // Mock
    });

    // Link subscription to user
    await User.findByIdAndUpdate(req.user.id, { subscription: subscription._id });

    // Create invoice
    const price = plan.price[billingCycle];
    const tax = +(price * 0.18).toFixed(2);
    await Invoice.create({
      user: req.user.id,
      subscription: subscription._id,
      plan: plan._id,
      items: [{ description: `${plan.name} Plan - ${billingCycle}`, quantity: 1, unitPrice: price, total: price }],
      subtotal: price,
      tax,
      taxRate: 18,
      total: +(price + tax).toFixed(2),
      currency: plan.currency,
      status: 'paid',
      paidAt: now,
      billingPeriodStart: now,
      billingPeriodEnd: periodEnd,
      dueDate: now,
    });

    const populated = await subscription.populate('plan');
    res.status(201).json({ success: true, data: populated, message: 'Subscription activated!' });
  } catch (err) { next(err); }
};

// @route GET /api/subscriptions/my
exports.getMySubscription = async (req, res, next) => {
  try {
    const sub = await Subscription.findOne({ user: req.user.id, status: 'active' }).populate('plan');
    res.json({ success: true, data: sub });
  } catch (err) { next(err); }
};

// @route PUT /api/subscriptions/cancel
exports.cancelSubscription = async (req, res, next) => {
  try {
    const sub = await Subscription.findOne({ user: req.user.id, status: 'active' });
    if (!sub) return res.status(404).json({ success: false, message: 'No active subscription' });
    sub.cancelAtPeriodEnd = true;
    sub.status = 'cancelled';
    sub.cancelledAt = new Date();
    await sub.save();
    res.json({ success: true, message: 'Subscription cancelled', data: sub });
  } catch (err) { next(err); }
};

// @route PUT /api/subscriptions/upgrade
exports.upgradeSubscription = async (req, res, next) => {
  try {
    const { planId, billingCycle } = req.body;
    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    const sub = await Subscription.findOne({ user: req.user.id, status: 'active' });
    if (!sub) return res.status(404).json({ success: false, message: 'No active subscription to upgrade' });

    const now = new Date();
    const periodEnd = new Date(now);
    billingCycle === 'yearly' ? periodEnd.setFullYear(periodEnd.getFullYear() + 1) : periodEnd.setMonth(periodEnd.getMonth() + 1);

    sub.plan = plan._id;
    sub.billingCycle = billingCycle || sub.billingCycle;
    sub.currentPeriodStart = now;
    sub.currentPeriodEnd = periodEnd;
    await sub.save();

    const populated = await sub.populate('plan');
    res.json({ success: true, data: populated, message: 'Plan upgraded successfully!' });
  } catch (err) { next(err); }
};

// @route GET /api/subscriptions - Admin
exports.getAllSubscriptions = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const subs = await Subscription.find(filter)
      .populate('user', 'name email company')
      .populate('plan', 'name price')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await Subscription.countDocuments(filter);
    res.json({ success: true, data: subs, total, page: +page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};
