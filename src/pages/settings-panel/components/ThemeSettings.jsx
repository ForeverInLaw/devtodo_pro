import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../components/ui/HeaderNavigation';
import SettingsSection from './SettingsSection';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { motion } from 'framer-motion';

const ThemeSettings = () => {
  const { theme, toggleTheme } = useTheme();
  const [accentColor, setAccentColor] = useState('#3b82f6');
  const [animationSpeed, setAnimationSpeed] = useState('normal');
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    const savedAccentColor = localStorage.getItem('accentColor');
    const savedAnimationSpeed = localStorage.getItem('animationSpeed');
    
    if (savedAccentColor) setAccentColor(savedAccentColor);
    if (savedAnimationSpeed) setAnimationSpeed(savedAnimationSpeed);
  }, []);

  const handleAccentColorChange = (color) => {
    setAccentColor(color);
    localStorage.setItem('accentColor', color);
    // Apply accent color to CSS custom properties
    document.documentElement.style.setProperty('--color-primary', color);
  };

  const handleAnimationSpeedChange = (speed) => {
    setAnimationSpeed(speed);
    localStorage.setItem('animationSpeed', speed);
    
    // Apply animation speed multiplier
    const speedValues = {
      slow: '1.5',
      normal: '1',
      fast: '0.7'
    };
    document.documentElement.style.setProperty('--animation-speed', speedValues[speed]);
  };

  const togglePreview = () => {
    setPreviewMode(!previewMode);
    if (!previewMode) {
      setTimeout(() => setPreviewMode(false), 3000);
    }
  };

  const accentColors = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Orange', value: '#f59e0b' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Pink', value: '#ec4899' }
  ];

  return (
    <SettingsSection
      title="Theme Preferences"
      description="Customize the visual appearance of your workspace"
      icon="Palette"
      defaultExpanded={true}
    >
      <div className="space-y-6">
        {/* Theme Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-foreground">Color Mode</label>
            <p className="text-xs text-muted-foreground mt-1">
              Switch between light and dark themes
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              size="sm"
              onClick={() => theme === 'dark' && toggleTheme()}
              iconName="Sun"
            >
              Light
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              size="sm"
              onClick={() => theme === 'light' && toggleTheme()}
              iconName="Moon"
            >
              Dark
            </Button>
          </div>
        </div>

        {/* Live Preview Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-foreground">Live Preview</label>
            <p className="text-xs text-muted-foreground mt-1">
              Preview theme changes in real-time
            </p>
          </div>
          <Button
            variant={previewMode ? 'default' : 'outline'}
            size="sm"
            onClick={togglePreview}
            iconName="Eye"
          >
            {previewMode ? 'Previewing...' : 'Preview'}
          </Button>
        </div>

        {/* Accent Color Picker */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-3">
            Accent Color
          </label>
          <div className="grid grid-cols-6 gap-2 mb-3">
            {accentColors?.map((color) => (
              <button
                key={color.value}
                onClick={() => handleAccentColorChange(color.value)}
                className="relative w-8 h-8 rounded-md border-2 border-border hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                style={{ backgroundColor: color.value }}
                title={color.name}
              >
                {accentColor === color.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 rounded-md border-2 border-foreground"
                  />
                )}
              </button>
            ))}
          </div>
          <Input
            type="color"
            value={accentColor}
            onChange={(e) => handleAccentColorChange(e.target.value)}
            className="w-20 h-10 p-1 border rounded-md"
            label="Custom Color"
          />
        </div>

        {/* Animation Speed */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-3">
            Animation Speed
          </label>
          <div className="flex space-x-2">
            {['slow', 'normal', 'fast']?.map((speed) => (
              <Button
                key={speed}
                variant={animationSpeed === speed ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleAnimationSpeedChange(speed)}
                className="capitalize"
              >
                {speed}
              </Button>
            ))}
          </div>
        </div>

        {previewMode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-primary/10 border border-primary/20 rounded-md"
          >
            <p className="text-sm text-primary font-medium">
              Preview mode active - Changes apply immediately
            </p>
          </motion.div>
        )}
      </div>
    </SettingsSection>
  );
};

export default ThemeSettings;