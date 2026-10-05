// src/app/menu/page.js
import fs from 'fs';
import path from 'path';
import FilterShell from './FilterShell';
import DishList from './DishList';

export default async function MenuPage() {
  const filePath = path.join(process.cwd(), 'public', 'dishes.json');
  const fileData = fs.readFileSync(filePath, 'utf8');
  const dishes = JSON.parse(fileData);

  return (
    <FilterShell>
      <DishList dishes={dishes} />
    </FilterShell>
  );
}