// src/app/menu/DishList.jsx
'use client';

import Link from 'next/link';
import AddToCart from './AddToCart';
import { useSearchParams } from 'next/navigation';

export default function DishList({ dishes = [] }) {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'All';

  // Filter dishes based on the selected category query parameter
  const filteredDishes = selectedCategory === 'All'
    ? dishes
    : dishes.filter(dish => dish.category.toLowerCase() === selectedCategory.toLowerCase());

  if (filteredDishes.length === 0) {
    return (
      <div className="text-center py-12 bg-white border border-stone-200 rounded-xl">
        <p className="text-stone-500">No dishes found in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {filteredDishes.map((dish) => (
        <div key={dish.id} className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold text-stone-900">{dish.name}</h3>
              <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-medium">
                {dish.category}
              </span>
            </div>
            <p className="text-stone-600 text-sm mb-4">{dish.description}</p>
            <p className="text-amber-800 font-semibold mb-4">{dish.price} {dish.currency || 'ETB'}</p>
          </div>
          <Link
            href={`/menu/${dish.id}`}
            className="text-center block w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium py-2 rounded-lg transition-colors"
          >
            View Details
          </Link>
          <div className="flex-1">
    <AddToCart dish={dish} />
  </div>
        </div>
      ))}
    </div>
  );
}