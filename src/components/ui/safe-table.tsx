'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { ClientOnly } from './client-only';
import { ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: ReactNode;
  cell: (item: T, index: number) => ReactNode;
  sortable?: boolean;
  className?: string;
}

interface SafeTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T, index: number) => string | number;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  headerClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
  loadingRowCount?: number;
}

/**
 * A hydration-safe table component that handles SSR and client-side rendering properly
 */
export function SafeTable<T>({
  data,
  columns,
  keyExtractor,
  sortKey,
  sortDirection = 'asc',
  onSort,
  loading = false,
  emptyMessage = 'No data available',
  className,
  headerClassName,
  rowClassName,
  cellClassName,
  loadingRowCount = 5,
}: SafeTableProps<T>) {
  const [mounted, setMounted] = useState(false);
  
  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Handle sort
  const handleSort = (key: string) => {
    if (!onSort) return;
    
    const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(key, newDirection);
  };
  
  // Render sort icon
  const renderSortIcon = (key: string) => {
    if (sortKey !== key) {
      return <ArrowUpDown className="h-4 w-4 ml-1" />;
    }
    
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    );
  };
  
  // Simple loading state for SSR
  const TableSkeleton = () => (
    <div className={`w-full overflow-hidden rounded-lg shadow ${className || ''}`}>
      <div className="w-full overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead className={`bg-gray-50 dark:bg-gray-700 ${headerClassName || ''}`}>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${column.className || ''}`}
                >
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-20"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {Array.from({ length: loadingRowCount }).map((_, rowIndex) => (
              <tr key={rowIndex} className={rowClassName || ''}>
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-6 py-4 whitespace-nowrap ${cellClassName || ''} ${column.className || ''}`}
                  >
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
  // If not mounted, show skeleton
  if (!mounted) {
    return <TableSkeleton />;
  }
  
  return (
    <ClientOnly fallback={<TableSkeleton />}>
      <div className={`w-full overflow-hidden rounded-lg shadow ${className || ''}`}>
        <div className="w-full overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead className={`bg-gray-50 dark:bg-gray-700 ${headerClassName || ''}`}>
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${column.className || ''}`}
                    onClick={column.sortable ? () => handleSort(column.key) : undefined}
                    style={column.sortable ? { cursor: 'pointer' } : undefined}
                  >
                    <div className="flex items-center">
                      {column.header}
                      {column.sortable && onSort && (
                        <span className="ml-1">{renderSortIcon(column.key)}</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                Array.from({ length: loadingRowCount }).map((_, rowIndex) => (
                  <tr key={rowIndex} className={rowClassName || ''}>
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className={`px-6 py-4 whitespace-nowrap ${cellClassName || ''} ${column.className || ''}`}
                      >
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={keyExtractor(item, index)} className={rowClassName || ''}>
                    {columns.map((column, colIndex) => (
                      <td
                        key={`${keyExtractor(item, index)}-${colIndex}`}
                        className={`px-6 py-4 whitespace-nowrap ${cellClassName || ''} ${column.className || ''}`}
                      >
                        {column.cell(item, index)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ClientOnly>
  );
}
