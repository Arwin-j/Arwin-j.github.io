'use client';

import Nav from '@/components/Nav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen lg:flex">
      <Nav />
      <div className="flex-1 p-4 lg:p-8">{children}</div>
    </div>
  );
}
