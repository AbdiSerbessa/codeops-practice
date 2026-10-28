'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Security Guardrail: Reject external or malformed 'next' values
  const getSafeRedirectUrl = (rawNext) => {
    if (!rawNext) return '/menu';
    const isSafe = rawNext.startsWith('/') && !rawNext.startsWith('//');
    return isSafe ? rawNext : '/menu';
  };

  useEffect(() => {
    async function checkExistingSession() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const rawNext = searchParams.get('next');
          const targetDestination = getSafeRedirectUrl(rawNext);
          router.replace(targetDestination);
          return;
        }
      } catch (err) {
        // Session check failed, proceed to render form
      } finally {
        setIsCheckingSession(false);
      }
    }

    checkExistingSession();
  }, [router, searchParams]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const rawNext = searchParams.get('next');
    const targetDestination = getSafeRedirectUrl(rawNext);

    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(targetDestination);
        router.refresh();
      } else {
        setError(data.message || 'Invalid email or password.');
        setLoading(false);
      }
    } catch (err) {
      setError('Network error: Could not complete sign in. Please try again.');
      setLoading(false);
    }
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-300 flex items-center justify-center">
        <p className="text-sm font-medium animate-pulse">Checking authentication status...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-center py-12 px-6">
      <div className="max-w-md mx-auto w-full bg-stone-900 border border-stone-800 rounded-2xl p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-amber-500 font-bold">Welcome Back</span>
          <h1 className="text-3xl font-extrabold text-white">Login to Addis Eats</h1>
          <p className="text-stone-400 text-sm">Enter your credentials to access your account.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg transition-colors text-sm"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-stone-400 text-sm pt-4 border-t border-stone-800">
          Dont have an account?{' '}
          <Link href="/auth/register" className="text-amber-500 hover:text-amber-400 font-semibold">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginContent() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-stone-400">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}