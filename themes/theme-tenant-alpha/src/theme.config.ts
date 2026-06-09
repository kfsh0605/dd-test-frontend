export interface ThemeConfig {
  brandId: string;
  displayName: string;
  tokensPath: string;
  supportedLocales: string[];
  supportedCurrencies: string[];
  brand: {
    logoText: string;
    primaryColor: string;
    backgroundColor: string;
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
    primaryColor: '#6c47ff',
    backgroundColor: '#0f0e17',
  },
};

export default themeConfig;
