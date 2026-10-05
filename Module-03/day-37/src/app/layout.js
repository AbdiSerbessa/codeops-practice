import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Addis Eats',
  description: 'Traditional Ethiopian Restaurant Application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 flex flex-col min-h-screen">
        <header className="bg-amber-900 text-white shadow-md p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Addis Eats</h1>
            <nav className="space-x-4">
  <Link href="/menu" className="hover:underline">Menu</Link>
  <Link href="/cart" className="hover:underline">Cart</Link>
  <Link href="/checkout" className="hover:underline">Checkout</Link>
</nav>
          </div>
        </header>

        <main className="flex-grow max-w-6xl mx-auto w-full p-4">
          {children}
        </main>

        <footer className="bg-gray-800 text-white text-center py-4 text-sm">
          &copy; {new Date().getFullYear()} Addis Eats. All rights reserved.
        </footer>
      </body>
    </html>
  );
}