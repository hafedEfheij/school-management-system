'use client';

import React, { useState, useEffect, useRef, ChangeEvent, DragEvent } from 'react';
import { ClientOnly } from './client-only';
import { Upload, X, File, CheckCircle, AlertCircle } from 'lucide-react';

interface FileItem {
  file: File;
  id: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

interface SafeFileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in bytes
  onFilesSelected?: (files: File[]) => void;
  onFileUpload?: (file: File) => Promise<void>;
  onFileRemove?: (fileId: string) => void;
  className?: string;
  dropzoneClassName?: string;
  fileListClassName?: string;
  fileItemClassName?: string;
  disabled?: boolean;
  label?: string;
  description?: string;
  showFileList?: boolean;
  autoUpload?: boolean;
  simulateProgress?: boolean;
}

/**
 * A hydration-safe file upload component that handles SSR and client-side rendering properly
 */
export function SafeFileUpload({
  accept,
  multiple = false,
  maxFiles = 5,
  maxSize,
  onFilesSelected,
  onFileUpload,
  onFileRemove,
  className,
  dropzoneClassName,
  fileListClassName,
  fileItemClassName,
  disabled = false,
  label = 'Upload files',
  description = 'Drag and drop files here or click to browse',
  showFileList = true,
  autoUpload = false,
  simulateProgress = false,
}: SafeFileUploadProps) {
  const [mounted, setMounted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Handle file selection
  const handleFileSelection = (selectedFiles: FileList | null) => {
    if (!selectedFiles || disabled) return;
    
    const newFiles: File[] = [];
    const fileItems: FileItem[] = [];
    
    // Convert FileList to array and filter
    Array.from(selectedFiles).forEach((file) => {
      // Check file size
      if (maxSize && file.size > maxSize) {
        console.warn(`File "${file.name}" exceeds the maximum size of ${formatBytes(maxSize)}`);
        return;
      }
      
      // Check max files
      if (!multiple && files.length + newFiles.length >= 1) {
        console.warn('Only one file can be uploaded');
        return;
      }
      
      if (multiple && files.length + newFiles.length >= maxFiles) {
        console.warn(`Maximum ${maxFiles} files can be uploaded`);
        return;
      }
      
      newFiles.push(file);
      fileItems.push({
        file,
        id: generateId(),
        progress: 0,
        status: 'uploading',
      });
    });
    
    if (newFiles.length === 0) return;
    
    // Update state
    setFiles((prevFiles) => [...prevFiles, ...fileItems]);
    
    // Call callback
    onFilesSelected?.(newFiles);
    
    // Auto upload
    if (autoUpload) {
      fileItems.forEach((fileItem) => {
        uploadFile(fileItem);
      });
    }
  };
  
  // Generate unique ID
  const generateId = () => {
    return Math.random().toString(36).substring(2, 9);
  };
  
  // Format bytes to human-readable format
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };
  
  // Handle file upload
  const uploadFile = async (fileItem: FileItem) => {
    try {
      // If no upload handler is provided, simulate progress
      if (!onFileUpload || simulateProgress) {
        simulateFileUpload(fileItem.id);
        return;
      }
      
      // Update file status
      updateFileStatus(fileItem.id, 'uploading', 0);
      
      // Upload file
      await onFileUpload(fileItem.file);
      
      // Update file status
      updateFileStatus(fileItem.id, 'success', 100);
    } catch (error) {
      // Update file status
      updateFileStatus(fileItem.id, 'error', 0, error instanceof Error ? error.message : 'Upload failed');
    }
  };
  
  // Simulate file upload progress
  const simulateFileUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5;
      
      if (progress >= 100) {
        clearInterval(interval);
        progress = 100;
        updateFileStatus(fileId, 'success', progress);
      } else {
        updateFileStatus(fileId, 'uploading', progress);
      }
    }, 300);
  };
  
  // Update file status
  const updateFileStatus = (fileId: string, status: 'uploading' | 'success' | 'error', progress: number, error?: string) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.id === fileId
          ? { ...file, status, progress, error }
          : file
      )
    );
  };
  
  // Handle file removal
  const handleFileRemove = (fileId: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
    onFileRemove?.(fileId);
  };
  
  // Handle drag events
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragging(true);
  };
  
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;
    
    const droppedFiles = e.dataTransfer.files;
    handleFileSelection(droppedFiles);
  };
  
  // Handle file input change
  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileSelection(e.target.files);
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Handle browse button click
  const handleBrowseClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };
  
  // Simple loading state for SSR
  const FileUploadSkeleton = () => (
    <div className={`w-full ${className || ''}`}>
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
        <div className="mx-auto h-12 w-12 text-gray-400 mb-4 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto"></div>
      </div>
    </div>
  );
  
  // If not mounted, show skeleton
  if (!mounted) {
    return <FileUploadSkeleton />;
  }
  
  return (
    <ClientOnly fallback={<FileUploadSkeleton />}>
      <div className={`w-full ${className || ''}`}>
        {/* File input (hidden) */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />
        
        {/* Dropzone */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${dropzoneClassName || ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
        >
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <Upload className="h-12 w-12" />
          </div>
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {label}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
          {maxSize && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Maximum file size: {formatBytes(maxSize)}
            </p>
          )}
        </div>
        
        {/* File list */}
        {showFileList && files.length > 0 && (
          <div className={`mt-4 space-y-2 ${fileListClassName || ''}`}>
            {files.map((file) => (
              <div
                key={file.id}
                className={`flex items-center p-3 border rounded-lg ${
                  file.status === 'error'
                    ? 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                    : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
                } ${fileItemClassName || ''}`}
              >
                <div className="flex-shrink-0 mr-3">
                  {file.status === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : file.status === 'error' ? (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <File className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {file.file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatBytes(file.file.size)}
                  </p>
                  {file.status === 'error' && file.error && (
                    <p className="text-xs text-red-500 mt-1">{file.error}</p>
                  )}
                  {file.status === 'uploading' && (
                    <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full mt-2">
                      <div
                        className="h-1 bg-blue-500 rounded-full"
                        style={{ width: `${file.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="ml-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFileRemove(file.id);
                  }}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ClientOnly>
  );
}
