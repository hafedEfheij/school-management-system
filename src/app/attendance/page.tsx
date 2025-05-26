'use client';

import React, { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNotification } from '@/contexts/NotificationContext';
import SearchInput from '@/components/ui/search-input';
import FilterPanel, { FilterGroup } from '@/components/ui/filter-panel';
import ExportButton from '@/components/ui/export-button';
import BulkActions from '@/components/ui/bulk-actions';
import SafeDataGrid, { Column } from '@/components/ui/safe-data-grid';
import SafeButton from '@/components/ui/safe-button';
import SafeModal from '@/components/ui/safe-modal';
import { Calendar, Check, X, Clock, AlertTriangle, Users, FileText } from 'lucide-react';

// Mock attendance data
interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  arrivalTime?: string;
  notes?: string;
  recordedBy: string;
  recordedAt: string;
}

const mockAttendance: AttendanceRecord[] = [
  {
    id: '1',
    studentId: 'STU001',
    studentName: 'John Doe',
    courseId: 'MATH101',
    courseName: 'Algebra I',
    date: '2024-01-15',
    status: 'present',
    arrivalTime: '09:00',
    recordedBy: 'Dr. Sarah Johnson',
    recordedAt: '2024-01-15T09:05:00Z',
  },
  {
    id: '2',
    studentId: 'STU002',
    studentName: 'Alice Smith',
    courseId: 'MATH101',
    courseName: 'Algebra I',
    date: '2024-01-15',
    status: 'late',
    arrivalTime: '09:15',
    notes: 'Traffic delay',
    recordedBy: 'Dr. Sarah Johnson',
    recordedAt: '2024-01-15T09:20:00Z',
  },
  {
    id: '3',
    studentId: 'STU003',
    studentName: 'Mike Johnson',
    courseId: 'PHYS201',
    courseName: 'Physics II',
    date: '2024-01-15',
    status: 'absent',
    notes: 'Sick leave',
    recordedBy: 'Mr. David Wilson',
    recordedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '4',
    studentId: 'STU004',
    studentName: 'Emma Wilson',
    courseId: 'ENG301',
    courseName: 'Advanced Literature',
    date: '2024-01-15',
    status: 'excused',
    notes: 'Medical appointment',
    recordedBy: 'Ms. Emily Brown',
    recordedAt: '2024-01-15T14:00:00Z',
  },
  {
    id: '5',
    studentId: 'STU001',
    studentName: 'John Doe',
    courseId: 'PHYS201',
    courseName: 'Physics II',
    date: '2024-01-16',
    status: 'present',
    arrivalTime: '10:00',
    recordedBy: 'Mr. David Wilson',
    recordedAt: '2024-01-16T10:05:00Z',
  },
];

export default function AttendancePage() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { addNotification } = useNotification();
  
  const [attendance] = useState<AttendanceRecord[]>(mockAttendance);
  const [filteredAttendance, setFilteredAttendance] = useState<AttendanceRecord[]>(mockAttendance);
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Filter configuration
  const filterGroups: FilterGroup[] = [
    {
      id: 'status',
      label: 'Status',
      type: 'checkbox',
      options: [
        { id: 'present', label: 'Present', value: 'present', count: 2 },
        { id: 'absent', label: 'Absent', value: 'absent', count: 1 },
        { id: 'late', label: 'Late', value: 'late', count: 1 },
        { id: 'excused', label: 'Excused', value: 'excused', count: 1 },
      ],
    },
    {
      id: 'course',
      label: 'Course',
      type: 'select',
      options: [
        { id: 'math101', label: 'Algebra I', value: 'MATH101', count: 2 },
        { id: 'phys201', label: 'Physics II', value: 'PHYS201', count: 2 },
        { id: 'eng301', label: 'Advanced Literature', value: 'ENG301', count: 1 },
      ],
    },
    {
      id: 'date',
      label: 'Date Range',
      type: 'dateRange',
      defaultValue: {
        start: '2024-01-01',
        end: '2024-12-31',
      },
    },
  ];

  // Apply filters and search
  const applyFiltersAndSearch = useMemo(() => {
    let result = attendance;

    // Apply search
    if (searchQuery) {
      result = result.filter(record =>
        record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.courseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.studentId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (filters.status && filters.status.length > 0) {
      result = result.filter(record => filters.status.includes(record.status));
    }

    if (filters.course) {
      result = result.filter(record => record.courseId === filters.course);
    }

    if (filters.date) {
      const { start, end } = filters.date;
      result = result.filter(record => {
        const recordDate = new Date(record.date);
        const startDate = new Date(start);
        const endDate = new Date(end);
        return recordDate >= startDate && recordDate <= endDate;
      });
    }

    return result;
  }, [attendance, searchQuery, filters]);

  React.useEffect(() => {
    setFilteredAttendance(applyFiltersAndSearch);
  }, [applyFiltersAndSearch]);

  // Data grid columns
  const columns: Column<AttendanceRecord>[] = [
    {
      key: 'student',
      header: 'Student',
      cell: (record) => (
        <div>
          <div className="font-medium">{record.studentName}</div>
          <div className="text-sm text-gray-500">{record.studentId}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'course',
      header: 'Course',
      cell: (record) => (
        <div>
          <div className="font-medium">{record.courseName}</div>
          <div className="text-sm text-gray-500">{record.courseId}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'date',
      header: 'Date',
      cell: (record) => (
        <div className="text-sm">
          {new Date(record.date).toLocaleDateString()}
        </div>
      ),
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (record) => {
        const statusConfig = {
          present: { icon: Check, color: 'text-green-600', bg: 'bg-green-100', label: 'Present' },
          absent: { icon: X, color: 'text-red-600', bg: 'bg-red-100', label: 'Absent' },
          late: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Late' },
          excused: { icon: AlertTriangle, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Excused' },
        };
        
        const config = statusConfig[record.status];
        const Icon = config.icon;
        
        return (
          <div className="flex items-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
              <Icon className="h-3 w-3 mr-1" />
              {config.label}
            </span>
          </div>
        );
      },
      sortable: true,
    },
    {
      key: 'time',
      header: 'Arrival Time',
      cell: (record) => (
        <div className="text-sm">
          {record.arrivalTime || '-'}
        </div>
      ),
    },
    {
      key: 'notes',
      header: 'Notes',
      cell: (record) => (
        <div className="text-sm text-gray-600 max-w-xs truncate">
          {record.notes || '-'}
        </div>
      ),
    },
    {
      key: 'recordedBy',
      header: 'Recorded By',
      cell: (record) => (
        <div className="text-sm">
          {record.recordedBy}
        </div>
      ),
    },
  ];

  // Event handlers
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filterId: string, value: any) => {
    setFilters(prev => ({ ...prev, [filterId]: value }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleSelectionChange = (keys: (string | number)[]) => {
    setSelectedRecords(keys as string[]);
  };

  const handleBulkAction = (actionId: string, selectedItems: any[]) => {
    addNotification({
      type: 'info',
      title: 'Bulk Action',
      message: `Performed ${actionId} on ${selectedItems.length} attendance records`,
    });
  };

  const handleExport = (format: string, data: any[]) => {
    addNotification({
      type: 'success',
      title: 'Export Started',
      message: `Exporting ${data.length} attendance records to ${format.toUpperCase()}`,
    });
  };

  const handleMarkAttendance = () => {
    setShowMarkModal(true);
  };

  const handleGenerateReport = () => {
    setShowReportModal(true);
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
              Attendance Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track and manage student attendance records
            </p>
          </div>
          <div className="flex space-x-3">
            <SafeButton
              onClick={handleGenerateReport}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </SafeButton>
            <SafeButton
              onClick={handleMarkAttendance}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Mark Attendance
            </SafeButton>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-3">
            <SearchInput
              placeholder="Search by student name, course, or ID..."
              onSearch={handleSearch}
              className="w-full"
            />
          </div>
          <div>
            <FilterPanel
              filters={filterGroups}
              values={filters}
              onChange={handleFilterChange}
              onClear={handleClearFilters}
            />
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedRecords.length > 0 && (
          <BulkActions
            selectedItems={selectedRecords}
            totalItems={filteredAttendance.length}
            onAction={handleBulkAction}
            onSelectAll={() => setSelectedRecords(filteredAttendance.map(r => r.id))}
            onDeselectAll={() => setSelectedRecords([])}
            className="mb-6"
          />
        )}

        {/* Export Button */}
        <div className="flex justify-end mb-4">
          <ExportButton
            data={filteredAttendance}
            filename="attendance"
            onExport={handleExport}
            formats={['csv', 'excel', 'pdf']}
          />
        </div>

        {/* Data Grid */}
        <SafeDataGrid
          data={filteredAttendance}
          columns={columns}
          keyExtractor={(record) => record.id}
          selectable
          selectedKeys={selectedRecords}
          onSelectionChange={handleSelectionChange}
          sortable
          paginated
          pageSize={10}
          emptyMessage="No attendance records found"
          className="bg-white dark:bg-gray-800 rounded-lg shadow"
        />

        {/* Mark Attendance Modal */}
        <SafeModal
          isOpen={showMarkModal}
          onClose={() => setShowMarkModal(false)}
          title="Mark Attendance"
          size="lg"
        >
          <div className="p-6">
            <p>Mark attendance form would go here...</p>
            <div className="flex justify-end space-x-3 mt-6">
              <SafeButton
                variant="outline"
                onClick={() => setShowMarkModal(false)}
              >
                Cancel
              </SafeButton>
              <SafeButton
                onClick={() => {
                  setShowMarkModal(false);
                  addNotification({
                    type: 'success',
                    title: 'Attendance Marked',
                    message: 'Attendance has been successfully recorded',
                  });
                }}
              >
                Save Attendance
              </SafeButton>
            </div>
          </div>
        </SafeModal>

        {/* Generate Report Modal */}
        <SafeModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          title="Generate Attendance Report"
          size="lg"
        >
          <div className="p-6">
            <p>Report generation options would go here...</p>
            <div className="flex justify-end space-x-3 mt-6">
              <SafeButton
                variant="outline"
                onClick={() => setShowReportModal(false)}
              >
                Cancel
              </SafeButton>
              <SafeButton
                onClick={() => {
                  setShowReportModal(false);
                  addNotification({
                    type: 'success',
                    title: 'Report Generated',
                    message: 'Attendance report has been generated successfully',
                  });
                }}
              >
                Generate Report
              </SafeButton>
            </div>
          </div>
        </SafeModal>
      </div>
    </div>
  );
}
