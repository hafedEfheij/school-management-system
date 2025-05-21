'use client';

import React, { useState, useEffect, ChangeEvent, InputHTMLAttributes } from 'react';
import { ClientOnly } from './client-only';

interface SafeCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  onChange?: (checked: boolean, e: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  hintClassName?: string;
}

/**
 * A hydration-safe checkbox component that handles SSR and client-side rendering properly
 */
export function SafeCheckbox({
  id,
  name,
  checked = false,
  onChange,
  label,
  error,
  hint,
  disabled,
  required,
  className,
  containerClassName,
  labelClassName,
  errorClassName,
  hintClassName,
  ...rest
}: SafeCheckboxProps) {
  const [mounted, setMounted] = useState(false);
  const [isChecked, setIsChecked] = useState(checked);
  
  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    setIsChecked(checked);
  }, [checked]);
  
  // Handle checkbox change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    setIsChecked(newChecked);
    onChange?.(newChecked, e);
  };
  
  // Simple loading state for SSR
  const CheckboxSkeleton = () => (
    <div className={containerClassName}>
      <div className="flex items-center">
        <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
        {label && (
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4 ml-2"></div>
        )}
      </div>
      {hint && (
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mt-1 ml-7"></div>
      )}
    </div>
  );
  
  return (
    <ClientOnly fallback={<CheckboxSkeleton />}>
      <div className={containerClassName}>
        <div className="flex items-center">
          <input
            id={id}
            name={name}
            type="checkbox"
            checked={isChecked}
            onChange={handleChange}
            disabled={disabled}
            required={required}
            className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className || ''}`}
            suppressHydrationWarning
            {...rest}
          />
          {label && (
            <label 
              htmlFor={id} 
              className={`ml-2 block text-sm ${error ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${labelClassName || ''}`}
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
        </div>
        {error && (
          <p className={`mt-1 text-sm text-red-500 ml-6 ${errorClassName || ''}`}>
            {error}
          </p>
        )}
        {hint && !error && (
          <p className={`mt-1 text-sm text-gray-500 dark:text-gray-400 ml-6 ${hintClassName || ''}`}>
            {hint}
          </p>
        )}
      </div>
    </ClientOnly>
  );
}
