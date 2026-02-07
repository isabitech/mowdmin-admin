'use client';

import { AdminUser } from '../../constant/types';

interface UserTableRowProps {
  user: AdminUser;
  onPromote: () => void;
  onEdit: () => void;
  onTriggerOtp: () => void;
}

export default function UserTableRow({ user, onPromote, onEdit, onTriggerOtp }: UserTableRowProps) {
  const getStatusBadge = (status: string) => {
    const statusColors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800',
    };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const getRoleBadge = (isAdmin: boolean) => {
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        isAdmin 
          ? 'bg-purple-100 text-purple-800' 
          : 'bg-blue-100 text-blue-800'
      }`}>
        {isAdmin ? 'Admin' : 'User'}
      </span>
    );
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-sm font-medium text-indigo-700">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getStatusBadge(user.status || 'active')}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getRoleBadge(user.isAdmin)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatDate(user.lastLogin)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Edit
          </button>
          <button
            onClick={onPromote}
            className="text-purple-600 hover:text-purple-900"
          >
            {user.isAdmin ? 'Demote' : 'Promote'}
          </button>
          <button
            onClick={onTriggerOtp}
            className="text-yellow-600 hover:text-yellow-900"
          >
            Reset Password
          </button>
        </div>
      </td>
    </tr>
  );
}