// src/app/menu/page.jsx
import { db } from '@/lib/db';
import DishList from './DishList';
import FilterShell from './FilterShell';

export default async function MenuPage({ searchParams }) {
  // Temporary delay to test loading.js fallback
  await new Promise((resolve) => setTimeout(resolve, 200));

  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams?.search || '';
  const category = resolvedSearchParams?.category || 'All';

  const dishes = await db.dish.findMany({
    where: {
      category: category !== 'All' ? category : undefined,
      search: search,
    },
  });

  const allDishes = await db.dish.findMany();
  const categories = ['All', ...new Set(allDishes.map((d) => d.category))];

  return (
    <main className="w-full max-w-[1400px] mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-amber-900 mb-6">Our Menu</h1>
      
      <FilterShell 
        categories={categories} 
        initialCategory={category} 
        initialSearch={search}
      >
        <DishList dishes={dishes} />
      </FilterShell>
    </main>
  );
}