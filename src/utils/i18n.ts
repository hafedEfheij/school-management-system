/**
 * Utility functions for internationalization (i18n)
 */

/**
 * Gets a value from a nested object using a dot-notation path
 * Example: getNestedValue({ a: { b: { c: 'value' } } }, 'a.b.c') returns 'value'
 */
export function getNestedValue(obj: Record<string, any>, path: string, defaultValue: string = path): string {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === undefined || result === null || typeof result !== 'object') {
      return defaultValue;
    }
    result = result[key];
  }
  
  return result !== undefined && result !== null ? String(result) : defaultValue;
}

/**
 * Formats a string with variables
 * Example: formatString('Hello, {name}!', { name: 'World' }) returns 'Hello, World!'
 */
export function formatString(str: string, variables: Record<string, any> = {}): string {
  return str.replace(/{(\w+)}/g, (match, key) => {
    return variables[key] !== undefined ? String(variables[key]) : match;
  });
}

/**
 * Formats a date according to the locale
 */
export function formatDate(date: Date, locale: string, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(locale, options).format(date);
}

/**
 * Formats a number according to the locale
 */
export function formatNumber(num: number, locale: string, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(locale, options).format(num);
}

/**
 * Formats a currency value according to the locale
 */
export function formatCurrency(amount: number, locale: string, currency: string = 'USD'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Returns the appropriate plural form based on count
 */
export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}
