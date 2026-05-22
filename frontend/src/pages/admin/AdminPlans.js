import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AppLayout from '../../layouts/AppLayout';
import api from '../../services/api';

const EMPTY_PLAN = {
  name: '', slug: '', description: '', price: { monthly: '', yearly: '' },
  features: '', limits: { users: 1, storage: 5, apiCalls: 1000, projects: 3 },
  color: '#6366f1', isPopular: false, order: 0,
};

export default function AdminPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editPlan, setEditPlan] = useState(null);
  const [form, setForm] = useState(EMPTY_PLAN);
  const [saving, setSaving] = useState(false);

  const fetchPlans = async () => {
    setLoading(true);
    const r = await api.get('/plans');
    setPlans(r.data.data);
    setLoading(false);
  };

  useEffect(() => { fetchPlans(); }, []);

  const openCreate = () => { setEditPlan(null); setForm(EMPTY_PLAN); setShowModal(true); };
  const openEdit = (plan) => {
    setEditPlan(plan);
    setForm({ ...plan, features: plan.features.join('\n'), price: { ...plan.price }, limits: { ...plan.limits } });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        features: form.features.split('\n').map(f => f.trim()).filter(Boolean),
        price: { monthly: +form.price.monthly, yearly: +form.price.yearly },
        limits: {
          users: +form.limits.users, storage: +form.limits.storage,
          apiCalls: +form.limits.apiCalls, projects: +form.limits.projects,
        },
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
      };
      if (editPlan) {
        await api.put(`/plans/${editPlan._id}`, payload);
        toast.success('Plan updated!');
      } else {
        await api.post('/plans', payload);
        toast.success('Plan created!');
      }
      setShowModal(false);
      fetchPlans();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save plan');
    } finally { setSaving(false); }
  };

  const deactivatePlan = async (id, name) => {
    if (!window.confirm(`Deactivate "${name}"?`)) return;
    try {
      await api.delete(`/plans/${id}`);
      toast.success(`${name} deactivated`);
      fetchPlans();
    } catch { toast.error('Failed'); }
  };

  const set = (field, val) => setForm(p => ({ ...p, [field]: val }));
  const setNested = (parent, field, val) => setForm(p => ({ ...p, [parent]: { ...p[parent], [field]: val } }));

  return (
    <AppLayout>
      <div className="page-header d-flex align-items-center justify-content-between">
        <div>
          <h1 className="page-title">Plan Management</h1>
          <p className="page-subtitle">Create and configure pricing plans</p>
        </div>
        <button className="btn btn-primary-custom" onClick={openCreate}>
          <i className="bi bi-plus-lg me-1" /> New Plan
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : (
        <div className="row g-4">
          {plans.map(plan => (
            <div key={plan._id} className="col-12 col-md-6 col-lg-4">
              <div className="card-dark h-100" style={{ borderLeft: `3px solid ${plan.color}` }}>
                <div className="d-flex align-items-start justify-content-between mb-3">
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <h5 style={{ fontWeight: 800, margin: 0 }}>{plan.name}</h5>
                      {plan.isPopular && <span style={{ fontSize: '0.65rem', background: 'rgba(99,102,241,0.15)', color: 'var(--primary-light)', padding: '0.2em 0.6em', borderRadius: '20px', border: '1px solid var(--border)' }}>Popular</span>}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>/{plan.slug}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.25rem', fontFamily: 'JetBrains Mono, monospace' }}>${plan.price.monthly}<span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>/mo</span></div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>${plan.price.yearly}/yr</div>
                  </div>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{plan.description}</p>
                <div style={{ marginBottom: '1rem' }}>
                  {plan.features.slice(0, 4).map(f => (
                    <div key={f} className="feature-item" style={{ fontSize: '0.8rem' }}>
                      <i className="bi bi-check-circle-fill" /><span>{f}</span>
                    </div>
                  ))}
                  {plan.features.length > 4 && <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', paddingTop: '0.25rem' }}>+{plan.features.length - 4} more</div>}
                </div>
                <div className="row g-2 mb-3" style={{ fontSize: '0.75rem' }}>
                  {[
                    { label: 'Users', val: plan.limits.users === 999 ? '∞' : plan.limits.users },
                    { label: 'Storage', val: `${plan.limits.storage}GB` },
                    { label: 'API', val: plan.limits.apiCalls === 999999 ? '∞' : `${(plan.limits.apiCalls / 1000).toFixed(0)}K` },
                    { label: 'Projects', val: plan.limits.projects === 999 ? '∞' : plan.limits.projects },
                  ].map(l => (
                    <div key={l.label} className="col-3 text-center" style={{ background: 'var(--dark-3)', borderRadius: '8px', padding: '0.35rem 0' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text)' }}>{l.val}</div>
                      <div style={{ color: 'var(--text-dim)' }}>{l.label}</div>
                    </div>
                  ))}
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-custom btn-sm flex-fill" onClick={() => openEdit(plan)}>
                    <i className="bi bi-pencil me-1" />Edit
                  </button>
                  <button className="btn btn-sm flex-fill" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: '10px', fontSize: '0.875rem' }}
                    onClick={() => deactivatePlan(plan._id, plan.name)}>
                    <i className="bi bi-trash me-1" />Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          {plans.length === 0 && (
            <div className="col-12 text-center py-5">
              <i className="bi bi-layers" style={{ fontSize: '3rem', color: 'var(--text-dim)' }} />
              <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>No plans yet. Create your first plan!</p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'var(--dark-2)', border: '1px solid var(--border-light)', borderRadius: '20px', width: '100%', maxWidth: 620, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h5 style={{ fontWeight: 800, margin: 0 }}>{editPlan ? 'Edit Plan' : 'Create New Plan'}</h5>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.25rem', cursor: 'pointer' }}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="form-dark" style={{ padding: '1.5rem' }}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Plan Name *</label>
                  <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} required placeholder="e.g. Pro" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Slug *</label>
                  <input className="form-control" value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="e.g. pro" />
                </div>
                <div className="col-12">
                  <label className="form-label">Description</label>
                  <input className="form-control" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Short plan description" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Monthly Price ($) *</label>
                  <input type="number" className="form-control" value={form.price.monthly} onChange={e => setNested('price', 'monthly', e.target.value)} required min="0" step="0.01" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Yearly Price ($) *</label>
                  <input type="number" className="form-control" value={form.price.yearly} onChange={e => setNested('price', 'yearly', e.target.value)} required min="0" step="0.01" />
                </div>
                <div className="col-12">
                  <label className="form-label">Features (one per line)</label>
                  <textarea className="form-control" rows={5} value={form.features} onChange={e => set('features', e.target.value)} placeholder={"5 Users\n50 GB Storage\nPriority Support"} />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Max Users</label>
                  <input type="number" className="form-control" value={form.limits.users} onChange={e => setNested('limits', 'users', e.target.value)} min="1" />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Storage (GB)</label>
                  <input type="number" className="form-control" value={form.limits.storage} onChange={e => setNested('limits', 'storage', e.target.value)} min="1" />
                </div>
                <div className="col-md-3">
                  <label className="form-label">API Calls/mo</label>
                  <input type="number" className="form-control" value={form.limits.apiCalls} onChange={e => setNested('limits', 'apiCalls', e.target.value)} min="1" />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Projects</label>
                  <input type="number" className="form-control" value={form.limits.projects} onChange={e => setNested('limits', 'projects', e.target.value)} min="1" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Accent Color</label>
                  <div className="d-flex gap-2 align-items-center">
                    <input type="color" className="form-control form-control-color" value={form.color} onChange={e => set('color', e.target.value)} style={{ width: 60, height: 40, padding: '0.2rem' }} />
                    <input className="form-control" value={form.color} onChange={e => set('color', e.target.value)} />
                  </div>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Display Order</label>
                  <input type="number" className="form-control" value={form.order} onChange={e => set('order', +e.target.value)} min="0" />
                </div>
                <div className="col-md-3 d-flex align-items-end pb-1">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="popular" checked={form.isPopular} onChange={e => set('isPopular', e.target.checked)}
                      style={{ accentColor: 'var(--primary)' }} />
                    <label className="form-check-label" htmlFor="popular" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Mark as Popular</label>
                  </div>
                </div>
              </div>
              <div className="d-flex gap-3 mt-4">
                <button type="submit" className="btn btn-primary-custom flex-fill" disabled={saving}>
                  {saving ? <><span className="spinner-border spinner-border-sm me-2" />{editPlan ? 'Saving...' : 'Creating...'}</> : editPlan ? 'Save Changes' : 'Create Plan'}
                </button>
                <button type="button" className="btn btn-outline-custom" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
