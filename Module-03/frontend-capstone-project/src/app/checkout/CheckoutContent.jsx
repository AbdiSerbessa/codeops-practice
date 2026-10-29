'use client';
import { useState, useEffect, useActionState } from 'react';
import { placeOrder } from '@/app/actions';
import Link from 'next/link';

const initialState = {
  success: false,
  message: '',
  errors: {},
};

export default function CheckoutContent({ userEmail }) {
  const [hasMounted, setHasMounted] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notes, setNotes] = useState('');

  const [state, formAction, isPending] = useActionState(placeOrder, initialState);

  useEffect(() => {
    setHasMounted(true);

    // Read active user directly from client storage (where navbar gets real logged-in email)
    let activeEmail = '';
    try {
      const storedUser = JSON.parse(localStorage.getItem('addis_eats_user') || '{}');
      if (storedUser?.email && storedUser.email !== 'abebe@example.com') {
        activeEmail = storedUser.email;
      }
    } catch (e) {
      console.error('Failed to parse local storage user', e);
    }

    if (!activeEmail && userEmail && userEmail !== 'abebe@example.com') {
      activeEmail = userEmail;
    }

    // Fallback to navbar/header state or default to current user
    if (!activeEmail) {
      activeEmail = 'abdiserbessa19@gmail.com';
    }

    setEmail(activeEmail);

    try {
      const savedCart = localStorage.getItem('addis_eats_cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error('Failed to parse cart items', e);
    }
  }, [userEmail]);

  useEffect(() => {
    if (state?.success) {
      localStorage.removeItem('addis_eats_cart');
    }
  }, [state?.success]);

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      {state?.success ? (
        <div className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm text-center space-y-4">
          <h3 className="text-2xl font-bold text-green-800">Order Successful! 🎉</h3>
          <p className="text-stone-700">{state.message}</p>
          <div className="pt-4 flex justify-center gap-4">
            <Link
              href="/menu"
              className="min-h-[44px] flex items-center justify-center bg-amber-800 hover:bg-amber-900 text-white font-medium px-6 py-2.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              Back to Menu
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Order Summary */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-stone-800">Order Summary</h3>
            {!hasMounted || cartItems.length === 0 ? (
              <p className="text-sm text-stone-500">Your cart is empty.</p>
            ) : (
              <div className="space-y-3 divide-y divide-stone-100">
                {cartItems.map((item, index) => (
                  <div key={index} className="pt-3 flex justify-between items-center text-sm">
                    <div>
                      <p className="font-medium text-stone-900">{item.name}</p>
                      <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-amber-900">
                      {item.price * item.quantity} {item.currency || 'ETB'}
                    </p>
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
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
                {state.message}
              </div>
            )}

            <input type="hidden" name="cartItems" value={JSON.stringify(cartItems)} />

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@gmail.com"
                className="w-full min-h-[44px] border border-stone-300 rounded-lg px-4 py-2.5 text-stone-900 focus:ring-2 focus:ring-amber-800 focus:outline-none"
              />
              {state?.errors?.email && (
                <p className="text-red-600 text-xs mt-1">{state.errors.email[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Password / Account Verification <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full min-h-[44px] border border-stone-300 rounded-lg px-4 py-2.5 text-stone-900 focus:ring-2 focus:ring-amber-800 focus:outline-none"
              />
              {state?.errors?.password && (
                <p className="text-red-600 text-xs mt-1">{state.errors.password[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Delivery Notes (Optional)</label>
              <textarea
                name="notes"
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions..."
                className="w-full border border-stone-300 rounded-lg px-4 py-2.5 text-stone-900 focus:ring-2 focus:ring-amber-800 focus:outline-none"
              ></textarea>
            </div>

            <div className="flex gap-4">
              <Link
                href="/menu"
                className="flex-1 min-h-[44px] flex items-center justify-center bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium py-3 rounded-lg text-center transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              >
                Back to Menu
              </Link>
              <button
                type="submit"
                disabled={isPending || !hasMounted || cartItems.length === 0}
                className="flex-1 min-h-[44px] flex items-center justify-center bg-amber-800 hover:bg-amber-900 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              >
                {isPending ? 'Verifying & Submitting...' : 'Place Order'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}