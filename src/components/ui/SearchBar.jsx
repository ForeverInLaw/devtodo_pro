import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';


const SearchBar = ({ 
  placeholder = "Search...", 
  value = "", 
  onChange, 
  onFocus,
  onBlur,
  autoFocus = false,
  className = "",
  results = [],
  onResultSelect
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    setShowResults(isFocused && value.length > 0 && results.length > 0);
  }, [isFocused, value, results]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleFocus = (e) => {
    setIsFocused(true);
    if (onFocus) {
      onFocus(e);
    }
  };

  const handleBlur = (e) => {
    // Delay blur to allow result clicks
    setTimeout(() => {
      setIsFocused(false);
      if (onBlur) {
        onBlur(e);
      }
    }, 150);
  };

  const handleResultClick = (result) => {
    if (onResultSelect) {
      onResultSelect(result);
    }
    setIsFocused(false);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsFocused(false);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  const clearSearch = () => {
    if (onChange) {
      onChange('');
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
          <Icon name="Search" size={16} />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`
            w-full h-10 pl-10 pr-10 
            bg-muted border border-border rounded-md
            text-sm text-foreground placeholder:text-muted-foreground
            transition-smooth
            focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
            hover:border-ring/50
            ${isFocused ? 'bg-background elevation-1' : ''}
          `}
        />
        
        {value && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-micro"
            aria-label="Clear search"
          >
            <Icon name="X" size={16} />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div 
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md elevation-2 z-1050 max-h-80 overflow-y-auto animate-scale-in"
        >
          {results.map((result, index) => (
            <button
              key={result.id || index}
              onClick={() => handleResultClick(result)}
              className="w-full px-4 py-3 text-left hover:bg-muted transition-micro border-b border-border last:border-b-0 focus:outline-none focus:bg-muted"
            >
              <div className="flex items-center space-x-3">
                {result.icon && (
                  <Icon name={result.icon} size={16} className="text-muted-foreground" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {result.title}
                  </div>
                  {result.description && (
                    <div className="text-xs text-muted-foreground truncate">
                      {result.description}
                    </div>
                  )}
                </div>
                {result.type && (
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    {result.type}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;