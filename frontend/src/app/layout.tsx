import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MoneyLeak',
  description: 'Smart Expense & Subscription Tracker'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
