import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import ProjectSelector from '../../../components/ui/ProjectSelector';
import { useProjects } from '../../../contexts/ProjectContext';

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
  isTasksLoading,
  projectName,
  className = ""
}) => {
  const navigate = useNavigate();
  const { projects, selectedProject, setSelectedProject, isLoading: isProjectsLoading } = useProjects();

  const sortOptions = [
    { value: 'priority', label: 'Priority' },
    { value: 'dueDate', label: 'Due Date' },
    { value: 'title', label: 'Alphabetical' },
    { value: 'created', label: 'Date Created' },
    { value: 'category', label: 'Category' }
  ];

  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const animatedTotalTasks = useSpring(0, { damping: 20, stiffness: 100 });
  const animatedCompletedTasks = useSpring(0, { damping: 20, stiffness: 100 });
  const animatedPercentage = useSpring(0, { damping: 20, stiffness: 100 });

  const totalTasksString = useTransform(animatedTotalTasks, v => Math.round(v));
  const completedTasksString = useTransform(animatedCompletedTasks, v => Math.round(v));
  const percentageString = useTransform(animatedPercentage, (v) => `${Math.round(v)}%`);

  useEffect(() => {
    if (!isTasksLoading) {
      animatedTotalTasks.set(totalTasks);
      animatedCompletedTasks.set(completedTasks);
      animatedPercentage.set(completionPercentage);
    } else {
      animatedTotalTasks.set(0);
      animatedCompletedTasks.set(0);
      animatedPercentage.set(0);
    }
  }, [totalTasks, completedTasks, completionPercentage, isTasksLoading, animatedTotalTasks, animatedCompletedTasks, animatedPercentage]);

  return (
    <div className={`bg-background border-b border-border ${className}`}>
      <div className="px-4 md:px-6 py-3">
        <div className="flex items-center justify-start gap-4">
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

          {/* Project Selector */}
          <div className="hidden md:block">
            <ProjectSelector
              selectedProject={selectedProject}
              onProjectChange={setSelectedProject}
              projects={projects}
              isLoading={isProjectsLoading}
            />
          </div>

          {/* Mobile Project Button */}
          <div className="md:hidden">
            <Button variant="outline" onClick={() => navigate('/projects')} className="min-w-[120px] justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isProjectsLoading ? 'loader' : 'content'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center"
                >
                  {isProjectsLoading ? (
                    <div className="h-5 w-20 bg-muted rounded" />
                  ) : (
                    <>
                      {projectName || 'Projects'}
                      <Icon name="ChevronDown" size={16} className="ml-2" />
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex-1 min-w-0 md:ml-4 h-12 flex flex-col justify-center">
            <div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="truncate min-w-[80px]">
                  <motion.span className="font-medium text-foreground">
                    {totalTasksString}
                  </motion.span>
                  {' '}tasks
                </div>
                <div className="hidden sm:block truncate min-w-[120px]">
                  <motion.span className="font-medium text-foreground">
                    {completedTasksString}
                  </motion.span>
                  {' '}completed
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-success"
                    animate={{ width: isTasksLoading ? '0%' : `${completionPercentage}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
                <motion.span className="text-sm font-medium text-foreground w-12 text-right">
                  {percentageString}
                </motion.span>
              </div>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2 md:space-x-4 ml-auto">
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