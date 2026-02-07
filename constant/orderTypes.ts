// Order-related type definitions for the admin system

export interface Order {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  totalAmount: {
    $numberDecimal: string;
  };
  status: OrderStatus;
  shippingAddress: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface OrderItem {
  _id: string;
  productId: string;
  product?: {
    _id: string;
    name: string;
    imageUrl?: string;
    category: string;
  };
  quantity: number;
  unitPrice: {
    $numberDecimal: string;
  };
  totalPrice: {
    $numberDecimal: string;
  };
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export type OrderStatus = 
  | 'pending' 
  | 'paid'
  | 'shipped' 
  | 'completed'
  | 'cancelled';

export type PaymentStatus = 
  | 'pending' 
  | 'completed' 
  | 'failed' 
  | 'refunded' 
  | 'cancelled';

export interface OrderFilters {
  status?: OrderStatus | 'all';
  search?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  userId?: string;
}

export interface OrdersResponse {
  data: Order[];
  message: string;
  total?: number;
  page?: number;
  limit?: number;
}

export interface OrderResponse {
  data: Order;
  message: string;
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  recentOrdersCount: number;
}

export interface UpdateOrderStatusData {
  status: OrderStatus;
  trackingNumber?: string;
  notes?: string;
}

export interface CancelOrderData {
  reason: string;
  refundAmount?: number;
  notifyCustomer: boolean;
}

// Order status display configurations
export const ORDER_STATUS_CONFIG = {
  pending: { 
    color: 'bg-yellow-100 text-yellow-800', 
    label: 'Pending',
    description: 'Order received, awaiting payment'
  },
  paid: { 
    color: 'bg-green-100 text-green-800', 
    label: 'Paid',
    description: 'Payment completed, preparing for shipment'
  },
  shipped: { 
    color: 'bg-indigo-100 text-indigo-800', 
    label: 'Shipped',
    description: 'Order has been shipped'
  },
  completed: { 
    color: 'bg-blue-100 text-blue-800', 
    label: 'Completed',
    description: 'Order successfully completed'
  },
  cancelled: { 
    color: 'bg-red-100 text-red-800', 
    label: 'Cancelled',
    description: 'Order has been cancelled'
  },
} as const;

export const PAYMENT_STATUS_CONFIG = {
  pending: { 
    color: 'bg-yellow-100 text-yellow-800', 
    label: 'Pending' 
  },
  completed: { 
    color: 'bg-green-100 text-green-800', 
    label: 'Completed' 
  },
  failed: { 
    color: 'bg-red-100 text-red-800', 
    label: 'Failed' 
  },
  refunded: { 
    color: 'bg-gray-100 text-gray-800', 
    label: 'Refunded' 
  },
  cancelled: { 
    color: 'bg-red-100 text-red-800', 
    label: 'Cancelled' 
  },
} as const;