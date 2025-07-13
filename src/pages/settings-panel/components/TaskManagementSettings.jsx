import React, { useState, useEffect } from 'react';
import SettingsSection from './SettingsSection';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TaskManagementSettings = () => {
  const [settings, setSettings] = useState({
    defaultPriority: 'medium',
    autoArchiveDays: 30,
    enableAutoCategories: true,
    showCompletedTasks: true,
    taskGrouping: 'priority',
    defaultView: 'grid',
    autoSave: true,
    confirmDelete: true
  });

  const [categorizationRules, setCategorizationRules] = useState([
    { keyword: 'api', category: 'backend' },
    { keyword: 'ui', category: 'frontend' },
    { keyword: 'test', category: 'testing' },
    { keyword: 'deploy', category: 'devops' }
  ]);

  useEffect(() => {
    const savedSettings = localStorage.getItem('taskManagementSettings');
    const savedRules = localStorage.getItem('categorizationRules');

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    if (savedRules) {
      setCategorizationRules(JSON.parse(savedRules));
    }
  }, []);

  const updateSetting = (key, value) => {
    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);
    localStorage.setItem('taskManagementSettings', JSON.stringify(updatedSettings));
  };

  const addCategorizationRule = () => {
    const newRule = { keyword: '', category: 'general' };
    const updatedRules = [...categorizationRules, newRule];
    setCategorizationRules(updatedRules);
    localStorage.setItem('categorizationRules', JSON.stringify(updatedRules));
  };

  const updateRule = (index, field, value) => {
    const updatedRules = categorizationRules?.map((rule, i) =>
      i === index ? { ...rule, [field]: value } : rule
    );
    setCategorizationRules(updatedRules);
    localStorage.setItem('categorizationRules', JSON.stringify(updatedRules));
  };

  const removeRule = (index) => {
    const updatedRules = categorizationRules?.filter((_, i) => i !== index);
    setCategorizationRules(updatedRules);
    localStorage.setItem('categorizationRules', JSON.stringify(updatedRules));
  };

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' }
  ];

  const groupingOptions = [
    { value: 'priority', label: 'By Priority' },
    { value: 'category', label: 'By Category' },
    { value: 'dueDate', label: 'By Due Date' },
    { value: 'status', label: 'By Status' }
  ];

  const viewOptions = [
    { value: 'grid', label: 'Grid View' },
    { value: 'list', label: 'List View' },
    { value: 'kanban', label: 'Kanban Board' }
  ];

  const categoryOptions = [
    { value: 'general', label: 'General' },
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'devops', label: 'DevOps' },
    { value: 'testing', label: 'Testing' },
    { value: 'design', label: 'Design' },
    { value: 'documentation', label: 'Documentation' }
  ];

  return (
    <SettingsSection
      title="Task Management"
      description="Configure default task settings and behavior"
      icon="ClipboardList"
    >
      <div className="space-y-6">
        {/* Default Priority */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Default Priority Level
          </label>
          <Select
            value={settings.defaultPriority}
            onChange={(value) => updateSetting('defaultPriority', value)}
            options={priorityOptions}
          />
        </div>

        {/* Default View */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Default View Mode
          </label>
          <div className="grid grid-cols-3 gap-2">
            {viewOptions?.map((option) => (
              <Button
                key={option.value}
                variant={settings.defaultView === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateSetting('defaultView', option.value)}
                className="text-xs"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Task Grouping */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Task Grouping
          </label>
          <Select
            value={settings.taskGrouping}
            onChange={(value) => updateSetting('taskGrouping', value)}
            options={groupingOptions}
          />
        </div>

        {/* Auto Archive */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Auto Archive Completed Tasks
          </label>
          <div className="flex items-center space-x-3">
            <Input
              type="number"
              value={settings.autoArchiveDays}
              onChange={(e) => updateSetting('autoArchiveDays', parseInt(e.target.value))}
              className="w-20"
              min="1"
              max="365"
            />
            <span className="text-sm text-muted-foreground">days after completion</span>
          </div>
        </div>

        {/* Toggle Settings */}
        <div className="space-y-4">
          {[
            {
              key: 'enableAutoCategories',
              title: 'Auto-Categorization',
              description: 'Automatically categorize tasks based on keywords'
            },
            {
              key: 'showCompletedTasks',
              title: 'Show Completed Tasks',
              description: 'Display completed tasks in the main view'
            },
            {
              key: 'autoSave',
              title: 'Auto-Save Changes',
              description: 'Save task changes automatically'
            },
            {
              key: 'confirmDelete',
              title: 'Confirm Delete Actions',
              description: 'Show confirmation dialog when deleting tasks'
            }
          ]?.map((option) => (
            <div key={option.key} className="flex items-start justify-between">
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground block">
                  {option.title}
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  {option.description}
                </p>
              </div>
              <button
                onClick={() => updateSetting(option.key, !settings[option.key])}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                  settings[option.key] ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                    settings[option.key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Auto-Categorization Rules */}
        {settings.enableAutoCategories && (
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-foreground">
                Auto-Categorization Rules
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={addCategorizationRule}
                iconName="Plus"
              >
                Add Rule
              </Button>
            </div>
            <div className="space-y-3 max-h-40 overflow-y-auto">
              {categorizationRules?.map((rule, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    placeholder="Keyword"
                    value={rule.keyword}
                    onChange={(e) => updateRule(index, 'keyword', e.target.value)}
                    className="flex-1"
                  />
                  <Select
                    value={rule.category}
                    onChange={(value) => updateRule(index, 'category', value)}
                    options={categoryOptions}
                    className="w-32"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRule(index)}
                    iconName="Trash2"
                    className="text-destructive hover:text-destructive"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SettingsSection>
  );
};

export default TaskManagementSettings;