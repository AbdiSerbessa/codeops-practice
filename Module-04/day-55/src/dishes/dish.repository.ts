import { Dish } from './dish.types.js';

export interface DishRepository {
  all(): Dish[];
  byId(id: number): Dish | undefined;
  byRestaurantId(restaurantId: number): Dish[];
  save(dish: Dish): Dish;
}

export class InMemoryDishRepository implements DishRepository {
  private readonly store = new Map<number, Dish>();

  constructor(initialDishes: Dish[] = []) {
    for (const dish of initialDishes) {
      this.store.set(dish.id, dish);
    }
  }

  all(): Dish[] {
    return Array.from(this.store.values());
  }

  byId(id: number): Dish | undefined {
    return this.store.get(id);
  }

  byRestaurantId(restaurantId: number): Dish[] {
    return this.all().filter((dish) => dish.restaurantId === restaurantId);
  }

  save(dish: Dish): Dish {
    this.store.set(dish.id, dish);
    return dish;
  }
}