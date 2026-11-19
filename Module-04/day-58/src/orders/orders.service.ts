import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DISHES, RESTAURANTS } from '../catalog/catalog.data.js';
import type { CreateOrderDto } from './dto/create-order.dto.js';
import type { Order, OrderLine, OrderStatus } from './order.types.js';

const ALLOWED_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  PENDING: ['PREPARING', 'CANCELLED'],
  PREPARING: ['OUT_FOR_DELIVERY', 'CANCELLED'],
  OUT_FOR_DELIVERY: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};

@Injectable()
export class OrdersService {
  private readonly orders = new Map<number, Order>();
  private nextId = 2;

  constructor() {
    this.orders.set(1, {
      id: 1,
      restaurantId: 1,
      customerName: 'Selamawit Tadesse',
      customerPhone: '0911223344',
      area: 'Bole',
      deliveryMode: 'ASAP',
      status: 'DELIVERED',
      lines: [
        {
          dishId: 101,
          quantity: 2,
          unitPriceSantim: 45000,
          lineTotalSantim: 90000,
        },
      ],
      totalSantim: 90000,
    });
  }

  findAll(): Order[] {
    return Array.from(this.orders.values());
  }

  findOne(id: number): Order {
    const order = this.orders.get(id);
    if (!order) {
      throw new NotFoundException(`Order ${id} was not found.`);
    }
    return order;
  }

  create(dto: CreateOrderDto): Order {
    // 1. EXISTENCE: verify restaurant and every requested dish exist
    const restaurant = RESTAURANTS.find((r) => r.id === dto.restaurantId);
    if (!restaurant) {
      throw new NotFoundException(`Restaurant ${dto.restaurantId} does not exist.`);
    }

    const resolvedDishes = dto.lines.map((line) => {
      const dish = DISHES.find((d) => d.id === line.dishId);
      if (!dish) {
        throw new NotFoundException(`Dish ${line.dishId} does not exist.`);
      }
      return { line, dish };
    });

    // 2. STATE: verify restaurant is open and every dish is currently available
    if (!restaurant.isOpen) {
      throw new ConflictException(
        `Restaurant "${restaurant.name}" is currently closed and cannot accept orders.`,
      );
    }

    for (const { dish } of resolvedDishes) {
      if (!dish.available) {
        throw new ConflictException(
          `Dish "${dish.name}" (id=${dish.id}) is currently sold out.`,
        );
      }
    }

    // 3. RELATIONSHIP: verify every dish belongs to the target restaurant
    for (const { dish } of resolvedDishes) {
      if (dish.restaurantId !== restaurant.id) {
        throw new UnprocessableEntityException(
          `Dish ${dish.id} belongs to restaurant ${dish.restaurantId}, not restaurant ${restaurant.id}.`,
        );
      }
    }

    // 4. WORK: build order lines and compute totalSantim strictly on the server
    const lines: OrderLine[] = resolvedDishes.map(({ line, dish }) => ({
      dishId: dish.id,
      quantity: line.quantity,
      unitPriceSantim: dish.priceSantim,
      lineTotalSantim: dish.priceSantim * line.quantity,
    }));

    const subtotalSantim = lines.reduce((sum, l) => sum + l.lineTotalSantim, 0);
    const totalSantim = subtotalSantim + (dto.tipSantim ?? 0);

    const created: Order = {
      id: this.nextId++,
      restaurantId: restaurant.id,
      customerName: dto.customerName,
      customerPhone: dto.customerPhone,
      area: dto.area,
      deliveryMode: dto.deliveryMode,
      scheduledAt: dto.scheduledAt,
      status: 'PENDING',
      lines,
      totalSantim,
    };

    this.orders.set(created.id, created);
    return created;
  }

  transitionStatus(id: number, nextStatus: OrderStatus): Order {
    const order = this.findOne(id);
    const allowed = ALLOWED_TRANSITIONS[order.status];

    if (!allowed.includes(nextStatus)) {
      throw new ConflictException(
        `Cannot transition order ${id} from ${order.status} to ${nextStatus}. Allowed next states: ${
          allowed.length > 0 ? allowed.join(', ') : 'none (terminal state)'
        }.`,
      );
    }

    const updated: Order = { ...order, status: nextStatus };
    this.orders.set(id, updated);
    return updated;
  }

  // Forced TypeError endpoint for Acceptance Criterion 4
  triggerBug(): never {
    const broken = undefined as unknown as { compute(): number };
    broken.compute();
    throw new Error('unreachable');
  }
}