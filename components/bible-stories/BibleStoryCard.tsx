'use client';

import { BibleStory, BIBLE_STORY_CATEGORIES, AGE_GROUPS, DIFFICULTY_LEVELS } from '@/constant/bibleStoryTypes';
import { format } from 'date-fns';

interface BibleStoryCardProps {
  story: BibleStory;
  viewMode: 'grid' | 'list';
  isSelected: boolean;
  onSelect: (isSelected: boolean) => void;
  onView: (story: BibleStory) => void;
  onEdit: (story: BibleStory) => void;
  onDelete: () => void;
  onLike: () => void;
}

export default function BibleStoryCard({
  story,
  viewMode,
  isSelected,
  onSelect,
  onView,
  onEdit,
  onDelete,
  onLike,
}: BibleStoryCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const categoryConfig = BIBLE_STORY_CATEGORIES[story.category];
  const difficultyConfig = DIFFICULTY_LEVELS[story.difficulty];

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h3 className="text-sm font-medium text-gray-900">{story.title}</h3>
                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                  getStatusColor(story.status)
                }`}>
                  {story.status}
                </span>
                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                  getDifficultyColor(story.difficulty)
                }`}>
                  {story.difficulty}
                </span>
                {story.featured && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{story.summary}</p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <span>{categoryConfig?.name || story.category}</span>
                <span>{story.book} {story.chapter}:{story.verseStart}-{story.verseEnd}</span>
                <span>Views: {story.views}</span>
                <span>Likes: {story.likes}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onLike}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Like Story"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={() => onView(story)}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              title="View Details"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button
              onClick={() => onEdit(story)}
              className="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
              title="Edit Story"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Delete Story"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{story.title}</h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{story.summary}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mt-3">
          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
            getStatusColor(story.status)
          }`}>
            {story.status}
          </span>
          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
            getDifficultyColor(story.difficulty)
          }`}>
            {story.difficulty}
          </span>
          {story.featured && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              ⭐ Featured
            </span>
          )}
        </div>
      </div>

      {/* Image */}
      {story.imageUrl && (
        <div className="aspect-w-16 aspect-h-9">
          <img
            src={story.imageUrl}
            alt={story.title}
            className="w-full h-48 object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-xs text-gray-500">Category</span>
            <p className="text-sm font-medium text-gray-900">
              {categoryConfig?.icon} {categoryConfig?.name || story.category}
            </p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Reference</span>
            <p className="text-sm font-medium text-gray-900">
              {story.book} {story.chapter}:{story.verseStart}-{story.verseEnd}
            </p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Age Groups</span>
            <p className="text-sm font-medium text-gray-900">
              {story.ageGroups.map(ag => AGE_GROUPS[ag]?.name).join(', ')}
            </p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Engagement</span>
            <p className="text-sm font-medium text-gray-900">
              {story.views} views, {story.likes} likes
            </p>
          </div>
        </div>

        {story.tags && story.tags.length > 0 && (
          <div>
            <span className="text-xs text-gray-500">Tags</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {story.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                  {tag}
                </span>
              ))}
              {story.tags.length > 3 && (
                <span className="text-xs text-gray-500">+{story.tags.length - 3} more</span>
              )}
            </div>
          </div>
        )}

        {/* Media indicators */}
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          {story.audioUrl && <span className="flex items-center">🎵 Audio</span>}
          {story.videoUrl && <span className="flex items-center">🎬 Video</span>}
          {story.activities && story.activities.length > 0 && <span>{story.activities.length} Activities</span>}
          {story.questions && story.questions.length > 0 && <span>{story.questions.length} Questions</span>}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Created {format(new Date(story.createdAt), 'MMM d, yyyy')}</span>
          <span>Updated {format(new Date(story.updatedAt), 'MMM d, yyyy')}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <button
            onClick={onLike}
            className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span>{story.likes}</span>
          </button>
          <div className="flex space-x-2">
            <button
              onClick={() => onView(story)}
              className="px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              View Details
            </button>
            <button
              onClick={() => onEdit(story)}
              className="px-3 py-2 text-sm font-medium text-yellow-600 hover:bg-yellow-50 rounded-md transition-colors"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}