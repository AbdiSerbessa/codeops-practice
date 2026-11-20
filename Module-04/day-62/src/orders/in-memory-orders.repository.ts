// src/orders/in-memory-orders.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import type { Order, OrderStatus } from './order.entity.js';
import type { OrdersRepository } from './orders.repository.js';

@Injectable()
export class InMemoryOrdersRepository implements OrdersRepository {
  private readonly orders: Order[] = [];

  async findById(id: string): Promise<Order | null> {
    return this.orders.find((o) => o.id === id) ?? null;
  }

  async findAll(): Promise<Order[]> {
    return [...this.orders];
  }

  async create(order: Order): Promise<Order> {
    this.orders.push(order);
    return order;
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = this.orders.find((o) => o.id === id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    order.status = status;
    return order;
  }

  async delete(id: string): Promise<void> {
    const index = this.orders.findIndex((o) => o.id === id);
    if (index === -1) {
      throw new NotFoundException('Order not found');
    }
    this.orders.splice(index, 1);
  }
}