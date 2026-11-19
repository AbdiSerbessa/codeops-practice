export interface RestaurantRecord {
  id: number;
  name: string;
  area: string;
  isOpen: boolean;
}

export interface DishRecord {
  id: number;
  restaurantId: number;
  name: string;
  priceSantim: number;
  available: boolean;
}

export const RESTAURANTS: RestaurantRecord[] = [
  { id: 1, name: 'Yod Abyssinia', area: 'Bole', isOpen: true },
  { id: 2, name: 'Kategna Restaurant', area: 'Piazza', isOpen: false }, // closed state test
];

export const DISHES: DishRecord[] = [
  { id: 101, restaurantId: 1, name: 'Beyaynetu Special', priceSantim: 45000, available: true },
  { id: 102, restaurantId: 1, name: 'Kitfo Leb Leb', priceSantim: 68000, available: true },
  { id: 103, restaurantId: 1, name: 'Doro Wat (Sold Out)', priceSantim: 72000, available: false },
  { id: 201, restaurantId: 2, name: 'Tibs Firfir', priceSantim: 52000, available: true },
];