import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ORDERS_REPOSITORY, type OrdersRepository } from './orders.repository.js';

@Injectable()
export class OrdersSeed implements OnModuleInit {
  constructor(
    @Inject(ORDERS_REPOSITORY)
    private readonly ordersRepo: OrdersRepository,
  ) {}

  async onModuleInit(): Promise<void> {
    const existing = await this.ordersRepo.findAll();
    if (existing.length > 0) return;

    await this.ordersRepo.create({
      id: 'order-1',
      customerId: 'user-customer-1',
      courierId: 'user-courier-1',
      restaurantId: 'rest-1',
      item: 'Beyaynetu Platter',
      status: 'pending',
    });

    await this.ordersRepo.create({
      id: 'order-2',
      customerId: 'user-customer-1',
      courierId: 'user-courier-1',
      restaurantId: 'rest-1',
      item: 'Kitfo Special',
      status: 'out_for_delivery',
    });

    await this.ordersRepo.create({
      id: 'order-3',
      customerId: 'user-customer-2',
      restaurantId: 'rest-2',
      item: 'Shiro Tagabino',
      status: 'pending',
    });
  }
}