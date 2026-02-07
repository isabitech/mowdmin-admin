'use client';

import { useState, useEffect } from 'react';
import { 
  DonationFilters, 
  DonationType, 
  DonationFrequency, 
  DonationStatus, 
  DonationSource,
  DONATION_STATUS_CONFIG,
  DONATION_TYPE_CONFIG,
  DONATION_FREQUENCY_CONFIG,
  DONATION_SOURCE_CONFIG
} from '@/constant/donationTypes';

interface DonationFiltersPanelProps {
  filters: DonationFilters;
  onApplyFilters: (filters: DonationFilters) => void;
  onClearFilters: () => void;
}

export default function DonationFiltersPanel({
  filters,
  onApplyFilters,
  onClearFilters,
}: DonationFiltersPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<DonationFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof DonationFilters, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleArrayFilterChange = (key: keyof DonationFilters, value: string, checked: boolean) => {
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
    const value = filters[key as keyof DonationFilters];
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
                Search
              </label>
              <input
                type="text"
                value={localFilters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Donor name, email, donation number..."
              />
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date From
              </label>
              <input
                type="date"
                value={localFilters.dateFrom || ''}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date To
              </label>
              <input
                type="date"
                value={localFilters.dateTo || ''}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Campaign Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign ID
              </label>
              <input
                type="text"
                value={localFilters.campaignId || ''}
                onChange={(e) => handleFilterChange('campaignId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Filter by specific campaign..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Amount Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={localFilters.amountMin || ''}
                  onChange={(e) => handleFilterChange('amountMin', parseFloat(e.target.value) || undefined)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Min amount"
                  min="0"
                  step="0.01"
                />
                <span className="flex items-center text-gray-500">to</span>
                <input
                  type="number"
                  value={localFilters.amountMax || ''}
                  onChange={(e) => handleFilterChange('amountMax', parseFloat(e.target.value) || undefined)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Max amount"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Donation Properties */}
            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={localFilters.isAnonymous === true}
                    onChange={(e) => handleFilterChange('isAnonymous', e.target.checked ? true : undefined)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Anonymous donations only</span>
                </label>
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={localFilters.isTaxDeductible === true}
                    onChange={(e) => handleFilterChange('isTaxDeductible', e.target.checked ? true : undefined)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Tax deductible donations only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Status Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Donation Status
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(DONATION_STATUS_CONFIG).map(([status, config]) => (
                <label key={status} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={(localFilters.status || []).includes(status as DonationStatus)}
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

          {/* Type Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Donation Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(DONATION_TYPE_CONFIG).map(([type, config]) => (
                <label key={type} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={(localFilters.type || []).includes(type as DonationType)}
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

          {/* Frequency Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Donation Frequency
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(DONATION_FREQUENCY_CONFIG).map(([frequency, config]) => (
                <label key={frequency} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={(localFilters.frequency || []).includes(frequency as DonationFrequency)}
                    onChange={(e) => handleArrayFilterChange('frequency', frequency, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">
                    {config.icon} {config.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Source Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Donation Source
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {Object.entries(DONATION_SOURCE_CONFIG).map(([source, config]) => (
                <label key={source} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={(localFilters.source || []).includes(source as DonationSource)}
                    onChange={(e) => handleArrayFilterChange('source', source, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">
                    {config.icon} {config.label}
                  </span>
                </label>
              ))}
            </div>
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