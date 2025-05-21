'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { ClientOnly } from './client-only';

interface Tab {
  id: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

interface SafeTabsProps {
  tabs: Tab[];
  defaultTabId?: string;
  onChange?: (tabId: string) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  tabListClassName?: string;
  tabClassName?: string;
  activeTabClassName?: string;
  disabledTabClassName?: string;
  tabPanelClassName?: string;
}

/**
 * A hydration-safe tabs component that handles SSR and client-side rendering properly
 */
export function SafeTabs({
  tabs,
  defaultTabId,
  onChange,
  orientation = 'horizontal',
  className,
  tabListClassName,
  tabClassName,
  activeTabClassName,
  disabledTabClassName,
  tabPanelClassName,
}: SafeTabsProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTabId, setActiveTabId] = useState<string>(defaultTabId || (tabs.length > 0 ? tabs[0].id : ''));
  
  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    if (defaultTabId) {
      setActiveTabId(defaultTabId);
    }
  }, [defaultTabId]);
  
  // Handle tab change
  const handleTabChange = (tabId: string) => {
    setActiveTabId(tabId);
    onChange?.(tabId);
  };
  
  // Get active tab
  const getActiveTab = () => {
    return tabs.find((tab) => tab.id === activeTabId) || tabs[0];
  };
  
  // Simple loading state for SSR
  const TabsSkeleton = () => (
    <div className={`w-full ${className || ''}`}>
      <div className={`flex ${orientation === 'vertical' ? 'flex-col' : ''} border-b border-gray-200 dark:border-gray-700 ${tabListClassName || ''}`}>
        {tabs.map((_, index) => (
          <div
            key={index}
            className={`h-10 ${
              orientation === 'vertical' ? 'w-full' : 'w-24'
            } bg-gray-200 dark:bg-gray-700 rounded-t-lg mx-1 animate-pulse`}
          ></div>
        ))}
      </div>
      <div className="p-4">
        <div className="h-40 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
      </div>
    </div>
  );
  
  // If not mounted, show skeleton
  if (!mounted) {
    return <TabsSkeleton />;
  }
  
  return (
    <ClientOnly fallback={<TabsSkeleton />}>
      <div className={`w-full ${className || ''}`} suppressHydrationWarning>
        <div
          className={`${
            orientation === 'horizontal'
              ? 'flex border-b border-gray-200 dark:border-gray-700'
              : 'flex flex-col border-r border-gray-200 dark:border-gray-700 float-left mr-4'
          } ${tabListClassName || ''}`}
          role="tablist"
          aria-orientation={orientation}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              role="tab"
              aria-selected={activeTabId === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              tabIndex={activeTabId === tab.id ? 0 : -1}
              onClick={() => !tab.disabled && handleTabChange(tab.id)}
              disabled={tab.disabled}
              className={`${
                orientation === 'horizontal'
                  ? 'py-2 px-4 border-b-2 -mb-px'
                  : 'py-2 px-4 border-r-2 -mr-px'
              } ${
                activeTabId === tab.id
                  ? `${
                      orientation === 'horizontal'
                        ? 'border-blue-500'
                        : 'border-blue-500'
                    } text-blue-600 dark:text-blue-300 ${activeTabClassName || ''}`
                  : `${
                      orientation === 'horizontal'
                        ? 'border-transparent'
                        : 'border-transparent'
                    } text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600`
              } ${
                tab.disabled
                  ? 'opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-500 border-transparent ${disabledTabClassName || ''}'
                  : ''
              } ${tabClassName || ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Clear float if vertical orientation */}
        {orientation === 'vertical' && <div className="clearfix"></div>}
        
        {/* Tab panels */}
        {tabs.map((tab) => (
          <div
            key={tab.id}
            id={`tabpanel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            hidden={activeTabId !== tab.id}
            className={`py-4 ${tabPanelClassName || ''}`}
          >
            {activeTabId === tab.id && tab.content}
          </div>
        ))}
      </div>
    </ClientOnly>
  );
}
