'use client';

import Link from 'next/link';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/transactions', label: 'Transactions' },
  { href: '/insights', label: 'Insights' },
  { href: '/settings', label: 'Settings' }
];

export default function Nav() {
  return (
    <aside className="w-full border-b border-slate-800 bg-slate-900 lg:w-56 lg:border-b-0 lg:border-r">
      <div className="p-4 text-lg font-semibold">MoneyLeak</div>
      <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:block lg:space-y-1">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="block rounded-md px-3 py-2 hover:bg-slate-800">
            {l.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
