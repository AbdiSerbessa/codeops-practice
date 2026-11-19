import { Order } from './order.types.js';

export interface OrderRepository {
  all(): Order[];
  byId(id: number): Order | undefined;
  byRestaurantId(restaurantId: number): Order[];
  update(order: Order): Order;
  deleteById(id: number): boolean;
}

export class InMemoryOrderRepository implements OrderRepository {
  private readonly store = new Map<number, Order>();

  constructor(initial: Order[] = []) {
    for (const order of initial) {
      this.store.set(order.id, { ...order });
    }
  }

  all(): Order[] {
    return Array.from(this.store.values());
  }

  byId(id: number): Order | undefined {
    const found = this.store.get(id);
    return found ? { ...found } : undefined;
  }

  byRestaurantId(restaurantId: number): Order[] {
    return this.all().filter((order) => order.restaurantId === restaurantId);
  }

  update(order: Order): Order {
    this.store.set(order.id, { ...order });
    return { ...order };
  }

  deleteById(id: number): boolean {
    return this.store.delete(id);
  }
}