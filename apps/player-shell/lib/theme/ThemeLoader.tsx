'use client';

import { useEffect } from 'react';
import { useTenant } from '@/context/TenantContext';
import { THEME_MAP, FALLBACK_THEME } from './themeMap';

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
