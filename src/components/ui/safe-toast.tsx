'use client';

import React, { useState, useEffect, ReactNode, createContext, useContext } from 'react';
import { ClientOnly } from './client-only';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

// Toast types
export type ToastType = 'success' | 'error' | 'info' | 'warning';

// Toast interface
export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  onClose?: () => void;
}

// Toast context
interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  removeAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Toast provider props
interface ToastProviderProps {
  children: ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxToasts?: number;
  autoClose?: boolean;
  defaultDuration?: number;
}

/**
 * A hydration-safe toast provider component that handles SSR and client-side rendering properly
 */
export function ToastProvider({
  children,
  position = 'top-right',
  maxToasts = 5,
  autoClose = true,
  defaultDuration = 5000,
}: ToastProviderProps) {
  const [mounted, setMounted] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Add toast
  const addToast = (toast: Omit<Toast, 'id'>): string => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      id,
      ...toast,
      duration: toast.duration || defaultDuration,
    };
    
    setToasts((prevToasts) => {
      // Limit the number of toasts
      const updatedToasts = [newToast, ...prevToasts].slice(0, maxToasts);
      return updatedToasts;
    });
    
    return id;
  };
  
  // Remove toast
  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };
  
  // Remove all toasts
  const removeAllToasts = () => {
    setToasts([]);
  };
  
  // Auto close toasts
  useEffect(() => {
    if (!autoClose) return;
    
    const timers = toasts.map((toast) => {
      return setTimeout(() => {
        removeToast(toast.id);
        toast.onClose?.();
      }, toast.duration);
    });
    
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [toasts, autoClose]);
  
  // Position classes
  const positionClasses = {
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'top-center': 'top-0 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-0 left-1/2 transform -translate-x-1/2',
  };
  
  // Toast icon
  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };
  
  // Toast background color
  const getToastBgColor = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      default:
        return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };
  
  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, removeAllToasts }}>
      {children}
      
      {/* Toast container */}
      {mounted && (
        <div
          className={`fixed z-50 p-4 space-y-4 pointer-events-none ${positionClasses[position]}`}
          aria-live="polite"
          aria-atomic="true"
        >
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`max-w-sm w-full pointer-events-auto overflow-hidden rounded-lg shadow-lg border ${getToastBgColor(toast.type)} transition-all duration-300 ease-in-out`}
              role="alert"
              aria-labelledby={`toast-${toast.id}-title`}
              aria-describedby={`toast-${toast.id}-description`}
            >
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {getToastIcon(toast.type)}
                  </div>
                  <div className="ml-3 w-0 flex-1">
                    {toast.title && (
                      <p
                        id={`toast-${toast.id}-title`}
                        className="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        {toast.title}
                      </p>
                    )}
                    <p
                      id={`toast-${toast.id}-description`}
                      className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                    >
                      {toast.message}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                      type="button"
                      className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => {
                        removeToast(toast.id);
                        toast.onClose?.();
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

/**
 * Hook to use the toast context
 */
export function useToast() {
  const context = useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
}
