'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNotification } from '@/contexts/NotificationContext';
import SafeButton from '@/components/ui/safe-button';
import SafeSelect from '@/components/ui/safe-select';
import SafeCard from '@/components/ui/safe-card';
import SafeModal from '@/components/ui/safe-modal';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  GraduationCap, 
  BookOpen, 
  ClipboardCheck,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  FileText,
  Eye
} from 'lucide-react';

interface ReportCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  type: 'chart' | 'table' | 'summary';
  category: 'academic' | 'attendance' | 'financial' | 'administrative';
  lastUpdated: string;
  data?: any;
}

const mockReports: ReportCard[] = [
  {
    id: 'student-enrollment',
    title: 'Student Enrollment Trends',
    description: 'Track student enrollment over time by grade and department',
    icon: Users,
    type: 'chart',
    category: 'academic',
    lastUpdated: '2024-01-15T10:30:00Z',
    data: { students: 245, growth: 12 },
  },
  {
    id: 'attendance-overview',
    title: 'Attendance Overview',
    description: 'Daily and weekly attendance rates across all classes',
    icon: ClipboardCheck,
    type: 'chart',
    category: 'attendance',
    lastUpdated: '2024-01-15T09:00:00Z',
    data: { rate: 94.5, trend: 'up' },
  },
  {
    id: 'grade-distribution',
    title: 'Grade Distribution',
    description: 'Distribution of grades across subjects and classes',
    icon: BarChart3,
    type: 'chart',
    category: 'academic',
    lastUpdated: '2024-01-14T16:45:00Z',
    data: { average: 3.2, improvement: 0.3 },
  },
  {
    id: 'teacher-performance',
    title: 'Teacher Performance Metrics',
    description: 'Evaluation scores and student feedback for teachers',
    icon: GraduationCap,
    type: 'table',
    category: 'administrative',
    lastUpdated: '2024-01-14T14:20:00Z',
    data: { teachers: 32, avgRating: 4.3 },
  },
  {
    id: 'course-popularity',
    title: 'Course Enrollment Analysis',
    description: 'Most and least popular courses by enrollment numbers',
    icon: BookOpen,
    type: 'chart',
    category: 'academic',
    lastUpdated: '2024-01-13T11:15:00Z',
    data: { courses: 18, topCourse: 'Mathematics' },
  },
  {
    id: 'financial-summary',
    title: 'Financial Summary',
    description: 'Revenue, expenses, and budget allocation overview',
    icon: PieChart,
    type: 'summary',
    category: 'financial',
    lastUpdated: '2024-01-12T17:30:00Z',
    data: { revenue: 125000, expenses: 98000 },
  },
];

export default function ReportsPage() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { addNotification } = useNotification();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('last-30-days');
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportCard | null>(null);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'academic', label: 'Academic' },
    { value: 'attendance', label: 'Attendance' },
    { value: 'financial', label: 'Financial' },
    { value: 'administrative', label: 'Administrative' },
  ];

  const dateRanges = [
    { value: 'last-7-days', label: 'Last 7 Days' },
    { value: 'last-30-days', label: 'Last 30 Days' },
    { value: 'last-3-months', label: 'Last 3 Months' },
    { value: 'last-6-months', label: 'Last 6 Months' },
    { value: 'last-year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' },
  ];

  const filteredReports = mockReports.filter(report => 
    selectedCategory === 'all' || report.category === selectedCategory
  );

  const handleViewReport = (report: ReportCard) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const handleDownloadReport = (report: ReportCard) => {
    addNotification({
      type: 'success',
      title: 'Download Started',
      message: `Downloading ${report.title} report...`,
    });
  };

  const handleRefreshReports = () => {
    addNotification({
      type: 'info',
      title: 'Refreshing Reports',
      message: 'Updating all report data...',
    });
  };

  const formatLastUpdated = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic': return 'text-blue-600 bg-blue-100';
      case 'attendance': return 'text-green-600 bg-green-100';
      case 'financial': return 'text-purple-600 bg-purple-100';
      case 'administrative': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please sign in to access this page.</p>
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
              Reports & Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Comprehensive insights and data analysis
            </p>
          </div>
          <SafeButton
            onClick={handleRefreshReports}
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </SafeButton>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
            </div>
            
            <div className="flex-1 min-w-48">
              <SafeSelect
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={categories}
                placeholder="Select category"
              />
            </div>
            
            <div className="flex-1 min-w-48">
              <SafeSelect
                value={selectedDateRange}
                onChange={setSelectedDateRange}
                options={dateRanges}
                placeholder="Select date range"
              />
            </div>
            
            <SafeButton variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Custom Date
            </SafeButton>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">245</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+12 this month</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
                <ClipboardCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Attendance Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">94.5%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+2.1% this week</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20">
                <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average GPA</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">3.2</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+0.3 improvement</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/20">
                <GraduationCap className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Teachers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">32</p>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-gray-600">4.3 avg rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <SafeCard key={report.id} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                      <report.icon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {report.title}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(report.category)}`}>
                        {report.category}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {report.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 mb-4">
                  <span>Last updated: {formatLastUpdated(report.lastUpdated)}</span>
                  <span className="capitalize">{report.type}</span>
                </div>
                
                <div className="flex space-x-2">
                  <SafeButton
                    onClick={() => handleViewReport(report)}
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </SafeButton>
                  <SafeButton
                    onClick={() => handleDownloadReport(report)}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </SafeButton>
                </div>
              </div>
            </SafeCard>
          ))}
        </div>

        {/* Report Modal */}
        <SafeModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          title={selectedReport?.title || 'Report Details'}
          size="xl"
        >
          <div className="p-6">
            {selectedReport && (
              <div>
                <div className="mb-6">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {selectedReport.description}
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Report Data Preview</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      This would contain the actual chart, table, or summary data for the {selectedReport.title} report.
                      In a real implementation, this would render the appropriate visualization based on the report type.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <SafeButton
                    variant="outline"
                    onClick={() => setShowReportModal(false)}
                  >
                    Close
                  </SafeButton>
                  <SafeButton
                    onClick={() => handleDownloadReport(selectedReport)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </SafeButton>
                </div>
              </div>
            )}
          </div>
        </SafeModal>
      </div>
    </div>
  );
}
