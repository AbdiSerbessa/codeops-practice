export type OrderStatus =
  | 'pending'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  customerId: string;
  courierId?: string;
  restaurantId: string;
  item: string;
  status: OrderStatus;
}