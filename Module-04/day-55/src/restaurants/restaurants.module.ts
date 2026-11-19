import { Module } from '@nestjs/common';
import { InMemoryRestaurantRepository } from './restaurant.repository.js';
import { seedRestaurants } from './restaurants.seed.js';

export const RESTAURANT_REPOSITORY = 'RESTAURANT_REPOSITORY';

@Module({
  providers: [
    {
      provide: RESTAURANT_REPOSITORY,
      useValue: new InMemoryRestaurantRepository(seedRestaurants),
    },
  ],
  exports: [RESTAURANT_REPOSITORY],
})
export class RestaurantsModule {}