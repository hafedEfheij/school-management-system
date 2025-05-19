'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageChange = (newLanguage: 'ar' | 'en' | 'fr') => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-1 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Globe className="h-4 w-4" />
        <span className="ml-2">{t(`app.${language}`)}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              onClick={() => handleLanguageChange('en')}
              className={`block w-full px-4 py-2 text-left text-sm ${
                language === 'en' ? 'bg-gray-100 dark:bg-gray-700' : ''
              }`}
              role="menuitem"
            >
              English
            </button>
            <button
              onClick={() => handleLanguageChange('ar')}
              className={`block w-full px-4 py-2 text-left text-sm ${
                language === 'ar' ? 'bg-gray-100 dark:bg-gray-700' : ''
              }`}
              role="menuitem"
            >
              العربية
            </button>
            <button
              onClick={() => handleLanguageChange('fr')}
              className={`block w-full px-4 py-2 text-left text-sm ${
                language === 'fr' ? 'bg-gray-100 dark:bg-gray-700' : ''
              }`}
              role="menuitem"
            >
              Français
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
