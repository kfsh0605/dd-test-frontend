/**
 * BrandCard.tsx
 *
 * Branded карточка темы alpha. Используется для отображения контента —
 * billing info, game cards, user stats и т.д.
 *
 * Паттерн: Composition через children + слоты (header, footer).
 * Компонент не знает что внутри него — это задача shell-приложения.
 * Theme package отвечает только за внешний вид.
 */

import React, { HTMLAttributes, forwardRef } from 'react';

export type BrandCardVariant = 'default' | 'elevated' | 'outlined';

export interface BrandCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: BrandCardVariant;
  /** Слот для заголовка карточки */
  header?: React.ReactNode;
  /** Слот для футера карточки */
  footer?: React.ReactNode;
  /** Убрать внутренние отступы (для случаев с кастомным padding) */
  noPadding?: boolean;
}

export const BrandCard = forwardRef<HTMLDivElement, BrandCardProps>(
  (
    {
      variant = 'default',
      header,
      footer,
      noPadding = false,
      children,
      style,
      ...rest
    },
    ref,
  ) => {
    /* Варианты карточки через CSS-переменные */
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

    const bodyStyle: React.CSSProperties = {
      padding: noPadding ? 0 : 'var(--spacing-6)',
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
        {/* Рендерим header только если он передан — не создаём пустой DOM-элемент */}
        {header && <div style={headerStyle}>{header}</div>}

        <div style={bodyStyle}>{children}</div>

        {/* Рендерим footer только если он передан */}
        {footer && <div style={footerStyle}>{footer}</div>}
      </div>
    );
  },
);

BrandCard.displayName = 'BrandCard';
