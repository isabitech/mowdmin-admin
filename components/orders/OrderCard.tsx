'use client';

import { useEffect, useState } from 'react';
import { Order, ORDER_STATUS_CONFIG } from '@/constant/orderTypes';

interface OrderCardProps {
  order: Order;
  viewMode: 'grid' | 'list';
  isSelected: boolean;
  onSelect: (isSelected: boolean) => void;
  onView: (order: Order) => void;
  onUpdateStatus: (order: Order) => void;
  onCancel: (order: Order) => void;
}

export default function OrderCard({
  order,
  viewMode,
  isSelected,
  onSelect,
  onView,
  onUpdateStatus,
  onCancel,
}: OrderCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatCurrency = (amount: { $numberDecimal: string }) => {
    const numericAmount = parseFloat(amount.$numberDecimal);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numericAmount);
  };

  const formatDate = (dateString: string) => {
    if (!mounted) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusConfig = ORDER_STATUS_CONFIG[order.status];

  const canCancel = ['pending', 'paid'].includes(order.status);
  const canUpdateStatus = !['cancelled', 'completed'].includes(order.status);

  if (viewMode === 'list') {
    return (
      <div className={`group relative bg-white rounded-xl shadow-sm border p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${isSelected ? 'border-blue-400 ring-1 ring-blue-400 shadow-blue-100/50' : 'border-gray-100/80 hover:border-gray-200'}`}>
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(e.target.checked)}
            className="rounded border-gray-300 w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer transition-colors"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">#{order._id.slice(-8)}</h3>
                <span className={`inline-flex px-2.5 py-1 text-[11px] font-semibold rounded-full ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
              </div>
              <span className="text-base font-bold text-gray-900">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center">
                <span className="font-medium text-gray-800">{order.userId.name}</span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-gray-500">{order.userId.email}</span>
              </div>
              <span className="text-gray-500">{formatDate(order.createdAt)}</span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 flex items-center inline-flex">
                <span className="font-medium text-gray-700">{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="truncate max-w-[200px]">{order.shippingAddress}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onView(order)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 hover:shadow-sm rounded-lg transition-all duration-200"
                  title="View details"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>

                {canUpdateStatus && (
                  <button
                    onClick={() => onUpdateStatus(order)}
                    className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 hover:shadow-sm rounded-lg transition-all duration-200"
                    title="Update status"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}

                {canCancel && (
                  <button
                    onClick={() => onCancel(order)}
                    className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 hover:shadow-sm rounded-lg transition-all duration-200"
                    title="Cancel order"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className={`group relative bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${isSelected ? 'border-blue-400 ring-1 ring-blue-400 shadow-blue-100/50' : 'border-gray-100/80 hover:border-gray-200'}`}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(e.target.checked)}
            className="rounded border-gray-300 w-4 h-4 text-blue-600 focus:ring-blue-500 mt-1 cursor-pointer transition-colors"
          />
          <div className="flex items-center space-x-1 bg-gray-50/50 p-1 rounded-lg border border-gray-100/50">
            <button
              onClick={() => onView(order)}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 hover:shadow-sm rounded-md transition-all duration-200"
              title="View details"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>

            {canUpdateStatus && (
              <button
                onClick={() => onUpdateStatus(order)}
                className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 hover:shadow-sm rounded-md transition-all duration-200"
                title="Update status"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}

            {canCancel && (
              <button
                onClick={() => onCancel(order)}
                className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 hover:shadow-sm rounded-md transition-all duration-200"
                title="Cancel order"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Order Header */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">#{order._id.slice(-8)}</h3>
          <p className="text-sm font-medium text-gray-800">{order.userId.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">{order.userId.email}</p>
        </div>

        {/* Status Badge */}
        <div className="mt-2 mb-4">
          <span className={`inline-flex px-2.5 py-1 text-[11px] font-semibold rounded-full ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        </div>

        {/* Order Details */}
        <div className="space-y-2.5 text-sm bg-gray-50/50 p-3 rounded-lg">
          <div className="flex justify-between items-center text-gray-600">
            <span>Total:</span>
            <span className="font-bold text-gray-900 text-base">{formatCurrency(order.totalAmount)}</span>
          </div>
          <div className="flex justify-between items-center text-gray-600">
            <span>Items:</span>
            <span className="font-medium text-gray-800">{order.items.length}</span>
          </div>
          <div className="flex justify-between items-center text-gray-600">
            <span>Date:</span>
            <span className="font-medium text-gray-800">{formatDate(order.createdAt)}</span>
          </div>
        </div>

        {/* Shipping Address Summary */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-start gap-2">
          <svg className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-[13px] text-gray-500 leading-tight line-clamp-2">
            {order.shippingAddress}
          </p>
        </div>
      </div>
    </div>
  );
}