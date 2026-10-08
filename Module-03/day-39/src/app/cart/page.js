'use client';

import Link from 'next/link';

export default function CartPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-amber-900 mb-4">Your Shopping Cart</h2>
      <p className="text-stone-600 mb-6">Review your selected items before checking out.</p>
      
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm mb-6">
        <p className="text-stone-500">Your cart is currently empty.</p>
      </div>

      <div className="flex gap-4">
        <Link 
          href="/menu" 
          className="bg-stone-200 hover:bg-stone-300 text-stone-800 font-medium px-6 py-2 rounded-lg transition-colors"
        >
          Back to Menu
        </Link>
        <Link 
          href="/checkout" 
          className="bg-amber-800 hover:bg-amber-900 text-white font-medium px-6 py-2 rounded-lg transition-colors"
        >
          Proceed to Checkout
        </Link>
      </div>
    </main>
  );
}