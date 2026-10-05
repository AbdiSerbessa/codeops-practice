import CategoryBar from './CategoryBar';
import DishList from './DishList';
import { Suspense } from 'react';


export const revalidate = 60; // Revalidate every 60 seconds (ISR)
export default async function MenuPage() {
 await new Promise((resolve) => setTimeout(resolve, 2000));
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-stone-800 mb-2">Our Menu</h2>
      <p className="text-stone-600 mb-6">Explore our traditional dishes.</p>
      
      <CategoryBar />
      <Suspense fallback={<div className="p-4 text-gray-500">Streaming dishes...</div>}>
        <DishList />
      </Suspense>
    </main>
  );
}