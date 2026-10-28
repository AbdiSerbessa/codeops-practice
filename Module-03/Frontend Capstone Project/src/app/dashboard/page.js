// src/app/dashboard/page.js
import { Suspense } from 'react';
import RevenueChart from './RevenueChart';
import OrderTable from '../orders/OrderTable';
import LoadingSkeleton from '../orders/loading';
import { db } from '@/lib/db';

// Fetch and aggregate live orders from the database
async function getDashboardData() {
  const ordersFromDb = await db.order.findMany();

  const orders = ordersFromDb.map((order) => {
    // Determine order total from totalAmount or cartItems sum
    const total =
      order.totalAmount ||
      order.total ||
      (order.cartItems
        ? order.cartItems.reduce(
            (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
            0
          )
        : 0);

    return {
      id: order.id,
      customer: order.name || order.customerName || 'Guest Customer',
      neighborhood: order.neighborhood || (order.phone ? `Phone: ${order.phone}` : 'Addis Ababa'),
      total: total,
      date: order.createdAt ? order.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
      status: order.status || 'PENDING',
    };
  }).reverse();

  // Aggregate revenue by neighborhood
  const revenueByNeighborhood = orders.reduce((acc, order) => {
    if (order.status.toLowerCase() !== 'cancelled') {
      acc[order.neighborhood] = (acc[order.neighborhood] || 0) + order.total;
    }
    return acc;
  }, {});

  // Aggregate orders over time
  const ordersOverTime = orders.reduce((acc, order) => {
    acc[order.date] = (acc[order.date] || 0) + 1;
    return acc;
  }, {});

  return {
    orders,
    revenueSummary: Object.entries(revenueByNeighborhood).map(([neighborhood, revenue]) => ({ neighborhood, revenue })),
    timeSummary: Object.entries(ordersOverTime).map(([date, count]) => ({ date, count })),
  };
}

export default async function DashboardPage({ searchParams }) {
  // Await searchParams to safely resolve parameters in Next.js App Router
  const resolvedParams = await searchParams;
  const data = await getDashboardData();

  return (
    <main className="min-h-screen bg-stone-950 text-stone-100 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-amber-500">Admin Dashboard</h1>
          <p className="text-stone-400 text-sm mt-1">Real-time business insights, neighborhood revenue, and order management.</p>
        </div>

        {/* Charts Section */}
        <Suspense fallback={<LoadingSkeleton />}>
          <RevenueChart revenueData={data.revenueSummary} timeData={data.timeSummary} />
        </Suspense>

        {/* Order Table Section */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-xl">
          <h2 className="text-xl font-bold mb-4 text-amber-400">Recent Orders</h2>
          <OrderTable orders={data.orders} searchParams={resolvedParams} />
        </div>
      </div>
    </main>
  );
}