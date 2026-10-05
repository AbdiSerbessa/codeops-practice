// src/app/menu/CategoryBar.jsx
'use client';

export default function CategoryBar() {
  return (
    <div className="flex space-x-4 border-b pb-3">
      <button className="px-4 py-2 bg-amber-800 text-white rounded-md text-sm font-medium">All</button>
      <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300">Injera</button>
      <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300">Wot</button>
    </div>
  );
}