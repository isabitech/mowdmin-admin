'use client';

import { useState } from 'react';
import ModalWrapper from '../../ModalWrapper';
import {
  CreateGroupData,
  GroupType,
  GroupStatus,
} from '@/constant/groupTypes';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: CreateGroupData) => void;
  isSubmitting: boolean;
}

export default function CreateGroupModal({
  isOpen,
  onClose,
  onSuccess,
  isSubmitting,
}: CreateGroupModalProps) {
  const [formData, setFormData] = useState<CreateGroupData>({
    name: '',
    description: '',
    type: 'small_group',
    status: 'planning',
    isPublic: true,
    meetingSchedule: {
      frequency: 'weekly',
      isVirtual: false,
    },
    contactInfo: {
      primaryContact: '',
    },
    tags: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(formData);
  };

  if (!isOpen) return null;

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl flex flex-col max-h-[90vh]">

        {/* Header (Fixed) */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Create New Group
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6"
        >
          <div className="space-y-6">

            {/* Core Identity */}
            <section>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                Core Identity
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
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-gray-900"
                    placeholder="e.g., Young Professionals Bible Study"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Group Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as GroupType,
                      })
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
                    Initial Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as GroupStatus,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-gray-900"
                  >
                    <option value="planning">Planning</option>
                    <option value="active">Active</option>
                    <option value="on_hold">On Hold</option>
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
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-gray-900"
                placeholder="What is the purpose of this group?"
              />
            </section>

            {/* Contact & Access */}
            <section>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                Contact & Access
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Primary Contact *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactInfo.primaryContact}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactInfo: {
                          ...formData.contactInfo,
                          primaryContact: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-gray-900"
                    placeholder="Contact name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Max Members
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxMembers || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxMembers: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-gray-900"
                    placeholder="Unlimited"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isPublic: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer-checked:bg-blue-600 relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                  <span className="ml-3 text-sm font-semibold text-gray-700">
                    Make group visible to the public
                  </span>
                </label>
              </div>
            </section>
          </div>
        </form>

        {/* Footer (Fixed) */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end space-x-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-all"
          >
            Discard
          </button>

          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none rounded-lg transition-all"
          >
            {isSubmitting ? 'Creating...' : 'Create Group'}
          </button>
        </div>

      </div>
    </ModalWrapper>
  );
}