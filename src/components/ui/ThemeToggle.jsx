import React from 'react';
import { useTheme } from './HeaderNavigation';
import Icon from '../AppIcon';
import Button from './Button';

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const handleToggle = () => {
    if (toggleTheme) {
      toggleTheme();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      className={`transition-smooth hover:bg-muted ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-pressed={isDark}
      role="switch"
    >
      <div className="relative w-5 h-5">
        {/* Sun Icon */}
        <Icon 
          name="Sun" 
          size={20} 
          className={`absolute inset-0 transition-all duration-300 ${
            isDark 
              ? 'opacity-0 rotate-90 scale-0' :'opacity-100 rotate-0 scale-100'
          }`}
        />
        
        {/* Moon Icon */}
        <Icon 
          name="Moon" 
          size={20} 
          className={`absolute inset-0 transition-all duration-300 ${
            isDark 
              ? 'opacity-100 rotate-0 scale-100' :'opacity-0 -rotate-90 scale-0'
          }`}
        />
      </div>
    </Button>
  );
};

export default ThemeToggle;