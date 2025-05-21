'use client';

import React, { useState, useEffect } from 'react';
import { ClientOnly } from './client-only';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SafePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  showFirstLast?: boolean;
  className?: string;
  buttonClassName?: string;
  activeButtonClassName?: string;
  disabledButtonClassName?: string;
}

/**
 * A hydration-safe pagination component that handles SSR and client-side rendering properly
 */
export function SafePagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  className,
  buttonClassName,
  activeButtonClassName,
  disabledButtonClassName,
}: SafePaginationProps) {
  const { t, isClient } = useLanguage();
  const [mounted, setMounted] = useState(false);
  
  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const totalNumbers = siblingCount * 2 + 3; // siblings + current + first + last
    const totalButtons = Math.min(totalNumbers, totalPages);
    
    if (totalPages <= totalButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
    
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;
    
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 1 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, -1, totalPages];
    }
    
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 1 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [1, -2, ...rightRange];
    }
    
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [1, -1, ...middleRange, -2, totalPages];
    }
    
    return [];
  };
  
  // Simple loading state for SSR
  const PaginationSkeleton = () => (
    <div className={`flex items-center justify-center space-x-2 ${className || ''}`}>
      <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  );
  
  // If not mounted or not client, show skeleton
  if (!mounted || !isClient) {
    return <PaginationSkeleton />;
  }
  
  const pageNumbers = getPageNumbers();
  
  return (
    <ClientOnly fallback={<PaginationSkeleton />}>
      <nav className={`flex items-center justify-center ${className || ''}`} aria-label="Pagination">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-2 py-2 rounded-md border ${
            currentPage === 1
              ? `border-gray-300 dark:border-gray-600 text-gray-300 dark:text-gray-600 cursor-not-allowed ${disabledButtonClassName || ''}`
              : `border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 ${buttonClassName || ''}`
          }`}
          aria-label={t('common.previous')}
        >
          <span className="sr-only">{t('common.previous')}</span>
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        
        {/* Page numbers */}
        <div className="hidden sm:flex mx-1">
          {pageNumbers.map((pageNumber, index) => {
            // Render dots
            if (pageNumber === -1 || pageNumber === -2) {
              return (
                <span
                  key={`dots-${index}`}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </span>
              );
            }
            
            // Render page number
            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border ${
                  currentPage === pageNumber
                    ? `z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-200 ${activeButtonClassName || ''}`
                    : `border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 ${buttonClassName || ''}`
                }`}
                aria-current={currentPage === pageNumber ? 'page' : undefined}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>
        
        {/* Mobile pagination indicator */}
        <span className="sm:hidden mx-2 text-sm text-gray-700 dark:text-gray-300">
          {t('common.showing')} {currentPage} {t('common.of')} {totalPages}
        </span>
        
        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center px-2 py-2 rounded-md border ${
            currentPage === totalPages
              ? `border-gray-300 dark:border-gray-600 text-gray-300 dark:text-gray-600 cursor-not-allowed ${disabledButtonClassName || ''}`
              : `border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 ${buttonClassName || ''}`
          }`}
          aria-label={t('common.next')}
        >
          <span className="sr-only">{t('common.next')}</span>
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </nav>
    </ClientOnly>
  );
}
