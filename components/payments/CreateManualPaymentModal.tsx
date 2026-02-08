'use client';

import { useState } from 'react';
import { PaymentType, PaymentMethod, PAYMENT_TYPE_CONFIG, PAYMENT_METHOD_CONFIG } from '@/constant/paymentTypes';

interface CreateManualPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

interface ManualPaymentData {
  userId: string;
  userEmail: string;
  amount: number;
  currency: string;
  type: PaymentType;
  method: PaymentMethod;
  description: string;
  orderId?: string;
  donationId?: string;
  notes?: string;
}

interface ManualPaymentDataErrors {
  userId?: string;
  userEmail?: string;
  amount?: string;
  currency?: string;
  type?: string;
  method?: string;
  description?: string;
  orderId?: string;
  donationId?: string;
  notes?: string;
}

export default function CreateManualPaymentModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: CreateManualPaymentModalProps) {
  const [formData, setFormData] = useState<ManualPaymentData>({
    userId: '',
    userEmail: '',
    amount: 0,
    currency: 'USD',
    type: 'other',
    method: 'cash',
    description: '',
    orderId: '',
    donationId: '',
    notes: '',
  });

  const [errors, setErrors] = useState<ManualPaymentDataErrors>({});
  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'NGN'];

  const validateForm = (): boolean => {
    const newErrors: ManualPaymentDataErrors = {};

    if (!formData.userEmail.trim()) {
      newErrors.userEmail = 'Customer email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail)) {
      newErrors.userEmail = 'Please enter a valid email address';
    }

    if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Payment description is required';
    }

    if (formData.type === 'order' && !formData.orderId?.trim()) {
      newErrors.orderId = 'Order ID is required for order payments';
    }

    if (formData.type === 'donation' && !formData.donationId?.trim()) {
      newErrors.donationId = 'Donation ID is required for donation payments';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Convert form data to match API expectations
      const submitData = {
        ...formData,
        userId: formData.userId || undefined, // Let backend create user if needed
      };
      onSubmit(submitData);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        userId: '',
        userEmail: '',
        amount: 0,
        currency: 'USD',
        type: 'other',
        method: 'cash',
        description: '',
        orderId: '',
        donationId: '',
        notes: '',
      });
      setErrors({});
      onClose();
    }
  };

  const handleInputChange = (field: keyof ManualPaymentData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof ManualPaymentDataErrors]) {
      setErrors(prev => ({ ...prev, [field as keyof ManualPaymentDataErrors]: undefined }));
    }
  };

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Create Manual Payment
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

          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex">
              <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">
                  Manual Payment Entry
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Use this form to record offline payments like cash, checks, or payments processed outside the system.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900 border-b pb-2">Customer Information</h3>
              
              {/* Customer Email */}
              <div>
                <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Email *
                </label>
                <input
                  type="email"
                  id="userEmail"
                  value={formData.userEmail}
                  onChange={(e) => handleInputChange('userEmail', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.userEmail ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="customer@example.com"
                  disabled={isLoading}
                />
                {errors.userEmail && (
                  <p className="mt-1 text-sm text-red-600">{errors.userEmail}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  If customer doesn&apos;t exist, a new customer record will be created
                </p>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900 border-b pb-2">Payment Details</h3>
              
              {/* Amount and Currency */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Amount *
                  </label>
                  <input
                    type="number"
                    id="amount"
                    min="0"
                    step="0.01"
                    value={formData.amount || ''}
                    onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.amount ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                    disabled={isLoading}
                  />
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    id="currency"
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLoading}
                  >
                    {currencies.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Payment Type */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Type *
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value as PaymentType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                >
                  {Object.entries(PAYMENT_TYPE_CONFIG).map(([type, config]) => (
                    <option key={type} value={type}>
                      {config.icon} {config.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Method */}
              <div>
                <label htmlFor="method" className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method *
                </label>
                <select
                  id="method"
                  value={formData.method}
                  onChange={(e) => handleInputChange('method', e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                >
                  {Object.entries(PAYMENT_METHOD_CONFIG).map(([method, config]) => (
                    <option key={method} value={method}>
                      {config.icon} {config.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Description *
                </label>
                <textarea
                  id="description"
                  rows={2}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Describe what this payment is for..."
                  disabled={isLoading}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>
            </div>

            {/* Related Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900 border-b pb-2">Related Information (Optional)</h3>
              
              {/* Order ID (if payment type is order) */}
              {formData.type === 'order' && (
                <div>
                  <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">
                    Order ID *
                  </label>
                  <input
                    type="text"
                    id="orderId"
                    value={formData.orderId || ''}
                    onChange={(e) => handleInputChange('orderId', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.orderId ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter the related order ID"
                    disabled={isLoading}
                  />
                  {errors.orderId && (
                    <p className="mt-1 text-sm text-red-600">{errors.orderId}</p>
                  )}
                </div>
              )}

              {/* Donation ID (if payment type is donation) */}
              {formData.type === 'donation' && (
                <div>
                  <label htmlFor="donationId" className="block text-sm font-medium text-gray-700 mb-1">
                    Donation ID *
                  </label>
                  <input
                    type="text"
                    id="donationId"
                    value={formData.donationId || ''}
                    onChange={(e) => handleInputChange('donationId', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.donationId ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter the related donation ID"
                    disabled={isLoading}
                  />
                  {errors.donationId && (
                    <p className="mt-1 text-sm text-red-600">{errors.donationId}</p>
                  )}
                </div>
              )}

              {/* Internal Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Internal Notes
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={formData.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add any internal notes or additional details..."
                  disabled={isLoading}
                />
                <p className="mt-1 text-xs text-gray-500">
                  These notes are for internal use and won&apos;t be visible to the customer
                </p>
              </div>
            </div>

            {/* Payment Summary */}
            {formData.amount > 0 && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                <p className="text-sm font-medium text-gray-900">Payment Summary:</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(formData.amount, formData.currency)}
                </p>
                <p className="text-sm text-gray-600">
                  {PAYMENT_METHOD_CONFIG[formData.method].icon} {PAYMENT_METHOD_CONFIG[formData.method].label} • {PAYMENT_TYPE_CONFIG[formData.type].label}
                </p>
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
                disabled={isLoading || !formData.userEmail || formData.amount <= 0 || !formData.description}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Creating...' : 'Create Payment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}