import CategoryBar from './CategoryBar';

export default function MenuLayout({ children }) {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Persistent Category Sidebar */}
      <aside className="w-full md:w-1/4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="font-semibold text-lg mb-4 text-amber-900">Categories</h3>
        <CategoryBar />
      </aside>

      {/* Main Content / Nested Pages */}
      <section className="flex-1 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        {children}
      </section>
    </div>
  );
}