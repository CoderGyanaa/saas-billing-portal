const Invoice = require('../models/Invoice');

// @route GET /api/invoices/my - User's own invoices
exports.getMyInvoices = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const invoices = await Invoice.find({ user: req.user.id })
      .populate('plan', 'name')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await Invoice.countDocuments({ user: req.user.id });
    res.json({ success: true, data: invoices, total, page: +page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

// @route GET /api/invoices/:id
exports.getInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('user', 'name email company')
      .populate('plan', 'name');
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    // Users can only see their own invoices; admins can see all
    if (invoice.user._id.toString() !== req.user.id && !['admin', 'superadmin', 'billing_manager'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, data: invoice });
  } catch (err) { next(err); }
};

// @route GET /api/invoices - Admin/Billing Manager
exports.getAllInvoices = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const invoices = await Invoice.find(filter)
      .populate('user', 'name email company')
      .populate('plan', 'name')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await Invoice.countDocuments(filter);
    res.json({ success: true, data: invoices, total, page: +page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

// @route PUT /api/invoices/:id/mark-paid - Admin
exports.markPaid = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { status: 'paid', paidAt: new Date() },
      { new: true }
    );
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, data: invoice, message: 'Invoice marked as paid' });
  } catch (err) { next(err); }
};
