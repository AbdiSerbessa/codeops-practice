export type OrderStatus =
  | 'PENDING'
  | 'PREPARING'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface Order {
  id: number;
  restaurantId: number;
  customerName: string;
  area: string;
  status: OrderStatus;
  totalSantim: number;
}