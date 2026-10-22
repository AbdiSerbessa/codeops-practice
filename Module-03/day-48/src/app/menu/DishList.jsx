// src/app/menu/DishList.jsx
'use client';

import Image from 'next/image';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import Link from 'next/link';
import AddToCart from './AddToCart';
import { useSearchParams, useRouter } from 'next/navigation';

export default function DishList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || 'All';
  const page = searchParams.get('page') || '1';

  // Conditional SWR key: fetches menu based on search, category, and page params
  const swrKey = `/api/menu?search=${search}&category=${selectedCategory}&page=${page}`;

  const { data, error, isLoading } = useSWR(swrKey, fetcher, {
    keepPreviousData: true, // Prevents list flashing between searches, category clicks, and pagination
  });

  // Extract dishes array and pagination metadata returned from the API handler
  const dishes = data?.dishes || data || [];
  const totalPages = data?.totalPages || 1;

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.replace(`/menu?${params.toString()}`, { scroll: false });
  };

  // Initial loading state
  if (isLoading && !data) {
    return (
      <div className="text-center py-12 bg-white border border-stone-200 rounded-xl">
        <p className="text-stone-500">Loading dishes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-white border border-stone-200 rounded-xl">
        <p className="text-red-500">Failed to load menu items.</p>
      </div>
    );
  }

  if (dishes.length === 0) {
    return (
      <div className="text-center py-12 bg-white border border-stone-200 rounded-xl">
        <p className="text-stone-500">No dishes found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Dish Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {dishes.map((dish, index) => (
          <div key={dish.id} className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
            {/* Optimized Image Container */}
            <div className="relative w-full h-48 bg-stone-100">
              {dish.image ? (
                <Image
                  src={dish.image}
                  alt={dish.name || 'Ethiopian Dish'}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  priority={index === 0}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs font-medium">
                  No Image Available
                </div>
              )}
            </div>

            <div className="p-6 flex flex-col justify-between flex-grow">
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

              <div className="space-y-2 mt-4">
                {/* Updated with min-h-[44px] touch target & focus-visible styles */}
                <Link
                  href={`/menu/${dish.id}`}
                  className="text-center flex items-center justify-center w-full min-h-[44px] bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-800 font-medium px-4 py-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                >
                  View Details
                </Link>
                <AddToCart dish={dish} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center pt-6 border-t border-stone-200">
        <button
          type="button"
          aria-label="Previous Page"
          disabled={Number(page) <= 1}
          onClick={() => handlePageChange(Number(page) - 1)}
          className="min-h-[44px] min-w-[44px] px-4 py-2 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 flex items-center justify-center"
        >
          Previous
        </button>

        <span className="text-stone-500 text-sm font-medium">
          Page {page} of {totalPages || 1}
        </span>

        <button
          type="button"
          aria-label="Next Page"
          disabled={Number(page) >= totalPages}
          onClick={() => handlePageChange(Number(page) + 1)}
          className="min-h-[44px] min-w-[44px] px-4 py-2 bg-amber-800 hover:bg-amber-900 active:bg-amber-950 text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 flex items-center justify-center"
        >
          Next
        </button>
      </div>
    </div>
  );
}