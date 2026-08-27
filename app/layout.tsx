import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

export const metadata: Metadata = {
  title: 'স্বৰলিপি সংগীত ভৱন • Nostalgia Music',
  description: 'A nostalgic Panbazar audio experience streaming timeless vintage melodies.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#09090b',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-black text-white selection:bg-amber-500/30 selection:text-amber-200 min-h-dvh">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
