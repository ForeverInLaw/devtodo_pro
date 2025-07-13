import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';
import SettingsSection from './SettingsSection';
import Button from '../../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const DataManagement = () => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const fileInputRef = useRef(null);
  const { user } = useAuth();

  const [taskStats, setTaskStats] = useState({ total: 0, completed: 0, active: 0 });
  const [storageUsage, setStorageUsage] = useState('0.00');
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    const fetchTaskStats = async () => {
      if (!user) return;

      setIsLoadingStats(true);

      const { data, error, count } = await supabase
        .from('tasks')
        .select('id, completed', { count: 'exact', head: false })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching task stats:', error);
        setTaskStats({ total: 0, completed: 0, active: 0 });
        setIsLoadingStats(false);
        return;
      }

      const completedCount = data.filter(task => task.completed).length;
      const totalCount = count || data.length;

      setTaskStats({
        total: totalCount,
        completed: completedCount,
        active: totalCount - completedCount,
      });

      const estimatedSize = (JSON.stringify(data).length / 1024).toFixed(2);
      setStorageUsage(estimatedSize);

      setIsLoadingStats(false);
    };

    fetchTaskStats();
  }, [user]);

  const handleExportData = async () => {
    if (!user) return;
    setIsExporting(true);

    try {
      // Fetch all tasks from Supabase
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      // Gather all data
      const exportData = {
        tasks: tasks || [],
        settings: {
          theme: localStorage.getItem('theme') || 'light',
          notificationSettings: JSON.parse(localStorage.getItem('notificationSettings') || '{}'),
          taskManagementSettings: JSON.parse(localStorage.getItem('taskManagementSettings') || '{}'),
          keyboardShortcuts: JSON.parse(localStorage.getItem('keyboardShortcuts') || '{}'),
          categorizationRules: JSON.parse(localStorage.getItem('categorizationRules') || '[]')
        },
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };

      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `devtodo-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setShowExportSuccess(true);
      setTimeout(() => setShowExportSuccess(false), 3000);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearCompleted = async () => {
    if (!user) return;
    setIsClearing(true);
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('user_id', user.id)
        .eq('completed', true);

      if (error) throw error;

      // Refetch stats after clearing
      const { data, count } = await supabase
        .from('tasks')
        .select('id, completed', { count: 'exact', head: false })
        .eq('user_id', user.id);

      const completedCount = data.filter(task => task.completed).length;
      const totalCount = count || data.length;

      setTaskStats({
        total: totalCount,
        completed: completedCount,
        active: totalCount - completedCount,
      });

    } catch (error) {
      console.error('Error clearing completed tasks:', error);
      alert('Failed to clear completed tasks.');
    } finally {
      setIsClearing(false);
      setShowClearConfirm(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportData = (event) => {
    if (!user) return;
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importData = JSON.parse(e.target?.result);
        
        if (importData.tasks && Array.isArray(importData.tasks) && importData.settings) {
          // Get user's projects
          let { data: projects, error: projectsError } = await supabase
            .from('projects')
            .select('id')
            .eq('user_id', user.id);

          if (projectsError) throw projectsError;

          let defaultProjectId;
          if (projects.length === 0) {
            // Create a default project if none exist
            const { data: newProject, error: newProjectError } = await supabase
              .from('projects')
              .insert({ name: 'Imported Project', user_id: user.id })
              .select('id')
              .single();
            if (newProjectError) throw newProjectError;
            defaultProjectId = newProject.id;
            projects = [{ id: defaultProjectId }];
          } else {
            defaultProjectId = projects[0].id;
          }

          const validProjectIds = new Set(projects.map(p => p.id));

          // Restore tasks to Supabase, ensuring only valid columns are inserted
          const tasksToInsert = importData.tasks.map((task, index) => {
            const sanitizedTask = {
              user_id: user.id,
              project_id: validProjectIds.has(task.project_id) ? task.project_id : defaultProjectId,
              title: task.title,
              description: task.description,
              category: task.category,
              status: task.status,
              priority: task.priority,
              due_date: task.due_date,
              completed: task.completed,
              position: task.position ?? index,
            };
            // Remove any keys with undefined values to avoid DB errors
            Object.keys(sanitizedTask).forEach(key => sanitizedTask[key] === undefined && delete sanitizedTask[key]);
            return sanitizedTask;
          });

          if (tasksToInsert.length > 0) {
            const { error } = await supabase.from('tasks').insert(tasksToInsert);
            if (error) throw error;
          }

          // Restore settings to localStorage
          Object.keys(importData.settings).forEach(key => {
            const value = importData.settings[key];
            localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
          });
          
          alert('Data imported successfully! Please refresh the page to see changes.');
          window.location.reload();
        } else {
          throw new Error('Invalid file format');
        }
      } catch (error) {
        console.error('Error importing data:', error);
        alert('Error importing data: Invalid file format or database error.');
      }
    };
    reader.readAsText(file);
    
    event.target.value = '';
  };


  return (
    <SettingsSection
      title="Data Management"
      description="Export, import, and manage your application data"
      icon="Database"
    >
      <div className="space-y-6">
        {/* Storage Information */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-foreground mb-3">Storage Overview</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total Tasks:</span>
              <span className="ml-2 font-medium">{isLoadingStats ? '...' : taskStats.total}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Active Tasks:</span>
              <span className="ml-2 font-medium">{isLoadingStats ? '...' : taskStats.active}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Completed:</span>
              <span className="ml-2 font-medium">{isLoadingStats ? '...' : taskStats.completed}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Storage Used:</span>
              <span className="ml-2 font-medium">{isLoadingStats ? '...' : `${storageUsage} KB`}</span>
            </div>
          </div>
        </div>

        {/* Export Data */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-2">Export Data</h4>
          <p className="text-xs text-muted-foreground mb-3">
            Download all your tasks and settings as a backup file
          </p>
          <Button
            onClick={handleExportData}
            loading={isExporting}
            iconName="Download"
            variant="outline"
            size="sm"
          >
            {isExporting ? 'Exporting...' : 'Export All Data'}
          </Button>
          
          <AnimatePresence>
            {showExportSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-2 p-2 bg-success/10 border border-success/20 rounded text-xs text-success"
              >
                Data exported successfully!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Import Data */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-2">Import Data</h4>
          <p className="text-xs text-muted-foreground mb-3">
            Restore data from a previous backup file
          </p>
          <Button
            onClick={handleImportClick}
            variant="outline"
            size="sm"
            iconName="Upload"
          >
            Import Backup File
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportData}
            className="hidden"
          />
        </div>

        {/* Clear Completed Tasks */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-2">Clear Completed Tasks</h4>
          <p className="text-xs text-muted-foreground mb-3">
            Remove all completed tasks to free up storage space
          </p>
          
          {!showClearConfirm ? (
            <Button
              onClick={() => setShowClearConfirm(true)}
              variant="outline"
              size="sm"
              iconName="Trash2"
              disabled={taskStats.completed === 0}
            >
              Clear {taskStats.completed} Completed Tasks
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-warning/10 border border-warning/20 rounded text-sm">
                <p className="text-warning font-medium mb-1">Confirm Action</p>
                <p className="text-xs text-muted-foreground">
                  This will permanently delete {taskStats.completed} completed tasks. This action cannot be undone.
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={handleClearCompleted}
                  loading={isClearing}
                  variant="destructive"
                  size="sm"
                >
                  {isClearing ? 'Clearing...' : 'Confirm Delete'}
                </Button>
                <Button
                  onClick={() => setShowClearConfirm(false)}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Reset All Settings */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-2">Reset Application</h4>
          <p className="text-xs text-muted-foreground mb-3">
            Reset all settings to defaults (tasks will be preserved)
          </p>
          <Button
            onClick={() => {
              if (window.confirm('Reset all settings to defaults? Tasks will be preserved.')) {
                const keysToRemove = [
                  'theme', 'notificationSettings', 'taskManagementSettings',
                  'keyboardShortcuts', 'categorizationRules', 'accentColor',
                  'animationSpeed', 'reminderTiming', 'digestFrequency',
                  'taskDashboard_viewMode', 'taskDashboard_sortBy', 'taskDashboard_filtersCollapsed',
                  'taskDashboard_selectedProject'
                ];
                keysToRemove.forEach(key => localStorage.removeItem(key));
                alert('Settings reset successfully! The page will now refresh.');
                window.location.reload();
              }
            }}
            variant="outline"
            size="sm"
            iconName="RotateCcw"
          >
            Reset Settings
          </Button>
        </div>

        {/* Emergency Actions */}
        <div className="pt-4 border-t border-destructive/20">
          <h4 className="text-sm font-medium text-destructive mb-2">Danger Zone</h4>
          <p className="text-xs text-muted-foreground mb-3">
            Irreversible actions that will delete all data
          </p>
          <Button
            onClick={async () => {
              if (window.confirm('DELETE ALL DATA? This cannot be undone!')) {
                if (window.confirm('Are you absolutely sure? All tasks and settings will be lost forever!')) {
                  try {
                    // Delete all tasks from Supabase
                    const { error } = await supabase.from('tasks').delete().eq('user_id', user.id);
                    if (error) throw error;

                    // Clear all localStorage
                    localStorage.clear();
                    
                    alert('All data cleared. The page will now refresh.');
                    window.location.reload();
                  } catch (error) {
                    console.error('Error clearing all data:', error);
                    alert('Failed to clear all data. Please try again.');
                  }
                }
              }
            }}
            variant="destructive"
            size="sm"
            iconName="AlertTriangle"
          >
            Clear All Data
          </Button>
        </div>
      </div>
    </SettingsSection>
  );
};

export default DataManagement;