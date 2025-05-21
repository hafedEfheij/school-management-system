'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { ClientOnly } from './client-only';
import { ChevronRight, ChevronDown, Folder, File as FileIcon } from 'lucide-react';

export interface TreeNode {
  id: string;
  label: string;
  icon?: ReactNode;
  children?: TreeNode[];
  expanded?: boolean;
  selected?: boolean;
  disabled?: boolean;
  data?: any;
}

interface SafeTreeViewProps {
  nodes: TreeNode[];
  onNodeSelect?: (node: TreeNode) => void;
  onNodeToggle?: (node: TreeNode, expanded: boolean) => void;
  defaultExpandAll?: boolean;
  multiSelect?: boolean;
  className?: string;
  nodeClassName?: string;
  selectedNodeClassName?: string;
  expandedNodeClassName?: string;
  disabledNodeClassName?: string;
  iconClassName?: string;
  labelClassName?: string;
  indentSize?: number;
  showLines?: boolean;
  lineClassName?: string;
}

/**
 * A hydration-safe tree view component that handles SSR and client-side rendering properly
 */
export function SafeTreeView({
  nodes,
  onNodeSelect,
  onNodeToggle,
  defaultExpandAll = false,
  multiSelect = false,
  className,
  nodeClassName,
  selectedNodeClassName,
  expandedNodeClassName,
  disabledNodeClassName,
  iconClassName,
  labelClassName,
  indentSize = 24,
  showLines = false,
  lineClassName,
}: SafeTreeViewProps) {
  const [mounted, setMounted] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  const [selectedNodes, setSelectedNodes] = useState<Record<string, boolean>>({});
  
  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    
    // Initialize expanded nodes
    if (defaultExpandAll) {
      const expanded: Record<string, boolean> = {};
      const expandAll = (nodes: TreeNode[]) => {
        nodes.forEach((node) => {
          if (node.children && node.children.length > 0) {
            expanded[node.id] = true;
            expandAll(node.children);
          }
        });
      };
      expandAll(nodes);
      setExpandedNodes(expanded);
    } else {
      // Initialize with nodes that have expanded=true
      const expanded: Record<string, boolean> = {};
      const initExpanded = (nodes: TreeNode[]) => {
        nodes.forEach((node) => {
          if (node.expanded) {
            expanded[node.id] = true;
          }
          if (node.children) {
            initExpanded(node.children);
          }
        });
      };
      initExpanded(nodes);
      setExpandedNodes(expanded);
    }
    
    // Initialize selected nodes
    const selected: Record<string, boolean> = {};
    const initSelected = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        if (node.selected) {
          selected[node.id] = true;
        }
        if (node.children) {
          initSelected(node.children);
        }
      });
    };
    initSelected(nodes);
    setSelectedNodes(selected);
  }, [nodes, defaultExpandAll]);
  
  // Check if node is expanded
  const isNodeExpanded = (node: TreeNode) => {
    return expandedNodes[node.id] || false;
  };
  
  // Check if node is selected
  const isNodeSelected = (node: TreeNode) => {
    return selectedNodes[node.id] || false;
  };
  
  // Toggle node expansion
  const toggleNode = (node: TreeNode) => {
    if (!node.children || node.children.length === 0 || node.disabled) return;
    
    const newExpandedNodes = { ...expandedNodes };
    newExpandedNodes[node.id] = !newExpandedNodes[node.id];
    
    setExpandedNodes(newExpandedNodes);
    onNodeToggle?.(node, newExpandedNodes[node.id]);
  };
  
  // Select node
  const selectNode = (node: TreeNode, event?: React.MouseEvent) => {
    if (node.disabled) return;
    
    const newSelectedNodes = { ...selectedNodes };
    
    if (multiSelect && event?.ctrlKey) {
      // Toggle selection with Ctrl key
      newSelectedNodes[node.id] = !newSelectedNodes[node.id];
    } else if (multiSelect && event?.shiftKey) {
      // Range selection with Shift key (simplified)
      newSelectedNodes[node.id] = true;
    } else {
      // Single selection
      Object.keys(newSelectedNodes).forEach((key) => {
        newSelectedNodes[key] = false;
      });
      newSelectedNodes[node.id] = true;
    }
    
    setSelectedNodes(newSelectedNodes);
    onNodeSelect?.(node);
  };
  
  // Get default icon for node
  const getDefaultIcon = (node: TreeNode) => {
    if (node.children && node.children.length > 0) {
      return <Folder className="h-4 w-4" />;
    }
    return <FileIcon className="h-4 w-4" />;
  };
  
  // Render tree node
  const renderTreeNode = (node: TreeNode, level = 0, isLast = false, parentPath: boolean[] = []) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = isNodeExpanded(node);
    const isSelected = isNodeSelected(node);
    
    return (
      <div key={node.id}>
        {/* Node */}
        <div
          className={`flex items-center py-1 ${
            isSelected
              ? `bg-blue-100 dark:bg-blue-900/20 ${selectedNodeClassName || ''}`
              : ''
          } ${
            isExpanded
              ? expandedNodeClassName || ''
              : ''
          } ${
            node.disabled
              ? `opacity-50 cursor-not-allowed ${disabledNodeClassName || ''}`
              : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800'
          } ${nodeClassName || ''}`}
          style={{ paddingLeft: `${level * indentSize}px` }}
          onClick={(e) => selectNode(node, e)}
        >
          {/* Expand/collapse icon */}
          {hasChildren ? (
            <div
              className="mr-1 flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              )}
            </div>
          ) : (
            <div className="mr-1 w-4" />
          )}
          
          {/* Node icon */}
          <div className={`mr-2 flex-shrink-0 ${iconClassName || ''}`}>
            {node.icon || getDefaultIcon(node)}
          </div>
          
          {/* Node label */}
          <div className={`truncate ${labelClassName || ''}`}>
            {node.label}
          </div>
        </div>
        
        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="relative">
            {/* Vertical lines */}
            {showLines && level > 0 && (
              <div className="absolute top-0 bottom-0 left-0">
                {parentPath.map((isLastItem, idx) => (
                  !isLastItem && (
                    <div
                      key={idx}
                      className={`absolute top-0 bottom-0 border-l border-gray-300 dark:border-gray-700 ${lineClassName || ''}`}
                      style={{ left: `${idx * indentSize + indentSize / 2}px` }}
                    />
                  )
                ))}
              </div>
            )}
            
            {node.children.map((childNode, index) => (
              renderTreeNode(
                childNode,
                level + 1,
                index === node.children!.length - 1,
                [...parentPath, isLast]
              )
            ))}
          </div>
        )}
      </div>
    );
  };
  
  // Simple loading state for SSR
  const TreeViewSkeleton = () => (
    <div className={`w-full ${className || ''}`}>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center py-1" style={{ paddingLeft: `${index * indentSize}px` }}>
          <div className="mr-1 w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="mr-2 w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        </div>
      ))}
    </div>
  );
  
  // If not mounted, show skeleton
  if (!mounted) {
    return <TreeViewSkeleton />;
  }
  
  return (
    <ClientOnly fallback={<TreeViewSkeleton />}>
      <div className={`w-full ${className || ''}`}>
        {nodes.map((node, index) => renderTreeNode(node, 0, index === nodes.length - 1))}
      </div>
    </ClientOnly>
  );
}
