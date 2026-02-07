'use client';
import React from 'react';
import { BibleVerse } from '@/constant/bibleVerseTypes';
import { VERSE_CATEGORIES, BIBLE_TRANSLATIONS } from '@/constant/bibleVerseTypes';

interface BibleVerseCardProps {
  verse: BibleVerse;
  viewMode: 'grid' | 'list' | 'detailed';
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onViewDetails: () => void;
  onBookmark: () => void;
}

export const BibleVerseCard: React.FC<BibleVerseCardProps> = ({
  verse,
  viewMode,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onViewDetails,
  onBookmark,
}) => {
  const formatReference = () => {
    return `${verse.book} ${verse.chapter}:${verse.verse}`;
  };

  const truncateText = (text: string, length: number) => {
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  const getDisplayCategories = () => {
    return verse.categories.slice(0, 3).map(cat => ({
      ...VERSE_CATEGORIES[cat],
      key: cat
    }));
  };

  if (viewMode === 'list') {
    return (
      <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-4 border-l-4 ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onSelect}
              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-blue-600">
                    {formatReference()}
                  </span>
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                    {BIBLE_TRANSLATIONS[verse.translation]?.abbreviation || verse.translation}
                  </span>
                  {verse.featured && (
                    <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded font-medium">
                      ⭐ Featured
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-1">
                  <button
                    onClick={onBookmark}
                    className="text-gray-400 hover:text-yellow-500 p-1"
                    title="Bookmark verse"
                  >
                    🔖
                  </button>
                  <span className="text-xs text-gray-500">{verse.bookmarks}</span>
                </div>
              </div>
              
              <p className="text-gray-900 leading-relaxed">
                "{truncateText(verse.text, 200)}"
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {getDisplayCategories().map((category) => (
                    <span
                      key={category.key}
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${category.color}-100 text-${category.color}-800`}
                    >
                      {category.icon} {category.name}
                    </span>
                  ))}
                  {verse.categories.length > 3 && (
                    <span className="text-xs text-gray-500">+{verse.categories.length - 3} more</span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={onViewDetails}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Details
                  </button>
                  <button
                    onClick={onEdit}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={onDelete}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === 'detailed') {
    return (
      <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6 border ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
      }`}>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={onSelect}
                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-blue-600">
                    {formatReference()}
                  </h3>
                  <span className="text-sm px-2 py-1 bg-gray-100 text-gray-600 rounded">
                    {BIBLE_TRANSLATIONS[verse.translation]?.name}
                  </span>
                  {verse.featured && (
                    <span className="text-sm px-2 py-1 bg-yellow-100 text-yellow-800 rounded font-medium">
                      ⭐ Featured
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={onBookmark}
                className="text-gray-400 hover:text-yellow-500 p-2"
                title="Bookmark verse"
              >
                🔖 {verse.bookmarks}
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-900 leading-relaxed text-lg italic">
              "{verse.text}"
            </p>
          </div>
          
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Categories</h4>
              <div className="flex flex-wrap gap-2">
                {verse.categories.map((cat) => {
                  const category = VERSE_CATEGORIES[cat];
                  return (
                    <span
                      key={cat}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${category.color}-100 text-${category.color}-800`}
                    >
                      {category.icon} {category.name}
                    </span>
                  );
                })}
              </div>
            </div>
            
            {verse.topics.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Topics</h4>
                <div className="flex flex-wrap gap-1">
                  {verse.topics.map((topic, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {verse.commentary && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Commentary</h4>
                <p className="text-sm text-gray-600">{verse.commentary}</p>
              </div>
            )}
            
            {verse.crossReferences.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Cross References</h4>
                <div className="flex flex-wrap gap-2">
                  {verse.crossReferences.map((ref, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {ref.book} {ref.chapter}:{ref.verse}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>🔖 {verse.bookmarks} bookmarks</span>
              <span>🔄 {verse.shares} shares</span>
              <span>📥 {verse.downloads} downloads</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={onViewDetails}
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Full Details
              </button>
              <button
                onClick={onEdit}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Edit
              </button>
              <button
                onClick={onDelete}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-4 border ${
      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
    }`}>
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onSelect}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <h3 className="font-semibold text-blue-600">
                {formatReference()}
              </h3>
              <p className="text-xs text-gray-500">
                {BIBLE_TRANSLATIONS[verse.translation]?.abbreviation || verse.translation}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {verse.featured && <span className="text-yellow-500">⭐</span>}
            <button
              onClick={onBookmark}
              className="text-gray-400 hover:text-yellow-500"
              title="Bookmark verse"
            >
              🔖
            </button>
            <span className="text-xs text-gray-500">{verse.bookmarks}</span>
          </div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-900 leading-relaxed italic">
            "{truncateText(verse.text, 120)}"
          </p>
        </div>
        
        <div className="flex flex-wrap gap-1 min-h-8">
          {getDisplayCategories().map((category) => (
            <span
              key={category.key}
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${category.color}-100 text-${category.color}-800`}
            >
              {category.icon} {category.name}
            </span>
          ))}
          {verse.categories.length > 3 && (
            <span className="text-xs text-gray-500 px-2 py-1">+{verse.categories.length - 3}</span>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex space-x-3 text-xs text-gray-500">
            <span>🔄 {verse.shares}</span>
            <span>📥 {verse.downloads}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={onViewDetails}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded"
            >
              View
            </button>
            <button
              onClick={onEdit}
              className="text-xs text-gray-600 hover:text-gray-800 px-2 py-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="text-xs text-red-600 hover:text-red-800 px-2 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};