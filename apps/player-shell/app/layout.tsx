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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <TenantProvider initialConfig={{ brandId: 'alpha', locale: 'en', currency: 'USD' }}>
          <QueryProvider>
            <ThemeLoader />
            {children}
          </QueryProvider>
        </TenantProvider>
      </body>
    </html>
  );
}
