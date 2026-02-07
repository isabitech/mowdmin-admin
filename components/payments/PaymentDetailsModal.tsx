'use client';

import { Payment, PAYMENT_STATUS_CONFIG, PAYMENT_TYPE_CONFIG, PAYMENT_METHOD_CONFIG, PAYMENT_GATEWAY_CONFIG } from '@/constant/paymentTypes';

interface PaymentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment | null;
}

export default function PaymentDetailsModal({ isOpen, onClose, payment }: PaymentDetailsModalProps) {
  if (!isOpen || !payment) return null;

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
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

  const statusConfig = PAYMENT_STATUS_CONFIG[payment.status];
  const typeConfig = PAYMENT_TYPE_CONFIG[payment.type];
  const methodConfig = PAYMENT_METHOD_CONFIG[payment.method];
  const gatewayConfig = PAYMENT_GATEWAY_CONFIG[payment.gateway];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
              <p className="text-sm text-gray-600">Transaction #{payment.transactionId}</p>
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
            {/* Left Column - Payment Information */}
            <div className="space-y-6">
              {/* Payment Overview */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Overview</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Amount:</span>
                    <span className="text-xl font-bold">{formatCurrency(payment.amount, payment.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Type:</span>
                    <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${typeConfig.color}`}>
                      <span className="mr-1">{typeConfig.icon}</span>
                      {typeConfig.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Method:</span>
                    <span>{methodConfig.icon} {methodConfig.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Gateway:</span>
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${gatewayConfig.color}`}>
                      {gatewayConfig.label}
                    </span>
                  </div>
                  {payment.gatewayTransactionId && (
                    <div className="flex justify-between">
                      <span className="font-medium">Gateway Transaction ID:</span>
                      <span className="font-mono text-sm">{payment.gatewayTransactionId}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p><span className="font-medium">Name:</span> {payment.user.name}</p>
                  <p><span className="font-medium">Email:</span> {payment.user.email}</p>
                  {payment.user.phone && (
                    <p><span className="font-medium">Phone:</span> {payment.user.phone}</p>
                  )}
                </div>
              </div>

              {/* Related Information */}
              {(payment.orderId || payment.donationId) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    {payment.orderId && (
                      <p><span className="font-medium">Order ID:</span> {payment.orderId}</p>
                    )}
                    {payment.donationId && (
                      <p><span className="font-medium">Donation ID:</span> {payment.donationId}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              {payment.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{payment.description}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Timeline & Details */}
            <div className="space-y-6">
              {/* Payment Timeline */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium">Payment Created</p>
                      <p className="text-sm text-gray-500">{formatDate(payment.createdAt)}</p>
                    </div>
                  </div>
                  
                  {payment.processedAt && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium">Payment Processed</p>
                        <p className="text-sm text-gray-500">{formatDate(payment.processedAt)}</p>
                      </div>
                    </div>
                  )}
                  
                  {payment.refundedAt && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium">Payment Refunded</p>
                        <p className="text-sm text-gray-500">{formatDate(payment.refundedAt)}</p>
                        {payment.refundAmount && (
                          <p className="text-sm text-gray-600">
                            Amount: {formatCurrency(payment.refundAmount, payment.currency)}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium">Last Updated</p>
                      <p className="text-sm text-gray-500">{formatDate(payment.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Refund Information */}
              {payment.refundAmount && payment.refundAmount > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Refund Information</h3>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Refund Amount:</span>
                      <span className="font-semibold text-orange-900">
                        {formatCurrency(payment.refundAmount, payment.currency)}
                      </span>
                    </div>
                    {payment.refundReason && (
                      <div>
                        <span className="font-medium">Reason:</span>
                        <p className="text-sm text-orange-800 mt-1">{payment.refundReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Failure Information */}
              {payment.failureReason && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Failure Information</h3>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">{payment.failureReason}</p>
                  </div>
                </div>
              )}

              {/* Gateway Response */}
              {payment.gatewayResponse && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Gateway Response</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <pre className="text-xs text-gray-700 overflow-auto">
                      {JSON.stringify(payment.gatewayResponse, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Metadata */}
              {payment.metadata && Object.keys(payment.metadata).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <pre className="text-xs text-gray-700 overflow-auto">
                      {JSON.stringify(payment.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Notes */}
              {payment.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Internal Notes</h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">{payment.notes}</p>
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