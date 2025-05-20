'use client';

import React, { useState, useEffect, FormEvent, ReactNode } from 'react';
import { ClientOnly } from './client-only';

interface SafeFormProps {
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  className?: string;
  id?: string;
  method?: 'get' | 'post';
  action?: string;
  encType?: string;
  autoComplete?: string;
  noValidate?: boolean;
  target?: string;
}

/**
 * A hydration-safe form component that handles SSR and client-side rendering properly
 */
export function SafeForm({
  children,
  onSubmit,
  className,
  id,
  method = 'post',
  action,
  encType,
  autoComplete,
  noValidate,
  target,
}: SafeFormProps) {
  const [mounted, setMounted] = useState(false);
  
  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };
  
  // Simple loading state for SSR
  const FormSkeleton = () => (
    <div className={className}>
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
    </div>
  );
  
  return (
    <ClientOnly fallback={<FormSkeleton />}>
      <form
        id={id}
        className={className}
        onSubmit={handleSubmit}
        method={method}
        action={action}
        encType={encType}
        autoComplete={autoComplete}
        noValidate={noValidate}
        target={target}
        suppressHydrationWarning
      >
        {children}
      </form>
    </ClientOnly>
  );
}
