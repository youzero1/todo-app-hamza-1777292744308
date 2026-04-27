import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'A simple todo application built with Next.js and Supabase',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f5f5f5]">
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
