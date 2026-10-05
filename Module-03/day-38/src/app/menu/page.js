// src/app/menu/page.js
import fs from 'fs';
import path from 'path';
import CategoryBar from './CategoryBar';
import DishList from './DishList'; // Or your list component

export default async function MenuPage() {
  const filePath = path.join(process.cwd(), 'public', 'dishes.json');
  const fileData = fs.readFileSync(filePath, 'utf8');
  const dishes = JSON.parse(fileData);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-amber-900">Our Menu</h2>
      <CategoryBar />
      <DishList dishes={dishes} />
    </div>
  );
}