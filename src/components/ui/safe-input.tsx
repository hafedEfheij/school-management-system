'use client';

import React, { useState, useEffect, ChangeEvent, InputHTMLAttributes } from 'react';
import { ClientOnly } from './client-only';

interface SafeInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?: (value: string, e: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  hintClassName?: string;
}

/**
 * A hydration-safe input component that handles SSR and client-side rendering properly
 */
export function SafeInput({
  id,
  name,
  type = 'text',
  value = '',
  placeholder,
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
}: SafeInputProps) {
  const [mounted, setMounted] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  
  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    setInputValue(value);
  }, [value]);
  
  // Handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue, e);
  };
  
  // Simple loading state for SSR
  const InputSkeleton = () => (
    <div className={containerClassName}>
      {label && (
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
      )}
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      {hint && (
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mt-1"></div>
      )}
    </div>
  );
  
  return (
    <ClientOnly fallback={<InputSkeleton />}>
      <div className={containerClassName}>
        {label && (
          <label 
            htmlFor={id} 
            className={`block mb-1 text-sm font-medium ${error ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'} ${labelClassName || ''}`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          id={id}
          name={name}
          type={type}
          value={inputValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${disabled ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : 'bg-white dark:bg-gray-900'} ${className || ''}`}
          suppressHydrationWarning
          {...rest}
        />
        {error && (
          <p className={`mt-1 text-sm text-red-500 ${errorClassName || ''}`}>
            {error}
          </p>
        )}
        {hint && !error && (
          <p className={`mt-1 text-sm text-gray-500 dark:text-gray-400 ${hintClassName || ''}`}>
            {hint}
          </p>
        )}
      </div>
    </ClientOnly>
  );
}
