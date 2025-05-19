'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  SortAsc,
  SortDesc,
  Mail,
  Phone,
  BookOpen
} from 'lucide-react';

// Mock teacher data
const MOCK_TEACHERS = [
  { id: 1, name: 'Dr. Ahmed Ali', subject: 'Mathematics', email: 'ahmed.ali@example.com', phone: '+1234567890', qualification: 'PhD in Mathematics' },
  { id: 2, name: 'Prof. Sara Johnson', subject: 'Physics', email: 'sara.johnson@example.com', phone: '+1234567891', qualification: 'PhD in Physics' },
  { id: 3, name: 'Mr. Mohammed Hassan', subject: 'Chemistry', email: 'mohammed.hassan@example.com', phone: '+1234567892', qualification: 'MSc in Chemistry' },
  { id: 4, name: 'Dr. Emily Chen', subject: 'Biology', email: 'emily.chen@example.com', phone: '+1234567893', qualification: 'PhD in Biology' },
  { id: 5, name: 'Mr. Omar Farooq', subject: 'History', email: 'omar.farooq@example.com', phone: '+1234567894', qualification: 'MA in History' },
  { id: 6, name: 'Ms. Sophia Rodriguez', subject: 'English', email: 'sophia.rodriguez@example.com', phone: '+1234567895', qualification: 'MA in English Literature' },
  { id: 7, name: 'Mr. Amir Khan', subject: 'Computer Science', email: 'amir.khan@example.com', phone: '+1234567896', qualification: 'MSc in Computer Science' },
  { id: 8, name: 'Dr. Zainab Malik', subject: 'Geography', email: 'zainab.malik@example.com', phone: '+1234567897', qualification: 'PhD in Geography' },
  { id: 9, name: 'Mr. David Wilson', subject: 'Physical Education', email: 'david.wilson@example.com', phone: '+1234567898', qualification: 'BSc in Sports Science' },
  { id: 10, name: 'Ms. Fatima Ahmed', subject: 'Art', email: 'fatima.ahmed@example.com', phone: '+1234567899', qualification: 'MFA in Fine Arts' },
];

const TeachersPage = () => {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [teachersPerPage] = useState(8);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [teachers, setTeachers] = useState(MOCK_TEACHERS);

  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    // In a real app, this would be an API call
    setTeachers(MOCK_TEACHERS);
  }, []);

  if (!mounted) {
    return null;
  }

  // Filter teachers based on search term
  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort teachers
  const sortedTeachers = [...filteredTeachers].sort((a, b) => {
    if (sortDirection === 'asc') {
      return a[sortField] > b[sortField] ? 1 : -1;
    } else {
      return a[sortField] < b[sortField] ? 1 : -1;
    }
  });

  // Pagination
  const indexOfLastTeacher = currentPage * teachersPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;
  const currentTeachers = sortedTeachers.slice(indexOfFirstTeacher, indexOfLastTeacher);
  const totalPages = Math.ceil(sortedTeachers.length / teachersPerPage);

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Render sort icon
  const renderSortIcon = (field) => {
    if (sortField !== field) return <Filter className="h-4 w-4 ml-1" />;
    return sortDirection === 'asc' 
      ? <SortAsc className="h-4 w-4 ml-1" /> 
      : <SortDesc className="h-4 w-4 ml-1" />;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('app.teachers')}</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          {t('teachers.addTeacher')}
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder={t('teachers.searchTeachers')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentTeachers.map((teacher) => (
          <div key={teacher.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{teacher.name}</h3>
              <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>{teacher.subject}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                <Mail className="h-4 w-4 mr-2" />
                <span className="truncate">{teacher.email}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
                <Phone className="h-4 w-4 mr-2" />
                <span>{teacher.phone}</span>
              </div>
              <div className="flex justify-between">
                <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                  <Eye className="h-5 w-5" />
                </button>
                <button className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300">
                  <Edit className="h-5 w-5" />
                </button>
                <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium ${
                currentPage === 1
                  ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                  : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <span className="sr-only">{t('common.previous')}</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium ${
                  currentPage === i + 1
                    ? 'z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-200'
                    : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium ${
                currentPage === totalPages
                  ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                  : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <span className="sr-only">{t('common.next')}</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default TeachersPage;
