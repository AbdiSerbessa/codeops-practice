export default function CategoryBar() {
  const categories = ['All', 'Traditional', 'Vegan', 'Signature'];

  return (
    <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
      {categories.map((cat, index) => (
        <button
          key={index}
          className="px-4 py-2 bg-white border border-stone-200 text-stone-700 hover:bg-amber-700 hover:text-white rounded-full text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
        >
          {cat}
        </button>
      ))}
    </div>
  );
}