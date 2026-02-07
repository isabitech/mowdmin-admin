'use client';

import { useState, useEffect } from 'react';
import { MinistryFilters, MINISTRY_TYPE_CONFIG, MinistryStatus, MinistryPriority } from '@/constant/ministryTypes';

interface MinistryFiltersPanelProps {
  filters: MinistryFilters;
  onApplyFilters: (filters: MinistryFilters) => void;
  onClearFilters: () => void;
}

export default function MinistryFiltersPanel({
  filters,
  onApplyFilters,
  onClearFilters,
}: MinistryFiltersPanelProps) {
  const [localFilters, setLocalFilters] = useState<MinistryFilters>(filters);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = (key: keyof MinistryFilters, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleArrayInputChange = (key: keyof MinistryFilters, value: string, checked: boolean) => {
    setLocalFilters(prev => {
      const currentArray = (prev[key] as string[]) || [];
      if (checked) {
        return { ...prev, [key]: [...currentArray, value] };
      } else {
        return { ...prev, [key]: currentArray.filter(item => item !== value) };
      }
    });
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
  };

  const handleClear = () => {
    setLocalFilters({});
    onClearFilters();
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
            {hasActiveFilters && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                {Object.keys(filters).length} active
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleClear}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg 
                className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Filters Content */}
      {isExpanded && (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Search</label>
              <input
                type="text"
                placeholder="Search ministries..."
                value={localFilters.search || ''}
                onChange={(e) => handleInputChange('search', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <div className="space-y-1">
                {(['active', 'inactive', 'planning', 'on_hold', 'completed'] as MinistryStatus[]).map(status => (
                  <label key={status} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={localFilters.status?.includes(status) || false}
                      onChange={(e) => handleArrayInputChange('status', status, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{status.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Priority</label>
              <div className="space-y-1">
                {(['high', 'medium', 'low'] as MinistryPriority[]).map(priority => (
                  <label key={priority} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={localFilters.priority?.includes(priority) || false}
                      onChange={(e) => handleArrayInputChange('priority', priority, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{priority}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Ministry Types */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Ministry Types</label>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {Object.keys(MINISTRY_TYPE_CONFIG).map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={localFilters.type?.includes(type as any) || false}
                      onChange={(e) => handleArrayInputChange('type', type, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {MINISTRY_TYPE_CONFIG[type as keyof typeof MINISTRY_TYPE_CONFIG]?.label || type.replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Budget Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Budget Range</label>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Min budget"
                  value={localFilters.budgetMin || ''}
                  onChange={(e) => handleInputChange('budgetMin', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max budget"
                  value={localFilters.budgetMax || ''}
                  onChange={(e) => handleInputChange('budgetMax', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Participants Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Participants</label>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Min participants"
                  value={localFilters.minParticipants || ''}
                  onChange={(e) => handleInputChange('minParticipants', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max participants"
                  value={localFilters.maxParticipants || ''}
                  onChange={(e) => handleInputChange('maxParticipants', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Leader */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Leader ID</label>
              <input
                type="text"
                placeholder="Search by leader ID..."
                value={localFilters.leaderId || ''}
                onChange={(e) => handleInputChange('leaderId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={handleClear}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}