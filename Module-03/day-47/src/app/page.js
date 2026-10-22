
import Link from 'next/link';

export default function Home() {
  const featuredDishes = [
    { id: 'dish_1', name: 'Doro Wat', category: 'Main', price: 350, description: 'Traditional spicy chicken stew served with injera and boiled egg.' },
    { id: 'dish_2', name: 'Beyaynetu', category: 'Vegetarian', price: 220, description: 'Assorted vegetarian platter with various flavorful vegetable stews.' },
    { id: 'dish_3', name: 'Kitfo', category: 'Main', price: 400, description: 'Minced beef seasoned with mitmita and niter kibbeh.' },
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6 md:px-12 bg-gradient-to-b from-amber-950/40 via-stone-900 to-stone-950 border-b border-stone-800">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-semibold tracking-wide border border-amber-500/20">
            Habesha Culinary Excellence
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Authentic Ethiopian Cuisine, <br />
            <span className="text-amber-500">Delivered to Your Doorstep.</span>
          </h1>
          <p className="text-stone-400 text-lg md:text-xl max-w-2xl mx-auto">
            Experience rich traditional spices, fresh injera, and time-honored recipes prepared daily with passion and heritage.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link
              href="/menu"
              className="px-8 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 text-center"
            >
              Explore Our Menu
            </Link>
            <Link 
  href="/track/123"
  className="px-6 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold rounded-lg text-sm transition-colors border border-stone-700 shadow-md"
>
  Track Active Order
</Link>
          </div>
        </div>
      </section>

      {/* Features Highlights */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl shadow-sm space-y-3">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center font-bold text-xl">🌶️</div>
          <h3 className="text-xl font-bold text-white">Authentic Spices</h3>
          <p className="text-stone-400 text-sm">Imported berbere and homemade niter kibbeh for genuine traditional flavor.</p>
        </div>
        <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl shadow-sm space-y-3">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center font-bold text-xl">⚡</div>
          <h3 className="text-xl font-bold text-white">Real-Time SWR Tracking</h3>
          <p className="text-stone-400 text-sm">Live order status polling and seamless menu searching with zero layout lag.</p>
        </div>
        <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl shadow-sm space-y-3">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center font-bold text-xl">🌿</div>
          <h3 className="text-xl font-bold text-white">Freshly Prepared</h3>
          <p className="text-stone-400 text-sm">Crafted fresh every single day with organic ingredients and pristine care.</p>
        </div>
      </section>

      {/* Featured Dishes Preview */}
      <section className="max-w-6xl mx-auto px-6 py-12 w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Featured Specialties</h2>
            <p className="text-stone-400 text-sm mt-1">A glimpse of our most loved traditional meals.</p>
          </div>
          <Link href="/menu" className="text-amber-500 hover:text-amber-400 text-sm font-semibold">
            View All Menu &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {featuredDishes.map((dish) => (
            <div key={dish.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-600/50 transition-colors">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-white">{dish.name}</h3>
                  <span className="text-xs bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full font-medium">
                    {dish.category}
                  </span>
                </div>
                <p className="text-stone-400 text-sm mb-4">{dish.description}</p>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-stone-800">
                <span className="font-bold text-amber-500">{dish.price} ETB</span>
                <Link
                  href={`/menu/${dish.id}`}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}