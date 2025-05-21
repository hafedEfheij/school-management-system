'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ClientOnly } from './client-only';

interface SafeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  disabled?: boolean;
  showValue?: boolean;
  valuePrefix?: string;
  valueSuffix?: string;
  className?: string;
  trackClassName?: string;
  progressClassName?: string;
  thumbClassName?: string;
  valueClassName?: string;
  label?: string;
  labelClassName?: string;
  showTicks?: boolean;
  tickCount?: number;
  tickClassName?: string;
  showMinMax?: boolean;
  minMaxClassName?: string;
}

/**
 * A hydration-safe slider component that handles SSR and client-side rendering properly
 */
export function SafeSlider({
  min = 0,
  max = 100,
  step = 1,
  value: controlledValue,
  defaultValue = 0,
  onChange,
  onChangeEnd,
  disabled = false,
  showValue = false,
  valuePrefix = '',
  valueSuffix = '',
  className,
  trackClassName,
  progressClassName,
  thumbClassName,
  valueClassName,
  label,
  labelClassName,
  showTicks = false,
  tickCount = 5,
  tickClassName,
  showMinMax = false,
  minMaxClassName,
}: SafeSliderProps) {
  const [mounted, setMounted] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  
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
  
  // Calculate percentage
  const getPercentage = (value: number) => {
    return ((value - min) / (max - min)) * 100;
  };
  
  // Calculate value from percentage
  const getValueFromPercentage = (percentage: number) => {
    const rawValue = ((percentage / 100) * (max - min)) + min;
    const steppedValue = Math.round(rawValue / step) * step;
    return Math.max(min, Math.min(max, steppedValue));
  };
  
  // Handle mouse down
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    setIsDragging(true);
    updateValueFromPosition(e.clientX);
    
    // Add event listeners for dragging
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  // Handle mouse move
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      updateValueFromPosition(e.clientX);
    }
  };
  
  // Handle mouse up
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      onChangeEnd?.(value);
      
      // Remove event listeners
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
  };
  
  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    setIsDragging(true);
    updateValueFromPosition(e.touches[0].clientX);
  };
  
  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isDragging) {
      updateValueFromPosition(e.touches[0].clientX);
    }
  };
  
  // Handle touch end
  const handleTouchEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      onChangeEnd?.(value);
    }
  };
  
  // Update value from position
  const updateValueFromPosition = (clientX: number) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const percentage = (offsetX / rect.width) * 100;
    const newValue = getValueFromPercentage(percentage);
    
    if (newValue !== value) {
      setValue(newValue);
      onChange?.(newValue);
    }
  };
  
  // Generate ticks
  const generateTicks = () => {
    const ticks = [];
    const interval = (max - min) / (tickCount - 1);
    
    for (let i = 0; i < tickCount; i++) {
      const tickValue = min + (interval * i);
      const percentage = getPercentage(tickValue);
      
      ticks.push(
        <div
          key={i}
          className={`absolute w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600 -translate-x-1/2 ${tickClassName || ''}`}
          style={{ left: `${percentage}%` }}
        />
      );
    }
    
    return ticks;
  };
  
  // Format value
  const formatValue = (value: number) => {
    return `${valuePrefix}${value}${valueSuffix}`;
  };
  
  // Simple loading state for SSR
  const SliderSkeleton = () => (
    <div className={`w-full ${className || ''}`}>
      {label && (
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
      )}
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-full"></div>
    </div>
  );
  
  // If not mounted, show skeleton
  if (!mounted) {
    return <SliderSkeleton />;
  }
  
  return (
    <ClientOnly fallback={<SliderSkeleton />}>
      <div className={`w-full ${className || ''}`}>
        {/* Label and value */}
        {(label || (showValue && mounted)) && (
          <div className="flex justify-between mb-2">
            {label && (
              <label className={`text-sm font-medium text-gray-700 dark:text-gray-300 ${labelClassName || ''}`}>
                {label}
              </label>
            )}
            {showValue && mounted && (
              <span className={`text-sm font-medium text-gray-700 dark:text-gray-300 ${valueClassName || ''}`}>
                {formatValue(value)}
              </span>
            )}
          </div>
        )}
        
        {/* Slider */}
        <div className="relative py-4">
          {/* Track */}
          <div
            ref={sliderRef}
            className={`w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full ${disabled ? 'opacity-50' : ''} ${trackClassName || ''}`}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Progress */}
            <div
              className={`absolute h-full bg-blue-500 dark:bg-blue-600 rounded-full ${progressClassName || ''}`}
              style={{ width: `${getPercentage(value)}%` }}
            />
            
            {/* Thumb */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-blue-500 dark:border-blue-600 rounded-full shadow ${
                isDragging ? 'scale-110' : ''
              } transition-transform ${disabled ? 'cursor-not-allowed' : 'cursor-grab'} ${thumbClassName || ''}`}
              style={{ left: `${getPercentage(value)}%` }}
            />
            
            {/* Ticks */}
            {showTicks && (
              <div className="absolute w-full top-1/2 -translate-y-1/2">
                {generateTicks()}
              </div>
            )}
          </div>
          
          {/* Min/Max labels */}
          {showMinMax && (
            <div className="flex justify-between mt-2">
              <span className={`text-xs text-gray-500 dark:text-gray-400 ${minMaxClassName || ''}`}>
                {formatValue(min)}
              </span>
              <span className={`text-xs text-gray-500 dark:text-gray-400 ${minMaxClassName || ''}`}>
                {formatValue(max)}
              </span>
            </div>
          )}
        </div>
      </div>
    </ClientOnly>
  );
}
