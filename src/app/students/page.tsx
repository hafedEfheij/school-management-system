'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaEye, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';
import { useRtl } from '@/hooks/useRtl';

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  gradeLevel: number;
};

export default function StudentsPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const rtl = useRtl();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);

      try {
        const params: Record<string, string> = {};

        if (searchTerm) {
          params.search = searchTerm;
        }

        if (gradeFilter) {
          params.gradeLevel = gradeFilter;
        }

        const data = await api.students.getAll(params);
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
        setError('Failed to fetch students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [searchTerm, gradeFilter]);

  // Handle delete student
  const handleDelete = async (id: string) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      return;
    }

    setDeleting(true);

    try {
      await api.students.delete(id);
      setStudents(students.filter(student => student.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting student:', error);
      setError('Failed to delete student');
    } finally {
      setDeleting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl">{t('app.signIn')}</p>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t('app.students')}</h1>
          <Link
            href="/students/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <FaPlus className={rtl.margin('right', 2)} />
            {t('students.addStudent')}
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className={`absolute inset-y-0 ${rtl.position('left')} pl-3 flex items-center pointer-events-none`}>
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className={`block w-full ${rtl.padding('left', 10)} pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder={t('students.searchStudents')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="w-full md:w-48">
              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
              >
                <option value="">{t('students.allGrades')}</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {t('students.grade')} {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 p-4 border-b border-red-200 dark:border-red-700">
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="p-8 flex justify-center">
              <FaSpinner className="animate-spin text-blue-600 text-2xl" />
            </div>
          ) : students.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              {t('common.noResults')}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className={`px-6 py-3 text-${rtl.textAlign()} text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider`}
                    >
                      {t('students.name')}
                    </th>
                    <th
                      scope="col"
                      className={`px-6 py-3 text-${rtl.textAlign()} text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider`}
                    >
                      {t('students.grade')}
                    </th>
                    <th
                      scope="col"
                      className={`px-6 py-3 text-${rtl.textAlign()} text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider`}
                    >
                      {t('students.email')}
                    </th>
                    <th
                      scope="col"
                      className={`px-6 py-3 text-${rtl.textAlign()} text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider`}
                    >
                      {t('students.phone')}
                    </th>
                    <th
                      scope="col"
                      className={`px-6 py-3 text-${rtl.oppositeTextAlign()} text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider`}
                    >
                      {t('students.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {student.firstName} {student.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {t('students.grade')} {student.gradeLevel}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {student.email || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {student.phone || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className={`flex justify-end space-x-2 ${rtl.flexDirection()}`}>
                          <Link
                            href={`/students/${student.id}`}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <FaEye />
                          </Link>
                          <Link
                            href={`/students/${student.id}/edit`}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            disabled={deleting}
                          >
                            {deleteConfirm === student.id ? (
                              deleting ? (
                                <FaSpinner className="animate-spin" />
                              ) : (
                                '✓'
                              )
                            ) : (
                              <FaTrash />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
