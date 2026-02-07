'use client';

import { useState } from 'react';
import { Payment, ProcessPaymentData } from '@/constant/paymentTypes';

interface ProcessPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment | null;
  onSubmit: (data: ProcessPaymentData) => void;
  isLoading: boolean;
}

export default function ProcessPaymentModal({
  isOpen,
  onClose,
  payment,
  onSubmit,
  isLoading,
}: ProcessPaymentModalProps) {
  const [formData, setFormData] = useState<ProcessPaymentData>({
    gatewayTransactionId: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<ProcessPaymentData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ProcessPaymentData> = {};

    // Gateway transaction ID is optional but should be provided for better tracking
    // No required validations for now

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        gatewayTransactionId: '',
        notes: '',
      });
      setErrors({});
      onClose();
    }
  };

  const handleInputChange = (field: keyof ProcessPaymentData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  if (!isOpen || !payment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Process Payment
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

          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Transaction: <span className="font-medium">#{payment.transactionId}</span></p>
            <p className="text-sm text-gray-600">Customer: <span className="font-medium">{payment.user.name}</span></p>
            <p className="text-sm text-gray-600">Amount: <span className="font-medium">{formatCurrency(payment.amount, payment.currency)}</span></p>
            <p className="text-sm text-gray-600">Gateway: <span className="font-medium">{payment.gateway}</span></p>
            <p className="text-sm text-gray-600">
              Current Status: 
              <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                Pending
              </span>
            </p>
          </div>

          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex">
              <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">
                  Processing Payment
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  This will mark the payment as successfully processed and completed.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Gateway Transaction ID */}
            <div>
              <label htmlFor="gatewayTransactionId" className="block text-sm font-medium text-gray-700 mb-1">
                Gateway Transaction ID (Optional)
              </label>
              <input
                type="text"
                id="gatewayTransactionId"
                value={formData.gatewayTransactionId || ''}
                onChange={(e) => handleInputChange('gatewayTransactionId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.gatewayTransactionId ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter gateway transaction ID..."
                disabled={isLoading}
              />
              {errors.gatewayTransactionId && (
                <p className="mt-1 text-sm text-red-600">{errors.gatewayTransactionId}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Transaction ID from the payment gateway for tracking and reconciliation
              </p>
            </div>

            {/* Processing Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Processing Notes (Optional)
              </label>
              <textarea
                id="notes"
                rows={3}
                value={formData.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add notes about this payment processing..."
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-gray-500">
                These notes are for internal use and tracking purposes
              </p>
            </div>

            {/* Processing Impact Information */}
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex">
                <svg className="w-5 h-5 text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-green-800">
                    <strong>This will:</strong>
                  </p>
                  <ul className="text-sm text-green-700 mt-1 list-disc list-inside">
                    <li>Mark the payment as completed</li>
                    <li>Update the payment status to 'completed'</li>
                    <li>Send confirmation email to the customer</li>
                    <li>Complete any related order or donation processing</li>
                    <li>Record the processing timestamp</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Warning for manual processing */}
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex">
                <svg className="w-5 h-5 text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> Only process payments that have been confirmed as successful
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Verify that the payment has actually been received before marking it as completed.
                  </p>
                </div>
              </div>
            </div>

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
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Process Payment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}