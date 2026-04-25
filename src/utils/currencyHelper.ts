export function formatCurrency(value: number, currencySymbol: string = 'AIC'): string {
  return `${value.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ${currencySymbol}`;
}