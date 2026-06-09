# Architecture

## Overview

The project is a monorepo with a clear split between the application layer and the theme layer. The shell application contains all business logic and routing. The theme package contains only visual definitions - tokens, config, and branded UI components.

## Package boundaries

```
apps/player-shell         - business logic, routing, API adapters, state
themes/theme-tenant-alpha - CSS tokens, theme config, branded components only
```

The theme package has no knowledge of the shell. The shell imports from the theme package public API only - never directly from internal files like `src/tokens.css` or component source paths.

## Shell application

The shell is a Next.js App Router application. The root layout sets up three providers that wrap the entire application:

- `TenantProvider` - provides brandId, locale, and currency to all client components via React Context
- `QueryProvider` - sets up TanStack Query client for data fetching
- `ThemeLoader` - dynamically switches the theme CSS file when brandId changes at runtime

The shell also loads the initial theme CSS synchronously in `<head>` to prevent flash of unstyled content on page load.

### Data flow

```
layout.tsx
  TenantProvider (brandId: "alpha", locale: "en", currency: "USD")
    QueryProvider
      ThemeLoader  (reads brandId, loads /themes/theme-tenant-alpha.css)
      page.tsx
        useTenant() - reads tenant config
        billingApi  - API adapter (mock or real, interchangeable)
```

### API adapters

Pages never call fetch directly. All data access goes through adapter interfaces defined in `adapters/`. The current implementation uses mocks with simulated delays. Replacing a mock with a real HTTP implementation requires no changes to any page component - only the adapter file changes.

```
adapters/identityApi.ts  - login, logout
adapters/billingApi.ts   - balance, transactions, deposit
```

### Directory structure

```
apps/player-shell/
├── adapters/        - API adapter interfaces and mock implementations
├── app/             - Next.js App Router pages and layouts
├── components/ui/   - Shared UI components used across pages
├── context/         - React Context definitions (TenantContext)
├── lib/             - Infrastructure utilities (QueryProvider, ThemeLoader)
└── public/themes/   - Static CSS theme files served at runtime
```

## Theme package

The theme package `theme-tenant-alpha` is a standalone package with no runtime dependencies on the shell. It exports:

- `themeConfig` - metadata about the brand (brandId, supported locales, currencies)
- `BrandButton` - branded button component
- `BrandCard` - branded card component

All visual values in components come from CSS custom properties defined in `tokens.css`. Components contain no hardcoded colors, spacing, or typography values. This means any component automatically reflects a theme change when a different token file is loaded.

The `tokens.css` file is served as a static asset from `public/themes/`. The theme package source is the single source of truth - the public file is a copy of it.

### Theme boundary rule

The shell imports branded components and config through the package public API:

```ts
import { BrandButton, BrandCard, themeConfig } from 'theme-tenant-alpha';
```

The shell never does:

```ts
import something from 'theme-tenant-alpha/src/tokens.css';
import something from 'theme-tenant-alpha/src/components/BrandButton';
```

This boundary means the internal structure of the theme package can change freely without touching shell code.

## Adding a new brand

1. Create `themes/theme-tenant-beta/` with its own `tokens.css` and `theme.config.ts`
2. Copy the CSS file to `apps/player-shell/public/themes/theme-tenant-beta.css`
3. Add the entry to `THEME_MAP` in `apps/player-shell/app/layout.tsx`
4. No page components, no adapters, no business logic needs to change
