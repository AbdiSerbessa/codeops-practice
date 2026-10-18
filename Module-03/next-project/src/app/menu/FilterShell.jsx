'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import CategoryBar from './CategoryBar';

export default function FilterShell({ categories, initialCategory, initialSearch, children }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearchChange = (e) => {
    const query = e.target.value;
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    router.push(`/menu?${params.toString()}`);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Search Bar */}
      <div className="w-full bg-white p-4 rounded-xl shadow-sm border border-stone-200">
        <input
          id="search"
          type="text"
          defaultValue={initialSearch}
          onChange={handleSearchChange}
          placeholder="Search dishes..."
          className="w-full px-4 py-2 border border-stone-300 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-800"
        />
      </div>

      {/* Main Two-Column Layout: Sidebar Left, Content Right */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
        {/* Left Sidebar */}
        <aside className="w-full bg-white p-5 rounded-xl shadow-sm border border-stone-200 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-stone-800 mb-3">Categories</h3>
            <CategoryBar categories={categories} activeCategory={initialCategory} />
          </div>

          <hr className="border-stone-100" />

          <div className="space-y-3 text-sm text-stone-600">
            <h3 className="text-sm font-semibold text-stone-800">Quick Info</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="font-medium text-stone-700">Location:</span>
                <span className="text-stone-500 text-right">Addis Ababa</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-stone-700">Hours:</span>
                <span className="text-stone-500 text-right">8 AM - 10 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-stone-700">Delivery:</span>
                <span className="text-stone-500 text-right">45 mins</span>
              </div>
            </div>
          </div>

          <hr className="border-stone-100" />

          <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs text-amber-800 leading-relaxed">
            All our traditional dishes are prepared fresh daily using authentic ingredients and spices.
          </div>
        </aside>

        {/* Right Content Grid */}
        <section className="w-full">
          {children}
        </section>
      </div>
    </div>
  );
}