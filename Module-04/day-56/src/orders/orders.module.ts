// src/orders/orders.module.ts
import { Module } from '@nestjs/common';
import { RestaurantsModule } from '../restaurants/restaurants.module.js';
import { InMemoryOrderRepository } from './order.repository.js';
import { OrdersController } from './orders.controller.js';
import { ORDER_REPOSITORY, OrdersService } from './orders.service.js';
import { seedOrders } from './orders.seed.js';

@Module({
  imports: [RestaurantsModule],
  controllers: [OrdersController],
  providers: [
    {
      provide: ORDER_REPOSITORY,
      useValue: new InMemoryOrderRepository(seedOrders),
    },
    OrdersService,
  ],
})
export class OrdersModule {}