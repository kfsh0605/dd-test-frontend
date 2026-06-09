# Decisions

## Monorepo with pnpm workspaces and Turborepo

A monorepo makes the shell/theme boundary explicit and testable in a single repository. Both packages share one `pnpm install` and one git history. Turborepo handles build caching and task orchestration across packages. This matches the stack described in the job requirements and reflects how multi-brand platforms are structured in production.

## Next.js App Router

The job description specifically mentions Next.js App Router experience. App Router enables a clean split between Server Components (no client JS, better performance) and Client Components (interactivity, context access). Pages are Server Components by default - only the parts that need state or context are marked `use client`.

## CSS Custom Properties for theming

Theme switching is implemented entirely through CSS custom properties. The shell loads a different CSS file per brand - no JavaScript theme engine, no runtime style injection beyond a single `<link>` tag swap. This approach has zero performance overhead compared to JS-in-CSS solutions and works correctly with SSR without hydration issues.

The alternative was a CSS-in-JS solution (styled-components, Emotion), which adds runtime overhead and complicates SSR. CSS custom properties are the simplest correct solution for this use case.

## Theme loaded synchronously in layout head

The theme CSS is added as a `<link rel="stylesheet">` in the server-rendered `<head>`. This is a render-blocking resource, which is intentional - it prevents flash of unstyled content (FOUC) on page load. The ThemeLoader client component handles runtime switching when brandId changes without a page reload.

## TanStack Query for data fetching

React Query manages all async data states (loading, error, success, empty) without manual `useState` boilerplate. It also handles cache invalidation - after a deposit succeeds, `invalidateQueries` refetches the balance automatically. The job stack lists React Query explicitly.

## React Hook Form with Zod

React Hook Form avoids re-rendering on every keystroke by using uncontrolled inputs. Zod provides schema-based validation where the TypeScript type is derived from the schema - no duplication between the validation rules and the type definition.

```ts
const schema = z.object({ email: z.string().email() });
type FormData = z.infer<typeof schema>; // type comes from schema, not written separately
```

## API adapter pattern

Pages import an adapter interface, not a fetch call. The mock and a future real HTTP implementation both satisfy the same TypeScript interface. Swapping implementations requires changing one file - the adapter - with no changes to any page or component. This satisfies the acceptance criteria requirement directly.

## minHeight on skeleton containers

Loading skeletons have fixed dimensions matching the real content. This prevents cumulative layout shift (CLS) when data loads in. The balance card content height was calculated from the actual font sizes and line heights defined in the token system to ensure an exact match.
