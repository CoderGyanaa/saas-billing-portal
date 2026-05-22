import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dark)', flexDirection: 'column', textAlign: 'center', padding: '2rem' }}>
      <div style={{ fontSize: '6rem', fontWeight: 900, fontFamily: 'JetBrains Mono, monospace', background: 'linear-gradient(135deg, var(--primary-light), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>404</div>
      <h2 style={{ marginTop: '1rem', fontWeight: 700, color: 'var(--text)' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>The page you're looking for doesn't exist or you don't have access.</p>
      <Link to="/dashboard" className="btn btn-primary-custom">Go to Dashboard</Link>
    </div>
  );
}
