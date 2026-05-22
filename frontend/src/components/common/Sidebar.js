import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const SidebarLink = ({ to, icon, label }) => (
  <NavLink to={to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
    <i className={`bi ${icon}`} />{label}
  </NavLink>
);

export default function Sidebar() {
  const { user, logout, isAdmin, isBillingManager } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); toast.info('Logged out'); navigate('/login'); };
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-name">⚡ BillingOS</div>
        <div className="brand-sub">SaaS Portal v1.0</div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Main</div>
        <SidebarLink to="/dashboard" icon="bi-grid-1x2" label="Dashboard" />
        <SidebarLink to="/billing" icon="bi-credit-card" label="Billing" />
        <SidebarLink to="/invoices" icon="bi-receipt" label="Invoices" />
        <SidebarLink to="/plans" icon="bi-grid-3x3-gap" label="Plans" />
        <SidebarLink to="/profile" icon="bi-person-circle" label="Profile" />

        {isBillingManager && (
          <>
            <div className="nav-section-label" style={{ marginTop: '0.75rem' }}>Management</div>
            {isAdmin && <SidebarLink to="/admin" icon="bi-speedometer2" label="Admin Dashboard" />}
            {isAdmin && <SidebarLink to="/admin/users" icon="bi-people" label="Users" />}
            {isAdmin && <SidebarLink to="/admin/plans" icon="bi-layers" label="Manage Plans" />}
            <SidebarLink to="/admin/subscriptions" icon="bi-arrow-repeat" label="Subscriptions" />
            <SidebarLink to="/admin/invoices" icon="bi-file-earmark-text" label="All Invoices" />
          </>
        )}
      </nav>

      <div className="sidebar-user">
        <div className="user-avatar">{initials}</div>
        <div className="user-info" style={{ flex: 1, minWidth: 0 }}>
          <div className="user-name text-truncate">{user?.name}</div>
          <div className="user-role">{user?.role?.replace('_', ' ')}</div>
        </div>
        <button onClick={handleLogout} className="btn btn-sm p-1" style={{ color: 'var(--text-dim)', background: 'none', border: 'none' }} title="Logout">
          <i className="bi bi-box-arrow-right" />
        </button>
      </div>
    </aside>
  );
}
