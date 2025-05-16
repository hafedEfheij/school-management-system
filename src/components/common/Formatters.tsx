'use client';

import { useLanguage } from '@/contexts/LanguageContext';

type DateFormatterProps = {
  date: Date | string | number;
  options?: Intl.DateTimeFormatOptions;
};

type NumberFormatterProps = {
  value: number;
  options?: Intl.NumberFormatOptions;
};

type CurrencyFormatterProps = {
  amount: number;
  currency?: string;
};

/**
 * Component to format dates according to the current locale
 */
export function DateFormatter({ date, options }: DateFormatterProps) {
  const { formatDate } = useLanguage();
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  
  return <>{formatDate(dateObj, options)}</>;
}

/**
 * Component to format numbers according to the current locale
 */
export function NumberFormatter({ value, options }: NumberFormatterProps) {
  const { formatNumber } = useLanguage();
  
  return <>{formatNumber(value, options)}</>;
}

/**
 * Component to format currency values according to the current locale
 */
export function CurrencyFormatter({ amount, currency = 'USD' }: CurrencyFormatterProps) {
  const { formatCurrency } = useLanguage();
  
  return <>{formatCurrency(amount, currency)}</>;
}

/**
 * Component to format relative time (e.g., "2 days ago") according to the current locale
 */
export function RelativeTimeFormatter({ date }: { date: Date | string | number }) {
  const { getLocale } = useLanguage();
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  const formatter = new Intl.RelativeTimeFormat(getLocale(), { 
    numeric: 'auto',
    style: 'long'
  });
  
  let value: number;
  let unit: Intl.RelativeTimeFormatUnit;
  
  if (diffInSeconds < 60) {
    value = -diffInSeconds;
    unit = 'second';
  } else if (diffInSeconds < 3600) {
    value = -Math.floor(diffInSeconds / 60);
    unit = 'minute';
  } else if (diffInSeconds < 86400) {
    value = -Math.floor(diffInSeconds / 3600);
    unit = 'hour';
  } else if (diffInSeconds < 2592000) {
    value = -Math.floor(diffInSeconds / 86400);
    unit = 'day';
  } else if (diffInSeconds < 31536000) {
    value = -Math.floor(diffInSeconds / 2592000);
    unit = 'month';
  } else {
    value = -Math.floor(diffInSeconds / 31536000);
    unit = 'year';
  }
  
  return <>{formatter.format(value, unit)}</>;
}
