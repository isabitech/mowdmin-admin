'use client';

import { useState, useEffect } from 'react';
import { authService } from '@/services/authService';
import { AdminUser } from '@/constant/types';
import UserTableRow from '@/components/users/UserTableRow';
import EditUserModal from '@/components/users/EditUserModal';

export default function UsersList() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await authService.getAdminUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePromoteUser = async (userId: string) => {
    try {
      await authService.promoteUser(userId);
      await fetchUsers(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user privileges');
    }
  };

  const handleTriggerOtp = async (userId: string) => {
    try {
      await authService.triggerUserOtp(userId);
      alert('Password reset OTP sent to user\'s email');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to trigger OTP');
    }
  };

  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (userData: any) => {
    if (!editingUser) return;
    
    try {
      await authService.updateUser(editingUser.id, userData);
      setIsEditModalOpen(false);
      setEditingUser(null);
      await fetchUsers(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage all users, promote admin privileges, and handle user accounts.
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
          <button 
            onClick={() => setError('')}
            className="ml-2 text-red-400 hover:text-red-600"
          >
            ×
          </button>
        </div>
      )}

      <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          {users.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No users found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <UserTableRow
                      key={user.id}
                      user={user}
                      onPromote={() => handlePromoteUser(user.id)}
                      onEdit={() => handleEditUser(user)}
                      onTriggerOtp={() => handleTriggerOtp(user.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit User Modal */}
      <EditUserModal
        user={editingUser}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingUser(null);
        }}
        onSave={handleUpdateUser}
      />
    </div>
  );
}