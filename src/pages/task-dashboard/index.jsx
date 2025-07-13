import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import FloatingActionButton from '../../components/ui/FloatingActionButton';
import TaskFilters from './components/TaskFilters';
import TaskToolbar from './components/TaskToolbar';
import TaskGrid from './components/TaskGrid';
import TaskCreationModal from '../task-creation-modal';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const TaskDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const { user } = useAuth();

  // State management
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filters, setFilters] = useState({
    categories: [],
    priorities: [],
    statuses: [],
    dateRange: 'all'
  });
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('position');
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isTasksLoading, setIsTasksLoading] = useState(false);

  // Fetch tasks from Supabase
  useEffect(() => {
    const fetchProjectsAndTasks = async () => {
      if (user) {
        setIsTasksLoading(true);
        // Fetch projects first
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('id, name');
        
        if (projectError) {
          console.error('Error fetching projects:', projectError);
          setProjects([]);
        } else {
          setProjects(projectData);
          const currentSelectedProject = localStorage.getItem('taskDashboard_selectedProject');
          if (currentSelectedProject && projectData.some(p => p.id === currentSelectedProject)) {
            setSelectedProject(currentSelectedProject);
          } else if (projectData.length > 0) {
            setSelectedProject(projectData[0].id);
          }
        }

        // Then fetch tasks for the selected project
        if (selectedProject) {
          const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('project_id', selectedProject)
            .order('position');
          if (error) {
            console.error('Error fetching tasks:', error);
            setTasks([]);
          } else {
            setTasks(data);
          }
        } else {
          setTasks([]);
        }
        setIsTasksLoading(false);
      }
    };
    fetchProjectsAndTasks();
  }, [user, selectedProject]);

  // Set up real-time subscription for tasks
  useEffect(() => {
    if (!selectedProject) return;

    const channel = supabase
      .channel(`tasks-project-${selectedProject}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `project_id=eq.${selectedProject}` }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setTasks(currentTasks => [...currentTasks, payload.new]);
        } else if (payload.eventType === 'UPDATE') {
          setTasks(currentTasks => currentTasks.map(task => task.id === payload.new.id ? payload.new : task));
        } else if (payload.eventType === 'DELETE') {
          setTasks(currentTasks => currentTasks.filter(task => task.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedProject]);

  // Handle search query changes from URL
  useEffect(() => {
    if (searchQuery) {
      // Automatically scroll to results when search is performed
      setTimeout(() => {
        const mainContent = document.querySelector('.task-grid-container');
        if (mainContent) {
          mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [searchQuery]);

  // Load saved preferences
  useEffect(() => {
    const savedViewMode = localStorage.getItem('taskDashboard_viewMode');
    const savedSortBy = localStorage.getItem('taskDashboard_sortBy');
    const savedFiltersCollapsed = localStorage.getItem('taskDashboard_filtersCollapsed');
    const savedProject = localStorage.getItem('taskDashboard_selectedProject');

    if (savedViewMode) setViewMode(savedViewMode);
    if (savedSortBy) setSortBy(savedSortBy);
    if (savedFiltersCollapsed) setIsFiltersCollapsed(JSON.parse(savedFiltersCollapsed));
    if (savedProject) setSelectedProject(savedProject);
  }, []);

  // Save preferences
  useEffect(() => {
    localStorage.setItem('taskDashboard_viewMode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('taskDashboard_sortBy', sortBy);
  }, [sortBy]);

  useEffect(() => {
    localStorage.setItem('taskDashboard_filtersCollapsed', JSON.stringify(isFiltersCollapsed));
  }, [isFiltersCollapsed]);

  useEffect(() => {
    if (selectedProject) {
      localStorage.setItem('taskDashboard_selectedProject', selectedProject);
    } else {
      localStorage.removeItem('taskDashboard_selectedProject');
    }
  }, [selectedProject]);

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = [...tasks];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.category.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(task => filters.categories.includes(task.category));
    }

    // Apply priority filter
    if (filters.priorities.length > 0) {
      filtered = filtered.filter(task => filters.priorities.includes(task.priority));
    }

    // Apply status filter
    if (filters.statuses.length > 0) {
      filtered = filtered.filter(task => {
        const status = task.completed ? 'completed' : 'pending';
        return filters.statuses.includes(status);
      });
    }

    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const weekEnd = new Date(today);
      weekEnd.setDate(weekEnd.getDate() + 7);
      const monthEnd = new Date(today);
      monthEnd.setMonth(monthEnd.getMonth() + 1);

      filtered = filtered.filter(task => {
        if (!task.due_date) return false;
        const dueDate = new Date(task.due_date);

        switch (filters.dateRange) {
          case 'today':
            return dueDate.toDateString() === today.toDateString();
          case 'tomorrow':
            return dueDate.toDateString() === tomorrow.toDateString();
          case 'week':
            return dueDate >= today && dueDate <= weekEnd;
          case 'month':
            return dueDate >= today && dueDate <= monthEnd;
          case 'overdue':
            return dueDate < today && !task.completed;
          default:
            return true;
        }
      });
    }

    // Sort tasks
    if (sortBy !== 'custom') {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'position':
            return (a.position || 0) - (b.position || 0);
          case 'priority':
            const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
            return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
          case 'due_date':
            if (!a.due_date && !b.due_date) return 0;
            if (!a.due_date) return 1;
            if (!b.due_date) return -1;
            return new Date(a.due_date) - new Date(b.due_date);
          case 'title':
            return a.title.localeCompare(b.title);
          case 'created':
            return new Date(b.created_at) - new Date(a.created_at);
          case 'category':
            return a.category.localeCompare(b.category);
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [tasks, filters, sortBy, searchQuery]);

  // Task actions
  const handleToggleComplete = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const { data, error } = await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', taskId)
        .select();
      if (error) {
        console.error('Error updating task:', error);
      } else {
        setTasks(prev => prev.map(t => t.id === taskId ? data[0] : t));
      }
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
      if (error) {
        console.error('Error deleting task:', error);
      } else {
        setTasks(prev => prev.filter(task => task.id !== taskId));
      }
    }
  };

  const handleTaskReorder = async (fromIndex, toIndex) => {
    const reorderedTasks = [...filteredAndSortedTasks];
    const updates = reorderedTasks.map((task, index) => ({
      id: task.id,
      position: index
    }));

    const { error } = await supabase.rpc('update_task_positions', { updates });

    if (error) {
      console.error('Error updating task positions:', error);
      // Optionally, revert the local state if the update fails
    }
  };

  const handleTaskDragOver = (fromIndex, toIndex) => {
    const reorderedTasks = [...filteredAndSortedTasks];
    const [movedItem] = reorderedTasks.splice(fromIndex, 1);
    reorderedTasks.splice(toIndex, 0, movedItem);

    const tasksMap = new Map(tasks.map(t => [t.id, t]));
    const newTasks = reorderedTasks.map(t => tasksMap.get(t.id));
    const filteredOutTasks = tasks.filter(t => !reorderedTasks.find(rt => rt.id === t.id));
    
    setTasks([...newTasks, ...filteredOutTasks]);
  };

  const handleDragStart = () => {
    setSortBy('custom');
  };

  const handleDragEnd = () => {
    handleTaskReorder(0, 0); // Trigger reorder persistence
  };

  const handleAddTask = () => {
    setEditingTask(null);
    if (selectedProject) {
      setIsModalOpen(true);
    } else {
      // You might want to use a more user-friendly notification here
      alert('Please select a project before adding a task.');
    }
  };

  const handleModalSubmit = async (taskData) => {
    if (editingTask) {
      // Update task
      const { data, error } = await supabase
        .from('tasks')
        .update(taskData)
        .eq('id', editingTask.id)
        .select();
      if (error) {
        console.error('Error updating task:', error);
      } else {
        setTasks(prev => prev.map(t => t.id === editingTask.id ? data[0] : t));
      }
    } else {
      // Create new task
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...taskData, project_id: selectedProject, position: tasks.length }])
        .select();
      if (error) {
        console.error('Error creating task:', error);
      } else {
        setTasks(prev => [...prev, data[0]]);
      }
    }
    setIsModalOpen(false);
    setEditingTask(null);
  };

  // Calculate stats
  const totalTasks = filteredAndSortedTasks.length;
  const completedTasks = filteredAndSortedTasks.filter(task => task.completed).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background pt-16" // pt-16 to offset for fixed header
    >
      <div className="flex h-full">
          {/* Sidebar Filters */}
          <TaskFilters
            filters={filters}
            onFiltersChange={setFilters}
            isCollapsed={isFiltersCollapsed}
            onToggleCollapse={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
            tasks={tasks}
            className="flex-shrink-0 hidden md:block h-full"
            isMobileOpen={isMobileFiltersOpen}
            onMobileClose={() => setIsMobileFiltersOpen(false)}
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0 h-full">
            <TaskToolbar
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              sortBy={sortBy}
              onSortChange={setSortBy}
              totalTasks={totalTasks}
              completedTasks={completedTasks}
              onAddTask={handleAddTask}
              searchQuery={searchQuery}
              onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
              selectedProject={selectedProject}
              onProjectChange={setSelectedProject}
              isLoading={isTasksLoading}
              projectName={projects.find(p => p.id === selectedProject)?.name || ''}
            />

            <div className="p-4 md:p-6 flex-1 overflow-y-auto">
              <div className="task-grid-container">
                <TaskGrid
                  tasks={filteredAndSortedTasks}
                  viewMode={viewMode}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onToggleComplete={handleToggleComplete}
                  onTaskReorder={handleTaskReorder}
                  onTaskDragOver={handleTaskDragOver}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  searchQuery={searchQuery}
                  isLoading={isTasksLoading}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        <FloatingActionButton onClick={handleAddTask} disabled={!selectedProject} />

        {/* Task Creation/Editing Modal */}
        {isModalOpen && (
          <TaskCreationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleModalSubmit}
            initialData={editingTask}
          />
        )}
    </motion.div>
  );
};

export default TaskDashboard;