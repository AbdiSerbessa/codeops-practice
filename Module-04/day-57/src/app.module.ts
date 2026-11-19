// src/app.module.ts
import { Module } from '@nestjs/common';
import { RestaurantsModule } from './restaurants/restaurants.module.js';
import { OrdersModule } from './orders/orders.module.js';

@Module({
  imports: [RestaurantsModule, OrdersModule],
})
export class AppModule {}