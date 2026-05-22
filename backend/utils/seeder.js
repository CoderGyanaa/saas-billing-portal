const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Plan = require('../models/Plan');
const Subscription = require('../models/Subscription');
const Invoice = require('../models/Invoice');

const connectDB = require('../config/db');

const seedData = async () => {
  await connectDB();
  
  console.log('🗑️  Clearing existing data...');
  await User.deleteMany();
  await Plan.deleteMany();
  await Subscription.deleteMany();
  await Invoice.deleteMany();

  console.log('🌱 Seeding plans...');
  const plans = await Plan.insertMany([
    {
      name: 'Starter', slug: 'starter', description: 'Perfect for individuals and small projects',
      price: { monthly: 9, yearly: 90 }, currency: 'USD',
      features: ['1 User', '5 GB Storage', '1,000 API Calls/month', '3 Projects', 'Email Support'],
      limits: { users: 1, storage: 5, apiCalls: 1000, projects: 3 },
      color: '#6366f1', order: 1,
    },
    {
      name: 'Pro', slug: 'pro', description: 'For growing teams with advanced needs',
      price: { monthly: 29, yearly: 290 }, currency: 'USD',
      features: ['5 Users', '50 GB Storage', '25,000 API Calls/month', '20 Projects', 'Priority Support', 'Analytics'],
      limits: { users: 5, storage: 50, apiCalls: 25000, projects: 20 },
      isPopular: true, color: '#8b5cf6', order: 2,
    },
    {
      name: 'Business', slug: 'business', description: 'For enterprises that need scale and control',
      price: { monthly: 79, yearly: 790 }, currency: 'USD',
      features: ['Unlimited Users', '500 GB Storage', 'Unlimited API Calls', 'Unlimited Projects', '24/7 Support', 'Advanced Analytics', 'Custom Integrations', 'SLA'],
      limits: { users: 999, storage: 500, apiCalls: 999999, projects: 999 },
      color: '#ec4899', order: 3,
    },
  ]);

  console.log('👤 Seeding users...');
  const superadmin = await User.create({
    name: 'Super Admin', email: 'superadmin@billing.dev', password: 'Admin@1234',
    role: 'superadmin', company: 'BillingPortal Inc',
  });
  const admin = await User.create({
    name: 'Admin User', email: 'admin@billing.dev', password: 'Admin@1234',
    role: 'admin', company: 'BillingPortal Inc',
  });
  const billingMgr = await User.create({
    name: 'Billing Manager', email: 'billing@billing.dev', password: 'Admin@1234',
    role: 'billing_manager', company: 'BillingPortal Inc',
  });
  const user1 = await User.create({
    name: 'Gyana Ranjan', email: 'gyana@example.com', password: 'User@1234',
    role: 'user', company: 'Startup XYZ',
  });
  const user2 = await User.create({
    name: 'Priya Sharma', email: 'priya@example.com', password: 'User@1234',
    role: 'user', company: 'TechCorp',
  });

  console.log('📦 Seeding subscriptions & invoices...');
  const now = new Date();
  const monthEnd = new Date(now); monthEnd.setMonth(monthEnd.getMonth() + 1);
  const yearEnd = new Date(now); yearEnd.setFullYear(yearEnd.getFullYear() + 1);

  const sub1 = await Subscription.create({
    user: user1._id, plan: plans[1]._id, billingCycle: 'monthly', status: 'active',
    currentPeriodStart: now, currentPeriodEnd: monthEnd,
    paymentMethod: { brand: 'visa', last4: '4242', expMonth: 12, expYear: 2026 },
  });
  await User.findByIdAndUpdate(user1._id, { subscription: sub1._id });

  const sub2 = await Subscription.create({
    user: user2._id, plan: plans[2]._id, billingCycle: 'yearly', status: 'active',
    currentPeriodStart: now, currentPeriodEnd: yearEnd,
    paymentMethod: { brand: 'mastercard', last4: '5555', expMonth: 9, expYear: 2027 },
  });
  await User.findByIdAndUpdate(user2._id, { subscription: sub2._id });

  // Create invoices
  await Invoice.create([
    { user: user1._id, subscription: sub1._id, plan: plans[1]._id,
      items: [{ description: 'Pro Plan - monthly', quantity: 1, unitPrice: 29, total: 29 }],
      subtotal: 29, tax: 5.22, taxRate: 18, total: 34.22, status: 'paid', paidAt: now,
      billingPeriodStart: now, billingPeriodEnd: monthEnd },
    { user: user2._id, subscription: sub2._id, plan: plans[2]._id,
      items: [{ description: 'Business Plan - yearly', quantity: 1, unitPrice: 790, total: 790 }],
      subtotal: 790, tax: 142.2, taxRate: 18, total: 932.2, status: 'paid', paidAt: now,
      billingPeriodStart: now, billingPeriodEnd: yearEnd },
  ]);

  console.log('\n✅ Seed complete! Demo credentials:');
  console.log('   superadmin@billing.dev / Admin@1234  (superadmin)');
  console.log('   admin@billing.dev / Admin@1234       (admin)');
  console.log('   billing@billing.dev / Admin@1234     (billing_manager)');
  console.log('   gyana@example.com / User@1234        (user - Pro plan)');
  console.log('   priya@example.com / User@1234        (user - Business plan)');
  process.exit(0);
};

seedData().catch(err => { console.error(err); process.exit(1); });
