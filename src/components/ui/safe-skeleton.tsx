'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { ClientOnly } from './client-only';

type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded' | 'avatar' | 'card' | 'list' | 'table';

interface SafeSkeletonProps {
  variant?: SkeletonVariant;
  width?: number | string;
  height?: number | string;
  count?: number;
  className?: string;
  animated?: boolean;
  children?: ReactNode;
  ready?: boolean;
}

/**
 * A hydration-safe skeleton loader component that handles SSR and client-side rendering properly
 */
export function SafeSkeleton({
  variant = 'text',
  width,
  height,
  count = 1,
  className,
  animated = true,
  children,
  ready = false,
}: SafeSkeletonProps) {
  const [mounted, setMounted] = useState(false);
  
  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // If ready and mounted, show children
  if (ready && mounted && children) {
    return <>{children}</>;
  }
  
  // Get variant classes
  const getVariantClasses = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
        return 'rounded-none';
      case 'rounded':
        return 'rounded-md';
      case 'avatar':
        return 'rounded-full';
      case 'card':
        return 'rounded-lg';
      case 'list':
        return 'rounded-md';
      case 'table':
        return 'rounded-md';
      default:
        return 'rounded';
    }
  };
  
  // Get animation classes
  const getAnimationClasses = () => {
    return animated ? 'animate-pulse' : '';
  };
  
  // Get default dimensions based on variant
  const getDefaultDimensions = () => {
    switch (variant) {
      case 'text':
        return { width: width || '100%', height: height || '1rem' };
      case 'circular':
        return { width: width || '2.5rem', height: height || '2.5rem' };
      case 'rectangular':
        return { width: width || '100%', height: height || '8rem' };
      case 'rounded':
        return { width: width || '100%', height: height || '8rem' };
      case 'avatar':
        return { width: width || '3rem', height: height || '3rem' };
      case 'card':
        return { width: width || '100%', height: height || '12rem' };
      case 'list':
        return { width: width || '100%', height: height || '3rem' };
      case 'table':
        return { width: width || '100%', height: height || '15rem' };
      default:
        return { width: width || '100%', height: height || '1rem' };
    }
  };
  
  // Render skeleton item
  const renderSkeletonItem = (index: number) => {
    const dimensions = getDefaultDimensions();
    
    // Special variants
    if (variant === 'card') {
      return (
        <div
          key={index}
          className={`${getVariantClasses()} overflow-hidden bg-gray-200 dark:bg-gray-700 ${getAnimationClasses()} ${className || ''}`}
          style={{ width: dimensions.width, height: dimensions.height }}
        >
          <div className="h-1/2 bg-gray-300 dark:bg-gray-600"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
          </div>
        </div>
      );
    }
    
    if (variant === 'list') {
      return (
        <div
          key={index}
          className={`flex items-center space-x-3 ${getVariantClasses()} bg-gray-200 dark:bg-gray-700 p-3 ${getAnimationClasses()} ${className || ''}`}
          style={{ width: dimensions.width, height: dimensions.height }}
        >
          <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          </div>
        </div>
      );
    }
    
    if (variant === 'table') {
      return (
        <div
          key={index}
          className={`${getVariantClasses()} overflow-hidden bg-gray-200 dark:bg-gray-700 ${getAnimationClasses()} ${className || ''}`}
          style={{ width: dimensions.width, height: dimensions.height }}
        >
          <div className="h-10 bg-gray-300 dark:bg-gray-600"></div>
          <div className="p-2 space-y-2">
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <div key={rowIndex} className="flex space-x-2">
                {Array.from({ length: 4 }).map((_, colIndex) => (
                  <div
                    key={colIndex}
                    className="h-6 bg-gray-300 dark:bg-gray-600 rounded"
                    style={{ width: `${100 / 4}%` }}
                  ></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    // Default skeleton
    return (
      <div
        key={index}
        className={`${getVariantClasses()} bg-gray-200 dark:bg-gray-700 ${getAnimationClasses()} ${className || ''}`}
        style={{ width: dimensions.width, height: dimensions.height }}
      ></div>
    );
  };
  
  // Render multiple skeleton items
  const renderSkeletonItems = () => {
    return Array.from({ length: count }).map((_, index) => renderSkeletonItem(index));
  };
  
  return <ClientOnly>{renderSkeletonItems()}</ClientOnly>;
}
