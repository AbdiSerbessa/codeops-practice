// src/app/kitchen/page.jsx
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function KitchenDashboardPage() {
  const session = await getSession();

  // 1. Check if user is authenticated at all
  if (!session) {
    redirect('/auth/login?next=/kitchen');
  }

  // 2. Server-side role verification (Reject non-staff users)
  if (session.role !== 'staff') {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col items-center justify-center p-6">
        <div className="bg-red-500/10 border border-red-500/30 p-8 rounded-2xl max-w-lg text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-400">403 - Access Denied</h1>
          <p className="text-stone-300 text-sm">
            You are logged in as <span className="font-semibold text-white">{session.email}</span>, but this area is restricted to kitchen staff personnel only.
          </p>
          <Link
  href="/menu"
  className="inline-block px-6 py-2.5 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-sm font-semibold transition-colors"
>
  Return to Menu
</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center border-b border-stone-800 pb-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-500 font-bold">Staff Portal</span>
            <h1 className="text-3xl font-extrabold text-white">Live Kitchen Orders</h1>
          </div>
          <div className="bg-stone-900 border border-stone-800 px-4 py-2 rounded-xl text-sm text-stone-300">
            Logged in as: <span className="text-amber-400 font-semibold">{session.email}</span> (Staff)
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl">
          <p className="text-stone-400 text-sm">Incoming live orders will stream here for kitchen preparation.</p>
          {/* Kitchen order queue items go here */}
        </div>
      </div>
    </div>
  );
}