import React, { useState } from 'react';
import { toast } from 'react-toastify';
import AppLayout from '../layouts/AppLayout';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', company: user?.company || '', phone: user?.phone || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const handleProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/auth/profile', form);
      await refreshUser();
      toast.success('Profile updated!');
    } catch (err) { toast.error('Failed to update'); } finally { setSaving(false); }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) { toast.error('Passwords do not match'); return; }
    setSavingPw(true);
    try {
      await api.put('/auth/change-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password updated!');
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } finally { setSavingPw(false); }
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <AppLayout>
      <div className="page-header">
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">Manage your personal information and account settings</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card-dark text-center">
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 800, color: 'white', margin: '0 auto 1rem' }}>{initials}</div>
            <h5 style={{ fontWeight: 700 }}>{user?.name}</h5>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{user?.email}</p>
            <span className={`role-pill role-${user?.role}`}>{user?.role?.replace('_', ' ')}</span>
            {user?.company && <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}><i className="bi bi-building me-1" />{user.company}</p>}
            <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Member since {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card-dark mb-4">
            <h6 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Personal Information</h6>
            <form onSubmit={handleProfile} className="form-dark">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Full Name</label>
                  <input className="form-control" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Company</label>
                  <input className="form-control" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input className="form-control" value={user?.email} disabled style={{ opacity: 0.5 }} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone</label>
                  <input className="form-control" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary-custom mt-3" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          <div className="card-dark">
            <h6 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Change Password</h6>
            <form onSubmit={handlePassword} className="form-dark">
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Current Password</label>
                  <input type="password" className="form-control" value={pwForm.currentPassword} onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">New Password</label>
                  <input type="password" className="form-control" value={pwForm.newPassword} onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))} required minLength={6} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Confirm Password</label>
                  <input type="password" className="form-control" value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} required />
                </div>
              </div>
              <button type="submit" className="btn btn-primary-custom mt-3" disabled={savingPw}>
                {savingPw ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
