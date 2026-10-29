// src/app/dashboard/RevenueChart.jsx
'use client';

export default function RevenueChart({ chartData = [] }) {
  // Fallback if no order data exists yet
  const combinedData = chartData.length > 0 ? chartData : [
    { date: new Date().toISOString().split('T')[0], revenue: 0, orders: 0 }
  ];

  // Calculate max values for dynamic scaling of bar heights
  const maxRevenue = Math.max(...combinedData.map(d => d.revenue), 100);
  const maxOrders = Math.max(...combinedData.map(d => d.orders), 1);

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Combined Revenue & Orders Chart */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-xl overflow-visible">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
          <div>
            <h3 className="text-lg font-semibold text-amber-400">Daily Performance Overview</h3>
            <p className="text-xs text-stone-400">Revenue (ETB) and Order Volume combined over time</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-stone-300">
              <span className="w-3 h-3 bg-amber-600 rounded-sm inline-block"></span> Revenue (ETB)
            </span>
            <span className="flex items-center gap-1.5 text-stone-300">
              <span className="w-3 h-3 bg-amber-400 rounded-full inline-block"></span> Order Count
            </span>
          </div>
        </div>

        {/* Generous top padding (pt-24) and overflow-visible so tooltips never get cut off */}
        <div className="h-72 flex items-end gap-6 border-b border-stone-700 pb-2 px-2 pt-24 overflow-x-auto overflow-y-visible">
          {combinedData.map((item) => {
            const revenueHeight = Math.min(100, Math.max(10, (item.revenue / maxRevenue) * 100));
            const orderHeight = Math.min(100, Math.max(15, (item.orders / maxOrders) * 100));

            return (
              <div key={item.date} className="flex-1 min-w-[70px] flex flex-col items-center h-full justify-end group relative overflow-visible">
                
                {/* Fully visible hover tooltip positioned safely above the bar */}
                <div className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 bg-stone-950 border border-amber-500 px-3 py-2 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 text-xs space-y-1 whitespace-nowrap">
                  <p className="text-amber-400 font-bold border-b border-stone-800 pb-1">{item.date}</p>
                  <p className="text-stone-200">Revenue: <span className="text-amber-300 font-semibold">{item.revenue} ETB</span></p>
                  <p className="text-stone-200">Orders: <span className="text-amber-300 font-semibold">{item.orders}</span></p>
                </div>

                {/* Bars & Markers container */}
                <div className="w-full flex items-end justify-center gap-1.5 h-full pb-1">
                  {/* Revenue Bar */}
                  <div
                    style={{ height: `${revenueHeight}%` }}
                    className="w-1/2 bg-amber-600 rounded-t hover:bg-amber-500 transition-colors"
                  />
                  {/* Order Indicator Marker */}
                  <div
                    style={{ height: `${orderHeight}%` }}
                    className="w-2 bg-amber-400 rounded-full shadow-lg hover:bg-amber-300 transition-colors"
                  />
                </div>

                <span className="text-xs text-stone-400 mt-2">{item.date.slice(5)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}