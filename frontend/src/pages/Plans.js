import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AppLayout from '../layouts/AppLayout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [billing, setBilling] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(null);
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const currentPlanId = user?.subscription?.plan?._id || user?.subscription?.plan;

  useEffect(() => {
    api.get('/plans').then(r => setPlans(r.data.data)).finally(() => setLoading(false));
  }, []);

  const handleSubscribe = async (plan) => {
    if (!user) { navigate('/register'); return; }
    setSubscribing(plan._id);
    try {
      await api.post('/subscriptions', { planId: plan._id, billingCycle: billing });
      await refreshUser();
      toast.success(`🎉 Subscribed to ${plan.name} plan!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Subscription failed');
    } finally { setSubscribing(null); }
  };

  const getYearlySaving = (plan) => {
    const monthlyTotal = plan.price.monthly * 12;
    const saving = monthlyTotal - plan.price.yearly;
    return saving > 0 ? Math.round((saving / monthlyTotal) * 100) : 0;
  };

  return (
    <AppLayout>
      <div className="page-header text-center" style={{ marginBottom: '3rem' }}>
        <h1 className="page-title" style={{ fontSize: '2.25rem' }}>
          Simple, <span className="glow-text">Transparent</span> Pricing
        </h1>
        <p className="page-subtitle" style={{ fontSize: '1rem' }}>Start free, scale as you grow</p>
        
        {/* Billing Toggle */}
        <div className="d-inline-flex align-items-center gap-2 mt-3 p-1" style={{ background: 'var(--dark-3)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          {['monthly', 'yearly'].map(b => (
            <button key={b} onClick={() => setBilling(b)}
              className="btn btn-sm"
              style={{
                borderRadius: '8px', padding: '0.4rem 1.25rem', fontSize: '0.8rem', fontWeight: 600,
                background: billing === b ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'transparent',
                color: billing === b ? 'white' : 'var(--text-muted)', border: 'none',
              }}>
              {b.charAt(0).toUpperCase() + b.slice(1)}
              {b === 'yearly' && <span style={{ marginLeft: '0.4rem', fontSize: '0.65rem', background: 'rgba(16,185,129,0.2)', color: '#34d399', padding: '0.1em 0.4em', borderRadius: '4px' }}>Save 20%</span>}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : (
        <div className="row g-4 justify-content-center">
          {plans.map(plan => {
            const isCurrent = currentPlanId === plan._id;
            const price = plan.price[billing];
            const saving = billing === 'yearly' ? getYearlySaving(plan) : 0;
            return (
              <div key={plan._id} className="col-12 col-md-6 col-lg-4">
                <div className={`pricing-card h-100 ${plan.isPopular ? 'popular' : ''}`}>
                  {plan.isPopular && <div className="popular-badge">Most Popular</div>}
                  <div style={{ marginTop: plan.isPopular ? '1rem' : 0 }}>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: plan.color }} />
                      <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 600 }}>{plan.name}</span>
                    </div>
                    <div className="mb-1">
                      <span className="price-amount"><sup>$</sup>{price}</span>
                      <span className="price-period"> / {billing === 'monthly' ? 'mo' : 'yr'}</span>
                    </div>
                    {saving > 0 && <div style={{ fontSize: '0.75rem', color: '#34d399', marginBottom: '0.5rem' }}>Saving {saving}% vs monthly</div>}
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{plan.description}</p>
                    <hr className="divider" />
                    <ul className="list-unstyled my-3">
                      {plan.features.map(f => (
                        <li key={f} className="feature-item">
                          <i className="bi bi-check-circle-fill" />
                          <span style={{ color: 'var(--text)', fontSize: '0.875rem' }}>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      className={`btn w-100 mt-2 ${isCurrent ? 'btn-outline-custom' : 'btn-primary-custom'}`}
                      onClick={() => !isCurrent && handleSubscribe(plan)}
                      disabled={isCurrent || subscribing === plan._id}
                      style={plan.isPopular && !isCurrent ? { background: `linear-gradient(135deg, ${plan.color}, #ec4899)` } : {}}
                    >
                      {subscribing === plan._id ? <><span className="spinner-border spinner-border-sm me-2" />Processing...</> :
                        isCurrent ? '✓ Current Plan' : `Get ${plan.name}`}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}
