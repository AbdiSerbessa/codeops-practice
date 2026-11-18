import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller.js';
import { OrdersService } from './orders.service.js';
import { InMemoryOrderRepository } from './order.repository.js';
import { seedOrders } from './seed-orders.js';

@Module({
  controllers: [OrdersController],
 providers: [
    OrdersService,
    {
      provide: 'ORDER_REPOSITORY',
      useValue: new InMemoryOrderRepository(seedOrders),
    },
  ],
})
export class OrdersModule {}