'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import StatsCard from '@/components/ui/stats-card';
import QuickActions from '@/components/ui/quick-actions';
import ActivityFeed, { generateSampleActivities } from '@/components/ui/activity-feed';
import { UserPlus, BookOpen, Calendar, FileText, Users, GraduationCap, TrendingUp } from 'lucide-react';

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
  const [activities] = useState(generateSampleActivities());

  // Quick actions for different user roles
  const getQuickActions = () => {
    const baseActions = [
      {
        id: 'add-student',
        label: 'Add Student',
        description: 'Register a new student',
        icon: <UserPlus className="h-5 w-5" />,
        onClick: () => console.log('Add student'),
        color: 'blue' as const,
      },
      {
        id: 'add-course',
        label: 'Add Course',
        description: 'Create a new course',
        icon: <BookOpen className="h-5 w-5" />,
        onClick: () => console.log('Add course'),
        color: 'green' as const,
      },
      {
        id: 'schedule-class',
        label: 'Schedule Class',
        description: 'Schedule a new class',
        icon: <Calendar className="h-5 w-5" />,
        onClick: () => console.log('Schedule class'),
        color: 'purple' as const,
      },
      {
        id: 'generate-report',
        label: 'Generate Report',
        description: 'Create attendance report',
        icon: <FileText className="h-5 w-5" />,
        onClick: () => console.log('Generate report'),
        color: 'yellow' as const,
      },
    ];

    // Filter actions based on user role
    if (user?.role === 'TEACHER') {
      return baseActions.filter(action =>
        ['schedule-class', 'generate-report'].includes(action.id)
      );
    }

    return baseActions;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <p className="text-xl">Please sign in</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user.name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Here's what's happening in your school today.
            </p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Students"
            value={stats.students}
            change={{ value: 12, type: 'increase', period: 'this month' }}
            icon={<Users className="h-6 w-6" />}
            color="blue"
            loading={loading}
          />
          <StatsCard
            title="Teachers"
            value={stats.teachers}
            change={{ value: 2, type: 'increase', period: 'this month' }}
            icon={<GraduationCap className="h-6 w-6" />}
            color="green"
            loading={loading}
          />
          <StatsCard
            title="Active Courses"
            value={stats.courses}
            change={{ value: 5, type: 'increase', period: 'this semester' }}
            icon={<BookOpen className="h-6 w-6" />}
            color="purple"
            loading={loading}
          />
          <StatsCard
            title="Classes Today"
            value={stats.classes}
            change={{ value: 0, type: 'neutral', period: 'vs yesterday' }}
            icon={<Calendar className="h-6 w-6" />}
            color="yellow"
            loading={loading}
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <QuickActions
            actions={getQuickActions()}
            title="Quick Actions"
            layout="grid"
            maxVisible={4}
          />
        </div>

        {/* Activity Feed and Additional Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityFeed
            activities={activities}
            title="Recent Activity"
            maxItems={5}
            onItemClick={(activity) => console.log('Activity clicked:', activity)}
          />

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              System Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">API Services</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Last Backup</span>
                <span className="text-sm text-gray-900 dark:text-white">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active Users</span>
                <span className="text-sm text-gray-900 dark:text-white">24 online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
