/**
 * BrandButton.tsx
 *
 * Branded кнопка темы alpha. Использует только CSS-переменные из tokens.css —
 * никаких хардкоженных цветов. Это гарантирует что компонент автоматически
 * адаптируется при смене темы (другой набор CSS-переменных).
 *
 * Паттерн: Compound Component + Polymorphic Props.
 * variant и size — единственные "бизнес"-решения компонента.
 * Вся визуальная логика делегирована CSS-переменным.
 */

import React, { ButtonHTMLAttributes, forwardRef } from 'react';

export type BrandButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type BrandButtonSize = 'sm' | 'md' | 'lg';

export interface BrandButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BrandButtonVariant;
  size?: BrandButtonSize;
  /** Показывать спиннер загрузки и блокировать клик */
  isLoading?: boolean;
  /** Растянуть на всю ширину контейнера */
  fullWidth?: boolean;
}

/**
 * forwardRef — позволяет родительскому компоненту получить ref на DOM-элемент.
 * Важно для a11y (управление фокусом) и интеграции с библиотеками форм.
 */
export const BrandButton = forwardRef<HTMLButtonElement, BrandButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      disabled,
      children,
      style,
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    /* Базовые стили через CSS-переменные из tokens.css */
    const baseStyle: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--spacing-2)',
      fontFamily: 'var(--font-family-base)',
      fontWeight: 'var(--font-weight-semibold)' as never,
      lineHeight: 'var(--line-height-tight)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid transparent',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      opacity: isDisabled ? 0.55 : 1,
      transition: 'background-color var(--transition-fast), box-shadow var(--transition-fast), opacity var(--transition-fast)',
      width: fullWidth ? '100%' : undefined,
      textDecoration: 'none',
      whiteSpace: 'nowrap',
    };

    /* Размеры */
    const sizeStyles: Record<BrandButtonSize, React.CSSProperties> = {
      sm: {
        padding: 'var(--spacing-2) var(--spacing-3)',
        fontSize: 'var(--font-size-sm)',
      },
      md: {
        padding: 'var(--spacing-3) var(--spacing-5)',
        fontSize: 'var(--font-size-md)',
      },
      lg: {
        padding: 'var(--spacing-4) var(--spacing-8)',
        fontSize: 'var(--font-size-lg)',
      },
    };

    /* Варианты */
    const variantStyles: Record<BrandButtonVariant, React.CSSProperties> = {
      primary: {
        backgroundColor: 'var(--color-brand-primary)',
        color: 'var(--color-text-primary)',
        boxShadow: 'var(--shadow-brand)',
      },
      secondary: {
        backgroundColor: 'var(--color-brand-secondary)',
        color: 'var(--color-text-inverse)',
      },
      ghost: {
        backgroundColor: 'transparent',
        color: 'var(--color-brand-primary)',
        borderColor: 'var(--color-brand-primary)',
      },
      danger: {
        backgroundColor: 'var(--color-error)',
        color: 'var(--color-text-primary)',
      },
    };

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={isLoading}
        style={{
          ...baseStyle,
          ...sizeStyles[size],
          ...variantStyles[variant],
          ...style,
        }}
        {...rest}
      >
        {/* Спиннер загрузки — inline SVG чтобы не зависеть от внешних иконок */}
        {isLoading && (
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ animation: 'brand-spin 0.75s linear infinite' }}
          >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        )}
        {children}
      </button>
    );
  },
);

BrandButton.displayName = 'BrandButton';
