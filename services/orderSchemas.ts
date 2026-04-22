import { z } from 'zod';

const OrderStatusSchema = z.enum(['pending', 'paid', 'shipped', 'completed', 'cancelled']);

const DecimalSchema = z.object({
  $numberDecimal: z.string()
});

const OrderItemSchema = z.object({
  _id: z.string(),
  productId: z.string(),
  product: z.object({
    _id: z.string(),
    name: z.string(),
    imageUrl: z.string().optional(),
    category: z.string(),
  }).optional(),
  quantity: z.number(),
  unitPrice: DecimalSchema,
  totalPrice: DecimalSchema,
});

const OrderSchema = z.object({
  _id: z.string(),
  userId: z.object({
    _id: z.string(),
    name: z.string(),
    email: z.string(),
  }),
  totalAmount: DecimalSchema,
  status: OrderStatusSchema,
  shippingAddress: z.string(),
  items: z.array(OrderItemSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
  __v: z.number().optional(),
});

const OrderFiltersSchema = z.object({
  status: z.union([OrderStatusSchema, z.literal('all')]).optional(),
  search: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
  userId: z.string().optional(),
});

const OrdersResponseSchema = z.object({
  data: z.array(OrderSchema),
  message: z.string(),
  total: z.number().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

const OrderResponseSchema = z.object({
  data: OrderSchema,
  message: z.string(),
});
const OrderStatsSchema = z.object({
  totalOrders: z.number(),
  pendingOrders: z.number(),
  confirmedOrders: z.number(),
  processingOrders: z.number(),
  shippedOrders: z.number(),
  deliveredOrders: z.number(),
  cancelledOrders: z.number(),
  totalRevenue: z.number(),
  averageOrderValue: z.number(),
  recentOrdersCount: z.number(),
});

const UpdateOrderStatusDataSchema = z.object({
  status: OrderStatusSchema,
  trackingNumber: z.string().optional(),
  notes: z.string().optional(),
});

const CancelOrderDataSchema = z.object({
  reason: z.string().min(1, 'Reason is required'),
  refundAmount: z.number().optional(),
  notifyCustomer: z.boolean(),
});

export type OrderStatusSchema = z.infer<typeof OrderStatusSchema>;
export type OrderFiltersSchema = z.infer<typeof OrderFiltersSchema>;
export type UpdateOrderStatusDataSchema = z.infer<typeof UpdateOrderStatusDataSchema>;
export type CancelOrderDataSchema = z.infer<typeof CancelOrderDataSchema>;


export { OrderStatusSchema, OrderFiltersSchema, UpdateOrderStatusDataSchema, CancelOrderDataSchema, DecimalSchema, OrderItemSchema, OrderSchema, OrdersResponseSchema, OrderResponseSchema, OrderStatsSchema }