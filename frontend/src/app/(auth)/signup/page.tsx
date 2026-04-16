'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await api('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(form)
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
        <h1 className="text-2xl font-semibold">Create account</h1>
        <input className="w-full rounded bg-slate-800 p-3" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="w-full rounded bg-slate-800 p-3" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full rounded bg-slate-800 p-3" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button className="w-full rounded bg-brand p-3 font-medium">Signup</button>
        <p className="text-sm text-slate-400">Have account? <Link href="/login" className="text-brand">Login</Link></p>
      </form>
    </main>
  );
}
