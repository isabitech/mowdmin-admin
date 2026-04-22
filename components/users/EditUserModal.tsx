'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AdminUserSchema, UpdateUserSchema } from '@/services/userSchemas';

interface EditUserModalProps {
  user: AdminUserSchema | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: UpdateUserSchema) => void;
  loading?: boolean;
}

export default function EditUserModal({ user, isOpen, onClose, onSave, loading }: EditUserModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UpdateUserSchema>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      name: '',
      email: '',
      isAdmin: false,
      status: 'active',
    }
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
        isAdmin: user.isAdmin || false,
        status: user.status || 'active',
      });
    }
  }, [user, reset]);

  const onFormSubmit = (data: UpdateUserSchema) => {
    onSave(data);
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/40 overflow-y-auto h-full w-full z-[100] flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-md shadow-xl rounded-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
          <h3 className="text-base font-semibold text-gray-900">Edit User Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-50 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-5">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                {...register('name')}
                className={`block w-full px-3 py-2 text-gray-700 bg-white border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all shadow-sm`}
                disabled={loading}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className={`block w-full px-3 py-2 text-gray-700 bg-white border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all shadow-sm`}
                disabled={loading}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="status" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                Account Status
              </label>
              <select
                id="status"
                {...register('status')}
                className="block w-full px-3 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all shadow-sm appearance-none cursor-pointer"
                disabled={loading}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-lg">
              <input
                id="isAdmin"
                type="checkbox"
                {...register('isAdmin')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-600 border-gray-300 rounded cursor-pointer"
                disabled={loading}
              />
              <label htmlFor="isAdmin" className="text-sm font-medium text-gray-700 cursor-pointer">
                Administrator Privileges
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm transition-all"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}