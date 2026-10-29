'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { formatWhen, formatRelative } from '@/lib/format';
import { toCsv, downloadCsv } from '@/lib/csv';

const DeliveryMap = dynamic(() => import('./DeliveryMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-stone-900 border border-stone-800 rounded-xl flex items-center justify-center text-stone-500 animate-pulse">
      Loading Delivery Map...
    </div>
  ),
});

export default function OrderTrackingPage({ params }) {
  const [orderId, setOrderId] = useState(null);
  const [status, setStatus] = useState('Connecting...');
  const [isConnected, setIsConnected] = useState(false);
  const [courierPos, setCourierPos] = useState([8.9806, 38.7578]);
  const destinationPos = [8.9950, 38.7800];
  const [history, setHistory] = useState([]);

  // Step 1: Unwrap Next.js 15 async params and validate order
  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params;
      if (resolvedParams?.id) {
        setOrderId(resolvedParams.id);
      }
    }
    getParams();
  }, [params]);

  // Step 2: Establish EventSource connection once orderId is ready
  useEffect(() => {
    if (!orderId) return;

    console.log('[Client] Connecting EventSource to:', `/api/orders/${orderId}/stream`);
    const eventSource = new EventSource(`/api/orders/${orderId}/stream`);

    eventSource.onopen = () => {
      console.log('[Client] SSE Stream connected');
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.error || data.message === 'Order not found') {
          setStatus('Order Not Found');
          setIsConnected(false);
          eventSource.close();
          return;
        }

        setStatus(data.status || 'PENDING');

        if (data.courierLocation) {
          setCourierPos(data.courierLocation);
        }

        const timestamp = data.timestamp || new Date().toISOString();
        const historyEntry = {
          status: data.status || 'PENDING',
          timestamp,
          formattedTime: formatWhen(timestamp),
          relativeTime: formatRelative(timestamp),
        };

        setHistory((prev) => {
          if (prev.length > 0 && prev[0].status === data.status) {
            return prev;
          }
          return [historyEntry, ...prev];
        });

        if (data.status === 'DELIVERED' || data.status === 'CANCELLED') {
          eventSource.close();
          setIsConnected(false);
        }
      } catch (err) {
        console.error('[Client] Failed to parse SSE data:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('[Client] EventSource connection error:', err);
      setIsConnected(false);
      eventSource.close();
    };

    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  }, [orderId]);

  const handleExportCsv = () => {
    if (history.length === 0) return;
    const csvData = history.map((h) => ({
      'Order ID': orderId,
      'Status': h.status,
      'Timestamp': h.timestamp,
      'Formatted Time': h.formattedTime,
    }));
    const csvString = toCsv(csvData);
    downloadCsv(`order-${orderId}-history.csv`, csvString);
  };

  return (
    <main className="min-h-screen bg-stone-950 text-stone-100 p-6 sm:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-xl">
          <div>
            <span className="text-xs uppercase tracking-wider text-amber-500 font-semibold">Live Tracking</span>
            <h1 className="text-2xl font-bold text-white mt-1">Order #{orderId || '...'}</h1>
            <p className="text-stone-400 text-sm mt-1">
              Current Status: <span className="text-amber-400 font-medium">{status}</span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-stone-950 px-3 py-1.5 rounded-lg border border-stone-800 text-xs">
              <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-stone-300">{isConnected ? 'Live Connected' : 'Disconnected'}</span>
            </div>

            <button
              onClick={handleExportCsv}
              disabled={history.length === 0}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold rounded-lg text-xs transition-colors shadow-lg"
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DeliveryMap courierPos={courierPos} destinationPos={destinationPos} />
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-amber-400 mb-3">Live Status Updates</h3>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {history.map((item, index) => (
                  <div key={index} className="p-3 bg-stone-950 rounded-lg border border-stone-800 text-xs">
                    <p className="text-white font-semibold">{item.status}</p>
                    <p className="text-stone-400 mt-0.5">{item.formattedTime} ({item.relativeTime})</p>
                  </div>
                ))}
                {history.length === 0 && (
                  <p className="text-xs text-stone-500 italic">Awaiting connection stream updates...</p>
                )}
              </div>
            </div>
            <p className="text-[11px] text-stone-500 mt-4 border-t border-stone-800 pt-3">
              This text panel provides an accessible overview alongside the interactive map visualization.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}