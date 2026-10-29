import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/db';
import CheckoutContent from './CheckoutContent';

export const metadata = {
  title: 'Checkout',
  description: 'Complete your order securely.',
};

export default async function CheckoutPage() {
  const session = await getSession();

  if (!session) {
    redirect('/auth/login?redirect=/checkout');
  }

  // Dynamically extract email from any session shape
  const userEmail = session.email || session.user?.email || session.userData?.email || '';

  return (
    <main className="max-w-7xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold text-stone-900">Checkout</h2>
      <Suspense fallback={<div className="text-stone-500 text-center py-8">Loading checkout...</div>}>
        <CheckoutContent userEmail={userEmail} />
      </Suspense>
    </main>
  );
}