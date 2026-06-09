import React, { HTMLAttributes, forwardRef } from 'react';

export type BrandCardVariant = 'default' | 'elevated' | 'outlined';

export interface BrandCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: BrandCardVariant;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  noPadding?: boolean;
}

export const BrandCard = forwardRef<HTMLDivElement, BrandCardProps>(
  ({ variant = 'default', header, footer, noPadding = false, children, style, ...rest }, ref) => {
    const variantStyles: Record<BrandCardVariant, React.CSSProperties> = {
      default: {
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-default)',
        boxShadow: 'var(--shadow-sm)',
      },
      elevated: {
        backgroundColor: 'var(--color-bg-elevated)',
        border: '1px solid var(--color-border-default)',
        boxShadow: 'var(--shadow-md)',
      },
      outlined: {
        backgroundColor: 'transparent',
        border: '1px solid var(--color-border-default)',
        boxShadow: 'none',
      },
    };

    const cardStyle: React.CSSProperties = {
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      transition: 'box-shadow var(--transition-base)',
      ...variantStyles[variant],
      ...style,
    };

    const headerStyle: React.CSSProperties = {
      padding: 'var(--spacing-4) var(--spacing-6)',
      borderBottom: '1px solid var(--color-border-default)',
      fontFamily: 'var(--font-family-base)',
      fontWeight: 'var(--font-weight-semibold)' as never,
      fontSize: 'var(--font-size-md)',
      color: 'var(--color-text-primary)',
    };

    const footerStyle: React.CSSProperties = {
      padding: 'var(--spacing-4) var(--spacing-6)',
      borderTop: '1px solid var(--color-border-default)',
      backgroundColor: 'rgba(0,0,0,0.15)',
    };

    return (
      <div ref={ref} style={cardStyle} {...rest}>
        {header && <div style={headerStyle}>{header}</div>}
        <div style={{ padding: noPadding ? 0 : 'var(--spacing-6)' }}>{children}</div>
        {footer && <div style={footerStyle}>{footer}</div>}
      </div>
    );
  },
);

BrandCard.displayName = 'BrandCard';
