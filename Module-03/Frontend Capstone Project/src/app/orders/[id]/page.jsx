// src/app/orders/[id]/page.jsx
import OrderStatusClient from './OrderStatusClient';


// src/app/orders/[id]/page.js

export async function generateMetadata({ params }) {
  const { id } = await params;
  
  return {
    title: `Order Status #${id.slice(0, 8)}`,
    description: `Track live delivery status and details for order #${id}.`,
  };
}

// Server component fetching initial order data
async function getOrder(id) {
  // Replace this with your actual DB query or API endpoint
  // For now, returning a mock initial payload matching your database structure
  return {
    id,
    status: 'Preparing',
    customerName: 'Abebe Bikila',
    totalPrice: 920,
    createdAt: new Date().toISOString(),
  };
}

export default async function OrderPage({ params }) {
  const { id } = await params;
  const initialOrder = await getOrder(id);

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-stone-100">Order Tracking</h2>
      <OrderStatusClient orderId={id} initialData={initialOrder} />
    </main>
  );
}