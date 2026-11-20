// src/orders/orders.repository.ts
import type { Order, OrderStatus } from './order.entity.js';

export const ORDERS_REPOSITORY = Symbol('ORDERS_REPOSITORY');

export interface OrdersRepository {
  findById(id: string): Promise<Order | null>;
  findAll(): Promise<Order[]>;
  create(order: Order): Promise<Order>;
  updateStatus(id: string, status: OrderStatus): Promise<Order>;
}