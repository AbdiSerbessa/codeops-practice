// src/orders/order.types.ts

export const AREAS = ['Bole', 'Piazza', 'Kazanchis', 'Arat Kilo'] as const;
export type Area = (typeof AREAS)[number];

export const ORDER_STATUSES = [
  'pending',
  'preparing',
  'out-for-delivery',
  'delivered',
  'cancelled',
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type Dish = {
  readonly name: string;
  readonly price: number; // in santim
};

export type Order = {
  readonly id: number;
  customerName: string;
  area: Area;
  status: OrderStatus;
  dishes: Dish[];
  teleBirrPhone?: string;
  total: number;
};

export function deliveryFee(order: Order): number {
  if (order.total > 50000) return 0; // Free delivery above 500 ETB
  if (order.area === 'Bole') return 4000; // 40 ETB
  return 6000; // 60 ETB elsewhere
}