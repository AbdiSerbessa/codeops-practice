// src/orders/order.service.ts
import { OrderNotFoundError } from './order.errors';
import { OrderRepository } from './order.repository';
import { Area, deliveryFee, Order } from './order.types';

export class OrderService {
  constructor(private readonly repository: OrderRepository) {}

  find(id: number): Order {
    const order = this.repository.byId(id);
    if (!order) {
      throw new OrderNotFoundError(id);
    }
    return order;
  }

  feesByArea(): Record<Area, number> {
    const totals: Record<Area, number> = {
      Bole: 0,
      Piazza: 0,
      Kazanchis: 0,
      'Arat Kilo': 0,
    };

    for (const order of this.repository.all()) {
      totals[order.area] += deliveryFee(order);
    }

    return totals;
  }

  summarise<K extends keyof Order>(key: K): Order[K][] {
    return this.repository.all().map((order) => order[key]);
  }
}