import { IsIn } from 'class-validator';
import type { OrderStatus } from '../order.types.js';

export const ORDER_STATUSES: OrderStatus[] = [
  'PENDING',
  'PREPARING',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
];

export class UpdateOrderStatusDto {
  @IsIn(ORDER_STATUSES, {
    message: `status must be one of: ${ORDER_STATUSES.join(', ')}.`,
  })
  status!: OrderStatus;
}