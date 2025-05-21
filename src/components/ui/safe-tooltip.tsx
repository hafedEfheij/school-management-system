'use client';

import React, { useState, useEffect, ReactNode, useRef } from 'react';
import { ClientOnly } from './client-only';

type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

interface SafeTooltipProps {
  children: ReactNode;
  content: ReactNode;
  position?: TooltipPosition;
  delay?: number;
  className?: string;
  tooltipClassName?: string;
  arrowClassName?: string;
  disabled?: boolean;
}

/**
 * A hydration-safe tooltip component that handles SSR and client-side rendering properly
 */
export function SafeTooltip({
  children,
  content,
  position = 'top',
  delay = 300,
  className,
  tooltipClassName,
  arrowClassName,
  disabled = false,
}: SafeTooltipProps) {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    
    // Cleanup timer on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  
  // Calculate tooltip position
  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;
    
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    const scrollX = window.scrollX || document.documentElement.scrollLeft;
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    
    let x = 0;
    let y = 0;
    
    switch (position) {
      case 'top':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2 + scrollX;
        y = triggerRect.top - tooltipRect.height - 10 + scrollY;
        break;
      case 'right':
        x = triggerRect.right + 10 + scrollX;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2 + scrollY;
        break;
      case 'bottom':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2 + scrollX;
        y = triggerRect.bottom + 10 + scrollY;
        break;
      case 'left':
        x = triggerRect.left - tooltipRect.width - 10 + scrollX;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2 + scrollY;
        break;
    }
    
    // Ensure tooltip stays within viewport
    const padding = 10;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Adjust horizontal position
    if (x < padding) {
      x = padding;
    } else if (x + tooltipRect.width > viewportWidth - padding) {
      x = viewportWidth - tooltipRect.width - padding;
    }
    
    // Adjust vertical position
    if (y < padding) {
      y = padding;
    } else if (y + tooltipRect.height > viewportHeight - padding) {
      y = viewportHeight - tooltipRect.height - padding;
    }
    
    setCoords({ x, y });
  };
  
  // Show tooltip
  const showTooltip = () => {
    if (disabled) return;
    
    timerRef.current = setTimeout(() => {
      setIsVisible(true);
      // Calculate position after tooltip is visible
      setTimeout(calculatePosition, 0);
    }, delay);
  };
  
  // Hide tooltip
  const hideTooltip = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsVisible(false);
  };
  
  // Update position on window resize
  useEffect(() => {
    if (!isVisible) return;
    
    const handleResize = () => {
      calculatePosition();
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [isVisible]);
  
  // Get arrow position class
  const getArrowPositionClass = () => {
    switch (position) {
      case 'top':
        return 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full border-t-gray-800 dark:border-t-gray-700 border-l-transparent border-r-transparent border-b-transparent';
      case 'right':
        return 'left-0 top-1/2 transform -translate-y-1/2 -translate-x-full border-r-gray-800 dark:border-r-gray-700 border-t-transparent border-b-transparent border-l-transparent';
      case 'bottom':
        return 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-full border-b-gray-800 dark:border-b-gray-700 border-l-transparent border-r-transparent border-t-transparent';
      case 'left':
        return 'right-0 top-1/2 transform -translate-y-1/2 translate-x-full border-l-gray-800 dark:border-l-gray-700 border-t-transparent border-b-transparent border-r-transparent';
    }
  };
  
  // If not mounted, just render children
  if (!mounted) {
    return <>{children}</>;
  }
  
  return (
    <ClientOnly>
      <div
        ref={triggerRef}
        className={`inline-block ${className || ''}`}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
        
        {isVisible && (
          <div
            ref={tooltipRef}
            className="fixed z-50 pointer-events-none"
            style={{ left: `${coords.x}px`, top: `${coords.y}px` }}
          >
            <div
              className={`relative px-3 py-2 text-sm text-white bg-gray-800 dark:bg-gray-700 rounded shadow-lg ${tooltipClassName || ''}`}
            >
              {content}
              <div
                className={`absolute w-0 h-0 border-4 ${getArrowPositionClass()} ${arrowClassName || ''}`}
              />
            </div>
          </div>
        )}
      </div>
    </ClientOnly>
  );
}
