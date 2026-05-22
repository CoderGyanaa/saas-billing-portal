const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, unique: true, default: () => `INV-${uuidv4().slice(0, 8).toUpperCase()}` },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
  items: [{
    description: String,
    quantity: { type: Number, default: 1 },
    unitPrice: Number,
    total: Number,
  }],
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  taxRate: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  status: { type: String, enum: ['draft', 'open', 'paid', 'void', 'uncollectible'], default: 'open' },
  dueDate: { type: Date },
  paidAt: { type: Date },
  billingPeriodStart: { type: Date },
  billingPeriodEnd: { type: Date },
  stripeInvoiceId: { type: String },
  paymentIntentId: { type: String },
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
