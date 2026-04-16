'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      setAuth(data.token, data.user);
      router.push('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <form onSubmit={onSubmit} className="card w-full space-y-4">
        <h1 className="text-2xl font-semibold">Login</h1>
        <input className="w-full rounded bg-slate-800 p-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full rounded bg-slate-800 p-3" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button className="w-full rounded bg-brand p-3 font-medium">Login</button>
        <p className="text-sm text-slate-400">No account? <Link href="/signup" className="text-brand">Signup</Link></p>
      </form>
    </main>
  );
}
