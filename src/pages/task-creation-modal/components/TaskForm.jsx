import React, { useState, useEffect } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TaskForm = ({ onSubmit, onCancel, isLoading = false, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: '',
    category: ''
  });
  const [errors, setErrors] = useState({});
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        priority: initialData.priority || 'medium',
        due_date: initialData.due_date || '',
        category: initialData.category || ''
      });
    }
  }, [initialData]);

  const priorityOptions = [
    { value: 'low', label: 'Low Priority', description: 'Can be done later' },
    { value: 'medium', label: 'Medium Priority', description: 'Normal importance' },
    { value: 'high', label: 'High Priority', description: 'Important task' },
    { value: 'critical', label: 'Critical Priority', description: 'Urgent and important' }
  ];

  const categoryOptions = [
    { value: 'development', label: 'Development', description: 'Coding and programming tasks' },
    { value: 'testing', label: 'Testing', description: 'QA and testing activities' },
    { value: 'documentation', label: 'Documentation', description: 'Writing and updating docs' },
    { value: 'meeting', label: 'Meeting', description: 'Meetings and discussions' },
    { value: 'research', label: 'Research', description: 'Investigation and learning' },
    { value: 'bug-fix', label: 'Bug Fix', description: 'Fixing reported issues' },
    { value: 'feature', label: 'Feature', description: 'New feature development' },
    { value: 'maintenance', label: 'Maintenance', description: 'Code maintenance tasks' }
  ];

  const dueDatePresets = [
    { label: 'Today', value: new Date().toISOString().split('T')[0] },
    { label: 'Tomorrow', value: new Date(Date.now() + 86400000).toISOString().split('T')[0] },
    { label: 'This Week', value: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0] },
    { label: 'Next Week', value: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0] }
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleSubmit(e);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handlePresetDateClick = (date) => {
    handleInputChange('due_date', date);
  };

  const renderMarkdownPreview = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-muted px-1 rounded text-sm">$1</code>')
      .replace(/\n/g, '<br>');
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'text-blue-600 bg-blue-50 border-blue-200',
      medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      high: 'text-orange-600 bg-orange-50 border-orange-200',
      critical: 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[priority] || colors.medium;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Task Title */}
      <div>
        <Input
          label="Task Title"
          type="text"
          placeholder="Enter task title..."
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          error={errors.title}
          required
          className="text-lg"
          maxLength={100}
        />
        <div className="mt-1 text-xs text-muted-foreground text-right">
          {formData.title.length}/100 characters
        </div>
      </div>

      {/* Task Description */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-foreground">
            Description
          </label>
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowMarkdownPreview(!showMarkdownPreview)}
              iconName={showMarkdownPreview ? "Edit" : "Eye"}
              iconPosition="left"
            >
              {showMarkdownPreview ? 'Edit' : 'Preview'}
            </Button>
          </div>
        </div>
        
        {!showMarkdownPreview ? (
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe your task... (Markdown supported: **bold**, *italic*, `code`)"
            className="w-full h-32 px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground resize-none transition-smooth focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            maxLength={500}
          />
        ) : (
          <div 
            className="w-full h-32 px-3 py-2 bg-muted border border-border rounded-md text-sm text-foreground overflow-y-auto"
            dangerouslySetInnerHTML={{ 
              __html: formData.description ? renderMarkdownPreview(formData.description) : '<span class="text-muted-foreground">No description provided</span>'
            }}
          />
        )}
        
        {errors.description && (
          <p className="mt-1 text-xs text-error">{errors.description}</p>
        )}
        <div className="mt-1 text-xs text-muted-foreground text-right">
          {formData.description.length}/500 characters
        </div>
      </div>

      {/* Priority Selection */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Priority Level
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {priorityOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleInputChange('priority', option.value)}
              className={`
                p-3 rounded-lg border-2 transition-smooth text-left
                ${formData.priority === option.value 
                  ? `${getPriorityColor(option.value)} border-current` 
                  : 'border-border bg-background hover:bg-muted'
                }
              `}
            >
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  option.value === 'low' ? 'bg-blue-500' :
                  option.value === 'medium' ? 'bg-yellow-500' :
                  option.value === 'high' ? 'bg-orange-500' : 'bg-red-500'
                }`} />
                <span className="text-sm font-medium">{option.label.replace(' Priority', '')}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Due Date */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Due Date
        </label>
        <div className="space-y-3">
          <Input
            type="date"
            value={formData.due_date}
            onChange={(e) => handleInputChange('due_date', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
          
          <div className="flex flex-wrap gap-2">
            {dueDatePresets.map((preset) => (
              <Button
                key={preset.label}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handlePresetDateClick(preset.value)}
                className={formData.due_date === preset.value ? 'bg-primary text-primary-foreground' : ''}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Selection */}
      <div>
        <Select
          label="Category"
          placeholder="Select a category..."
          options={categoryOptions}
          value={formData.category}
          onChange={(value) => handleInputChange('category', value)}
          error={errors.category}
          required
          searchable
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        
        <div className="flex items-center space-x-2">
          <div className="text-xs text-muted-foreground hidden md:block">
            Ctrl+Enter to save
          </div>
          <Button
            type="submit"
            variant="default"
            loading={isLoading}
            iconName={initialData ? "Check" : "Plus"}
            iconPosition="left"
            disabled={!formData.title.trim() || !formData.category}
          >
            {initialData ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default TaskForm;