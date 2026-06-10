'use client';

import React, { createContext, useContext, useState } from 'react';

export type Locale = 'en' | 'uk' | 'ru';
export type Currency = 'USD' | 'EUR' | 'BTC' | 'ETH';

export interface TenantConfig {
  brandId: string;
  locale: Locale;
  currency: Currency;
}

interface TenantContextValue extends TenantConfig {
  setLocale: (locale: Locale) => void;
  setCurrency: (currency: Currency) => void;
}

const DEFAULT_TENANT: TenantConfig = {
  brandId: 'alpha',
  locale: 'en',
  currency: 'USD',
};

const TenantContext = createContext<TenantContextValue | null>(null);

interface TenantProviderProps {
  children: React.ReactNode;
  initialConfig?: Partial<TenantConfig>;
}

export function TenantProvider({ children, initialConfig }: TenantProviderProps) {
  const [locale, setLocale] = useState<Locale>(initialConfig?.locale ?? DEFAULT_TENANT.locale);
  const [currency, setCurrency] = useState<Currency>(initialConfig?.currency ?? DEFAULT_TENANT.currency);

  const brandId = initialConfig?.brandId ?? DEFAULT_TENANT.brandId;

  return (
    <TenantContext.Provider value={{ brandId, locale, currency, setLocale, setCurrency }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant(): TenantContextValue {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error('useTenant must be used within TenantProvider');
  return ctx;
}
