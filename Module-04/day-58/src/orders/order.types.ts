export type OrderStatus =
  | 'PENDING'
  | 'PREPARING'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderLine {
  dishId: number;
  quantity: number;
  unitPriceSantim: number;
  lineTotalSantim: number;
}

export interface Order {
  id: number;
  restaurantId: number;
  customerName: string;
  customerPhone: string;
  area: string;
  deliveryMode: 'ASAP' | 'SCHEDULED';
  scheduledAt?: string;
  status: OrderStatus;
  lines: OrderLine[];
  totalSantim: number;
}