'use client';
import { useState, useEffect, useActionState } from 'react';
import { placeOrder } from '@/app/actions';
import Link from 'next/link';

const initialState = {
  success: false,
  message: '',
  errors: {},
};

export default function CheckoutContent() {
  const [mounted, setMounted] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [state, formAction, isPending] = useActionState(placeOrder, initialState);

  useEffect(() => {
    setMounted(true);
    const savedCart = localStorage.getItem('addis_eats_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart items', e);
      }
    }
  }, []);

  if (!mounted) {
    return <div className="text-stone-500 text-center py-8">Loading cart details...</div>;
  }

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      {state?.success ? (
        <div className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm text-center space-y-4">
          <h3 className="text-2xl font-bold text-green-800">Order Successful! 🎉</h3>
          <p className="text-stone-700">{state.message}</p>
          <div className="pt-4 flex justify-center gap-4">
            <Link
              href="/menu"
              className="inline-block bg-amber-800 hover:bg-amber-900 text-white font-medium px-6 py-2 rounded-lg transition-colors"
            >
              Back to Menu
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Order Summary Section */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-stone-800">Order Summary</h3>
            {cartItems.length === 0 ? (
              <p className="text-sm text-stone-500">Your cart is empty.</p>
            ) : (
              <div className="space-y-3 divide-y divide-stone-100">
                {cartItems.map((item, index) => (
                  <div key={index} className="pt-3 flex justify-between items-center text-sm">
                    <div>
                      <p className="font-medium text-stone-900">{item.name}</p>
                      <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-amber-900">{item.price * item.quantity} {item.currency || 'ETB'}</p>
                  </div>
                ))}
                <div className="pt-4 flex justify-between items-center font-bold text-stone-900">
                  <span>Total Price:</span>
                  <span className="text-amber-900">{totalAmount} ETB</span>
                </div>
              </div>
            )}
          </div>

          {/* Checkout Form */}
          <form action={formAction} className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm space-y-6">
            {state?.message && !state.success && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {state.message}
              </div>
            )}

            {/* Pass serialized cart items to the server action */}
            <input type="hidden" name="cartItems" value={JSON.stringify(cartItems)} />

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
                Back to Menu
              </Link>
              <button
                type="submit"
                disabled={isPending || cartItems.length === 0}
                className="flex-1 bg-amber-800 hover:bg-amber-900 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {isPending ? 'Submitting Order...' : 'Place Order'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}