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
        ...prev.contactInfo,
        [field]: value,
      },
    }));
  };

  const handleBudgetChange = (field: string, value: number | string) => {
    setFormData(prev => ({
      ...prev,
      budget: {
        ...prev.budget!,
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Create New Ministry</h2>
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

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ministry Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${
                    errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Enter ministry name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ministry Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {Object.entries(MINISTRY_TYPE_CONFIG).map(([type, config]) => (
                    <option key={type} value={type}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Contact *
                </label>
                <input
                  type="text"
                  value={formData.contactInfo.primaryContact}
                  onChange={(e) => handleContactChange('primaryContact', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${
                    errors.primaryContact ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Enter primary contact name"
                />
                {errors.primaryContact && <p className="mt-1 text-sm text-red-600">{errors.primaryContact}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="paused">Paused</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${
                  errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Describe the ministry's purpose and activities"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Contact Information & Budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={formData.contactInfo.email || ''}
                  onChange={(e) => handleContactChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter contact email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={formData.contactInfo.phone || ''}
                  onChange={(e) => handleContactChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter contact phone"
                />
              </div>
            </div>

            {/* Budget Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Budget Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allocated Amount
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.budget?.allocated || 0}
                    onChange={(e) => handleBudgetChange('allocated', Number(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${
                      errors.budget ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Enter budget amount"
                  />
                  {errors.budget && <p className="mt-1 text-sm text-red-600">{errors.budget}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={formData.budget?.currency || 'USD'}
                    onChange={(e) => handleBudgetChange('currency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CAD">CAD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Period
                  </label>
                  <select
                    value={formData.budget?.period || 'yearly'}
                    onChange={(e) => handleBudgetChange('period', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Target Audience */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Target Audience</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="mixed">Mixed</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Age
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={formData.targetAudience?.ageRange?.min || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      targetAudience: {
                        ...prev.targetAudience,
                        ageRange: {
                          ...prev.targetAudience?.ageRange,
                          min: e.target.value ? Number(e.target.value) : undefined,
                        },
                      },
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Min age"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Age
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={formData.targetAudience?.ageRange?.max || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      targetAudience: {
                        ...prev.targetAudience,
                        ageRange: {
                          ...prev.targetAudience?.ageRange,
                          max: e.target.value ? Number(e.target.value) : undefined,
                        },
                      },
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Max age"
                  />
                </div>
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
                {isSubmitting ? 'Creating...' : 'Create Ministry'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}