const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
  status: {
    type: String,
    enum: ['active', 'inactive', 'cancelled', 'past_due', 'trialing', 'paused'],
    default: 'active',
  },
  billingCycle: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
  currentPeriodStart: { type: Date, required: true },
  currentPeriodEnd: { type: Date, required: true },
  cancelAtPeriodEnd: { type: Boolean, default: false },
  cancelledAt: { type: Date },
  trialEnd: { type: Date },
  stripeSubscriptionId: { type: String },
  stripeCustomerId: { type: String },
  paymentMethod: {
    brand: String,
    last4: String,
    expMonth: Number,
    expYear: Number,
  },
  metadata: { type: Map, of: String },
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
