'use client';

import { format } from 'date-fns';
import { BibleStory, AGE_GROUPS } from '../../../constant/bibleStoryTypes';

interface BibleStoryDetailsModalProps {
  story: BibleStory;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (story: BibleStory) => void;
  onDelete: () => void;
  onLike: () => void;
}

export default function BibleStoryDetailsModal({
  story,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onLike
}: BibleStoryDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute inset-4 bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-linear-to-r from-purple-600 to-blue-600">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-white">{story.title}</h2>
                <p className="text-purple-100 text-sm mt-1">
                  {story.book} {story.chapter}:{story.verseStart}{story.verseEnd !== story.verseStart ? `-${story.verseEnd}` : ''}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-purple-200 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Story Content */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Story</h3>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {story.content}
                    </p>
                  </div>
                </div>

                {/* Moral/Lesson */}
                {story?.moralLesson && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Lesson</h3>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                      <p className="text-yellow-800 italic">{story.moralLesson}</p>
                    </div>
                  </div>
                )}

                {/* Discussion Questions */}
                {story.questions && story.questions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Discussion Questions</h3>
                    <div className="space-y-3">
                      {story.questions.map((question, index) => (
                        <div key={question.id || index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                          <span className="shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <p className="text-blue-800 text-sm">{question.question}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Activities */}
                {story.activities && story.activities.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Activities</h3>
                    <div className="space-y-3">
                      {story.activities.map((activity, index) => (
                        <div key={activity.id || index} className="flex items-start space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <svg className="w-5 h-5 text-green-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <h4 className="font-medium text-green-900 mb-1">{activity.title}</h4>
                            <p className="text-green-800 text-sm">{activity.description}</p>
                            {activity.materials && activity.materials.length > 0 && (
                              <div className="mt-2">
                                <span className="text-xs font-medium text-green-700">Materials needed:</span>
                                <ul className="list-disc list-inside text-xs text-green-600 mt-1">
                                  {activity.materials.map((material, materialIndex) => (
                                    <li key={materialIndex}>{material}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Engagement Stats */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Engagement</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 616 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="text-sm font-medium text-purple-700">Views</span>
                      </div>
                      <span className="text-lg font-semibold text-purple-900">{story.views}</span>
                    </div>
                    
                    <button
                      onClick={onLike}
                      className="w-full flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 515.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium text-red-700">Likes</span>
                      </div>
                      <span className="text-lg font-semibold text-red-900">{story.likes}</span>
                    </button>
                  </div>
                </div>

                {/* Story Details */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Story Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Target Age Groups</label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {story.ageGroups.map(ageGroup => (
                          <span key={ageGroup} className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            {AGE_GROUPS[ageGroup]?.name || ageGroup}
                          </span>
                        ))}
                      </div>
                    </div>

                    {story.tags && story.tags.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Tags</label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {story.tags.map(tag => (
                            <span key={tag} className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Media */}
                {(story.audioUrl || story.videoUrl || story.downloadable) && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Media & Resources</h3>
                    <div className="space-y-2">
                      {story.audioUrl && (
                        <div className="flex items-center space-x-2 p-2 bg-green-50 rounded">
                          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.797l-4-3A1 1 0 714 13V7a1 1 0 01.383-.924l4-3zM14 7a3 3 0 113 3v0a3 3 0 01-3 3" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-green-700">Audio Available</span>
                        </div>
                      )}
                      {story.videoUrl && (
                        <div className="flex items-center space-x-2 p-2 bg-purple-50 rounded">
                          <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-purple-700">Video Available</span>
                        </div>
                      )}
                      {story.downloadable && (
                        <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 712-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm text-blue-700">Downloadable</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Timeline</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Created</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {format(new Date(story.createdAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Updated</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {format(new Date(story.updatedAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Created By</label>
                      <p className="text-sm text-gray-900 mt-1">{story.createdBy}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => onEdit(story)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit Story
              </button>
              <button
                onClick={onDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Delete Story
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}