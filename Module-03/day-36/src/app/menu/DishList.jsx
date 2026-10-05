import Link from 'next/link';

export default function DishList() {
  const dishes = [
    { id: 1, name: 'Doro Wat', price: '350 ETB', tag: 'Spicy' },
    { id: 2, name: 'Kitfo', price: '400 ETB', tag: 'Signature' },
    { id: 3, name: 'Timatim Fitfit', price: '180 ETB', tag: 'Vegan' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {dishes.map((dish) => (
        <div key={dish.id} className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold text-stone-900">{dish.name}</h3>
              <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-medium">
                {dish.tag}
              </span>
            </div>
            <p className="text-stone-600 font-medium mb-4">{dish.price}</p>
          </div>
          <Link 
  href={`/menu/${dish.id}`}
  className="text-center block w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium py-2 rounded-lg transition-colors"
>
  View Details
</Link>
        </div>
      ))}
    </div>
  );
}