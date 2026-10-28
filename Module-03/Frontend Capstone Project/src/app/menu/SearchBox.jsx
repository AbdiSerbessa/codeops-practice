// src/app/menu/SearchBox.jsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchBox() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  // Debounce input changes to prevent requests per keystroke
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (searchTerm) {
        params.set('search', searchTerm);
      } else {
        params.delete('search');
      }

      // Preserve scroll position and update URL silently for SWR
      router.replace(`/menu?${params.toString()}`, { scroll: false });
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, router, searchParams]);

  return (
    <div className="w-full max-w-md mb-6">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search traditional dishes..."
        className="w-full border border-stone-300 rounded-lg px-4 py-2 bg-white text-stone-900 focus:ring-2 focus:ring-amber-800 focus:outline-none"
      />
    </div>
  );
}