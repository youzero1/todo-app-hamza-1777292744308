import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'A simple todo application built with Next.js and Supabase',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0f172a]">
        {/* Subtle background gradient orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px]" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
