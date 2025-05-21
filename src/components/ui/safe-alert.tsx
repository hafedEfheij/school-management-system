'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { ClientOnly } from './client-only';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface SafeAlertProps {
  children: ReactNode;
  variant?: AlertVariant;
  title?: string;
  icon?: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  contentClassName?: string;
}

/**
 * A hydration-safe alert component that handles SSR and client-side rendering properly
 */
export function SafeAlert({
  children,
  variant = 'info',
  title,
  icon,
  dismissible = false,
  onDismiss,
  className,
  iconClassName,
  titleClassName,
  contentClassName,
}: SafeAlertProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  
  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Handle dismiss
  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };
  
  // Get variant classes
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'warning':
        return 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'error':
        return 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'info':
      default:
        return 'bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    }
  };
  
  // Get default icon
  const getDefaultIcon = () => {
    switch (variant) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500 dark:text-blue-400" />;
    }
  };
  
  // Simple loading state for SSR
  const AlertSkeleton = () => (
    <div className="w-full h-16 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
  );
  
  // If not mounted or not visible, show skeleton or nothing
  if (!mounted) {
    return <AlertSkeleton />;
  }
  
  if (!visible) {
    return null;
  }
  
  return (
    <ClientOnly fallback={<AlertSkeleton />}>
      <div
        className={`p-4 border rounded-md ${getVariantClasses()} ${className || ''}`}
        role="alert"
      >
        <div className="flex">
          {/* Icon */}
          {(icon || getDefaultIcon()) && (
            <div className={`flex-shrink-0 ${iconClassName || ''}`}>
              {icon || getDefaultIcon()}
            </div>
          )}
          
          {/* Content */}
          <div className={`ml-3 ${contentClassName || ''}`}>
            {/* Title */}
            {title && (
              <h3 className={`text-sm font-medium ${titleClassName || ''}`}>
                {title}
              </h3>
            )}
            
            {/* Message */}
            <div className={`text-sm ${title ? 'mt-2' : ''}`}>
              {children}
            </div>
          </div>
          
          {/* Dismiss button */}
          {dismissible && (
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    variant === 'success'
                      ? 'text-green-500 hover:bg-green-100 focus:ring-green-600 dark:hover:bg-green-900/30'
                      : variant === 'warning'
                      ? 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600 dark:hover:bg-yellow-900/30'
                      : variant === 'error'
                      ? 'text-red-500 hover:bg-red-100 focus:ring-red-600 dark:hover:bg-red-900/30'
                      : 'text-blue-500 hover:bg-blue-100 focus:ring-blue-600 dark:hover:bg-blue-900/30'
                  }`}
                  onClick={handleDismiss}
                >
                  <span className="sr-only">Dismiss</span>
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ClientOnly>
  );
}
