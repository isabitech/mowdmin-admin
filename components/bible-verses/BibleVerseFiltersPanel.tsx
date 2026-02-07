'use client';
import React from 'react';
import { BibleVerseFilters, BibleTranslation, VerseCategory, VerseTheme, MemoryLevel } from '@/constant/bibleVerseTypes';
import { BIBLE_TRANSLATIONS, VERSE_CATEGORIES, VERSE_THEMES, MEMORY_LEVELS, POPULAR_TOPICS } from '@/constant/bibleVerseTypes';

interface BibleVerseFiltersPanelProps {
  filters: BibleVerseFilters;
  onFiltersChange: (filters: BibleVerseFilters) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

export const BibleVerseFiltersPanel: React.FC<BibleVerseFiltersPanelProps> = ({
  filters,
  onFiltersChange,
  onApplyFilters,
  onResetFilters,
}) => {
  const updateFilter = <K extends keyof BibleVerseFilters>(
    key: K,
    value: BibleVerseFilters[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = <K extends keyof BibleVerseFilters>(
    key: K,
    value: string,
    currentArray: string[] = []
  ) => {
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    updateFilter(key, newArray.length > 0 ? newArray as BibleVerseFilters[K] : undefined);
  };

  const bibleBooks = [
    // Old Testament
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth',
    '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
    'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Songs',
    'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
    'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
    // New Testament
    'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians',
    'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
    '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter',
    '1 John', '2 John', '3 John', 'Jude', 'Revelation'
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <div className="flex space-x-2">
          <button
            onClick={onResetFilters}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
          >
            Reset
          </button>
          <button
            onClick={onApplyFilters}
            className="px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Bible Books */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bible Books</label>
          <div className="max-h-32 overflow-y-auto border rounded-lg p-2 space-y-1">
            {bibleBooks.map((book) => (
              <label key={book} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={filters.book?.includes(book) || false}
                  onChange={() => toggleArrayFilter('book', book, filters.book)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                />
                {book}
              </label>
            ))}
          </div>
        </div>

        {/* Bible Translations */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Translations</label>
          <div className="space-y-1">
            {Object.entries(BIBLE_TRANSLATIONS).map(([key, translation]) => (
              <label key={key} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={filters.translation?.includes(key as BibleTranslation) || false}
                  onChange={() => toggleArrayFilter('translation', key, filters.translation)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                />
                {translation.abbreviation} - {translation.name}
              </label>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {Object.entries(VERSE_CATEGORIES).map(([key, category]) => (
              <label key={key} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={filters.categories?.includes(key as VerseCategory) || false}
                  onChange={() => toggleArrayFilter('categories', key, filters.categories)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                />
                <span className="flex items-center">
                  {category.icon} <span className="ml-1">{category.name}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Themes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Themes</label>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {Object.entries(VERSE_THEMES).map(([key, theme]) => (
              <label key={key} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={filters.themes?.includes(key as VerseTheme) || false}
                  onChange={() => toggleArrayFilter('themes', key, filters.themes)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                />
                {theme.name}
              </label>
            ))}
          </div>
        </div>

        {/* Topics */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Popular Topics</label>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {POPULAR_TOPICS.map((topic) => (
              <label key={topic} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={filters.topics?.includes(topic) || false}
                  onChange={() => toggleArrayFilter('topics', topic, filters.topics)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                />
                {topic}
              </label>
            ))}
          </div>
        </div>

        {/* Memory Levels */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Memory Levels</label>
          <div className="space-y-1">
            {Object.entries(MEMORY_LEVELS).map(([key, level]) => (
              <label key={key} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={filters.memoryLevel?.includes(key as MemoryLevel) || false}
                  onChange={() => toggleArrayFilter('memoryLevel', key, filters.memoryLevel)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                />
                <span className={`px-2 py-1 rounded text-xs text-${level.color}-800 bg-${level.color}-100 mr-2`}>
                  {level.name}
                </span>
                {level.description}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
        {/* Featured Toggle */}
        <div>
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={filters.featured || false}
              onChange={(e) => updateFilter('featured', e.target.checked || undefined)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
            />
            Featured verses only
          </label>
        </div>

        {/* Has Commentary */}
        <div>
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={filters.hasCommentary || false}
              onChange={(e) => updateFilter('hasCommentary', e.target.checked || undefined)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
            />
            Has commentary
          </label>
        </div>

        {/* Has Devotional */}
        <div>
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={filters.hasDevotional || false}
              onChange={(e) => updateFilter('hasDevotional', e.target.checked || undefined)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
            />
            Has devotional note
          </label>
        </div>

        {/* Has Cross References */}
        <div>
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={filters.hasCrossReferences || false}
              onChange={(e) => updateFilter('hasCrossReferences', e.target.checked || undefined)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
            />
            Has cross references
          </label>
        </div>
      </div>

      {/* Bookmark Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Bookmarks
          </label>
          <input
            type="number"
            min="0"
            value={filters.minBookmarks || ''}
            onChange={(e) => updateFilter('minBookmarks', e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Bookmarks
          </label>
          <input
            type="number"
            min="0"
            value={filters.maxBookmarks || ''}
            onChange={(e) => updateFilter('maxBookmarks', e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="No limit"
          />
        </div>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Created From
          </label>
          <input
            type="date"
            value={filters.dateFrom || ''}
            onChange={(e) => updateFilter('dateFrom', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Created To
          </label>
          <input
            type="date"
            value={filters.dateTo || ''}
            onChange={(e) => updateFilter('dateTo', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Active Filter Summary */}
      {Object.keys(filters).length > 0 && (
        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (!value || (Array.isArray(value) && value.length === 0)) return null;
              
              let displayValue = Array.isArray(value) ? `${value.length} selected` : value.toString();
              
              return (
                <span
                  key={key}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {key}: {displayValue}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};