import { Order } from './order.types.js';

export const seedOrders: Order[] = [
  { id: 1, restaurantId: 1, customerName: 'Selamawit Tadesse', area: 'Bole', status: 'DELIVERED', totalSantim: 85000 },
  { id: 2, restaurantId: 1, customerName: 'Dawit Bekele', area: 'Bole', status: 'PENDING', totalSantim: 62000 },
  { id: 3, restaurantId: 2, customerName: 'Hanna Girma', area: 'Piazza', status: 'PREPARING', totalSantim: 94000 },
  { id: 4, restaurantId: 2, customerName: 'Yohannes Kebede', area: 'Piazza', status: 'PENDING', totalSantim: 48000 },
  { id: 5, restaurantId: 3, customerName: 'Meron Alemu', area: 'Atlas', status: 'OUT_FOR_DELIVERY', totalSantim: 112000 },
  { id: 6, restaurantId: 3, customerName: 'Bereket Tesfaye', area: 'Atlas', status: 'DELIVERED', totalSantim: 73000 },
  { id: 7, restaurantId: 4, customerName: 'Tigist Hailu', area: 'Gerji', status: 'CANCELLED', totalSantim: 54000 },
  { id: 8, restaurantId: 4, customerName: 'Abel Mekonnen', area: 'Gerji', status: 'PENDING', totalSantim: 67000 },
  { id: 9, restaurantId: 1, customerName: 'Rahel Solomon', area: 'Bole', status: 'PREPARING', totalSantim: 79000 },
  { id: 10, restaurantId: 2, customerName: 'Nahom Gebre', area: 'Piazza', status: 'DELIVERED', totalSantim: 51000 },
  { id: 11, restaurantId: 3, customerName: 'Bethlehem Assefa', area: 'Atlas', status: 'PENDING', totalSantim: 88000 },
  { id: 12, restaurantId: 4, customerName: 'Kidus Worku', area: 'Gerji', status: 'OUT_FOR_DELIVERY', totalSantim: 96000 },
  { id: 13, restaurantId: 1, customerName: 'Eyerusalem Dinku', area: 'Bole', status: 'DELIVERED', totalSantim: 64000 },
  { id: 14, restaurantId: 2, customerName: 'Samuel Haile', area: 'Piazza', status: 'CANCELLED', totalSantim: 43000 },
];