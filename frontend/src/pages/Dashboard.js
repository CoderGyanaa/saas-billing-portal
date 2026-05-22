import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const fmt = (n) => `$${Number(n || 0).toFixed(2)}`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

export default function Dashboard() {
  const { user } = useAuth();
  const [billing, setBilling] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/billing/summary'),
      api.get('/invoices/my?limit=5'),
    ]).then(([b, i]) => {
      setBilling(b.data.data);
      setInvoices(i.data.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <AppLayout><div className="d-flex justify-content-center pt-5"><div className="spinner-border text-primary" /></div></AppLayout>;

  const sub = billing?.subscription;
  const plan = sub?.plan;
  const daysLeft = sub ? Math.ceil((new Date(sub.currentPeriodEnd) - new Date()) / 86400000) : 0;

  return (
    <AppLayout>
      <div className="page-header">
        <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="page-subtitle">Here's your billing overview</p>
      </div>

      {/* Subscription Banner */}
      {sub ? (
        <div className="card-dark mb-4" style={{ borderLeft: `3px solid ${plan?.color || 'var(--primary)'}` }}>
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Current Plan</div>
              <div className="d-flex align-items-center gap-2">
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)' }}>{plan?.name}</span>
                <span className={`badge-status badge-${sub.status}`}>{sub.status}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {sub.billingCycle} · Renews {fmtDate(sub.currentPeriodEnd)} · {daysLeft} days left
              </div>
            </div>
            <div className="d-flex gap-2">
              <Link to="/plans" className="btn btn-primary-custom btn-sm">Upgrade Plan</Link>
              <Link to="/billing" className="btn btn-outline-custom btn-sm">Manage</Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="card-dark mb-4 text-center" style={{ padding: '2rem' }}>
          <i className="bi bi-grid-3x3-gap" style={{ fontSize: '2rem', color: 'var(--text-dim)' }} />
          <p style={{ margin: '0.75rem 0 1rem', color: 'var(--text-muted)' }}>You don't have an active subscription yet.</p>
          <Link to="/plans" className="btn btn-primary-custom">Choose a Plan</Link>
        </div>
      )}

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total Spent', value: fmt(billing?.totalSpent), icon: 'bi-currency-dollar', type: 'primary' },
          { label: 'Total Invoices', value: billing?.invoiceCount || 0, icon: 'bi-receipt', type: 'success' },
          { label: 'Current Plan', value: plan?.name || 'None', icon: 'bi-layers', type: 'warning' },
          { label: 'Days Remaining', value: sub ? daysLeft : '—', icon: 'bi-calendar3', type: 'danger' },
        ].map((s) => (
          <div key={s.label} className="col-6 col-lg-3">
            <div className={`stat-card ${s.type}`}>
              <div className={`stat-icon ${s.type}`}><i className={`bi ${s.icon}`} /></div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Plan Limits */}
      {plan?.limits && (
        <div className="card-dark mb-4">
          <h6 style={{ fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text)' }}>Plan Limits</h6>
          <div className="row g-3">
            {[
              { label: 'Users', val: plan.limits.users, max: plan.limits.users, icon: 'bi-people' },
              { label: 'Storage (GB)', val: plan.limits.storage, max: plan.limits.storage, icon: 'bi-hdd' },
              { label: 'API Calls', val: plan.limits.apiCalls, max: plan.limits.apiCalls, icon: 'bi-lightning' },
              { label: 'Projects', val: plan.limits.projects, max: plan.limits.projects, icon: 'bi-folder' },
            ].map(item => (
              <div key={item.label} className="col-6 col-md-3">
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  <i className={`bi ${item.icon} me-1`} />{item.label}
                </div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>
                  {item.val === 999 ? 'Unlimited' : item.val.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Invoices */}
      <div className="card-dark">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h6 style={{ fontWeight: 700, margin: 0 }}>Recent Invoices</h6>
          <Link to="/invoices" style={{ fontSize: '0.8rem', color: 'var(--primary-light)', textDecoration: 'none' }}>View all →</Link>
        </div>
        {invoices.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem 0' }}>No invoices yet</p>
        ) : (
          <div className="table-dark-custom">
            <table className="table mb-0">
              <thead><tr><th>Invoice</th><th>Amount</th><th>Status</th><th>Date</th><th></th></tr></thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv._id}>
                    <td className="mono" style={{ fontSize: '0.8rem' }}>{inv.invoiceNumber}</td>
                    <td style={{ fontWeight: 600 }}>{fmt(inv.total)}</td>
                    <td><span className={`badge-status badge-${inv.status}`}>{inv.status}</span></td>
                    <td style={{ color: 'var(--text-muted)' }}>{fmtDate(inv.createdAt)}</td>
                    <td><Link to={`/invoices/${inv._id}`} style={{ color: 'var(--primary-light)', fontSize: '0.8rem' }}>View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
