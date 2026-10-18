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
          <header className="bg-amber-900 text-white shadow-md p-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <Link href="/" className="text-xl font-bold tracking-wide">
                Addis Eats
              </Link>
              <nav className="flex items-center space-x-4">
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
                  <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-amber-800">
                    <span className="text-xs sm:text-sm text-amber-100">
                      Welcome, <span className="font-semibold text-white">{session.email}</span>
                    </span>
                    <form action="/api/auth/signout" method="POST">
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors"
                      >
                        Logout
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 ml-2">
                    <Link href="/auth/login" className="hover:text-amber-400 transition-colors">
                      Login
                    </Link>
                    <Link
                      href="/auth/register"
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
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