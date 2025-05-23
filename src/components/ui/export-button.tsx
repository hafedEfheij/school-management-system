'use client';

import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, File, ChevronDown } from 'lucide-react';

export type ExportFormat = 'csv' | 'excel' | 'pdf' | 'json';

interface ExportOption {
  format: ExportFormat;
  label: string;
  icon: React.ReactNode;
  description?: string;
}

interface ExportButtonProps {
  data: any[];
  filename?: string;
  onExport?: (format: ExportFormat, data: any[]) => void;
  formats?: ExportFormat[];
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
}

const defaultExportOptions: ExportOption[] = [
  {
    format: 'csv',
    label: 'CSV',
    icon: <FileText className="h-4 w-4" />,
    description: 'Comma-separated values',
  },
  {
    format: 'excel',
    label: 'Excel',
    icon: <FileSpreadsheet className="h-4 w-4" />,
    description: 'Microsoft Excel format',
  },
  {
    format: 'pdf',
    label: 'PDF',
    icon: <File className="h-4 w-4" />,
    description: 'Portable Document Format',
  },
  {
    format: 'json',
    label: 'JSON',
    icon: <FileText className="h-4 w-4" />,
    description: 'JavaScript Object Notation',
  },
];

export function ExportButton({
  data,
  filename = 'export',
  onExport,
  formats = ['csv', 'excel', 'pdf'],
  className = '',
  disabled = false,
  loading = false,
  size = 'md',
  variant = 'primary',
}: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const exportOptions = defaultExportOptions.filter(option =>
    formats.includes(option.format)
  );

  const handleExport = (format: ExportFormat) => {
    setIsOpen(false);
    
    if (onExport) {
      onExport(format, data);
      return;
    }

    // Default export implementations
    switch (format) {
      case 'csv':
        exportToCSV(data, filename);
        break;
      case 'json':
        exportToJSON(data, filename);
        break;
      case 'excel':
        // Would need a library like xlsx for full Excel support
        exportToCSV(data, filename);
        break;
      case 'pdf':
        // Would need a library like jsPDF for PDF generation
        console.log('PDF export would require additional library');
        break;
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (!data.length) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  };

  const exportToJSON = (data: any[], filename: string) => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, `${filename}.json`, 'application/json');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white border-gray-600',
    outline: 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 dark:border-gray-600',
  };

  if (exportOptions.length === 1) {
    // Single format - simple button
    return (
      <button
        type="button"
        onClick={() => handleExport(exportOptions[0].format)}
        disabled={disabled || loading || !data.length}
        className={`
          inline-flex items-center border rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          ${sizeClasses[size]} ${variantClasses[variant]}
          ${disabled || loading || !data.length ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
      >
        {loading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
        ) : (
          <Download className="h-4 w-4 mr-2" />
        )}
        Export {exportOptions[0].label}
      </button>
    );
  }

  // Multiple formats - dropdown
  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || loading || !data.length}
        className={`
          inline-flex items-center border rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          ${sizeClasses[size]} ${variantClasses[variant]}
          ${disabled || loading || !data.length ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
      >
        {loading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
        ) : (
          <Download className="h-4 w-4 mr-2" />
        )}
        Export
        <ChevronDown className="h-4 w-4 ml-2" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 z-20 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {exportOptions.map((option) => (
                <button
                  key={option.format}
                  type="button"
                  onClick={() => handleExport(option.format)}
                  className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span className="mr-3 text-gray-400 group-hover:text-gray-500">
                    {option.icon}
                  </span>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{option.label}</div>
                    {option.description && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {option.description}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ExportButton;
