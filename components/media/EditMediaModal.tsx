'use client';

import { useState, useEffect } from 'react';
import { Media, UpdateMediaRequest, MediaCategory } from '@/constant/mediaTypes';
import { mediaCategoryService } from '@/services/mediaCategoryService';

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
    type: 'video',
    media_url: '',
    category_id: '',
    author: '',
    duration: '',
    is_downloadable: false,
    thumbnail: '',
    isLive: false,
    isActive: true,
  });
  const [categories, setCategories] = useState<MediaCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await mediaCategoryService.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    if (isOpen) {
      fetchCategories();
    }

    if (media) {
      setFormData({
        title: media.title,
        description: media.description || '',
        type: 'video', // Default type since it's not in Media interface yet
        media_url: media.url || '',
        category_id: media.category_id?._id || '',
        author: '', // Not in Media interface yet
        duration: '', // Not in Media interface yet
        is_downloadable: false, // Not in Media interface yet
        thumbnail: media.thumbnail || '',
        isLive: media.isLive,
        isActive: media.isActive || true,
      });
      setError('');
    }
  }, [media, isOpen]);

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
    <div className="fixed inset-0 bg-[#00000093] bg-opacity-50 overflow-y-auto h-full w-full z-50">
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
            <div className="grid grid-cols-1 gap-4 text-black">
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
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Media Type *
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  value={formData.type || 'video'}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={loading}
                >
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                  <option value="live">Live Stream</option>
                </select>
              </div>

              <div>
                <label htmlFor="media_url" className="block text-sm font-medium text-gray-700">
                  Media URL *
                </label>
                <input
                  id="media_url"
                  name="media_url"
                  type="url"
                  required
                  value={formData.media_url || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={loading}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Direct media file URLs, YouTube, Vimeo, or other platform URLs
                </p>
              </div>

              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                  Author
                </label>
                <input
                  id="author"
                  name="author"
                  type="text"
                  value={formData.author || ''}
                  onChange={handleInputChange}
                  placeholder="Pastor John"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                  Duration
                </label>
                <input
                  id="duration"
                  name="duration"
                  type="text"
                  value={formData.duration || ''}
                  onChange={handleInputChange}
                  placeholder="35:00"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={loading}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Format: MM:SS or HH:MM:SS
                </p>
              </div>

              <div>
                <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">
                  Thumbnail URL
                </label>
                <input
                  id="thumbnail"
                  name="thumbnail"
                  type="url"
                  value={formData.thumbnail || ''}
                  onChange={handleInputChange}
                  placeholder="https://example.com/thumbnail.jpg"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                  Category (Optional)
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={loading}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

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
                    id="is_downloadable"
                    name="is_downloadable"
                    type="checkbox"
                    checked={formData.is_downloadable || false}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    disabled={loading}
                  />
                  <label htmlFor="is_downloadable" className="ml-2 block text-sm text-gray-900">
                    Allow downloads
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

              {formData.media_url && validateUrl(formData.media_url) && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Preview:</h4>
                  <div className="text-sm text-gray-600">
                    <p><strong>Title:</strong> {formData.title || 'Untitled'}</p>
                    <p><strong>Type:</strong> {formData.type}</p>
                    <p><strong>URL:</strong> {formData.media_url}</p>
                    <p><strong>Author:</strong> {formData.author || 'N/A'}</p>
                    <p><strong>Duration:</strong> {formData.duration || 'N/A'}</p>
                    <p><strong>Live Stream:</strong> {formData.isLive ? 'Yes' : 'No'}</p>
                    <p><strong>Downloadable:</strong> {formData.is_downloadable ? 'Yes' : 'No'}</p>
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