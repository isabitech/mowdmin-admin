'use client';

import { Group, GROUP_TYPE_CONFIG, GROUP_STATUS_CONFIG } from '@/constant/groupTypes';

interface GroupDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group;
  onEdit: (group: Group) => void;
  onDelete: () => void;
}

export default function GroupDetailsModal({ isOpen, onClose, group, onEdit, onDelete }: GroupDetailsModalProps) {
  if (!isOpen) return null;

  const typeConfig = GROUP_TYPE_CONFIG[group.type];
  const statusConfig = GROUP_STATUS_CONFIG[group.status];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{group.name}</h3>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
                <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${typeConfig.color}`}>
                  {typeConfig.icon} {typeConfig.label}
                </span>
                {group.isPublic && (
                  <span className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    Public
                  </span>
                )}
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">About</h4>
                <p className="text-sm text-gray-600">{group.description}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Group Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Members:</span>
                    <span className="text-sm text-gray-900">
                      {group.currentMemberCount}{group.maxMembers && `/${group.maxMembers}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Leaders:</span>
                    <span className="text-sm text-gray-900">{group.leaders.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Created:</span>
                    <span className="text-sm text-gray-900">{formatDate(group.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Last Updated:</span>
                    <span className="text-sm text-gray-900">{formatDate(group.updatedAt)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Meeting Schedule</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Frequency:</span>
                    <span className="text-sm text-gray-900">
                      {group.meetingSchedule.frequency.replace('_', ' ')}
                    </span>
                  </div>
                  {group.meetingSchedule.dayOfWeek && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Day:</span>
                      <span className="text-sm text-gray-900">
                        {group.meetingSchedule.dayOfWeek.charAt(0).toUpperCase() + group.meetingSchedule.dayOfWeek.slice(1)}
                      </span>
                    </div>
                  )}
                  {group.meetingSchedule.timeOfDay && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Time:</span>
                      <span className="text-sm text-gray-900">{group.meetingSchedule.timeOfDay}</span>
                    </div>
                  )}
                  {group.meetingSchedule.location && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Location:</span>
                      <span className="text-sm text-gray-900">{group.meetingSchedule.location}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Format:</span>
                    <span className="text-sm text-gray-900">
                      {group.meetingSchedule.isVirtual ? 'Virtual' : 'In-Person'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Contact Information</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Primary Contact:</span>
                    <p className="text-sm text-gray-900">{group.contactInfo.primaryContact}</p>
                  </div>
                  {group.contactInfo.email && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Email:</span>
                      <p className="text-sm text-gray-900">{group.contactInfo.email}</p>
                    </div>
                  )}
                  {group.contactInfo.phone && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Phone:</span>
                      <p className="text-sm text-gray-900">{group.contactInfo.phone}</p>
                    </div>
                  )}
                </div>
              </div>

              {group.leaders.length > 0 && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Group Leaders</h4>
                  <div className="space-y-2">
                    {group.leaders.map((leader) => (
                      <div key={leader.id} className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">
                            {leader.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{leader.name}</p>
                          <p className="text-xs text-gray-500">{leader.role.replace('_', ' ')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {group.tags.length > 0 && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {group.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Statistics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Total Meetings:</span>
                    <span className="text-sm text-gray-900">{group.statistics.totalMeetings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Average Attendance:</span>
                    <span className="text-sm text-gray-900">{group.statistics.averageAttendance.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Retention Rate:</span>
                    <span className="text-sm text-gray-900">{group.statistics.retentionRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Growth Rate:</span>
                    <span className={`text-sm font-medium ${
                      group.statistics.growthRate >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {group.statistics.growthRate > 0 ? '+' : ''}{group.statistics.growthRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t">
            <button
              onClick={() => onEdit(group)}
              className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md"
            >
              Edit Group
            </button>
            <button
              onClick={onDelete}
              className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-md"
            >
              Delete Group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}