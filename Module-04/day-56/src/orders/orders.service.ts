import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Page } from '../common/page.js';
import {
  RESTAURANT_REPOSITORY,
  type RestaurantRepository,
} from '../restaurants/restaurants.module.js';
import type { OrderRepository } from './order.repository.js';
import type {
  Order,
  OrderFilters,
  OrderSort,
  OrderStatus,
} from './order.types.js';

export const ORDER_REPOSITORY = 'ORDER_REPOSITORY';

function sortOrders(items: Order[], sort: OrderSort): Order[] {
  const copy = [...items];
  switch (sort) {
    case 'id_desc':
      return copy.sort((a, b) => b.id - a.id);
    case 'total_asc':
      return copy.sort((a, b) => a.totalSantim - b.totalSantim);
    case 'total_desc':
      return copy.sort((a, b) => b.totalSantim - a.totalSantim);
    case 'id_asc':
    default:
      return copy.sort((a, b) => a.id - b.id);
  }
}

function paginate<T>(items: T[], limit: number, offset: number): Page<T> {
  return {
    items: items.slice(offset, offset + limit),
    total: items.length,
    limit,
    offset,
  };
}

@Injectable()
export class OrdersService {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
    @Inject(RESTAURANT_REPOSITORY)
    private readonly restaurantRepository: RestaurantRepository,
  ) {}

  findAll(filters: OrderFilters): Page<Order> {
    let filtered = this.orderRepository.all();

    if (filters.status) {
      filtered = filtered.filter((o) => o.status === filters.status);
    }
    if (filters.area) {
      const targetArea = filters.area.toLowerCase();
      filtered = filtered.filter((o) => o.area.toLowerCase() === targetArea);
    }

    const sorted = sortOrders(filtered, filters.sort);
    return paginate(sorted, filters.limit, filters.offset);
  }

  findPending(limit = 10, offset = 0): Page<Order> {
    const pending = this.orderRepository
      .all()
      .filter((o) => o.status === 'PENDING');
    return paginate(sortOrders(pending, 'id_asc'), limit, offset);
  }

  findByRestaurantId(
    restaurantId: number,
    limit = 10,
    offset = 0,
  ): Page<Order> {
    const restaurant = this.restaurantRepository.byId(restaurantId);
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with id ${restaurantId} not found`);
    }

    const orders = this.orderRepository.byRestaurantId(restaurantId);
    return paginate(sortOrders(orders, 'id_asc'), limit, offset);
  }

  updateStatus(id: number, status: OrderStatus): Order {
    const existing = this.orderRepository.byId(id);
    if (!existing) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    const updated: Order = { ...existing, status };
    return this.orderRepository.update(updated);
  }

  delete(id: number): void {
    const deleted = this.orderRepository.deleteById(id);
    if (!deleted) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
  }
}