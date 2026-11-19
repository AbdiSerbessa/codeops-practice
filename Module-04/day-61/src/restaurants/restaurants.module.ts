import { Module } from '@nestjs/common';
import { RestaurantsController } from './restaurants.controller.js';

@Module({
  controllers: [RestaurantsController],
})
export class RestaurantsModule {}