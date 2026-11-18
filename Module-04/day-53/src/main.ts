// src/main.ts
import {
  InMemoryOrderRepository,
  Order,
  OrderNotFoundError,
  OrderService,
} from './orders';

const seedOrders: Order[] = [
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

const repo = new InMemoryOrderRepository(seedOrders);
const service = new OrderService(repo);

console.log('Customer Names:', service.summarise('customerName')); // Inferred as string[]
console.log('Fees by Area:', service.feesByArea());

try {
  service.find(999);
} catch (error) {
  if (error instanceof OrderNotFoundError) {
    console.error(`Caught expected error for ID ${error.id}: ${error.message}`);
  }
}