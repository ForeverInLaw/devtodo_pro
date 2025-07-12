import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../../components/ui/Button';

const TaskActions = ({ task, onTaskUpdate, onTaskDelete }) => {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);

  const handleMarkComplete = async () => {
    setIsCompleting(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const updatedTask = {
      ...task,
      status: task.status === 'completed' ? 'pending' : 'completed',
      progress: task.status === 'completed' ? 0 : 100,
      updatedAt: new Date().toISOString()
    };
    
    onTaskUpdate(updatedTask);
    setIsCompleting(false);
  };

  const handleEditTask = () => {
    navigate('/task-creation-modal', { 
      state: { 
        editMode: true, 
        taskData: task 
      } 
    });
  };

  const handleDeleteTask = () => {
    onTaskDelete(task.id);
    navigate('/task-dashboard');
  };

  const handleDuplicateTask = async () => {
    setIsDuplicating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const duplicatedTask = {
      ...task,
      id: `task-${Date.now()}`,
      title: `${task.title} (Copy)`,
      status: 'pending',
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // In a real app, this would create the task and navigate to it
    console.log('Duplicated task:', duplicatedTask);
    setIsDuplicating(false);
    
    // Navigate to dashboard to show the new task
    navigate('/task-dashboard');
  };

  const handleBackToDashboard = () => {
    navigate('/task-dashboard');
  };

  return (
    <div className="bg-card rounded-lg p-6 elevation-1">
      <h2 className="text-lg font-semibold text-foreground mb-4">Actions</h2>
      
      <div className="space-y-3">
        {/* Mark Complete/Incomplete */}
        <Button
          variant={task.status === 'completed' ? 'outline' : 'default'}
          fullWidth
          onClick={handleMarkComplete}
          loading={isCompleting}
          iconName={task.status === 'completed' ? 'RotateCcw' : 'Check'}
          iconPosition="left"
          className="justify-start"
        >
          {task.status === 'completed' ? 'Mark Incomplete' : 'Mark Complete'}
        </Button>

        {/* Edit Task */}
        <Button
          variant="outline"
          fullWidth
          onClick={handleEditTask}
          iconName="Edit2"
          iconPosition="left"
          className="justify-start"
        >
          Edit Task
        </Button>

        {/* Duplicate Task */}
        <Button
          variant="outline"
          fullWidth
          onClick={handleDuplicateTask}
          loading={isDuplicating}
          iconName="Copy"
          iconPosition="left"
          className="justify-start"
        >
          Duplicate Task
        </Button>

        {/* Delete Task */}
        {!showDeleteConfirm ? (
          <Button
            variant="destructive"
            fullWidth
            onClick={() => setShowDeleteConfirm(true)}
            iconName="Trash2"
            iconPosition="left"
            className="justify-start"
          >
            Delete Task
          </Button>
        ) : (
          <div className="space-y-2 p-3 bg-error/10 border border-error/20 rounded-md">
            <p className="text-sm text-error font-medium">
              Are you sure you want to delete this task?
            </p>
            <p className="text-xs text-muted-foreground">
              This action cannot be undone.
            </p>
            <div className="flex space-x-2 mt-3">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteTask}
                iconName="Trash2"
                iconPosition="left"
              >
                Delete
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
                iconName="X"
                iconPosition="left"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Back to Dashboard */}
        <div className="pt-4 border-t border-border">
          <Button
            variant="ghost"
            fullWidth
            onClick={handleBackToDashboard}
            iconName="ArrowLeft"
            iconPosition="left"
            className="justify-start"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskActions;