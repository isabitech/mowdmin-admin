'use client';

import { useState, useEffect } from 'react';
import { 
  GroupFilters, 
  GroupType, 
  GroupStatus,
  MeetingDay,
  GROUP_TYPE_CONFIG,
  GROUP_STATUS_CONFIG,
  MEETING_DAY_CONFIG
} from '@/constant/groupTypes';

interface GroupFiltersPanelProps {
  filters: GroupFilters;
  onApplyFilters: (filters: GroupFilters) => void;
  onClearFilters: () => void;
}

export default function GroupFiltersPanel({
  filters,
  onApplyFilters,
  onClearFilters,
}: GroupFiltersPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<GroupFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof GroupFilters, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleArrayFilterChange = (key: keyof GroupFilters, value: string, checked: boolean) => {
    setLocalFilters(prev => {
      const currentArray = (prev[key] as string[]) || [];
      if (checked) {
        return { ...prev, [key]: [...currentArray, value] };
      } else {
        return { ...prev, [key]: currentArray.filter(item => item !== value) };
      }
    });
  };

  const handleApplyFilters = () => {
    onApplyFilters(localFilters);
  };

  const handleClearFilters = () => {
    setLocalFilters({});
    onClearFilters();
  };

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof GroupFilters];
    return Array.isArray(value) ? value.length > 0 : value !== undefined && value !== '';
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
            {hasActiveFilters && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Active
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
            >
              {isExpanded ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Groups
              </label>
              <input
                type="text"
                value={localFilters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Group name, description, leader..."
              />
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Created From
              </label>
              <input
                type="date"
                value={localFilters.dateCreatedFrom || ''}
                onChange={(e) => handleFilterChange('dateCreatedFrom', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Created To
              </label>
              <input
                type="date"
                value={localFilters.dateCreatedTo || ''}
                onChange={(e) => handleFilterChange('dateCreatedTo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Leader ID Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leader ID
              </label>
              <input
                type="text"
                value={localFilters.leaderId || ''}
                onChange={(e) => handleFilterChange('leaderId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Filter by specific leader..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Member Count Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Member Count Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={localFilters.minMembers || ''}
                  onChange={(e) => handleFilterChange('minMembers', parseInt(e.target.value) || undefined)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Min members"
                  min="0"
                />
                <span className="flex items-center text-gray-500">to</span>
                <input
                  type="number"
                  value={localFilters.maxMembers || ''}
                  onChange={(e) => handleFilterChange('maxMembers', parseInt(e.target.value) || undefined)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Max members"
                  min="0"
                />
              </div>
            </div>

            {/* Group Properties */}
            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={localFilters.isPublic === true}
                    onChange={(e) => handleFilterChange('isPublic', e.target.checked ? true : undefined)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Public groups only</span>
                </label>
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={localFilters.hasOpenSpots === true}
                    onChange={(e) => handleFilterChange('hasOpenSpots', e.target.checked ? true : undefined)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Groups with open spots</span>
                </label>
              </div>
            </div>
          </div>

          {/* Group Status Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Status
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(GROUP_STATUS_CONFIG).map(([status, config]) => (
                <label key={status} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={(localFilters.status || []).includes(status as GroupStatus)}
                    onChange={(e) => handleArrayFilterChange('status', status, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className={`text-xs px-2 py-1 rounded-full ${config.color}`}>
                    {config.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Group Type Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {Object.entries(GROUP_TYPE_CONFIG).map(([type, config]) => (
                <label key={type} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={(localFilters.type || []).includes(type as GroupType)}
                    onChange={(e) => handleArrayFilterChange('type', type, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className={`text-xs px-2 py-1 rounded-full ${config.color}`}>
                    {config.icon} {config.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Meeting Day Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meeting Days
            </label>
            <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
              {Object.entries(MEETING_DAY_CONFIG).map(([day, config]) => (
                <label key={day} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={(localFilters.meetingDay || []).includes(day as MeetingDay)}
                    onChange={(e) => handleArrayFilterChange('meetingDay', day, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">
                    {config.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={(localFilters.tags || []).join(', ')}
              onChange={(e) => {
                const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
                handleFilterChange('tags', tags.length > 0 ? tags : undefined);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., bible study, fellowship, youth"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}