'use client';

import { useState, useEffect } from 'react';
import ModalWrapper from '../../ModalWrapper';
import {
  Group,
  UpdateGroupData,
  GroupType,
  GroupStatus,
} from '@/constant/groupTypes';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  group: Group;
  onSuccess: (data: UpdateGroupData) => void;
  isSubmitting: boolean;
}

export default function EditGroupModal({
  isOpen,
  onClose,
  group,
  onSuccess,
  isSubmitting,
}: Props) {
  const [formData, setFormData] = useState<UpdateGroupData>({
    name: '',
    description: '',
    type: 'small_group',
    status: 'active',
    isPublic: false,
  });

  useEffect(() => {
    if (isOpen && group) {
      setFormData({
        name: group.name || '',
        description: group.description || '',
        type: group.type,
        status: group.status,
        isPublic: group.isPublic ?? false,
        maxMembers: group.maxMembers,
        meetingSchedule: group.meetingSchedule,
        contactInfo: group.contactInfo,
        tags: group.tags,
      });
    }
  }, [group, isOpen]);

  const updateField = (key: keyof UpdateGroupData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(formData);
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl flex flex-col max-h-[90vh]">

        {/* Header (Fixed) */}
        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
          <h3 className="text-lg text-black font-bold">Edit Group</h3>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Scrollable Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6"
        >
          <div className="space-y-6">

            {/* Basic Info */}
            <section>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                Basic Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Group Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-gray-900"
                    placeholder="Enter group name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      updateField('type', e.target.value as GroupType)
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-gray-900"
                  >
                    <option value="small_group">Small Group</option>
                    <option value="ministry_team">Ministry Team</option>
                    <option value="bible_study">Bible Study</option>
                    <option value="youth_group">Youth Group</option>
                    <option value="committee">Committee</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      updateField('status', e.target.value as GroupStatus)
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-gray-900"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on_hold">On Hold</option>
                    <option value="planning">Planning</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Description */}
            <section>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Description *
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  updateField('description', e.target.value)
                }
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-gray-900"
                placeholder="Tell us about this group..."
              />
            </section>

            {/* Settings */}
            <section>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                Settings & Limits
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Max Members
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxMembers || ''}
                    onChange={(e) =>
                      updateField(
                        'maxMembers',
                        e.target.value
                          ? parseInt(e.target.value)
                          : undefined
                      )
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-gray-900"
                    placeholder="No limit"
                  />
                </div>

                <div className="flex items-center pt-8">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPublic}
                      onChange={(e) =>
                        updateField('isPublic', e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer-checked:bg-blue-600 relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    <span className="ml-3 text-sm font-semibold text-gray-700">
                      Make this group public
                    </span>
                  </label>
                </div>
              </div>
            </section>
          </div>
        </form>

        {/* Footer (Fixed) */}
        <div className="px-6 py-4 border-t flex justify-end space-x-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-all"
          >
            Cancel
          </button>

          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none rounded-lg transition-all"
          >
            {isSubmitting ? 'Saving Changes...' : 'Save Group Changes'}
          </button>
        </div>

      </div>
    </ModalWrapper>
  );
}