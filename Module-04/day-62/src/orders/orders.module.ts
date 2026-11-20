// src/orders/orders.module.ts
import { Module } from '@nestjs/common';
import { InMemoryOrdersRepository } from './in-memory-orders.repository.js';
import { OrderPolicyGuard } from './order-policy.guard.js';
import { OrdersController } from './orders.controller.js';
import { ORDERS_REPOSITORY } from './orders.repository.js';
import { OrdersSeed } from './orders.seed.js';

@Module({
  controllers: [OrdersController],
  providers: [
    { provide: ORDERS_REPOSITORY, useClass: InMemoryOrdersRepository },
    OrdersSeed,
    OrderPolicyGuard,
  ],
  exports: [ORDERS_REPOSITORY],
})
export class OrdersModule {}