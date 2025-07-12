import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import ThemeSettings from './components/ThemeSettings';
import NotificationSettings from './components/NotificationSettings';
import TaskManagementSettings from './components/TaskManagementSettings';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import DataManagement from './components/DataManagement';

const SettingsPanel = ({ isOpen, onClose }) => {
  const [hasChanges, setHasChanges] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile/tablet
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Listen for changes in localStorage to detect setting modifications
  useEffect(() => {
    const handleStorageChange = () => {
      setHasChanges(true);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Handle escape key to close panel
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSaveChanges = () => {
    // Settings are saved automatically, this is just for user feedback
    setHasChanges(false);
    
    // Show success animation
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-md z-[60] animate-fade-in';
    successElement.textContent = 'Settings saved successfully!';
    document.body.appendChild(successElement);
    
    setTimeout(() => {
      if (document.body.contains(successElement)) {
        document.body.removeChild(successElement);
      }
    }, 3000);
  };

  const panelVariants = {
    hidden: { 
      x: isMobile ? 0 : '100%',
      y: isMobile ? '100%' : 0,
      opacity: isMobile ? 0 : 1
    },
    visible: { 
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 200,
        duration: 0.3
      }
    },
    exit: { 
      x: isMobile ? 0 : '100%',
      y: isMobile ? '100%' : 0,
      opacity: isMobile ? 0 : 1,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 200,
        duration: 0.3
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.3
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <>
      {/* Backdrop Overlay */}
      <motion.div
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Settings Panel */}
      <motion.div
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={`
          fixed z-50 bg-background border-l border-border shadow-2xl scrollbar-gutter-stable
          ${isMobile
            ? 'inset-0 pt-16' :'top-16 right-0 bottom-0 w-full max-w-md'
          }
        `}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-background sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name="Settings" size={16} className="text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Settings</h1>
              <p className="text-sm text-muted-foreground">
                Customize your task management experience
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="flex-shrink-0"
            aria-label="Close settings"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Panel Content with Enhanced Scrolling */}
        <div className="flex-1 overflow-y-auto overscroll-contain scrollbar-gutter-stable" style={{ maxHeight: 'calc(100vh - 8rem)' }}>
          <div className="p-6 space-y-6 pb-24 min-w-0">
            <ThemeSettings />
            <NotificationSettings />
            <TaskManagementSettings />
            <KeyboardShortcuts />
            <DataManagement />
          </div>
        </div>

        {/* Save Changes Button - Persistent when changes detected */}
        <AnimatePresence>
          {hasChanges && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute bottom-6 left-6 right-6 bg-background border-t border-border pt-4"
            >
              <Button
                onClick={handleSaveChanges}
                className="w-full"
                iconName="Check"
              >
                Save Changes
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default SettingsPanel;