'use client';

import { useState } from 'react';
import {
  useOrders,
  useOrderStats,
  useUpdateOrderStatus,
  useCancelOrder,
  useBulkUpdateOrderStatus
} from '@/hooks/useOrders';
import {
  Order,
  OrderFilters,
  UpdateOrderStatusData,
  CancelOrderData,
  ORDER_STATUS_CONFIG
} from '@/constant/orderTypes';
import { orderService } from '@/services/orderService';
import OrderCard from './OrderCard';
import OrderFiltersPanel from './OrderFiltersPanel';
import OrderStatsCards from './OrderStatsCards';
import OrderDetailsModal from './OrderDetailsModal';
import UpdateOrderStatusModal from './UpdateOrderStatusModal';
import CancelOrderModal from './CancelOrderModal';
import toast from 'react-hot-toast';

export default function OrderManager() {
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<OrderFilters>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Queries
  const { data: ordersResponse, isLoading: isOrdersLoading } = useOrders(filters);
  const { data: stats } = useOrderStats();

  // Mutations
  const updateStatusMutation = useUpdateOrderStatus();
  const cancelOrderMutation = useCancelOrder();
  const bulkUpdateMutation = useBulkUpdateOrderStatus();

  const orders = ordersResponse?.data || [];
  const isLoading = isOrdersLoading && orders.length === 0;

  // Modal states
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const handleOrderSelect = (orderId: string, isSelected: boolean) => {
    const newSelected = new Set(selectedOrders);
    if (isSelected) {
      newSelected.add(orderId);
    } else {
      newSelected.delete(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedOrders.size === orders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(orders.map(o => o._id)));
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const handleUpdateStatus = (order: Order) => {
    setSelectedOrder(order);
    setIsStatusModalOpen(true);
  };

  const handleCancelOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsCancelModalOpen(true);
  };

  const handleStatusUpdate = async (data: UpdateOrderStatusData) => {
    if (!selectedOrder) return;

    try {
      await updateStatusMutation.mutateAsync({ id: selectedOrder._id, data });
      toast.success('Order status updated successfully');
      setIsStatusModalOpen(false);
      setSelectedOrder(null);
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast.error(error.message || 'Failed to update order status');
    }
  };

  const handleOrderCancel = async (data: CancelOrderData) => {
    if (!selectedOrder) return;

    try {
      await cancelOrderMutation.mutateAsync({ id: selectedOrder._id, data });
      toast.success('Order cancelled successfully');
      setIsCancelModalOpen(false);
      setSelectedOrder(null);
    } catch (error: any) {
      console.error('Error cancelling order:', error);
      toast.error(error.message || 'Failed to cancel order');
    }
  };

  const handleBulkStatusUpdate = async (status: UpdateOrderStatusData) => {
    if (selectedOrders.size === 0) return;

    try {
      await bulkUpdateMutation.mutateAsync({ orderIds: Array.from(selectedOrders), status });
      toast.success(`${selectedOrders.size} orders updated successfully`);
      setSelectedOrders(new Set());
    } catch (error) {
      console.error('Error bulk updating orders:', error);
      toast.error('Failed to update orders');
    }
  };

  const handleExportOrders = async () => {
    try {
      const blob = await orderService.exportOrders(filters);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `orders-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Orders exported successfully');
    } catch (error) {
      console.error('Error exporting orders:', error);
      toast.error('Failed to export orders');
    }
  };

  const handleApplyFilters = (newFilters: OrderFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Orders Management</h1>
          <p className="mt-1 text-sm text-gray-500 font-medium">
            View, track, and manage customer orders
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-95"
          >
            {viewMode === 'grid' ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                List View
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                Grid View
              </>
            )}
          </button>
          <button
            onClick={handleExportOrders}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-[0_4px_12px_rgba(5,150,105,0.2)] hover:shadow-[0_6px_16px_rgba(5,150,105,0.3)] active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            Export Orders
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && <OrderStatsCards stats={stats} />}

      {/* Filters */}
      <OrderFiltersPanel
        filters={filters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Bulk Actions */}
      {selectedOrders.size > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 rounded-2xl p-5 shadow-inner ring-1 ring-white/50 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm ring-4 ring-white">
                {selectedOrders.size}
              </span>
              <span className="text-sm font-semibold text-blue-900">
                order{selectedOrders.size > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-blue-600/70 uppercase tracking-wider mr-2">Update status to:</span>
              {Object.entries(ORDER_STATUS_CONFIG).map(([status, config]) => {
                const getButtonTheme = (status: string) => {
                  const themes: Record<string, string> = {
                    pending: 'bg-amber-500 shadow-amber-500/25 hover:bg-amber-600',
                    paid: 'bg-emerald-500 shadow-emerald-500/25 hover:bg-emerald-600',
                    shipped: 'bg-indigo-500 shadow-indigo-500/25 hover:bg-indigo-600',
                    completed: 'bg-blue-500 shadow-blue-500/25 hover:bg-blue-600',
                    cancelled: 'bg-rose-500 shadow-rose-500/25 hover:bg-rose-600'
                  };
                  return themes[status] || 'bg-gray-500 shadow-gray-500/25 hover:bg-gray-600';
                };

                return (
                  <button
                    key={status}
                    onClick={() => handleBulkStatusUpdate({ status: status as any })}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all transform hover:-translate-y-0.5 hover:shadow-lg active:scale-95 ${getButtonTheme(status)}`}
                  >
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedOrders.size === orders.length && orders.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Select All</span>
              </label>
              <span className="text-sm text-gray-500">
                {orders.length} order{orders.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}

        {orders.length > 0 ? (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                viewMode={viewMode}
                isSelected={selectedOrders.has(order._id)}
                onSelect={(isSelected) => handleOrderSelect(order._id, isSelected)}
                onView={handleViewOrder}
                onUpdateStatus={handleUpdateStatus}
                onCancel={handleCancelOrder}
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {Object.keys(filters).length > 0 ?
                'Try adjusting your filters or search criteria.' :
                'Customer orders will appear here when they make purchases.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <OrderDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
      />

      <UpdateOrderStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        onSubmit={handleStatusUpdate}
        isLoading={updateStatusMutation.isPending}
      />

      <CancelOrderModal
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        onSubmit={handleOrderCancel}
        isLoading={cancelOrderMutation.isPending}
      />
    </div>
  );
}