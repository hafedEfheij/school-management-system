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
import { Plus, Edit, Trash2, TrendingUp, TrendingDown, BarChart3, FileText } from 'lucide-react';

// Mock grades data
interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  assignmentName: string;
  assignmentType: 'homework' | 'quiz' | 'exam' | 'project' | 'participation';
  score: number;
  maxScore: number;
  percentage: number;
  letterGrade: string;
  date: string;
  gradedBy: string;
  feedback?: string;
}

const mockGrades: Grade[] = [
  {
    id: '1',
    studentId: 'STU001',
    studentName: 'John Doe',
    courseId: 'MATH101',
    courseName: 'Algebra I',
    assignmentName: 'Midterm Exam',
    assignmentType: 'exam',
    score: 85,
    maxScore: 100,
    percentage: 85,
    letterGrade: 'B',
    date: '2024-01-15',
    gradedBy: 'Dr. Sarah Johnson',
    feedback: 'Good understanding of concepts, minor calculation errors.',
  },
  {
    id: '2',
    studentId: 'STU002',
    studentName: 'Alice Smith',
    courseId: 'MATH101',
    courseName: 'Algebra I',
    assignmentName: 'Homework 5',
    assignmentType: 'homework',
    score: 18,
    maxScore: 20,
    percentage: 90,
    letterGrade: 'A-',
    date: '2024-01-12',
    gradedBy: 'Dr. Sarah Johnson',
  },
  {
    id: '3',
    studentId: 'STU003',
    studentName: 'Mike Johnson',
    courseId: 'PHYS201',
    courseName: 'Physics II',
    assignmentName: 'Lab Report 3',
    assignmentType: 'project',
    score: 92,
    maxScore: 100,
    percentage: 92,
    letterGrade: 'A-',
    date: '2024-01-14',
    gradedBy: 'Mr. David Wilson',
    feedback: 'Excellent analysis and presentation.',
  },
  {
    id: '4',
    studentId: 'STU004',
    studentName: 'Emma Wilson',
    courseId: 'ENG301',
    courseName: 'Advanced Literature',
    assignmentName: 'Essay Analysis',
    assignmentType: 'project',
    score: 88,
    maxScore: 100,
    percentage: 88,
    letterGrade: 'B+',
    date: '2024-01-13',
    gradedBy: 'Ms. Emily Brown',
    feedback: 'Strong arguments, could improve conclusion.',
  },
  {
    id: '5',
    studentId: 'STU001',
    studentName: 'John Doe',
    courseId: 'PHYS201',
    courseName: 'Physics II',
    assignmentName: 'Quiz 2',
    assignmentType: 'quiz',
    score: 15,
    maxScore: 20,
    percentage: 75,
    letterGrade: 'C+',
    date: '2024-01-16',
    gradedBy: 'Mr. David Wilson',
  },
];

export default function GradesPage() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { addNotification } = useNotification();
  
  const [grades] = useState<Grade[]>(mockGrades);
  const [filteredGrades, setFilteredGrades] = useState<Grade[]>(mockGrades);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);

  // Filter configuration
  const filterGroups: FilterGroup[] = [
    {
      id: 'assignmentType',
      label: 'Assignment Type',
      type: 'checkbox',
      options: [
        { id: 'homework', label: 'Homework', value: 'homework', count: 1 },
        { id: 'quiz', label: 'Quiz', value: 'quiz', count: 1 },
        { id: 'exam', label: 'Exam', value: 'exam', count: 1 },
        { id: 'project', label: 'Project', value: 'project', count: 2 },
        { id: 'participation', label: 'Participation', value: 'participation', count: 0 },
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
      id: 'letterGrade',
      label: 'Letter Grade',
      type: 'checkbox',
      options: [
        { id: 'a', label: 'A/A-', value: 'A', count: 2 },
        { id: 'b', label: 'B/B+', value: 'B', count: 2 },
        { id: 'c', label: 'C/C+', value: 'C', count: 1 },
        { id: 'd', label: 'D/D+', value: 'D', count: 0 },
        { id: 'f', label: 'F', value: 'F', count: 0 },
      ],
    },
    {
      id: 'percentage',
      label: 'Score Range (%)',
      type: 'range',
      min: 0,
      max: 100,
      step: 5,
      defaultValue: 100,
    },
  ];

  // Apply filters and search
  const applyFiltersAndSearch = useMemo(() => {
    let result = grades;

    // Apply search
    if (searchQuery) {
      result = result.filter(grade =>
        grade.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        grade.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        grade.assignmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        grade.courseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        grade.studentId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (filters.assignmentType && filters.assignmentType.length > 0) {
      result = result.filter(grade => filters.assignmentType.includes(grade.assignmentType));
    }

    if (filters.course) {
      result = result.filter(grade => grade.courseId === filters.course);
    }

    if (filters.letterGrade && filters.letterGrade.length > 0) {
      result = result.filter(grade => 
        filters.letterGrade.some((lg: string) => grade.letterGrade.startsWith(lg))
      );
    }

    if (filters.percentage !== undefined) {
      result = result.filter(grade => grade.percentage <= filters.percentage);
    }

    return result;
  }, [grades, searchQuery, filters]);

  React.useEffect(() => {
    setFilteredGrades(applyFiltersAndSearch);
  }, [applyFiltersAndSearch]);

  // Data grid columns
  const columns: Column<Grade>[] = [
    {
      key: 'student',
      header: 'Student',
      cell: (grade) => (
        <div>
          <div className="font-medium">{grade.studentName}</div>
          <div className="text-sm text-gray-500">{grade.studentId}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'course',
      header: 'Course',
      cell: (grade) => (
        <div>
          <div className="font-medium">{grade.courseName}</div>
          <div className="text-sm text-gray-500">{grade.courseId}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'assignment',
      header: 'Assignment',
      cell: (grade) => (
        <div>
          <div className="font-medium">{grade.assignmentName}</div>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            grade.assignmentType === 'exam' ? 'bg-red-100 text-red-800' :
            grade.assignmentType === 'project' ? 'bg-blue-100 text-blue-800' :
            grade.assignmentType === 'quiz' ? 'bg-yellow-100 text-yellow-800' :
            grade.assignmentType === 'homework' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {grade.assignmentType.charAt(0).toUpperCase() + grade.assignmentType.slice(1)}
          </span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'score',
      header: 'Score',
      cell: (grade) => (
        <div className="text-center">
          <div className="font-medium text-lg">{grade.score}/{grade.maxScore}</div>
          <div className="text-sm text-gray-500">{grade.percentage}%</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'letterGrade',
      header: 'Grade',
      cell: (grade) => (
        <div className="text-center">
          <span className={`inline-flex items-center justify-center w-12 h-12 rounded-full text-lg font-bold ${
            grade.letterGrade.startsWith('A') ? 'bg-green-100 text-green-800' :
            grade.letterGrade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
            grade.letterGrade.startsWith('C') ? 'bg-yellow-100 text-yellow-800' :
            grade.letterGrade.startsWith('D') ? 'bg-orange-100 text-orange-800' :
            'bg-red-100 text-red-800'
          }`}>
            {grade.letterGrade}
          </span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'date',
      header: 'Date',
      cell: (grade) => (
        <div className="text-sm">
          {new Date(grade.date).toLocaleDateString()}
        </div>
      ),
      sortable: true,
    },
    {
      key: 'trend',
      header: 'Trend',
      cell: (grade) => {
        // Mock trend calculation
        const trend = grade.percentage >= 85 ? 'up' : grade.percentage >= 70 ? 'stable' : 'down';
        return (
          <div className="flex justify-center">
            {trend === 'up' && <TrendingUp className="h-5 w-5 text-green-500" />}
            {trend === 'down' && <TrendingDown className="h-5 w-5 text-red-500" />}
            {trend === 'stable' && <div className="h-5 w-5 bg-gray-300 rounded-full"></div>}
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (grade) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleEditGrade(grade)}
            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteGrade(grade)}
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
    setSelectedGrades(keys as string[]);
  };

  const handleBulkAction = (actionId: string, selectedItems: any[]) => {
    addNotification({
      type: 'info',
      title: 'Bulk Action',
      message: `Performed ${actionId} on ${selectedItems.length} grades`,
    });
  };

  const handleExport = (format: string, data: any[]) => {
    addNotification({
      type: 'success',
      title: 'Export Started',
      message: `Exporting ${data.length} grades to ${format.toUpperCase()}`,
    });
  };

  const handleEditGrade = (grade: Grade) => {
    setSelectedGrade(grade);
    setShowEditModal(true);
  };

  const handleDeleteGrade = (grade: Grade) => {
    addNotification({
      type: 'warning',
      title: 'Delete Grade',
      message: `Are you sure you want to delete this grade for ${grade.studentName}?`,
    });
  };

  const handleAddGrade = () => {
    setShowAddModal(true);
  };

  const handleShowAnalytics = () => {
    setShowAnalyticsModal(true);
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
              Grades Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage student grades and academic performance
            </p>
          </div>
          <div className="flex space-x-3">
            <SafeButton
              onClick={handleShowAnalytics}
              variant="outline"
              className="border-purple-600 text-purple-600 hover:bg-purple-50"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </SafeButton>
            <SafeButton
              onClick={handleAddGrade}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Grade
            </SafeButton>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-3">
            <SearchInput
              placeholder="Search by student name, course, assignment, or ID..."
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
        {selectedGrades.length > 0 && (
          <BulkActions
            selectedItems={selectedGrades}
            totalItems={filteredGrades.length}
            onAction={handleBulkAction}
            onSelectAll={() => setSelectedGrades(filteredGrades.map(g => g.id))}
            onDeselectAll={() => setSelectedGrades([])}
            className="mb-6"
          />
        )}

        {/* Export Button */}
        <div className="flex justify-end mb-4">
          <ExportButton
            data={filteredGrades}
            filename="grades"
            onExport={handleExport}
            formats={['csv', 'excel', 'pdf']}
          />
        </div>

        {/* Data Grid */}
        <SafeDataGrid
          data={filteredGrades}
          columns={columns}
          keyExtractor={(grade) => grade.id}
          selectable
          selectedKeys={selectedGrades}
          onSelectionChange={handleSelectionChange}
          sortable
          paginated
          pageSize={10}
          emptyMessage="No grades found"
          className="bg-white dark:bg-gray-800 rounded-lg shadow"
        />

        {/* Add Grade Modal */}
        <SafeModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Grade"
          size="lg"
        >
          <div className="p-6">
            <p>Add grade form would go here...</p>
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
                    title: 'Grade Added',
                    message: 'New grade has been successfully added',
                  });
                }}
              >
                Add Grade
              </SafeButton>
            </div>
          </div>
        </SafeModal>

        {/* Edit Grade Modal */}
        <SafeModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Grade"
          size="lg"
        >
          <div className="p-6">
            <p>Edit grade form would go here...</p>
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
                    title: 'Grade Updated',
                    message: 'Grade has been successfully updated',
                  });
                }}
              >
                Save Changes
              </SafeButton>
            </div>
          </div>
        </SafeModal>

        {/* Analytics Modal */}
        <SafeModal
          isOpen={showAnalyticsModal}
          onClose={() => setShowAnalyticsModal(false)}
          title="Grade Analytics"
          size="xl"
        >
          <div className="p-6">
            <p>Grade analytics and charts would go here...</p>
            <div className="flex justify-end space-x-3 mt-6">
              <SafeButton
                onClick={() => setShowAnalyticsModal(false)}
              >
                Close
              </SafeButton>
            </div>
          </div>
        </SafeModal>
      </div>
    </div>
  );
}
