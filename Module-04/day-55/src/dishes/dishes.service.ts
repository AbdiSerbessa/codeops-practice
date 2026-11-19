import type { DishRepository } from './dish.repository.js';
import type { RestaurantRepository } from '../restaurants/restaurant.repository.js';
import type { CreateDishInput, Dish } from './dish.types.js';
import { DishNotFoundError, RestaurantNotFoundError } from './dish.errors.js';

export class DishesService {
  constructor(
    private readonly dishRepository: DishRepository,
    private readonly restaurantRepository: RestaurantRepository,
  ) {}

  findAll(restaurantId?: number): Dish[] {
    if (restaurantId !== undefined) {
      return this.dishRepository.byRestaurantId(restaurantId);
    }
    return this.dishRepository.all();
  }

  findById(id: number): Dish {
    const dish = this.dishRepository.byId(id);
    if (!dish) {
      throw new DishNotFoundError(id);
    }
    return dish;
  }

  create(input: CreateDishInput): Dish {
    const restaurant = this.restaurantRepository.byId(input.restaurantId);
    if (!restaurant) {
      throw new RestaurantNotFoundError(input.restaurantId);
    }

    const existing = this.dishRepository.all();
    const nextId =
      existing.length > 0 ? Math.max(...existing.map((d) => d.id)) + 1 : 1;

    const newDish: Dish = {
      id: nextId,
      restaurantId: input.restaurantId,
      name: input.name,
      priceSantim: input.priceSantim,
    };

    return this.dishRepository.save(newDish);
  }
}