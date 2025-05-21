'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { ClientOnly } from './client-only';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
}

interface SafeBreadcrumbProps {
  items: BreadcrumbItem[];
  homeHref?: string;
  showHomeIcon?: boolean;
  separator?: ReactNode;
  maxItems?: number;
  className?: string;
  itemClassName?: string;
  activeItemClassName?: string;
  separatorClassName?: string;
  homeIconClassName?: string;
  collapsedItemsLabel?: string;
}

/**
 * A hydration-safe breadcrumb component that handles SSR and client-side rendering properly
 */
export function SafeBreadcrumb({
  items,
  homeHref = '/',
  showHomeIcon = true,
  separator = <ChevronRight className="h-4 w-4" />,
  maxItems = 0,
  className,
  itemClassName,
  activeItemClassName,
  separatorClassName,
  homeIconClassName,
  collapsedItemsLabel = '...',
}: SafeBreadcrumbProps) {
  const { t, isClient } = useLanguage();
  const [mounted, setMounted] = useState(false);
  
  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Get visible items based on maxItems
  const getVisibleItems = () => {
    if (!maxItems || items.length <= maxItems) {
      return items;
    }
    
    // Always show first and last items
    const firstItem = items[0];
    const lastItems = items.slice(-Math.floor(maxItems / 2));
    
    // Create collapsed item
    const collapsedItem: BreadcrumbItem = {
      label: collapsedItemsLabel,
    };
    
    return [firstItem, collapsedItem, ...lastItems];
  };
  
  // Simple loading state for SSR
  const BreadcrumbSkeleton = () => (
    <nav className={`flex ${className || ''}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full"></li>
        <li className="h-4 w-4 text-gray-400"></li>
        <li className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded"></li>
        <li className="h-4 w-4 text-gray-400"></li>
        <li className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded"></li>
      </ol>
    </nav>
  );
  
  // If not mounted or not client, show skeleton
  if (!mounted || !isClient) {
    return <BreadcrumbSkeleton />;
  }
  
  const visibleItems = getVisibleItems();
  const lastIndex = visibleItems.length - 1;
  
  return (
    <ClientOnly fallback={<BreadcrumbSkeleton />}>
      <nav className={`flex ${className || ''}`} aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          {/* Home item */}
          {showHomeIcon && (
            <>
              <li>
                <Link
                  href={homeHref}
                  className={`text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 ${homeIconClassName || ''}`}
                  aria-label={t('common.home')}
                >
                  <Home className="h-5 w-5" />
                </Link>
              </li>
              <li className={`flex items-center text-gray-400 ${separatorClassName || ''}`} aria-hidden="true">
                {separator}
              </li>
            </>
          )}
          
          {/* Breadcrumb items */}
          {visibleItems.map((item, index) => (
            <React.Fragment key={index}>
              <li>
                {item.href && index !== lastIndex ? (
                  <Link
                    href={item.href}
                    className={`text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center ${itemClassName || ''}`}
                  >
                    {item.icon && <span className="mr-1">{item.icon}</span>}
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={`${
                      index === lastIndex
                        ? `text-gray-900 dark:text-white font-medium ${activeItemClassName || ''}`
                        : 'text-gray-500 dark:text-gray-400'
                    } flex items-center ${itemClassName || ''}`}
                    aria-current={index === lastIndex ? 'page' : undefined}
                  >
                    {item.icon && <span className="mr-1">{item.icon}</span>}
                    {item.label}
                  </span>
                )}
              </li>
              
              {/* Separator */}
              {index !== lastIndex && (
                <li className={`flex items-center text-gray-400 ${separatorClassName || ''}`} aria-hidden="true">
                  {separator}
                </li>
              )}
            </React.Fragment>
          ))}
        </ol>
      </nav>
    </ClientOnly>
  );
}
