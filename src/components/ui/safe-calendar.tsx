'use client';

import React, { useState, useEffect } from 'react';
import { ClientOnly } from './client-only';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  className?: string;
}

interface SafeCalendarProps {
  events?: CalendarEvent[];
  initialDate?: Date;
  onDateChange?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  className?: string;
  headerClassName?: string;
  dayClassName?: string;
  todayClassName?: string;
  selectedClassName?: string;
  eventClassName?: string;
  disabledClassName?: string;
  showHeader?: boolean;
  showNavigation?: boolean;
  showEvents?: boolean;
}

/**
 * A hydration-safe calendar component that handles SSR and client-side rendering properly
 */
export function SafeCalendar({
  events = [],
  initialDate,
  onDateChange,
  onEventClick,
  className,
  headerClassName,
  dayClassName,
  todayClassName,
  selectedClassName,
  eventClassName,
  disabledClassName,
  showHeader = true,
  showNavigation = true,
  showEvents = true,
}: SafeCalendarProps) {
  const { t, isClient } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState(initialDate || new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    
    if (initialDate) {
      setCurrentDate(initialDate);
    }
  }, [initialDate]);
  
  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get day of week (0-6, where 0 is Sunday)
  const getDayOfWeek = (year: number, month: number, day: number) => {
    return new Date(year, month, day).getDay();
  };
  
  // Get previous month days to display
  const getPreviousMonthDays = (year: number, month: number) => {
    const firstDayOfMonth = getDayOfWeek(year, month, 1);
    const daysInPreviousMonth = getDaysInMonth(year, month - 1);
    
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({
        day: daysInPreviousMonth - firstDayOfMonth + i + 1,
        month: month - 1,
        year: month === 0 ? year - 1 : year,
        isCurrentMonth: false,
      });
    }
    
    return days;
  };
  
  // Get current month days
  const getCurrentMonthDays = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month);
    
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month,
        year,
        isCurrentMonth: true,
      });
    }
    
    return days;
  };
  
  // Get next month days to display
  const getNextMonthDays = (year: number, month: number, currentMonthDays: number, previousMonthDays: number) => {
    const totalDays = currentMonthDays + previousMonthDays;
    const remainingDays = 42 - totalDays; // 6 rows x 7 days
    
    const days = [];
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        month: month + 1,
        year: month === 11 ? year + 1 : year,
        isCurrentMonth: false,
      });
    }
    
    return days;
  };
  
  // Get all days to display
  const getAllDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const previousMonthDays = getPreviousMonthDays(year, month);
    const currentMonthDays = getCurrentMonthDays(year, month);
    const nextMonthDays = getNextMonthDays(year, month, currentMonthDays.length, previousMonthDays.length);
    
    return [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];
  };
  
  // Check if date is today
  const isToday = (day: number, month: number, year: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };
  
  // Check if date is selected
  const isSelected = (day: number, month: number, year: number) => {
    if (!selectedDate) return false;
    
    return (
      day === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear()
    );
  };
  
  // Get events for a specific day
  const getEventsForDay = (day: number, month: number, year: number) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        day === eventDate.getDate() &&
        month === eventDate.getMonth() &&
        year === eventDate.getFullYear()
      );
    });
  };
  
  // Handle date click
  const handleDateClick = (day: number, month: number, year: number) => {
    const date = new Date(year, month, day);
    setSelectedDate(date);
    onDateChange?.(date);
  };
  
  // Handle event click
  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    onEventClick?.(event);
  };
  
  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };
  
  // Format month and year
  const formatMonthYear = () => {
    if (!mounted || !isClient) return '';
    
    return currentDate.toLocaleDateString(t('locale'), {
      month: 'long',
      year: 'numeric',
    });
  };
  
  // Get day names
  const getDayNames = () => {
    if (!mounted || !isClient) return Array(7).fill('');
    
    const dayNames = [];
    const date = new Date();
    date.setDate(date.getDate() - date.getDay());
    
    for (let i = 0; i < 7; i++) {
      dayNames.push(
        date.toLocaleDateString(t('locale'), { weekday: 'short' })
      );
      date.setDate(date.getDate() + 1);
    }
    
    return dayNames;
  };
  
  // Simple loading state for SSR
  const CalendarSkeleton = () => (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow ${className || ''}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="h-8 bg-gray-100 dark:bg-gray-800 p-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
          </div>
        ))}
        {Array.from({ length: 35 }).map((_, index) => (
          <div key={index + 7} className="h-24 bg-white dark:bg-gray-800 p-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-6"></div>
          </div>
        ))}
      </div>
    </div>
  );
  
  // If not mounted or not client, show skeleton
  if (!mounted || !isClient) {
    return <CalendarSkeleton />;
  }
  
  const days = getAllDays();
  const dayNames = getDayNames();
  
  return (
    <ClientOnly fallback={<CalendarSkeleton />}>
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow ${className || ''}`}>
        {/* Calendar header */}
        {showHeader && (
          <div className={`p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 ${headerClassName || ''}`}>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatMonthYear()}
            </h2>
            
            {/* Navigation buttons */}
            {showNavigation && (
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={goToPreviousMonth}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  type="button"
                  onClick={goToNextMonth}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
          {/* Day names */}
          {dayNames.map((dayName, index) => (
            <div
              key={index}
              className="bg-gray-100 dark:bg-gray-800 p-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              {dayName}
            </div>
          ))}
          
          {/* Calendar days */}
          {days.map((day, index) => {
            const isCurrentDay = isToday(day.day, day.month, day.year);
            const isSelectedDay = isSelected(day.day, day.month, day.year);
            const dayEvents = showEvents ? getEventsForDay(day.day, day.month, day.year) : [];
            
            return (
              <div
                key={index}
                className={`bg-white dark:bg-gray-800 p-2 ${
                  day.isCurrentMonth
                    ? 'text-gray-900 dark:text-white'
                    : `text-gray-400 dark:text-gray-500 ${disabledClassName || ''}`
                } ${
                  isCurrentDay
                    ? `bg-blue-50 dark:bg-blue-900/20 ${todayClassName || ''}`
                    : ''
                } ${
                  isSelectedDay
                    ? `bg-blue-100 dark:bg-blue-800/30 ${selectedClassName || ''}`
                    : ''
                } ${dayClassName || ''}`}
                onClick={() => handleDateClick(day.day, day.month, day.year)}
              >
                <div className="flex justify-between">
                  <span className={isCurrentDay ? 'font-bold' : ''}>{day.day}</span>
                </div>
                
                {/* Events */}
                {dayEvents.length > 0 && (
                  <div className="mt-1 space-y-1">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded truncate ${
                          event.className || 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        } ${eventClassName || ''}`}
                        onClick={(e) => handleEventClick(event, e)}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </ClientOnly>
  );
}
