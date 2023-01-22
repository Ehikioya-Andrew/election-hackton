export const DateFormatter = new Intl.DateTimeFormat('EN-NG', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: false,
});

export const NumberFormatter = new Intl.NumberFormat('EN-NG', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const CurrencyFormatter = new Intl.NumberFormat('EN-NG', {
  style: 'currency',
  currency: 'NGN',
});
export function CapitalizeFunction(word: string) {
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
}
