'use client';

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { User, UserPlus, BookOpen, Calendar, FileText, Bell, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

export interface ActivityItem {
  id: string;
  type: 'user' | 'course' | 'schedule' | 'report' | 'notification' | 'success' | 'warning' | 'error';
  title: string;
  description?: string;
  timestamp: Date;
  user?: {
    name: string;
    avatar?: string;
  };
  metadata?: Record<string, any>;
  link?: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  title?: string;
  maxItems?: number;
  showTimestamp?: boolean;
  showUserAvatar?: boolean;
  className?: string;
  emptyMessage?: string;
  onItemClick?: (activity: ActivityItem) => void;
}

const activityIcons = {
  user: User,
  course: BookOpen,
  schedule: Calendar,
  report: FileText,
  notification: Bell,
  success: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
};

const activityColors = {
  user: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20',
  course: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20',
  schedule: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20',
  report: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20',
  notification: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20',
  success: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20',
  warning: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20',
  error: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20',
};

export function ActivityFeed({
  activities,
  title = 'Recent Activity',
  maxItems = 10,
  showTimestamp = true,
  showUserAvatar = true,
  className = '',
  emptyMessage = 'No recent activity',
  onItemClick,
}: ActivityFeedProps) {
  const displayedActivities = activities.slice(0, maxItems);

  const getActivityIcon = (type: ActivityItem['type']) => {
    const IconComponent = activityIcons[type] || Bell;
    return IconComponent;
  };

  const formatTimestamp = (timestamp: Date) => {
    return formatDistanceToNow(timestamp, { addSuffix: true });
  };

  const renderUserAvatar = (user?: ActivityItem['user']) => {
    if (!user || !showUserAvatar) return null;

    return (
      <div className="flex-shrink-0">
        {user.avatar ? (
          <img
            className="h-8 w-8 rounded-full"
            src={user.avatar}
            alt={user.name}
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderActivityItem = (activity: ActivityItem, index: number) => {
    const IconComponent = getActivityIcon(activity.type);
    const isLast = index === displayedActivities.length - 1;

    return (
      <div key={activity.id} className="relative">
        {/* Timeline line */}
        {!isLast && (
          <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
        )}

        <div
          className={`
            relative flex items-start space-x-3 pb-4
            ${onItemClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg p-2 -m-2' : ''}
          `}
          onClick={() => onItemClick?.(activity)}
        >
          {/* Activity icon */}
          <div className={`
            flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center
            ${activityColors[activity.type]}
          `}>
            <IconComponent className="h-4 w-4" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.title}
                </p>
                
                {activity.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {activity.description}
                  </p>
                )}

                {activity.user && (
                  <div className="flex items-center mt-2 space-x-2">
                    {renderUserAvatar(activity.user)}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      by {activity.user.name}
                    </span>
                  </div>
                )}
              </div>

              {showTimestamp && (
                <div className="flex-shrink-0 ml-4">
                  <time className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTimestamp(activity.timestamp)}
                  </time>
                </div>
              )}
            </div>

            {/* Metadata */}
            {activity.metadata && Object.keys(activity.metadata).length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {Object.entries(activity.metadata).map(([key, value]) => (
                  <span
                    key={key}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    {key}: {String(value)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          
          {activities.length > maxItems && (
            <button
              type="button"
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              View all ({activities.length})
            </button>
          )}
        </div>

        {displayedActivities.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
          </div>
        ) : (
          <div className="space-y-0">
            {displayedActivities.map(renderActivityItem)}
          </div>
        )}
      </div>
    </div>
  );
}

// Sample data generator for testing
export const generateSampleActivities = (): ActivityItem[] => [
  {
    id: '1',
    type: 'user',
    title: 'New student registered',
    description: 'John Doe has been enrolled in Grade 10',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    user: { name: 'Admin User' },
    metadata: { grade: '10', section: 'A' },
  },
  {
    id: '2',
    type: 'course',
    title: 'Course updated',
    description: 'Mathematics curriculum has been updated',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    user: { name: 'Jane Smith' },
    metadata: { subject: 'Mathematics', grade: '10' },
  },
  {
    id: '3',
    type: 'schedule',
    title: 'Class scheduled',
    description: 'Physics class scheduled for tomorrow',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    user: { name: 'Dr. Wilson' },
    metadata: { subject: 'Physics', time: '10:00 AM' },
  },
  {
    id: '4',
    type: 'success',
    title: 'Attendance recorded',
    description: 'Attendance for Grade 9A has been successfully recorded',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    user: { name: 'Teacher Mary' },
    metadata: { grade: '9', section: 'A', present: '28', absent: '2' },
  },
  {
    id: '5',
    type: 'report',
    title: 'Monthly report generated',
    description: 'Student performance report for October',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    user: { name: 'System' },
    metadata: { month: 'October', students: '150' },
  },
];

export default ActivityFeed;
