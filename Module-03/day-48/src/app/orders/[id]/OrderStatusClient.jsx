'use client';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

export default function OrderStatusClient({ orderId, initialData }) {
  // Poll every 5 seconds, seeded with server-rendered fallbackData
  const { data, error, isLoading } = useSWR(`/api/orders/${orderId}`, fetcher, {
    fallbackData: initialData,
    refreshInterval: 5000, 
  });

  if (error) return <div className="text-red-500">Failed to load order status.</div>;
  if (!data) return <div className="text-stone-400">Loading order status...</div>;

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4 text-stone-900">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="text-lg font-bold">Order #{data.id}</h3>
          <p className="text-sm text-stone-500">Placed for: {data.customerName}</p>
        </div>
        <span className="px-3 py-1 bg-amber-100 text-amber-900 font-semibold rounded-full text-sm">
          {data.status}
        </span>
      </div>
      <div className="flex justify-between items-center font-bold">
        <span>Total Amount:</span>
        <span className="text-amber-900">{data.totalPrice} ETB</span>
      </div>
      <p className="text-xs text-stone-400 italic">
        Live polling active (updates every 5 seconds with zero initial flash).
      </p>
    </div>
  );
}