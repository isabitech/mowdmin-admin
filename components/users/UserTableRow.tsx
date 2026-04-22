'use client';

import { useState, useRef, useEffect } from 'react';
import { AdminUserSchema } from '@/services/userSchemas';

interface UserTableRowProps {
  user: AdminUserSchema;
  onPromote: () => void;
  onEdit: () => void;
  onTriggerOtp: () => void;
}

export default function UserTableRow({ user, onPromote, onEdit, onTriggerOtp }: UserTableRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string, text: string, dot: string, border: string }> = {
      active: {
        bg: 'bg-emerald-50/50',
        text: 'text-emerald-700',
        dot: 'bg-emerald-500',
        border: 'border-emerald-100'
      },
      inactive: {
        bg: 'bg-gray-50',
        text: 'text-gray-600',
        dot: 'bg-gray-400',
        border: 'border-gray-200'
      },
      suspended: {
        bg: 'bg-rose-50/50',
        text: 'text-rose-700',
        dot: 'bg-rose-500',
        border: 'border-rose-100'
      },
    };

    const config = statusConfig[status] || statusConfig.inactive;

    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-md border ${config.bg} ${config.text} ${config.border}`}>
        <span className={`h-1 w-1 rounded-full ${config.dot}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getRoleBadge = (isAdmin: boolean) => {
    return isAdmin ? (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-md bg-indigo-50/50 text-indigo-700 border border-indigo-100">
        Admin
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-md bg-gray-50 text-gray-600 border border-gray-200">
        User
      </span>
    );
  };

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <tr className="hover:bg-gray-50/50 transition-colors cursor-default">
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
            <span className="text-xs font-semibold text-gray-600">
              {user.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-base font-medium text-gray-900 truncate">{user.name}</span>
            <span className="text-sm text-gray-500 truncate">{user.email}</span>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        {getStatusBadge(user.status || 'active')}
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        {getRoleBadge(user.isAdmin)}
      </td>
      <td className="pl-4 pr-1 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(user.lastLogin)}
      </td>
      <td className="pl-1 pr-4 py-4 whitespace-nowrap">
        <div className="relative inline-block text-left" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-gray-200"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 z-20 mt-1.5 w-44 rounded-lg shadow-lg bg-white border border-gray-200 py-1 animate-in fade-in zoom-in-95 duration-100">
              <button
                onClick={() => { onEdit(); setMenuOpen(false); }}
                className="flex items-center w-full px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="mr-2 h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                Edit Profile
              </button>
              <button
                onClick={() => { onPromote(); setMenuOpen(false); }}
                className="flex items-center w-full px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="mr-2 h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                {user.isAdmin ? 'Revoke Admin' : 'Assign Admin'}
              </button>
              <div className="my-1 border-t border-gray-100" />
              <button
                onClick={() => { onTriggerOtp(); setMenuOpen(false); }}
                className="flex items-center w-full px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <svg className="mr-2 h-3.5 w-3.5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                Reset Password
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}