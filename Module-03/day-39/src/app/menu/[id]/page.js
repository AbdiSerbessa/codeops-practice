
import Link from 'next/link';
import { db } from '@/lib/db';

export default async function DishDetailPage({ params }) {
  // 1. Await params (Next.js 15 requirement) and fetch using db.js
  const { id } = await params;
  const dish = await db.dish.findUnique({ where: { id } });

  if (!dish) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Dish Not Found</h2>
        <p className="text-stone-600 mb-4">The dish you are looking for does not exist.</p>
        <Link href="/menu" className="text-amber-800 underline font-medium">Back to Menu</Link>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-stone-900">{dish.name}</h1>
          <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-medium">
            {dish.category}
          </span>
        </div>
        <p className="text-xl font-semibold text-amber-800 mb-4">{dish.price} {dish.currency || 'ETB'}</p>
        <p className="text-stone-600 mb-6">{dish.description}</p>
        
        <div className="flex gap-4">
          <Link
            href="/menu"
            className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Back to Menu
          </Link>
          <Link
            href={`/checkout?dishId=${dish.id}`}
            className="bg-amber-800 hover:bg-amber-900 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Order Now
          </Link>
        </div>
      </div>
    </main>
  );
}