'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { ClientOnly } from './client-only';
import Image from 'next/image';
import { User } from 'lucide-react';

interface SafeAvatarProps {
  src?: string;
  alt?: string;
  fallback?: ReactNode;
  size?: number | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square' | 'rounded';
  status?: 'online' | 'offline' | 'away' | 'busy';
  statusPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
  statusClassName?: string;
  onClick?: () => void;
}

/**
 * A hydration-safe avatar component that handles SSR and client-side rendering properly
 */
export function SafeAvatar({
  src,
  alt = 'Avatar',
  fallback,
  size = 'md',
  shape = 'circle',
  status,
  statusPosition = 'bottom-right',
  className,
  imageClassName,
  fallbackClassName,
  statusClassName,
  onClick,
}: SafeAvatarProps) {
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Reset image error when src changes
  useEffect(() => {
    setImageError(false);
  }, [src]);
  
  // Handle image error
  const handleImageError = () => {
    setImageError(true);
  };
  
  // Get size in pixels
  const getSizeInPixels = () => {
    if (typeof size === 'number') {
      return size;
    }
    
    switch (size) {
      case 'sm':
        return 32;
      case 'md':
        return 40;
      case 'lg':
        return 48;
      case 'xl':
        return 64;
      default:
        return 40;
    }
  };
  
  // Get shape class
  const getShapeClass = () => {
    switch (shape) {
      case 'circle':
        return 'rounded-full';
      case 'square':
        return 'rounded-none';
      case 'rounded':
        return 'rounded-md';
      default:
        return 'rounded-full';
    }
  };
  
  // Get status color class
  const getStatusColorClass = () => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-gray-400';
      case 'away':
        return 'bg-yellow-500';
      case 'busy':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };
  
  // Get status position class
  const getStatusPositionClass = () => {
    switch (statusPosition) {
      case 'top-right':
        return 'top-0 right-0';
      case 'top-left':
        return 'top-0 left-0';
      case 'bottom-right':
        return 'bottom-0 right-0';
      case 'bottom-left':
        return 'bottom-0 left-0';
      default:
        return 'bottom-0 right-0';
    }
  };
  
  // Simple loading state for SSR
  const AvatarSkeleton = () => {
    const pixelSize = getSizeInPixels();
    
    return (
      <div
        className={`bg-gray-200 dark:bg-gray-700 ${getShapeClass()} ${className || ''}`}
        style={{ width: pixelSize, height: pixelSize }}
      ></div>
    );
  };
  
  // If not mounted, show skeleton
  if (!mounted) {
    return <AvatarSkeleton />;
  }
  
  const pixelSize = getSizeInPixels();
  const statusSize = Math.max(pixelSize / 4, 8);
  
  // Render fallback content
  const renderFallback = () => {
    if (fallback) {
      return fallback;
    }
    
    // Default fallback is user icon
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 ${getShapeClass()} ${fallbackClassName || ''}`}
        style={{ width: pixelSize, height: pixelSize }}
      >
        <User size={pixelSize * 0.6} />
      </div>
    );
  };
  
  return (
    <ClientOnly fallback={<AvatarSkeleton />}>
      <div
        className={`relative inline-block ${className || ''}`}
        style={{ width: pixelSize, height: pixelSize }}
        onClick={onClick}
      >
        {src && !imageError ? (
          <Image
            src={src}
            alt={alt}
            width={pixelSize}
            height={pixelSize}
            className={`object-cover ${getShapeClass()} ${imageClassName || ''}`}
            onError={handleImageError}
          />
        ) : (
          renderFallback()
        )}
        
        {/* Status indicator */}
        {status && (
          <span
            className={`absolute block border-2 border-white dark:border-gray-800 ${getStatusColorClass()} ${getStatusPositionClass()} ${getShapeClass() === 'rounded-full' ? 'rounded-full' : 'rounded-full'} ${statusClassName || ''}`}
            style={{
              width: statusSize,
              height: statusSize,
              transform: 'translate(25%, 25%)',
            }}
          ></span>
        )}
      </div>
    </ClientOnly>
  );
}
