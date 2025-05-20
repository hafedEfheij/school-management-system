'use client';

import React, { useState, useEffect } from 'react';

interface SafeNumberProps {
  value: number;
  format?: 'decimal' | 'currency' | 'percent';
  locale?: string;
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  className?: string;
}

/**
 * A hydration-safe number formatter component that handles SSR and client-side rendering properly
 */
export function SafeNumber({
  value,
  format = 'decimal',
  locale = 'en-US',
  currency = 'USD',
  minimumFractionDigits = 0,
  maximumFractionDigits = 2,
  className,
}: SafeNumberProps) {
  const [mounted, setMounted] = useState(false);
  const [formattedNumber, setFormattedNumber] = useState<string>('');
  
  // Only format the number on the client side to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    
    try {
      const options: Intl.NumberFormatOptions = {
        minimumFractionDigits,
        maximumFractionDigits,
      };
      
      if (format === 'currency') {
        options.style = 'currency';
        options.currency = currency;
      } else if (format === 'percent') {
        options.style = 'percent';
      }
      
      setFormattedNumber(new Intl.NumberFormat(locale, options).format(value));
    } catch (error) {
      console.error('Error formatting number:', error);
      setFormattedNumber(value.toString());
    }
  }, [value, format, locale, currency, minimumFractionDigits, maximumFractionDigits]);
  
  // Return a placeholder during SSR to avoid hydration mismatches
  if (!mounted) {
    return (
      <span className={className}>
        {format === 'decimal' ? '0' : 
         format === 'currency' ? '$0.00' : 
         '0%'}
      </span>
    );
  }
  
  return (
    <span className={className} suppressHydrationWarning>
      {formattedNumber}
    </span>
  );
}
