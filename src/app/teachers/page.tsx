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
import { UserPlus, Edit, Trash2, Eye, Mail, Phone, GraduationCap } from 'lucide-react';

// Mock teacher data
interface Teacher {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  subjects: string[];
  experience: number;
  qualification: string;
  hireDate: string;
  status: 'active' | 'inactive' | 'on_leave';
  salary: number;
}

const mockTeachers: Teacher[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    firstName: 'Dr. Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@school.com',
    phone: '(555) 123-4567',
    department: 'Mathematics',
    subjects: ['Algebra', 'Calculus', 'Statistics'],
    experience: 8,
    qualification: 'PhD in Mathematics',
    hireDate: '2016-08-15',
    status: 'active',
    salary: 75000,
  },
  {
    id: '2',
    employeeId: 'EMP002',
    firstName: 'Mr. David',
    lastName: 'Wilson',
    email: 'david.wilson@school.com',
    phone: '(555) 234-5678',
    department: 'Science',
    subjects: ['Physics', 'Chemistry'],
    experience: 12,
    qualification: 'MSc in Physics',
    hireDate: '2012-09-01',
    status: 'active',
    salary: 72000,
  },
  {
    id: '3',
    employeeId: 'EMP003',
    firstName: 'Ms. Emily',
    lastName: 'Brown',
    email: 'emily.brown@school.com',
    phone: '(555) 345-6789',
    department: 'English',
    subjects: ['Literature', 'Creative Writing', 'Grammar'],
    experience: 6,
    qualification: 'MA in English Literature',
    hireDate: '2018-01-10',
    status: 'active',
    salary: 68000,
  },
  {
    id: '4',
    employeeId: 'EMP004',
    firstName: 'Mr. Michael',
    lastName: 'Davis',
    email: 'michael.davis@school.com',
    phone: '(555) 456-7890',
    department: 'History',
    subjects: ['World History', 'American History'],
    experience: 15,
    qualification: 'PhD in History',
    hireDate: '2009-08-20',
    status: 'on_leave',
    salary: 78000,
  },
  {
    id: '5',
    employeeId: 'EMP005',
    firstName: 'Ms. Lisa',
    lastName: 'Garcia',
    email: 'lisa.garcia@school.com',
    phone: '(555) 567-8901',
    department: 'Art',
    subjects: ['Drawing', 'Painting', 'Art History'],
    experience: 4,
    qualification: 'BFA in Fine Arts',
    hireDate: '2020-09-01',
    status: 'active',
    salary: 58000,
  },
];

export default function TeachersPage() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { addNotification } = useNotification();

  const [teachers] = useState<Teacher[]>(mockTeachers);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>(mockTeachers);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

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
        { id: 'active', label: 'Active', value: 'active', count: 4 },
        { id: 'inactive', label: 'Inactive', value: 'inactive', count: 0 },
        { id: 'on_leave', label: 'On Leave', value: 'on_leave', count: 1 },
      ],
    },
    {
      id: 'experience',
      label: 'Experience (Years)',
      type: 'range',
      min: 0,
      max: 20,
      step: 1,
      defaultValue: 20,
    },
    {
      id: 'salary',
      label: 'Salary Range',
      type: 'range',
      min: 50000,
      max: 100000,
      step: 5000,
      defaultValue: 100000,
    },
  ];

  // Apply filters and search
  const applyFiltersAndSearch = useMemo(() => {
    let result = teachers;

    // Apply search
    if (searchQuery) {
      result = result.filter(teacher =>
        teacher.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.subjects.some(subject => subject.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply filters
    if (filters.department) {
      result = result.filter(teacher => teacher.department === filters.department);
    }

    if (filters.status) {
      result = result.filter(teacher => teacher.status === filters.status);
    }

    if (filters.experience !== undefined) {
      result = result.filter(teacher => teacher.experience <= filters.experience);
    }

    if (filters.salary !== undefined) {
      result = result.filter(teacher => teacher.salary <= filters.salary);
    }

    return result;
  }, [teachers, searchQuery, filters]);

  React.useEffect(() => {
    setFilteredTeachers(applyFiltersAndSearch);
  }, [applyFiltersAndSearch]);

  // Data grid columns
  const columns: Column<Teacher>[] = [
    {
      key: 'employeeId',
      header: 'Employee ID',
      cell: (teacher) => (
        <span className="font-mono text-sm">{teacher.employeeId}</span>
      ),
      sortable: true,
    },
    {
      key: 'name',
      header: 'Name',
      cell: (teacher) => (
        <div>
          <div className="font-medium">{teacher.firstName} {teacher.lastName}</div>
          <div className="text-sm text-gray-500">{teacher.email}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'department',
      header: 'Department',
      cell: (teacher) => (
        <div>
          <div className="font-medium">{teacher.department}</div>
          <div className="text-sm text-gray-500">{teacher.subjects.join(', ')}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'experience',
      header: 'Experience',
      cell: (teacher) => (
        <div className="text-center">
          <div className="font-medium">{teacher.experience} years</div>
          <div className="text-sm text-gray-500">{teacher.qualification}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (teacher) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          teacher.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
          teacher.status === 'on_leave' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
          'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
        }`}>
          {teacher.status === 'on_leave' ? 'On Leave' : teacher.status.charAt(0).toUpperCase() + teacher.status.slice(1)}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (teacher) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewTeacher(teacher)}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEditTeacher(teacher)}
            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteTeacher(teacher)}
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
    setSelectedTeachers(keys as string[]);
  };

  const handleBulkAction = (actionId: string, selectedItems: any[]) => {
    addNotification({
      type: 'info',
      title: 'Bulk Action',
      message: `Performed ${actionId} on ${selectedItems.length} teachers`,
    });
  };

  const handleExport = (format: string, data: any[]) => {
    addNotification({
      type: 'success',
      title: 'Export Started',
      message: `Exporting ${data.length} teachers to ${format.toUpperCase()}`,
    });
  };

  const handleViewTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    addNotification({
      type: 'info',
      title: 'Teacher Details',
      message: `Viewing details for ${teacher.firstName} ${teacher.lastName}`,
    });
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setShowEditModal(true);
  };

  const handleDeleteTeacher = (teacher: Teacher) => {
    addNotification({
      type: 'warning',
      title: 'Delete Teacher',
      message: `Are you sure you want to delete ${teacher.firstName} ${teacher.lastName}?`,
    });
  };

  const handleAddTeacher = () => {
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
              Teacher Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage teacher profiles, assignments, and schedules
            </p>
          </div>
          <SafeButton
            onClick={handleAddTeacher}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Teacher
          </SafeButton>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-3">
            <SearchInput
              placeholder="Search teachers by name, email, department, or subject..."
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
        {selectedTeachers.length > 0 && (
          <BulkActions
            selectedItems={selectedTeachers}
            totalItems={filteredTeachers.length}
            onAction={handleBulkAction}
            onSelectAll={() => setSelectedTeachers(filteredTeachers.map(t => t.id))}
            onDeselectAll={() => setSelectedTeachers([])}
            className="mb-6"
          />
        )}

        {/* Export Button */}
        <div className="flex justify-end mb-4">
          <ExportButton
            data={filteredTeachers}
            filename="teachers"
            onExport={handleExport}
            formats={['csv', 'excel', 'pdf']}
          />
        </div>

        {/* Data Grid */}
        <SafeDataGrid
          data={filteredTeachers}
          columns={columns}
          keyExtractor={(teacher) => teacher.id}
          selectable
          selectedKeys={selectedTeachers}
          onSelectionChange={handleSelectionChange}
          sortable
          paginated
          pageSize={10}
          emptyMessage="No teachers found"
          className="bg-white dark:bg-gray-800 rounded-lg shadow"
        />

        {/* Add Teacher Modal */}
        <SafeModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Teacher"
          size="lg"
        >
          <div className="p-6">
            <p>Add teacher form would go here...</p>
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
                    title: 'Teacher Added',
                    message: 'New teacher has been successfully added',
                  });
                }}
              >
                Add Teacher
              </SafeButton>
            </div>
          </div>
        </SafeModal>

        {/* Edit Teacher Modal */}
        <SafeModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Teacher"
          size="lg"
        >
          <div className="p-6">
            <p>Edit teacher form would go here...</p>
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
                    title: 'Teacher Updated',
                    message: 'Teacher information has been successfully updated',
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
