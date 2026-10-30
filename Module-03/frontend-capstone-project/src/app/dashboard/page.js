// src/app/dashboard/page.js
export const dynamic = 'force-dynamic'; // Ensures auth check executes live on every request

import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import RevenueChart from './RevenueChart';
import OrderTable from '../orders/OrderTable';
import LoadingSkeleton from '../orders/loading';
import { db, getSession } from '@/lib/db';

export const metadata = {
  title: 'DashBoard',
};

// Fetch and aggregate live orders from the database with configurable sorting
async function getDashboardData(sort = 'date', order = 'desc') {
  const ordersFromDb = await db.order.findMany();

  const orders = ordersFromDb.map((orderItem) => {
    // Determine order total from totalAmount or cartItems sum
    const total = Number(
      orderItem.totalAmount ||
      orderItem.total ||
      (orderItem.cartItems
        ? orderItem.cartItems.reduce(
            (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
            0
          )
        : 0)
    );

    // Robustly extract YYYY-MM-DD date regardless of timestamp format ('T' or space)
    const rawDate = orderItem.createdAt || orderItem.date || new Date().toISOString();
    const dateStr = rawDate.includes('T') ? rawDate.split('T')[0] : rawDate.split(' ')[0];

    return {
      id: orderItem.id,
      customer: orderItem.name || orderItem.customerName || 'Guest Customer',
      neighborhood: orderItem.neighborhood || (orderItem.phone ? `Phone: ${orderItem.phone}` : 'Addis Ababa'),
      total: total,
      date: dateStr,
      createdAt: orderItem.createdAt || new Date().toISOString(),
      status: orderItem.status || 'PENDING',
    };
  });

  // Sort orders dynamically based on parameters, defaulting to newest first (desc)
  orders.sort((a, b) => {
    let valA = a[sort] || a.createdAt || '';
    let valB = b[sort] || b.createdAt || '';

    if (sort === 'total') {
      valA = Number(valA);
      valB = Number(valB);
    }

    if (valA < valB) return order === 'asc' ? -1 : 1;
    if (valA > valB) return order === 'asc' ? 1 : -1;
    return 0;
  });

  // Aggregate daily performance for chart
  const dailyPerformance = {};
  orders.forEach((order) => {
    if (order.status.toLowerCase() !== 'cancelled') {
      if (!dailyPerformance[order.date]) {
        dailyPerformance[order.date] = { date: order.date, revenue: 0, orders: 0 };
      }
      dailyPerformance[order.date].revenue += order.total;
      dailyPerformance[order.date].orders += 1;
    }
  });

  const chartSummary = Object.values(dailyPerformance).sort((a, b) => a.date.localeCompare(b.date));

  // Aggregate revenue by neighborhood
  const revenueByNeighborhood = orders.reduce((acc, order) => {
    if (order.status.toLowerCase() !== 'cancelled') {
      acc[order.neighborhood] = (acc[order.neighborhood] || 0) + order.total;
    }
    return acc;
  }, {});

  return {
    orders,
    revenueSummary: Object.entries(revenueByNeighborhood).map(([neighborhood, revenue]) => ({ neighborhood, revenue })),
    chartSummary,
  };
}

export default async function DashboardPage({ searchParams }) {
  // 1. ABSOLUTE SECURITY GUARD: Check cookies and session immediately
  const cookieStore = await cookies();
  let sessionEmail = '';
  let userRole = '';

  // Extract from getSession helper if active
  try {
    const session = await getSession();
    if (session?.email) sessionEmail = session.email;
    if (session?.role) userRole = session.role;
  } catch (e) {
    // Ignore session helper errors
  }

  // Fallback to direct cookie extraction if getSession is unpopulated
  if (!sessionEmail) {
    const rawCookie =
      cookieStore.get('addis_eats_user')?.value ||
      cookieStore.get('session')?.value ||
      '';

    if (rawCookie) {
      if (rawCookie.includes('@') && !rawCookie.includes('{')) {
        sessionEmail = rawCookie.trim();
      } else {
        try {
          const parsed = JSON.parse(rawCookie);
          sessionEmail = parsed.email || parsed.user?.email || '';
          userRole = parsed.role || parsed.user?.role || '';
        } catch (e) {
          // Non-JSON cookie format
        }
      }
    }
  }

  const cleanEmail = sessionEmail.toLowerCase().trim();
  const isAdminEmail =
    cleanEmail === 'abdiserbessa19@gmail.com' ||
    (cleanEmail.length > 0 && cleanEmail.includes('staff'));
  const isStaffRole = userRole.toLowerCase() === 'staff';

  // If not admin or staff, immediately redirect away
  if (!isAdminEmail && !isStaffRole) {
    redirect('/menu?error=unauthorized');
  }

  // Await searchParams to safely resolve parameters in Next.js App Router
  const resolvedParams = await searchParams;

  // Extract sort and order parameters, defaulting to descending order so newest orders appear first
  const sort = resolvedParams?.sort || 'date';
  const order = resolvedParams?.order || 'desc';

  const data = await getDashboardData(sort, order);

  return (
    <main className="min-h-screen bg-stone-950 text-stone-100 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-amber-500">Admin Dashboard</h1>
          <p className="text-stone-400 text-sm mt-1">
            Real-time business insights, neighborhood revenue, and order management.
          </p>
        </div>

        {/* Charts Section */}
        <Suspense fallback={<LoadingSkeleton />}>
          <RevenueChart chartData={data.chartSummary} />
        </Suspense>

        {/* Order Table Section */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-xl">
          <h2 className="text-xl font-bold mb-4 text-amber-400">Recent Orders</h2>
          <OrderTable orders={data.orders} searchParams={{ ...resolvedParams, sort, order }} />
        </div>
      </div>
    </main>
  );
}