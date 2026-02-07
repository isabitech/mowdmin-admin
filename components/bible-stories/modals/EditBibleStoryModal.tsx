'use client';

import { useState, useEffect } from 'react';
import {
  BibleStory,
  UpdateBibleStoryData,
  BIBLE_STORY_CATEGORIES,
  AGE_GROUPS,
  DIFFICULTY_LEVELS,
  BIBLE_BOOKS,
  POPULAR_TAGS
} from '@/constant/bibleStoryTypes';

interface EditBibleStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: BibleStory;
  onSuccess: (data: UpdateBibleStoryData) => void;
  isSubmitting: boolean;
}

export default function EditBibleStoryModal({
  isOpen,
  onClose,
  story,
  onSuccess,
  isSubmitting,
}: EditBibleStoryModalProps) {
  const [formData, setFormData] = useState<UpdateBibleStoryData>({
    title: story.title,
    summary: story.summary,
    content: story.content,
    book: story.book,
    chapter: story.chapter,
    verseStart: story.verseStart,
    verseEnd: story.verseEnd,
    category: story.category,
    tags: story.tags || [],
    ageGroups: story.ageGroups || [],
    difficulty: story.difficulty,
    lessonPoints: story.lessonPoints || [],
    moralLesson: story.moralLesson,
    downloadable: story.downloadable,
    featured: story.featured,
    status: story.status,
  });

  const [currentLessonPoint, setCurrentLessonPoint] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData({
      title: story.title,
      summary: story.summary,
      content: story.content,
      book: story.book,
      chapter: story.chapter,
      verseStart: story.verseStart,
      verseEnd: story.verseEnd,
      category: story.category,
      tags: story.tags || [],
      ageGroups: story.ageGroups || [],
      difficulty: story.difficulty,
      lessonPoints: story.lessonPoints || [],
      moralLesson: story.moralLesson,
      downloadable: story.downloadable,
      featured: story.featured,
      status: story.status,
    });
  }, [story]);

  const handleInputChange = (field: keyof UpdateBibleStoryData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleArrayInputChange = (field: 'tags' | 'ageGroups', value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = (prev[field] as string[]) || [];
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] };
      } else {
        return { ...prev, [field]: currentArray.filter(item => item !== value) };
      }
    });
  };

  const addLessonPoint = () => {
    if (currentLessonPoint.trim()) {
      setFormData(prev => ({
        ...prev,
        lessonPoints: [...(prev.lessonPoints || []), currentLessonPoint.trim()]
      }));
      setCurrentLessonPoint('');
    }
  };

  const removeLessonPoint = (index: number) => {
    setFormData(prev => ({
      ...prev,
      lessonPoints: (prev.lessonPoints || []).filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) newErrors.title = 'Title is required';
    if (!formData.summary?.trim()) newErrors.summary = 'Summary is required';
    if (!formData.content?.trim()) newErrors.content = 'Content is required';
    if (!formData.moralLesson?.trim()) newErrors.moralLesson = 'Moral lesson is required';
    if (formData.chapter !== undefined && formData.chapter < 1) newErrors.chapter = 'Chapter must be at least 1';
    if (formData.verseStart !== undefined && formData.verseStart < 1) newErrors.verseStart = 'Start verse must be at least 1';
    if (formData.verseEnd !== undefined && formData.verseStart !== undefined && formData.verseEnd < formData.verseStart) {
      newErrors.verseEnd = 'End verse must be >= start verse';
    }
    if (formData.ageGroups && formData.ageGroups.length === 0) newErrors.ageGroups = 'At least one age group is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSuccess(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Edit Bible Story</h2>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content - Similar structure to CreateBibleStoryModal but with existing data */}
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Story Title *
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${
                    errors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Enter story title"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category || 'old_testament'}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {Object.entries(BIBLE_STORY_CATEGORIES).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.icon} {config.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level *
                </label>
                <select
                  value={formData.difficulty || 'beginner'}
                  onChange={(e) => handleInputChange('difficulty', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {Object.entries(DIFFICULTY_LEVELS).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bible Reference */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Bible Reference</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Book *
                  </label>
                  <select
                    value={formData.book || 'Genesis'}
                    onChange={(e) => handleInputChange('book', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {BIBLE_BOOKS.map(book => (
                      <option key={book} value={book}>{book}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chapter *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.chapter || 1}
                    onChange={(e) => handleInputChange('chapter', Number(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${
                      errors.chapter ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {errors.chapter && <p className="mt-1 text-sm text-red-600">{errors.chapter}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Verse *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.verseStart || 1}
                    onChange={(e) => handleInputChange('verseStart', Number(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${
                      errors.verseStart ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {errors.verseStart && <p className="mt-1 text-sm text-red-600">{errors.verseStart}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Verse *
                  </label>
                  <input
                    type="number"
                    min={formData.verseStart || 1}
                    value={formData.verseEnd || 1}
                    onChange={(e) => handleInputChange('verseEnd', Number(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${
                      errors.verseEnd ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {errors.verseEnd && <p className="mt-1 text-sm text-red-600">{errors.verseEnd}</p>}
                </div>
              </div>
            </div>

            {/* Summary and Content */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Summary *
                </label>
                <textarea
                  value={formData.summary || ''}
                  onChange={(e) => handleInputChange('summary', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${
                    errors.summary ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Brief summary of the story"
                />
                {errors.summary && <p className="mt-1 text-sm text-red-600">{errors.summary}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Story Content *
                </label>
                <textarea
                  value={formData.content || ''}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  rows={8}
                  className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${
                    errors.content ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Full story content"
                />
                {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
              </div>
            </div>

            {/* Age Groups */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Age Groups *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(AGE_GROUPS).map(([key, config]) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.ageGroups?.includes(key as any) || false}
                      onChange={(e) => handleArrayInputChange('ageGroups', key, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{config.name}</span>
                  </label>
                ))}
              </div>
              {errors.ageGroups && <p className="mt-1 text-sm text-red-600">{errors.ageGroups}</p>}
            </div>

            {/* Lesson Points */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Lesson Points
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={currentLessonPoint}
                  onChange={(e) => setCurrentLessonPoint(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Add a lesson point"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLessonPoint())}
                />
                <button
                  type="button"
                  onClick={addLessonPoint}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="space-y-1">
                {(formData.lessonPoints || []).map((point, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-700">{point}</span>
                    <button
                      type="button"
                      onClick={() => removeLessonPoint(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Moral Lesson */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Moral Lesson *
              </label>
              <textarea
                value={formData.moralLesson || ''}
                onChange={(e) => handleInputChange('moralLesson', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${
                  errors.moralLesson ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="What is the main moral or spiritual lesson?"
              />
              {errors.moralLesson && <p className="mt-1 text-sm text-red-600">{errors.moralLesson}</p>}
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status || 'draft'}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featured || false}
                  onChange={(e) => handleInputChange('featured', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">Featured Story</label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.downloadable || false}
                  onChange={(e) => handleInputChange('downloadable', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">Downloadable</label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? 'Updating...' : 'Update Story'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}