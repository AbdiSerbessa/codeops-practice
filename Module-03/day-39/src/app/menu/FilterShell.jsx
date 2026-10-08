
'use client';

import CategoryBar from './CategoryBar';

export default function FilterShell({ children }) {
  return (
    <div className="space-y-6">
      <CategoryBar />
      <div>{children}</div>
    </div>
  );
}