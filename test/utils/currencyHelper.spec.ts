import { describe, expect, it } from 'vitest';

describe('currencyHelper', () => {

  it('should have thousands separator', async () => {
    const { formatCurrency } = await import('../../src/utils/currencyHelper');
    const formattedValue = formatCurrency(1234567);
    expect(formattedValue).toBe('1,234,567 AIC');
  });
});