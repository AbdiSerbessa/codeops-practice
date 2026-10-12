'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-md mx-auto my-16 p-6 bg-red-50 border border-red-200 rounded-xl text-center space-y-4">
      <h3 className="text-xl font-bold text-red-800">Something went wrong!</h3>
      <p className="text-stone-700 text-sm">{error.message || 'Failed to load menu.'}</p>
      <button
        onClick={() => reset()}
        className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-lg text-sm transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}