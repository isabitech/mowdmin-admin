'use client';

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
  const formatCurrency = (amount: { $numberDecimal: string }) => {
    const numericAmount = parseFloat(amount.$numberDecimal);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numericAmount);
  };

  const formatDate = (dateString: string) => {
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <h3 className="text-sm font-medium text-gray-900">#{order._id.slice(-8)}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div>
                <span className="font-medium">{order.userId.name}</span>
                <span className="mx-2">•</span>
                <span>{order.userId.email}</span>
              </div>
              <span>{formatDate(order.createdAt)}</span>
            </div>
            
            <div className="mt-2 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                {order.items.length} item{order.items.length > 1 ? 's' : ''}
                <span className="ml-2">• {order.shippingAddress}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onView(order)}
                  className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
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
                    className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
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
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onView(order)}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
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
                className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
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
                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
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
        <div className="mb-3">
          <h3 className="text-lg font-medium text-gray-900 mb-1">#{order._id.slice(-8)}</h3>
          <p className="text-sm text-gray-600">{order.userId.name}</p>
          <p className="text-xs text-gray-500">{order.userId.email}</p>
        </div>

        {/* Status Badge */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        </div>

        {/* Order Details */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Total:</span>
            <span className="font-semibold">{formatCurrency(order.totalAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Items:</span>
            <span>{order.items.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span>{formatDate(order.createdAt)}</span>
          </div>
        </div>

        {/* Shipping Address Summary */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 truncate">
            Ship to: {order.shippingAddress}
          </p>
        </div>
      </div>
    </div>
  );
}