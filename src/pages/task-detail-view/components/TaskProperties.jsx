import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const TaskProperties = ({ task, onTaskUpdate }) => {
  const [isEditingDueDate, setIsEditingDueDate] = useState(false);
  const [editedDueDate, setEditedDueDate] = useState(task.dueDate || '');

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const categoryOptions = [
    { value: 'development', label: 'Development' },
    { value: 'bug-fix', label: 'Bug Fix' },
    { value: 'feature', label: 'Feature' },
    { value: 'documentation', label: 'Documentation' },
    { value: 'testing', label: 'Testing' },
    { value: 'deployment', label: 'Deployment' }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-error text-error-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-accent text-accent-foreground';
      case 'low': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handlePriorityChange = (newPriority) => {
    onTaskUpdate({ ...task, priority: newPriority });
  };

  const handleCategoryChange = (newCategory) => {
    onTaskUpdate({ ...task, category: newCategory });
  };

  const handleDueDateSave = () => {
    onTaskUpdate({ ...task, dueDate: editedDueDate });
    setIsEditingDueDate(false);
  };

  const handleDueDateCancel = () => {
    setEditedDueDate(task.dueDate || '');
    setIsEditingDueDate(false);
  };

  const formatDueDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `Due in ${diffDays} days`;
    }
  };

  const getDueDateColor = (dateString) => {
    if (!dateString) return 'text-muted-foreground';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-error';
    if (diffDays <= 1) return 'text-warning';
    return 'text-foreground';
  };

  return (
    <div className="bg-card rounded-lg p-6 elevation-1 space-y-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Properties</h2>

      {/* Priority */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Priority</label>
        <Select
          options={priorityOptions}
          value={task.priority}
          onChange={handlePriorityChange}
          placeholder="Select priority"
        />
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
          <div className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
          {priorityOptions.find(p => p.value === task.priority)?.label || 'No Priority'}
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Category</label>
        <Select
          options={categoryOptions}
          value={task.category}
          onChange={handleCategoryChange}
          placeholder="Select category"
        />
        <div className="flex items-center space-x-2">
          <Icon name="Tag" size={16} className="text-muted-foreground" />
          <span className="text-sm text-foreground">
            {categoryOptions.find(c => c.value === task.category)?.label || 'Uncategorized'}
          </span>
        </div>
      </div>

      {/* Due Date */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Due Date</label>
        
        {isEditingDueDate ? (
          <div className="space-y-2">
            <input
              type="datetime-local"
              value={editedDueDate}
              onChange={(e) => setEditedDueDate(e.target.value)}
              className="w-full p-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
            />
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDueDateSave}
                iconName="Check"
                iconPosition="left"
              >
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDueDateCancel}
                iconName="X"
                iconPosition="left"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Calendar" size={16} className="text-muted-foreground" />
              <span className={`text-sm ${getDueDateColor(task.dueDate)}`}>
                {formatDueDate(task.dueDate)}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditingDueDate(true)}
              iconName="Edit2"
            />
          </div>
        )}
      </div>

      {/* Completion Progress */}
      {task.progress !== undefined && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Progress</label>
            <span className="text-sm text-muted-foreground">{task.progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Task Stats */}
      <div className="pt-4 border-t border-border space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Task ID</span>
          <span className="text-foreground font-mono">{task.id}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Status</span>
          <span className={`font-medium ${
            task.status === 'completed' ? 'text-success' : 'text-warning'
          }`}>
            {task.status === 'completed' ? 'Completed' : 'In Progress'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskProperties;