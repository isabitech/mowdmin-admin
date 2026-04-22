'use client';

import { useState } from 'react';
import { CreateMinistryData, MINISTRY_TYPE_CONFIG } from '@/constant/ministryTypes';

interface CreateMinistryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: CreateMinistryData) => void;
  isSubmitting: boolean;
}

export default function CreateMinistryModal({
  isOpen,
  onClose,
  onSuccess,
  isSubmitting,
}: CreateMinistryModalProps) {
  const [formData, setFormData] = useState<CreateMinistryData>({
    name: '',
    description: '',
    type: 'worship',
    status: 'active',
    priority: 'medium',
    contactInfo: {
      primaryContact: '',
      email: '',
      phone: '',
    },
    budget: {
      allocated: 0,
      currency: 'USD',
      period: 'yearly',
    },
    goals: [],
    targetAudience: {
      ageRange: { min: undefined, max: undefined },
      gender: 'mixed',
      demographics: [],
    },
    tags: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof CreateMinistryData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleContactChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...(prev.contactInfo || { primaryContact: '', email: '', phone: '' }),
        [field]: value,
      },
    }));
  };

  const handleBudgetChange = (field: string, value: number | string) => {
    setFormData(prev => ({
      ...prev,
      budget: {
        ...(prev.budget || { allocated: 0, currency: 'USD', period: 'yearly' }),
        [field]: value,
      },
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Ministry name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.contactInfo.primaryContact.trim()) newErrors.primaryContact = 'Primary contact is required';
    if (formData.budget && formData.budget.allocated < 0) newErrors.budget = 'Budget cannot be negative';

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Header */}
          <div className="p-8 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-50">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">Create Ministry</h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">New Ministry Profile</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
            <section>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center">
                <span className="w-8 h-[1px] bg-gray-100 mr-3"></span>
                Basic Identification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Ministry Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:bg-white ${errors.name ? 'border-red-200 focus:ring-red-100 text-red-900' : 'border-gray-200 focus:ring-indigo-100 focus:border-indigo-400'
                      }`}
                    placeholder="e.g. Youth Worship Team"
                  />
                  {errors.name && <p className="mt-1.5 text-xs font-bold text-red-500 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    {errors.name}
                  </p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    {Object.entries(MINISTRY_TYPE_CONFIG).map(([type, config]) => (
                      <option key={type} value={type}>
                        {config.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Initial Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="active text-green-600 font-bold">Active</option>
                    <option value="inactive text-gray-600 font-bold">Inactive</option>
                    <option value="paused text-amber-600 font-bold">Paused</option>
                  </select>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center">
                <span className="w-8 h-[1px] bg-gray-100 mr-3"></span>
                Leadership & Outreach
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Primary Contact / Leader
                  </label>
                  <input
                    type="text"
                    value={formData.contactInfo.primaryContact}
                    onChange={(e) => handleContactChange('primaryContact', e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:bg-white ${errors.primaryContact ? 'border-red-200 focus:ring-red-100 text-red-900' : 'border-gray-200 focus:ring-indigo-100 focus:border-indigo-400'
                      }`}
                    placeholder="Enter leader's full name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Priority Level
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="low text-blue-600 font-bold">Low</option>
                    <option value="medium text-amber-600 font-bold">Medium</option>
                    <option value="high text-red-600 font-bold">High Priority</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Ministry Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:bg-white resize-none ${errors.description ? 'border-red-200 focus:ring-red-100 text-red-900' : 'border-gray-200 focus:ring-indigo-100 focus:border-indigo-400'
                      }`}
                    placeholder="Provide a detailed overview of the ministry's mission and regular activities..."
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center">
                <span className="w-8 h-[1px] bg-gray-100 mr-3"></span>
                Operational Details
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 text-indigo-600">
                      Allocated Budget
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">$</span>
                      <input
                        type="number"
                        value={formData.budget?.allocated || ''}
                        onChange={(e) => handleBudgetChange('allocated', Number(e.target.value))}
                        className="w-full pl-8 pr-4 py-3 bg-indigo-50/30 border border-indigo-100 rounded-xl text-sm font-bold text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 focus:bg-white transition-all"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Target Audience Gender
                    </label>
                    <select
                      value={formData.targetAudience?.gender || 'mixed'}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        targetAudience: {
                          ...prev.targetAudience,
                          gender: e.target.value as 'male' | 'female' | 'mixed',
                        },
                      }))}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 focus:bg-white transition-all cursor-pointer"
                    >
                      <option value="mixed">All / Mixed</option>
                      <option value="male">Men Only</option>
                      <option value="female">Women Only</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
            <div className="flex justify-end items-center space-x-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 rounded-xl transition-all disabled:opacity-50 flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  'Create Ministry'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}