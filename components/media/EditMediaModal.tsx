'use client';

import { useState, useEffect } from 'react';
import { Media, UpdateMediaRequest } from '@/constant/mediaTypes';

interface EditMediaModalProps {
  media: Media | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (mediaData: Partial<UpdateMediaRequest>) => Promise<void>;
}

export default function EditMediaModal({ media, isOpen, onClose, onSave }: EditMediaModalProps) {
  const [formData, setFormData] = useState<Partial<UpdateMediaRequest>>({
    title: '',
    description: '',
    url: '',
    categoryId: '',
    youtubeLiveLink: '',
    isLive: false,
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (media) {
      setFormData({
        title: media.title,
        description: media.description || '',
        url: media.url || '',
        categoryId: media.category_id?._id || '',
        youtubeLiveLink: media.youtubeLiveLink || '',
        isLive: media.isLive,
        isActive: media.isActive || true,
      });
      setError('');
    }
  }, [media]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update media');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const validateUrl = (url: string) => {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlPattern.test(url);
  };

  const isYouTubeUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  if (!isOpen || !media) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Edit Media</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                  Video URL *
                </label>
                <input
                  id="url"
                  name="url"
                  type="url"
                  required
                  value={formData.url || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={loading}
                />
                <p className="mt-1 text-xs text-gray-500">
                  YouTube, Vimeo, or direct video file URLs supported
                </p>
              </div>

              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                  Category (Optional)
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={loading}
                >
                  <option value="">Select Category</option>
                  <option value="sermons">Sermons</option>
                  <option value="worship">Worship</option>
                  <option value="testimonies">Testimonies</option>
                  <option value="events">Events</option>
                  <option value="teachings">Teachings</option>
                </select>
              </div>

              {isYouTubeUrl(formData.url || '') && (
                <div>
                  <label htmlFor="youtubeLiveLink" className="block text-sm font-medium text-gray-700">
                    YouTube Live Link (Optional)
                  </label>
                  <input
                    id="youtubeLiveLink"
                    name="youtubeLiveLink"
                    type="url"
                    value={formData.youtubeLiveLink || ''}
                    onChange={handleInputChange}
                    placeholder="https://www.youtube.com/watch?v=... (for live streams)"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={loading}
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="isLive"
                    name="isLive"
                    type="checkbox"
                    checked={formData.isLive || false}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    disabled={loading}
                  />
                  <label htmlFor="isLive" className="ml-2 block text-sm text-gray-900">
                    This is a live stream
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    checked={formData.isActive || false}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    disabled={loading}
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Media is active (visible to users)
                  </label>
                </div>
              </div>

              {formData.url && validateUrl(formData.url) && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Preview:</h4>
                  <div className="text-sm text-gray-600">
                    <p><strong>Title:</strong> {formData.title || 'Untitled'}</p>
                    <p><strong>URL:</strong> {formData.url}</p>
                    <p><strong>Type:</strong> {formData.isLive ? 'Live Stream' : 'Video'}</p>
                    <p><strong>Status:</strong> {formData.isActive ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Media'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}