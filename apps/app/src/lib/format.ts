export function formatNumber(value: number): string {
    return value.toLocaleString('en-US');
}

const CURRENCY_SYMBOLS: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
};

/**
 * Formats a plan price using the currency Razorpay will actually charge in, so the displayed
 * amount matches the charge. Falls back to the ISO code as a prefix for unmapped currencies.
 */
export function formatPrice(
    amount: number,
    currency?: string | null,
): string {
    const code = (currency ?? 'INR').toUpperCase();
    const symbol = CURRENCY_SYMBOLS[code];
    const value = amount.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
    return symbol ? `${symbol}${value}` : `${code} ${value}`;
}
