'use client';

import { FormEvent, useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [form, setForm] = useState({ date: '', merchant: '', amount: '', category: '' });

  const load = () => api('/api/transactions').then(setTransactions).catch(() => null);
  useEffect(() => { load(); }, []);

  const addTx = async (e: FormEvent) => {
    e.preventDefault();
    await api('/api/transactions', { method: 'POST', body: JSON.stringify({ ...form, amount: Number(form.amount) }) });
    setForm({ date: '', merchant: '', amount: '', category: '' });
    load();
  };

  const uploadCsv = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const body = new FormData();
    body.append('file', e.target.files[0]);
    const token = localStorage.getItem('token');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/transactions/upload-csv`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body
    });
    await api('/api/analytics/run-detection', { method: 'POST' });
    load();
  };

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">Transactions</h1>
      <form onSubmit={addTx} className="card grid gap-3 md:grid-cols-4">
        <input className="rounded bg-slate-800 p-2" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
        <input className="rounded bg-slate-800 p-2" placeholder="Merchant" value={form.merchant} onChange={(e) => setForm({ ...form, merchant: e.target.value })} required />
        <input className="rounded bg-slate-800 p-2" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
        <input className="rounded bg-slate-800 p-2" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
        <button className="rounded bg-brand p-2 md:col-span-4">Add Transaction</button>
      </form>

      <div className="card">
        <label className="mb-2 block text-sm">Import CSV</label>
        <input type="file" accept=".csv" onChange={uploadCsv} />
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead><tr><th>Date</th><th>Merchant</th><th>Category</th><th>Amount</th></tr></thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-t border-slate-800"><td>{new Date(tx.date).toLocaleDateString()}</td><td>{tx.merchant}</td><td>{tx.category}</td><td>${Number(tx.amount).toFixed(2)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
