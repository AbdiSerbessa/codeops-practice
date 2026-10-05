export default function MenuLoading() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-8 bg-stone-200 rounded w-1/4 mb-4"></div>
      <div className="h-4 bg-stone-200 rounded w-2/4 mb-8"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-stone-100 border border-stone-200 rounded-xl p-6 h-48"></div>
        ))}
      </div>
    </main>
  );
}