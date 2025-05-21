'use client';

import React, { useState, useEffect, ChangeEvent, InputHTMLAttributes } from 'react';
import { ClientOnly } from './client-only';

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SafeRadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  options: RadioOption[];
  onChange?: (value: string, e: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  error?: string;
  hint?: string;
  inline?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  optionClassName?: string;
  errorClassName?: string;
  hintClassName?: string;
}

/**
 * A hydration-safe radio button component that handles SSR and client-side rendering properly
 */
export function SafeRadio({
  id,
  name,
  value = '',
  options,
  onChange,
  label,
  error,
  hint,
  disabled,
  required,
  inline = false,
  className,
  containerClassName,
  labelClassName,
  optionClassName,
  errorClassName,
  hintClassName,
  ...rest
}: SafeRadioProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  
  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    setSelectedValue(value);
  }, [value]);
  
  // Handle radio change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSelectedValue(newValue);
    onChange?.(newValue, e);
  };
  
  // Simple loading state for SSR
  const RadioSkeleton = () => (
    <div className={containerClassName}>
      {label && (
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
      )}
      <div className={`${inline ? 'flex space-x-4' : 'space-y-2'}`}>
        {options.map((_, index) => (
          <div key={index} className="flex items-center">
            <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 ml-2"></div>
          </div>
        ))}
      </div>
      {hint && (
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mt-1"></div>
      )}
    </div>
  );
  
  return (
    <ClientOnly fallback={<RadioSkeleton />}>
      <div className={containerClassName}>
        {label && (
          <label 
            className={`block mb-2 text-sm font-medium ${error ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'} ${labelClassName || ''}`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className={`${inline ? 'flex flex-wrap gap-4' : 'space-y-2'}`}>
          {options.map((option, index) => (
            <div key={index} className={`flex items-center ${optionClassName || ''}`}>
              <input
                id={`${id || name}-${index}`}
                name={name}
                type="radio"
                value={option.value}
                checked={selectedValue === option.value}
                onChange={handleChange}
                disabled={disabled || option.disabled}
                required={required}
                className={`h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 ${disabled || option.disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className || ''}`}
                suppressHydrationWarning
                {...rest}
              />
              <label 
                htmlFor={`${id || name}-${index}`} 
                className={`ml-2 block text-sm ${error ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'} ${disabled || option.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
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
