export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium"
      style={{ backgroundColor: 'var(--color-brand-primary)', color: 'var(--color-text-primary)' }}
    >
      Skip to main content
    </a>
  );
}
