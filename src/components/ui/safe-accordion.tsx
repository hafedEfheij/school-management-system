'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { ClientOnly } from './client-only';
import { ChevronDown } from 'lucide-react';

interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

interface SafeAccordionProps {
  items: AccordionItem[];
  defaultExpandedIds?: string[];
  allowMultiple?: boolean;
  className?: string;
  itemClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
  iconClassName?: string;
}

/**
 * A hydration-safe accordion component that handles SSR and client-side rendering properly
 */
export function SafeAccordion({
  items,
  defaultExpandedIds = [],
  allowMultiple = false,
  className,
  itemClassName,
  headerClassName,
  contentClassName,
  iconClassName,
}: SafeAccordionProps) {
  const [mounted, setMounted] = useState(false);
  const [expandedIds, setExpandedIds] = useState<string[]>(defaultExpandedIds);
  
  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    setExpandedIds(defaultExpandedIds);
  }, [defaultExpandedIds]);
  
  // Toggle accordion item
  const toggleItem = (id: string) => {
    if (expandedIds.includes(id)) {
      setExpandedIds(expandedIds.filter((itemId) => itemId !== id));
    } else {
      if (allowMultiple) {
        setExpandedIds([...expandedIds, id]);
      } else {
        setExpandedIds([id]);
      }
    }
  };
  
  // Check if item is expanded
  const isExpanded = (id: string) => expandedIds.includes(id);
  
  // Simple loading state for SSR
  const AccordionSkeleton = () => (
    <div className={`w-full ${className || ''}`}>
      {items.map((_, index) => (
        <div
          key={index}
          className={`border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden mb-2 ${itemClassName || ''}`}
        >
          <div className="h-12 bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
          {index === 0 && (
            <div className="p-4">
              <div className="h-20 bg-gray-50 dark:bg-gray-900 animate-pulse"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
  
  // If not mounted, show skeleton
  if (!mounted) {
    return <AccordionSkeleton />;
  }
  
  return (
    <ClientOnly fallback={<AccordionSkeleton />}>
      <div className={`w-full ${className || ''}`}>
        {items.map((item) => (
          <div
            key={item.id}
            className={`border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden mb-2 ${itemClassName || ''}`}
          >
            <button
              type="button"
              onClick={() => !item.disabled && toggleItem(item.id)}
              className={`flex justify-between items-center w-full px-4 py-3 text-left text-sm font-medium ${
                item.disabled
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : isExpanded(item.id)
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              } ${headerClassName || ''}`}
              aria-expanded={isExpanded(item.id)}
              aria-controls={`accordion-content-${item.id}`}
              disabled={item.disabled}
            >
              <span>{item.title}</span>
              <ChevronDown
                className={`h-5 w-5 transition-transform duration-200 ${
                  isExpanded(item.id) ? 'transform rotate-180' : ''
                } ${iconClassName || ''}`}
              />
            </button>
            {isExpanded(item.id) && (
              <div
                id={`accordion-content-${item.id}`}
                className={`px-4 py-3 bg-white dark:bg-gray-900 ${contentClassName || ''}`}
              >
                {item.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </ClientOnly>
  );
}
