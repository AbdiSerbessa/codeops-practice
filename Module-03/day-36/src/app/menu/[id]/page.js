import Link from 'next/link';

export default async function DishDetailPage({ params }) {
  // Await params as required in modern Next.js App Router
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // Mock data lookup based on the dynamic id
  const dishes = {
    1: { name: 'Doro Wat', price: '350 ETB', tag: 'Spicy', description: 'Traditional Ethiopian chicken stew simmered in a rich berbere sauce, served with hard-boiled eggs and injera.' },
    2: { name: 'Kitfo', price: '400 ETB', tag: 'Signature', description: 'Minced raw beef warmed in clarified butter and mitmita spice blend.' },
    3: { name: 'Timatim Fitfit', price: '180 ETB', tag: 'Vegan', description: 'Torn injera mixed with diced tomatoes, onions, green peppers, olive oil, and lemon juice.' },
  };

  const dish = dishes[id] || { name: 'Dish Not Found', price: '', tag: '', description: 'The requested dish does not exist.' };

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/menu" className="text-amber-700 hover:underline font-medium mb-6 inline-block">
        &larr; Back to Menu
      </Link>
      
      <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-stone-900">{dish.name}</h1>
          {dish.tag && (
            <span className="bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded-full font-medium">
              {dish.tag}
            </span>
          )}
        </div>
        <p className="text-xl font-semibold text-amber-700 mb-6">{dish.price}</p>
        <p className="text-stone-600 leading-relaxed mb-8">{dish.description}</p>
        
        <button className="bg-amber-700 hover:bg-amber-800 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow">
          Add to Cart
        </button>
      </div>
    </main>
  );
}