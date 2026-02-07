'use client';

import { useState } from 'react';
import { Payment, RefundPaymentData } from '@/constant/paymentTypes';

interface RefundPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment | null;
  onSubmit: (data: RefundPaymentData) => void;
  isLoading: boolean;
}

export default function RefundPaymentModal({
  isOpen,
  onClose,
  payment,
  onSubmit,
  isLoading,
}: RefundPaymentModalProps) {
  const [formData, setFormData] = useState<RefundPaymentData>({
    amount: payment?.amount || 0,
    reason: '',
    notifyCustomer: true,
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<RefundPaymentData>>({});

  // Reset form when payment changes
  if (payment && formData.amount !== payment.amount) {
    setFormData({
      amount: payment.amount,
      reason: '',
      notifyCustomer: true,
      notes: '',
    });
  }

  const refundReasons = [
    'Customer requested refund',
    'Duplicate payment',
    'Order cancelled',
    'Item not delivered',
    'Item defective or damaged',
    'Service not provided',
    'Billing error',
    'Fraudulent transaction',
    'Other',
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<RefundPaymentData> = {};

    if (!formData.reason.trim()) {
      newErrors.reason = 'Refund reason is required';
    }

    if (formData.amount !== undefined && formData.amount <= 0) {
      newErrors.amount = 'Refund amount must be greater than 0';
    }

    if (formData.amount !== undefined && payment && formData.amount > payment.amount) {
      newErrors.amount = 'Refund amount cannot exceed original payment amount';
    }

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
        amount: payment?.amount || 0,
        reason: '',
        notifyCustomer: true,
        notes: '',
      });
      setErrors({});
      onClose();
    }
  };

  const handleInputChange = (field: keyof RefundPaymentData, value: any) => {
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

  const maxRefundAmount = payment.amount - (payment.refundAmount || 0);
  const isPartialRefund = formData.amount !== undefined && formData.amount < payment.amount;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Refund Payment
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

          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  Warning: This action cannot be undone
                </p>
                <p className="text-sm text-red-700 mt-1">
                  The refund will be processed through the original payment method.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Transaction: <span className="font-medium">#{payment.transactionId}</span></p>
            <p className="text-sm text-gray-600">Customer: <span className="font-medium">{payment.user.name}</span></p>
            <p className="text-sm text-gray-600">Original Amount: <span className="font-medium">{formatCurrency(payment.amount, payment.currency)}</span></p>
            {payment.refundAmount && payment.refundAmount > 0 && (
              <p className="text-sm text-gray-600">Previously Refunded: <span className="font-medium">{formatCurrency(payment.refundAmount, payment.currency)}</span></p>
            )}
            <p className="text-sm text-gray-600">Available for Refund: <span className="font-medium">{formatCurrency(maxRefundAmount, payment.currency)}</span></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Refund Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Refund Amount *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  id="amount"
                  min="0"
                  max={maxRefundAmount}
                  step="0.01"
                  value={formData.amount || ''}
                  onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                  className={`w-full pl-8 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.amount ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                  disabled={isLoading}
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Maximum refund: {formatCurrency(maxRefundAmount, payment.currency)}
              </p>
              <div className="mt-2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => handleInputChange('amount', maxRefundAmount)}
                  className="text-xs px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                  disabled={isLoading}
                >
                  Full Refund
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('amount', maxRefundAmount / 2)}
                  className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                  disabled={isLoading}
                >
                  50% Refund
                </button>
              </div>
            </div>

            {/* Refund Reason */}
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                Refund Reason *
              </label>
              <select
                id="reason"
                value={formData.reason}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.reason ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isLoading}
              >
                <option value="">Select a reason...</option>
                {refundReasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
              {errors.reason && (
                <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
              )}
            </div>

            {/* Custom reason input if "Other" is selected */}
            {formData.reason === 'Other' && (
              <div>
                <label htmlFor="customReason" className="block text-sm font-medium text-gray-700 mb-1">
                  Please specify the reason *
                </label>
                <textarea
                  id="customReason"
                  rows={3}
                  value={formData.reason === 'Other' ? '' : formData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter the specific reason for refund..."
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Internal Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Internal Notes (Optional)
              </label>
              <textarea
                id="notes"
                rows={3}
                value={formData.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add internal notes about this refund..."
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-gray-500">
                These notes are for internal use and won't be visible to the customer
              </p>
            </div>

            {/* Notify Customer */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id="notifyCustomer"
                  checked={formData.notifyCustomer || false}
                  onChange={(e) => handleInputChange('notifyCustomer', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>
              <div className="ml-3">
                <label htmlFor="notifyCustomer" className="text-sm font-medium text-gray-700">
                  Notify customer about refund
                </label>
                <p className="text-xs text-gray-500">
                  Send an email notification to the customer about this refund
                </p>
              </div>
            </div>

            {/* Refund Impact Information */}
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex">
                <svg className="w-5 h-5 text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">
                    <strong>This will:</strong>
                  </p>
                  <ul className="text-sm text-yellow-700 mt-1 list-disc list-inside">
                    <li>Process a {isPartialRefund ? 'partial' : 'full'} refund of {formatCurrency(formData.amount || 0, payment.currency)}</li>
                    <li>Update the payment status to {isPartialRefund ? 'partially refunded' : 'refunded'}</li>
                    <li>Send refund to the original payment method</li>
                    {formData.notifyCustomer && <li>Send refund notification email to customer</li>}
                  </ul>
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
                disabled={isLoading || !formData.reason.trim() || !formData.amount || formData.amount <= 0}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : `Refund ${formatCurrency(formData.amount || 0, payment.currency)}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}