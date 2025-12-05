export enum CurrencyCode {
  PHP = 'PHP',
  THB = 'THB',
  IDR = 'IDR',
  MYR = 'MYR',
  VND = 'VND'
}

export interface CurrencyConfig {
  code: CurrencyCode;
  name: string;
  flag: string; // Emoji flag
  symbol: string;
  interbankRate: number; // USD to Currency
  customerRate: number; // Ripe Rate
  legacyRate: number; // Bad Legacy Rate
  minNetworkFeeUSD: number;
}

export interface ConversionResult {
  inputAmount: number;
  currency: CurrencyConfig;
  grossFiat: number;
  ripeFeeFiat: number;
  networkFeeFiat: number;
  spreadFiat: number;
  netReceived: number;
  effectiveRate: number;
  breakdown: {
    gross: number;
    ripeFee: number;
    networkFee: number;
    totalDeductions: number;
  };
  legacyComparison: {
    netReceived: number;
    savings: number;
  };
}