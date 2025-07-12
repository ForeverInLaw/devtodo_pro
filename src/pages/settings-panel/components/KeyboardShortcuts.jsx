import React, { useState, useEffect } from 'react';
import SettingsSection from './SettingsSection';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const KeyboardShortcuts = () => {
  const [shortcuts, setShortcuts] = useState({
    newTask: 'Ctrl+N',
    search: 'Ctrl+K',
    toggleTheme: 'Ctrl+Shift+T',
    settings: 'Ctrl+,',
    focusFirst: 'J',
    focusLast: 'K',
    markComplete: 'Space',
    editTask: 'E',
    deleteTask: 'Delete',
    saveTask: 'Ctrl+S'
  });

  const [editingShortcut, setEditingShortcut] = useState(null);
  const [customizationEnabled, setCustomizationEnabled] = useState(false);

  useEffect(() => {
    const savedShortcuts = localStorage.getItem('keyboardShortcuts');
    const savedCustomization = localStorage.getItem('shortcutCustomizationEnabled');

    if (savedShortcuts) {
      setShortcuts(JSON.parse(savedShortcuts));
    }
    if (savedCustomization) {
      setCustomizationEnabled(JSON.parse(savedCustomization));
    }
  }, []);

  const updateShortcut = (action, newShortcut) => {
    const updatedShortcuts = { ...shortcuts, [action]: newShortcut };
    setShortcuts(updatedShortcuts);
    localStorage.setItem('keyboardShortcuts', JSON.stringify(updatedShortcuts));
    setEditingShortcut(null);
  };

  const resetToDefaults = () => {
    const defaultShortcuts = {
      newTask: 'Ctrl+N',
      search: 'Ctrl+K',
      toggleTheme: 'Ctrl+Shift+T',
      settings: 'Ctrl+,',
      focusFirst: 'J',
      focusLast: 'K',
      markComplete: 'Space',
      editTask: 'E',
      deleteTask: 'Delete',
      saveTask: 'Ctrl+S'
    };
    setShortcuts(defaultShortcuts);
    localStorage.setItem('keyboardShortcuts', JSON.stringify(defaultShortcuts));
  };

  const toggleCustomization = () => {
    const enabled = !customizationEnabled;
    setCustomizationEnabled(enabled);
    localStorage.setItem('shortcutCustomizationEnabled', JSON.stringify(enabled));
  };

  const shortcutDefinitions = [
    {
      action: 'newTask',
      name: 'Create New Task',
      description: 'Open the task creation modal',
      category: 'Task Management'
    },
    {
      action: 'search',
      name: 'Quick Search',
      description: 'Focus the search bar',
      category: 'Navigation'
    },
    {
      action: 'toggleTheme',
      name: 'Toggle Theme',
      description: 'Switch between light and dark mode',
      category: 'Interface'
    },
    {
      action: 'settings',
      name: 'Open Settings',
      description: 'Open the settings panel',
      category: 'Navigation'
    },
    {
      action: 'focusFirst',
      name: 'Focus First Task',
      description: 'Move focus to the first task',
      category: 'Navigation'
    },
    {
      action: 'focusLast',
      name: 'Focus Last Task',
      description: 'Move focus to the last task',
      category: 'Navigation'
    },
    {
      action: 'markComplete',
      name: 'Toggle Complete',
      description: 'Mark focused task as complete/incomplete',
      category: 'Task Management'
    },
    {
      action: 'editTask',
      name: 'Edit Task',
      description: 'Edit the focused task',
      category: 'Task Management'
    },
    {
      action: 'deleteTask',
      name: 'Delete Task',
      description: 'Delete the focused task',
      category: 'Task Management'
    },
    {
      action: 'saveTask',
      name: 'Save Changes',
      description: 'Save current task changes',
      category: 'Task Management'
    }
  ];

  const categories = [...new Set(shortcutDefinitions?.map(def => def.category))];

  const ShortcutInput = ({ action, current }) => {
    const [inputValue, setInputValue] = useState(current);
    const [recording, setRecording] = useState(false);

    const handleKeyDown = (e) => {
      if (!recording) return;
      
      e.preventDefault();
      
      const keys = [];
      if (e.ctrlKey) keys.push('Ctrl');
      if (e.shiftKey) keys.push('Shift');
      if (e.altKey) keys.push('Alt');
      if (e.metaKey) keys.push('Cmd');
      
      const key = e.key;
      if (key !== 'Control' && key !== 'Shift' && key !== 'Alt' && key !== 'Meta') {
        keys.push(key === ' ' ? 'Space' : key);
      }
      
      const shortcut = keys.join('+');
      setInputValue(shortcut);
      setRecording(false);
      updateShortcut(action, shortcut);
    };

    return (
      <div className="flex items-center space-x-2">
        <Input
          value={recording ? 'Press keys...' : inputValue}
          onFocus={() => setRecording(true)}
          onBlur={() => setRecording(false)}
          onKeyDown={handleKeyDown}
          className="w-32 text-center font-mono text-xs"
          readOnly
          placeholder="Click to record"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => updateShortcut(action, current)}
          iconName="RotateCcw"
          title="Reset to default"
        />
      </div>
    );
  };

  return (
    <SettingsSection
      title="Keyboard Shortcuts"
      description="View and customize keyboard shortcuts for faster navigation"
      icon="Keyboard"
    >
      <div className="space-y-6">
        {/* Enable Customization */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-foreground">
              Enable Customization
            </label>
            <p className="text-xs text-muted-foreground mt-1">
              Allow editing of keyboard shortcuts
            </p>
          </div>
          <button
            onClick={toggleCustomization}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
              customizationEnabled ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                customizationEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Shortcuts by Category */}
        {categories?.map(category => (
          <div key={category} className="space-y-3">
            <h4 className="text-sm font-medium text-foreground border-b border-border pb-1">
              {category}
            </h4>
            <div className="space-y-2">
              {shortcutDefinitions
                ?.filter(def => def.category === category)
                ?.map(def => (
                  <div key={def.action} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">
                        {def.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {def.description}
                      </div>
                    </div>
                    <div className="ml-4">
                      {customizationEnabled ? (
                        <ShortcutInput 
                          action={def.action} 
                          current={shortcuts[def.action]} 
                        />
                      ) : (
                        <div className="px-2 py-1 bg-muted rounded text-xs font-mono">
                          {shortcuts[def.action]}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}

        {/* Reset to Defaults */}
        {customizationEnabled && (
          <div className="pt-4 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={resetToDefaults}
              iconName="RotateCcw"
            >
              Reset All to Defaults
            </Button>
          </div>
        )}

        {/* Tips */}
        <div className="bg-muted/50 p-3 rounded-md">
          <h5 className="text-sm font-medium text-foreground mb-2">Tips:</h5>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Use Ctrl/Cmd + letter keys for global shortcuts</li>
            <li>• Single letters work best for task-specific actions</li>
            <li>• Avoid conflicts with browser shortcuts</li>
            <li>• Press Escape to cancel shortcut recording</li>
          </ul>
        </div>
      </div>
    </SettingsSection>
  );
};

export default KeyboardShortcuts;