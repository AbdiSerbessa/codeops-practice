export class DishNotFoundError extends Error {
  constructor(id: number) {
    super(`Dish with id ${id} not found`);
    this.name = 'DishNotFoundError';
  }
}

export class RestaurantNotFoundError extends Error {
  constructor(restaurantId: number) {
    super(`Restaurant with id ${restaurantId} does not exist`);
    this.name = 'RestaurantNotFoundError';
  }
}