import { Module } from '@nestjs/common';
import { Restaurant } from './restaurant.types.js';
import { seedRestaurants } from './restaurants.seed.js';

export const RESTAURANT_REPOSITORY = 'RESTAURANT_REPOSITORY';

export interface RestaurantRepository {
  all(): Restaurant[];
  byId(id: number): Restaurant | undefined;
}

export class InMemoryRestaurantRepository implements RestaurantRepository {
  private readonly store = new Map<number, Restaurant>();

  constructor(initial: Restaurant[] = []) {
    for (const item of initial) {
      this.store.set(item.id, item);
    }
  }

  all(): Restaurant[] {
    return Array.from(this.store.values());
  }

  byId(id: number): Restaurant | undefined {
    return this.store.get(id);
  }
}

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