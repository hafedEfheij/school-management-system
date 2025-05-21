'use client';

import React, { useState, useEffect } from 'react';
import { ClientOnly } from './client-only';

type ProgressVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
type ProgressSize = 'sm' | 'md' | 'lg';

interface SafeProgressProps {
  value: number;
  max?: number;
  variant?: ProgressVariant;
  size?: ProgressSize;
  showValue?: boolean;
  valueFormat?: (value: number, max: number) => string;
  animated?: boolean;
  striped?: boolean;
  className?: string;
  barClassName?: string;
  valueClassName?: string;
  label?: string;
  labelClassName?: string;
}

/**
 * A hydration-safe progress bar component that handles SSR and client-side rendering properly
 */
export function SafeProgress({
  value,
  max = 100,
  variant = 'primary',
  size = 'md',
  showValue = false,
  valueFormat,
  animated = false,
  striped = false,
  className,
  barClassName,
  valueClassName,
  label,
  labelClassName,
}: SafeProgressProps) {
  const [mounted, setMounted] = useState(false);
  
  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Ensure value is within bounds
  const normalizedValue = Math.max(0, Math.min(value, max));
  const percentage = (normalizedValue / max) * 100;
  
  // Format value
  const formattedValue = valueFormat
    ? valueFormat(normalizedValue, max)
    : `${Math.round(percentage)}%`;
  
  // Get variant classes
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 dark:bg-blue-500';
      case 'secondary':
        return 'bg-purple-600 dark:bg-purple-500';
      case 'success':
        return 'bg-green-600 dark:bg-green-500';
      case 'warning':
        return 'bg-yellow-600 dark:bg-yellow-500';
      case 'danger':
        return 'bg-red-600 dark:bg-red-500';
      case 'info':
        return 'bg-sky-600 dark:bg-sky-500';
      default:
        return 'bg-gray-600 dark:bg-gray-500';
    }
  };
  
  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-1.5';
      case 'lg':
        return 'h-4';
      default:
        return 'h-2.5';
    }
  };
  
  // Get animation classes
  const getAnimationClasses = () => {
    if (animated) {
      return 'animate-pulse';
    }
    return '';
  };
  
  // Get striped classes
  const getStripedClasses = () => {
    if (striped) {
      return 'bg-stripes';
    }
    return '';
  };
  
  // Simple loading state for SSR
  const ProgressSkeleton = () => (
    <div className={`w-full ${className || ''}`}>
      {label && (
        <div className="mb-1 h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
      )}
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full ${getSizeClasses()}`}>
        <div className="h-full w-1/2 bg-gray-400 dark:bg-gray-600 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
  
  // If not mounted, show skeleton
  if (!mounted) {
    return <ProgressSkeleton />;
  }
  
  return (
    <ClientOnly fallback={<ProgressSkeleton />}>
      <div className={`w-full ${className || ''}`}>
        {/* Label and value */}
        {(label || (showValue && mounted)) && (
          <div className="flex justify-between mb-1">
            {label && (
              <span className={`text-sm font-medium text-gray-700 dark:text-gray-300 ${labelClassName || ''}`}>
                {label}
              </span>
            )}
            {showValue && mounted && (
              <span className={`text-sm font-medium text-gray-700 dark:text-gray-300 ${valueClassName || ''}`}>
                {formattedValue}
              </span>
            )}
          </div>
        )}
        
        {/* Progress bar */}
        <div
          className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${getSizeClasses()}`}
          role="progressbar"
          aria-valuenow={normalizedValue}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label}
        >
          <div
            className={`h-full rounded-full transition-all duration-300 ease-in-out ${getVariantClasses()} ${getAnimationClasses()} ${getStripedClasses()} ${barClassName || ''}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </ClientOnly>
  );
}
