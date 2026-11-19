import { Module } from '@nestjs/common';
import { DishesController } from './dishes.controller.js';
import { DishesService } from './dishes.service.js';
import {
  DishRepository,
  InMemoryDishRepository,
} from './dish.repository.js';
import { seedDishes } from './dishes.seed.js';
import {
  RESTAURANT_REPOSITORY,
  RestaurantsModule,
} from '../restaurants/restaurants.module.js';
import type { RestaurantRepository } from '../restaurants/restaurant.repository.js';

export const DISH_REPOSITORY = 'DISH_REPOSITORY';

@Module({
  imports: [RestaurantsModule],
  controllers: [DishesController],
  providers: [
    {
      provide: DISH_REPOSITORY,
      useValue: new InMemoryDishRepository(seedDishes),
    },
    {
      provide: DishesService,
      useFactory: (
        dishRepo: DishRepository,
        restaurantRepo: RestaurantRepository,
      ) => new DishesService(dishRepo, restaurantRepo),
      inject: [DISH_REPOSITORY, RESTAURANT_REPOSITORY],
    },
  ],
})
export class DishesModule {}