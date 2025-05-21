'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ClientOnly } from './client-only';
import { 
  Bold, Italic, Underline, List, ListOrdered, 
  Link, Image, AlignLeft, AlignCenter, AlignRight, 
  Heading1, Heading2, Code, Quote, Undo, Redo
} from 'lucide-react';

interface ToolbarButton {
  icon: React.ReactNode;
  title: string;
  action: string;
  isActive?: (editor: HTMLDivElement) => boolean;
}

interface SafeRichEditorProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  editorClassName?: string;
  toolbarClassName?: string;
  buttonClassName?: string;
  activeButtonClassName?: string;
  disabled?: boolean;
  readOnly?: boolean;
  minHeight?: string | number;
  maxHeight?: string | number;
  toolbar?: ('bold' | 'italic' | 'underline' | 'link' | 'list' | 'ordered-list' | 
             'heading1' | 'heading2' | 'image' | 'align-left' | 'align-center' | 
             'align-right' | 'code' | 'quote' | 'undo' | 'redo')[];
}

/**
 * A hydration-safe rich text editor component that handles SSR and client-side rendering properly
 */
export function SafeRichEditor({
  value: controlledValue,
  defaultValue = '',
  onChange,
  placeholder = 'Type here...',
  className,
  editorClassName,
  toolbarClassName,
  buttonClassName,
  activeButtonClassName,
  disabled = false,
  readOnly = false,
  minHeight = '200px',
  maxHeight = '500px',
  toolbar = ['bold', 'italic', 'underline', 'link', 'list', 'ordered-list', 'heading1', 'heading2'],
}: SafeRichEditorProps) {
  const [mounted, setMounted] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const editorRef = useRef<HTMLDivElement>(null);
  
  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    setValue(controlledValue || defaultValue);
    
    // Initialize editor content
    if (editorRef.current) {
      editorRef.current.innerHTML = controlledValue || defaultValue;
    }
  }, [controlledValue, defaultValue]);
  
  // Update editor content when controlled value changes
  useEffect(() => {
    if (controlledValue !== undefined && editorRef.current && editorRef.current.innerHTML !== controlledValue) {
      editorRef.current.innerHTML = controlledValue;
    }
  }, [controlledValue]);
  
  // Handle editor input
  const handleInput = () => {
    if (editorRef.current) {
      const newValue = editorRef.current.innerHTML;
      setValue(newValue);
      onChange?.(newValue);
    }
  };
  
  // Execute command
  const execCommand = (command: string, value?: string) => {
    if (disabled || readOnly) return;
    
    document.execCommand(command, false, value);
    handleInput();
    
    // Focus back to editor
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };
  
  // Check if command is active
  const isCommandActive = (command: string) => {
    return document.queryCommandState(command);
  };
  
  // Toolbar buttons
  const toolbarButtons: Record<string, ToolbarButton> = {
    'bold': {
      icon: <Bold className="h-4 w-4" />,
      title: 'Bold',
      action: 'bold',
      isActive: () => isCommandActive('bold'),
    },
    'italic': {
      icon: <Italic className="h-4 w-4" />,
      title: 'Italic',
      action: 'italic',
      isActive: () => isCommandActive('italic'),
    },
    'underline': {
      icon: <Underline className="h-4 w-4" />,
      title: 'Underline',
      action: 'underline',
      isActive: () => isCommandActive('underline'),
    },
    'link': {
      icon: <Link className="h-4 w-4" />,
      title: 'Link',
      action: 'createLink',
      isActive: () => isCommandActive('createLink'),
    },
    'list': {
      icon: <List className="h-4 w-4" />,
      title: 'Bullet List',
      action: 'insertUnorderedList',
      isActive: () => isCommandActive('insertUnorderedList'),
    },
    'ordered-list': {
      icon: <ListOrdered className="h-4 w-4" />,
      title: 'Numbered List',
      action: 'insertOrderedList',
      isActive: () => isCommandActive('insertOrderedList'),
    },
    'heading1': {
      icon: <Heading1 className="h-4 w-4" />,
      title: 'Heading 1',
      action: 'formatBlock',
      isActive: () => document.queryCommandValue('formatBlock') === 'h1',
    },
    'heading2': {
      icon: <Heading2 className="h-4 w-4" />,
      title: 'Heading 2',
      action: 'formatBlock',
      isActive: () => document.queryCommandValue('formatBlock') === 'h2',
    },
    'image': {
      icon: <Image className="h-4 w-4" />,
      title: 'Image',
      action: 'insertImage',
    },
    'align-left': {
      icon: <AlignLeft className="h-4 w-4" />,
      title: 'Align Left',
      action: 'justifyLeft',
      isActive: () => isCommandActive('justifyLeft'),
    },
    'align-center': {
      icon: <AlignCenter className="h-4 w-4" />,
      title: 'Align Center',
      action: 'justifyCenter',
      isActive: () => isCommandActive('justifyCenter'),
    },
    'align-right': {
      icon: <AlignRight className="h-4 w-4" />,
      title: 'Align Right',
      action: 'justifyRight',
      isActive: () => isCommandActive('justifyRight'),
    },
    'code': {
      icon: <Code className="h-4 w-4" />,
      title: 'Code',
      action: 'formatBlock',
      isActive: () => document.queryCommandValue('formatBlock') === 'pre',
    },
    'quote': {
      icon: <Quote className="h-4 w-4" />,
      title: 'Quote',
      action: 'formatBlock',
      isActive: () => document.queryCommandValue('formatBlock') === 'blockquote',
    },
    'undo': {
      icon: <Undo className="h-4 w-4" />,
      title: 'Undo',
      action: 'undo',
    },
    'redo': {
      icon: <Redo className="h-4 w-4" />,
      title: 'Redo',
      action: 'redo',
    },
  };
  
  // Handle toolbar button click
  const handleButtonClick = (button: ToolbarButton) => {
    if (disabled || readOnly) return;
    
    switch (button.action) {
      case 'createLink':
        const url = prompt('Enter URL:');
        if (url) {
          execCommand(button.action, url);
        }
        break;
      case 'insertImage':
        const imageUrl = prompt('Enter image URL:');
        if (imageUrl) {
          execCommand(button.action, imageUrl);
        }
        break;
      case 'formatBlock':
        if (button.title === 'Heading 1') {
          execCommand(button.action, '<h1>');
        } else if (button.title === 'Heading 2') {
          execCommand(button.action, '<h2>');
        } else if (button.title === 'Code') {
          execCommand(button.action, '<pre>');
        } else if (button.title === 'Quote') {
          execCommand(button.action, '<blockquote>');
        }
        break;
      default:
        execCommand(button.action);
        break;
    }
  };
  
  // Simple loading state for SSR
  const RichEditorSkeleton = () => (
    <div className={`w-full ${className || ''}`}>
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-t w-full"></div>
      <div className="h-40 bg-gray-100 dark:bg-gray-800 rounded-b w-full border border-gray-300 dark:border-gray-700"></div>
    </div>
  );
  
  // If not mounted, show skeleton
  if (!mounted) {
    return <RichEditorSkeleton />;
  }
  
  return (
    <ClientOnly fallback={<RichEditorSkeleton />}>
      <div className={`w-full border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden ${className || ''}`}>
        {/* Toolbar */}
        <div className={`flex flex-wrap items-center p-2 gap-1 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 ${toolbarClassName || ''}`}>
          {toolbar.map((buttonKey) => {
            const button = toolbarButtons[buttonKey];
            if (!button) return null;
            
            const isActive = button.isActive && button.isActive(editorRef.current!);
            
            return (
              <button
                key={buttonKey}
                type="button"
                title={button.title}
                className={`p-2 rounded-md ${
                  disabled || readOnly
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                } ${
                  isActive
                    ? `bg-gray-200 dark:bg-gray-700 ${activeButtonClassName || ''}`
                    : ''
                } ${buttonClassName || ''}`}
                onClick={() => handleButtonClick(button)}
                disabled={disabled || readOnly}
              >
                {button.icon}
              </button>
            );
          })}
        </div>
        
        {/* Editor */}
        <div
          ref={editorRef}
          className={`w-full p-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-auto ${editorClassName || ''}`}
          contentEditable={!disabled && !readOnly}
          onInput={handleInput}
          placeholder={placeholder}
          style={{
            minHeight,
            maxHeight,
          }}
          suppressContentEditableWarning
        />
      </div>
    </ClientOnly>
  );
}
