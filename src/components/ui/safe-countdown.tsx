'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ClientOnly } from './client-only';

interface TimeUnit {
  value: number;
  label: string;
}

interface SafeCountdownProps {
  targetDate: Date | string | number;
  onComplete?: () => void;
  onTick?: (timeLeft: number) => void;
  renderer?: (props: { days: number; hours: number; minutes: number; seconds: number; completed: boolean }) => React.ReactNode;
  precision?: 'seconds' | 'minutes' | 'hours' | 'days';
  format?: 'full' | 'compact' | 'minimal';
  showZeroUnits?: boolean;
  className?: string;
  unitClassName?: string;
  valueClassName?: string;
  labelClassName?: string;
  separatorClassName?: string;
  completedMessage?: string;
}

/**
 * A hydration-safe countdown timer component that handles SSR and client-side rendering properly
 */
export function SafeCountdown({
  targetDate,
  onComplete,
  onTick,
  renderer,
  precision = 'seconds',
  format = 'full',
  showZeroUnits = true,
  className,
  unitClassName,
  valueClassName,
  labelClassName,
  separatorClassName,
  completedMessage = 'Completed!',
}: SafeCountdownProps) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [completed, setCompleted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    
    // Calculate initial time left
    const target = typeof targetDate === 'string' || typeof targetDate === 'number'
      ? new Date(targetDate).getTime()
      : targetDate.getTime();
    
    const now = new Date().getTime();
    const difference = target - now;
    
    if (difference <= 0) {
      setCompleted(true);
      setTimeLeft(0);
      onComplete?.();
      return;
    }
    
    setTimeLeft(difference);
    
    // Set up interval
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;
      
      if (difference <= 0) {
        clearInterval(interval);
        setCompleted(true);
        setTimeLeft(0);
        onComplete?.();
      } else {
        setTimeLeft(difference);
        onTick?.(difference);
      }
    }, 1000);
    
    timerRef.current = interval;
    
    // Clean up interval
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [targetDate, onComplete, onTick]);
  
  // Calculate time units
  const calculateTimeUnits = () => {
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds };
  };
  
  // Get time units to display based on precision
  const getTimeUnitsToDisplay = () => {
    const { days, hours, minutes, seconds } = calculateTimeUnits();
    const units: TimeUnit[] = [];
    
    if (precision === 'days' || days > 0 || showZeroUnits) {
      units.push({ value: days, label: format === 'minimal' ? 'd' : format === 'compact' ? 'days' : 'days' });
    }
    
    if (precision === 'days' || precision === 'hours' || hours > 0 || showZeroUnits) {
      units.push({ value: hours, label: format === 'minimal' ? 'h' : format === 'compact' ? 'hrs' : 'hours' });
    }
    
    if (precision === 'days' || precision === 'hours' || precision === 'minutes' || minutes > 0 || showZeroUnits) {
      units.push({ value: minutes, label: format === 'minimal' ? 'm' : format === 'compact' ? 'min' : 'minutes' });
    }
    
    if (precision === 'seconds' || seconds > 0 || showZeroUnits) {
      units.push({ value: seconds, label: format === 'minimal' ? 's' : format === 'compact' ? 'sec' : 'seconds' });
    }
    
    return units;
  };
  
  // Format value
  const formatValue = (value: number) => {
    return value < 10 ? `0${value}` : `${value}`;
  };
  
  // Custom renderer
  const renderCustom = () => {
    if (!renderer) return null;
    
    const { days, hours, minutes, seconds } = calculateTimeUnits();
    return renderer({ days, hours, minutes, seconds, completed });
  };
  
  // Default renderer
  const renderDefault = () => {
    if (completed) {
      return <div className="text-center">{completedMessage}</div>;
    }
    
    const units = getTimeUnitsToDisplay();
    
    return (
      <div className={`flex items-center ${className || ''}`}>
        {units.map((unit, index) => (
          <React.Fragment key={unit.label}>
            <div className={`flex flex-col items-center ${unitClassName || ''}`}>
              <span className={`text-2xl font-bold ${valueClassName || ''}`}>
                {formatValue(unit.value)}
              </span>
              <span className={`text-xs text-gray-500 dark:text-gray-400 ${labelClassName || ''}`}>
                {unit.label}
              </span>
            </div>
            
            {index < units.length - 1 && (
              <span className={`mx-2 text-xl ${separatorClassName || ''}`}>:</span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };
  
  // Simple loading state for SSR
  const CountdownSkeleton = () => (
    <div className={`flex items-center ${className || ''}`}>
      <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <span className="mx-2">:</span>
      <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <span className="mx-2">:</span>
      <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  );
  
  // If not mounted, show skeleton
  if (!mounted) {
    return <CountdownSkeleton />;
  }
  
  return (
    <ClientOnly fallback={<CountdownSkeleton />}>
      {renderer ? renderCustom() : renderDefault()}
    </ClientOnly>
  );
}
