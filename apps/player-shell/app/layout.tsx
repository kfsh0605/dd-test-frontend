import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { TenantProvider } from '@/context/TenantContext';
import { QueryProvider } from '@/lib/QueryProvider';
import { ThemeLoader } from '@/lib/theme/ThemeLoader';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Player Shell',
  description: 'Multi-tenant player shell application',
};

// brandId is hardcoded here for SSR - in production it would come from
// cookies/subdomain/request headers resolved server-side
const BRAND_ID = 'alpha';

const THEME_MAP: Record<string, string> = {
  alpha: '/themes/theme-tenant-alpha.css',
};

const themePath = THEME_MAP[BRAND_ID] ?? '/themes/fallback.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Preload theme CSS synchronously to prevent FOUC */}
        <link rel="stylesheet" href={themePath} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <TenantProvider initialConfig={{ brandId: BRAND_ID, locale: 'en', currency: 'USD' }}>
          <QueryProvider>
            {/* ThemeLoader handles dynamic theme switching on brandId change */}
            <ThemeLoader />
            {children}
          </QueryProvider>
        </TenantProvider>
      </body>
    </html>
  );
}
