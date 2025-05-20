'use client';

import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';

interface SafeImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
}

/**
 * A hydration-safe Image component that handles SSR and client-side rendering properly
 * with fallback for failed image loads
 */
export function SafeImage({
  src,
  alt,
  width,
  height,
  fallbackSrc = '/placeholder.svg',
  className,
  ...props
}: SafeImageProps) {
  const [mounted, setMounted] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [error, setError] = useState(false);

  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    // Set the image source after mounting to avoid hydration mismatch
    setImgSrc(typeof src === 'string' ? src : '');
  }, [src]);

  // Handle image load error
  const handleError = () => {
    setError(true);
    setImgSrc(fallbackSrc);
  };

  // Return a placeholder during SSR to avoid hydration mismatches
  if (!mounted) {
    return (
      <div 
        style={{ 
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
        }}
        className={`bg-gray-200 dark:bg-gray-800 ${className || ''}`}
        aria-label={alt}
        role="img"
      />
    );
  }

  return (
    <Image
      src={error ? fallbackSrc : (imgSrc || fallbackSrc)}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      suppressHydrationWarning
      {...props}
    />
  );
}
