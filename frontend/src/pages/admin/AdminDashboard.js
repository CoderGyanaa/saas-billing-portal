import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import AppLayout from '../../layouts/AppLayout';
import api from '../../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const fmt = (n) => `$${Number(n || 0).toFixed(2)}`;
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <AppLayout><div className="d-flex justify-content-center pt-5"><div className="spinner-border text-primary" /></div></AppLayout>;

  const chartOpts = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => `$${ctx.raw.toFixed(2)}` } } },
    scales: { x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }, y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', callback: v => `$${v}` } } },
  };

  const barData = {
    labels: stats?.monthlyRevenue?.map(m => MONTHS[m._id.month - 1]) || [],
    datasets: [{ data: stats?.monthlyRevenue?.map(m => m.revenue) || [], backgroundColor: 'rgba(99,102,241,0.7)', borderRadius: 8, borderSkipped: false }],
  };

  const doughnutData = {
    labels: stats?.subsByPlan?.map(p => p.planName) || [],
    datasets: [{ data: stats?.subsByPlan?.map(p => p.count) || [], backgroundColor: ['#6366f1','#8b5cf6','#ec4899'], borderWidth: 0, hoverOffset: 4 }],
  };

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers, icon: 'bi-people', type: 'primary' },
    { label: 'Active Subscriptions', value: stats?.activeSubscriptions, icon: 'bi-arrow-repeat', type: 'success' },
    { label: 'Total Revenue', value: fmt(stats?.totalRevenue), icon: 'bi-currency-dollar', type: 'warning' },
    { label: 'Active Plans', value: stats?.totalPlans, icon: 'bi-layers', type: 'danger' },
  ];

  return (
    <AppLayout>
      <div className="page-header d-flex align-items-center justify-content-between">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Business overview and analytics</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/users" className="btn btn-outline-custom btn-sm">Manage Users</Link>
          <Link to="/admin/plans" className="btn btn-primary-custom btn-sm">Manage Plans</Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        {statCards.map(s => (
          <div key={s.label} className="col-6 col-lg-3">
            <div className={`stat-card ${s.type}`}>
              <div className={`stat-icon ${s.type}`}><i className={`bi ${s.icon}`} /></div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card-dark">
            <h6 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Monthly Revenue</h6>
            {barData.labels.length > 0
              ? <Bar data={barData} options={chartOpts} height={100} />
              : <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No revenue data yet</div>
            }
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card-dark">
            <h6 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Subscriptions by Plan</h6>
            {doughnutData.labels.length > 0 ? (
              <>
                <Doughnut data={doughnutData} options={{ responsive: true, plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 16, font: { family: 'Sora' } } } }, cutout: '65%' }} />
                <div className="mt-3">
                  {stats?.subsByPlan?.map(p => (
                    <div key={p.planName} className="d-flex justify-content-between py-1" style={{ fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{p.planName}</span>
                      <span style={{ fontWeight: 600 }}>{p.count} users</span>
                    </div>
                  ))}
                </div>
              </>
            ) : <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No subscriptions yet</div>}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="row g-3 mt-2">
        {[
          { to: '/admin/users', icon: 'bi-people', label: 'User Management', desc: 'View, edit, and manage all users' },
          { to: '/admin/subscriptions', icon: 'bi-arrow-repeat', label: 'Subscriptions', desc: 'Monitor all active subscriptions' },
          { to: '/admin/invoices', icon: 'bi-file-earmark-text', label: 'Invoice Management', desc: 'Review and manage all invoices' },
          { to: '/admin/plans', icon: 'bi-layers', label: 'Plan Configuration', desc: 'Create and edit pricing plans' },
        ].map(item => (
          <div key={item.to} className="col-6 col-lg-3">
            <Link to={item.to} className="card-dark d-block text-decoration-none" style={{ transition: 'all 0.2s', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-light)'}>
              <i className={`bi ${item.icon}`} style={{ fontSize: '1.5rem', color: 'var(--primary-light)', marginBottom: '0.75rem', display: 'block' }} />
              <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{item.label}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.desc}</div>
            </Link>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
