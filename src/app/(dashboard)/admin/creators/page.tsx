'use client';

import { useState, useEffect } from 'react';
import { Mail, Trash2, Search, ChevronDown, UserPlus, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from '@/lib/axios';

interface User {
  id: string;
  username: string;
  email: string;
  role: number;
}

// Add interface for new user
interface NewUser {
  email: string;
  username: string;
  password: string;
}

export default function ManageCreatorsPage() {
  const [mounted, setMounted] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState<NewUser>({
    email: '',
    username: '',
    password: ''
  });

  // Update role options
  const roleOptions = [
    { value: 1, label: 'Creator' },
    { value: 2, label: 'Trainee' }
  ];

  // Add mounted effect
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchUsers();
    }
  }, [mounted]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get('/users');
      
      // Filter out users with role 0 (admin)
      const filteredUsers = data.users.filter((user: User) => user.role !== 0);
      
      console.log('Filtered users:', filteredUsers);
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Update getRoleLabel function
  const getRoleLabel = (role: number) => {
    switch (role) {
      case 1:
        return { text: 'Creator', className: 'bg-blue-100 text-blue-800' };
      case 2:
        return { text: 'Trainee', className: 'bg-green-100 text-green-800' };
      default:
        return { text: 'Unknown', className: 'bg-gray-100 text-gray-800' };
    }
  };

  // Update the search filter to maintain the role filtering
  const filteredUsers = users.filter(user => 
    user.role !== 0 && // Ensure admin (role 0) is never shown
    (user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = async (userId: string) => {
    setDeleteUserId(userId);
  };

  const confirmDelete = async () => {
    if (!deleteUserId) return;
    
    try {
      await axios.post(`/delete-user/${deleteUserId}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
      console.error('Error:', error);
    } finally {
      setDeleteUserId(null);
    }
  };

  const handleRoleChange = async (userId: string, newRole: number) => {
    try {
      await axios.post(`/edit-user/${userId}`, {
        new_role: newRole
      });
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      toast.success('User role updated successfully');
      setEditingUserId(null);
    } catch (error) {
      toast.error('Failed to update user role');
      console.error('Error:', error);
    }
  };

  // Update the table row to include role dropdown
  const renderRoleCell = (user: User) => {
    if (editingUserId === user.id) {
      return (
        <div className="relative">
          <select
            value={user.role}
            onChange={(e) => handleRoleChange(user.id, Number(e.target.value))}
            onBlur={() => setEditingUserId(null)}
            className="w-full px-3 py-1.5 text-sm rounded-lg border border-brass-light/20 
              focus:outline-none focus:ring-1 focus:ring-brass-light 
              bg-olive-light/5 text-olive cursor-pointer appearance-none"
            autoFocus
          >
            {roleOptions.map(option => (
              <option 
                key={option.value} 
                value={option.value}
                className="bg-white text-olive-dark py-2"
              >
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-khaki pointer-events-none" />
        </div>
      );
    }

    return (
      <button
        onClick={() => setEditingUserId(user.id)}
        className={`px-3 py-1.5 text-xs font-medium rounded-full flex items-center justify-between space-x-2 
          ${getRoleLabel(user.role).className} hover:bg-opacity-80 transition-colors min-w-[100px]`}
      >
        <span>{getRoleLabel(user.role).text}</span>
        <ChevronDown className="w-3 h-3" />
      </button>
    );
  };

  // Update handleCreateUser
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/signup', newUser);
      if (data.status) {
        toast.success('User created successfully');
        setShowAddModal(false);
        fetchUsers();
        // Reset form
        setNewUser({
          email: '',
          username: '',
          password: ''
        });
      } else {
        toast.error(data.message || 'Failed to create user');
      }
    } catch (error) {
      toast.error('Failed to create user');
      console.error('Error:', error);
    }
  };

  // Update the return statement
  if (!mounted) {
    return null; // or return a loading skeleton
  }

  return (
    <div className="p-6">
      {/* Add button in header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-olive">Manage Users</h1>
          <div className="mt-4 flex items-center space-x-4">
            <div className="max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-khaki w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-brass-light/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-brass-light text-olive-dark"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 bg-brass hover:bg-brass-light text-white rounded-lg transition-colors"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="mt-6">
        {isLoading ? (
          <div className="text-center py-4">
            <p className="text-khaki">Loading users...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-brass-light/20">
                <thead className="bg-olive-light/10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-olive uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-olive uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-olive uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 relative">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-brass-light/20">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-khaki">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-brass-light/20 flex items-center justify-center">
                              <Users className="w-4 h-4 text-brass-light" />
                            </div>
                            <span className="ml-3 text-sm font-medium text-olive">
                              {user.username}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-khaki-dark">
                            <Mail className="w-4 h-4 mr-2" />
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {renderRoleCell(user)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-3">
                            <button 
                              onClick={() => handleDelete(user.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {deleteUserId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-olive mb-4">
              Confirm Delete
            </h3>
            <p className="text-khaki-dark mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteUserId(null)}
                className="px-4 py-2 text-sm font-medium text-khaki hover:text-khaki-dark transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-olive mb-4">
              Create New User
            </h3>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-olive mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white text-olive-dark border border-brass-light/20 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-brass-light/20 focus:border-brass
                    placeholder-khaki/50"
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-olive mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white text-olive-dark border border-brass-light/20 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-brass-light/20 focus:border-brass
                    placeholder-khaki/50"
                  placeholder="Choose a username"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-olive mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white text-olive-dark border border-brass-light/20 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-brass-light/20 focus:border-brass
                    placeholder-khaki/50"
                  placeholder="Enter password"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-khaki hover:text-khaki-dark transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-brass hover:bg-brass-light rounded-lg transition-colors"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
