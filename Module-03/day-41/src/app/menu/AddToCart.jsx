'use client';
import { useState } from 'react';

export default function AddToCart({ dish }) {
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
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
      onClick={handleAddToCart}
      className="w-full bg-amber-800 hover:bg-amber-900 text-white font-medium py-2 rounded-lg transition-colors text-sm"
    >
      {added ? 'Added! ✓' : 'Add to Cart'}
    </button>
  );
}