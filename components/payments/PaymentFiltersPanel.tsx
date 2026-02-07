'use client';

import { useState, useEffect } from 'react';
import { 
  PaymentFilters, 
  PaymentStatus, 
  PaymentType, 
  PaymentMethod, 
  PaymentGateway,
  PAYMENT_STATUS_CONFIG,
  PAYMENT_TYPE_CONFIG,
  PAYMENT_METHOD_CONFIG,
  PAYMENT_GATEWAY_CONFIG
} from '@/constant/paymentTypes';

interface PaymentFiltersPanelProps {
  filters: PaymentFilters;
  onApplyFilters: (filters: PaymentFilters) => void;
  onClearFilters: () => void;
}

export default function PaymentFiltersPanel({
  filters,
  onApplyFilters,
  onClearFilters,
}: PaymentFiltersPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<PaymentFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof PaymentFilters, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleArrayFilterChange = (key: keyof PaymentFilters, value: string, checked: boolean) => {
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
    const value = filters[key as keyof PaymentFilters];
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
                placeholder="Transaction ID, customer name, email..."
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

            {/* Order ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order ID
              </label>
              <input
                type="text"
                value={localFilters.orderId || ''}
                onChange={(e) => handleFilterChange('orderId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Filter by specific order ID..."
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
          </div>

          {/* Status Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Status
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {Object.entries(PAYMENT_STATUS_CONFIG).map(([status, config]) => (
                <label key={status} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={(localFilters.status || []).includes(status as PaymentStatus)}
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
              Payment Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(PAYMENT_TYPE_CONFIG).map(([type, config]) => (
                <label key={type} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={(localFilters.type || []).includes(type as PaymentType)}
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

          {/* Payment Method Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(PAYMENT_METHOD_CONFIG).map(([method, config]) => (
                <label key={method} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={(localFilters.method || []).includes(method as PaymentMethod)}
                    onChange={(e) => handleArrayFilterChange('method', method, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">
                    {config.icon} {config.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Gateway Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Gateway
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {Object.entries(PAYMENT_GATEWAY_CONFIG).map(([gateway, config]) => (
                <label key={gateway} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={(localFilters.gateway || []).includes(gateway as PaymentGateway)}
                    onChange={(e) => handleArrayFilterChange('gateway', gateway, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className={`text-xs px-2 py-1 rounded-full ${config.color}`}>
                    {config.label}
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