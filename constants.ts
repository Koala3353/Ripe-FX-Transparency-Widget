import { CurrencyCode, CurrencyConfig } from './types';

export const RIPE_FEE_PERCENTAGE = 0.005; // 0.5%
export const LEGACY_FEE_PERCENTAGE = 0.03; // 3.0%
export const LEGACY_FLAT_FEE_USD = 5.00; // $5 flat fee for legacy
export const RIPE_FLAT_NETWORK_FEE_USD = 1.00; // $1 flat fee for Ripe

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  [CurrencyCode.PHP]: {
    code: CurrencyCode.PHP,
    name: 'Philippine Peso',
    flag: '🇵🇭',
    symbol: '₱',
    interbankRate: 59.00,
    customerRate: 58.70, // Tight spread
    legacyRate: 57.00, // Bad spread
    minNetworkFeeUSD: 1.00
  },
  [CurrencyCode.THB]: {
    code: CurrencyCode.THB,
    name: 'Thai Baht',
    flag: '🇹🇭',
    symbol: '฿',
    interbankRate: 36.50,
    customerRate: 36.35,
    legacyRate: 35.00,
    minNetworkFeeUSD: 1.00
  },
  [CurrencyCode.IDR]: {
    code: CurrencyCode.IDR,
    name: 'Indonesian Rupiah',
    flag: '🇮🇩',
    symbol: 'Rp',
    interbankRate: 15800,
    customerRate: 15750,
    legacyRate: 15200,
    minNetworkFeeUSD: 1.00
  },
  [CurrencyCode.MYR]: {
    code: CurrencyCode.MYR,
    name: 'Malaysian Ringgit',
    flag: '🇲🇾',
    symbol: 'RM',
    interbankRate: 4.75,
    customerRate: 4.73,
    legacyRate: 4.50,
    minNetworkFeeUSD: 1.00
  },
  [CurrencyCode.VND]: {
    code: CurrencyCode.VND,
    name: 'Vietnamese Dong',
    flag: '🇻🇳',
    symbol: '₫',
    interbankRate: 25400,
    customerRate: 25300,
    legacyRate: 24500,
    minNetworkFeeUSD: 1.00
  }
};