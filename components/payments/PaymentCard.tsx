'use client';

import { Payment } from '@/constant/paymentTypes';
import { 
  PAYMENT_STATUS_CONFIG, 
  PAYMENT_TYPE_CONFIG, 
  PAYMENT_METHOD_CONFIG, 
  PAYMENT_GATEWAY_CONFIG 
} from '@/constant/paymentTypes';

interface PaymentCardProps {
  payment: Payment;
  viewMode: 'grid' | 'list';
  isSelected: boolean;
  onSelect: (isSelected: boolean) => void;
  onView: (payment: Payment) => void;
  onRefund: (payment: Payment) => void;
  onProcess: (payment: Payment) => void;
  onCancel: (reason: string) => void;
  onRetry: () => void;
  onSync: () => void;
}

export default function PaymentCard({
  payment,
  viewMode,
  isSelected,
  onSelect,
  onView,
  onRefund,
  onProcess,
  onRetry,
  onSync,
}: PaymentCardProps) {
  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
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

  const statusConfig = PAYMENT_STATUS_CONFIG[payment.status];
  const typeConfig = PAYMENT_TYPE_CONFIG[payment.type];
  const methodConfig = PAYMENT_METHOD_CONFIG[payment.method];
  const gatewayConfig = PAYMENT_GATEWAY_CONFIG[payment.gateway];

  const canRefund = ['completed', 'partially_refunded'].includes(payment.status);
  const canProcess = payment.status === 'pending';
  const canRetry = payment.status === 'failed';

  if (viewMode === 'grid') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onSelect(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-500">#{payment.transactionId}</span>
            </div>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(payment.amount, payment.currency)}
              </span>
              <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${typeConfig.color}`}>
                <span className="mr-1">{typeConfig.icon}</span>
                {typeConfig.label}
              </span>
            </div>
            
            <div className="text-sm text-gray-600">
              <p className="font-medium">{payment.user.name}</p>
              <p>{payment.user.email}</p>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{methodConfig.icon} {methodConfig.label}</span>
              <span className={`px-2 py-1 rounded-full ${gatewayConfig.color}`}>
                {gatewayConfig.label}
              </span>
            </div>

            <div className="text-xs text-gray-500">
              {formatDate(payment.createdAt)}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t">
            <button
              onClick={() => onView(payment)}
              className="text-xs font-medium text-blue-600 hover:text-blue-500"
            >
              View Details
            </button>
            <div className="flex space-x-1">
              {canProcess && (
                <button
                  onClick={() => onProcess(payment)}
                  className="px-2 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 rounded transition-colors"
                >
                  Process
                </button>
              )}
              {canRefund && (
                <button
                  onClick={() => onRefund(payment)}
                  className="px-2 py-1 text-xs bg-orange-100 hover:bg-orange-200 text-orange-700 rounded transition-colors"
                >
                  Refund
                </button>
              )}
              {canRetry && (
                <button
                  onClick={onRetry}
                  className="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-900">#{payment.transactionId}</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
                <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${typeConfig.color}`}>
                  <span className="mr-1">{typeConfig.icon}</span>
                  {typeConfig.label}
                </span>
              </div>
              <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                <span>{payment.user.name}</span>
                <span>•</span>
                <span>{payment.user.email}</span>
                <span>•</span>
                <span>{formatDate(payment.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">
                {formatCurrency(payment.amount, payment.currency)}
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>{methodConfig.icon} {methodConfig.label}</span>
                <span className={`px-2 py-1 rounded-full ${gatewayConfig.color}`}>
                  {gatewayConfig.label}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onView(payment)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="View Details"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              
              {canProcess && (
                <button
                  onClick={() => onProcess(payment)}
                  className="px-3 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 rounded transition-colors"
                >
                  Process
                </button>
              )}
              
              {canRefund && (
                <button
                  onClick={() => onRefund(payment)}
                  className="px-3 py-1 text-xs bg-orange-100 hover:bg-orange-200 text-orange-700 rounded transition-colors"
                >
                  Refund
                </button>
              )}
              
              {canRetry && (
                <button
                  onClick={onRetry}
                  className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                >
                  Retry
                </button>
              )}
              
              <button
                onClick={onSync}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Sync with Gateway"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {payment.description && (
          <div className="mt-2 text-sm text-gray-600 line-clamp-2">
            {payment.description}
          </div>
        )}
        
        {payment.refundAmount && payment.refundAmount > 0 && (
          <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded-md">
            <div className="flex items-center justify-between text-sm">
              <span className="text-orange-800">Refunded:</span>
              <span className="font-medium text-orange-900">
                {formatCurrency(payment.refundAmount, payment.currency)}
              </span>
            </div>
            {payment.refundReason && (
              <div className="text-xs text-orange-700 mt-1">
                Reason: {payment.refundReason}
              </div>
            )}
          </div>
        )}
        
        {payment.failureReason && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
            <div className="text-sm text-red-800">
              <span className="font-medium">Failure Reason:</span> {payment.failureReason}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}