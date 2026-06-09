'use client';

import { useTenant } from '@/context/TenantContext';

export function TenantInfo() {
  const { brandId, locale, currency } = useTenant();

  const items = [
    { label: 'Brand', value: brandId },
    { label: 'Locale', value: locale },
    { label: 'Currency', value: currency },
  ];

  return (
    <div style={{
      backgroundColor: 'var(--color-bg-surface)',
      border: '1px solid var(--color-border-default)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--spacing-6)',
    }}>
      <h2 style={{
        fontSize: 'var(--font-size-sm)',
        fontWeight: 'var(--font-weight-semibold)',
        color: 'var(--color-text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: 'var(--spacing-4)',
      }}>
        Tenant Config
      </h2>
      <div style={{ display: 'flex', gap: 'var(--spacing-8)' }}>
        {items.map(({ label, value }) => (
          <div key={label}>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-1)' }}>
              {label}
            </p>
            <p style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
              {value.toUpperCase()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
