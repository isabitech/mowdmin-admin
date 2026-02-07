'use client';

import { useState, useEffect } from 'react';
import { Group, UpdateGroupData, GroupType, GroupStatus } from '@/constant/groupTypes';

interface EditGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group;
  onSuccess: (data: UpdateGroupData) => void;
  isSubmitting: boolean;
}

export default function EditGroupModal({ isOpen, onClose, group, onSuccess, isSubmitting }: EditGroupModalProps) {
  const [formData, setFormData] = useState<UpdateGroupData>({
    name: group.name,
    description: group.description,
    type: group.type,
    status: group.status,
    isPublic: group.isPublic,
    maxMembers: group.maxMembers,
    meetingSchedule: group.meetingSchedule,
    contactInfo: group.contactInfo,
    tags: group.tags,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: group.name,
        description: group.description,
        type: group.type,
        status: group.status,
        isPublic: group.isPublic,
        maxMembers: group.maxMembers,
        meetingSchedule: group.meetingSchedule,
        contactInfo: group.contactInfo,
        tags: group.tags,
      });
    }
  }, [isOpen, group]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Edit Group - {group.name}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as GroupType})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="small_group">Small Group</option>
                  <option value="ministry_team">Ministry Team</option>
                  <option value="bible_study">Bible Study</option>
                  <option value="youth_group">Youth Group</option>
                  <option value="committee">Committee</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                required
                rows={3}
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as GroupStatus})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on_hold">On Hold</option>
                  <option value="planning">Planning</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Members</label>
                <input
                  type="number"
                  min="1"
                  value={formData.maxMembers || ''}
                  onChange={(e) => setFormData({...formData, maxMembers: e.target.value ? parseInt(e.target.value) : undefined})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => setFormData({...formData, isPublic: e.target.checked})}
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="text-sm text-gray-700">Public Group</label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-md"
              >
                {isSubmitting ? 'Updating...' : 'Update Group'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}