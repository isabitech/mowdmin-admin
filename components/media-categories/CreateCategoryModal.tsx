'use client';

import { useState } from 'react';
import { CreateCategoryRequest } from '@/services/mediaCategoryService';

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryData: CreateCategoryRequest) => Promise<void>;
}

const suggestedCategories = [
  { name: 'Sermons', description: 'Sunday sermons and teaching messages', icon: '📖' },
  { name: 'Worship', description: 'Worship songs and music performances', icon: '🎵' },
  { name: 'Testimonies', description: 'Personal testimonies and life stories', icon: '💬' },
  { name: 'Events', description: 'Church events and special occasions', icon: '📅' },
  { name: 'Teachings', description: 'Bible studies and educational content', icon: '🎓' },
  { name: 'Prayer', description: 'Prayer sessions and spiritual content', icon: '🙏' },
  { name: 'Youth', description: 'Youth ministry and young adult content', icon: '👨‍👩‍👧‍👦' },
  { name: 'Children', description: 'Children\'s ministry and family content', icon: '👶' },
];

export default function CreateCategoryModal({ isOpen, onClose, onSave }: CreateCategoryModalProps) {
  const [formData, setFormData] = useState<CreateCategoryRequest>({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSave(formData);
      resetForm();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSuggestedCategoryClick = (suggested: typeof suggestedCategories[0]) => {
    setFormData({
      name: suggested.name,
      description: suggested.description,
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Add New Category</h3>
            <button
              onClick={handleClose}
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

          {/* Suggested Categories */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Add (Click to use)</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {suggestedCategories.map((suggested) => (
                <button
                  key={suggested.name}
                  type="button"
                  onClick={() => handleSuggestedCategoryClick(suggested)}
                  className="p-2 text-xs border border-gray-200 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  disabled={loading}
                >
                  <div className="text-lg mb-1">{suggested.icon}</div>
                  <div className="font-medium">{suggested.name}</div>
                </button>
              ))}
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Category Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Sermons, Worship, Events"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of what content this category will contain..."
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                disabled={loading}
              />
            </div>

            {formData.name && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Preview:</h4>
                <div className="text-sm text-gray-600">
                  <p><strong>Name:</strong> {formData.name}</p>
                  {formData.description && (
                    <p><strong>Description:</strong> {formData.description}</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                disabled={loading || !formData.name.trim()}
              >
                {loading ? 'Creating...' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}