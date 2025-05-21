'use client';

import React, { useState, useEffect, ReactNode, useRef } from 'react';
import { ClientOnly } from './client-only';
import { ChevronDown } from 'lucide-react';

interface DropdownItem {
  id: string;
  label: ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  icon?: ReactNode;
  divider?: boolean;
}

interface DropdownSection {
  id: string;
  title?: string;
  items: DropdownItem[];
}

interface SafeDropdownProps {
  trigger: ReactNode;
  items: DropdownItem[] | DropdownSection[];
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  width?: number | string;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  itemClassName?: string;
  disabledItemClassName?: string;
  dividerClassName?: string;
  sectionTitleClassName?: string;
  showChevron?: boolean;
  closeOnClick?: boolean;
  closeOnOutsideClick?: boolean;
}

/**
 * A hydration-safe dropdown menu component that handles SSR and client-side rendering properly
 */
export function SafeDropdown({
  trigger,
  items,
  position = 'bottom-left',
  width = 200,
  className,
  triggerClassName,
  menuClassName,
  itemClassName,
  disabledItemClassName,
  dividerClassName,
  sectionTitleClassName,
  showChevron = true,
  closeOnClick = true,
  closeOnOutsideClick = true,
}: SafeDropdownProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Handle outside click
  useEffect(() => {
    if (!closeOnOutsideClick) return;
    
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, closeOnOutsideClick]);
  
  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  // Handle item click
  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled) return;
    
    if (item.onClick) {
      item.onClick();
    }
    
    if (closeOnClick) {
      setIsOpen(false);
    }
  };
  
  // Check if items is an array of sections
  const isSectionArray = (items: DropdownItem[] | DropdownSection[]): items is DropdownSection[] => {
    return items.length > 0 && 'items' in items[0];
  };
  
  // Position classes
  const positionClasses = {
    'bottom-left': 'top-full left-0',
    'bottom-right': 'top-full right-0',
    'top-left': 'bottom-full left-0',
    'top-right': 'bottom-full right-0',
  };
  
  // Render dropdown item
  const renderDropdownItem = (item: DropdownItem, index: number) => {
    if (item.divider) {
      return (
        <div
          key={`divider-${index}`}
          className={`my-1 border-t border-gray-200 dark:border-gray-700 ${dividerClassName || ''}`}
        />
      );
    }
    
    const itemContent = (
      <>
        {item.icon && <span className="mr-2">{item.icon}</span>}
        {item.label}
      </>
    );
    
    return item.href ? (
      <a
        key={item.id}
        href={item.disabled ? undefined : item.href}
        className={`block px-4 py-2 text-sm ${
          item.disabled
            ? `text-gray-400 dark:text-gray-500 cursor-not-allowed ${disabledItemClassName || ''}`
            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
        } ${itemClassName || ''}`}
        onClick={(e) => {
          if (item.disabled) {
            e.preventDefault();
            return;
          }
          handleItemClick(item);
        }}
      >
        {itemContent}
      </a>
    ) : (
      <button
        key={item.id}
        type="button"
        className={`block w-full text-left px-4 py-2 text-sm ${
          item.disabled
            ? `text-gray-400 dark:text-gray-500 cursor-not-allowed ${disabledItemClassName || ''}`
            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
        } ${itemClassName || ''}`}
        onClick={() => handleItemClick(item)}
        disabled={item.disabled}
      >
        {itemContent}
      </button>
    );
  };
  
  // If not mounted, just render trigger
  if (!mounted) {
    return (
      <div className={className}>
        <div className={triggerClassName}>{trigger}</div>
      </div>
    );
  }
  
  return (
    <ClientOnly>
      <div className={`relative inline-block text-left ${className || ''}`} ref={dropdownRef}>
        {/* Dropdown trigger */}
        <div
          className={`inline-flex items-center cursor-pointer ${triggerClassName || ''}`}
          onClick={toggleDropdown}
        >
          {trigger}
          {showChevron && <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />}
        </div>
        
        {/* Dropdown menu */}
        {isOpen && (
          <div
            className={`absolute z-10 mt-2 ${positionClasses[position]} bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${menuClassName || ''}`}
            style={{ width: typeof width === 'number' ? `${width}px` : width }}
          >
            <div className="py-1">
              {isSectionArray(items) ? (
                // Render sections
                items.map((section, sectionIndex) => (
                  <div key={section.id}>
                    {section.title && (
                      <div className={`px-4 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${sectionTitleClassName || ''}`}>
                        {section.title}
                      </div>
                    )}
                    {section.items.map((item, itemIndex) => renderDropdownItem(item, `${sectionIndex}-${itemIndex}`))}
                    {sectionIndex < items.length - 1 && (
                      <div className={`my-1 border-t border-gray-200 dark:border-gray-700 ${dividerClassName || ''}`} />
                    )}
                  </div>
                ))
              ) : (
                // Render flat items
                items.map((item, index) => renderDropdownItem(item, index))
              )}
            </div>
          </div>
        )}
      </div>
    </ClientOnly>
  );
}
