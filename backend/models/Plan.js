const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String },
  price: {
    monthly: { type: Number, required: true },
    yearly: { type: Number, required: true },
  },
  currency: { type: String, default: 'USD' },
  features: [{ type: String }],
  limits: {
    users: { type: Number, default: 1 },
    storage: { type: Number, default: 5 }, // GB
    apiCalls: { type: Number, default: 1000 },
    projects: { type: Number, default: 3 },
  },
  isPopular: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  stripePriceIdMonthly: { type: String },
  stripePriceIdYearly: { type: String },
  stripeProductId: { type: String },
  color: { type: String, default: '#4f46e5' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Plan', planSchema);
