'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import MainLayout from '@/components/layout/MainLayout';
import { FaUserGraduate, FaChalkboardTeacher, FaBook, FaCalendarAlt } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    courses: 0,
    classes: 0,
  });
  const [loading, setLoading] = useState(true);

  // Helper for RTL-aware margin
  const getMarginClass = (direction: 'left' | 'right', size: number) => {
    if (direction === 'left') {
      return language === 'ar' ? `ml-${size}` : `mr-${size}`;
    } else {
      return language === 'ar' ? `mr-${size}` : `ml-${size}`;
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // In a real application, these would be actual database queries
        // For now, we'll just simulate some data

        // Fetch student count
        const { count: studentCount, error: studentError } = await supabase
          .from('students')
          .select('*', { count: 'exact', head: true });

        // Fetch teacher count
        const { count: teacherCount, error: teacherError } = await supabase
          .from('teachers')
          .select('*', { count: 'exact', head: true });

        // Fetch course count
        const { count: courseCount, error: courseError } = await supabase
          .from('courses')
          .select('*', { count: 'exact', head: true });

        // Fetch schedule count
        const { count: scheduleCount, error: scheduleError } = await supabase
          .from('schedules')
          .select('*', { count: 'exact', head: true });

        setStats({
          students: studentCount || 0,
          teachers: teacherCount || 0,
          courses: courseCount || 0,
          classes: scheduleCount || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        // For demo purposes, set some dummy data
        setStats({
          students: 120,
          teachers: 15,
          courses: 25,
          classes: 40,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <p className="text-xl">{t('app.signIn')}</p>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t('app.dashboard')}</h1>

        {loading ? (
          <div className="flex justify-center">
            <p className="text-xl">Loading stats...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                <div className={`rounded-full bg-blue-100 p-3 ${getMarginClass('left', 4)}`}>
                  <FaUserGraduate className="text-blue-500 text-xl" />
                </div>
                <div>
                  <p className="text-gray-500">{t('dashboard.stats.students')}</p>
                  <p className="text-2xl font-bold">{stats.students}</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                <div className={`rounded-full bg-green-100 p-3 ${getMarginClass('left', 4)}`}>
                  <FaChalkboardTeacher className="text-green-500 text-xl" />
                </div>
                <div>
                  <p className="text-gray-500">{t('dashboard.stats.teachers')}</p>
                  <p className="text-2xl font-bold">{stats.teachers}</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                <div className={`rounded-full bg-purple-100 p-3 ${getMarginClass('left', 4)}`}>
                  <FaBook className="text-purple-500 text-xl" />
                </div>
                <div>
                  <p className="text-gray-500">{t('dashboard.stats.courses')}</p>
                  <p className="text-2xl font-bold">{stats.courses}</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                <div className={`rounded-full bg-yellow-100 p-3 ${getMarginClass('left', 4)}`}>
                  <FaCalendarAlt className="text-yellow-500 text-xl" />
                </div>
                <div>
                  <p className="text-gray-500">{t('dashboard.stats.classes')}</p>
                  <p className="text-2xl font-bold">{stats.classes}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">{t('dashboard.recentActivities')}</h2>
                <div className="space-y-4">
                  <div className="border-b pb-2">
                    <p className="font-medium">New student registered</p>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="font-medium">Attendance updated for Grade 10</p>
                    <p className="text-sm text-gray-500">3 hours ago</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="font-medium">New course added: Advanced Mathematics</p>
                    <p className="text-sm text-gray-500">5 hours ago</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="font-medium">Teacher meeting scheduled</p>
                    <p className="text-sm text-gray-500">Yesterday</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">{t('dashboard.upcomingEvents')}</h2>
                <div className="space-y-4">
                  <div className="border-b pb-2">
                    <p className="font-medium">Parent-Teacher Meeting</p>
                    <p className="text-sm text-gray-500">Tomorrow, 4:00 PM</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="font-medium">Science Fair</p>
                    <p className="text-sm text-gray-500">May 15, 2023</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="font-medium">End of Term Exams</p>
                    <p className="text-sm text-gray-500">June 1-10, 2023</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="font-medium">Summer Break</p>
                    <p className="text-sm text-gray-500">Starts June 15, 2023</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
