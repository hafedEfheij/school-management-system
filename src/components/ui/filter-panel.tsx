'use client';

import React, { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

export interface FilterOption {
  id: string;
  label: string;
  value: any;
  count?: number;
}

export interface FilterGroup {
  id: string;
  label: string;
  type: 'checkbox' | 'radio' | 'range' | 'select';
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: any;
}

interface FilterPanelProps {
  filters: FilterGroup[];
  values: Record<string, any>;
  onChange: (filterId: string, value: any) => void;
  onClear: () => void;
  className?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export function FilterPanel({
  filters,
  values,
  onChange,
  onClear,
  className = '',
  collapsible = true,
  defaultExpanded = true,
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    filters.reduce((acc, filter) => ({ ...acc, [filter.id]: true }), {})
  );

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const handleCheckboxChange = (filterId: string, optionValue: any, checked: boolean) => {
    const currentValues = values[filterId] || [];
    const newValues = checked
      ? [...currentValues, optionValue]
      : currentValues.filter((v: any) => v !== optionValue);
    onChange(filterId, newValues);
  };

  const handleRadioChange = (filterId: string, value: any) => {
    onChange(filterId, value);
  };

  const handleRangeChange = (filterId: string, value: number) => {
    onChange(filterId, value);
  };

  const handleSelectChange = (filterId: string, value: string) => {
    onChange(filterId, value);
  };

  const getActiveFilterCount = () => {
    return Object.values(values).filter(value => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== null && value !== '';
    }).length;
  };

  const renderFilterGroup = (filter: FilterGroup) => {
    const isGroupExpanded = expandedGroups[filter.id];

    return (
      <div key={filter.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
        <button
          type="button"
          onClick={() => toggleGroup(filter.id)}
          className="w-full flex items-center justify-between py-3 px-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <span className="font-medium text-gray-900 dark:text-white">
            {filter.label}
          </span>
          {isGroupExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>

        {isGroupExpanded && (
          <div className="px-4 pb-4">
            {filter.type === 'checkbox' && filter.options && (
              <div className="space-y-2">
                {filter.options.map((option) => (
                  <label key={option.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(values[filter.id] || []).includes(option.value)}
                      onChange={(e) =>
                        handleCheckboxChange(filter.id, option.value, e.target.checked)
                      }
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {option.label}
                      {option.count !== undefined && (
                        <span className="ml-1 text-gray-500">({option.count})</span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {filter.type === 'radio' && filter.options && (
              <div className="space-y-2">
                {filter.options.map((option) => (
                  <label key={option.id} className="flex items-center">
                    <input
                      type="radio"
                      name={filter.id}
                      value={option.value}
                      checked={values[filter.id] === option.value}
                      onChange={() => handleRadioChange(filter.id, option.value)}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {option.label}
                      {option.count !== undefined && (
                        <span className="ml-1 text-gray-500">({option.count})</span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {filter.type === 'range' && (
              <div className="space-y-2">
                <input
                  type="range"
                  min={filter.min || 0}
                  max={filter.max || 100}
                  step={filter.step || 1}
                  value={values[filter.id] || filter.defaultValue || filter.min || 0}
                  onChange={(e) => handleRangeChange(filter.id, Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{filter.min || 0}</span>
                  <span className="font-medium">
                    {values[filter.id] || filter.defaultValue || filter.min || 0}
                  </span>
                  <span>{filter.max || 100}</span>
                </div>
              </div>
            )}

            {filter.type === 'select' && filter.options && (
              <select
                value={values[filter.id] || ''}
                onChange={(e) => handleSelectChange(filter.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">All</option>
                {filter.options.map((option) => (
                  <option key={option.id} value={option.value}>
                    {option.label}
                    {option.count !== undefined && ` (${option.count})`}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>
    );
  };

  if (!collapsible || isExpanded) {
    return (
      <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg ${className}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="font-medium text-gray-900 dark:text-white">
              Filters
              {getActiveFilterCount() > 0 && (
                <span className="ml-2 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full">
                  {getActiveFilterCount()}
                </span>
              )}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClear}
              className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Clear all
            </button>
            {collapsible && (
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filters.map(renderFilterGroup)}
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsExpanded(true)}
      className={`flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 ${className}`}
    >
      <Filter className="h-4 w-4 text-gray-500 mr-2" />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Filters
        {getActiveFilterCount() > 0 && (
          <span className="ml-2 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full">
            {getActiveFilterCount()}
          </span>
        )}
      </span>
    </button>
  );
}

export default FilterPanel;
