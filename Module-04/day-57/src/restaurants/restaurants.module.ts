import { Module } from '@nestjs/common';
import { RestaurantsController } from './restaurants.controller.js';
import {
  InMemoryRestaurantRepository,
  RESTAURANT_REPOSITORY,
  RestaurantsService,
} from './restaurants.service.js';
import { seedRestaurants } from './restaurants.seed.js';

@Module({
  controllers: [RestaurantsController],
  providers: [
    {
      provide: RESTAURANT_REPOSITORY,
      useValue: new InMemoryRestaurantRepository(seedRestaurants),
    },
    RestaurantsService,
  ],
  exports: [RESTAURANT_REPOSITORY],
})
export class RestaurantsModule{}
