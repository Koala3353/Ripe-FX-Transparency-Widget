import { CurrencyCode, ConversionResult } from '../types';
import { CURRENCIES, RIPE_FEE_PERCENTAGE, RIPE_FLAT_NETWORK_FEE_USD, LEGACY_FEE_PERCENTAGE, LEGACY_FLAT_FEE_USD } from '../constants';

export const calculateConversion = (amount: number, currencyCode: CurrencyCode): ConversionResult => {
  const currency = CURRENCIES[currencyCode];
  
  // 1. Calculate Gross (what 1 USDC buys at customer rate)
  // In a real app, 'customerRate' includes the spread. 
  // We explicitly show spread in the UI for transparency.
  const grossFiat = amount * currency.customerRate;
  
  // 2. Calculate Ripe Fee (Percentage of source amount converted to Fiat)
  // Calculation: (Amount * Rate) * Fee%
  const ripeFeeFiat = grossFiat * RIPE_FEE_PERCENTAGE;

  // 3. Calculate Network Fee (Flat USD converted to Fiat)
  const networkFeeFiat = RIPE_FLAT_NETWORK_FEE_USD * currency.customerRate;

  // 4. Spread calculation (Implicit cost)
  // Difference between Interbank and Customer rate
  const spreadPerUnit = currency.interbankRate - currency.customerRate;
  const spreadFiat = amount * spreadPerUnit;

  // 5. Net Received
  const totalDeductions = ripeFeeFiat + networkFeeFiat;
  const netReceived = Math.max(0, grossFiat - totalDeductions);

  // --- Legacy Comparison Calculation ---
  const legacyGross = amount * currency.legacyRate; // Worse rate
  const legacyPctFee = legacyGross * LEGACY_FEE_PERCENTAGE; // Higher % fee
  const legacyFlatFee = LEGACY_FLAT_FEE_USD * currency.legacyRate; // Higher flat fee
  const legacyNet = Math.max(0, legacyGross - legacyPctFee - legacyFlatFee);

  return {
    inputAmount: amount,
    currency,
    grossFiat,
    ripeFeeFiat,
    networkFeeFiat,
    spreadFiat,
    netReceived,
    effectiveRate: amount > 0 ? netReceived / amount : 0,
    breakdown: {
      gross: grossFiat,
      ripeFee: ripeFeeFiat,
      networkFee: networkFeeFiat,
      totalDeductions
    },
    legacyComparison: {
      netReceived: legacyNet,
      savings: netReceived - legacyNet
    }
  };
};

export const formatCurrency = (amount: number, symbol: string, code: CurrencyCode) => {
  // Handle high denomination currencies like IDR/VND with fewer decimals
  const isHighDenom = [CurrencyCode.IDR, CurrencyCode.VND].includes(code);
  
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: isHighDenom ? 0 : 2,
    maximumFractionDigits: isHighDenom ? 0 : 2,
  }).format(amount);
};