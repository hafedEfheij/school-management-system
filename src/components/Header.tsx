'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { ModeToggle } from '@/components/ui/mode-toggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const { t, isClient } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Return a simplified version during SSR to avoid hydration mismatches
  if (!mounted || !isClient) {
    return (
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto py-4 px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center">
                <div className="w-10 h-10" /> {/* Placeholder for image */}
                <span className="ml-2 text-xl font-bold hidden md:inline-block">
                  School Management System
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>
    );
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto py-4 px-4">
        <div className="flex justify-between items-center">
          {/* Logo and Title */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.svg"
                alt="School Management System"
                width={40}
                height={40}
                className="dark:invert"
              />
              <span className="ml-2 text-xl font-bold hidden md:inline-block">
                {t('app.title')}
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              {t('app.dashboard')}
            </Link>
            <Link href="/students" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              {t('app.students')}
            </Link>
            <Link href="/teachers" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              {t('app.teachers')}
            </Link>
            <Link href="/courses" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              {t('app.courses')}
            </Link>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            <ModeToggle />
            <div className="flex space-x-2">
              <Link
                href="/login"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                {t('app.signIn')}
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                {t('app.signUp')}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('app.dashboard')}
              </Link>
              <Link
                href="/students"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('app.students')}
              </Link>
              <Link
                href="/teachers"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('app.teachers')}
              </Link>
              <Link
                href="/courses"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('app.courses')}
              </Link>
            </nav>
            <div className="mt-4 flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <LanguageSwitcher />
                <ModeToggle />
              </div>
              <div className="flex flex-col space-y-2">
                <Link
                  href="/login"
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-center hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('app.signIn')}
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium text-center hover:bg-blue-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('app.signUp')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
