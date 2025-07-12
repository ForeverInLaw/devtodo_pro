import React, { useState } from 'react';
import SettingsSection from './SettingsSection';
import Button from '../../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const DataManagement = () => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      // Gather all data from localStorage
      const exportData = {
        tasks: JSON.parse(localStorage.getItem('tasks') || '[]'),
        settings: {
          theme: localStorage.getItem('theme'),
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

      setIsExporting(false);
      setShowExportSuccess(true);
      setTimeout(() => setShowExportSuccess(false), 3000);
    }, 2000);
  };

  const handleClearCompleted = async () => {
    setIsClearing(true);
    
    // Simulate clearing process
    setTimeout(() => {
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const activeTasks = tasks?.filter(task => !task.completed);
      localStorage.setItem('tasks', JSON.stringify(activeTasks));
      
      setIsClearing(false);
      setShowClearConfirm(false);
    }, 1000);
  };

  const handleImportData = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result);
        
        // Validate import data structure
        if (importData.tasks && importData.settings) {
          // Restore tasks
          localStorage.setItem('tasks', JSON.stringify(importData.tasks));
          
          // Restore settings
          if (importData.settings.theme) {
            localStorage.setItem('theme', importData.settings.theme);
          }
          if (importData.settings.notificationSettings) {
            localStorage.setItem('notificationSettings', JSON.stringify(importData.settings.notificationSettings));
          }
          if (importData.settings.taskManagementSettings) {
            localStorage.setItem('taskManagementSettings', JSON.stringify(importData.settings.taskManagementSettings));
          }
          if (importData.settings.keyboardShortcuts) {
            localStorage.setItem('keyboardShortcuts', JSON.stringify(importData.settings.keyboardShortcuts));
          }
          if (importData.settings.categorizationRules) {
            localStorage.setItem('categorizationRules', JSON.stringify(importData.settings.categorizationRules));
          }
          
          alert('Data imported successfully! Please refresh the page to see changes.');
        } else {
          throw new Error('Invalid file format');
        }
      } catch (error) {
        alert('Error importing data: Invalid file format');
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  };

  const getStorageUsage = () => {
    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length + key.length;
      }
    }
    return (totalSize / 1024).toFixed(2); // KB
  };

  const getTaskCount = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const completed = tasks?.filter(task => task.completed).length || 0;
    const total = tasks?.length || 0;
    return { total, completed, active: total - completed };
  };

  const taskStats = getTaskCount();

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
              <span className="ml-2 font-medium">{taskStats.total}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Active Tasks:</span>
              <span className="ml-2 font-medium">{taskStats.active}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Completed:</span>
              <span className="ml-2 font-medium">{taskStats.completed}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Storage Used:</span>
              <span className="ml-2 font-medium">{getStorageUsage()} KB</span>
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
          <label className="cursor-pointer">
            <Button
              variant="outline"
              size="sm"
              iconName="Upload"
              asChild
            >
              Import Backup File
            </Button>
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
            />
          </label>
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
                  'animationSpeed', 'reminderTiming', 'digestFrequency'
                ];
                keysToRemove.forEach(key => localStorage.removeItem(key));
                alert('Settings reset successfully! Please refresh the page.');
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
            onClick={() => {
              if (window.confirm('DELETE ALL DATA? This cannot be undone!')) {
                if (window.confirm('Are you absolutely sure? All tasks and settings will be lost forever!')) {
                  localStorage.clear();
                  alert('All data cleared. The page will now refresh.');
                  window.location.reload();
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