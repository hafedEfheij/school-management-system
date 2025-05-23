'use client';

import React from 'react';
import { Plus, UserPlus, BookOpen, Calendar, FileText, Settings, Mail, Download } from 'lucide-react';

export interface QuickAction {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  onClick: () => void;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
  disabled?: boolean;
  badge?: string | number;
}

interface QuickActionsProps {
  actions: QuickAction[];
  title?: string;
  layout?: 'grid' | 'list' | 'horizontal';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  maxVisible?: number;
}

const defaultActions: QuickAction[] = [
  {
    id: 'add-student',
    label: 'Add Student',
    description: 'Register a new student',
    icon: <UserPlus className="h-5 w-5" />,
    onClick: () => console.log('Add student'),
    color: 'blue',
  },
  {
    id: 'add-course',
    label: 'Add Course',
    description: 'Create a new course',
    icon: <BookOpen className="h-5 w-5" />,
    onClick: () => console.log('Add course'),
    color: 'green',
  },
  {
    id: 'schedule-class',
    label: 'Schedule Class',
    description: 'Schedule a new class',
    icon: <Calendar className="h-5 w-5" />,
    onClick: () => console.log('Schedule class'),
    color: 'purple',
  },
  {
    id: 'generate-report',
    label: 'Generate Report',
    description: 'Create attendance report',
    icon: <FileText className="h-5 w-5" />,
    onClick: () => console.log('Generate report'),
    color: 'yellow',
  },
];

export function QuickActions({
  actions = defaultActions,
  title = 'Quick Actions',
  layout = 'grid',
  size = 'md',
  className = '',
  maxVisible,
}: QuickActionsProps) {
  const visibleActions = maxVisible ? actions.slice(0, maxVisible) : actions;
  const hiddenActions = maxVisible ? actions.slice(maxVisible) : [];

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30',
      icon: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
    },
    green: {
      bg: 'bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30',
      icon: 'text-green-600 dark:text-green-400',
      border: 'border-green-200 dark:border-green-800',
    },
    yellow: {
      bg: 'bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/30',
      icon: 'text-yellow-600 dark:text-yellow-400',
      border: 'border-yellow-200 dark:border-yellow-800',
    },
    red: {
      bg: 'bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30',
      icon: 'text-red-600 dark:text-red-400',
      border: 'border-red-200 dark:border-red-800',
    },
    purple: {
      bg: 'bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30',
      icon: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-800',
    },
    gray: {
      bg: 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-900/20 dark:hover:bg-gray-900/30',
      icon: 'text-gray-600 dark:text-gray-400',
      border: 'border-gray-200 dark:border-gray-800',
    },
  };

  const sizeClasses = {
    sm: {
      padding: 'p-3',
      iconSize: 'h-4 w-4',
      textSize: 'text-sm',
      descSize: 'text-xs',
    },
    md: {
      padding: 'p-4',
      iconSize: 'h-5 w-5',
      textSize: 'text-base',
      descSize: 'text-sm',
    },
    lg: {
      padding: 'p-6',
      iconSize: 'h-6 w-6',
      textSize: 'text-lg',
      descSize: 'text-base',
    },
  };

  const layoutClasses = {
    grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4',
    list: 'space-y-2',
    horizontal: 'flex flex-wrap gap-4',
  };

  const renderAction = (action: QuickAction) => {
    const colors = colorClasses[action.color || 'gray'];
    
    return (
      <button
        key={action.id}
        onClick={action.onClick}
        disabled={action.disabled}
        className={`
          relative w-full text-left rounded-lg border transition-all duration-200
          ${colors.bg} ${colors.border}
          ${sizeClasses[size].padding}
          ${action.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'}
          ${layout === 'horizontal' ? 'flex-shrink-0' : ''}
        `}
      >
        <div className={`flex items-center ${layout === 'list' ? 'space-x-3' : layout === 'horizontal' ? 'space-x-2' : 'flex-col space-y-2'}`}>
          <div className={`
            flex-shrink-0 flex items-center justify-center
            ${layout === 'grid' ? 'self-start' : ''}
          `}>
            <div className={`${colors.icon} ${sizeClasses[size].iconSize}`}>
              {action.icon}
            </div>
          </div>
          
          <div className={`flex-1 ${layout === 'grid' ? 'text-center' : ''}`}>
            <div className="flex items-center justify-between">
              <h3 className={`font-medium text-gray-900 dark:text-white ${sizeClasses[size].textSize}`}>
                {action.label}
              </h3>
              {action.badge && (
                <span className="ml-2 px-2 py-1 text-xs bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 rounded-full">
                  {action.badge}
                </span>
              )}
            </div>
            
            {action.description && layout !== 'horizontal' && (
              <p className={`text-gray-600 dark:text-gray-400 ${sizeClasses[size].descSize} mt-1`}>
                {action.description}
              </p>
            )}
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
        
        {hiddenActions.length > 0 && (
          <button
            type="button"
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            View all ({actions.length})
          </button>
        )}
      </div>
      
      <div className={layoutClasses[layout]}>
        {visibleActions.map(renderAction)}
        
        {hiddenActions.length > 0 && layout === 'grid' && (
          <button
            type="button"
            className={`
              w-full text-left rounded-lg border border-dashed border-gray-300 dark:border-gray-600 
              hover:border-gray-400 dark:hover:border-gray-500 transition-colors
              ${sizeClasses[size].padding}
            `}
          >
            <div className="flex flex-col items-center justify-center space-y-2 text-gray-500 dark:text-gray-400">
              <Plus className={sizeClasses[size].iconSize} />
              <span className={sizeClasses[size].textSize}>
                +{hiddenActions.length} more
              </span>
            </div>
          </button>
        )}
      </div>
      
      {hiddenActions.length > 0 && layout !== 'grid' && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            className="w-full text-center py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Show {hiddenActions.length} more actions
          </button>
        </div>
      )}
    </div>
  );
}

export default QuickActions;
