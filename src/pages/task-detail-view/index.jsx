import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TaskHeader from './components/TaskHeader';
import TaskContent from './components/TaskContent';
import TaskProperties from './components/TaskProperties';
import TaskActions from './components/TaskActions';
import { supabase } from '../../lib/supabase';

const TaskDetailView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const taskId = searchParams.get('id');

  useEffect(() => {
    const fetchTask = async () => {
      if (!taskId) {
        setLoading(false);
        navigate('/task-dashboard');
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (error) {
        console.error('Error fetching task:', error);
        navigate('/task-dashboard');
      } else {
        setTask(data);
      }
      setLoading(false);
    };

    fetchTask();
  }, [taskId, navigate]);

  const handleTaskUpdate = (updatedTask) => {
    setTask(updatedTask);
    // In a real app, this would make an API call to update the task
    console.log('Task updated:', updatedTask);
  };

  const handleTaskDelete = async () => {
    if (!taskId) return;

    setIsDeleting(true);
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);

    if (error) {
      console.error('Error deleting task:', error);
      // Handle error appropriately, e.g., show a notification
    } else {
      console.log('Task deleted:', taskId);
      navigate('/task-dashboard');
    }
    setIsDeleting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center space-y-4">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-muted-foreground">Loading task details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-background pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-semibold text-foreground">Task Not Found</h1>
              <p className="text-muted-foreground">The requested task could not be found.</p>
              <button
                onClick={() => navigate('/task-dashboard')}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="space-y-6"
        >
          {/* Task Header */}
          <TaskHeader
            task={task}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Task Content - Takes up 2 columns on desktop */}
            <div className="lg:col-span-2 space-y-6">
              <TaskContent
                task={task}
                onTaskUpdate={handleTaskUpdate}
              />
            </div>

            {/* Sidebar - Properties and Actions */}
            <div className="space-y-6">
              <TaskProperties
                task={task}
                onTaskUpdate={handleTaskUpdate}
              />
              
              <TaskActions
                task={task}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
                isDeleting={isDeleting}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TaskDetailView;