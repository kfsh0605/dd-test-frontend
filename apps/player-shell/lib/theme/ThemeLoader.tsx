'use client';

import { useEffect } from 'react';
import { useTenant } from '@/context/TenantContext';

// Maps brandId to its CSS token file path
const THEME_MAP: Record<string, string> = {
  alpha: '/themes/theme-tenant-alpha.css',
};

const FALLBACK_THEME = '/themes/fallback.css';
const LINK_ID = 'tenant-theme-stylesheet';

export function ThemeLoader() {
  const { brandId } = useTenant();

  useEffect(() => {
    const href = THEME_MAP[brandId] ?? FALLBACK_THEME;

    let link = document.getElementById(LINK_ID) as HTMLLinkElement | null;

    if (!link) {
      link = document.createElement('link');
      link.id = LINK_ID;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }

    link.href = href;
  }, [brandId]);

  return null;
}
