'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function InsightsPage() {
  const [insights, setInsights] = useState<any[]>([]);
  const [subs, setSubs] = useState<any[]>([]);

  const load = async () => {
    await api('/api/analytics/run-detection', { method: 'POST' });
    await api('/api/analytics/insights/generate', { method: 'POST' });
    const [i, s] = await Promise.all([api('/api/analytics/insights'), api('/api/analytics/subscriptions')]);
    setInsights(i);
    setSubs(s);
  };

  useEffect(() => { load().catch(() => null); }, []);

  const setStatus = async (id: string, status: 'KEEP' | 'CANCEL') => {
    await api(`/api/analytics/subscriptions/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
    load();
  };

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">Insights</h1>
      <div className="card space-y-2">
        {insights.map((ins) => (
          <div key={ins.id} className="rounded border border-slate-800 p-3">
            <p className="font-medium">{ins.title}</p>
            <p className="text-sm text-slate-400">{ins.detail}</p>
          </div>
        ))}
      </div>
      <div className="card">
        <h2 className="mb-3 text-lg">Subscription Manager</h2>
        <div className="space-y-2">
          {subs.map((sub) => (
            <div key={sub.id} className="flex flex-wrap items-center justify-between gap-2 rounded border border-slate-800 p-3">
              <div>
                <p className="font-medium">{sub.merchant}</p>
                <p className="text-sm text-slate-400">${Number(sub.potentialMonthly).toFixed(2)} / month · {sub.status}</p>
              </div>
              <div className="space-x-2">
                <button onClick={() => setStatus(sub.id, 'KEEP')} className="rounded bg-slate-700 px-3 py-1">Keep</button>
                <button onClick={() => setStatus(sub.id, 'CANCEL')} className="rounded bg-red-600 px-3 py-1">Cancel</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
