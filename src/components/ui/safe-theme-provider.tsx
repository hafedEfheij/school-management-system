'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';

interface SafeThemeProviderProps {
  children: ReactNode;
  defaultTheme?: string;
  forcedTheme?: string;
  themes?: string[];
  attribute?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

/**
 * A hydration-safe theme provider wrapper that handles SSR and client-side rendering properly
 */
export function SafeThemeProvider({
  children,
  defaultTheme = 'system',
  forcedTheme,
  themes = ['light', 'dark'],
  attribute = 'class',
  enableSystem = true,
  disableTransitionOnChange = false,
}: SafeThemeProviderProps) {
  const [mounted, setMounted] = useState(false);
  
  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // During SSR and initial client render, render children without theme context
  // to avoid hydration mismatch
  if (!mounted) {
    return (
      <div suppressHydrationWarning>
        {children}
      </div>
    );
  }
  
  return (
    <ThemeProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      forcedTheme={forcedTheme}
      themes={themes}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
    >
      {children}
    </ThemeProvider>
  );
}
