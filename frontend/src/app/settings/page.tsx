'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function SettingsPage() {
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    api('/api/analytics/weekly-report').then(setReport).catch(() => null);
  }, []);

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">Settings & Weekly Report</h1>
      <div className="card">
        <p className="text-sm text-slate-400">Weekly potential savings</p>
        <p className="text-3xl font-bold text-emerald-400">${report?.totalPotentialSavings?.toFixed?.(2) || '0.00'}</p>
        <ul className="mt-3 list-disc pl-5 text-sm text-slate-300">
          {(report?.highlights || []).map((h: string) => <li key={h}>{h}</li>)}
        </ul>
      </div>
    </main>
  );
}
