// src/app/dashboard/RevenueChart.jsx
'use client';

export default function RevenueChart({ revenueData, timeData }) {
  const combinedData = [
    { date: '2026-10-14', revenue: 450, orders: 1 },
    { date: '2026-10-15', revenue: 320, orders: 1 },
    { date: '2026-10-16', revenue: 800, orders: 1 },
    { date: '2026-10-17', revenue: 270, orders: 1 },
    { date: '2026-10-18', revenue: 550, orders: 1 },
  ];

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Combined Revenue & Orders Chart */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-xl">
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

        {/* Added pt-12 so the tooltip has plenty of room at the top */}
        <div className="h-72 flex items-end gap-6 border-b border-stone-700 pb-2 px-2 pt-12">
          {combinedData.map((item) => {
            const revenueHeight = Math.min(100, (item.revenue / 1000) * 100);
            const orderHeight = Math.min(100, item.count * 30);

            return (
              <div key={item.date} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                
                {/* Fixed Hover Tooltip Positioned Cleanly Above */}
                <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-stone-950 border border-amber-600/60 px-3 py-1.5 rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-30 whitespace-nowrap text-xs">
                  <p className="text-amber-400 font-semibold">{item.date}</p>
                  <p className="text-stone-200">Revenue: <span className="text-amber-300 font-medium">{item.revenue} ETB</span></p>
                  <p className="text-stone-200">Orders: <span className="text-amber-300 font-medium">{item.orders}</span></p>
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
                    style={{ height: `${Math.max(25, orderHeight)}%` }}
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