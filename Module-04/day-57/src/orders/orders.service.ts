import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import type { Page } from '../common/page.js';
import { parseCsv, selectFields, sortByField } from '../common/query.utils.js';
import {
  RESTAURANT_REPOSITORY,
  type RestaurantRepository,
} from '../restaurants/restaurants.service.js';
import type { CreateOrderDto } from './dto/create-order.dto.js';
import type { FindOrdersQueryDto } from './dto/find-orders-query.dto.js';
import type { Order, OrderStatus } from './order.types.js';

export const ORDER_REPOSITORY = 'ORDER_REPOSITORY';

export interface OrderRepository {
  all(): Order[];
  byId(id: number): Order | undefined;
  byRestaurantId(restaurantId: number): Order[];
  create(input: Omit<Order, 'id'>): Order;
  update(order: Order): Order;
  deleteById(id: number): boolean;
}

export class InMemoryOrderRepository implements OrderRepository {
  private readonly store = new Map<number, Order>();
  private nextId = 1;

  constructor(initial: Order[] = []) {
    for (const item of initial) {
      this.store.set(item.id, { ...item });
      if (item.id >= this.nextId) this.nextId = item.id + 1;
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
    return this.all().filter((o) => o.restaurantId === restaurantId);
  }

  create(input: Omit<Order, 'id'>): Order {
    const created: Order = { id: this.nextId++, ...input };
    this.store.set(created.id, created);
    return { ...created };
  }

  update(order: Order): Order {
    this.store.set(order.id, { ...order });
    return { ...order };
  }

  deleteById(id: number): boolean {
    return this.store.delete(id);
  }
}

@Injectable()
export class OrdersService {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepo: OrderRepository,
    @Inject(RESTAURANT_REPOSITORY)
    private readonly restaurantRepo: RestaurantRepository,
  ) {}

  findAll(query: FindOrdersQueryDto): Page<Partial<Order>> {
    let list = this.orderRepo.all();

    const statuses = parseCsv(query.status)?.map((s) => s.toUpperCase());
    if (statuses) {
      list = list.filter((o) => statuses.includes(o.status));
    }

    const areas = parseCsv(query.area)?.map((a) => a.toLowerCase());
    if (areas) {
      list = list.filter((o) => areas.includes(o.area.toLowerCase()));
    }

    const sorted = sortByField(list, query.sort, [
      'id',
      'totalSantim',
      'area',
    ]);
    const sliced = sorted.slice(query.offset, query.offset + query.limit);
    const shaped = selectFields(sliced, query.fields, [
      'id',
      'restaurantId',
      'customerName',
      'area',
      'status',
      'totalSantim',
    ]);

    return {
      items: shaped,
      total: sorted.length,
      limit: query.limit,
      offset: query.offset,
    };
  }

  findOne(id: number): Order {
    const found = this.orderRepo.byId(id);
    if (!found) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    return found;
  }

  findByRestaurant(
    restaurantId: number,
    query: FindOrdersQueryDto,
  ): Page<Partial<Order>> {
    if (!this.restaurantRepo.byId(restaurantId)) {
      throw new NotFoundException(`Restaurant ${restaurantId} not found`);
    }

    const list = this.orderRepo.byRestaurantId(restaurantId);
    const sorted = sortByField(list, query.sort, [
      'id',
      'totalSantim',
      'area',
    ]);
    const sliced = sorted.slice(query.offset, query.offset + query.limit);
    const shaped = selectFields(sliced, query.fields, [
      'id',
      'restaurantId',
      'customerName',
      'area',
      'status',
      'totalSantim',
    ]);

    return {
      items: shaped,
      total: sorted.length,
      limit: query.limit,
      offset: query.offset,
    };
  }

  create(dto: CreateOrderDto): Order {
    if (!this.restaurantRepo.byId(dto.restaurantId)) {
      throw new UnprocessableEntityException(
        `Restaurant ${dto.restaurantId} does not exist`,
      );
    }

    return this.orderRepo.create({
      ...dto,
      status: 'PENDING',
    });
  }

  updateStatus(id: number, status: OrderStatus): Order {
    const existing = this.orderRepo.byId(id);
    if (!existing) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    return this.orderRepo.update({ ...existing, status });
  }

  // Idempotent DELETE: calling twice still succeeds with 204
  delete(id: number): void {
    this.orderRepo.deleteById(id);
  }
}