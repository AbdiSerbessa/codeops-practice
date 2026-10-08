// src/app/menu/page.jsx
import { db } from '@/lib/db';
import FilterShell from './FilterShell';
import DishList from './DishList';

export default async function MenuPage({ searchParams }) {
  // 1. Fetch dishes from your centralized mock database
  const dishes = await db.dish.findMany();
  
  // 2. Await searchParams (Next.js 15 requirement)
  const resolvedParams = await searchParams;
  const selectedCategory = resolvedParams?.category || 'All';

  // 3. Filter dishes based on category
  const filteredDishes = selectedCategory === 'All'
    ? dishes
    : dishes.filter((d) => d.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-amber-900 mb-2">Our Menu</h1>
        <p className="text-stone-600">Explore our traditional Ethiopian dishes from the database.</p>
      </div>

      <FilterShell>
        <DishList dishes={filteredDishes} />
      </FilterShell>
    </main>
  );
}