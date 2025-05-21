'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { ClientOnly } from './client-only';
import { ChevronUp, ChevronDown, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { SafePagination } from './safe-pagination';

export interface Column<T> {
  key: string;
  header: ReactNode;
  cell: (item: T, index: number) => ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  align?: 'left' | 'center' | 'right';
  className?: string;
  headerClassName?: string;
  cellClassName?: string;
}

interface SafeDataGridProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T, index: number) => string | number;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  headerClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
  loadingRowCount?: number;
  
  // Sorting
  sortable?: boolean;
  defaultSortKey?: string;
  defaultSortDirection?: 'asc' | 'desc';
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  
  // Pagination
  paginated?: boolean;
  pageSize?: number;
  totalItems?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  
  // Selection
  selectable?: boolean;
  selectedKeys?: (string | number)[];
  onSelectionChange?: (keys: (string | number)[]) => void;
  
  // Row actions
  onRowClick?: (item: T, index: number) => void;
  rowActions?: (item: T, index: number) => ReactNode;
}

/**
 * A hydration-safe data grid component that handles SSR and client-side rendering properly
 */
export function SafeDataGrid<T>({
  data,
  columns,
  keyExtractor,
  loading = false,
  emptyMessage = 'No data available',
  className,
  headerClassName,
  rowClassName,
  cellClassName,
  loadingRowCount = 5,
  
  // Sorting
  sortable = false,
  defaultSortKey,
  defaultSortDirection = 'asc',
  onSort,
  
  // Pagination
  paginated = false,
  pageSize = 10,
  totalItems,
  currentPage = 1,
  onPageChange,
  
  // Selection
  selectable = false,
  selectedKeys = [],
  onSelectionChange,
  
  // Row actions
  onRowClick,
  rowActions,
}: SafeDataGridProps<T>) {
  const [mounted, setMounted] = useState(false);
  const [sortKey, setSortKey] = useState<string | undefined>(defaultSortKey);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(defaultSortDirection);
  const [selected, setSelected] = useState<(string | number)[]>(selectedKeys);
  const [page, setPage] = useState(currentPage);
  
  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    setSortKey(defaultSortKey);
    setSortDirection(defaultSortDirection);
    setSelected(selectedKeys);
    setPage(currentPage);
  }, [defaultSortKey, defaultSortDirection, selectedKeys, currentPage]);
  
  // Update selected keys when controlled value changes
  useEffect(() => {
    if (selectedKeys !== selected) {
      setSelected(selectedKeys);
    }
  }, [selectedKeys, selected]);
  
  // Update current page when controlled value changes
  useEffect(() => {
    if (currentPage !== page) {
      setPage(currentPage);
    }
  }, [currentPage, page]);
  
  // Handle sort
  const handleSort = (key: string) => {
    if (!sortable) return;
    
    const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortDirection(newDirection);
    onSort?.(key, newDirection);
  };
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    onPageChange?.(newPage);
  };
  
  // Handle row selection
  const handleRowSelection = (key: string | number) => {
    if (!selectable) return;
    
    const newSelected = selected.includes(key)
      ? selected.filter((k) => k !== key)
      : [...selected, key];
    
    setSelected(newSelected);
    onSelectionChange?.(newSelected);
  };
  
  // Handle select all
  const handleSelectAll = () => {
    if (!selectable) return;
    
    const allKeys = data.map((item, index) => keyExtractor(item, index));
    const newSelected = selected.length === allKeys.length ? [] : allKeys;
    
    setSelected(newSelected);
    onSelectionChange?.(newSelected);
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
  
  // Get paginated data
  const getPaginatedData = () => {
    if (!paginated) return data;
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return data.slice(startIndex, endIndex);
  };
  
  // Calculate total pages
  const getTotalPages = () => {
    const total = totalItems || data.length;
    return Math.ceil(total / pageSize);
  };
  
  // Simple loading state for SSR
  const DataGridSkeleton = () => (
    <div className={`w-full overflow-hidden rounded-lg shadow ${className || ''}`}>
      <div className="w-full overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead className={`bg-gray-50 dark:bg-gray-700 ${headerClassName || ''}`}>
            <tr>
              {selectable && <th className="w-10 px-6 py-3"></th>}
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${column.headerClassName || ''}`}
                  style={{
                    width: column.width,
                    minWidth: column.minWidth,
                    maxWidth: column.maxWidth,
                    textAlign: column.align,
                  }}
                >
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-20"></div>
                </th>
              ))}
              {rowActions && <th className="w-10 px-6 py-3"></th>}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {Array.from({ length: loadingRowCount }).map((_, rowIndex) => (
              <tr key={rowIndex} className={rowClassName || ''}>
                {selectable && (
                  <td className="px-6 py-4 whitespace-nowrap w-10">
                    <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </td>
                )}
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-6 py-4 whitespace-nowrap ${cellClassName || ''} ${column.cellClassName || ''}`}
                    style={{ textAlign: column.align }}
                  >
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  </td>
                ))}
                {rowActions && (
                  <td className="px-6 py-4 whitespace-nowrap w-10">
                    <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
  // If not mounted, show skeleton
  if (!mounted) {
    return <DataGridSkeleton />;
  }
  
  const displayData = getPaginatedData();
  
  return (
    <ClientOnly fallback={<DataGridSkeleton />}>
      <div className={`w-full ${className || ''}`}>
        <div className="w-full overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead className={`bg-gray-50 dark:bg-gray-700 ${headerClassName || ''}`}>
              <tr>
                {/* Selection checkbox */}
                {selectable && (
                  <th className="w-10 px-6 py-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        checked={data.length > 0 && selected.length === data.length}
                        onChange={handleSelectAll}
                      />
                    </div>
                  </th>
                )}
                
                {/* Column headers */}
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${column.headerClassName || ''}`}
                    style={{
                      width: column.width,
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth,
                      textAlign: column.align,
                    }}
                    onClick={column.sortable && sortable ? () => handleSort(column.key) : undefined}
                  >
                    <div className="flex items-center">
                      {column.header}
                      {column.sortable && sortable && (
                        <span className="ml-1">{renderSortIcon(column.key)}</span>
                      )}
                    </div>
                  </th>
                ))}
                
                {/* Row actions */}
                {rowActions && <th className="w-10 px-6 py-3"></th>}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                // Loading state
                Array.from({ length: loadingRowCount }).map((_, rowIndex) => (
                  <tr key={rowIndex} className={rowClassName || ''}>
                    {selectable && (
                      <td className="px-6 py-4 whitespace-nowrap w-10">
                        <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </td>
                    )}
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className={`px-6 py-4 whitespace-nowrap ${cellClassName || ''} ${column.cellClassName || ''}`}
                        style={{ textAlign: column.align }}
                      >
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                      </td>
                    ))}
                    {rowActions && (
                      <td className="px-6 py-4 whitespace-nowrap w-10">
                        <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </td>
                    )}
                  </tr>
                ))
              ) : displayData.length > 0 ? (
                // Data rows
                displayData.map((item, rowIndex) => {
                  const rowKey = keyExtractor(item, rowIndex);
                  const isSelected = selected.includes(rowKey);
                  
                  return (
                    <tr
                      key={rowKey}
                      className={`${rowClassName || ''} ${
                        isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      } ${onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50' : ''}`}
                      onClick={onRowClick ? () => onRowClick(item, rowIndex) : undefined}
                    >
                      {/* Selection checkbox */}
                      {selectable && (
                        <td
                          className="px-6 py-4 whitespace-nowrap w-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowSelection(rowKey);
                          }}
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              checked={isSelected}
                              onChange={() => {}}
                            />
                          </div>
                        </td>
                      )}
                      
                      {/* Data cells */}
                      {columns.map((column, colIndex) => (
                        <td
                          key={`${rowKey}-${colIndex}`}
                          className={`px-6 py-4 whitespace-nowrap ${cellClassName || ''} ${column.cellClassName || ''}`}
                          style={{ textAlign: column.align }}
                        >
                          {column.cell(item, rowIndex)}
                        </td>
                      ))}
                      
                      {/* Row actions */}
                      {rowActions && (
                        <td
                          className="px-6 py-4 whitespace-nowrap w-10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {rowActions(item, rowIndex)}
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                // Empty state
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)}
                    className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {paginated && !loading && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                  page === 1
                    ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === getTotalPages()}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                  page === getTotalPages()
                    ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing <span className="font-medium">{(page - 1) * pageSize + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(page * pageSize, totalItems || data.length)}
                  </span>{' '}
                  of <span className="font-medium">{totalItems || data.length}</span> results
                </p>
              </div>
              <div>
                <SafePagination
                  currentPage={page}
                  totalPages={getTotalPages()}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </ClientOnly>
  );
}
