// src/app/menu/CategoryBar.jsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function CategoryBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get active category from URL, default to 'All'
  const activeCategory = searchParams.get('category') || 'All';
  
  // Updated to match your db.js categories ('Main', 'Vegetarian')
  const categories = ['All', 'Main', 'Vegetarian'];

  const handleSelect = (cat) => {
    const params = new URLSearchParams(searchParams);
    if (cat === 'All') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex gap-3 pb-3 border-b overflow-x-auto mb-6">
      {categories.map((cat) => {
        const isActive = activeCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => handleSelect(cat)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              isActive
                ? 'bg-amber-800 text-white'
                : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}