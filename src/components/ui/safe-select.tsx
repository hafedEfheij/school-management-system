'use client';

import React, { useState, useEffect, ChangeEvent, SelectHTMLAttributes } from 'react';
import { ClientOnly } from './client-only';

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface OptionGroup {
  label: string;
  options: Option[];
}

interface SafeSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: Option[] | OptionGroup[];
  onChange?: (value: string, e: ChangeEvent<HTMLSelectElement>) => void;
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  hintClassName?: string;
}

/**
 * A hydration-safe select component that handles SSR and client-side rendering properly
 */
export function SafeSelect({
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
  className,
  containerClassName,
  labelClassName,
  errorClassName,
  hintClassName,
  ...rest
}: SafeSelectProps) {
  const [mounted, setMounted] = useState(false);
  const [selectValue, setSelectValue] = useState(value);
  
  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    setSelectValue(value);
  }, [value]);
  
  // Handle select change
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setSelectValue(newValue);
    onChange?.(newValue, e);
  };
  
  // Check if options is an array of OptionGroup
  const isOptionGroup = (options: Option[] | OptionGroup[]): options is OptionGroup[] => {
    return options.length > 0 && 'options' in options[0];
  };
  
  // Simple loading state for SSR
  const SelectSkeleton = () => (
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
    <ClientOnly fallback={<SelectSkeleton />}>
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
        <select
          id={id}
          name={name}
          value={selectValue}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${disabled ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : 'bg-white dark:bg-gray-900'} ${className || ''}`}
          suppressHydrationWarning
          {...rest}
        >
          {isOptionGroup(options) ? (
            // Render option groups
            options.map((group, groupIndex) => (
              <optgroup key={groupIndex} label={group.label}>
                {group.options.map((option, optionIndex) => (
                  <option 
                    key={`${groupIndex}-${optionIndex}`} 
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </option>
                ))}
              </optgroup>
            ))
          ) : (
            // Render flat options
            options.map((option, index) => (
              <option 
                key={index} 
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))
          )}
        </select>
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
