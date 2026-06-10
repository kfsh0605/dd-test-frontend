import Link from 'next/link';
import { TenantInfo } from '@/components/ui/TenantInfo';

export default function HomePage() {
  return (
    <main className="min-h-screen p-8" style={{ backgroundColor: 'var(--color-bg-base)' }}>
      <div className="max-w-3xl mx-auto">

        <header className="mb-10">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: 'var(--color-brand-primary)', fontFamily: 'var(--font-family-display)' }}
          >
            Player Shell
          </h1>
          <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
            Multi-tenant gaming platform
          </p>
        </header>

        <TenantInfo />

        <nav className="flex gap-4 mt-8">
          <Link
            href="/auth/login"
            className="px-6 py-3 rounded-lg font-semibold text-base no-underline"
            style={{ backgroundColor: 'var(--color-brand-primary)', color: 'var(--color-text-primary)' }}
          >
            Login
          </Link>
          <Link
            href="/account/billing"
            className="px-6 py-3 rounded-lg font-semibold text-base no-underline border"
            style={{ color: 'var(--color-brand-primary)', borderColor: 'var(--color-brand-primary)', backgroundColor: 'transparent' }}
          >
            Billing
          </Link>
        </nav>

      </div>
    </main>
  );
}
