'use client';

import Image from 'next/image';
import { Group, GROUP_TYPE_CONFIG, GROUP_STATUS_CONFIG } from '@/constant/groupTypes';

interface GroupCardProps {
  group: Group;
  viewMode: 'grid' | 'list';
  isSelected: boolean;
  onSelect: (isSelected: boolean) => void;
  onView: (group: Group) => void;
  onEdit: (group: Group) => void;
  onDelete: () => void;
}

export default function GroupCard({
  group,
  viewMode,
  isSelected,
  onSelect,
  onView,
  onEdit,
  onDelete,
}: GroupCardProps) {
  const typeConfig = GROUP_TYPE_CONFIG[group.type];
  const statusConfig = GROUP_STATUS_CONFIG[group.status];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getMembershipStatus = () => {
    if (group.maxMembers && group.currentMemberCount >= group.maxMembers) {
      return { text: 'Full', color: 'text-red-600' };
    }
    if (group.maxMembers) {
      const remaining = group.maxMembers - group.currentMemberCount;
      return { text: `${remaining} spots left`, color: 'text-green-600' };
    }
    return { text: 'Open enrollment', color: 'text-blue-600' };
  };

  const membershipStatus = getMembershipStatus();

  if (viewMode === 'grid') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="relative">
          {group.imageUrl && (
          <div className="relative h-48 w-full">
            <Image
              src={group.imageUrl}
              alt={group.name}
              fill
              className="object-cover rounded-t-lg"
            />
          </div>
          )}
          <div className="absolute top-3 left-3">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          <div className="absolute top-3 right-3">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusConfig?.color}`}>
              {statusConfig?.label}
            </span>
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                  {group.name}
                </h3>
                <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${typeConfig?.color}`}>
                  <span className="mr-1">{typeConfig?.icon}</span>
                  {typeConfig?.label}
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{group.description}</p>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-gray-700 font-medium">
                  {group.currentMemberCount}{group.maxMembers && `/${group.maxMembers}`} members
                </span>
              </div>
              <span className={`text-xs font-medium ${membershipStatus.color}`}>
                {membershipStatus.text}
              </span>
            </div>

            <div className="space-y-2">
              {group?.leaders?.length > 0 && (
                <div className="text-sm">
                  <span className="text-gray-500">Leaders:</span>
                  <span className="ml-1 text-gray-700">
                    {group?.leaders?.map(l => l.name).join(', ')}
                  </span>
                </div>
              )}
              
              <div className="text-sm">
                <span className="text-gray-500">Meeting:</span>
                <span className="ml-1 text-gray-700">
                  {group?.meetingSchedule?.frequency === 'weekly' && group.meetingSchedule.dayOfWeek
                    ? `${group?.meetingSchedule?.dayOfWeek.charAt(0).toUpperCase() + group.meetingSchedule.dayOfWeek.slice(1)}s`
                    : group?.meetingSchedule?.frequency?.replace('_', ' ')}
                  {group.meetingSchedule?.timeOfDay && ` at ${group.meetingSchedule.timeOfDay}`}
                </span>
              </div>
              
              {group.meetingSchedule?.location && (
                <div className="text-sm">
                  <span className="text-gray-500">Location:</span>
                  <span className="ml-1 text-gray-700">{group.meetingSchedule.location}</span>
                </div>
              )}
            </div>

            {group.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {group.tags?.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {group.tags?.length > 3 && (
                  <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                    +{group.tags?.length - 3} more
                  </span>
                )}
              </div>
            )}

            <div className="text-xs text-gray-500">
              Created {formatDate(group?.createdAt)}
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t">
            <button
              onClick={() => onView(group)}
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View Details
            </button>
            <div className="flex space-x-1">
              <button
                onClick={() => onEdit(group)}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
              >
                Edit
              </button>
              <button
                onClick={onDelete}
                className="px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            
            {group.imageUrl && (
            <div className="relative w-16 h-16">
              <Image
                src={group.imageUrl}
                alt={group.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-1">
                <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
                <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${typeConfig.color}`}>
                  <span className="mr-1">{typeConfig.icon}</span>
                  {typeConfig.label}
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-1 mb-2">{group.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {group.currentMemberCount}{group.maxMembers && `/${group.maxMembers}`} members
                </span>
                {group.leaders.length > 0 && (
                  <>
                    <span>•</span>
                    <span>Leaders: {group.leaders.map(l => l.name).join(', ')}</span>
                  </>
                )}
                <span>•</span>
                <span>Created {formatDate(group.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {group.meetingSchedule.frequency === 'weekly' && group.meetingSchedule.dayOfWeek
                  ? `${group.meetingSchedule.dayOfWeek.charAt(0).toUpperCase() + group.meetingSchedule.dayOfWeek.slice(1)}s`
                  : group.meetingSchedule.frequency.replace('_', ' ')}
                {group.meetingSchedule.timeOfDay && ` at ${group.meetingSchedule.timeOfDay}`}
              </div>
              {group.meetingSchedule.location && (
                <div className="text-xs text-gray-500">{group.meetingSchedule.location}</div>
              )}
              <div className={`text-xs font-medium ${membershipStatus.color}`}>
                {membershipStatus.text}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onView(group)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="View Details"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              
              <button
                onClick={() => onEdit(group)}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
              >
                Edit
              </button>
              
              <button
                onClick={onDelete}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete Group"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {group.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {group.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}