'use client';

import { Ministry, MINISTRY_TYPE_CONFIG } from '@/constant/ministryTypes';
import { format } from 'date-fns';

interface MinistryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ministry: Ministry;
  onEdit: (ministry: Ministry) => void;
  onDelete: () => void;
}

export default function MinistryDetailsModal({
  isOpen,
  onClose,
  ministry,
  onEdit,
  onDelete,
}: MinistryDetailsModalProps) {
  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{ministry.name}</h2>
              <div className="flex items-center space-x-2 mt-2">
                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                  getStatusColor(ministry.status)
                }`}>
                  {ministry.status}
                </span>
                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                  getPriorityColor(ministry.priority)
                }`}>
                  {ministry.priority} priority
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Type</label>
                    <p className="text-sm text-gray-900 mt-1 capitalize">
                      {MINISTRY_TYPE_CONFIG[ministry.type]?.label || ministry.type}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Primary Contact</label>
                    <p className="text-sm text-gray-900 mt-1">{ministry.contactInfo.primaryContact}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Description</label>
                    <p className="text-sm text-gray-900 mt-1">{ministry.description}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Target Audience</label>
                    <div className="text-sm text-gray-900 mt-1">
                      {ministry.targetAudience ? (
                        <div className="space-y-1">
                          {ministry.targetAudience.gender && (
                            <p>Gender: {ministry.targetAudience.gender}</p>
                          )}
                          {ministry.targetAudience.ageRange && (
                            <p>
                              Age: {ministry.targetAudience.ageRange.min || 'Any'} - {ministry.targetAudience.ageRange.max || 'Any'}
                            </p>
                          )}
                          {ministry.targetAudience.demographics && ministry.targetAudience.demographics.length > 0 && (
                            <p>Demographics: {ministry.targetAudience.demographics.join(', ')}</p>
                          )}
                        </div>
                      ) : (
                        <p>Not specified</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  {ministry.contactInfo.email && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-sm text-gray-900 mt-1">{ministry.contactInfo.email}</p>
                    </div>
                  )}
                  {ministry.contactInfo.phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-sm text-gray-900 mt-1">{ministry.contactInfo.phone}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Goals */}
              {ministry.goals && ministry.goals.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Goals</h3>
                  <div className="space-y-2">
                    {ministry.goals.map((goal, index) => (
                      <div key={goal.id || index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{goal.description}</p>
                          {goal.targetDate && (
                            <p className="text-xs text-gray-500 mt-1">
                              Target: {format(new Date(goal.targetDate), 'MMM d, yyyy')}
                            </p>
                          )}
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>Progress</span>
                              <span>{goal.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${goal.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="ml-3">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                            goal.isCompleted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {goal.isCompleted ? 'Completed' : 'In Progress'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Statistics */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-blue-600">Participants</p>
                    <p className="text-2xl font-semibold text-blue-900 mt-1">
                      {ministry.totalParticipants || 0}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-green-600">Budget</p>
                    <p className="text-2xl font-semibold text-green-900 mt-1">
                      {ministry.budget ? 
                        `${ministry.budget.allocated.toLocaleString()} ${ministry.budget.currency}` : 
                        'Not set'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Activities */}
              {ministry.activities && ministry.activities.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Activities</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {ministry.activities.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        {activity.description && (
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-gray-500">
                            {format(new Date(activity.scheduledDate), 'MMM d, yyyy')}
                          </p>
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                            activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                            activity.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            activity.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {activity.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Timeline</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Created</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {format(new Date(ministry.createdAt), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Updated</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {format(new Date(ministry.updatedAt), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => onEdit(ministry)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Edit Ministry
            </button>
            <button
              onClick={onDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
            >
              Delete Ministry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}