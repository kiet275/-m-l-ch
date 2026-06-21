import type {Metadata} from 'next';
import { Inter, Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  display: 'swap',
});

const beVietnamPro = Be_Vietnam_Pro({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-be-vietnam',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'An Lạc Calendar',
  description: 'Vietnamese Lunar-Solar Calendar with AI Destiny Advisor',
};

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${inter.variable} ${beVietnamPro.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <meta name="theme-color" content="#E53935" />
      </head>
      <body className="font-body antialiased bg-background text-foreground selection:bg-primary/20">
        <svg style={{ visibility: 'hidden', position: 'absolute', width: 0, height: 0 }}>
          <filter id="liquid-glass-refraction">
            <feTurbulence type="fractalNoise" baseFrequency="0.01 0.04" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
          </filter>
        </svg>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
