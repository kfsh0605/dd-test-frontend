/**
 * theme.config.ts
 *
 * TypeScript-конфигурация темы. Этот файл — единственный способ,
 * которым shell узнаёт о существовании темы.
 *
 * Паттерн: Configuration Object — вся мета-информация о теме в одном месте.
 * Shell читает ThemeConfig и на его основе решает что подключать.
 * Никакой бизнес-логики здесь нет — только описание.
 */

export interface ThemeConfig {
  /** Уникальный идентификатор бренда — совпадает с brandId в TenantContext */
  brandId: string;
  /** Человекочитаемое название темы */
  displayName: string;
  /** Путь к CSS-файлу с токенами (относительно пакета) */
  tokensPath: string;
  /** Поддерживаемые локали */
  supportedLocales: string[];
  /** Поддерживаемые валюты */
  supportedCurrencies: string[];
  /** Мета-данные бренда */
  brand: {
    logoText: string;
    primaryColor: string;
    backgroundColor: string;
  };
}

/**
 * Конфигурация темы alpha-тенанта.
 * Экспортируется как дефолт — shell импортирует его через index.ts пакета.
 */
const themeConfig: ThemeConfig = {
  brandId: 'alpha',
  displayName: 'Alpha Casino',
  tokensPath: 'theme-tenant-alpha/tokens.css',
  supportedLocales: ['en', 'uk', 'ru'],
  supportedCurrencies: ['USD', 'EUR', 'BTC', 'ETH'],
  brand: {
    logoText: 'ALPHA',
    primaryColor: '#6c47ff',
    backgroundColor: '#0f0e17',
  },
};

export default themeConfig;
