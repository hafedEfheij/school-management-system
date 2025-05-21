'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { ClientOnly } from './client-only';
import { X } from 'lucide-react';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';

interface SafeBadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
  outline?: boolean;
  icon?: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  iconClassName?: string;
}

/**
 * A hydration-safe badge component that handles SSR and client-side rendering properly
 */
export function SafeBadge({
  children,
  variant = 'default',
  size = 'md',
  rounded = false,
  outline = false,
  icon,
  dismissible = false,
  onDismiss,
  className,
  iconClassName,
}: SafeBadgeProps) {
  const [mounted, setMounted] = useState(false);
  
  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Get variant classes
  const getVariantClasses = () => {
    if (outline) {
      switch (variant) {
        case 'primary':
          return 'bg-transparent text-blue-600 border border-blue-600 dark:text-blue-400 dark:border-blue-400';
        case 'secondary':
          return 'bg-transparent text-purple-600 border border-purple-600 dark:text-purple-400 dark:border-purple-400';
        case 'success':
          return 'bg-transparent text-green-600 border border-green-600 dark:text-green-400 dark:border-green-400';
        case 'warning':
          return 'bg-transparent text-yellow-600 border border-yellow-600 dark:text-yellow-400 dark:border-yellow-400';
        case 'danger':
          return 'bg-transparent text-red-600 border border-red-600 dark:text-red-400 dark:border-red-400';
        case 'info':
          return 'bg-transparent text-sky-600 border border-sky-600 dark:text-sky-400 dark:border-sky-400';
        default:
          return 'bg-transparent text-gray-600 border border-gray-600 dark:text-gray-400 dark:border-gray-400';
      }
    } else {
      switch (variant) {
        case 'primary':
          return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        case 'secondary':
          return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
        case 'success':
          return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'warning':
          return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case 'danger':
          return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        case 'info':
          return 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300';
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      }
    }
  };
  
  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-0.5';
      case 'lg':
        return 'text-sm px-3 py-1.5';
      default:
        return 'text-xs px-2.5 py-1';
    }
  };
  
  // Simple loading state for SSR
  const BadgeSkeleton = () => (
    <div
      className={`inline-flex items-center ${
        rounded ? 'rounded-full' : 'rounded'
      } ${getSizeClasses()} bg-gray-200 dark:bg-gray-700`}
      style={{ width: '4rem' }}
    ></div>
  );
  
  // If not mounted, show skeleton
  if (!mounted) {
    return <BadgeSkeleton />;
  }
  
  return (
    <ClientOnly fallback={<BadgeSkeleton />}>
      <span
        className={`inline-flex items-center ${
          rounded ? 'rounded-full' : 'rounded'
        } ${getSizeClasses()} ${getVariantClasses()} ${className || ''}`}
      >
        {icon && (
          <span className={`mr-1 ${iconClassName || ''}`}>
            {icon}
          </span>
        )}
        {children}
        {dismissible && (
          <button
            type="button"
            className={`ml-1 -mr-1 h-4 w-4 rounded-full inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-1 ${
              outline
                ? 'focus:ring-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                : 'focus:ring-white hover:bg-gray-200/50 dark:hover:bg-gray-600/50'
            }`}
            onClick={onDismiss}
          >
            <span className="sr-only">Dismiss</span>
            <X className="h-3 w-3" />
          </button>
        )}
      </span>
    </ClientOnly>
  );
}
