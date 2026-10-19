// src/app/layout.js
import './globals.css';
import { Providers } from './providers';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { Inter } from 'next/font/google';
import Script from 'next/script';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});


export const metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: {
    default: 'Addis Eats | Traditional Ethiopian Restaurant',
    template: '%s | Addis Eats',
  },
  description: 'Experience authentic traditional Ethiopian food and culinary culture at Addis Eats.',
  openGraph: {
    title: 'Addis Eats',
    description: 'Traditional Ethiopian Restaurant Application',
    url: 'http://localhost:3000',
    siteName: 'Addis Eats',
    locale: 'en_US',
    type: 'website',
  },
};

export default async function RootLayout({ children }) {
  const session = await getSession();

  return (
    <html lang="en" className={inter.className}>
      <body className="bg-gray-50 text-gray-900 flex flex-col min-h-screen">
        <Providers>
          <header className="bg-amber-900 text-white shadow-md p-4 w-full">
  <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
    <Link href="/" className="text-xl font-bold tracking-wide">
      Addis Eats
    </Link>
    
    <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs sm:text-sm">
      <Link href="/" className="hover:text-amber-200 transition-colors">
        Home
      </Link>
      <Link href="/menu" className="hover:text-amber-200 transition-colors">
        Menu
      </Link>
      <Link href="/cart" className="hover:text-amber-200 transition-colors">
        Cart
      </Link>
      <Link href="/checkout" className="hover:text-amber-200 transition-colors">
        Checkout
      </Link>

      {session?.role === 'staff' && (
        <Link href="/kitchen" className="text-amber-300 hover:text-amber-100 font-semibold transition-colors">
          Kitchen
        </Link>
      )}

      {session ? (
        <div className="flex flex-wrap items-center gap-2 sm:ml-2 sm:pl-3 sm:border-l sm:border-amber-800">
          <span className="text-xs text-amber-100">
            Welcome, <span className="font-semibold text-white">{session.email}</span>
          </span>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors"
            >
              Logout
            </button>
          </form>
        </div>
      ) : (
        <div className="flex items-center gap-2 ml-1">
          <Link href="/auth/login" className="hover:text-amber-400 transition-colors px-1">
            Login
          </Link>
          <Link
            href="/auth/register"
            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm rounded-lg transition-colors whitespace-nowrap"
          >
            Register
          </Link>
        </div>
      )}
    </nav>
  </div>
</header>
          <main className="flex-grow max-w-6xl mx-auto w-full p-4">
            {children}
          </main>
          <footer className="bg-gray-800 text-white text-center py-4 text-sm">
            &copy; {new Date().getFullYear()} Addis Eats. All rights reserved.
          </footer>
        </Providers>
        
        {/* Third-party scripts loaded lazily during browser idle time */}
        {/* <Script src="https://example.com/analytics.js" strategy="lazyOnload" /> */}
      </body>
    </html>
  );
}