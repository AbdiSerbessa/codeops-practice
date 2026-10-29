// src/app/orders/page.js
import Link from 'next/link';

export const metadata = {
  title: 'Your Orders',
  description: 'View your order history and track the delivery status of your traditional Ethiopian meals from Addis Eats.',
};

export default function OrdersIndexPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm space-y-4">
        <h1 className="text-3xl font-bold text-stone-900">Order History</h1>
        <p className="text-stone-600">
          To track a specific order, please use the direct link provided after checkout or check your receipt.
        </p>
        <div>
          <Link
            href="/menu"
            className="inline-block bg-amber-800 hover:bg-amber-900 text-white font-medium px-6 py-2 rounded-lg transition-colors"
          >
            Browse Menu & Order Now
          </Link>
        </div>
      </div>
    </main>
  );
}