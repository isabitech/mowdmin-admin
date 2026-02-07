'use client';

import { useState, useEffect } from 'react';
import {
  BibleStoryFilters,
  BIBLE_STORY_CATEGORIES,
  AGE_GROUPS,
  DIFFICULTY_LEVELS,
  BIBLE_BOOKS,
  POPULAR_TAGS
} from '@/constant/bibleStoryTypes';

interface BibleStoryFiltersPanelProps {
  filters: BibleStoryFilters;
  onApplyFilters: (filters: BibleStoryFilters) => void;
  onClearFilters: () => void;
}

export default function BibleStoryFiltersPanel({
  filters,
  onApplyFilters,
  onClearFilters,
}: BibleStoryFiltersPanelProps) {
  const [localFilters, setLocalFilters] = useState<BibleStoryFilters>(filters);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = (key: keyof BibleStoryFilters, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleArrayInputChange = (key: keyof BibleStoryFilters, value: string, checked: boolean) => {
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
                placeholder="Search stories..."
                value={localFilters.search || ''}
                onChange={(e) => handleInputChange('search', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <div className="space-y-1">
                {['published', 'draft', 'archived'].map(status => (
                  <label key={status} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={localFilters.status?.includes(status) || false}
                      onChange={(e) => handleArrayInputChange('status', status, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Categories</label>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {Object.entries(BIBLE_STORY_CATEGORIES).slice(0, 8).map(([key, config]) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={localFilters.category?.includes(key as any) || false}
                      onChange={(e) => handleArrayInputChange('category', key, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {config.icon} {config.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Age Groups */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Age Groups</label>
              <div className="space-y-1">
                {Object.entries(AGE_GROUPS).map(([key, config]) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={localFilters.ageGroups?.includes(key as any) || false}
                      onChange={(e) => handleArrayInputChange('ageGroups', key, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{config.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Difficulty</label>
              <div className="space-y-1">
                {Object.entries(DIFFICULTY_LEVELS).map(([key, config]) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={localFilters.difficulty?.includes(key as any) || false}
                      onChange={(e) => handleArrayInputChange('difficulty', key, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{key}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Bible Book */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Bible Book</label>
              <select
                multiple
                value={localFilters.book || []}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions, option => option.value);
                  handleInputChange('book', values);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 max-h-32"
              >
                {BIBLE_BOOKS.map(book => (
                  <option key={book} value={book}>{book}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tags</label>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {POPULAR_TAGS.slice(0, 10).map(tag => (
                  <label key={tag} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={localFilters.tags?.includes(tag) || false}
                      onChange={(e) => handleArrayInputChange('tags', tag, e.target.checked)}
                      className="sr-only"
                    />
                    <span className={`px-2 py-1 text-xs rounded cursor-pointer transition-colors ${
                      localFilters.tags?.includes(tag) 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}>
                      {tag}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Special Filters */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Special Features</label>
              <div className="space-y-1">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.featured || false}
                    onChange={(e) => handleInputChange('featured', e.target.checked || undefined)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured Stories</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.hasAudio || false}
                    onChange={(e) => handleInputChange('hasAudio', e.target.checked || undefined)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Has Audio</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.hasVideo || false}
                    onChange={(e) => handleInputChange('hasVideo', e.target.checked || undefined)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Has Video</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.hasActivities || false}
                    onChange={(e) => handleInputChange('hasActivities', e.target.checked || undefined)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Has Activities</span>
                </label>
              </div>
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