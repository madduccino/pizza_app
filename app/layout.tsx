import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'The Foldable — Pizza Rating App',
  description: 'Rating NYC pizza slices on dough, sauce, cheese, and foldability.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#fef9f0]">
        <Navigation />
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        <footer className="mt-16 bg-[#c0392b] text-white/80 text-center py-6 text-sm">
          <p>🍕 The Foldable — Honest pizza reviews since 2024</p>
          <p className="mt-1 text-white/50 text-xs">Rated on dough · sauce · cheese · foldability</p>
        </footer>
      </body>
    </html>
  );
}
