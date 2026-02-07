'use client';

import { useState } from 'react';
import { PrayerPoint, PrayerRequest } from '@/constant/prayerTypes';

interface CreatePrayerPointModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePrayerPointData) => void;
  isLoading: boolean;
  prayerRequests: PrayerRequest[];
  editingPoint?: PrayerPoint | null;
}

interface CreatePrayerPointData {
  title: string;
  description: string;
  prayerRequestId?: string;
  category: 'healing' | 'guidance' | 'thanksgiving' | 'protection' | 'provision' | 'salvation' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export default function CreatePrayerPointModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  prayerRequests,
  editingPoint,
}: CreatePrayerPointModalProps) {
  const [formData, setFormData] = useState<CreatePrayerPointData>({
    title: editingPoint?.title || '',
    description: editingPoint?.description || '',
    prayerRequestId: editingPoint?.prayerRequestId || '',
    category: editingPoint?.category || 'general',
    priority: editingPoint?.priority || 'medium',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      return;
    }
    onSubmit(formData);
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        title: '',
        description: '',
        prayerRequestId: '',
        category: 'general',
        priority: 'medium',
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  // Only show approved prayer requests that don't already have prayer points
  const availableRequests = prayerRequests.filter(request => 
    request.status === 'approved'
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingPoint ? 'Edit Prayer Point' : 'Create Prayer Point'}
            </h2>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter prayer point title"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter prayer point description"
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={isLoading}
                >
                  <option value="general">General</option>
                  <option value="healing">Healing</option>
                  <option value="guidance">Guidance</option>
                  <option value="thanksgiving">Thanksgiving</option>
                  <option value="protection">Protection</option>
                  <option value="provision">Provision</option>
                  <option value="salvation">Salvation</option>
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority *
                </label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={isLoading}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            {availableRequests.length > 0 && (
              <div>
                <label htmlFor="prayerRequestId" className="block text-sm font-medium text-gray-700 mb-1">
                  Link to Prayer Request (Optional)
                </label>
                <select
                  id="prayerRequestId"
                  value={formData.prayerRequestId}
                  onChange={(e) => setFormData(prev => ({ ...prev, prayerRequestId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                >
                  <option value="">None - Create independent prayer point</option>
                  {availableRequests.map((request) => (
                    <option key={request.id} value={request.id}>
                      {request.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !formData.title.trim() || !formData.description.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : (editingPoint ? 'Update' : 'Create')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}