'use client';

import { useState, useEffect } from 'react';
import {
  useUsers,
  useUpdateUser,
  usePromoteUser,
  useTriggerOtp,
} from '@/hooks/useUsers';
import { AdminUserSchema, UpdateUserSchema } from '@/services/userSchemas';
import UserTableRow from '@/components/users/UserTableRow';
import EditUserModal from '@/components/users/EditUserModal';

export default function UsersList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [editingUser, setEditingUser] = useState<AdminUserSchema | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const limit = 10;

  /* ---------------- debounce ---------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  /* ---------------- reset page on search ---------------- */
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  /* ---------------- fetch ---------------- */
  const { data: response, isLoading } = useUsers({
    page,
    limit,
    search: debouncedSearch,
  });

  const users = response?.data ?? [];
  const total = response?.total ?? 0;
  const hasMore = page * limit < total;

  const updateUserMutation = useUpdateUser();
  const promoteUserMutation = usePromoteUser();
  const triggerOtpMutation = useTriggerOtp();

  /* ---------------- handlers ---------------- */
  const handleEditUser = (user: AdminUserSchema) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (userData: UpdateUserSchema) => {
    if (!editingUser) return;

    await updateUserMutation.mutateAsync({
      userId: editingUser._id,
      data: userData,
    });

    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  /* ---------------- loading ---------------- */
  if (isLoading) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Users Management
        </h1>

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white border rounded-lg overflow-hidden">
        {users.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-gray-500">No users found</p>
            <button
              onClick={() => setSearch('')}
              className="mt-3 text-sm text-gray-700"
            >
              Clear search
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Last Login</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {users.map((user) => (
                <UserTableRow
                  key={user._id}
                  user={user}
                  onPromote={() => promoteUserMutation.mutate(user._id)}
                  onEdit={() => handleEditUser(user)}
                  onTriggerOtp={() => triggerOtpMutation.mutate(user._id)}
                />
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination (SMART NEXT/PREV ONLY) */}
        <div className="flex items-center justify-center gap-4 p-4 border-t bg-gray-50">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-gray-900 border border-gray-300 rounded-md bg-white text-sm hover:bg-gray-100 disabled:opacity-50"
          >
            ← Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {page}
          </span>

          <button
            onClick={() => {
              if (!hasMore) return;
              setPage((p) => p + 1);
            }}
            disabled={!hasMore}
            className="px-4 py-2 border text-gray-900 border-gray-300 rounded-md bg-white text-sm hover:bg-gray-100 disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Modal */}
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