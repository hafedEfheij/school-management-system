'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useRef, useEffect } from 'react';
import { FaGlobe, FaCheck } from 'react-icons/fa';

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Helper for RTL-aware margin
  const getMarginClass = (direction: 'left' | 'right', size: number) => {
    if (direction === 'left') {
      return language === 'ar' ? `ml-${size}` : `mr-${size}`;
    } else {
      return language === 'ar' ? `mr-${size}` : `ml-${size}`;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <FaGlobe className={getMarginClass('left', 2)} />
        <span>{t('app.language')}</span>
      </button>

      {isOpen && (
        <div
          className={`absolute ${language === 'ar' ? 'left-0' : 'right-0'} mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700`}
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1">
            <button
              onClick={() => {
                setLanguage('en');
                setIsOpen(false);
              }}
              className={`flex items-center justify-between w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                language === 'en' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
              }`}
              role="menuitem"
            >
              <span>{t('app.english')}</span>
              {language === 'en' && <FaCheck className="text-blue-500" />}
            </button>
            <button
              onClick={() => {
                setLanguage('ar');
                setIsOpen(false);
              }}
              className={`flex items-center justify-between w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                language === 'ar' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
              }`}
              role="menuitem"
            >
              <span>{t('app.arabic')}</span>
              {language === 'ar' && <FaCheck className="text-blue-500" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
