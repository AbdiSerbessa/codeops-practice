export type OrderStatus =
  | 'PENDING'
  | 'PREPARING'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type OrderSort = 'id_asc' | 'id_desc' | 'total_asc' | 'total_desc';

export interface Order {
  id: number;
  restaurantId: number;
  customerName: string;
  area: string;
  status: OrderStatus;
  totalSantim: number;
}

export interface OrderFilters {
  status?: OrderStatus;
  area?: string;
  limit: number;
  offset: number;
  sort: OrderSort;
}