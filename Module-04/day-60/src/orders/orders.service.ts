import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { getCurrentRequestId } from '../common/request-context.js';
import type { CreateOrderDto } from './dto/create-order.dto.js';

export interface OrderRecord {
  id: number;
  restaurant: string;
  area: string;
  status: 'PENDING' | 'PREPARING' | 'DELIVERED';
  totalSantim: number;
}

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  private readonly orders: OrderRecord[] = [
    {
      id: 1,
      restaurant: 'Yod Abyssinia',
      area: 'bole',
      status: 'DELIVERED',
      totalSantim: 90000,
    },
    {
      id: 2,
      restaurant: 'Kategna Restaurant',
      area: 'kazanchis',
      status: 'PENDING',
      totalSantim: 52000,
    },
    {
      id: 3,
      restaurant: 'Totot Traditional',
      area: 'piassa',
      status: 'PREPARING',
      totalSantim: 68000,
    },
  ];

  findAll(area?: string): OrderRecord[] {
    const requestId = getCurrentRequestId();
    this.logger.log({ requestId, area: area ?? 'all', action: 'list_orders' });
    if (!area) return this.orders;
    return this.orders.filter((o) => o.area === area.toLowerCase());
  }

  findOne(id: number): OrderRecord {
    const requestId = getCurrentRequestId();
    const order = this.orders.find((o) => o.id === id);
    if (!order) {
      this.logger.warn({ requestId, orderId: id, action: 'order_not_found' });
      throw new NotFoundException(`Order ${id} not found`);
    }
    this.logger.log({ requestId, orderId: id, action: 'get_order' });
    return order;
  }

  create(dto: CreateOrderDto): OrderRecord {
    const requestId = getCurrentRequestId();
    const created: OrderRecord = {
      id: this.orders.length + 1,
      restaurant: dto.restaurant,
      area: dto.area.toLowerCase(),
      status: 'PENDING',
      totalSantim: dto.totalSantim,
    };
    this.orders.push(created);
    this.logger.log({
      requestId,
      orderId: created.id,
      area: created.area,
      action: 'order_created',
    });
    return created;
  }

  async slowReport(delayMs = 6000): Promise<{ status: string; delayMs: number }> {
    const requestId = getCurrentRequestId();
    this.logger.log({ requestId, delayMs, action: 'slow_report_started' });
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return { status: 'completed', delayMs };
  }
}