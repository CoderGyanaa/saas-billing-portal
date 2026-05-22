import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', company: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome aboard 🎉');
      navigate('/plans');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div style={{ width: '100%', maxWidth: 440, padding: '1rem' }}>
        <div className="text-center mb-4">
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            <span className="glow-text">BillingOS</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Create your account</p>
        </div>
        <div className="auth-card">
          <form onSubmit={handleSubmit} className="form-dark">
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input className="form-control" placeholder="Gyana Ranjan Sahoo"
                value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-control" placeholder="you@example.com"
                value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Company (optional)</label>
              <input className="form-control" placeholder="Your startup"
                value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />
            </div>
            <div className="mb-4">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" placeholder="Min 6 characters"
                value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required minLength={6} />
            </div>
            <button type="submit" className="btn btn-primary-custom w-100" disabled={loading}>
              {loading ? <><span className="spinner-border spinner-border-sm me-2" />Creating account...</> : 'Create Account'}
            </button>
          </form>
          <p className="text-center mt-3 mb-0" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Have an account? <Link to="/login" style={{ color: 'var(--primary-light)' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
