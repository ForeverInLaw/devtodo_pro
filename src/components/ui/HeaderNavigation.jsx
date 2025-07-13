import React, { useState, useContext, createContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../AppIcon';
import Button from './Button';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';
import SettingsPanel from '../../pages/settings-panel';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const HeaderNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);

  const handleLogoClick = () => {
    navigate('/task-dashboard');
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    // Navigate to task dashboard with search parameter
    if (query.trim()) {
      navigate(`/task-dashboard?search=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/task-dashboard');
    }
  };

  const handleSettingsClick = () => {
    setIsSettingsPanelOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsPanelOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      setIsSearchExpanded(false);
    }
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-1000 bg-background border-b border-border elevation-1">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Logo Section */}
          <div className="flex items-center">
            <button
              onClick={handleLogoClick}
              className="flex items-center space-x-3 transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md p-1"
              aria-label="DevTodo Pro - Go to dashboard"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="CheckSquare" size={20} color="var(--color-primary-foreground)" />
              </div>
              <span className="text-xl font-semibold text-foreground hidden sm:block">
                DevTodo Pro
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center flex-1 max-w-2xl mx-8">
            <SearchBar
              placeholder="Search tasks, projects, or tags..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full"
            />
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <ThemeToggle />
            
            <Button
              variant={isSettingsPanelOpen ? 'secondary' : 'ghost'}
              size="icon"
              onClick={handleSettingsClick}
              className="transition-colors"
              aria-label="Settings"
            >
              <Icon name="Settings" size={20} />
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsSearchExpanded(!isSearchExpanded);
                if (!isSearchExpanded) {
                  setIsMobileMenuOpen(false);
                }
              }}
              className="transition-colors"
              aria-label="Search"
            >
              <Icon name="Search" size={20} />
            </Button>

            <ThemeToggle />

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="transition-colors"
              aria-label="Menu"
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
            </Button>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {isSearchExpanded && (
          <div className="md:hidden bg-background border-t border-border p-4 animate-menu-down">
            <SearchBar
              placeholder="Search tasks, projects, or tags..."
              value={searchQuery}
              onChange={handleSearchChange}
              autoFocus
              onBlur={() => setIsSearchExpanded(false)}
            />
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-background border-t border-border animate-menu-down">
            <nav className="p-4 space-y-2">
              <Button
                variant={isActiveRoute('/task-dashboard') ? 'secondary' : 'ghost'}
                onClick={() => {
                  navigate('/task-dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full justify-start"
                iconName="LayoutDashboard"
                iconPosition="left"
              >
                Dashboard
              </Button>
              
              <Button
                variant={isSettingsPanelOpen ? 'secondary' : 'ghost'}
                onClick={() => {
                  setIsSettingsPanelOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full justify-start"
                iconName="Settings"
                iconPosition="left"
              >
                Settings
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* Settings Panel Overlay */}
      <AnimatePresence>
        {isSettingsPanelOpen && (
          <SettingsPanel
            isOpen={isSettingsPanelOpen}
            onClose={handleCloseSettings}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default HeaderNavigation;