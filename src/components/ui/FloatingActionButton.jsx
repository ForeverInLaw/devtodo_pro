import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const FloatingActionButton = ({ 
  onClick,
  className = "",
  ariaLabel = "Create new task",
  disabled = false
}) => {
  const navigate = useNavigate();
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
    
    if (onClick) {
      onClick();
    } else {
      // Default action: navigate to task creation modal
      navigate('/task-creation-modal');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <Button
      variant="default"
      size="icon"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseDown={() => setIsPressed(true)}
      disabled={disabled}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`
        fixed bottom-6 right-6 z-1000
        w-14 h-14 rounded-full
        bg-primary hover:bg-primary/90 
        text-primary-foreground
        elevation-3 hover:elevation-4
        transition-all duration-250 ease-out
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
        active:scale-95
        ${isPressed ? 'scale-95' : 'scale-100'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      aria-label={ariaLabel}
    >
      <Icon 
        name="Plus" 
        size={24} 
        className={`transition-transform duration-150 ${isPressed ? 'rotate-90' : 'rotate-0'}`}
      />
    </Button>
  );
};

export default FloatingActionButton;