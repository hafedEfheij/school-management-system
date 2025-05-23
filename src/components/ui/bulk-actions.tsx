'use client';

import React, { useState } from 'react';
import { MoreHorizontal, Trash2, Edit, Archive, Download, Mail, Check, X } from 'lucide-react';

export interface BulkAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'warning';
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
  disabled?: boolean;
}

interface BulkActionsProps {
  selectedItems: any[];
  totalItems: number;
  actions: BulkAction[];
  onAction: (actionId: string, selectedItems: any[]) => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  className?: string;
  position?: 'top' | 'bottom' | 'floating';
}

const defaultActions: BulkAction[] = [
  {
    id: 'delete',
    label: 'Delete',
    icon: <Trash2 className="h-4 w-4" />,
    variant: 'destructive',
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to delete the selected items?',
  },
  {
    id: 'archive',
    label: 'Archive',
    icon: <Archive className="h-4 w-4" />,
    variant: 'warning',
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to archive the selected items?',
  },
  {
    id: 'export',
    label: 'Export',
    icon: <Download className="h-4 w-4" />,
  },
  {
    id: 'email',
    label: 'Send Email',
    icon: <Mail className="h-4 w-4" />,
  },
];

export function BulkActions({
  selectedItems,
  totalItems,
  actions = defaultActions,
  onAction,
  onSelectAll,
  onDeselectAll,
  className = '',
  position = 'top',
}: BulkActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmingAction, setConfirmingAction] = useState<BulkAction | null>(null);

  const selectedCount = selectedItems.length;
  const isAllSelected = selectedCount === totalItems && totalItems > 0;
  const isPartiallySelected = selectedCount > 0 && selectedCount < totalItems;

  const handleActionClick = (action: BulkAction) => {
    setIsOpen(false);
    
    if (action.requiresConfirmation) {
      setConfirmingAction(action);
    } else {
      onAction(action.id, selectedItems);
    }
  };

  const handleConfirmAction = () => {
    if (confirmingAction) {
      onAction(confirmingAction.id, selectedItems);
      setConfirmingAction(null);
    }
  };

  const handleCancelAction = () => {
    setConfirmingAction(null);
  };

  const getVariantClasses = (variant?: string) => {
    switch (variant) {
      case 'destructive':
        return 'text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20';
      case 'warning':
        return 'text-yellow-700 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-900/20';
      default:
        return 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700';
    }
  };

  const positionClasses = {
    top: 'mb-4',
    bottom: 'mt-4',
    floating: 'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 shadow-lg',
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <>
      <div className={`
        flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg
        ${positionClasses[position]} ${className}
      `}>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isAllSelected}
              ref={(input) => {
                if (input) input.indeterminate = isPartiallySelected;
              }}
              onChange={() => {
                if (isAllSelected || isPartiallySelected) {
                  onDeselectAll?.();
                } else {
                  onSelectAll?.();
                }
              }}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-3 text-sm font-medium text-blue-900 dark:text-blue-100">
              {selectedCount} of {totalItems} selected
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Quick actions */}
          {actions.slice(0, 3).map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => handleActionClick(action)}
              disabled={action.disabled}
              className={`
                inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md border border-transparent
                ${getVariantClasses(action.variant)}
                ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              title={action.label}
            >
              {action.icon}
              <span className="ml-1 hidden sm:inline">{action.label}</span>
            </button>
          ))}

          {/* More actions dropdown */}
          {actions.length > 3 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center px-2 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>

              {isOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsOpen(false)}
                  />
                  
                  {/* Dropdown */}
                  <div className="absolute right-0 z-20 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {actions.slice(3).map((action) => (
                        <button
                          key={action.id}
                          type="button"
                          onClick={() => handleActionClick(action)}
                          disabled={action.disabled}
                          className={`
                            group flex items-center w-full px-4 py-2 text-sm
                            ${getVariantClasses(action.variant)}
                            ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                          `}
                        >
                          {action.icon && (
                            <span className="mr-3">
                              {action.icon}
                            </span>
                          )}
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Deselect all */}
          <button
            type="button"
            onClick={onDeselectAll}
            className="inline-flex items-center px-2 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            title="Deselect all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmingAction && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={handleCancelAction}
            />

            {/* Modal */}
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className={`
                    mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10
                    ${confirmingAction.variant === 'destructive' ? 'bg-red-100 dark:bg-red-900/20' : 'bg-yellow-100 dark:bg-yellow-900/20'}
                  `}>
                    {confirmingAction.icon}
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      {confirmingAction.label}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {confirmingAction.confirmationMessage}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        This action will affect {selectedCount} item{selectedCount !== 1 ? 's' : ''}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleConfirmAction}
                  className={`
                    w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm
                    ${confirmingAction.variant === 'destructive' 
                      ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                      : 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
                    }
                  `}
                >
                  {confirmingAction.label}
                </button>
                <button
                  type="button"
                  onClick={handleCancelAction}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BulkActions;
