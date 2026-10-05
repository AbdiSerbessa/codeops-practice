'use client';

import { useEffect } from 'react';

export default function MenuError({ error, reset }) {
    throw new Error('Intentional test error for menu');
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="max-w-4xl mx-auto px-4 py-16 text-center">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-red-800 mb-2">Something went wrong!</h2>
        <p className="text-red-600 mb-6">Could not load the menu items at this time.</p>
        <button
          onClick={() => reset()}
          className="bg-red-700 hover:bg-red-800 text-white font-medium px-6 py-2.5 rounded-lg transition-colors shadow"
        >
          Try again
        </button>
      </div>
    </main>
  );
}