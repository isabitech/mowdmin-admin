'use client';

import { PrayerRequest } from '@/constant/prayerTypes';

interface PrayerRequestCardProps {
  request: PrayerRequest;
  onStatusUpdate: (id: string, status: PrayerRequest['status']) => void;
}

export default function PrayerRequestCard({ request, onStatusUpdate }: PrayerRequestCardProps) {
  const getStatusBadge = (status: PrayerRequest['status']) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      answered: 'bg-blue-100 text-blue-800',
      archived: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {request.title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {request.description}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {getStatusBadge(request.status)}
          {request.isAnonymous && (
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
              Anonymous
            </span>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div>
            {request.isAnonymous ? (
              <span>Anonymous request</span>
            ) : (
              <span>By {request.user?.name || 'Unknown'}</span>
            )}
          </div>
          <div>
            {formatDate(request.createdAt)}
          </div>
        </div>

        {request.status === 'pending' && (
          <div className="flex space-x-2 mt-4">
            <button
              onClick={() => onStatusUpdate(request.id, 'approved')}
              className="flex-1 bg-green-50 text-green-700 hover:bg-green-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Approve
            </button>
            <button
              onClick={() => onStatusUpdate(request.id, 'archived')}
              className="flex-1 bg-gray-50 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Archive
            </button>
          </div>
        )}

        {request.status === 'approved' && (
          <div className="flex space-x-2 mt-4">
            <button
              onClick={() => onStatusUpdate(request.id, 'answered')}
              className="flex-1 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Mark as Answered
            </button>
            <button
              onClick={() => onStatusUpdate(request.id, 'archived')}
              className="flex-1 bg-gray-50 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Archive
            </button>
          </div>
        )}

        {(request.status === 'answered' || request.status === 'archived') && (
          <div className="mt-4">
            <button
              onClick={() => onStatusUpdate(request.id, 'pending')}
              className="w-full bg-gray-50 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Reopen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}