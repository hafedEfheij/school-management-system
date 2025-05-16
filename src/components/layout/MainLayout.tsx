import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRtl } from '@/hooks/useRtl';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { FaHome, FaUserGraduate, FaChalkboardTeacher, FaBook, FaCalendarAlt, FaClipboardList, FaUser } from 'react-icons/fa';

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { t, language } = useLanguage();
  const rtl = useRtl();

  return (
    <div className="flex h-screen bg-gray-100" dir={rtl.dir}>
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white">
        <div className="p-4">
          <h1 className="text-2xl font-bold">{t('app.name')}</h1>
        </div>
        <nav className="mt-8">
          <ul>
            <li className="mb-2">
              <Link href="/dashboard" className="flex items-center p-3 hover:bg-blue-700 transition-colors">
                <FaHome className={rtl.margin('left', 3)} /> {t('app.dashboard')}
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/students" className="flex items-center p-3 hover:bg-blue-700 transition-colors">
                <FaUserGraduate className={rtl.margin('left', 3)} /> {t('app.students')}
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/teachers" className="flex items-center p-3 hover:bg-blue-700 transition-colors">
                <FaChalkboardTeacher className={rtl.margin('left', 3)} /> {t('app.teachers')}
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/courses" className="flex items-center p-3 hover:bg-blue-700 transition-colors">
                <FaBook className={rtl.margin('left', 3)} /> {t('app.courses')}
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/schedule" className="flex items-center p-3 hover:bg-blue-700 transition-colors">
                <FaCalendarAlt className={rtl.margin('left', 3)} /> {t('app.schedule')}
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/attendance" className="flex items-center p-3 hover:bg-blue-700 transition-colors">
                <FaClipboardList className={rtl.margin('left', 3)} /> {t('app.attendance')}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-xl font-semibold">{t('app.name')}</h2>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              {isAuthenticated ? (
                <div className={`flex items-center gap-4 ${rtl.flexDirection()}`}>
                  <div className="flex items-center">
                    <FaUser className={rtl.margin('left', 2)} />
                    <span>{user?.email}</span>
                  </div>
                  <button
                    onClick={() => logout()}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    {t('app.signOut')}
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  {t('app.signIn')}
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
