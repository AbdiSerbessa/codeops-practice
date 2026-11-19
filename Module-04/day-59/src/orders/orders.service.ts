import { Injectable } from '@nestjs/common';

export interface OrderSummary {
  id: number;
  restaurant: string;
  area: string;
  status: 'PENDING' | 'PREPARING' | 'DELIVERED';
  totalSantim: number;
}

@Injectable()
export class OrdersService {
  private readonly orders: OrderSummary[] = [
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

  findAll(area?: string): OrderSummary[] {
    if (!area) {
      return this.orders;
    }
    return this.orders.filter((order) => order.area === area);
  }

  create(payload: { restaurant: string; area: string; totalSantim: number }): OrderSummary {
    const created: OrderSummary = {
      id: this.orders.length + 1,
      restaurant: payload.restaurant,
      area: payload.area.toLowerCase(),
      status: 'PENDING',
      totalSantim: payload.totalSantim,
    };
    this.orders.push(created);
    return created;
  }

  // Deliberate 6-second delay to prove TimeoutInterceptor answers 408 at 5 seconds
  async slowReport(delayMs = 6000): Promise<{ status: string; delayMs: number }> {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return { status: 'completed', delayMs };
  }
}