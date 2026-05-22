import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import AppLayout from '../../layouts/AppLayout';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const fmtDate = (d) => d ? new Date(d).toLocaleDateString() : '—';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [total, setTotal] = useState(0);
  const { isSuperAdmin } = useAuth();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: 50 });
    if (search) params.append('search', search);
    if (roleFilter) params.append('role', roleFilter);
    const r = await api.get(`/admin/users?${params}`);
    setUsers(r.data.data);
    setTotal(r.data.total);
    setLoading(false);
  }, [search, roleFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const toggleActive = async (userId, name) => {
    try {
      const r = await api.put(`/admin/users/${userId}/toggle-active`);
      toast.success(`${name} ${r.data.data.isActive ? 'activated' : 'deactivated'}`);
      fetchUsers();
    } catch { toast.error('Failed'); }
  };

  const changeRole = async (userId, role, name) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role });
      toast.success(`${name}'s role updated to ${role}`);
      fetchUsers();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <AppLayout>
      <div className="page-header d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">{total} users total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card-dark mb-4">
        <div className="row g-3">
          <div className="col-md-8">
            <div className="form-dark">
              <input className="form-control" placeholder="Search by name or email..." value={search}
                onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-dark">
              <select className="form-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                <option value="">All Roles</option>
                <option value="user">User</option>
                <option value="billing_manager">Billing Manager</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : (
        <div className="table-dark-custom">
          <table className="table mb-0">
            <thead>
              <tr><th>User</th><th>Role</th><th>Plan</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{u.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
                    {u.company && <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{u.company}</div>}
                  </td>
                  <td>
                    {isSuperAdmin && u.role !== 'superadmin' ? (
                      <div className="form-dark">
                        <select className="form-select form-select-sm" value={u.role}
                          onChange={e => changeRole(u._id, e.target.value, u.name)}
                          style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', width: 'auto' }}>
                          <option value="user">User</option>
                          <option value="billing_manager">Billing Manager</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    ) : <span className={`role-pill role-${u.role}`}>{u.role?.replace('_', ' ')}</span>}
                  </td>
                  <td>{u.subscription?.plan?.name ? <span style={{ fontWeight: 600 }}>{u.subscription.plan.name}</span> : <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>None</span>}</td>
                  <td>
                    <span className={`badge-status ${u.isActive ? 'badge-active' : 'badge-cancelled'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{fmtDate(u.createdAt)}</td>
                  <td>
                    {u.role !== 'superadmin' && (
                      <button className={`btn btn-sm ${u.isActive ? '' : ''}`}
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '8px', border: `1px solid ${u.isActive ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`, color: u.isActive ? '#f87171' : '#34d399', background: u.isActive ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)' }}
                        onClick={() => toggleActive(u._id, u.name)}>
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <div className="text-center py-4" style={{ color: 'var(--text-muted)' }}>No users found</div>}
        </div>
      )}
    </AppLayout>
  );
}
