import { z } from 'zod';

export const OrderCreateInput = z.object({
  shippingAddressId: z.string().uuid().optional(),
});

export const OrderStatusUpdateInput = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']),
});
