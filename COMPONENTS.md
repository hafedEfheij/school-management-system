# School Management System - Component Library

This document provides an overview of all the custom components created for the School Management System.

## Hydration-Safe Components

### Core Components

#### 1. SafeButton
- **Location**: `src/components/ui/safe-button.tsx`
- **Purpose**: Hydration-safe button component with loading states
- **Features**: Multiple variants, sizes, loading spinner, icon support

#### 2. SafeImage
- **Location**: `src/components/ui/safe-image.tsx`
- **Purpose**: Hydration-safe image component with fallback support
- **Features**: Lazy loading, error handling, placeholder support

#### 3. ClientOnly
- **Location**: `src/components/ui/client-only.tsx`
- **Purpose**: Wrapper for client-side only components
- **Features**: Prevents hydration mismatches, fallback support

### Form Components

#### 4. SafeForm
- **Location**: `src/components/ui/safe-form.tsx`
- **Purpose**: Hydration-safe form wrapper
- **Features**: Form validation, error handling, loading states

#### 5. SafeInput
- **Location**: `src/components/ui/safe-input.tsx`
- **Purpose**: Enhanced input component
- **Features**: Validation, icons, different types, error states

#### 6. SafeSelect
- **Location**: `src/components/ui/safe-select.tsx`
- **Purpose**: Dropdown select component
- **Features**: Search, multi-select, option groups

#### 7. SafeTextarea
- **Location**: `src/components/ui/safe-textarea.tsx`
- **Purpose**: Multi-line text input
- **Features**: Auto-resize, character count, validation

#### 8. SafeCheckbox
- **Location**: `src/components/ui/safe-checkbox.tsx`
- **Purpose**: Checkbox input component
- **Features**: Indeterminate state, custom styling

#### 9. SafeRadio
- **Location**: `src/components/ui/safe-radio.tsx`
- **Purpose**: Radio button component
- **Features**: Group support, custom styling

#### 10. SafeToggle
- **Location**: `src/components/ui/safe-toggle.tsx`
- **Purpose**: Toggle switch component
- **Features**: Different sizes, disabled state

### Navigation Components

#### 11. SafePagination
- **Location**: `src/components/ui/safe-pagination.tsx`
- **Purpose**: Pagination component
- **Features**: Page numbers, previous/next, jump to page

#### 12. SafeBreadcrumb
- **Location**: `src/components/ui/safe-breadcrumb.tsx`
- **Purpose**: Breadcrumb navigation
- **Features**: Collapsible items, custom separators

#### 13. SafeTabs
- **Location**: `src/components/ui/safe-tabs.tsx`
- **Purpose**: Tab navigation component
- **Features**: Horizontal/vertical, lazy loading

### Data Display Components

#### 14. SafeTable
- **Location**: `src/components/ui/safe-table.tsx`
- **Purpose**: Data table component
- **Features**: Sorting, pagination, custom cells

#### 15. SafeDataGrid
- **Location**: `src/components/ui/safe-data-grid.tsx`
- **Purpose**: Advanced data grid
- **Features**: Sorting, filtering, selection, pagination

#### 16. SafeTreeView
- **Location**: `src/components/ui/safe-tree-view.tsx`
- **Purpose**: Hierarchical data display
- **Features**: Expand/collapse, selection, icons

#### 17. SafeChart
- **Location**: `src/components/ui/safe-chart.tsx`
- **Purpose**: Data visualization
- **Features**: Bar, line, pie charts, legends

### Feedback Components

#### 18. SafeModal
- **Location**: `src/components/ui/safe-modal.tsx`
- **Purpose**: Modal dialog component
- **Features**: Different sizes, backdrop, focus management

#### 19. SafeToast
- **Location**: `src/components/ui/safe-toast.tsx`
- **Purpose**: Toast notification system
- **Features**: Multiple types, auto-dismiss, positioning

#### 20. SafeAlert
- **Location**: `src/components/ui/safe-alert.tsx`
- **Purpose**: Alert messages
- **Features**: Different variants, dismissible, icons

#### 21. SafeTooltip
- **Location**: `src/components/ui/safe-tooltip.tsx`
- **Purpose**: Tooltip component
- **Features**: Multiple positions, delay, custom content

### Layout Components

#### 22. SafeAccordion
- **Location**: `src/components/ui/safe-accordion.tsx`
- **Purpose**: Collapsible content sections
- **Features**: Multiple open, icons, custom triggers

#### 23. SafeCard
- **Location**: `src/components/ui/safe-card.tsx`
- **Purpose**: Card container component
- **Features**: Header, footer, images, actions

#### 24. SafeSkeleton
- **Location**: `src/components/ui/safe-skeleton.tsx`
- **Purpose**: Loading skeleton component
- **Features**: Different shapes, animations, ready state

### Interactive Components

#### 25. SafeDropdown
- **Location**: `src/components/ui/safe-dropdown.tsx`
- **Purpose**: Dropdown menu component
- **Features**: Nested menus, icons, keyboard navigation

#### 26. SafeSlider
- **Location**: `src/components/ui/safe-slider.tsx`
- **Purpose**: Range slider component
- **Features**: Single/dual handles, steps, marks

#### 27. SafeRating
- **Location**: `src/components/ui/safe-rating.tsx`
- **Purpose**: Star rating component
- **Features**: Half stars, read-only, custom icons

#### 28. SafeColorPicker
- **Location**: `src/components/ui/safe-color-picker.tsx`
- **Purpose**: Color selection component
- **Features**: Preset colors, custom input, formats

### Specialized Components

#### 29. SafeCalendar
- **Location**: `src/components/ui/safe-calendar.tsx`
- **Purpose**: Calendar component
- **Features**: Date selection, events, navigation

#### 30. SafeFileUpload
- **Location**: `src/components/ui/safe-file-upload.tsx`
- **Purpose**: File upload component
- **Features**: Drag & drop, multiple files, progress

#### 31. SafeStepper
- **Location**: `src/components/ui/safe-stepper.tsx`
- **Purpose**: Step-by-step process
- **Features**: Linear/non-linear, validation, icons

#### 32. SafeCountdown
- **Location**: `src/components/ui/safe-countdown.tsx`
- **Purpose**: Countdown timer
- **Features**: Different formats, completion callback

#### 33. SafeRichEditor
- **Location**: `src/components/ui/safe-rich-editor.tsx`
- **Purpose**: Rich text editor
- **Features**: Formatting toolbar, HTML output

## Utility Components

#### 34. LoadingSpinner
- **Location**: `src/components/ui/loading-spinner.tsx`
- **Purpose**: Loading indicator
- **Features**: Multiple sizes, colors, text

#### 35. SearchInput
- **Location**: `src/components/ui/search-input.tsx`
- **Purpose**: Search input with suggestions
- **Features**: Debounce, autocomplete, keyboard navigation

#### 36. FilterPanel
- **Location**: `src/components/ui/filter-panel.tsx`
- **Purpose**: Advanced filtering interface
- **Features**: Multiple filter types, collapsible groups

#### 37. ExportButton
- **Location**: `src/components/ui/export-button.tsx`
- **Purpose**: Data export functionality
- **Features**: Multiple formats (CSV, JSON, Excel, PDF)

#### 38. BulkActions
- **Location**: `src/components/ui/bulk-actions.tsx`
- **Purpose**: Bulk operations interface
- **Features**: Selection, confirmation modals, actions

## Dashboard Components

#### 39. StatsCard
- **Location**: `src/components/ui/stats-card.tsx`
- **Purpose**: Statistics display card
- **Features**: Trend indicators, icons, multiple themes

#### 40. QuickActions
- **Location**: `src/components/ui/quick-actions.tsx`
- **Purpose**: Quick action buttons
- **Features**: Multiple layouts, badges, role-based filtering

#### 41. ActivityFeed
- **Location**: `src/components/ui/activity-feed.tsx`
- **Purpose**: Activity timeline
- **Features**: Timeline view, user avatars, metadata

## Context Providers

#### 42. NotificationContext
- **Location**: `src/contexts/NotificationContext.tsx`
- **Purpose**: Global notification management
- **Features**: Auto-dismiss, persistent notifications, types

#### 43. NotificationContainer
- **Location**: `src/components/ui/notification-container.tsx`
- **Purpose**: Notification display container
- **Features**: Positioning, animations, dismissal

## Theme Components

#### 44. SafeThemeProvider
- **Location**: `src/components/ui/safe-theme-provider.tsx`
- **Purpose**: Theme management
- **Features**: Dark/light mode, system preference

#### 45. ErrorBoundary
- **Location**: `src/components/ui/error-boundary.tsx`
- **Purpose**: Error handling wrapper
- **Features**: Fallback UI, error recovery

## Text Components

#### 46. SafeDate
- **Location**: `src/components/ui/safe-date.tsx`
- **Purpose**: Date formatting component
- **Features**: Locale support, relative time

#### 47. SafeNumber
- **Location**: `src/components/ui/safe-number.tsx`
- **Purpose**: Number formatting component
- **Features**: Currency, percentage, locale

#### 48. SafeText
- **Location**: `src/components/ui/safe-text.tsx`
- **Purpose**: Text display component
- **Features**: RTL support, truncation, highlighting

## Usage Guidelines

### Hydration Safety
All components prefixed with "Safe" are designed to prevent hydration mismatches between server and client rendering.

### Styling
Components use Tailwind CSS classes and support dark mode through CSS variables.

### Accessibility
All components follow WCAG guidelines and include proper ARIA attributes.

### Performance
Components are optimized for performance with lazy loading and memoization where appropriate.

### Customization
Most components accept className props for custom styling and support theme customization.
