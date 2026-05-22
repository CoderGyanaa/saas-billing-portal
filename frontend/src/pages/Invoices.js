import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import api from '../services/api';

const fmt = (n) => `$${Number(n || 0).toFixed(2)}`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    api.get(`/invoices/my?page=${page}&limit=10`)
      .then(r => { setInvoices(r.data.data); setPages(r.data.pages); setTotal(r.data.total); })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <AppLayout>
      <div className="page-header d-flex align-items-center justify-content-between">
        <div>
          <h1 className="page-title">My Invoices</h1>
          <p className="page-subtitle">{total} invoice{total !== 1 ? 's' : ''} total</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : invoices.length === 0 ? (
        <div className="card-dark text-center" style={{ padding: '3rem' }}>
          <i className="bi bi-receipt" style={{ fontSize: '3rem', color: 'var(--text-dim)' }} />
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>No invoices yet</p>
          <Link to="/plans" className="btn btn-primary-custom mt-2">Subscribe to a Plan</Link>
        </div>
      ) : (
        <div className="table-dark-custom">
          <table className="table mb-0">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Plan</th>
                <th>Amount</th>
                <th>Tax</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv._id}>
                  <td className="mono" style={{ fontSize: '0.8rem', color: 'var(--primary-light)' }}>{inv.invoiceNumber}</td>
                  <td>{inv.plan?.name || '—'}</td>
                  <td>{fmt(inv.subtotal)}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{fmt(inv.tax)}</td>
                  <td style={{ fontWeight: 700 }}>{fmt(inv.total)}</td>
                  <td><span className={`badge-status badge-${inv.status}`}>{inv.status}</span></td>
                  <td style={{ color: 'var(--text-muted)' }}>{fmtDate(inv.createdAt)}</td>
                  <td>
                    <Link to={`/invoices/${inv._id}`} className="btn btn-sm btn-outline-custom" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pages > 1 && (
            <div className="d-flex justify-content-center gap-2 p-3">
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`btn btn-sm ${p === page ? 'btn-primary-custom' : 'btn-outline-custom'}`}
                  style={{ minWidth: '36px', padding: '0.25rem 0.5rem' }}>{p}</button>
              ))}
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}
