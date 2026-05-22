import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AppLayout from '../../layouts/AppLayout';
import api from '../../services/api';

const fmt = (n) => `$${Number(n || 0).toFixed(2)}`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString() : '—';

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [total, setTotal] = useState(0);

  const fetchInvoices = async (status = '') => {
    setLoading(true);
    const params = status ? `?status=${status}` : '';
    const r = await api.get(`/invoices${params}`);
    setInvoices(r.data.data); setTotal(r.data.total);
    setLoading(false);
  };

  useEffect(() => { fetchInvoices(statusFilter); }, [statusFilter]);

  const markPaid = async (id, num) => {
    try {
      await api.put(`/invoices/${id}/mark-paid`);
      toast.success(`Invoice ${num} marked as paid`);
      fetchInvoices(statusFilter);
    } catch { toast.error('Failed'); }
  };

  return (
    <AppLayout>
      <div className="page-header d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">All Invoices</h1>
          <p className="page-subtitle">{total} invoices</p>
        </div>
        <div className="form-dark">
          <select className="form-select form-select-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: 'auto' }}>
            <option value="">All</option>
            <option value="paid">Paid</option>
            <option value="open">Open</option>
            <option value="void">Void</option>
          </select>
        </div>
      </div>

      {loading ? <div className="text-center py-5"><div className="spinner-border text-primary" /></div> : (
        <div className="table-dark-custom">
          <table className="table mb-0">
            <thead><tr><th>Invoice #</th><th>Customer</th><th>Plan</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv._id}>
                  <td className="mono" style={{ fontSize: '0.8rem', color: 'var(--primary-light)' }}>{inv.invoiceNumber}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{inv.user?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{inv.user?.company}</div>
                  </td>
                  <td>{inv.plan?.name}</td>
                  <td style={{ fontWeight: 700 }} className="mono">{fmt(inv.total)}</td>
                  <td><span className={`badge-status badge-${inv.status}`}>{inv.status}</span></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{fmtDate(inv.createdAt)}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link to={`/invoices/${inv._id}`} className="btn btn-sm btn-outline-custom" style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem' }}>View</Link>
                      {inv.status === 'open' && (
                        <button className="btn btn-sm" style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', borderRadius: '8px' }}
                          onClick={() => markPaid(inv._id, inv.invoiceNumber)}>Mark Paid</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && <tr><td colSpan={7} className="text-center py-4" style={{ color: 'var(--text-muted)' }}>No invoices found</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </AppLayout>
  );
}
