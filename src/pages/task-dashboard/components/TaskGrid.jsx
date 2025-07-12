import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from './TaskCard';
import Icon from '../../../components/AppIcon';

const TaskGrid = ({
  tasks,
  viewMode,
  onEditTask,
  onDeleteTask,
  onToggleComplete,
  onTaskReorder,
  onTaskDragOver,
  onDragStart,
  onDragEnd,
  searchQuery,
  isLoading,
  className = ""
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // Corresponds to md breakpoint
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragStart = (taskId) => {
    setDraggedTaskId(taskId);
    if (onDragStart) {
      onDragStart();
    }
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverIndex(null);
    if (onDragEnd) {
      onDragEnd();
    }
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedTaskId) {
      const draggedIndex = tasks.findIndex(task => task.id === draggedTaskId);
      if (draggedIndex !== index) {
        onTaskDragOver(draggedIndex, index);
      }
    }
    setDragOverIndex(index);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (draggedTaskId && onTaskReorder) {
      const draggedIndex = tasks.findIndex(task => task.id === draggedTaskId);
      if (draggedIndex !== dropIndex) {
        onTaskReorder(draggedIndex, dropIndex);
      }
    }
    
    setDraggedTaskId(null);
    setDragOverIndex(null);
  };

  const highlightSearchTerm = (text, searchTerm) => {
    if (!searchTerm || !text) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Icon name="Loader" className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <Icon name="CheckSquare" size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No tasks found</h3>
        <p className="text-muted-foreground text-center max-w-md">
          {searchQuery
            ? `No tasks match your search for "${searchQuery}". Try adjusting your search terms or filters.`
            : "You don't have any tasks yet. Create your first task to get started with your productivity journey."
          }
        </p>
      </div>
    );
  }

  if (viewMode === 'list' && !isMobile) {
    return (
      <div className={`space-y-2 ${className}`}>
        {tasks.map((task, index) => (
          <div
            key={task.id}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            className={`
              transition-all duration-200
              ${dragOverIndex === index ? 'border-t-2 border-primary' : ''}
            `}
          >
            <div className="bg-card border border-border rounded-lg p-4 hover:elevation-1 transition-all duration-200">
              <div className="flex items-center space-x-4">
                {/* Completion Checkbox */}
                <button
                  onClick={() => onToggleComplete(task.id)}
                  className={`
                    w-5 h-5 rounded border-2 flex items-center justify-center
                    transition-all duration-200 ease-out flex-shrink-0
                    ${task.completed 
                      ? 'bg-success border-success text-success-foreground' 
                      : 'border-border hover:border-ring'
                    }
                  `}
                >
                  {task.completed && <Icon name="Check" size={12} />}
                </button>

                {/* Task Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <h3 className={`
                      font-semibold text-foreground truncate
                      ${task.completed ? 'line-through text-muted-foreground' : ''}
                    `}>
                      {highlightSearchTerm(task.title, searchQuery)}
                    </h3>
                    
                    {/* Priority Badge */}
                    <span className={`
                      inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border flex-shrink-0
                      ${task.priority === 'critical' ? 'text-white bg-red-600 border-red-700' :
                        task.priority === 'high' ? 'text-error bg-error/10 border-error/20' :
                        task.priority === 'medium' ? 'text-warning bg-warning/10 border-warning/20' :
                        'text-success bg-success/10 border-success/20'}
                    `}>
                      {task.priority}
                    </span>

                    {/* Category Badge */}
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground flex-shrink-0">
                      {task.category}
                    </span>
                  </div>
                  
                  {task.description && (
                    <p className="text-sm text-muted-foreground mt-1 truncate">
                      {highlightSearchTerm(task.description, searchQuery)}
                    </p>
                  )}
                </div>

                {/* Due Date */}
                {task.dueDate && (
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground flex-shrink-0">
                    <Icon name="Calendar" size={14} />
                    <span className={`
                      ${new Date(task.dueDate) < new Date() ? 'text-error font-medium' : ''}
                    `}>
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <button
                    onClick={() => onEditTask(task)}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                  >
                    <Icon name="Edit2" size={16} />
                  </button>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-2 text-muted-foreground hover:text-error hover:bg-error/10 rounded-md transition-colors"
                  >
                    <Icon name="Trash2" size={16} />
                  </button>
                  <div className="p-2 text-muted-foreground cursor-grab">
                    <Icon name="GripVertical" size={16} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div layout className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      <AnimatePresence>
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            className={`
              transition-all duration-200
              ${dragOverIndex === index ? 'scale-105' : ''}
            `}
          >
            <TaskCard
              task={{
                ...task,
                title: highlightSearchTerm(task.title, searchQuery),
                description: task.description ? highlightSearchTerm(task.description, searchQuery) : task.description
              }}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onToggleComplete={onToggleComplete}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              isDragging={draggedTaskId === task.id}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskGrid;