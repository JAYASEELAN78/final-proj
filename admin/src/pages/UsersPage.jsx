import { useState, useEffect } from 'react';
import { User, Search, Trash2, Shield, Mail, Phone, Calendar, UserCheck, UserX } from 'lucide-react';
import { usersAPI } from '../services/api';
import { useToast } from '../components/common';

const UsersPage = () => {
    const toast = useToast();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });

    useEffect(() => {
        fetchUsers();
    }, [pagination.page, pagination.limit, roleFilter]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await usersAPI.getAll({
                search: searchQuery,
                role: roleFilter,
                page: pagination.page,
                limit: pagination.limit
            });
            const { users, pagination: pagin } = response.data.data;
            setUsers(users || []);
            setPagination(prev => ({
                ...prev,
                total: pagin.total || 0,
                pages: pagin.pages || 0
            }));
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = () => {
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchUsers();
    };

    const handleToggleStatus = async (user) => {
        try {
            await usersAPI.update(user._id, { isActive: !user.isActive });
            toast.success(`User ${user.isActive ? 'deactivated' : 'activated'} successfully`);
            fetchUsers();
        } catch (error) {
            toast.error('Failed to update user status');
        }
    };

    const handleUpdateRole = async (userId, newRole) => {
        try {
            await usersAPI.update(userId, { role: newRole });
            toast.success(`User role updated to ${newRole}`);
            fetchUsers();
        } catch (error) {
            toast.error('Failed to update user role');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await usersAPI.delete(userId);
            toast.success('User deleted successfully');
            fetchUsers();
        } catch (error) {
            toast.error('Failed to delete user');
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.pages) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <User className="text-indigo-600" size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                        <p className="text-sm text-gray-500">Manage registered customers and staff access.</p>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex flex-wrap items-end gap-3">
                    <div className="shrink-0 w-64">
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Search Users</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Name, Email or Phone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/50 outline-none transition"
                            />
                        </div>
                    </div>
                    <div className="shrink-0 w-40">
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Role Filter</label>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/50"
                        >
                            <option value="">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="staff">Staff</option>
                            <option value="customer">Customer</option>
                        </select>
                    </div>

                    <button
                        onClick={handleSearch}
                        disabled={isLoading}
                        className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
                    >
                        <Search size={16} />
                        Filter
                    </button>
                    <button
                        onClick={() => { setSearchQuery(''); setRoleFilter(''); setPagination(p => ({ ...p, page: 1 })); }}
                        className="px-4 py-2 text-gray-500 font-bold rounded-lg hover:bg-gray-100 transition"
                    >
                        Reset
                    </button>
                </div>
            </div>

            {/* Users Grid/List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">User Info</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Role</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Registered</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center">
                                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                        <p className="mt-2 text-gray-500 font-medium">Loading users...</p>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-gray-400 font-medium">
                                        <UserX className="mx-auto mb-2" size={32} />
                                        No users found matching filters.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50/50 transition">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm overflow-hidden">
                                                    {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">{user.name}</div>
                                                    <div className="flex flex-col text-xs text-gray-400">
                                                        <span className="flex items-center gap-1"><Mail size={10} /> {user.email}</span>
                                                        {user.phone && <span className="flex items-center gap-1"><Phone size={10} /> {user.phone}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                                                className={`px-2 py-1 text-xs font-bold rounded border outline-none ${user.role === 'admin' ? 'bg-red-50 text-red-700 border-red-200' :
                                                        user.role === 'staff' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                            'bg-green-50 text-green-700 border-green-200'
                                                    }`}
                                            >
                                                <option value="admin">Admin</option>
                                                <option value="staff">Staff</option>
                                                <option value="customer">Customer</option>
                                            </select>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                                <Calendar size={12} />
                                                {new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleToggleStatus(user)}
                                                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.isActive
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : 'bg-gray-100 text-gray-500'
                                                    }`}
                                            >
                                                {user.isActive ? <UserCheck size={12} /> : <UserX size={12} />}
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleDeleteUser(user._id)}
                                                disabled={user.role === 'admin' && users.filter(u => u.role === 'admin').length <= 1}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-30"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                        <div>Showing {users.length} of {pagination.total} users</div>
                        <div className="flex gap-2">
                            <button
                                disabled={pagination.page === 1}
                                onClick={() => handlePageChange(pagination.page - 1)}
                                className="px-3 py-1 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                                Prev
                            </button>
                            <span className="px-3 py-1 font-bold text-indigo-600">{pagination.page} / {pagination.pages}</span>
                            <button
                                disabled={pagination.page === pagination.pages}
                                onClick={() => handlePageChange(pagination.page + 1)}
                                className="px-3 py-1 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsersPage;
