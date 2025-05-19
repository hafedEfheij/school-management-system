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
  Clock,
  Users,
  Calendar,
  BookOpen
} from 'lucide-react';

// Mock course data
const MOCK_COURSES = [
  { 
    id: 1, 
    name: 'Advanced Mathematics', 
    code: 'MATH301', 
    teacher: 'Dr. Ahmed Ali', 
    students: 28, 
    schedule: 'Mon, Wed 10:00-11:30', 
    duration: '16 weeks',
    description: 'Advanced topics in calculus, linear algebra, and differential equations.'
  },
  { 
    id: 2, 
    name: 'Physics Fundamentals', 
    code: 'PHYS101', 
    teacher: 'Prof. Sara Johnson', 
    students: 35, 
    schedule: 'Tue, Thu 09:00-10:30', 
    duration: '16 weeks',
    description: 'Introduction to classical mechanics, thermodynamics, and waves.'
  },
  { 
    id: 3, 
    name: 'Organic Chemistry', 
    code: 'CHEM202', 
    teacher: 'Mr. Mohammed Hassan', 
    students: 24, 
    schedule: 'Mon, Wed, Fri 13:00-14:00', 
    duration: '16 weeks',
    description: 'Study of carbon compounds and their reactions.'
  },
  { 
    id: 4, 
    name: 'Human Biology', 
    code: 'BIO201', 
    teacher: 'Dr. Emily Chen', 
    students: 30, 
    schedule: 'Tue, Thu 14:00-15:30', 
    duration: '16 weeks',
    description: 'Structure and function of human body systems.'
  },
  { 
    id: 5, 
    name: 'World History', 
    code: 'HIST101', 
    teacher: 'Mr. Omar Farooq', 
    students: 40, 
    schedule: 'Mon, Wed 15:00-16:30', 
    duration: '16 weeks',
    description: 'Survey of major historical events and civilizations.'
  },
  { 
    id: 6, 
    name: 'English Literature', 
    code: 'ENG202', 
    teacher: 'Ms. Sophia Rodriguez', 
    students: 32, 
    schedule: 'Tue, Thu 11:00-12:30', 
    duration: '16 weeks',
    description: 'Analysis of classic and contemporary literary works.'
  },
  { 
    id: 7, 
    name: 'Computer Programming', 
    code: 'CS101', 
    teacher: 'Mr. Amir Khan', 
    students: 25, 
    schedule: 'Mon, Wed, Fri 09:00-10:00', 
    duration: '16 weeks',
    description: 'Introduction to programming concepts and algorithms.'
  },
  { 
    id: 8, 
    name: 'Environmental Science', 
    code: 'ENV201', 
    teacher: 'Dr. Zainab Malik', 
    students: 28, 
    schedule: 'Tue, Thu 13:00-14:30', 
    duration: '16 weeks',
    description: 'Study of environmental systems and human impact.'
  },
];

const CoursesPage = () => {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(6);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [courses, setCourses] = useState(MOCK_COURSES);

  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    // In a real app, this would be an API call
    setCourses(MOCK_COURSES);
  }, []);

  if (!mounted) {
    return null;
  }

  // Filter courses based on search term
  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortDirection === 'asc') {
      return a[sortField] > b[sortField] ? 1 : -1;
    } else {
      return a[sortField] < b[sortField] ? 1 : -1;
    }
  });

  // Pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = sortedCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(sortedCourses.length / coursesPerPage);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('app.courses')}</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          {t('courses.addCourse')}
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
            placeholder={t('courses.searchCourses')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {currentCourses.map((course) => (
          <div key={course.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{course.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{course.code}</p>
                </div>
                <div className="flex space-x-2">
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
              
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{course.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{course.teacher}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{course.students} {t('courses.students')}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{course.schedule}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{course.duration}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
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

export default CoursesPage;
