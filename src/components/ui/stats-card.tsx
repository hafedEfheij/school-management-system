'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
    period?: string;
  };
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  loading?: boolean;
  onClick?: () => void;
}

export function StatsCard({
  title,
  value,
  change,
  icon,
  color = 'blue',
  size = 'md',
  className = '',
  loading = false,
  onClick,
}: StatsCardProps) {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      icon: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      icon: 'text-green-600 dark:text-green-400',
      border: 'border-green-200 dark:border-green-800',
    },
    yellow: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      icon: 'text-yellow-600 dark:text-yellow-400',
      border: 'border-yellow-200 dark:border-yellow-800',
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      icon: 'text-red-600 dark:text-red-400',
      border: 'border-red-200 dark:border-red-800',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      icon: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-800',
    },
    gray: {
      bg: 'bg-gray-50 dark:bg-gray-900/20',
      icon: 'text-gray-600 dark:text-gray-400',
      border: 'border-gray-200 dark:border-gray-800',
    },
  };

  const sizeClasses = {
    sm: {
      padding: 'p-4',
      iconSize: 'h-8 w-8',
      valueSize: 'text-2xl',
      titleSize: 'text-sm',
      changeSize: 'text-xs',
    },
    md: {
      padding: 'p-6',
      iconSize: 'h-10 w-10',
      valueSize: 'text-3xl',
      titleSize: 'text-base',
      changeSize: 'text-sm',
    },
    lg: {
      padding: 'p-8',
      iconSize: 'h-12 w-12',
      valueSize: 'text-4xl',
      titleSize: 'text-lg',
      changeSize: 'text-base',
    },
  };

  const getChangeIcon = () => {
    if (!change) return null;
    
    switch (change.type) {
      case 'increase':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'decrease':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'neutral':
        return <Minus className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getChangeColor = () => {
    if (!change) return '';
    
    switch (change.type) {
      case 'increase':
        return 'text-green-600 dark:text-green-400';
      case 'decrease':
        return 'text-red-600 dark:text-red-400';
      case 'neutral':
        return 'text-gray-600 dark:text-gray-400';
      default:
        return '';
    }
  };

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  if (loading) {
    return (
      <div className={`
        bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700
        ${sizeClasses[size].padding} ${className}
      `}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className={`${sizeClasses[size].iconSize} bg-gray-200 dark:bg-gray-700 rounded`}></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700
        ${sizeClasses[size].padding} ${className}
        ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={`
            font-medium text-gray-600 dark:text-gray-400 mb-2
            ${sizeClasses[size].titleSize}
          `}>
            {title}
          </p>
          
          <p className={`
            font-bold text-gray-900 dark:text-white mb-2
            ${sizeClasses[size].valueSize}
          `}>
            {formatValue(value)}
          </p>
          
          {change && (
            <div className={`
              flex items-center space-x-1
              ${sizeClasses[size].changeSize}
            `}>
              {getChangeIcon()}
              <span className={getChangeColor()}>
                {change.value > 0 ? '+' : ''}{change.value}%
                {change.period && (
                  <span className="text-gray-500 dark:text-gray-400 ml-1">
                    {change.period}
                  </span>
                )}
              </span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className={`
            ${colorClasses[color].bg} ${colorClasses[color].border}
            rounded-lg p-3 border
          `}>
            <div className={`${colorClasses[color].icon} ${sizeClasses[size].iconSize}`}>
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StatsCard;
