import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { TenantProvider } from '@/context/TenantContext';
import { QueryProvider } from '@/lib/QueryProvider';
import { ThemeLoader } from '@/lib/theme/ThemeLoader';
import { THEME_MAP, FALLBACK_THEME } from '@/lib/theme/themeMap';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Player Shell',
  description: 'Multi-tenant player shell application',
};

const BRAND_ID = 'alpha';
const themePath = THEME_MAP[BRAND_ID] ?? FALLBACK_THEME;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href={themePath} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <TenantProvider initialConfig={{ brandId: BRAND_ID, locale: 'en', currency: 'USD' }}>
          <QueryProvider>
            <ThemeLoader />
            {children}
          </QueryProvider>
        </TenantProvider>
      </body>
    </html>
  );
}
