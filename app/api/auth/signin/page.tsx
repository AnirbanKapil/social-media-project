'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const rawError = searchParams.get('error');
  
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  
  const errorMessage = rawError ? decodeURIComponent(rawError) : null;

  const handleCredentialsSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    await signIn('credentials', {
      email,
      password,
      callbackUrl: '/dashboard',
    });
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 font-sans">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-black p-8 shadow-md border border-gray-100">
        <h2 className="text-center text-2xl font-bold text-gray-400">Sign in to your account</h2>
        {errorMessage && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <svg className="h-5 w-5 shrink-0 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <div><span className="font-semibold">Error:</span> {errorMessage}</div>
          </div>
        )}
        <button
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-200 cursor-pointer transition-colors"
        >
          <span>Sign in with Google</span>
        </button>

        <div className="relative flex py-2 items-center text-gray-400 text-xs uppercase">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4">Or continue with</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <form onSubmit={handleCredentialsSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className='flex justify-center text-gray-500'>
          <Link href="/"><p className='hover:cursor-pointer'>Back to HomePage</p></Link>
        </div>
      </div>
    </div>
  );
}
