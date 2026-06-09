# dd-test-frontend

Multi-tenant frontend platform built with Next.js, TypeScript, and pnpm workspaces.

## Prerequisites

- Node.js 18+
- pnpm 9+

## Getting started

Install dependencies from the monorepo root:

```bash
pnpm install
```

Run the shell app in development mode:

```bash
pnpm run dev:shell
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project structure

```
dd-test-frontend/
├── apps/
│   └── player-shell/        # Main Next.js application
├── themes/
│   └── theme-tenant-alpha/  # Brand theme package
├── turbo.json               # Turborepo pipeline config
└── pnpm-workspace.yaml      # Workspace packages definition
```

## Available scripts

| Command | Description |
|---|---|
| `pnpm run dev:shell` | Start player-shell in dev mode |
| `pnpm run build` | Build all packages |
| `pnpm run lint` | Lint all packages |

## Pages

| Route | Description |
|---|---|
| `/` | Home - tenant info and navigation |
| `/auth/login` | Login form with validation |
| `/account/billing` | Billing dashboard with balance and transactions |

## Theme switching

The shell loads a CSS theme file based on `brandId` at the layout level.
To test with the fallback theme, change `BRAND_ID` in `apps/player-shell/app/layout.tsx` to any value other than `alpha`.

## Testing credentials

On the login page:
- Any valid email + any password (8+ chars) - successful login
- Any valid email + password `wrongpass` - triggers auth error
