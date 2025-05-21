'use client';

import React, { useState, useEffect } from 'react';
import { ClientOnly } from './client-only';

interface SafeToggleProps {
  id?: string;
  name?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  onText?: string;
  offText?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
}

/**
 * A hydration-safe toggle switch component that handles SSR and client-side rendering properly
 */
export function SafeToggle({
  id,
  name,
  checked = false,
  onChange,
  label,
  onText = 'On',
  offText = 'Off',
  disabled = false,
  size = 'md',
  className,
  containerClassName,
  labelClassName,
}: SafeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const [isChecked, setIsChecked] = useState(checked);
  
  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    setIsChecked(checked);
  }, [checked]);
  
  // Handle toggle change
  const handleChange = () => {
    if (disabled) return;
    
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    onChange?.(newChecked);
  };
  
  // Size classes
  const sizeClasses = {
    sm: {
      toggle: 'w-8 h-4',
      circle: 'w-3 h-3',
      translateX: 'translate-x-4',
      text: 'text-xs',
    },
    md: {
      toggle: 'w-11 h-6',
      circle: 'w-5 h-5',
      translateX: 'translate-x-5',
      text: 'text-sm',
    },
    lg: {
      toggle: 'w-14 h-7',
      circle: 'w-6 h-6',
      translateX: 'translate-x-7',
      text: 'text-base',
    },
  };
  
  // Simple loading state for SSR
  const ToggleSkeleton = () => (
    <div className={`flex items-center ${containerClassName || ''}`}>
      <div className={`h-6 w-11 bg-gray-200 dark:bg-gray-700 rounded-full`}></div>
      {label && (
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16 ml-2"></div>
      )}
    </div>
  );
  
  return (
    <ClientOnly fallback={<ToggleSkeleton />}>
      <div className={`flex items-center ${containerClassName || ''}`}>
        <button
          type="button"
          id={id}
          aria-pressed={isChecked}
          aria-label={label || (isChecked ? onText : offText)}
          onClick={handleChange}
          className={`relative inline-flex ${sizeClasses[size].toggle} flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isChecked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className || ''}`}
          role="switch"
          tabIndex={0}
          disabled={disabled}
          suppressHydrationWarning
        >
          <span
            className={`pointer-events-none inline-block ${sizeClasses[size].circle} transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isChecked ? sizeClasses[size].translateX : 'translate-x-0'
            }`}
          />
          <span className="sr-only">{isChecked ? onText : offText}</span>
        </button>
        {label && (
          <label
            htmlFor={id}
            className={`ml-2 ${sizeClasses[size].text} text-gray-700 dark:text-gray-300 ${
              disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            } ${labelClassName || ''}`}
            onClick={!disabled ? handleChange : undefined}
          >
            {label}
          </label>
        )}
      </div>
    </ClientOnly>
  );
}
