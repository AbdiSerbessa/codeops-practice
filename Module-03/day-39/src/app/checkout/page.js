// src/app/checkout/page.js
'use client';

import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { placeOrder, cancelOrder } from '@/app/actions';
import Link from 'next/link';

const initialState = {
  success: false,
  message: '',
  errors: {},
};

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const dishId = searchParams.get('dishId') || 'dish_1';
const [state, formAction, isPending] = useActionState(placeOrder, initialState);

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-amber-900 mb-2">Checkout</h2>
      <p className="text-stone-600 mb-6">Complete your order details below to place your request.</p>

      {state?.success ? (
        <div className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm text-center space-y-4">
          <h3 className="text-2xl font-bold text-green-800">Order Successful! 🎉</h3>
          <p className="text-stone-700">{state.message}</p>
          <div className="pt-4 flex justify-center gap-4">
            <Link
              href="/checkout"
              className="inline-block bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium px-6 py-2 rounded-lg transition-colors"
            >
              Place Another Order
            </Link>
            <Link
              href="/menu"
              className="inline-block bg-amber-800 hover:bg-amber-900 text-white font-medium px-6 py-2 rounded-lg transition-colors"
            >
              Back to Menu
            </Link>
          </div>
        </div>
      ) : (
        <form action={formAction} className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm space-y-6">
          {state?.message && !state.success && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {state.message}
            </div>
          )}

          {/* Hidden Dish ID input */}
          <input type="hidden" name="dishId" value={dishId} />

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Abebe Bikila"
              className="w-full border border-stone-300 rounded-lg px-4 py-2 text-stone-900 focus:ring-2 focus:ring-amber-800 focus:outline-none"
            />
            {state?.errors?.name && (
              <p className="text-red-600 text-xs mt-1">{state.errors.name[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="0911223344"
              className="w-full border border-stone-300 rounded-lg px-4 py-2 text-stone-900 focus:ring-2 focus:ring-amber-800 focus:outline-none"
            />
            {state?.errors?.phone && (
              <p className="text-red-600 text-xs mt-1">{state.errors.phone[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              defaultValue={1}
              min={1}
              className="w-full border border-stone-300 rounded-lg px-4 py-2 text-stone-900 focus:ring-2 focus:ring-amber-800 focus:outline-none"
            />
            {state?.errors?.quantity && (
              <p className="text-red-600 text-xs mt-1">{state.errors.quantity[0]}</p>
            )}
          </div>

         <div>
  <label className="block text-sm font-medium text-stone-700 mb-1">Delivery Notes (Optional)</label>
  <textarea
    name="notes"
    rows="3"
    placeholder="Any special instructions..."
    className="w-full border border-stone-300 rounded-lg px-4 py-2 text-stone-900 focus:ring-2 focus:ring-amber-800 focus:outline-none"
  ></textarea>
</div>

          <div className="flex gap-4">
            <Link
              href="/menu"
              className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium py-3 rounded-lg text-center transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-amber-800 hover:bg-amber-900 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {isPending ? 'Submitting Order...' : 'Place Order'}
            </button>
          </div>
        </form>
      )}
    </main>
  );
}