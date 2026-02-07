import api from './authService';
import { endpoints } from '@/constant/endpoints';
import { 
  Payment, 
  PaymentFilters, 
  PaymentStats, 
  PaymentResponse, 
  RefundPaymentData,
  ProcessPaymentData 
} from '@/constant/paymentTypes';

export const paymentService = {
  // Get payments with filters
  async getPayments(filters: PaymentFilters = {}, page: number = 1, limit: number = 20): Promise<PaymentResponse> {
    const params = new URLSearchParams();
    
    if (filters.status?.length) {
      params.append('status', filters.status.join(','));
    }
    if (filters.type?.length) {
      params.append('type', filters.type.join(','));
    }
    if (filters.method?.length) {
      params.append('method', filters.method.join(','));
    }
    if (filters.gateway?.length) {
      params.append('gateway', filters.gateway.join(','));
    }
    if (filters.amountMin !== undefined) {
      params.append('amountMin', filters.amountMin.toString());
    }
    if (filters.amountMax !== undefined) {
      params.append('amountMax', filters.amountMax.toString());
    }
    if (filters.dateFrom) {
      params.append('dateFrom', filters.dateFrom);
    }
    if (filters.dateTo) {
      params.append('dateTo', filters.dateTo);
    }
    if (filters.userId) {
      params.append('userId', filters.userId);
    }
    if (filters.orderId) {
      params.append('orderId', filters.orderId);
    }
    if (filters.search) {
      params.append('search', filters.search);
    }
    
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    const response = await api.get(`${endpoints.payments.list}?${params.toString()}`);
    return response.data;
  },

  // Get single payment
  async getPayment(paymentId: string): Promise<Payment> {
    const response = await api.get(endpoints.payments.single(paymentId));
    return response.data;
  },

  // Get payment statistics
  async getPaymentStats(filters: PaymentFilters = {}): Promise<PaymentStats> {
    const params = new URLSearchParams();
    
    if (filters.dateFrom) {
      params.append('dateFrom', filters.dateFrom);
    }
    if (filters.dateTo) {
      params.append('dateTo', filters.dateTo);
    }
    if (filters.type?.length) {
      params.append('type', filters.type.join(','));
    }
    
    const response = await api.get(`${endpoints.payments.stats}?${params.toString()}`);
    return response.data;
  },

  // Process pending payment
  async processPayment(paymentId: string, data: ProcessPaymentData): Promise<Payment> {
    const response = await api.post(
      endpoints.payments.process(paymentId),
      data
    );
    return response.data;
  },

  // Refund payment
  async refundPayment(paymentId: string, data: RefundPaymentData): Promise<Payment> {
    const response = await api.post(
      endpoints.payments.refund(paymentId),
      data
    );
    return response.data;
  },

  // Cancel payment
  async cancelPayment(paymentId: string, reason: string): Promise<Payment> {
    const response = await api.post(
      endpoints.payments.cancel(paymentId),
      { reason }
    );
    return response.data;
  },

  // Retry failed payment
  async retryPayment(paymentId: string): Promise<Payment> {
    const response = await api.post(
      endpoints.payments.retry(paymentId)
    );
    return response.data;
  },

  // Export payments
  async exportPayments(filters: PaymentFilters = {}, format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
    const params = new URLSearchParams();
    
    if (filters.status?.length) {
      params.append('status', filters.status.join(','));
    }
    if (filters.type?.length) {
      params.append('type', filters.type.join(','));
    }
    if (filters.method?.length) {
      params.append('method', filters.method.join(','));
    }
    if (filters.gateway?.length) {
      params.append('gateway', filters.gateway.join(','));
    }
    if (filters.dateFrom) {
      params.append('dateFrom', filters.dateFrom);
    }
    if (filters.dateTo) {
      params.append('dateTo', filters.dateTo);
    }
    if (filters.search) {
      params.append('search', filters.search);
    }
    
    params.append('format', format);
    
    const response = await api.get(`${endpoints.payments.export}?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Get payment analytics
  async getPaymentAnalytics(
    dateRange: { from: string; to: string },
    groupBy: 'day' | 'week' | 'month' = 'day'
  ): Promise<{
    totalAmount: number;
    totalCount: number;
    successRate: number;
    averageAmount: number;
    chartData: {
      date: string;
      amount: number;
      count: number;
    }[];
  }> {
    const params = new URLSearchParams({
      dateFrom: dateRange.from,
      dateTo: dateRange.to,
      groupBy,
    });
    
    const response = await api.get(`${endpoints.payments.analytics}?${params.toString()}`);
    return response.data;
  },

  // Bulk operations
  async bulkProcessPayments(paymentIds: string[]): Promise<{ success: string[]; failed: string[] }> {
    const response = await api.post(endpoints.payments.bulkProcess, {
      paymentIds,
    });
    return response.data;
  },

  async bulkRefundPayments(
    paymentIds: string[], 
    data: RefundPaymentData
  ): Promise<{ success: string[]; failed: string[] }> {
    const response = await api.post(endpoints.payments.bulkRefund, {
      paymentIds,
      ...data,
    });
    return response.data;
  },

  // Gateway-specific operations
  async syncWithGateway(paymentId: string): Promise<Payment> {
    const response = await api.post(
      endpoints.payments.syncGateway(paymentId)
    );
    return response.data;
  },

  // Get payment webhooks/logs
  async getPaymentLogs(paymentId: string): Promise<{
    logs: {
      id: string;
      type: string;
      message: string;
      data: any;
      createdAt: string;
    }[];
  }> {
    const response = await api.get(
      endpoints.payments.logs(paymentId)
    );
    return response.data;
  },

  // Manual payment entry
  async createManualPayment(data: {
    userId: string;
    amount: number;
    currency: string;
    type: string;
    method: string;
    description: string;
    orderId?: string;
    donationId?: string;
    notes?: string;
  }): Promise<Payment> {
    const response = await api.post(endpoints.payments.create, data);
    return response.data;
  },

  // Update payment details
  async updatePayment(paymentId: string, data: {
    notes?: string;
    metadata?: Record<string, any>;
  }): Promise<Payment> {
    const response = await api.patch(
      endpoints.payments.update(paymentId),
      data
    );
    return response.data;
  },

  // Get reconciliation report
  async getReconciliationReport(
    gateway: string,
    dateFrom: string,
    dateTo: string
  ): Promise<{
    matched: Payment[];
    unmatched: Payment[];
    gatewayOnly: any[];
    summary: {
      totalPayments: number;
      matchedCount: number;
      unmatchedCount: number;
      gatewayOnlyCount: number;
      totalAmount: number;
      matchedAmount: number;
    };
  }> {
    const params = new URLSearchParams({
      gateway,
      dateFrom,
      dateTo,
    });
    
    const response = await api.get(`${endpoints.payments.reconciliation}?${params.toString()}`);
    return response.data;
  },
};