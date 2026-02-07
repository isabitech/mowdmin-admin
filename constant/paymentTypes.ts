export interface Payment {
  id: string;
  transactionId: string;
  orderId?: string;
  donationId?: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  amount: number;
  currency: string;
  type: PaymentType;
  method: PaymentMethod;
  status: PaymentStatus;
  gateway: PaymentGateway;
  gatewayTransactionId?: string;
  gatewayResponse?: any;
  description: string;
  metadata?: Record<string, any>;
  refundAmount?: number;
  refundReason?: string;
  refundedAt?: string;
  failureReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  processedAt?: string;
}

export type PaymentType = 'order' | 'donation' | 'subscription' | 'refund' | 'other';
export type PaymentMethod = 'card' | 'bank_transfer' | 'paypal' | 'apple_pay' | 'google_pay' | 'cash' | 'check' | 'other';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded' | 'partially_refunded';
export type PaymentGateway = 'stripe' | 'paypal' | 'square' | 'razorpay' | 'flutterwave' | 'manual' | 'other';

export interface PaymentFilters {
  status?: PaymentStatus[];
  type?: PaymentType[];
  method?: PaymentMethod[];
  gateway?: PaymentGateway[];
  amountMin?: number;
  amountMax?: number;
  dateFrom?: string;
  dateTo?: string;
  userId?: string;
  search?: string;
  orderId?: string;
}

export interface PaymentStats {
  total: {
    count: number;
    amount: number;
  };
  completed: {
    count: number;
    amount: number;
  };
  pending: {
    count: number;
    amount: number;
  };
  failed: {
    count: number;
    amount: number;
  };
  refunded: {
    count: number;
    amount: number;
  };
  byMethod: Record<PaymentMethod, {
    count: number;
    amount: number;
  }>;
  byGateway: Record<PaymentGateway, {
    count: number;
    amount: number;
  }>;
  monthlyTrend: {
    month: string;
    amount: number;
    count: number;
  }[];
}

export interface RefundPaymentData {
  amount?: number; // Full refund if not specified
  reason: string;
  notifyCustomer?: boolean;
  notes?: string;
}

export interface ProcessPaymentData {
  gatewayTransactionId?: string;
  notes?: string;
}

export interface PaymentResponse {
  data: Payment[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Payment Status Configurations
export const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, {
  label: string;
  color: string;
  description: string;
}> = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Payment is awaiting processing',
  },
  processing: {
    label: 'Processing',
    color: 'bg-blue-100 text-blue-800',
    description: 'Payment is being processed',
  },
  completed: {
    label: 'Completed',
    color: 'bg-green-100 text-green-800',
    description: 'Payment was successful',
  },
  failed: {
    label: 'Failed',
    color: 'bg-red-100 text-red-800',
    description: 'Payment failed or was declined',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-gray-100 text-gray-800',
    description: 'Payment was cancelled',
  },
  refunded: {
    label: 'Refunded',
    color: 'bg-purple-100 text-purple-800',
    description: 'Payment was fully refunded',
  },
  partially_refunded: {
    label: 'Partially Refunded',
    color: 'bg-indigo-100 text-indigo-800',
    description: 'Payment was partially refunded',
  },
};

// Payment Type Configurations
export const PAYMENT_TYPE_CONFIG: Record<PaymentType, {
  label: string;
  color: string;
  icon: string;
}> = {
  order: {
    label: 'Product Order',
    color: 'bg-blue-100 text-blue-800',
    icon: '🛍️',
  },
  donation: {
    label: 'Donation',
    color: 'bg-green-100 text-green-800',
    icon: '💝',
  },
  subscription: {
    label: 'Subscription',
    color: 'bg-purple-100 text-purple-800',
    icon: '🔄',
  },
  refund: {
    label: 'Refund',
    color: 'bg-orange-100 text-orange-800',
    icon: '↩️',
  },
  other: {
    label: 'Other',
    color: 'bg-gray-100 text-gray-800',
    icon: '📄',
  },
};

// Payment Method Configurations
export const PAYMENT_METHOD_CONFIG: Record<PaymentMethod, {
  label: string;
  icon: string;
}> = {
  card: {
    label: 'Credit/Debit Card',
    icon: '💳',
  },
  bank_transfer: {
    label: 'Bank Transfer',
    icon: '🏦',
  },
  paypal: {
    label: 'PayPal',
    icon: '🅿️',
  },
  apple_pay: {
    label: 'Apple Pay',
    icon: '🍎',
  },
  google_pay: {
    label: 'Google Pay',
    icon: '🔵',
  },
  cash: {
    label: 'Cash',
    icon: '💵',
  },
  check: {
    label: 'Check',
    icon: '📝',
  },
  other: {
    label: 'Other',
    icon: '💰',
  },
};

// Payment Gateway Configurations
export const PAYMENT_GATEWAY_CONFIG: Record<PaymentGateway, {
  label: string;
  color: string;
}> = {
  stripe: {
    label: 'Stripe',
    color: 'bg-purple-100 text-purple-800',
  },
  paypal: {
    label: 'PayPal',
    color: 'bg-blue-100 text-blue-800',
  },
  square: {
    label: 'Square',
    color: 'bg-black text-white',
  },
  razorpay: {
    label: 'Razorpay',
    color: 'bg-indigo-100 text-indigo-800',
  },
  flutterwave: {
    label: 'Flutterwave',
    color: 'bg-orange-100 text-orange-800',
  },
  manual: {
    label: 'Manual Entry',
    color: 'bg-gray-100 text-gray-800',
  },
  other: {
    label: 'Other Gateway',
    color: 'bg-gray-100 text-gray-800',
  },
};