'use client';

import React, { useState, useEffect, ReactNode, useRef } from 'react';
import { ClientOnly } from './client-only';
import { X } from 'lucide-react';

interface SafeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
}

/**
 * A hydration-safe modal component that handles SSR and client-side rendering properly
 */
export function SafeModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOutsideClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className,
  overlayClassName,
  contentClassName,
  headerClassName,
  bodyClassName,
  footerClassName,
}: SafeModalProps) {
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full',
  };
  
  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    
    // Add event listener for escape key
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = ''; // Restore scrolling when modal is closed
    };
  }, [isOpen, closeOnEscape, onClose]);
  
  // Handle outside click
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOutsideClick && modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };
  
  // If not mounted or not open, don't render anything
  if (!mounted || !isOpen) {
    return null;
  }
  
  return (
    <ClientOnly>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 ${overlayClassName || ''}`}
        onClick={handleOutsideClick}
        aria-modal="true"
        role="dialog"
        aria-hidden={!isOpen}
      >
        <div
          ref={modalRef}
          className={`w-full ${sizeClasses[size]} bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${className || ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal header */}
          {(title || showCloseButton) && (
            <div className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center ${headerClassName || ''}`}>
              {title && (
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {title}
                </h3>
              )}
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          )}
          
          {/* Modal body */}
          <div className={`px-6 py-4 ${bodyClassName || ''}`}>
            {children}
          </div>
          
          {/* Modal footer */}
          {footer && (
            <div className={`px-6 py-4 border-t border-gray-200 dark:border-gray-700 ${footerClassName || ''}`}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </ClientOnly>
  );
}
