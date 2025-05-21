'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { ClientOnly } from './client-only';
import Image from 'next/image';
import Link from 'next/link';

interface SafeCardProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  image?: string;
  imageAlt?: string;
  imagePosition?: 'top' | 'bottom' | 'left' | 'right';
  href?: string;
  onClick?: () => void;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  imageClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  bordered?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  loading?: boolean;
}

/**
 * A hydration-safe card component that handles SSR and client-side rendering properly
 */
export function SafeCard({
  title,
  subtitle,
  children,
  footer,
  image,
  imageAlt = 'Card image',
  imagePosition = 'top',
  href,
  onClick,
  className,
  headerClassName,
  bodyClassName,
  footerClassName,
  imageClassName,
  titleClassName,
  subtitleClassName,
  bordered = true,
  hoverable = false,
  compact = false,
  loading = false,
}: SafeCardProps) {
  const [mounted, setMounted] = useState(false);
  
  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Get card classes
  const getCardClasses = () => {
    return [
      'overflow-hidden bg-white dark:bg-gray-800 rounded-lg',
      bordered ? 'border border-gray-200 dark:border-gray-700' : '',
      hoverable ? 'transition-shadow hover:shadow-lg' : 'shadow',
      href || onClick ? 'cursor-pointer' : '',
      className || '',
    ].filter(Boolean).join(' ');
  };
  
  // Get image position classes
  const getImagePositionClasses = () => {
    switch (imagePosition) {
      case 'left':
        return 'md:flex';
      case 'right':
        return 'md:flex md:flex-row-reverse';
      default:
        return '';
    }
  };
  
  // Get image classes
  const getImageClasses = () => {
    switch (imagePosition) {
      case 'left':
      case 'right':
        return 'md:w-1/3 h-48 md:h-auto object-cover';
      default:
        return 'w-full h-48 object-cover';
    }
  };
  
  // Get padding classes
  const getPaddingClasses = () => {
    return compact ? 'p-3' : 'p-5';
  };
  
  // Simple loading state for SSR
  const CardSkeleton = () => (
    <div className={`${getCardClasses()} ${getImagePositionClasses()} animate-pulse`}>
      {(imagePosition === 'top' || imagePosition === 'left') && (
        <div className={`bg-gray-300 dark:bg-gray-600 ${getImageClasses()}`}></div>
      )}
      <div className={`${getPaddingClasses()} flex-1`}>
        <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-3"></div>
        {subtitle && (
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-4"></div>
        )}
        <div className="space-y-2">
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
        </div>
        {footer && (
          <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-full mt-4"></div>
        )}
      </div>
      {(imagePosition === 'bottom' || imagePosition === 'right') && (
        <div className={`bg-gray-300 dark:bg-gray-600 ${getImageClasses()}`}></div>
      )}
    </div>
  );
  
  // If not mounted or loading, show skeleton
  if (!mounted || loading) {
    return <CardSkeleton />;
  }
  
  // Card content
  const cardContent = (
    <div className={`${getCardClasses()} ${getImagePositionClasses()}`}>
      {/* Card image */}
      {image && (imagePosition === 'top' || imagePosition === 'left') && (
        <div className={`${imageClassName || ''}`}>
          <Image
            src={image}
            alt={imageAlt}
            width={500}
            height={300}
            className={getImageClasses()}
          />
        </div>
      )}
      
      {/* Card content */}
      <div className="flex-1">
        {/* Card header */}
        {(title || subtitle) && (
          <div className={`${getPaddingClasses()} ${headerClassName || ''}`}>
            {title && (
              <h3 className={`text-lg font-medium text-gray-900 dark:text-white ${titleClassName || ''}`}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p className={`mt-1 text-sm text-gray-500 dark:text-gray-400 ${subtitleClassName || ''}`}>
                {subtitle}
              </p>
            )}
          </div>
        )}
        
        {/* Card body */}
        {children && (
          <div className={`${getPaddingClasses()} ${(title || subtitle) ? 'pt-0' : ''} ${bodyClassName || ''}`}>
            {children}
          </div>
        )}
        
        {/* Card footer */}
        {footer && (
          <div className={`${getPaddingClasses()} border-t border-gray-200 dark:border-gray-700 ${footerClassName || ''}`}>
            {footer}
          </div>
        )}
      </div>
      
      {/* Card image (bottom or right) */}
      {image && (imagePosition === 'bottom' || imagePosition === 'right') && (
        <div className={`${imageClassName || ''}`}>
          <Image
            src={image}
            alt={imageAlt}
            width={500}
            height={300}
            className={getImageClasses()}
          />
        </div>
      )}
    </div>
  );
  
  // Wrap with link if href is provided
  if (href) {
    return (
      <ClientOnly fallback={<CardSkeleton />}>
        <Link href={href} className="block">
          {cardContent}
        </Link>
      </ClientOnly>
    );
  }
  
  // Wrap with button if onClick is provided
  if (onClick) {
    return (
      <ClientOnly fallback={<CardSkeleton />}>
        <button
          type="button"
          onClick={onClick}
          className="w-full text-left"
        >
          {cardContent}
        </button>
      </ClientOnly>
    );
  }
  
  // Default rendering
  return (
    <ClientOnly fallback={<CardSkeleton />}>
      {cardContent}
    </ClientOnly>
  );
}
