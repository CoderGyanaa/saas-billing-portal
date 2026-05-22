const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// @route GET /api/billing/summary
router.get('/summary', protect, async (req, res) => {
  const Invoice = require('../models/Invoice');
  const Subscription = require('../models/Subscription');
  const [invoices, subscription] = await Promise.all([
    Invoice.find({ user: req.user.id, status: 'paid' }),
    Subscription.findOne({ user: req.user.id, status: 'active' }).populate('plan'),
  ]);
  const totalSpent = invoices.reduce((sum, inv) => sum + inv.total, 0);
  res.json({ success: true, data: { totalSpent, invoiceCount: invoices.length, subscription } });
});

module.exports = router;
