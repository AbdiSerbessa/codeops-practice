import fs from 'fs';
import path from 'path';

// ISR revalidation period
export const revalidate = 60;

// Tells Next.js which dynamic paths to pre-render statically at build time
export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), 'public', 'dishes.json');
  const fileData = fs.readFileSync(filePath, 'utf8');
  const dishes = JSON.parse(fileData);

  return dishes.map((dish) => ({
    id: dish.id.toString(),
  }));
}

export default async function DishDetailPage({ params }) {
  const { id } = await params;
  
  const filePath = path.join(process.cwd(), 'public', 'dishes.json');
  const fileData = fs.readFileSync(filePath, 'utf8');
  const dishes = JSON.parse(fileData);
  
  const dish = dishes.find((d) => d.id.toString() === id);

  if (!dish) {
    return <div className="p-6 text-red-600">Dish not found.</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-900">{dish.name}</h2>
      <p className="text-gray-700">{dish.description}</p>
      <p className="text-lg font-semibold text-gray-900">${dish.price}</p>
    </div>
  );
}