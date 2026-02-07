'use client';

import { Order, ORDER_STATUS_CONFIG, PAYMENT_STATUS_CONFIG } from '@/constant/orderTypes';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export default function OrderDetailsModal({ isOpen, onClose, order }: OrderDetailsModalProps) {
  if (!isOpen || !order) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusConfig = ORDER_STATUS_CONFIG[order.status];
  const paymentStatusConfig = PAYMENT_STATUS_CONFIG[order.paymentStatus];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h2>
              <div className="flex items-center space-x-3 mt-2">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${paymentStatusConfig.color}`}>
                  Payment: {paymentStatusConfig.label}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Order Items & Summary */}
            <div className="space-y-6">
              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      {item.product.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-12 h-12 rounded-md object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                        <p className="text-sm text-gray-500">{item.product.category}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(item.totalPrice)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(order.totalAmount - order.shippingCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping ({order.shippingMethod}):</span>
                    <span>{formatCurrency(order.shippingCost)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span>{formatCurrency(order.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Customer & Shipping Info */}
            <div className="space-y-6">
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p><span className="font-medium">Name:</span> {order.user.name}</p>
                  <p><span className="font-medium">Email:</span> {order.user.email}</p>
                  {order.user.phone && (
                    <p><span className="font-medium">Phone:</span> {order.user.phone}</p>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && (
                    <p>{order.shippingAddress.addressLine2}</p>
                  )}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && (
                    <p className="mt-2"><span className="font-medium">Phone:</span> {order.shippingAddress.phone}</p>
                  )}
                </div>
              </div>

              {/* Order Timeline */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium">Order Placed</p>
                      <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  
                  {order.status !== 'pending' && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium">Status: {statusConfig.label}</p>
                        <p className="text-sm text-gray-500">{formatDate(order.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                  
                  {order.trackingNumber && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium">Tracking Number Assigned</p>
                        <p className="text-sm text-gray-600 font-mono">{order.trackingNumber}</p>
                      </div>
                    </div>
                  )}
                  
                  {order.cancelledAt && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium">Order Cancelled</p>
                        <p className="text-sm text-gray-500">{formatDate(order.cancelledAt)}</p>
                        {order.cancelReason && (
                          <p className="text-sm text-gray-600">Reason: {order.cancelReason}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p><span className="font-medium">Method:</span> {order.paymentMethod}</p>
                  <p>
                    <span className="font-medium">Status:</span>
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${paymentStatusConfig.color}`}>
                      {paymentStatusConfig.label}
                    </span>
                  </p>
                  <p><span className="font-medium">Amount:</span> {formatCurrency(order.totalAmount)}</p>
                </div>
              </div>

              {/* Notes */}
              {order.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Notes</h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700">{order.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}