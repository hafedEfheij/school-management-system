'use client';

import React, { useState, useEffect } from 'react';

interface SafeDateProps {
  date: Date | string | number;
  format?: 'short' | 'medium' | 'long' | 'full';
  locale?: string;
  className?: string;
}

/**
 * A hydration-safe date formatter component that handles SSR and client-side rendering properly
 */
export function SafeDate({
  date,
  format = 'medium',
  locale = 'en-US',
  className,
}: SafeDateProps) {
  const [mounted, setMounted] = useState(false);
  const [formattedDate, setFormattedDate] = useState<string>('');
  
  // Only format the date on the client side to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      
      const options: Intl.DateTimeFormatOptions = {
        short: { 
          year: 'numeric', 
          month: 'numeric', 
          day: 'numeric' 
        },
        medium: { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        },
        long: { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric', 
          weekday: 'long' 
        },
        full: { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric', 
          weekday: 'long',
          hour: '2-digit',
          minute: '2-digit'
        }
      };
      
      setFormattedDate(new Intl.DateTimeFormat(locale, options[format]).format(dateObj));
    } catch (error) {
      console.error('Error formatting date:', error);
      setFormattedDate('Invalid date');
    }
  }, [date, format, locale]);
  
  // Return a placeholder during SSR to avoid hydration mismatches
  if (!mounted) {
    return (
      <span className={className}>
        {format === 'short' ? '01/01/2024' : 
         format === 'medium' ? 'Jan 1, 2024' : 
         format === 'long' ? 'Monday, January 1, 2024' : 
         'Monday, January 1, 2024, 12:00 PM'}
      </span>
    );
  }
  
  return (
    <span className={className} suppressHydrationWarning>
      {formattedDate}
    </span>
  );
}
