import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Midterm Schedule — Nile University',
  description: 'Lookup your Nile University midterm schedule using your student ID.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
