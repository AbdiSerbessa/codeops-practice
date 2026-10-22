'use client';
import { useState } from 'react';

export default function AddToCart({ dish }) {
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    // Prevent event from bubbling up to parent clickable containers or links
    e.stopPropagation();

    const existingCart = JSON.parse(localStorage.getItem('addis_eats_cart') || '[]');
    const existingIndex = existingCart.findIndex((item) => item.id === dish.id);

    if (existingIndex > -1) {
      existingCart[existingIndex].quantity += 1;
    } else {
      existingCart.push({
        id: dish.id,
        name: dish.name,
        price: dish.price,
        currency: dish.currency || 'ETB',
        quantity: 1,
      });
    }

    localStorage.setItem('addis_eats_cart', JSON.stringify(existingCart));

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      aria-label={`Add ${dish?.name || 'item'} to cart`}
      className="w-full min-h-[44px] bg-amber-800 hover:bg-amber-900 active:bg-amber-950 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm cursor-pointer flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900"
    >
      {added ? 'Added! ✓' : 'Add to Cart'}
    </button>
  );
}