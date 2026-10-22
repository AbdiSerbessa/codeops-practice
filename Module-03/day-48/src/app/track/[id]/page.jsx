
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { formatETB, formatWhen, formatRelative } from '@/lib/format';
import { toCsv, downloadCsv } from '@/lib/csv';

// Dynamically import the map with ssr: false and a sized loading placeholder
const DeliveryMap = dynamic(() => import('./DeliveryMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-stone-900 border border-stone-800 rounded-xl flex items-center justify-center text-stone-500 animate-pulse">
      Loading Delivery Map...
    </div>
  ),
});

export default function OrderTrackingPage({ params }) {
  // Unwrap params using React.use() or handle asynchronously if needed in Next.js 15
  const [orderId, setOrderId] = useState(null);
  const [status, setStatus] = useState('Connecting...');
  const [isConnected, setIsConnected] = useState(false);
  const [courierPos, setCourierPos] = useState([8.9806, 38.7578]);
  const destinationPos = [8.9950, 38.7800]; // Example Addis Ababa destination coordinates
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function resolveParams() {
      const resolved = await params;
      setOrderId(resolved.id);
    }
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!orderId) return;

    // Connect to Server-Sent Events stream
    const eventSource = new EventSource(`/api/orders/${orderId}/stream`);

    setIsConnected(true);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStatus(data.status);
      if (data.courierLocation) {
        setCourierPos(data.courierLocation);
      }

      const historyEntry = {
        status: data.status,
        timestamp: data.timestamp,
        formattedTime: formatWhen(data.timestamp),
        relativeTime: formatRelative(data.timestamp),
      };

      setHistory((prev) => [historyEntry, ...prev]);

      // Close stream once delivered
      if (data.status === 'Delivered') {
        eventSource.close();
        setIsConnected(false);
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
      eventSource.close();
    };

    // Clean up on unmount
    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  }, [orderId]);

  const handleExportCsv = () => {
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
        {/* Header & Status Indicator */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-xl">
          <div>
            <span className="text-xs uppercase tracking-wider text-amber-500 font-semibold">Live Tracking</span>
            <h1 className="text-2xl font-bold text-white mt-1">Order #{orderId}</h1>
            <p className="text-stone-400 text-sm mt-1">Current Status: <span className="text-amber-400 font-medium">{status}</span></p>
          </div>

          <div className="flex items-center gap-4">
            {/* Connection Indicator */}
            <div className="flex items-center gap-2 bg-stone-950 px-3 py-1.5 rounded-lg border border-stone-800 text-xs">
              <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-stone-300">{isConnected ? 'Live Connected' : 'Disconnected'}</span>
            </div>

            {/* CSV Export Button */}
            <button
              onClick={handleExportCsv}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-lg"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Map & Text Accessibility Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leaflet Map (2 columns) */}
          <div className="lg:col-span-2">
            <DeliveryMap courierPos={courierPos} destinationPos={destinationPos} />
          </div>

          {/* Text Information for Accessibility */}
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