'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { api } from '@/services/api';
import { FaArrowLeft, FaEdit, FaTrash, FaSpinner, FaGraduationCap, FaBook, FaCalendarAlt } from 'react-icons/fa';
import Link from 'next/link';
import { DateFormatter } from '@/components/common/Formatters';

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  dateOfBirth: string | null;
  gradeLevel: number;
  enrollments: Array<{
    id: string;
    course: {
      id: string;
      name: string;
      description: string | null;
      credits: number;
      teacher: {
        id: string;
        firstName: string;
        lastName: string;
      };
    };
  }>;
  grades: Array<{
    id: string;
    value: number;
    type: string;
    date: string;
    course: {
      id: string;
      name: string;
    };
  }>;
};

export default function StudentDetailPage({ params }: { params: { id: string } }) {
  const { t } = useLanguage();
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  // Fetch student details
  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await api.students.getById(params.id);
        setStudent(data);
      } catch (error) {
        console.error('Error fetching student:', error);
        setError('Failed to fetch student details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudent();
  }, [params.id]);
  
  // Handle delete student
  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    
    setDeleting(true);
    
    try {
      await api.students.delete(params.id);
      router.push('/students');
    } catch (error) {
      console.error('Error deleting student:', error);
      setError('Failed to delete student');
      setDeleting(false);
      setDeleteConfirm(false);
    }
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 flex justify-center">
          <FaSpinner className="animate-spin text-blue-600 text-2xl" />
        </div>
      </MainLayout>
    );
  }
  
  if (error || !student) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-md">
            <p className="text-red-700 dark:text-red-300">{error || 'Student not found'}</p>
          </div>
          <div className="mt-4">
            <Link
              href="/students"
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <FaArrowLeft className="mr-2" />
              {t('common.back')}
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t('students.studentDetails')}</h1>
          <div className="flex space-x-4">
            <Link
              href="/students"
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <FaArrowLeft className="mr-2" />
              {t('common.back')}
            </Link>
            <Link
              href={`/students/${student.id}/edit`}
              className="text-indigo-600 hover:text-indigo-800 flex items-center"
            >
              <FaEdit className="mr-2" />
              {t('common.edit')}
            </Link>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800 flex items-center"
              disabled={deleting}
            >
              {deleteConfirm ? (
                deleting ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  <>
                    <FaTrash className="mr-2" />
                    {t('common.confirm')}
                  </>
                )
              ) : (
                <>
                  <FaTrash className="mr-2" />
                  {t('common.delete')}
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">{t('students.personalInfo')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('students.name')}</p>
                    <p className="text-lg font-medium">{student.firstName} {student.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('students.gradeLevel')}</p>
                    <p className="text-lg font-medium">{t('students.grade')} {student.gradeLevel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('students.email')}</p>
                    <p className="text-lg font-medium">{student.email || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('students.phone')}</p>
                    <p className="text-lg font-medium">{student.phone || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('students.dateOfBirth')}</p>
                    <p className="text-lg font-medium">
                      {student.dateOfBirth ? (
                        <DateFormatter date={student.dateOfBirth} options={{ dateStyle: 'medium' }} />
                      ) : (
                        '-'
                      )}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('students.address')}</p>
                    <p className="text-lg font-medium">{student.address || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mt-6">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">{t('courses.enrolledCourses')}</h2>
                  <Link
                    href={`/students/${student.id}/enroll`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    {t('courses.enrollInCourse')}
                  </Link>
                </div>
                
                {student.enrollments.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">{t('courses.notEnrolledInAnyCourses')}</p>
                ) : (
                  <div className="space-y-4">
                    {student.enrollments.map((enrollment) => (
                      <div
                        key={enrollment.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-md p-4"
                      >
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">{enrollment.course.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {t('teachers.teacher')}: {enrollment.course.teacher.firstName} {enrollment.course.teacher.lastName}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {t('courses.credits')}: {enrollment.course.credits}
                            </p>
                          </div>
                          <div>
                            <Link
                              href={`/courses/${enrollment.course.id}`}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              {t('common.view')}
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">{t('grades.recentGrades')}</h2>
                
                {student.grades.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">{t('grades.noGradesYet')}</p>
                ) : (
                  <div className="space-y-4">
                    {student.grades.slice(0, 5).map((grade) => (
                      <div
                        key={grade.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-md p-4"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{grade.course.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {grade.type} - <DateFormatter date={grade.date} options={{ dateStyle: 'medium' }} />
                            </p>
                          </div>
                          <div className="text-lg font-bold">{grade.value}</div>
                        </div>
                      </div>
                    ))}
                    
                    {student.grades.length > 5 && (
                      <Link
                        href={`/students/${student.id}/grades`}
                        className="block text-center text-blue-600 hover:text-blue-800 text-sm mt-2"
                      >
                        {t('common.viewAll')}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
