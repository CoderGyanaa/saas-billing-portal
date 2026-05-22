import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AppLayout from '../layouts/AppLayout';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const fmt = (n) => `$${Number(n || 0).toFixed(2)}`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—';

export default function Billing() {
  const [sub, setSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const { refreshUser } = useAuth();

  useEffect(() => {
    api.get('/subscriptions/my').then(r => setSub(r.data.data)).finally(() => setLoading(false));
  }, []);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription?')) return;
    setCancelling(true);
    try {
      await api.put('/subscriptions/cancel');
      toast.success('Subscription cancelled');
      setSub(null);
      await refreshUser();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    } finally { setCancelling(false); }
  };

  if (loading) return <AppLayout><div className="d-flex justify-content-center pt-5"><div className="spinner-border text-primary" /></div></AppLayout>;

  return (
    <AppLayout>
      <div className="page-header">
        <h1 className="page-title">Billing & Subscription</h1>
        <p className="page-subtitle">Manage your plan, payment method, and billing history</p>
      </div>

      {!sub ? (
        <div className="card-dark text-center" style={{ padding: '3rem' }}>
          <i className="bi bi-credit-card" style={{ fontSize: '3rem', color: 'var(--text-dim)' }} />
          <h5 style={{ marginTop: '1rem', color: 'var(--text)' }}>No Active Subscription</h5>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Choose a plan to get started with all features</p>
          <Link to="/plans" className="btn btn-primary-custom mt-2">Browse Plans</Link>
        </div>
      ) : (
        <div className="row g-4">
          {/* Subscription Details */}
          <div className="col-lg-7">
            <div className="card-dark mb-4">
              <div className="d-flex align-items-start justify-content-between mb-3">
                <div>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Active Plan</div>
                  <h4 style={{ fontWeight: 800, color: 'var(--text)', margin: 0 }}>{sub.plan?.name}</h4>
                </div>
                <span className={`badge-status badge-${sub.status}`}>{sub.status}</span>
              </div>
              <div className="row g-3">
                {[
                  { label: 'Billing Cycle', value: sub.billingCycle },
                  { label: 'Price', value: `${fmt(sub.plan?.price?.[sub.billingCycle])} / ${sub.billingCycle === 'monthly' ? 'mo' : 'yr'}` },
                  { label: 'Period Start', value: fmtDate(sub.currentPeriodStart) },
                  { label: 'Next Renewal', value: fmtDate(sub.currentPeriodEnd) },
                ].map(item => (
                  <div key={item.label} className="col-6">
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>{item.label}</div>
                    <div style={{ fontWeight: 600, color: 'var(--text)', textTransform: 'capitalize' }}>{item.value}</div>
                  </div>
                ))}
              </div>
              <div className="d-flex gap-2 mt-4">
                <Link to="/plans" className="btn btn-primary-custom btn-sm">Upgrade Plan</Link>
                <button className="btn btn-sm" style={{ color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '0.4rem 1rem', background: 'rgba(239,68,68,0.08)', fontSize: '0.875rem' }}
                  onClick={handleCancel} disabled={cancelling}>
                  {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="card-dark">
              <h6 style={{ fontWeight: 700, marginBottom: '1rem' }}>Included Features</h6>
              <div className="row g-2">
                {sub.plan?.features?.map(f => (
                  <div key={f} className="col-12 col-sm-6">
                    <div className="feature-item"><i className="bi bi-check-circle-fill" /><span>{f}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="col-lg-5">
            <div className="card-dark mb-4">
              <h6 style={{ fontWeight: 700, marginBottom: '1rem' }}>Payment Method</h6>
              {sub.paymentMethod?.last4 ? (
                <div style={{ background: 'var(--dark-3)', borderRadius: '12px', padding: '1.25rem', border: '1px solid var(--border-light)' }}>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <i className="bi bi-credit-card-2-front" style={{ fontSize: '1.5rem', color: 'var(--primary-light)' }} />
                    <div>
                      <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{sub.paymentMethod.brand}</div>
                      <div className="mono" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>•••• •••• •••• {sub.paymentMethod.last4}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Expires {sub.paymentMethod.expMonth}/{sub.paymentMethod.expYear}
                  </div>
                </div>
              ) : <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No payment method on file</p>}
              <button className="btn btn-outline-custom btn-sm mt-3 w-100">Update Payment Method</button>
            </div>

            {/* Limits */}
            <div className="card-dark">
              <h6 style={{ fontWeight: 700, marginBottom: '1rem' }}>Plan Limits</h6>
              {[
                { label: 'Users', value: sub.plan?.limits?.users, icon: 'bi-people' },
                { label: 'Storage', value: `${sub.plan?.limits?.storage} GB`, icon: 'bi-hdd' },
                { label: 'API Calls/mo', value: sub.plan?.limits?.apiCalls === 999999 ? 'Unlimited' : sub.plan?.limits?.apiCalls?.toLocaleString(), icon: 'bi-lightning' },
                { label: 'Projects', value: sub.plan?.limits?.projects === 999 ? 'Unlimited' : sub.plan?.limits?.projects, icon: 'bi-folder' },
              ].map(l => (
                <div key={l.label} className="d-flex align-items-center justify-content-between py-2" style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}><i className={`bi ${l.icon} me-2`} />{l.label}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{l.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
