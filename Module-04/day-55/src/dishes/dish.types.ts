export interface Dish {
  id: number;
  restaurantId: number;
  name: string;
  priceSantim: number;
}

export interface CreateDishInput {
  restaurantId: number;
  name: string;
  priceSantim: number;
}