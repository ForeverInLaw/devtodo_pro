import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const TaskFilters = ({
  filters,
  onFiltersChange,
  isCollapsed,
  onToggleCollapse,
  tasks = [],
  className = "",
  isMobileOpen,
  onMobileClose
}) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    priorities: true,
    status: true,
    dates: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (category, checked) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handlePriorityChange = (priority, checked) => {
    const newPriorities = checked
      ? [...filters.priorities, priority]
      : filters.priorities.filter(p => p !== priority);
    onFiltersChange({ ...filters, priorities: newPriorities });
  };

  const handleStatusChange = (status, checked) => {
    const newStatuses = checked
      ? [...filters.statuses, status]
      : filters.statuses.filter(s => s !== status);
    onFiltersChange({ ...filters, statuses: newStatuses });
  };

  const handleDateRangeChange = (range) => {
    onFiltersChange({ ...filters, dateRange: range });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      priorities: [],
      statuses: [],
      dateRange: 'all'
    });
  };

  const stats = useMemo(() => {
    const categoryCounts = {};
    const priorityCounts = {};
    const statusCounts = { pending: 0, completed: 0 };

    for (const task of tasks) {
      if (task.category) categoryCounts[task.category] = (categoryCounts[task.category] || 0) + 1;
      if (task.priority) priorityCounts[task.priority] = (priorityCounts[task.priority] || 0) + 1;
      if (task.completed) statusCounts.completed++;
      else statusCounts.pending++;
    }
    return { categoryCounts, priorityCounts, statusCounts };
  }, [tasks]);

  const categoryOptions = [
    { value: 'development', label: 'Development' },
    { value: 'testing', label: 'Testing' },
    { value: 'documentation', label: 'Documentation' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'research', label: 'Research' },
    { value: 'bug-fix', label: 'Bug Fix' },
    { value: 'feature', label: 'Feature' },
    { value: 'maintenance', label: 'Maintenance' }
  ];

  const categories = categoryOptions.map(c => ({
    id: c.value,
    label: c.label,
    count: stats.categoryCounts[c.value] || 0
  }));

  const priorities = [
    { id: 'critical', label: 'Critical', color: 'text-red-600' },
    { id: 'high', label: 'High Priority', color: 'text-error' },
    { id: 'medium', label: 'Medium Priority', color: 'text-warning' },
    { id: 'low', label: 'Low Priority', color: 'text-success' }
  ].map(p => ({ ...p, count: stats.priorityCounts[p.id] || 0 }));

  const statuses = [
    { id: 'pending', label: 'Pending' },
    { id: 'completed', label: 'Completed' }
  ].map(s => ({ ...s, count: stats.statusCounts[s.id] || 0 }));

  const dateRanges = [
    { id: 'all', label: 'All Tasks' },
    { id: 'today', label: 'Due Today' },
    { id: 'tomorrow', label: 'Due Tomorrow' },
    { id: 'week', label: 'This Week' },
    { id: 'month', 'label': 'This Month' },
    { id: 'overdue', label: 'Overdue' }
  ];

  const sidebarVariants = {
    expanded: {
      width: 320,
      transition: { type: 'spring', damping: 25, stiffness: 200 }
    },
    collapsed: {
      width: 64,
      transition: { type: 'spring', damping: 25, stiffness: 200 }
    }
  };

  const mobileOverlayVariants = {
    hidden: {
      x: '-100%',
      transition: { type: 'spring', damping: 25, stiffness: 200 }
    },
    visible: {
      x: 0,
      transition: { type: 'spring', damping: 25, stiffness: 200 }
    }
  };

  const FilterContent = ({ isMobile }) => (
    <div className={`p-6 space-y-6 overflow-y-auto h-full ${isMobile ? 'pt-16' : ''}`}>
      {/* Header */}
      <div className={`flex items-center justify-between ${isMobile ? 'fixed top-0 left-0 right-0 bg-card p-4 border-b border-border z-10' : ''}`}>
        <h2 className="text-lg font-semibold text-foreground">Filters</h2>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
            Clear All
          </Button>
          <Button variant="ghost" size="icon" onClick={isMobile ? onMobileClose : onToggleCollapse} className="w-8 h-8">
            <Icon name={isMobile ? "X" : "ChevronLeft"} size={16} />
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <button onClick={() => toggleSection('categories')} className="flex items-center justify-between w-full text-left">
          <h3 className="font-medium text-foreground">Categories</h3>
          <Icon name={expandedSections.categories ? "ChevronDown" : "ChevronRight"} size={16} className="text-muted-foreground" />
        </button>
        {expandedSections.categories && (
          <div className="space-y-2 pl-2">
            {categories.map(category => (
              <div key={category.id} className="flex items-center justify-between">
                <Checkbox
                  label={category.label}
                  checked={filters.categories.includes(category.id)}
                  onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground ml-2">{category.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Priorities */}
      <div className="space-y-3">
        <button onClick={() => toggleSection('priorities')} className="flex items-center justify-between w-full text-left">
          <h3 className="font-medium text-foreground">Priority</h3>
          <Icon name={expandedSections.priorities ? "ChevronDown" : "ChevronRight"} size={16} className="text-muted-foreground" />
        </button>
        {expandedSections.priorities && (
          <div className="space-y-2 pl-2">
            {priorities.map(priority => (
              <div key={priority.id} className="flex items-center justify-between">
                <Checkbox
                  label={<span className={priority.color}>{priority.label}</span>}
                  checked={filters.priorities.includes(priority.id)}
                  onChange={(e) => handlePriorityChange(priority.id, e.target.checked)}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground ml-2">{priority.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status */}
      <div className="space-y-3">
        <button onClick={() => toggleSection('status')} className="flex items-center justify-between w-full text-left">
          <h3 className="font-medium text-foreground">Status</h3>
          <Icon name={expandedSections.status ? "ChevronDown" : "ChevronRight"} size={16} className="text-muted-foreground" />
        </button>
        {expandedSections.status && (
          <div className="space-y-2 pl-2">
            {statuses.map(status => (
              <div key={status.id} className="flex items-center justify-between">
                <Checkbox
                  label={status.label}
                  checked={filters.statuses.includes(status.id)}
                  onChange={(e) => handleStatusChange(status.id, e.target.checked)}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground ml-2">{status.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Due Dates */}
      <div className="space-y-3">
        <button onClick={() => toggleSection('dates')} className="flex items-center justify-between w-full text-left">
          <h3 className="font-medium text-foreground">Due Date</h3>
          <Icon name={expandedSections.dates ? "ChevronDown" : "ChevronRight"} size={16} className="text-muted-foreground" />
        </button>
        {expandedSections.dates && (
          <div className="space-y-2 pl-2">
            {dateRanges.map(range => (
              <button
                key={range.id}
                onClick={() => handleDateRangeChange(range.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${filters.dateRange === range.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground'}`}
              >
                {range.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        initial={false}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        variants={sidebarVariants}
        className={`hidden md:block bg-card border-r border-border relative ${className}`}
      >
        <AnimatePresence>
          {!isCollapsed ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.2 } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="overflow-hidden"
            >
              <FilterContent isMobile={false} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.2 } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="flex justify-center items-start pt-4"
            >
              <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="w-full h-12">
                <Icon name="Filter" size={20} />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={onMobileClose}
            />
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={mobileOverlayVariants}
              className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-card z-50 md:hidden"
            >
              <FilterContent isMobile={true} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default TaskFilters;