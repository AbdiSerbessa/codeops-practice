import { Restaurant } from './restaurant.types.js';

export interface RestaurantRepository {
  all(): Restaurant[];
  byId(id: number): Restaurant | undefined;
}

export class InMemoryRestaurantRepository implements RestaurantRepository {
  private readonly store = new Map<number, Restaurant>();

  constructor(initialRestaurants: Restaurant[] = []) {
    for (const restaurant of initialRestaurants) {
      this.store.set(restaurant.id, restaurant);
    }
  }

  all(): Restaurant[] {
    return Array.from(this.store.values());
  }

  byId(id: number): Restaurant | undefined {
    return this.store.get(id);
  }
}