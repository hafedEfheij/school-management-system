'use client';

import React, { useState, useEffect } from 'react';
import { ClientOnly } from './client-only';
import { Star } from 'lucide-react';

interface SafeRatingProps {
  value?: number;
  defaultValue?: number;
  max?: number;
  precision?: 0.5 | 1;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
  disabled?: boolean;
  onChange?: (value: number) => void;
  onHoverChange?: (value: number | null) => void;
  emptyIcon?: React.ReactNode;
  filledIcon?: React.ReactNode;
  halfFilledIcon?: React.ReactNode;
  className?: string;
  itemClassName?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  hoverClassName?: string;
  disabledClassName?: string;
  label?: string;
  labelClassName?: string;
  showValue?: boolean;
  valueClassName?: string;
}

/**
 * A hydration-safe rating component that handles SSR and client-side rendering properly
 */
export function SafeRating({
  value: controlledValue,
  defaultValue = 0,
  max = 5,
  precision = 1,
  size = 'md',
  readOnly = false,
  disabled = false,
  onChange,
  onHoverChange,
  emptyIcon,
  filledIcon,
  halfFilledIcon,
  className,
  itemClassName,
  activeClassName,
  inactiveClassName,
  hoverClassName,
  disabledClassName,
  label,
  labelClassName,
  showValue = false,
  valueClassName,
}: SafeRatingProps) {
  const [mounted, setMounted] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  
  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    setValue(controlledValue !== undefined ? controlledValue : defaultValue);
  }, [controlledValue, defaultValue]);
  
  // Update value when controlled value changes
  useEffect(() => {
    if (controlledValue !== undefined && controlledValue !== value) {
      setValue(controlledValue);
    }
  }, [controlledValue, value]);
  
  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-4 w-4';
      case 'lg':
        return 'h-8 w-8';
      default:
        return 'h-6 w-6';
    }
  };
  
  // Handle mouse enter
  const handleMouseEnter = (newValue: number) => {
    if (readOnly || disabled) return;
    
    setHoverValue(newValue);
    onHoverChange?.(newValue);
  };
  
  // Handle mouse leave
  const handleMouseLeave = () => {
    if (readOnly || disabled) return;
    
    setHoverValue(null);
    onHoverChange?.(null);
  };
  
  // Handle click
  const handleClick = (newValue: number) => {
    if (readOnly || disabled) return;
    
    // If clicking on the current value, clear it
    const updatedValue = newValue === value ? 0 : newValue;
    setValue(updatedValue);
    onChange?.(updatedValue);
  };
  
  // Get item value
  const getItemValue = (index: number) => {
    return precision === 0.5 ? (index + 1) - 0.5 : index + 1;
  };
  
  // Check if item is active
  const isItemActive = (itemValue: number) => {
    const ratingValue = hoverValue ?? value;
    
    if (precision === 0.5) {
      return itemValue <= ratingValue;
    }
    
    return Math.ceil(itemValue) <= Math.ceil(ratingValue);
  };
  
  // Check if item is half filled
  const isItemHalfFilled = (itemValue: number) => {
    if (precision !== 0.5) return false;
    
    const ratingValue = hoverValue ?? value;
    const isHalf = Math.ceil(ratingValue) === Math.ceil(itemValue) && Math.floor(ratingValue) !== Math.ceil(ratingValue);
    
    return isHalf;
  };
  
  // Render rating item
  const renderRatingItem = (index: number) => {
    const itemValue = getItemValue(index);
    const isActive = isItemActive(itemValue);
    const isHalf = isItemHalfFilled(itemValue);
    
    // Default icons
    const defaultEmptyIcon = <Star className={`${getSizeClasses()} stroke-current fill-transparent`} />;
    const defaultFilledIcon = <Star className={`${getSizeClasses()} stroke-current fill-current`} />;
    const defaultHalfFilledIcon = (
      <div className="relative">
        <div className="absolute overflow-hidden w-1/2">
          <Star className={`${getSizeClasses()} stroke-current fill-current`} />
        </div>
        <Star className={`${getSizeClasses()} stroke-current fill-transparent`} />
      </div>
    );
    
    return (
      <span
        key={index}
        className={`inline-flex cursor-pointer ${
          disabled
            ? `opacity-50 cursor-not-allowed ${disabledClassName || ''}`
            : readOnly
            ? 'cursor-default'
            : ''
        } ${
          isActive
            ? `text-yellow-400 ${activeClassName || ''}`
            : `text-gray-300 dark:text-gray-600 ${inactiveClassName || ''}`
        } ${
          hoverValue !== null && !readOnly && !disabled
            ? hoverClassName || ''
            : ''
        } ${itemClassName || ''}`}
        onMouseEnter={() => handleMouseEnter(itemValue)}
        onClick={() => handleClick(itemValue)}
        role={readOnly ? 'presentation' : 'button'}
        aria-label={`${itemValue} of ${max} stars`}
      >
        {isHalf
          ? halfFilledIcon || defaultHalfFilledIcon
          : isActive
          ? filledIcon || defaultFilledIcon
          : emptyIcon || defaultEmptyIcon}
      </span>
    );
  };
  
  // Simple loading state for SSR
  const RatingSkeleton = () => (
    <div className={`inline-flex ${className || ''}`}>
      {Array.from({ length: max }).map((_, index) => (
        <div key={index} className={`h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full mx-0.5`}></div>
      ))}
    </div>
  );
  
  // If not mounted, show skeleton
  if (!mounted) {
    return <RatingSkeleton />;
  }
  
  return (
    <ClientOnly fallback={<RatingSkeleton />}>
      <div className="inline-flex flex-col">
        {/* Label */}
        {label && (
          <label className={`mb-1 text-sm font-medium text-gray-700 dark:text-gray-300 ${labelClassName || ''}`}>
            {label}
          </label>
        )}
        
        <div className="flex items-center">
          {/* Rating */}
          <div
            className={`inline-flex ${className || ''}`}
            onMouseLeave={handleMouseLeave}
            role="radiogroup"
          >
            {Array.from({ length: max }).map((_, index) => renderRatingItem(index))}
          </div>
          
          {/* Value */}
          {showValue && (
            <span className={`ml-2 text-sm text-gray-500 dark:text-gray-400 ${valueClassName || ''}`}>
              {value} / {max}
            </span>
          )}
        </div>
      </div>
    </ClientOnly>
  );
}
