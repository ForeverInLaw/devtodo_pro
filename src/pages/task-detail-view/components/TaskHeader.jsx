import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TaskHeader = ({ task, onTaskUpdate, onTaskDelete }) => {
  const navigate = useNavigate();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const handleTitleEdit = () => {
    setIsEditingTitle(true);
  };

  const handleTitleSave = () => {
    if (editedTitle.trim()) {
      onTaskUpdate({ ...task, title: editedTitle.trim() });
      setIsEditingTitle(false);
    }
  };

  const handleTitleCancel = () => {
    setEditedTitle(task.title);
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      handleTitleCancel();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-card rounded-lg p-6 mb-6 elevation-1">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
        <button
          onClick={() => navigate('/task-dashboard')}
          className="hover:text-foreground transition-colors flex items-center space-x-1"
        >
          <Icon name="ArrowLeft" size={16} />
          <span>Dashboard</span>
        </button>
        <Icon name="ChevronRight" size={16} />
        <span className="text-foreground">Task Details</span>
      </div>

      {/* Task Title */}
      <div className="mb-4">
        {isEditingTitle ? (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="text-2xl font-semibold bg-background border border-border rounded-md px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-ring"
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleTitleSave}
              className="text-success"
            >
              <Icon name="Check" size={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleTitleCancel}
              className="text-muted-foreground"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-2 group">
            <h1 className="text-2xl font-semibold text-foreground flex-1">
              {task.title}
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleTitleEdit}
              className="opacity-0 group-hover:opacity-100 transition-colors"
            >
              <Icon name="Edit2" size={16} />
            </Button>
          </div>
        )}
      </div>

      {/* Task Metadata */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center space-x-2">
          <Icon name="Calendar" size={16} />
          <span>Created: {formatDate(task.createdAt)}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Icon name="Clock" size={16} />
          <span>Modified: {formatDate(task.updatedAt)}</span>
        </div>

        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            task.status === 'completed' ? 'bg-success' : 'bg-warning'
          }`} />
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

export default TaskHeader;