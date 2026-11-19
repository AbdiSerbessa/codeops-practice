// src/orders/dto/update-order-status.dto.ts
import { IsIn } from 'class-validator';
import type { OrderStatus } from '../order.types.js';

const ORDER_STATUSES: OrderStatus[] = [
  'PENDING',
  'PREPARING',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
];

export class UpdateOrderStatusDto {
  @IsIn(ORDER_STATUSES)
  status!: OrderStatus;
}