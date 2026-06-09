/**
 * index.ts — публичный API пакета theme-tenant-alpha
 *
 * ВАЖНО: Shell-приложение импортирует ТОЛЬКО отсюда.
 * Прямые импорты из src/ запрещены — это и есть "theme boundary".
 *
 * Если завтра изменится внутренняя структура пакета (переименуются файлы,
 * изменится иерархия папок) — shell этого не заметит, потому что
 * контракт (этот файл) остаётся неизменным.
 */

// Конфигурация темы
export { default as themeConfig } from './src/theme.config';
export type { ThemeConfig } from './src/theme.config';

// Branded компоненты
export { BrandButton } from './src/components/BrandButton';
export type { BrandButtonProps, BrandButtonVariant, BrandButtonSize } from './src/components/BrandButton';

export { BrandCard } from './src/components/BrandCard';
export type { BrandCardProps, BrandCardVariant } from './src/components/BrandCard';
