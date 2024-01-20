import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Ban, Search, Plus, X } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { formatDate } from '../utils/formatters';
import Modal from '../components/Modal';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'viewer', status: 'active' });
  const [currentId, setCurrentId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/users?page=${page}&limit=10&role=${roleFilter}&status=${statusFilter}&search=${search}`);
      setUsers(res.data.users);
      setTotalPages(res.data.pages);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, search, roleFilter, statusFilter]);

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'banned' ? 'active' : 'banned';
      await api.patch(`/users/${id}/status`, { status: newStatus });
      toast.success(`User ${newStatus}`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${id}`);
        toast.success('User deleted');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ name: '', email: '', password: '', role: 'viewer', status: 'active' });
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setModalMode('edit');
    setFormData({ name: user.name, email: user.email, role: user.role, status: user.status });
    setCurrentId(user._id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        await api.post('/users', formData);
        toast.success('User created successfully');
      } else {
        await api.put(`/users/${currentId}`, formData);
        toast.success('User updated successfully');
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const roleColors = {
    admin: 'bg-accent-danger/10 text-accent-danger border-accent-danger/20',
    manager: 'bg-accent-primary/10 text-accent-primary border-accent-primary/20',
    viewer: 'bg-gray-500/10 text-gray-500 border-gray-500/20'
  };

  const statusColors = {
    active: 'bg-accent-success/10 text-accent-success border-accent-success/20',
    inactive: 'bg-accent-warning/10 text-accent-warning border-accent-warning/20',
    banned: 'bg-accent-danger/10 text-accent-danger border-accent-danger/20'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-accent-primary hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium">
          <Plus size={16} /> Add User
        </button>
      </div>

      {/* Filters */}
      <div className="card-bg border border-custom p-4 rounded-xl flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-sub" size={18} />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-light-main dark:bg-dark-main border border-custom rounded-lg focus:outline-none focus:border-accent-primary text-sm"
          />
        </div>
        
        <select 
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-light-main dark:bg-dark-main border border-custom rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent-primary"
        >
          <option>All Roles</option>
          <option>Admin</option>
          <option>Manager</option>
          <option>Viewer</option>
        </select>
        
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-light-main dark:bg-dark-main border border-custom rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent-primary"
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
          <option>Banned</option>
        </select>
      </div>

      {/* Table */}
      <div className="card-bg border border-custom rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-light-main dark:bg-dark-main border-b border-custom">
              <tr>
                <th className="px-6 py-4 font-medium w-10">
                  <input type="checkbox" className="rounded border-custom text-accent-primary focus:ring-accent-primary bg-transparent" />
                </th>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-sub">Loading...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-sub">No users found</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="border-b border-custom last:border-0 hover:bg-light-main dark:hover:bg-dark-main transition-colors group">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded border-custom text-accent-primary focus:ring-accent-primary bg-transparent" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-accent-primary/20 text-accent-primary flex items-center justify-center font-bold text-sm shrink-0">
                          {user.avatar}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-sub">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${roleColors[user.role]}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[user.status]}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sub">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditModal(user)} className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors text-sub hover:text-accent-primary">
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => toggleStatus(user._id, user.status)}
                          className={`p-1.5 rounded-md transition-colors ${user.status === 'banned' ? 'bg-accent-success/10 text-accent-success' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-sub hover:text-accent-warning'}`}
                          title={user.status === 'banned' ? 'Unban User' : 'Ban User'}
                        >
                          <Ban size={16} />
                        </button>
                        <button 
                          onClick={() => deleteUser(user._id)}
                          className="p-1.5 hover:bg-accent-danger/10 rounded-md transition-colors text-sub hover:text-accent-danger"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-custom flex items-center justify-between">
            <span className="text-sm text-sub">Showing page {page} of {totalPages}</span>
            <div className="flex gap-1">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-custom rounded-md text-sm hover:bg-light-main dark:hover:bg-dark-main disabled:opacity-50"
              >
                Previous
              </button>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border border-custom rounded-md text-sm hover:bg-light-main dark:hover:bg-dark-main disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'add' ? 'Add New User' : 'Edit User'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-sub mb-1">Full Name</label>
            <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 bg-light-main dark:bg-dark-main border border-custom rounded-lg focus:outline-none focus:border-accent-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-sub mb-1">Email Address</label>
            <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 bg-light-main dark:bg-dark-main border border-custom rounded-lg focus:outline-none focus:border-accent-primary" />
          </div>
          {modalMode === 'add' && (
            <div>
              <label className="block text-sm font-medium text-sub mb-1">Password</label>
              <input required type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-3 py-2 bg-light-main dark:bg-dark-main border border-custom rounded-lg focus:outline-none focus:border-accent-primary" />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-sub mb-1">Role</label>
              <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full px-3 py-2 bg-light-main dark:bg-dark-main border border-custom rounded-lg focus:outline-none focus:border-accent-primary">
                <option value="viewer">Viewer</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-sub mb-1">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 bg-light-main dark:bg-dark-main border border-custom rounded-lg focus:outline-none focus:border-accent-primary">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="banned">Banned</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-custom">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-dark-main rounded-lg transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium bg-accent-primary text-white hover:bg-blue-600 rounded-lg transition-colors">
              {modalMode === 'add' ? 'Create User' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UsersPage;
