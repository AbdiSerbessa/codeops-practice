
export default function OrderLoadingSkeleton() {
  return (
    <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-xl animate-pulse">
      <div className="h-6 bg-stone-800 rounded w-1/4 mb-6"></div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 bg-stone-800/60 rounded w-full"></div>
        ))}
      </div>
    </div>
  );
}