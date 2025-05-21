'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ClientOnly } from './client-only';
import { Check, X } from 'lucide-react';

interface ColorOption {
  value: string;
  label?: string;
}

interface SafeColorPickerProps {
  value?: string;
  defaultValue?: string;
  onChange?: (color: string) => void;
  presetColors?: ColorOption[];
  showInput?: boolean;
  showPresets?: boolean;
  disabled?: boolean;
  className?: string;
  swatchClassName?: string;
  activeSwatchClassName?: string;
  inputClassName?: string;
  presetsClassName?: string;
  label?: string;
  labelClassName?: string;
  placeholder?: string;
  format?: 'hex' | 'rgb' | 'hsl';
}

/**
 * A hydration-safe color picker component that handles SSR and client-side rendering properly
 */
export function SafeColorPicker({
  value: controlledValue,
  defaultValue = '#000000',
  onChange,
  presetColors = [
    { value: '#000000', label: 'Black' },
    { value: '#ffffff', label: 'White' },
    { value: '#ff0000', label: 'Red' },
    { value: '#00ff00', label: 'Green' },
    { value: '#0000ff', label: 'Blue' },
    { value: '#ffff00', label: 'Yellow' },
    { value: '#ff00ff', label: 'Magenta' },
    { value: '#00ffff', label: 'Cyan' },
  ],
  showInput = true,
  showPresets = true,
  disabled = false,
  className,
  swatchClassName,
  activeSwatchClassName,
  inputClassName,
  presetsClassName,
  label,
  labelClassName,
  placeholder = 'Enter color',
  format = 'hex',
}: SafeColorPickerProps) {
  const [mounted, setMounted] = useState(false);
  const [color, setColor] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  
  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    setColor(controlledValue || defaultValue);
  }, [controlledValue, defaultValue]);
  
  // Update color when controlled value changes
  useEffect(() => {
    if (controlledValue !== undefined && controlledValue !== color) {
      setColor(controlledValue);
    }
  }, [controlledValue, color]);
  
  // Handle outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);
  
  // Handle color change
  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    onChange?.(newColor);
  };
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    handleColorChange(newColor);
  };
  
  // Handle preset color click
  const handlePresetColorClick = (presetColor: string) => {
    handleColorChange(presetColor);
    setIsOpen(false);
  };
  
  // Toggle color picker
  const toggleColorPicker = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
  };
  
  // Format color
  const formatColor = (color: string) => {
    // Simple color format conversion
    try {
      if (format === 'hex') {
        // Ensure hex format
        if (color.startsWith('#')) {
          return color;
        }
        // Very basic RGB to HEX conversion (not comprehensive)
        if (color.startsWith('rgb')) {
          const match = color.match(/\d+/g);
          if (match && match.length >= 3) {
            const r = parseInt(match[0]);
            const g = parseInt(match[1]);
            const b = parseInt(match[2]);
            return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
          }
        }
        return color;
      } else if (format === 'rgb') {
        // Very basic HEX to RGB conversion (not comprehensive)
        if (color.startsWith('#')) {
          const r = parseInt(color.slice(1, 3), 16);
          const g = parseInt(color.slice(3, 5), 16);
          const b = parseInt(color.slice(5, 7), 16);
          return `rgb(${r}, ${g}, ${b})`;
        }
        return color;
      }
    } catch (error) {
      console.error('Error formatting color:', error);
    }
    
    return color;
  };
  
  // Check if color is valid
  const isValidColor = (color: string) => {
    const style = new Option().style;
    style.color = color;
    return style.color !== '';
  };
  
  // Simple loading state for SSR
  const ColorPickerSkeleton = () => (
    <div className={`w-full ${className || ''}`}>
      {label && (
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
      )}
      <div className="flex items-center">
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-md mr-2"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      </div>
    </div>
  );
  
  // If not mounted, show skeleton
  if (!mounted) {
    return <ColorPickerSkeleton />;
  }
  
  return (
    <ClientOnly fallback={<ColorPickerSkeleton />}>
      <div className={`w-full ${className || ''}`} ref={colorPickerRef}>
        {/* Label */}
        {label && (
          <label className={`block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300 ${labelClassName || ''}`}>
            {label}
          </label>
        )}
        
        {/* Color picker */}
        <div className="relative">
          <div className="flex items-center">
            {/* Color swatch */}
            <div
              className={`h-8 w-8 rounded-md border border-gray-300 dark:border-gray-700 cursor-pointer ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              } ${swatchClassName || ''}`}
              style={{ backgroundColor: color }}
              onClick={toggleColorPicker}
            />
            
            {/* Color input */}
            {showInput && (
              <input
                type="text"
                value={formatColor(color)}
                onChange={handleInputChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`ml-2 flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  disabled ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : 'bg-white dark:bg-gray-900'
                } ${inputClassName || ''}`}
              />
            )}
          </div>
          
          {/* Color presets */}
          {isOpen && showPresets && (
            <div
              className={`absolute z-10 mt-2 p-2 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${presetsClassName || ''}`}
            >
              <div className="grid grid-cols-4 gap-2">
                {presetColors.map((presetColor) => (
                  <div
                    key={presetColor.value}
                    className="relative"
                    title={presetColor.label}
                  >
                    <div
                      className={`h-8 w-8 rounded-md border border-gray-300 dark:border-gray-700 cursor-pointer ${
                        color === presetColor.value ? `ring-2 ring-blue-500 ${activeSwatchClassName || ''}` : ''
                      }`}
                      style={{ backgroundColor: presetColor.value }}
                      onClick={() => handlePresetColorClick(presetColor.value)}
                    >
                      {color === presetColor.value && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check className="h-4 w-4 text-white drop-shadow-md" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ClientOnly>
  );
}
