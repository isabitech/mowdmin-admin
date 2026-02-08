'use client';

import { useState, useEffect, useCallback } from 'react';
import { orderService } from '@/services/orderService';
import { 
  Order, 
  OrderFilters, 
  OrderStats, 
  UpdateOrderStatusData, 
  CancelOrderData,
  ORDER_STATUS_CONFIG
} from '@/constant/orderTypes';
import OrderCard from './OrderCard';
import OrderFiltersPanel from './OrderFiltersPanel';
import OrderStatsCards from './OrderStatsCards';
import OrderDetailsModal from './OrderDetailsModal';
import UpdateOrderStatusModal from './UpdateOrderStatusModal';
import CancelOrderModal from './CancelOrderModal';
import toast from 'react-hot-toast';

export default function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<OrderFilters>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  
  // Modal states
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await orderService.getOrders(filters);
      setOrders(response.data || []);
    } catch (error: any) {
      console.error('Error loading orders:', error);
      toast.error(error.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const loadStats = useCallback(async () => {
    try {
      const statsData = await orderService.getOrderStats();
      setStats(statsData);
    } catch (error: any) {
      console.error('Error loading order stats:', error);
      // Don't show error toast for stats as it's not critical
    }
  }, []);

  useEffect(() => {
    loadOrders();
    loadStats();
  }, [filters, loadOrders, loadStats]);

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
      setIsSubmitting(true);
      await orderService.updateOrderStatus(selectedOrder._id, data);
      toast.success('Order status updated successfully');
      setIsStatusModalOpen(false);
      setSelectedOrder(null);
      loadOrders();
      loadStats();
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast.error(error.message || 'Failed to update order status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOrderCancel = async (data: CancelOrderData) => {
    if (!selectedOrder) return;

    try {
      setIsSubmitting(true);
      await orderService.cancelOrder(selectedOrder._id, data);
      toast.success('Order cancelled successfully');
      setIsCancelModalOpen(false);
      setSelectedOrder(null);
      loadOrders();
      loadStats();
    } catch (error: any) {
      console.error('Error cancelling order:', error);
      toast.error(error.message || 'Failed to cancel order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkStatusUpdate = async (status: UpdateOrderStatusData) => {
    if (selectedOrders.size === 0) return;

    try {
      await orderService.bulkUpdateOrderStatus(Array.from(selectedOrders), status);
      toast.success(`${selectedOrders.size} orders updated successfully`);
      setSelectedOrders(new Set());
      loadOrders();
      loadStats();
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            View and manage customer orders
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
            onClick={handleExportOrders}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedOrders.size} order{selectedOrders.size > 1 ? 's' : ''} selected
            </span>
            <div className="flex space-x-2">
              {Object.entries(ORDER_STATUS_CONFIG).map(([status, config]) => (
                <button
                  key={status}
                  onClick={() => handleBulkStatusUpdate({ status: status as any })}
                  className="px-3 py-1 rounded text-xs font-medium text-white transition-colors"
                  style={{ backgroundColor: config.color.includes('yellow') ? '#f59e0b' : 
                           config.color.includes('blue') ? '#3b82f6' :
                           config.color.includes('purple') ? '#8b5cf6' :
                           config.color.includes('indigo') ? '#6366f1' :
                           config.color.includes('green') ? '#10b981' :
                           config.color.includes('red') ? '#ef4444' : '#6b7280' }}
                >
                  {config.label}
                </button>
              ))}
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
        isLoading={isSubmitting}
      />

      <CancelOrderModal
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        onSubmit={handleOrderCancel}
        isLoading={isSubmitting}
      />
    </div>
  );
}