import { Injectable, Inject } from '@nestjs/common';
import type { OrderRepository } from './order.repository.js';
import { Order } from './order.types.js';
import { OrderNotFoundError } from './order.errors.js';
import { CreateOrderDto } from './dto/create-order.dto.js';


@Injectable()
export class OrdersService {
  constructor(
    @Inject('ORDER_REPOSITORY')
    private readonly orderRepository: OrderRepository,
  ) {}

  findAll(): Order[] {
    return this.orderRepository.all();
  }

  findById(id: number): Order {
    const order = this.orderRepository.byId(id);
    if (!order) {
      throw new OrderNotFoundError(id);
    }
    return order;
  }
 create(dto: CreateOrderDto): Order {
    const existing = this.orderRepository.all();
    const nextId =
      existing.length > 0 ? Math.max(...existing.map((o) => o.id)) + 1 : 1;

    const newOrder = {
      id: nextId,
      customerName: dto.customer,
      status: 'pending', // adjust default status if needed by your type
      dishes: [],        // match your Day 53 Order type structure
      total: dto.totalSantim,
      ...(dto.telebirrPhone ? { telebirrPhone: dto.telebirrPhone } : {}),
    } as unknown as Order;

    return this.orderRepository.save(newOrder);
  }
}