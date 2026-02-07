import api from './authService'
import { endpoints } from '@/constant/endpoints';
import { 
  Order, 
  OrderFilters, 
  OrdersResponse, 
  OrderResponse, 
  OrderStats,
  UpdateOrderStatusData,
  CancelOrderData
} from '@/constant/orderTypes';

class OrderService {
  // Get all orders with optional filters
  async getOrders(filters?: OrderFilters): Promise<OrdersResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        if (filters.status && filters.status !== 'all') {
          params.append('status', filters.status);
        }
        if (filters.search) {
          params.append('search', filters.search);
        }
        if (filters.startDate) {
          params.append('startDate', filters.startDate);
        }
        if (filters.endDate) {
          params.append('endDate', filters.endDate);
        }
        if (filters.minAmount !== undefined) {
          params.append('minAmount', filters.minAmount.toString());
        }
        if (filters.maxAmount !== undefined) {
          params.append('maxAmount', filters.maxAmount.toString());
        }
        if (filters.userId) {
          params.append('userId', filters.userId);
        }
      }

      const queryString = params.toString();
      const url = queryString ? `${endpoints.orders.list}?${queryString}` : endpoints.orders.list;
      
      const response = await api.get<OrdersResponse>(url);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 500) {
        throw new Error('Server error occurred while fetching orders. Please try again later.');
      }
      throw error;
    }
  }

  // Get single order details
  async getOrder(id: string): Promise<OrderResponse> {
    try {
      const response = await api.get<OrderResponse>(
        `${endpoints.orders.list}/${id}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 500) {
        throw new Error('Server error occurred while fetching order details. Please try again later.');
      }
      throw error;
    }
  }

  // Update order status
  async updateOrderStatus(id: string, data: UpdateOrderStatusData): Promise<OrderResponse> {
    try {
      const response = await api.patch<OrderResponse>(
        `${endpoints.orders.list}/${id}/status`,
        data
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 500) {
        throw new Error('Server error occurred while updating order status. Please try again later.');
      }
      throw error;
    }
  }

  // Cancel order
  async cancelOrder(id: string, data: CancelOrderData): Promise<OrderResponse> {
    const response = await api.patch<OrderResponse>(
      endpoints.orders.cancel(id),
      data
    );
    return response.data;
  }

  // Get order statistics
  async getOrderStats(): Promise<OrderStats> {
    try {
      const response = await api.get<OrderStats>(
        `${endpoints.orders.list}/stats`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 500) {
        throw new Error('Server error occurred while fetching order statistics. Please try again later.');
      }
      throw error;
    }
  }

  // Get recent orders
  async getRecentOrders(limit: number = 10): Promise<OrdersResponse> {
    const response = await api.get<OrdersResponse>(
      `${endpoints.orders.list}/recent?limit=${limit}`
    );
    return response.data;
  }

  // Get orders by status
  async getOrdersByStatus(status: string): Promise<OrdersResponse> {
    const response = await api.get<OrdersResponse>(
      `${endpoints.orders.list}/status/${status}`
    );
    return response.data;
  }

  // Get orders by user
  async getOrdersByUser(userId: string): Promise<OrdersResponse> {
    const response = await api.get<OrdersResponse>(
      `${endpoints.orders.list}/user/${userId}`
    );
    return response.data;
  }

  // Search orders
  async searchOrders(query: string): Promise<OrdersResponse> {
    const response = await api.get<OrdersResponse>(
      `${endpoints.orders.list}/search?q=${encodeURIComponent(query)}`
    );
    return response.data;
  }

  // Bulk update order status
  async bulkUpdateOrderStatus(
    orderIds: string[], 
    status: UpdateOrderStatusData
  ): Promise<{ message: string; updatedCount: number }> {
    const response = await api.patch<{ message: string; updatedCount: number }>(
      `${endpoints.orders.list}/bulk-update`,
      { orderIds, ...status }
    );
    return response.data;
  }

  // Export orders to CSV/Excel
  async exportOrders(filters?: OrderFilters): Promise<Blob> {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.status && filters.status !== 'all') {
        params.append('status', filters.status);
      }
      if (filters.startDate) {
        params.append('startDate', filters.startDate);
      }
      if (filters.endDate) {
        params.append('endDate', filters.endDate);
      }
    }

    const queryString = params.toString();
    const url = queryString ? 
      `${endpoints.orders.list}/export?${queryString}` : 
      `${endpoints.orders.list}/export`;
    
    const response = await api.get(url, {
      responseType: 'blob',
    });
    return response.data;
  }

  // Get order analytics
  async getOrderAnalytics(period: 'week' | 'month' | 'quarter' | 'year' = 'month') {
    const response = await api.get(
      `${endpoints.orders.list}/analytics?period=${period}`
    );
    return response.data;
  }

  // Refund order
  async refundOrder(id: string, data: { amount: number; reason: string; notifyCustomer: boolean }): Promise<OrderResponse> {
    const response = await api.post<OrderResponse>(
      `${endpoints.orders.list}/${id}/refund`,
      data
    );
    return response.data;
  }

  // Add order notes
  async addOrderNotes(id: string, notes: string): Promise<OrderResponse> {
    const response = await api.patch<OrderResponse>(
      `${endpoints.orders.list}/${id}/notes`,
      { notes }
    );
    return response.data;
  }

  // Update shipping information
  async updateShippingInfo(
    id: string, 
    data: { trackingNumber: string; shippingMethod: string }
  ): Promise<OrderResponse> {
    const response = await api.patch<OrderResponse>(
      `${endpoints.orders.list}/${id}/shipping`,
      data
    );
    return response.data;
  }
}

export const orderService = new OrderService();