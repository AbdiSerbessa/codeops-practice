import { Order } from './order.types.js';

export interface OrderRepository {
  byId(id: number): Order | undefined;
  all(): Order[];
  save(order: Order): Order;
}

export class InMemoryOrderRepository implements OrderRepository {
  private readonly store = new Map<number, Order>();

  constructor(initialOrders: Order[] = []) {
    for (const order of initialOrders) {
      this.store.set(order.id, order);
    }
  }

  byId(id: number): Order | undefined {
    return this.store.get(id);
  }

  all(): Order[] {
    return Array.from(this.store.values());
  }

  save(order: Order): Order {
    this.store.set(order.id, order);
    return order;
  }
}