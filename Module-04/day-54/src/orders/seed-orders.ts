
import { Order } from "./order.types.js";
export const seedOrders: Order[] = [
  {
    id: 1,
    customerName: 'Selamawit Tadesse',
    area: 'Bole',
    status: 'delivered',
    dishes: [{ name: 'Kitfo', price: 42000 }],
    teleBirrPhone: '+251911000001',
    total: 42000,
  },
  {
    id: 2,
    customerName: 'Dawit Bekele',
    area: 'Piazza',
    status: 'preparing',
    dishes: [{ name: 'Beyaynetu', price: 28000 }],
    total: 28000,
  },
];