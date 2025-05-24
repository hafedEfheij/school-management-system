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
import { UserPlus, Edit, Trash2, Eye, Mail, Phone } from 'lucide-react';

// Mock student data
interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  grade: string;
  section: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated';
  gpa: number;
  parentName: string;
  parentPhone: string;
}

const mockStudents: Student[] = [
  {
    id: '1',
    studentId: 'STU001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@student.school.com',
    phone: '(555) 123-4567',
    grade: '10',
    section: 'A',
    enrollmentDate: '2023-09-01',
    status: 'active',
    gpa: 3.8,
    parentName: 'Jane Doe',
    parentPhone: '(555) 123-4568',
  },
  {
    id: '2',
    studentId: 'STU002',
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice.smith@student.school.com',
    phone: '(555) 234-5678',
    grade: '11',
    section: 'B',
    enrollmentDate: '2022-09-01',
    status: 'active',
    gpa: 3.9,
    parentName: 'Bob Smith',
    parentPhone: '(555) 234-5679',
  },
  {
    id: '3',
    studentId: 'STU003',
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@student.school.com',
    phone: '(555) 345-6789',
    grade: '12',
    section: 'A',
    enrollmentDate: '2021-09-01',
    status: 'active',
    gpa: 3.7,
    parentName: 'Sarah Johnson',
    parentPhone: '(555) 345-6790',
  },
  {
    id: '4',
    studentId: 'STU004',
    firstName: 'Emma',
    lastName: 'Wilson',
    email: 'emma.wilson@student.school.com',
    phone: '(555) 456-7890',
    grade: '9',
    section: 'C',
    enrollmentDate: '2024-09-01',
    status: 'active',
    gpa: 4.0,
    parentName: 'David Wilson',
    parentPhone: '(555) 456-7891',
  },
  {
    id: '5',
    studentId: 'STU005',
    firstName: 'James',
    lastName: 'Brown',
    email: 'james.brown@student.school.com',
    phone: '(555) 567-8901',
    grade: '12',
    section: 'B',
    enrollmentDate: '2021-09-01',
    status: 'graduated',
    gpa: 3.6,
    parentName: 'Lisa Brown',
    parentPhone: '(555) 567-8902',
  },
];

export default function StudentsPage() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { addNotification } = useNotification();

  const [students] = useState<Student[]>(mockStudents);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(mockStudents);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Filter configuration
  const filterGroups: FilterGroup[] = [
    {
      id: 'grade',
      label: 'Grade',
      type: 'select',
      options: [
        { id: '9', label: 'Grade 9', value: '9', count: 1 },
        { id: '10', label: 'Grade 10', value: '10', count: 1 },
        { id: '11', label: 'Grade 11', value: '11', count: 1 },
        { id: '12', label: 'Grade 12', value: '12', count: 2 },
      ],
    },
    {
      id: 'section',
      label: 'Section',
      type: 'checkbox',
      options: [
        { id: 'A', label: 'Section A', value: 'A', count: 2 },
        { id: 'B', label: 'Section B', value: 'B', count: 2 },
        { id: 'C', label: 'Section C', value: 'C', count: 1 },
      ],
    },
    {
      id: 'status',
      label: 'Status',
      type: 'radio',
      options: [
        { id: 'active', label: 'Active', value: 'active', count: 4 },
        { id: 'inactive', label: 'Inactive', value: 'inactive', count: 0 },
        { id: 'graduated', label: 'Graduated', value: 'graduated', count: 1 },
      ],
    },
    {
      id: 'gpa',
      label: 'GPA Range',
      type: 'range',
      min: 0,
      max: 4,
      step: 0.1,
      defaultValue: 4,
    },
  ];

  // Apply filters and search
  const applyFiltersAndSearch = useMemo(() => {
    let result = students;

    // Apply search
    if (searchQuery) {
      result = result.filter(student =>
        student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (filters.grade) {
      result = result.filter(student => student.grade === filters.grade);
    }

    if (filters.section && filters.section.length > 0) {
      result = result.filter(student => filters.section.includes(student.section));
    }

    if (filters.status) {
      result = result.filter(student => student.status === filters.status);
    }

    if (filters.gpa !== undefined) {
      result = result.filter(student => student.gpa <= filters.gpa);
    }

    return result;
  }, [students, searchQuery, filters]);

  React.useEffect(() => {
    setFilteredStudents(applyFiltersAndSearch);
  }, [applyFiltersAndSearch]);

  // Data grid columns
  const columns: Column<Student>[] = [
    {
      key: 'studentId',
      header: 'Student ID',
      cell: (student) => (
        <span className="font-mono text-sm">{student.studentId}</span>
      ),
      sortable: true,
    },
    {
      key: 'name',
      header: 'Name',
      cell: (student) => (
        <div>
          <div className="font-medium">{student.firstName} {student.lastName}</div>
          <div className="text-sm text-gray-500">{student.email}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'grade',
      header: 'Grade & Section',
      cell: (student) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
          Grade {student.grade} - {student.section}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'gpa',
      header: 'GPA',
      cell: (student) => (
        <span className={`font-medium ${
          student.gpa >= 3.5 ? 'text-green-600 dark:text-green-400' :
          student.gpa >= 3.0 ? 'text-yellow-600 dark:text-yellow-400' :
          'text-red-600 dark:text-red-400'
        }`}>
          {student.gpa.toFixed(1)}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (student) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          student.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
          student.status === 'graduated' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
          'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
        }`}>
          {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (student) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewStudent(student)}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEditStudent(student)}
            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteStudent(student)}
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
    setSelectedStudents(keys as string[]);
  };

  const handleBulkAction = (actionId: string, selectedItems: any[]) => {
    addNotification({
      type: 'info',
      title: 'Bulk Action',
      message: `Performed ${actionId} on ${selectedItems.length} students`,
    });
  };

  const handleExport = (format: string, data: any[]) => {
    addNotification({
      type: 'success',
      title: 'Export Started',
      message: `Exporting ${data.length} students to ${format.toUpperCase()}`,
    });
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    addNotification({
      type: 'info',
      title: 'Student Details',
      message: `Viewing details for ${student.firstName} ${student.lastName}`,
    });
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowEditModal(true);
  };

  const handleDeleteStudent = (student: Student) => {
    addNotification({
      type: 'warning',
      title: 'Delete Student',
      message: `Are you sure you want to delete ${student.firstName} ${student.lastName}?`,
    });
  };

  const handleAddStudent = () => {
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
              Student Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage student records, grades, and information
            </p>
          </div>
          <SafeButton
            onClick={handleAddStudent}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Student
          </SafeButton>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-3">
            <SearchInput
              placeholder="Search students by name, email, or ID..."
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
        {selectedStudents.length > 0 && (
          <BulkActions
            selectedItems={selectedStudents}
            totalItems={filteredStudents.length}
            onAction={handleBulkAction}
            onSelectAll={() => setSelectedStudents(filteredStudents.map(s => s.id))}
            onDeselectAll={() => setSelectedStudents([])}
            className="mb-6"
          />
        )}

        {/* Export Button */}
        <div className="flex justify-end mb-4">
          <ExportButton
            data={filteredStudents}
            filename="students"
            onExport={handleExport}
            formats={['csv', 'excel', 'pdf']}
          />
        </div>

        {/* Data Grid */}
        <SafeDataGrid
          data={filteredStudents}
          columns={columns}
          keyExtractor={(student) => student.id}
          selectable
          selectedKeys={selectedStudents}
          onSelectionChange={handleSelectionChange}
          sortable
          paginated
          pageSize={10}
          emptyMessage="No students found"
          className="bg-white dark:bg-gray-800 rounded-lg shadow"
        />

        {/* Add Student Modal */}
        <SafeModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Student"
          size="lg"
        >
          <div className="p-6">
            <p>Add student form would go here...</p>
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
                    title: 'Student Added',
                    message: 'New student has been successfully added',
                  });
                }}
              >
                Add Student
              </SafeButton>
            </div>
          </div>
        </SafeModal>

        {/* Edit Student Modal */}
        <SafeModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Student"
          size="lg"
        >
          <div className="p-6">
            <p>Edit student form would go here...</p>
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
                    title: 'Student Updated',
                    message: 'Student information has been successfully updated',
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
