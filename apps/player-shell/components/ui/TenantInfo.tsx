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
    <div
      className="rounded-xl p-6 border"
      style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border-default)' }}
    >
      <h2
        className="text-xs font-semibold uppercase tracking-widest mb-4"
        style={{ color: 'var(--color-text-muted)' }}
      >
        Tenant Config
      </h2>
      <div className="flex gap-8">
        {items.map(({ label, value }) => (
          <div key={label}>
            <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>
              {label}
            </p>
            <p className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              {value.toUpperCase()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
