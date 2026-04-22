'use client';

import { Ministry } from '@/constant/ministryTypes';
import { format } from 'date-fns';

interface MinistryCardProps {
  ministry: Ministry;
  viewMode: 'grid' | 'list';
  isSelected: boolean;
  onSelect: (isSelected: boolean) => void;
  onView: (ministry: Ministry) => void;
  onEdit: (ministry: Ministry) => void;
  onDelete: () => void;
}

export default function MinistryCard({
  ministry,
  viewMode,
  isSelected,
  onSelect,
  onView,
  onEdit,
  onDelete,
}: MinistryCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => {
                e.stopPropagation();
                onSelect(e.target.checked);
              }}
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h3 className="text-sm font-medium text-gray-900">{ministry.name}</h3>
                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ministry.status)
                  }`}>
                  {ministry.status}
                </span>
                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ministry.priority)
                  }`}>
                  {ministry.priority} priority
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{ministry.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <span>Type: {ministry.type}</span>
                <span>Leaders: {ministry.leaders?.map(l => l.name).join(', ') || 'None'}</span>
                <span>Participants: {ministry.totalParticipants || 0}</span>
                <span>Budget: ${ministry.budget?.allocated?.toLocaleString() || 0}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onView(ministry)}
              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
              title="View Details"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button
              onClick={() => onEdit(ministry)}
              className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
              title="Edit Ministry"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="Delete Ministry"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => {
                e.stopPropagation();
                onSelect(e.target.checked);
              }}
              className="w-4 h-4 mt-1 rounded border-gray-200 text-indigo-600 focus:ring-indigo-500 cursor-pointer transition-all"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{ministry.name}</h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{ministry.description}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg ${getStatusColor(ministry.status)
            }`}>
            {ministry.status}
          </span>
          <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg ${getPriorityColor(ministry.priority)
            }`}>
            {ministry.priority} Priority
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-xs text-gray-500">Type</span>
            <p className="text-sm font-medium text-gray-900 capitalize">{ministry.type}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Leaders</span>
            <p className="text-sm font-medium text-gray-900">{ministry.leaders?.map(l => l.name).join(', ') || 'None'}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Participants</span>
            <p className="text-sm font-medium text-gray-900">{ministry.totalParticipants || 0}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Budget</span>
            <p className="text-sm font-medium text-gray-900">${ministry.budget?.allocated?.toLocaleString() || 0}</p>
          </div>
        </div>




      </div>

      {/* Actions */}
      <div className="p-4 pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          {format(new Date(ministry.createdAt), 'MMM d, yyyy')}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onView(ministry)}
            className="px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all"
          >
            Details
          </button>
          <button
            onClick={() => onEdit(ministry)}
            className="px-4 py-2 text-xs font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-all"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}