import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TaskCard = ({ 
  task, 
  viewMode = 'grid',
  onEdit, 
  onDelete, 
  onToggleComplete, 
  onDragStart, 
  onDragEnd,
  isDragging = false 
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-white bg-red-600 border-red-700';
      case 'high': return 'text-error bg-error/10 border-error/20';
      case 'medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'low': return 'text-success bg-success/10 border-success/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'frontend': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'backend': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'devops': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'testing': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      'design': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
      'documentation': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    };
    return colors[category] || 'bg-muted text-muted-foreground';
  };

  const formatDueDate = (date) => {
    const now = new Date();
    const dueDate = new Date(date);
    const diffTime = dueDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays <= 7) return `Due in ${diffDays} days`;
    return dueDate.toLocaleDateString();
  };

  const handleCardClick = (e) => {
    if (viewMode === 'list') {
      e.stopPropagation();
      setIsExpanded(!isExpanded);
    } else {
      navigate(`/task-detail-view?id=${task.id}`);
    }
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task.id);
    if (onDragStart) onDragStart(task.id);
  };

  const handleDragEnd = () => {
    if (onDragEnd) onDragEnd();
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        group relative bg-card border border-border rounded-lg
        transition-all duration-250 ease-out
        hover:elevation-2 hover:border-ring/30
        ${task.completed ? 'opacity-60' : ''}
        ${isDragging ? 'opacity-50' : ''}
        ${viewMode === 'grid' ? 'p-4 cursor-pointer' : 'p-0'}
      `}
      onClick={handleCardClick}
    >
      {viewMode === 'grid' ? (
        <>
          {/* Priority Indicator */}
          <div className="absolute top-0 left-0 w-1 h-full rounded-l-lg bg-gradient-to-b from-transparent via-current to-transparent opacity-60" 
               style={{ color: task.priority === 'critical' ? 'rgb(220 38 38)' :
                               task.priority === 'high' ? 'var(--color-error)' :
                               task.priority === 'medium' ? 'var(--color-warning)' :
                               'var(--color-success)' }} />

          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleComplete(task.id);
                }}
                className={`
                  w-5 h-5 rounded border-2 flex items-center justify-center
                  transition-all duration-200 ease-out
                  ${task.completed 
                    ? 'bg-success border-success text-success-foreground' 
                    : 'border-border hover:border-ring'
                  }
                `}
              >
                {task.completed && <Icon name="Check" size={12} />}
              </button>
              
              <span className={`
                inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                ${getPriorityColor(task.priority)}
              `}>
                {task.priority}
              </span>
            </div>

            {/* Quick Actions */}
            <div className={`
              flex items-center space-x-1 transition-all duration-200
              ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}
            `}>
              <div className="cursor-move text-muted-foreground w-8 h-8 flex items-center justify-center" title="Drag to reorder">
                <Icon name="GripVertical" size={16} />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
                className="w-8 h-8"
              >
                <Icon name="Edit2" size={14} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                }}
                className="w-8 h-8 text-error hover:text-error hover:bg-error/10"
              >
                <Icon name="Trash2" size={14} />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h3 className={`
              font-semibold text-foreground line-clamp-2 transition-colors
              ${task.completed ? 'line-through text-muted-foreground' : ''}
            `}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
            <span className={`
              inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
              ${getCategoryColor(task.category)}
            `}>
              {task.category}
            </span>

            {task.dueDate && (
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Icon name="Calendar" size={12} />
                <span className={`
                  ${new Date(task.dueDate) < new Date() ? 'text-error font-medium' : ''}
                `}>
                  {formatDueDate(task.dueDate)}
                </span>
              </div>
            )}
          </div>

          {/* Drag Handle is now part of Quick Actions on hover */}
        </>
      ) : (
        <div className="w-full relative">
          {/* Priority Indicator for List View */}
          <div className="absolute top-0 left-0 w-1 h-full rounded-l-lg bg-gradient-to-b from-transparent via-current to-transparent opacity-60"
               style={{ color: task.priority === 'critical' ? 'rgb(220 38 38)' :
                               task.priority === 'high' ? 'var(--color-error)' :
                               task.priority === 'medium' ? 'var(--color-warning)' :
                               'var(--color-success)' }} />
          <div className="flex items-center p-3 cursor-pointer" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={(e) => { e.stopPropagation(); onToggleComplete(task.id); }}
              className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 ease-out mr-3 ${task.completed ? 'bg-success border-success text-success-foreground' : 'border-border hover:border-ring'}`}
            >
              {task.completed && <Icon name="Check" size={12} />}
            </button>
            <div className="flex-grow min-w-0" onClick={handleCardClick}>
              <h3 className={`font-semibold text-foreground transition-colors ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                {task.title}
              </h3>
            </div>
            <span className={`
              inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
              ${getPriorityColor(task.priority)}
            `}>
              {task.priority}
            </span>
            <button onClick={handleCardClick} className="p-2 text-muted-foreground">
              <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
            </button>
          </div>
          {isExpanded && (
            <div className="px-3 pb-3">
              <div className="border-t border-border pt-3 mt-3">
                {task.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {task.description}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full font-medium ${getCategoryColor(task.category)}`}>
                    {task.category}
                  </span>
                  {task.dueDate && (
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Icon name="Calendar" size={12} />
                      <span className={`${new Date(task.dueDate) < new Date() ? 'text-error font-medium' : ''}`}>
                        {formatDueDate(task.dueDate)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-end mt-3">
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onEdit(task); }}>
                    <Icon name="Edit2" size={14} className="mr-2" /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} className="text-error hover:text-error hover:bg-error/10">
                    <Icon name="Trash2" size={14} className="mr-2" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCard;