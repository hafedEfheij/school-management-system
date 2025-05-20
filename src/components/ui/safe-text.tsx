'use client';

import React, { useState, useEffect, ReactNode } from 'react';

interface SafeTextProps {
  children: ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  dir?: 'ltr' | 'rtl' | 'auto';
  lang?: string;
}

/**
 * A hydration-safe text component that handles SSR and client-side rendering properly
 * Especially useful for RTL text and internationalization
 */
export function SafeText({
  children,
  as: Component = 'span',
  className,
  dir = 'auto',
  lang,
}: SafeTextProps) {
  const [mounted, setMounted] = useState(false);
  
  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Return a simplified version during SSR to avoid hydration mismatches
  if (!mounted) {
    return (
      <Component 
        className={className}
        dir="ltr"
        lang="en"
      >
        {typeof children === 'string' ? children : null}
      </Component>
    );
  }
  
  return (
    <Component 
      className={className}
      dir={dir}
      lang={lang}
      suppressHydrationWarning
    >
      {children}
    </Component>
  );
}
