import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const TaskToolbar = ({
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  totalTasks,
  completedTasks,
  onAddTask,
  searchQuery,
  onOpenMobileFilters,
  className = ""
}) => {
  const sortOptions = [
    { value: 'priority', label: 'Priority' },
    { value: 'dueDate', label: 'Due Date' },
    { value: 'title', label: 'Alphabetical' },
    { value: 'created', label: 'Date Created' },
    { value: 'category', label: 'Category' }
  ];

  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className={`bg-background border-b border-border ${className}`}>
      <div className="px-4 md:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Filter Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={onOpenMobileFilters}
              aria-label="Open filters"
            >
              <Icon name="Filter" size={20} />
            </Button>
          </div>

          {/* Stats */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="truncate">
                <span className="font-medium text-foreground">{totalTasks}</span> tasks
              </div>
              <div className="hidden sm:block truncate">
                <span className="font-medium text-foreground">{completedTasks}</span> completed
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-success transition-all duration-500 ease-out"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span className="text-sm font-medium text-foreground w-12 text-right">
                {completionPercentage}%
              </span>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Sort Options */}
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Select
                options={sortOptions}
                value={sortBy}
                onChange={onSortChange}
                className="w-40"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="hidden md:flex items-center space-x-1 bg-muted p-1 rounded-md">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onViewModeChange('grid')}
                className={`w-8 h-8 ${viewMode === 'grid' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:bg-background/50'}`}
                aria-label="Grid view"
              >
                <Icon name="LayoutGrid" size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onViewModeChange('list')}
                className={`w-8 h-8 ${viewMode === 'list' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:bg-background/50'}`}
                aria-label="List view"
              >
                <Icon name="List" size={16} />
              </Button>
            </div>

            {/* Add Task Button */}
            <div className="hidden md:block">
              <Button
                variant="default"
                onClick={onAddTask}
                iconName="Plus"
                iconPosition="left"
                className="elevation-1 hover:elevation-2"
              >
                Add Task
              </Button>
            </div>
          </div>
        </div>

        {/* Search Results Info */}
        {searchQuery && (
          <div className="text-sm text-muted-foreground mt-4">
            Showing results for "<span className="font-medium text-foreground">{searchQuery}</span>"
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskToolbar;