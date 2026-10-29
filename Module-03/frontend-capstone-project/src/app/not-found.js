import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
      <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm space-y-4">
        <h2 className="text-4xl font-extrabold text-amber-900">404</h2>
        <h3 className="text-xl font-bold text-stone-800">Page Not Found</h3>
        <p className="text-stone-600 text-sm">
          Oops! The page or dish you are looking for does not exist or has been removed.
        </p>
        <div className="pt-4 flex justify-center gap-4">
          <Link
            href="/menu"
            className="bg-amber-800 hover:bg-amber-900 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors"
          >
            Back to Menu
          </Link>
        </div>
      </div>
    </main>
  );
}