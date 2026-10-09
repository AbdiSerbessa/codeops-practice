'use client';
import { Suspense } from 'react';
import CheckoutContent from './CheckoutContent';

export default function CheckoutPage() {
  return (
    <main className="max-w-7xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold text-stone-900">Checkout</h2>
      <Suspense fallback={<div className="text-stone-500 text-center py-8">Loading checkout...</div>}>
        <CheckoutContent />
      </Suspense>
    </main>
  );
}