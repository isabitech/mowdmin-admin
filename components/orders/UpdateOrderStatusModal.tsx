'use client';

import { useState } from 'react';
import { Order, OrderStatus, UpdateOrderStatusData, ORDER_STATUS_CONFIG } from '@/constant/orderTypes';

interface UpdateOrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onSubmit: (data: UpdateOrderStatusData) => void;
  isLoading: boolean;
}

export default function UpdateOrderStatusModal({
  isOpen,
  onClose,
  order,
  onSubmit,
  isLoading,
}: UpdateOrderStatusModalProps) {
  const [formData, setFormData] = useState<UpdateOrderStatusData>({
    status: order?.status || 'pending',
    trackingNumber: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<UpdateOrderStatusData>>({});

  // Reset form when order changes
  if (order && formData.status !== order.status) {
    setFormData({
      status: order.status,
      trackingNumber: '',
      notes: '',
    });
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<UpdateOrderStatusData> = {};

    if (formData.status === 'shipped' && !formData.trackingNumber?.trim()) {
      newErrors.trackingNumber = 'Tracking number is required for shipped orders';
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
        status: order?.status || 'pending',
        trackingNumber: '',
        notes: '',
      });
      setErrors({});
      onClose();
    }
  };

  const handleInputChange = (field: keyof UpdateOrderStatusData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen || !order) return null;

  // Available status transitions based on current status
  const getAvailableStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
    switch (currentStatus) {
      case 'pending':
        return ['paid', 'cancelled'];
      case 'paid':
        return ['shipped', 'cancelled'];
      case 'shipped':
        return ['completed'];
      case 'completed':
        return [];
      case 'cancelled':
        return [];
      default:
        return [];
    }
  };

  const availableStatuses = getAvailableStatuses(order.status);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Update Order Status
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
            <p className="text-sm text-gray-600">Order: <span className="font-medium">#{order._id}</span></p>
            <p className="text-sm text-gray-600">Customer: <span className="font-medium">{order.userId.name}</span></p>
            <p className="text-sm text-gray-600">
              Current Status: 
              <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${ORDER_STATUS_CONFIG[order.status].color}`}>
                {ORDER_STATUS_CONFIG[order.status].label}
              </span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Status Selection */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                New Status *
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as OrderStatus)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              >
                <option value={order.status}>{ORDER_STATUS_CONFIG[order.status].label} (Current)</option>
                {availableStatuses.map((status) => (
                  <option key={status} value={status}>
                    {ORDER_STATUS_CONFIG[status].label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tracking Number (Required for shipped status) */}
            <div>
              <label htmlFor="trackingNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Tracking Number {formData.status === 'shipped' && '*'}
              </label>
              <input
                type="text"
                id="trackingNumber"
                value={formData.trackingNumber}
                onChange={(e) => handleInputChange('trackingNumber', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.trackingNumber ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter tracking number"
                disabled={isLoading}
              />
              {errors.trackingNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.trackingNumber}</p>
              )}
              {formData.status === 'shipped' && (
                <p className="mt-1 text-xs text-gray-500">
                  Tracking number will be sent to the customer
                </p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Internal Notes (Optional)
              </label>
              <textarea
                id="notes"
                rows={3}
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add notes about this status update..."
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-gray-500">
                These notes are for internal use and won&apos;t be visible to the customer
              </p>
            </div>

            {/* Status Change Warning */}
            {formData.status !== order.status && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex">
                  <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="ml-3">
                    <p className="text-sm text-blue-800">
                      The customer will be notified about this status change via email.
                    </p>
                  </div>
                </div>
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
                disabled={isLoading || formData.status === order.status}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}