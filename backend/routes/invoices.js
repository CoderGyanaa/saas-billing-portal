const express = require('express');
const router = express.Router();
const { getMyInvoices, getInvoice, getAllInvoices, markPaid } = require('../controllers/invoiceController');
const { protect, authorize } = require('../middleware/auth');
router.get('/my', protect, getMyInvoices);
router.get('/:id', protect, getInvoice);
router.get('/', protect, authorize('superadmin', 'admin', 'billing_manager'), getAllInvoices);
router.put('/:id/mark-paid', protect, authorize('superadmin', 'admin', 'billing_manager'), markPaid);
module.exports = router;
