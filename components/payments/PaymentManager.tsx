'use client';

import { useState, useEffect } from 'react';
import { paymentService } from '@/services/paymentService';
import { 
  Payment, 
  PaymentFilters, 
  PaymentStats,
  RefundPaymentData,
  ProcessPaymentData
} from '@/constant/paymentTypes';
import PaymentCard from './PaymentCard';
import PaymentFiltersPanel from './PaymentFiltersPanel';
import PaymentStatsCards from './PaymentStatsCards';
import PaymentDetailsModal from './PaymentDetailsModal';
import RefundPaymentModal from './RefundPaymentModal';
import ProcessPaymentModal from './ProcessPaymentModal';
import CreateManualPaymentModal from './CreateManualPaymentModal';
import toast from 'react-hot-toast';

export default function PaymentManager() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPayments, setSelectedPayments] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<PaymentFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  
  // Modal states
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadPayments();
    loadStats();
  }, [filters, currentPage]);

  const loadPayments = async () => {
    try {
      setIsLoading(true);
      const response = await paymentService.getPayments(filters, currentPage, 20);
      setPayments(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error loading payments:', error);
      toast.error('Failed to load payments');
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await paymentService.getPaymentStats(filters);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading payment stats:', error);
    }
  };

  const handlePaymentSelect = (paymentId: string, isSelected: boolean) => {
    const newSelected = new Set(selectedPayments);
    if (isSelected) {
      newSelected.add(paymentId);
    } else {
      newSelected.delete(paymentId);
    }
    setSelectedPayments(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedPayments.size === payments.length) {
      setSelectedPayments(new Set());
    } else {
      setSelectedPayments(new Set(payments.map(p => p.id)));
    }
  };

  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDetailsModalOpen(true);
  };

  const handleRefundPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsRefundModalOpen(true);
  };

  const handleProcessPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsProcessModalOpen(true);
  };

  const handlePaymentRefund = async (data: RefundPaymentData) => {
    if (!selectedPayment) return;

    try {
      setIsSubmitting(true);
      await paymentService.refundPayment(selectedPayment.id, data);
      toast.success('Payment refunded successfully');
      setIsRefundModalOpen(false);
      setSelectedPayment(null);
      loadPayments();
      loadStats();
    } catch (error) {
      console.error('Error refunding payment:', error);
      toast.error('Failed to refund payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentProcess = async (data: ProcessPaymentData) => {
    if (!selectedPayment) return;

    try {
      setIsSubmitting(true);
      await paymentService.processPayment(selectedPayment.id, data);
      toast.success('Payment processed successfully');
      setIsProcessModalOpen(false);
      setSelectedPayment(null);
      loadPayments();
      loadStats();
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Failed to process payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelPayment = async (paymentId: string, reason: string) => {
    try {
      await paymentService.cancelPayment(paymentId, reason);
      toast.success('Payment cancelled successfully');
      loadPayments();
      loadStats();
    } catch (error) {
      console.error('Error cancelling payment:', error);
      toast.error('Failed to cancel payment');
    }
  };

  const handleRetryPayment = async (paymentId: string) => {
    try {
      await paymentService.retryPayment(paymentId);
      toast.success('Payment retry initiated');
      loadPayments();
      loadStats();
    } catch (error) {
      console.error('Error retrying payment:', error);
      toast.error('Failed to retry payment');
    }
  };

  const handleSyncWithGateway = async (paymentId: string) => {
    try {
      await paymentService.syncWithGateway(paymentId);
      toast.success('Payment synced with gateway');
      loadPayments();
    } catch (error) {
      console.error('Error syncing payment:', error);
      toast.error('Failed to sync with gateway');
    }
  };

  const handleBulkProcess = async () => {
    if (selectedPayments.size === 0) return;

    try {
      const result = await paymentService.bulkProcessPayments(Array.from(selectedPayments));
      toast.success(`${result.success.length} payments processed successfully`);
      if (result.failed.length > 0) {
        toast.error(`${result.failed.length} payments failed to process`);
      }
      setSelectedPayments(new Set());
      loadPayments();
      loadStats();
    } catch (error) {
      console.error('Error bulk processing payments:', error);
      toast.error('Failed to process payments');
    }
  };

  const handleBulkRefund = async (refundData: RefundPaymentData) => {
    if (selectedPayments.size === 0) return;

    try {
      const result = await paymentService.bulkRefundPayments(Array.from(selectedPayments), refundData);
      toast.success(`${result.success.length} payments refunded successfully`);
      if (result.failed.length > 0) {
        toast.error(`${result.failed.length} payments failed to refund`);
      }
      setSelectedPayments(new Set());
      loadPayments();
      loadStats();
    } catch (error) {
      console.error('Error bulk refunding payments:', error);
      toast.error('Failed to refund payments');
    }
  };

  const handleExportPayments = async () => {
    try {
      const blob = await paymentService.exportPayments(filters);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `payments-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Payments exported successfully');
    } catch (error) {
      console.error('Error exporting payments:', error);
      toast.error('Failed to export payments');
    }
  };

  const handleApplyFilters = (newFilters: PaymentFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handleCreateManualPayment = async (paymentData: any) => {
    try {
      setIsSubmitting(true);
      await paymentService.createManualPayment(paymentData);
      toast.success('Manual payment created successfully');
      setIsCreateModalOpen(false);
      loadPayments();
      loadStats();
    } catch (error) {
      console.error('Error creating manual payment:', error);
      toast.error('Failed to create manual payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading && payments.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const pendingPaymentsCount = selectedPayments.size > 0 ? 
    payments.filter(p => selectedPayments.has(p.id) && p.status === 'pending').length : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Monitor and manage all payment transactions
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Manual Payment
          </button>
          <button
            onClick={handleExportPayments}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Export Payments
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && <PaymentStatsCards stats={stats} />}

      {/* Filters */}
      <PaymentFiltersPanel
        filters={filters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Bulk Actions */}
      {selectedPayments.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedPayments.size} payment{selectedPayments.size > 1 ? 's' : ''} selected
            </span>
            <div className="flex space-x-2">
              {pendingPaymentsCount > 0 && (
                <button
                  onClick={handleBulkProcess}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium transition-colors"
                >
                  Process ({pendingPaymentsCount})
                </button>
              )}
              <button
                onClick={() => {
                  // Show bulk refund modal
                  toast.error('Bulk refund functionality coming soon');
                }}
                className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-xs font-medium transition-colors"
              >
                Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payments List */}
      <div className="space-y-4">
        {payments.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedPayments.size === payments.length && payments.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Select All</span>
              </label>
              <span className="text-sm text-gray-500">
                {payments.length} payment{payments.length > 1 ? 's' : ''}
              </span>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {payments.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {payments.map((payment) => (
              <PaymentCard
                key={payment.id}
                payment={payment}
                viewMode={viewMode}
                isSelected={selectedPayments.has(payment.id)}
                onSelect={(isSelected) => handlePaymentSelect(payment.id, isSelected)}
                onView={handleViewPayment}
                onRefund={handleRefundPayment}
                onProcess={handleProcessPayment}
                onCancel={(reason) => handleCancelPayment(payment.id, reason)}
                onRetry={() => handleRetryPayment(payment.id)}
                onSync={() => handleSyncWithGateway(payment.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {Object.keys(filters).length > 0 ? 
                'Try adjusting your filters or search criteria.' : 
                'Payment transactions will appear here when customers make purchases.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <PaymentDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedPayment(null);
        }}
        payment={selectedPayment}
      />

      <RefundPaymentModal
        isOpen={isRefundModalOpen}
        onClose={() => {
          setIsRefundModalOpen(false);
          setSelectedPayment(null);
        }}
        payment={selectedPayment}
        onSubmit={handlePaymentRefund}
        isLoading={isSubmitting}
      />

      <ProcessPaymentModal
        isOpen={isProcessModalOpen}
        onClose={() => {
          setIsProcessModalOpen(false);
          setSelectedPayment(null);
        }}
        payment={selectedPayment}
        onSubmit={handlePaymentProcess}
        isLoading={isSubmitting}
      />

      <CreateManualPaymentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateManualPayment}
        isLoading={isSubmitting}
      />
    </div>
  );
}