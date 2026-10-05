import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'Addis Eats',
  description: 'Authentic Ethiopian Cuisine',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-stone-50 min-h-screen">
        <header className="bg-stone-900 text-white shadow">
          <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link className="font-bold text-lg text-amber-500" href="/">
              Addis Eats
            </Link>
            <div className="flex gap-6 text-sm font-medium">
              <Link className="hover:text-amber-400 transition-colors" href="/">Home</Link>
              <Link className="hover:text-amber-400 transition-colors" href="/menu">Menu</Link>
              <Link className="hover:text-amber-400 transition-colors" href="/cart">Cart</Link>
              <Link className="hover:text-amber-400 transition-colors" href="/checkout">Checkout</Link>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}