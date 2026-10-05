
'use client';

import { useState } from 'react';
import CategoryBar from './CategoryBar';

export default function FilterShell({ children }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-amber-900">Our Menu</h2>
      <CategoryBar selected={selectedCategory} onSelect={setSelectedCategory} />
      <div>{children}</div>
    </div>
  );
}