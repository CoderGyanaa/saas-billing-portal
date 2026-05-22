import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import api from '../services/api';

const fmt = (n) => `$${Number(n || 0).toFixed(2)}`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—';

export default function InvoiceDetail() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/invoices/${id}`).then(r => setInvoice(r.data.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <AppLayout><div className="d-flex justify-content-center pt-5"><div className="spinner-border text-primary" /></div></AppLayout>;
  if (!invoice) return <AppLayout><div className="text-center pt-5"><h5>Invoice not found</h5><Link to="/invoices" className="btn btn-primary-custom mt-3">Back to Invoices</Link></div></AppLayout>;

  return (
    <AppLayout>
      <div className="page-header d-flex align-items-center justify-content-between">
        <div>
          <Link to="/invoices" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none' }}>← Back to Invoices</Link>
          <h1 className="page-title mt-1">Invoice {invoice.invoiceNumber}</h1>
        </div>
        <span className={`badge-status badge-${invoice.status}`} style={{ fontSize: '0.8rem', padding: '0.4em 1em' }}>{invoice.status.toUpperCase()}</span>
      </div>

      <div className="card-dark" style={{ maxWidth: 720 }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}><span className="glow-text">⚡ BillingOS</span></div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>billing.dev · support@billing.dev</div>
          </div>
          <div className="text-end">
            <div className="mono" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-light)' }}>{invoice.invoiceNumber}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Issued: {fmtDate(invoice.createdAt)}</div>
            {invoice.dueDate && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Due: {fmtDate(invoice.dueDate)}</div>}
          </div>
        </div>

        <hr className="divider" />

        {/* Bill To */}
        <div className="row g-3 mb-4">
          <div className="col-6">
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Bill To</div>
            <div style={{ fontWeight: 600 }}>{invoice.user?.name}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{invoice.user?.email}</div>
            {invoice.user?.company && <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{invoice.user.company}</div>}
          </div>
          <div className="col-6 text-end">
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Billing Period</div>
            <div style={{ fontSize: '0.875rem' }}>{fmtDate(invoice.billingPeriodStart)}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>to {fmtDate(invoice.billingPeriodEnd)}</div>
          </div>
        </div>

        {/* Items */}
        <div className="table-dark-custom mb-4">
          <table className="table mb-0">
            <thead><tr><th>Description</th><th className="text-center">Qty</th><th className="text-end">Unit Price</th><th className="text-end">Total</th></tr></thead>
            <tbody>
              {invoice.items?.map((item, i) => (
                <tr key={i}>
                  <td>{item.description}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-end">{fmt(item.unitPrice)}</td>
                  <td className="text-end" style={{ fontWeight: 600 }}>{fmt(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="ms-auto" style={{ maxWidth: 280 }}>
          {[
            { label: 'Subtotal', value: fmt(invoice.subtotal) },
            { label: `Tax (${invoice.taxRate}%)`, value: fmt(invoice.tax) },
            invoice.discount > 0 && { label: 'Discount', value: `-${fmt(invoice.discount)}` },
          ].filter(Boolean).map(row => (
            <div key={row.label} className="d-flex justify-content-between py-1" style={{ borderBottom: '1px solid var(--border-light)', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
              <span>{row.value}</span>
            </div>
          ))}
          <div className="d-flex justify-content-between pt-2" style={{ fontWeight: 800, fontSize: '1.1rem' }}>
            <span>Total</span>
            <span className="mono" style={{ color: 'var(--primary-light)' }}>{fmt(invoice.total)}</span>
          </div>
        </div>

        {invoice.paidAt && (
          <div className="mt-4 p-3" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', fontSize: '0.875rem' }}>
            <i className="bi bi-check-circle-fill me-2" style={{ color: '#34d399' }} />
            Paid on {fmtDate(invoice.paidAt)}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
