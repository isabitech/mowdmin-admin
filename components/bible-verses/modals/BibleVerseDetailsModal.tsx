'use client';
import React from 'react';
import { BibleVerse } from '@/constant/bibleVerseTypes';
import { 
  VERSE_CATEGORIES, 
  BIBLE_TRANSLATIONS, 
  VERSE_THEMES,
  MEMORY_LEVELS,
} from '@/constant/bibleVerseTypes';

interface BibleVerseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  verse: BibleVerse;
}

export const BibleVerseDetailsModal: React.FC<BibleVerseDetailsModalProps> = ({
  isOpen,
  onClose,
  verse,
}) => {
  if (!isOpen || !verse) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatReference = () => {
    return `${verse.book} ${verse.chapter}:${verse.verse}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {formatReference()}
              </h2>
              <div className="flex items-center space-x-3">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {BIBLE_TRANSLATIONS[verse.translation]?.name || verse.translation}
                </span>
                {verse.featured && (
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    ⭐ Featured
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${MEMORY_LEVELS[verse.memoryVerseLevel]?.color}-100 text-${MEMORY_LEVELS[verse.memoryVerseLevel]?.color}-800`}>
                  {MEMORY_LEVELS[verse.memoryVerseLevel]?.name}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Verse Text */}
          <div className="mb-8">
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-l-4 border-blue-500">
              <p className="text-xl leading-relaxed text-gray-900 italic font-medium">
                {verse.text}
              </p>
              <p className="text-right text-sm text-blue-600 font-semibold mt-4">
                - {formatReference()} ({BIBLE_TRANSLATIONS[verse.translation]?.abbreviation})
              </p>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Categories */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Categories</h3>
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

              {/* Themes */}
              {verse.themes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Themes</h3>
                  <div className="flex flex-wrap gap-2">
                    {verse.themes.map((theme) => {
                      const themeInfo = VERSE_THEMES[theme];
                      return (
                        <span
                          key={theme}
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium bg-${themeInfo.color}-100 text-${themeInfo.color}-800`}
                        >
                          {themeInfo.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Topics */}
              {verse.topics.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {verse.topics.map((topic, index) => (
                      <span
                        key={index}
                        className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {verse.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {verse.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Context */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Context</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Audience:</span>
                    <span className="text-sm font-medium capitalize">{verse.context.audienceType.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Literary Genre:</span>
                    <span className="text-sm font-medium capitalize">{verse.context.literaryGenre}</span>
                  </div>
                  {verse.context.historicalPeriod && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Historical Period:</span>
                      <span className="text-sm font-medium">{verse.context.historicalPeriod}</span>
                    </div>
                  )}
                  {verse.context.speaker && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Speaker:</span>
                      <span className="text-sm font-medium">{verse.context.speaker}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Statistics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Engagement</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">🔖</div>
                    <div className="text-sm text-gray-600">Bookmarks</div>
                    <div className="text-lg font-semibold text-gray-900">{verse.bookmarks}</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">🔄</div>
                    <div className="text-sm text-gray-600">Shares</div>
                    <div className="text-lg font-semibold text-gray-900">{verse.shares}</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">📥</div>
                    <div className="text-sm text-gray-600">Downloads</div>
                    <div className="text-lg font-semibold text-gray-900">{verse.downloads}</div>
                  </div>
                </div>
              </div>

              {/* Collections */}
              {verse.collections.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Collections</h3>
                  <div className="space-y-2">
                    {verse.collections.map((collectionId, index) => (
                      <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">Collection #{collectionId}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Commentary Section */}
          {verse.commentary && (
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Commentary</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 leading-relaxed">{verse.commentary}</p>
              </div>
            </div>
          )}

          {/* Devotional Note */}
          {verse.devotionalNote && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Devotional Note</h3>
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <p className="text-gray-700 leading-relaxed">{verse.devotionalNote}</p>
              </div>
            </div>
          )}

          {/* Cross References */}
          {verse.crossReferences.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Cross References</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {verse.crossReferences.map((ref, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-blue-600">
                      {ref.book} {ref.chapter}:{ref.verse}
                    </span>
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded capitalize">
                      {ref.relationshipType}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Metadata</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Created:</span>
                <span className="ml-2 font-medium">{formatDate(verse.createdAt)}</span>
              </div>
              <div>
                <span className="text-gray-600">Last Updated:</span>
                <span className="ml-2 font-medium">{formatDate(verse.updatedAt)}</span>
              </div>
              <div>
                <span className="text-gray-600">Created By:</span>
                <span className="ml-2 font-medium">{verse.createdBy}</span>
              </div>
              <div>
                <span className="text-gray-600">Memory Level:</span>
                <span className="ml-2 font-medium">{MEMORY_LEVELS[verse.memoryVerseLevel]?.description}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
            <button
              onClick={() => {
                // Handle share functionality
                if (navigator.share) {
                  navigator.share({
                    title: `Bible Verse - ${formatReference()}`,
                    text: `"${verse.text}" - ${formatReference()} (${BIBLE_TRANSLATIONS[verse.translation]?.abbreviation})`,
                  });
                }
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Share Verse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};