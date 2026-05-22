import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(['superadmin', 'admin'].includes(user.role) ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  const demoLogin = (email, password) => { setForm({ email, password }); };

  return (
    <div className="auth-page">
      <div style={{ width: '100%', maxWidth: 440, padding: '1rem' }}>
        <div className="text-center mb-4">
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            <span className="glow-text">BillingOS</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Sign in to your portal</p>
        </div>

        <div className="auth-card">
          <form onSubmit={handleSubmit} className="form-dark">
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-control" placeholder="you@example.com"
                value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
            </div>
            <div className="mb-4">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" placeholder="••••••••"
                value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
            </div>
            <button type="submit" className="btn btn-primary-custom w-100" disabled={loading}>
              {loading ? <><span className="spinner-border spinner-border-sm me-2" />Signing in...</> : 'Sign In'}
            </button>
          </form>

          <hr className="divider my-3" />
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Quick Demo Login</div>
          <div className="d-flex flex-wrap gap-2">
            {[
              { label: 'Super Admin', email: 'superadmin@billing.dev', pw: 'Admin@1234' },
              { label: 'Admin', email: 'admin@billing.dev', pw: 'Admin@1234' },
              { label: 'Billing Mgr', email: 'billing@billing.dev', pw: 'Admin@1234' },
              { label: 'User', email: 'gyana@example.com', pw: 'User@1234' },
            ].map(d => (
              <button key={d.email} type="button" className="btn btn-outline-custom btn-sm flex-fill"
                onClick={() => demoLogin(d.email, d.pw)}>
                {d.label}
              </button>
            ))}
          </div>

          <p className="text-center mt-3 mb-0" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            No account? <Link to="/register" style={{ color: 'var(--primary-light)' }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
