import { IsIn } from 'class-validator';
import type { OrderStatus } from '../order.types.js';

const ORDER_STATUSES: OrderStatus[] = [
  'PENDING',
  'PREPARING',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
];

export class UpdateStatusDto {
  @IsIn(ORDER_STATUSES)
  status!: OrderStatus;
}