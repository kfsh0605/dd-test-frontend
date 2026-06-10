export interface ThemeConfig {
  brandId: string;
  displayName: string;
  tokensPath: string;
  supportedLocales: string[];
  supportedCurrencies: string[];
  brand: {
    logoText: string;
  };
}

const themeConfig: ThemeConfig = {
  brandId: 'alpha',
  displayName: 'Alpha Casino',
  tokensPath: 'theme-tenant-alpha/tokens.css',
  supportedLocales: ['en', 'uk', 'ru'],
  supportedCurrencies: ['USD', 'EUR', 'BTC', 'ETH'],
  brand: {
    logoText: 'ALPHA',
  },
};

export default themeConfig;
