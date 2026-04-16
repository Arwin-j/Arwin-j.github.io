'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api('/api/analytics/dashboard').then(setData).catch(() => null);
  }, []);

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card">
          <p className="text-sm text-slate-400">Monthly Spending</p>
          <p className="text-3xl font-bold">${data?.totalSpending?.toFixed?.(2) || '0.00'}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-400">Potential Savings</p>
          <p className="text-3xl font-bold text-emerald-400">${data?.potentialSavings?.toFixed?.(2) || '0.00'}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-400">Active Subscriptions</p>
          <p className="text-3xl font-bold">{data?.subscriptions?.length || 0}</p>
        </div>
      </div>
      <div className="card">
        <h2 className="mb-2 text-lg">Category Breakdown</h2>
        <ul className="space-y-1 text-sm text-slate-300">
          {Object.entries(data?.categorized || {}).map(([category, amount]) => (
            <li key={category} className="flex justify-between"><span>{category}</span><span>${Number(amount).toFixed(2)}</span></li>
          ))}
        </ul>
      </div>
    </main>
  );
}
