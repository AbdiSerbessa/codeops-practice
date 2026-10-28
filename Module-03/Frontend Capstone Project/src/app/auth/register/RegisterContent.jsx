'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: 'Full name must be at least 3 characters long.' })
    .refine((val) => val.includes(' '), {
      message: 'Please enter both your first and last name.',
    }),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: 'Please enter a valid email address (e.g., name@example.com).' }),
  phone: z
    .string()
    .trim()
    .regex(/^(09|07|\+2519|\+2517)\d{8}$/, {
      message: 'Enter a valid phone number starting with 09 or 07 (10 digits).',
    }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long.' }),
});

export default function RegisterContent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setServerError('');
    setFieldErrors({});

    // 1. Zod Client-Side Validation
    const validation = registerSchema.safeParse(formData);
    if (!validation.success) {
      const errors = {};
      validation.error.issues.forEach((issue) => {
        errors[issue.path[0]] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      // 2. API Call
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validation.data),
      });

      // Check content-type to handle 404 HTML responses cleanly if route path is misconfigured
      const contentType = res.headers.get('content-type');
      let data = {};
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      }

      if (!res.ok) {
        setServerError(
          data.message || `Registration failed (Status ${res.status}). Verify API route exists at /api/auth/register.`
        );
        setLoading(false);
        return;
      }

      router.push('/auth/login?registered=true');
    } catch (err) {
      console.error('Registration fetch error:', err);
      setServerError('Unable to reach server. Please check terminal logs and connection.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-center py-12 px-6">
      <div className="max-w-md mx-auto w-full bg-stone-900 border border-stone-800 rounded-2xl p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-amber-500 font-bold">Get Started</span>
          <h1 className="text-3xl font-extrabold text-white">Create an Account</h1>
          <p className="text-stone-400 text-sm">Join Addis Eats for fast traditional food ordering.</p>
        </div>

        {serverError && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3.5 rounded-xl text-center leading-relaxed">
            {serverError}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4" noValidate>
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Abebe Bikila"
              className={`w-full bg-stone-950 border ${
                fieldErrors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-stone-800'
              } rounded-xl px-4 py-3 text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm`}
            />
            {fieldErrors.name && (
              <p className="text-red-400 text-xs mt-1.5 font-medium">{fieldErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className={`w-full bg-stone-950 border ${
                fieldErrors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-stone-800'
              } rounded-xl px-4 py-3 text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm`}
            />
            {fieldErrors.email && (
              <p className="text-red-400 text-xs mt-1.5 font-medium">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0911223344"
              className={`w-full bg-stone-950 border ${
                fieldErrors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-stone-800'
              } rounded-xl px-4 py-3 text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm`}
            />
            {fieldErrors.phone && (
              <p className="text-red-400 text-xs mt-1.5 font-medium">{fieldErrors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full bg-stone-950 border ${
                fieldErrors.password ? 'border-red-500 ring-1 ring-red-500' : 'border-stone-800'
              } rounded-xl px-4 py-3 text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm`}
            />
            {fieldErrors.password && (
              <p className="text-red-400 text-xs mt-1.5 font-medium">{fieldErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg transition-colors text-sm mt-2"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center text-stone-400 text-sm pt-4 border-t border-stone-800">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-amber-500 hover:text-amber-400 font-semibold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}