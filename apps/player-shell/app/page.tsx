// Home page is a Server Component by default in Next.js App Router.
// We only need TenantInfo on the client (it reads context), so it's split into a separate client component.
import Link from 'next/link';
import { TenantInfo } from '@/components/ui/TenantInfo';

export default function HomePage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-base)', padding: 'var(--spacing-8)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        <header style={{ marginBottom: 'var(--spacing-10)' }}>
          <h1 style={{
            fontSize: 'var(--font-size-3xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-brand-primary)',
            fontFamily: 'var(--font-family-display)',
            marginBottom: 'var(--spacing-2)',
          }}>
            Player Shell
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-lg)' }}>
            Multi-tenant gaming platform
          </p>
        </header>

        {/* TenantInfo is 'use client' - reads TenantContext */}
        <TenantInfo />

        <nav style={{ display: 'flex', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-8)' }}>
          <Link
            href="/auth/login"
            style={{
              padding: 'var(--spacing-3) var(--spacing-6)',
              backgroundColor: 'var(--color-brand-primary)',
              color: 'var(--color-text-primary)',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              fontWeight: 'var(--font-weight-semibold)',
              fontSize: 'var(--font-size-md)',
            }}
          >
            Login
          </Link>
          <Link
            href="/account/billing"
            style={{
              padding: 'var(--spacing-3) var(--spacing-6)',
              backgroundColor: 'transparent',
              color: 'var(--color-brand-primary)',
              border: '1px solid var(--color-brand-primary)',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              fontWeight: 'var(--font-weight-semibold)',
              fontSize: 'var(--font-size-md)',
            }}
          >
            Billing
          </Link>
        </nav>

      </div>
    </main>
  );
}
