'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('addis_eats_cart');
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const updateQuantity = (id, newQty) => {
    const updated = cartItems.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, newQty) } : item
    );
    setCartItems(updated);
    localStorage.setItem('addis_eats_cart', JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
    localStorage.setItem('addis_eats_cart', JSON.stringify(updated));
  };

  if (!mounted) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-stone-100">Your Shopping Cart</h2>
      
      {cartItems.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-xl p-8 text-center space-y-4 shadow-sm">
          <p className="text-stone-600">Your cart is currently empty.</p>
          <Link href="/menu" className="inline-block bg-amber-800 text-white px-6 py-2 rounded-lg font-medium">
            Back to Menu
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
          <p className="text-sm text-stone-500 mb-2">Review your selected items before checking out.</p>
          
          <div className="divide-y divide-stone-100 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="pt-4 flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-stone-900">{item.name}</h4>
                  <p className="text-sm text-stone-500">{item.price} {item.currency || 'ETB'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <input 
                    type="number" 
                    min="1" 
                    value={item.quantity} 
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                    className="w-16 border border-stone-300 rounded px-2 py-1 text-center text-stone-900"
                  />
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 text-sm hover:underline font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-stone-200 flex justify-between items-center font-bold text-lg text-stone-900">
            <span>Total:</span>
            <span className="text-amber-900">
              {cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)} ETB
            </span>
          </div>

          <div className="pt-4 flex justify-end gap-4">
            <Link href="/checkout" className="bg-amber-800 hover:bg-amber-900 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}