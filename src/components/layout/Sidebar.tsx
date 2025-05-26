'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Home, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  ClipboardCheck, 
  BarChart3, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  children?: NavItem[];
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const navigationItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/dashboard',
      icon: Home,
    },
    {
      id: 'students',
      label: 'Students',
      href: '/students',
      icon: Users,
      badge: 245,
    },
    {
      id: 'teachers',
      label: 'Teachers',
      href: '/teachers',
      icon: GraduationCap,
      badge: 32,
    },
    {
      id: 'courses',
      label: 'Courses',
      href: '/courses',
      icon: BookOpen,
      badge: 18,
    },
    {
      id: 'attendance',
      label: 'Attendance',
      href: '/attendance',
      icon: ClipboardCheck,
    },
    {
      id: 'grades',
      label: 'Grades',
      href: '/grades',
      icon: BarChart3,
    },
    {
      id: 'schedule',
      label: 'Schedule',
      href: '/schedule',
      icon: Calendar,
    },
    {
      id: 'reports',
      label: 'Reports',
      href: '/reports',
      icon: BarChart3,
      children: [
        {
          id: 'academic-reports',
          label: 'Academic Reports',
          href: '/reports/academic',
          icon: BarChart3,
        },
        {
          id: 'attendance-reports',
          label: 'Attendance Reports',
          href: '/reports/attendance',
          icon: ClipboardCheck,
        },
        {
          id: 'financial-reports',
          label: 'Financial Reports',
          href: '/reports/financial',
          icon: BarChart3,
        },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const renderNavItem = (item: NavItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = isActive(item.href);

    return (
      <div key={item.id}>
        <div className="relative">
          {hasChildren ? (
            <button
              onClick={() => toggleExpanded(item.id)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                active
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              } ${level > 0 ? 'ml-4' : ''}`}
            >
              <item.icon className={`h-5 w-5 ${isOpen ? 'mr-3' : ''}`} />
              {isOpen && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 mr-2">
                      {item.badge}
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronLeft className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </>
              )}
            </button>
          ) : (
            <Link
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                active
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              } ${level > 0 ? 'ml-4' : ''}`}
            >
              <item.icon className={`h-5 w-5 ${isOpen ? 'mr-3' : ''}`} />
              {isOpen && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          )}
        </div>

        {hasChildren && isExpanded && isOpen && (
          <div className="mt-1 space-y-1">
            {item.children!.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64' : 'w-16'}
        lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {isOpen && (
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
                SchoolMS
              </span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isOpen ? (
              <X className="h-5 w-5 text-gray-500" />
            ) : (
              <Menu className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>

        {/* User Profile */}
        {isOpen && user && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user.role || 'Administrator'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {isOpen && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <button className="flex-1 flex items-center justify-center p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                <Search className="h-4 w-4" />
              </button>
              <button className="flex-1 flex items-center justify-center p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                <Bell className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map(item => renderNavItem(item))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={logout}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors`}
          >
            <LogOut className={`h-5 w-5 ${isOpen ? 'mr-3' : ''}`} />
            {isOpen && <span>Sign Out</span>}
          </button>
        </div>
      </div>
    </>
  );
}
