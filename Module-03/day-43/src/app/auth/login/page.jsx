// src/app/auth/login/page.jsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Step 3 Security Guardrail: Reject external or malformed 'next' values
  const getSafeRedirectUrl = (rawNext) => {
    if (!rawNext) return '/menu';

    // Must start with a single slash '/' and NOT '//' or external schemes like https://
    const isSafe = rawNext.startsWith('/') && !rawNext.startsWith('//');

    return isSafe ? rawNext : '/menu';
  };

  // Check if user is already logged in on mount
  useEffect(() => {
    async function checkExistingSession() {
      try {
        const res = await fetch('/api/auth/me'); // Check session status
        if (res.ok) {
          const rawNext = searchParams.get('next');
          const targetDestination = getSafeRedirectUrl(rawNext);
          router.replace(targetDestination);
        } else {
          setIsCheckingSession(false);
        }
      } catch (err) {
        setIsCheckingSession(false);
      }
    }

    checkExistingSession();
  }, [router, searchParams]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const rawNext = searchParams.get('next');
    const targetDestination = getSafeRedirectUrl(rawNext);

    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push(targetDestination);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred during login.');
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl shadow-lg transition-colors text-sm"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-stone-800"></div>
          <span className="px-3 text-xs uppercase tracking-wider text-stone-500">Or</span>
          <div className="flex-grow border-t border-stone-800"></div>
        </div>

       {/* Google Sign In Button */}
<div>
  <button
    type="button"
    onClick={() => signIn('google', { callbackUrl: '/menu' })}
    className="w-full py-3.5 bg-white hover:bg-stone-100 text-stone-900 font-semibold rounded-xl shadow-lg transition-colors text-sm flex items-center justify-center space-x-2 border border-stone-300"
  >
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>
    <span>Sign in with Google</span>
  </button>
</div>

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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-stone-400">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}