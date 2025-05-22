'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { FaUserGraduate, FaChalkboardTeacher, FaBook, FaCalendarAlt } from 'react-icons/fa';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();
  const [stats, setStats] = useState({
    students: 120,
    teachers: 15,
    courses: 25,
    classes: 40,
  });
  const [loading, setLoading] = useState(false);

  // Helper for RTL-aware margin
  const getMarginClass = (direction: 'left' | 'right', size: number) => {
    if (direction === 'left') {
      return language === 'ar' ? `ml-${size}` : `mr-${size}`;
    } else {
      return language === 'ar' ? `mr-${size}` : `ml-${size}`;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <p className="text-xl">{t('app.signIn')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('app.dashboard')}</h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            {t('app.signOut')}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            {t('dashboard.welcome', { name: user.name })}
          </h2>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-md">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
              User Information:
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
              <li><strong>Name:</strong> {user.name}</li>
              <li><strong>Email:</strong> {user.email}</li>
              <li><strong>Role:</strong> {user.role}</li>
              {user.teacherId && <li><strong>Teacher ID:</strong> {user.teacherId}</li>}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center">
            <div className={`rounded-full bg-blue-100 dark:bg-blue-900/50 p-3 ${getMarginClass('left', 4)}`}>
              <FaUserGraduate className="text-blue-500 dark:text-blue-400 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Students</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.students}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center">
            <div className={`rounded-full bg-green-100 dark:bg-green-900/50 p-3 ${getMarginClass('left', 4)}`}>
              <FaChalkboardTeacher className="text-green-500 dark:text-green-400 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Teachers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.teachers}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center">
            <div className={`rounded-full bg-purple-100 dark:bg-purple-900/50 p-3 ${getMarginClass('left', 4)}`}>
              <FaBook className="text-purple-500 dark:text-purple-400 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Courses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.courses}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center">
            <div className={`rounded-full bg-yellow-100 dark:bg-yellow-900/50 p-3 ${getMarginClass('left', 4)}`}>
              <FaCalendarAlt className="text-yellow-500 dark:text-yellow-400 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Classes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.classes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Development Notes</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            This is a simplified dashboard for development purposes. In a production environment,
            this would connect to the database and display real-time data.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            You are currently logged in as <strong>{user.role}</strong>. Different roles have different
            permissions and access levels in the system.
          </p>
        </div>
      </div>
    </div>
  );
}
