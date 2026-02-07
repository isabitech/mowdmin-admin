'use client';

import { useState } from 'react';
import { ProductFilters, ProductStatus, PRODUCT_CATEGORIES } from '@/constant/productTypes';

interface ProductFiltersPanelProps {
  filters: ProductFilters;
  onApplyFilters: (filters: ProductFilters) => void;
  onClearFilters: () => void;
}

export default function ProductFiltersPanel({
  filters,
  onApplyFilters,
  onClearFilters,
}: ProductFiltersPanelProps) {
  const [localFilters, setLocalFilters] = useState<ProductFilters>(filters);
  const [isExpanded, setIsExpanded] = useState(false);

  const statusOptions: { value: ProductStatus; label: string }[] = [
    { value: 'all', label: 'All Products' },
    { value: 'active', label: 'Active Only' },
    { value: 'inactive', label: 'Inactive Only' },
    { value: 'lowStock', label: 'Low Stock' },
    { value: 'outOfStock', label: 'Out of Stock' },
  ];

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
  };

  const handleClear = () => {
    setLocalFilters({});
    onClearFilters();
  };

  const hasActiveFilters = Object.keys(filters).some(key => {
    const filterKey = key as keyof ProductFilters;
    return filters[filterKey] !== undefined && filters[filterKey] !== '';
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Filter Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-sm font-medium text-gray-900">Filters</h3>
            {hasActiveFilters && (
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                Filters Active
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleClear}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear All
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  isExpanded ? 'transform rotate-180' : ''
                }`}
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

      {/* Quick Filters (Always Visible) */}
      <div className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Search products..."
              value={localFilters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="min-w-36">
            <select
              value={localFilters.status || 'all'}
              onChange={(e) => handleFilterChange('status', e.target.value as ProductStatus)}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="min-w-36">
            <select
              value={localFilters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleApply}
            className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Advanced Filters (Collapsible) */}
      {isExpanded && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Price Range */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Min Price ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={localFilters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Max Price ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={localFilters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="999.99"
              />
            </div>

            {/* Additional filter options can be added here */}
            <div className="md:col-span-2 flex justify-end items-end">
              <button
                onClick={handleApply}
                className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                Apply Advanced Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}