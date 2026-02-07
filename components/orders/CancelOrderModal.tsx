'use client';

import { useState } from 'react';
import { Order, CancelOrderData } from '@/constant/orderTypes';

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onSubmit: (data: CancelOrderData) => void;
  isLoading: boolean;
}

export default function CancelOrderModal({
  isOpen,
  onClose,
  order,
  onSubmit,
  isLoading,
}: CancelOrderModalProps) {
  const [formData, setFormData] = useState<CancelOrderData>({
    reason: '',
    refundAmount: order?.totalAmount || 0,
    notifyCustomer: true,
  });

  const [errors, setErrors] = useState<Partial<CancelOrderData>>({});

  // Reset form when order changes
  if (order && formData.refundAmount !== order.totalAmount) {
    setFormData({
      reason: '',
      refundAmount: order.totalAmount,
      notifyCustomer: true,
    });
  }

  const cancelReasons = [
    'Customer requested cancellation',
    'Item out of stock',
    'Payment failed',
    'Address verification failed',
    'Duplicate order',
    'Fraudulent order',
    'Unable to fulfill',
    'Other',
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<CancelOrderData> = {};

    if (!formData.reason.trim()) {
      newErrors.reason = 'Cancellation reason is required';
    }

    if (formData.refundAmount !== undefined && formData.refundAmount < 0) {
      newErrors.refundAmount = 'Refund amount cannot be negative';
    }

    if (formData.refundAmount !== undefined && order && formData.refundAmount > order.totalAmount) {
      newErrors.refundAmount = 'Refund amount cannot exceed order total';
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
        reason: '',
        refundAmount: order?.totalAmount || 0,
        notifyCustomer: true,
      });
      setErrors({});
      onClose();
    }
  };

  const handleInputChange = (field: keyof CancelOrderData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (!isOpen || !order) return null;

  const canRefund = ['pending', 'confirmed', 'processing'].includes(order.status);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Cancel Order
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
                  Order #{order.orderNumber} will be permanently cancelled.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Order: <span className="font-medium">#{order.orderNumber}</span></p>
            <p className="text-sm text-gray-600">Customer: <span className="font-medium">{order.user.name}</span></p>
            <p className="text-sm text-gray-600">Total: <span className="font-medium">{formatCurrency(order.totalAmount)}</span></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Cancellation Reason */}
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                Cancellation Reason *
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
                {cancelReasons.map((reason) => (
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
                  placeholder="Enter the specific reason for cancellation..."
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Refund Amount */}
            {canRefund && (
              <div>
                <label htmlFor="refundAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Refund Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="refundAmount"
                    min="0"
                    max={order.totalAmount}
                    step="0.01"
                    value={formData.refundAmount || ''}
                    onChange={(e) => handleInputChange('refundAmount', parseFloat(e.target.value) || 0)}
                    className={`w-full pl-8 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.refundAmount ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                    disabled={isLoading}
                  />
                </div>
                {errors.refundAmount && (
                  <p className="mt-1 text-sm text-red-600">{errors.refundAmount}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Maximum refund: {formatCurrency(order.totalAmount)}
                </p>
              </div>
            )}

            {/* Notify Customer */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id="notifyCustomer"
                  checked={formData.notifyCustomer}
                  onChange={(e) => handleInputChange('notifyCustomer', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>
              <div className="ml-3">
                <label htmlFor="notifyCustomer" className="text-sm font-medium text-gray-700">
                  Notify customer about cancellation
                </label>
                <p className="text-xs text-gray-500">
                  Send an email notification to the customer about this cancellation
                </p>
              </div>
            </div>

            {/* Cancellation Impact Warning */}
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
                    <li>Mark the order as cancelled</li>
                    {canRefund && formData.refundAmount && formData.refundAmount > 0 && (
                      <li>Process a refund of {formatCurrency(formData.refundAmount || 0)}</li>
                    )}
                    <li>Return inventory to stock</li>
                    {formData.notifyCustomer && <li>Send cancellation email to customer</li>}
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
                Keep Order
              </button>
              <button
                type="submit"
                disabled={isLoading || !formData.reason.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Cancelling...' : 'Cancel Order'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}