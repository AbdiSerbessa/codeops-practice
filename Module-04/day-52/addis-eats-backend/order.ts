// 1. Delivery areas built from an 'as const' array
const AREAS = ['Bole', 'Piassa', 'Kazanchis', 'Sarbet'] as const;
type Area = typeof AREAS[number];

// 2. Order status union type (5 initial states)
type OrderStatus = 'received' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

// 3. Dish and Order type definitions (prices & totals stored in santim: 1 ETB = 100 santim)
type Dish = {
  name: string;
  price: number;
};

type Order = {
  readonly id: string;
  customerName: string;
  area: Area;
  status: OrderStatus;
  dishes: Dish[];
  teleBirrPhone?: string;
  total: number;
};

// Currency formatting helper using Intl.NumberFormat (converts santim to ETB)
const formatETB = (santim: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'ETB',
  }).format(santim / 100);
};

// 4. Delivery fee calculation function (Free above 500 ETB [50,000 santim], 40 ETB to Bole [4,000 santim], 60 ETB elsewhere [6,000 santim])
function deliveryFee(order: Order): number {
  if (order.total > 50000) {
    return 0;
  }
  return order.area === 'Bole' ? 4000 : 6000;
}

// 5. Exhaustive status message handler with a 'never' default
function statusMessage(status: OrderStatus): string {
  switch (status) {
    case 'received':
      return 'Your order has been received and is being processed.';
    case 'preparing':
      return 'The kitchen is currently preparing your dishes.';
    case 'out_for_delivery':
      return 'Your courier is on the way to your delivery address.';
    case 'delivered':
      return 'Your order has been successfully delivered. Enjoy!';
    case 'cancelled':
      return 'This order has been cancelled.';
    default:
      const _exhaustiveCheck: never = status;
      return _exhaustiveCheck;
  }
}

// 6. Receipt generation helper using multi-line template literals and the formatting helper
function receipt(order: Order): string {
  const fee = deliveryFee(order);
  const grandTotal = order.total + fee;

  const dishLines = order.dishes
    .map(dish => `  - ${dish.name}: ${formatETB(dish.price)}`)
    .join('\n');

  return `
========================================
            ADDIS EATS RECEIPT
========================================
Order ID        : ${order.id}
Customer Name   : ${order.customerName}
Delivery Area   : ${order.area}
Status          : ${statusMessage(order.status)}
${order.teleBirrPhone ? `TeleBirr Phone : ${order.teleBirrPhone}` : ''}

Ordered Dishes:
${dishLines}

Subtotal        : ${formatETB(order.total)}
Delivery Fee    : ${formatETB(fee)}
Grand Total     : ${formatETB(grandTotal)}
========================================`.trim();
}
// Sample test order to see the output
// const sampleOrder: Order = {
//   id: 'ord_999',
//   customerName: 'Abebe Kebede',
//   area: 'Bole',
//   status: 'preparing',
//   dishes: [
//     { name: 'Doro Wat', price: 45000 }, // 450 ETB
//     { name: 'Injera (Extra)', price: 5000 } // 50 ETB
//   ],
//   teleBirrPhone: '+251911223344',
//   total: 50000 // 500 ETB
// };

// // Print the generated receipt to the console
// console.log(receipt(sampleOrder));