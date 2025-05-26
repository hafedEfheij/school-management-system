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
import { Plus, Edit, Trash2, Eye, BookOpen, Clock, Users } from 'lucide-react';

// Mock course data
interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  department: string;
  credits: number;
  duration: number; // in weeks
  teacherId: string;
  teacherName: string;
  maxStudents: number;
  enrolledStudents: number;
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
    room: string;
  }[];
  status: 'active' | 'inactive' | 'completed';
  semester: string;
  year: number;
}

const mockCourses: Course[] = [
  {
    id: '1',
    code: 'MATH101',
    name: 'Algebra I',
    description: 'Introduction to algebraic concepts and problem solving',
    department: 'Mathematics',
    credits: 3,
    duration: 16,
    teacherId: '1',
    teacherName: 'Dr. Sarah Johnson',
    maxStudents: 30,
    enrolledStudents: 28,
    schedule: [
      { day: 'Monday', startTime: '09:00', endTime: '10:30', room: 'Room 101' },
      { day: 'Wednesday', startTime: '09:00', endTime: '10:30', room: 'Room 101' },
      { day: 'Friday', startTime: '09:00', endTime: '10:30', room: 'Room 101' },
    ],
    status: 'active',
    semester: 'Fall',
    year: 2024,
  },
  {
    id: '2',
    code: 'PHYS201',
    name: 'Physics II',
    description: 'Advanced physics concepts including electromagnetism',
    department: 'Science',
    credits: 4,
    duration: 16,
    teacherId: '2',
    teacherName: 'Mr. David Wilson',
    maxStudents: 25,
    enrolledStudents: 22,
    schedule: [
      { day: 'Tuesday', startTime: '10:00', endTime: '11:30', room: 'Lab 201' },
      { day: 'Thursday', startTime: '10:00', endTime: '11:30', room: 'Lab 201' },
    ],
    status: 'active',
    semester: 'Fall',
    year: 2024,
  },
  {
    id: '3',
    code: 'ENG301',
    name: 'Advanced Literature',
    description: 'Study of classical and modern literature',
    department: 'English',
    credits: 3,
    duration: 16,
    teacherId: '3',
    teacherName: 'Ms. Emily Brown',
    maxStudents: 20,
    enrolledStudents: 18,
    schedule: [
      { day: 'Monday', startTime: '14:00', endTime: '15:30', room: 'Room 301' },
      { day: 'Wednesday', startTime: '14:00', endTime: '15:30', room: 'Room 301' },
    ],
    status: 'active',
    semester: 'Fall',
    year: 2024,
  },
  {
    id: '4',
    code: 'HIST401',
    name: 'World History',
    description: 'Comprehensive study of world civilizations',
    department: 'History',
    credits: 3,
    duration: 16,
    teacherId: '4',
    teacherName: 'Mr. Michael Davis',
    maxStudents: 35,
    enrolledStudents: 0,
    schedule: [],
    status: 'inactive',
    semester: 'Spring',
    year: 2025,
  },
  {
    id: '5',
    code: 'ART101',
    name: 'Introduction to Art',
    description: 'Basic principles of visual arts and design',
    department: 'Art',
    credits: 2,
    duration: 12,
    teacherId: '5',
    teacherName: 'Ms. Lisa Garcia',
    maxStudents: 15,
    enrolledStudents: 15,
    schedule: [
      { day: 'Friday', startTime: '13:00', endTime: '16:00', room: 'Art Studio' },
    ],
    status: 'completed',
    semester: 'Summer',
    year: 2024,
  },
];

export default function CoursesPage() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { addNotification } = useNotification();

  const [courses] = useState<Course[]>(mockCourses);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(mockCourses);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Filter configuration
  const filterGroups: FilterGroup[] = [
    {
      id: 'department',
      label: 'Department',
      type: 'select',
      options: [
        { id: 'mathematics', label: 'Mathematics', value: 'Mathematics', count: 1 },
        { id: 'science', label: 'Science', value: 'Science', count: 1 },
        { id: 'english', label: 'English', value: 'English', count: 1 },
        { id: 'history', label: 'History', value: 'History', count: 1 },
        { id: 'art', label: 'Art', value: 'Art', count: 1 },
      ],
    },
    {
      id: 'status',
      label: 'Status',
      type: 'radio',
      options: [
        { id: 'active', label: 'Active', value: 'active', count: 3 },
        { id: 'inactive', label: 'Inactive', value: 'inactive', count: 1 },
        { id: 'completed', label: 'Completed', value: 'completed', count: 1 },
      ],
    },
    {
      id: 'semester',
      label: 'Semester',
      type: 'checkbox',
      options: [
        { id: 'fall', label: 'Fall', value: 'Fall', count: 3 },
        { id: 'spring', label: 'Spring', value: 'Spring', count: 1 },
        { id: 'summer', label: 'Summer', value: 'Summer', count: 1 },
      ],
    },
    {
      id: 'credits',
      label: 'Credits',
      type: 'range',
      min: 1,
      max: 5,
      step: 1,
      defaultValue: 5,
    },
  ];

  // Apply filters and search
  const applyFiltersAndSearch = useMemo(() => {
    let result = courses;

    // Apply search
    if (searchQuery) {
      result = result.filter(course =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (filters.department) {
      result = result.filter(course => course.department === filters.department);
    }

    if (filters.status) {
      result = result.filter(course => course.status === filters.status);
    }

    if (filters.semester && filters.semester.length > 0) {
      result = result.filter(course => filters.semester.includes(course.semester));
    }

    if (filters.credits !== undefined) {
      result = result.filter(course => course.credits <= filters.credits);
    }

    return result;
  }, [courses, searchQuery, filters]);

  React.useEffect(() => {
    setFilteredCourses(applyFiltersAndSearch);
  }, [applyFiltersAndSearch]);

  // Data grid columns
  const columns: Column<Course>[] = [
    {
      key: 'code',
      header: 'Course Code',
      cell: (course) => (
        <span className="font-mono text-sm font-medium">{course.code}</span>
      ),
      sortable: true,
    },
    {
      key: 'name',
      header: 'Course Name',
      cell: (course) => (
        <div>
          <div className="font-medium">{course.name}</div>
          <div className="text-sm text-gray-500 truncate max-w-xs">{course.description}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'teacher',
      header: 'Teacher',
      cell: (course) => (
        <div>
          <div className="font-medium">{course.teacherName}</div>
          <div className="text-sm text-gray-500">{course.department}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'enrollment',
      header: 'Enrollment',
      cell: (course) => (
        <div className="text-center">
          <div className="font-medium">{course.enrolledStudents}/{course.maxStudents}</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${(course.enrolledStudents / course.maxStudents) * 100}%` }}
            ></div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'details',
      header: 'Details',
      cell: (course) => (
        <div className="text-sm">
          <div className="flex items-center mb-1">
            <BookOpen className="h-3 w-3 mr-1" />
            <span>{course.credits} credits</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>{course.duration} weeks</span>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (course) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          course.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
          course.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
          'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
        }`}>
          {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (course) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewCourse(course)}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEditCourse(course)}
            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteCourse(course)}
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
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
    setSelectedCourses(keys as string[]);
  };

  const handleBulkAction = (actionId: string, selectedItems: any[]) => {
    addNotification({
      type: 'info',
      title: 'Bulk Action',
      message: `Performed ${actionId} on ${selectedItems.length} courses`,
    });
  };

  const handleExport = (format: string, data: any[]) => {
    addNotification({
      type: 'success',
      title: 'Export Started',
      message: `Exporting ${data.length} courses to ${format.toUpperCase()}`,
    });
  };

  const handleViewCourse = (course: Course) => {
    setSelectedCourse(course);
    addNotification({
      type: 'info',
      title: 'Course Details',
      message: `Viewing details for ${course.name}`,
    });
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setShowEditModal(true);
  };

  const handleDeleteCourse = (course: Course) => {
    addNotification({
      type: 'warning',
      title: 'Delete Course',
      message: `Are you sure you want to delete ${course.name}?`,
    });
  };

  const handleAddCourse = () => {
    setShowAddModal(true);
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
              Course Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage courses, schedules, and enrollment
            </p>
          </div>
          <SafeButton
            onClick={handleAddCourse}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </SafeButton>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-3">
            <SearchInput
              placeholder="Search courses by name, code, teacher, or department..."
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
        {selectedCourses.length > 0 && (
          <BulkActions
            selectedItems={selectedCourses}
            totalItems={filteredCourses.length}
            onAction={handleBulkAction}
            onSelectAll={() => setSelectedCourses(filteredCourses.map(c => c.id))}
            onDeselectAll={() => setSelectedCourses([])}
            className="mb-6"
          />
        )}

        {/* Export Button */}
        <div className="flex justify-end mb-4">
          <ExportButton
            data={filteredCourses}
            filename="courses"
            onExport={handleExport}
            formats={['csv', 'excel', 'pdf']}
          />
        </div>

        {/* Data Grid */}
        <SafeDataGrid
          data={filteredCourses}
          columns={columns}
          keyExtractor={(course) => course.id}
          selectable
          selectedKeys={selectedCourses}
          onSelectionChange={handleSelectionChange}
          sortable
          paginated
          pageSize={10}
          emptyMessage="No courses found"
          className="bg-white dark:bg-gray-800 rounded-lg shadow"
        />

        {/* Add Course Modal */}
        <SafeModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Course"
          size="lg"
        >
          <div className="p-6">
            <p>Add course form would go here...</p>
            <div className="flex justify-end space-x-3 mt-6">
              <SafeButton
                variant="outline"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </SafeButton>
              <SafeButton
                onClick={() => {
                  setShowAddModal(false);
                  addNotification({
                    type: 'success',
                    title: 'Course Added',
                    message: 'New course has been successfully added',
                  });
                }}
              >
                Add Course
              </SafeButton>
            </div>
          </div>
        </SafeModal>

        {/* Edit Course Modal */}
        <SafeModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Course"
          size="lg"
        >
          <div className="p-6">
            <p>Edit course form would go here...</p>
            <div className="flex justify-end space-x-3 mt-6">
              <SafeButton
                variant="outline"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </SafeButton>
              <SafeButton
                onClick={() => {
                  setShowEditModal(false);
                  addNotification({
                    type: 'success',
                    title: 'Course Updated',
                    message: 'Course information has been successfully updated',
                  });
                }}
              >
                Save Changes
              </SafeButton>
            </div>
          </div>
        </SafeModal>
      </div>
    </div>
  );
}
