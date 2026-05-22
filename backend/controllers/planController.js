const Plan = require('../models/Plan');

// @route GET /api/plans - Public
exports.getPlans = async (req, res, next) => {
  try {
    const plans = await Plan.find({ isActive: true }).sort('order');
    res.json({ success: true, data: plans });
  } catch (err) { next(err); }
};

// @route GET /api/plans/:id
exports.getPlan = async (req, res, next) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    res.json({ success: true, data: plan });
  } catch (err) { next(err); }
};

// @route POST /api/plans - Admin only
exports.createPlan = async (req, res, next) => {
  try {
    const plan = await Plan.create(req.body);
    res.status(201).json({ success: true, data: plan });
  } catch (err) { next(err); }
};

// @route PUT /api/plans/:id - Admin only
exports.updatePlan = async (req, res, next) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    res.json({ success: true, data: plan });
  } catch (err) { next(err); }
};

// @route DELETE /api/plans/:id - Superadmin only
exports.deletePlan = async (req, res, next) => {
  try {
    await Plan.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Plan deactivated' });
  } catch (err) { next(err); }
};
