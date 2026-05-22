import React, { useState, useEffect } from 'react';
import AppLayout from '../../layouts/AppLayout';
import api from '../../services/api';

const fmt = (n) => `$${Number(n || 0).toFixed(2)}`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString() : '—';

export default function AdminSubscriptions() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    const params = statusFilter ? `?status=${statusFilter}` : '';
    api.get(`/subscriptions${params}`).then(r => { setSubs(r.data.data); setTotal(r.data.total); }).finally(() => setLoading(false));
  }, [statusFilter]);

  return (
    <AppLayout>
      <div className="page-header d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Subscriptions</h1>
          <p className="page-subtitle">{total} subscriptions</p>
        </div>
        <div className="form-dark">
          <select className="form-select form-select-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: 'auto' }}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="cancelled">Cancelled</option>
            <option value="past_due">Past Due</option>
          </select>
        </div>
      </div>

      {loading ? <div className="text-center py-5"><div className="spinner-border text-primary" /></div> : (
        <div className="table-dark-custom">
          <table className="table mb-0">
            <thead><tr><th>User</th><th>Plan</th><th>Cycle</th><th>Price</th><th>Status</th><th>Renews</th></tr></thead>
            <tbody>
              {subs.map(s => (
                <tr key={s._id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{s.user?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.user?.email}</div>
                    {s.user?.company && <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{s.user.company}</div>}
                  </td>
                  <td style={{ fontWeight: 600 }}>{s.plan?.name}</td>
                  <td style={{ textTransform: 'capitalize', color: 'var(--text-muted)' }}>{s.billingCycle}</td>
                  <td className="mono">{fmt(s.plan?.price?.[s.billingCycle])}</td>
                  <td><span className={`badge-status badge-${s.status}`}>{s.status}</span></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{fmtDate(s.currentPeriodEnd)}</td>
                </tr>
              ))}
              {subs.length === 0 && <tr><td colSpan={6} className="text-center py-4" style={{ color: 'var(--text-muted)' }}>No subscriptions found</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </AppLayout>
  );
}
