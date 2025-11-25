
import React, { useState, useRef, useEffect } from 'react';
import { Search, Moon, User, Globe } from './Icons';
import { ViewMode, ComplianceDocument } from '../types';
import SearchDropdown from './SearchDropdown';

interface AppHeaderProps {
  view: ViewMode;
  setView: (view: ViewMode) => void;
  onSearch: (query: string) => void;
  recentSearches: string[];
  onClearRecent: () => void;
  onDocumentSelect?: (docId: string) => void;
  documents?: ComplianceDocument[];
}

const AppHeader: React.FC<AppHeaderProps> = ({ 
  view, 
  setView, 
  onSearch, 
  recentSearches, 
  onClearRecent, 
  onDocumentSelect,
  documents = []
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { id: 'search', label: 'Research' },
    { id: 'library', label: 'Library' },
    { id: 'graph', label: 'Analysis' },
    { id: 'about', label: 'About' },
  ];

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      onSearch(inputValue);
      setIsFocused(false);
      setInputValue('');
    }
  };

  const handleSuggestionClick = (query: string) => {
    onSearch(query);
    setIsFocused(false);
    setInputValue('');
  };

  const handleDocumentClick = (docId: string) => {
    if (onDocumentSelect) {
      onDocumentSelect(docId);
    }
    setIsFocused(false);
    setInputValue('');
  }

  return (
    <header className="flex-shrink-0 h-[72px] bg-bg-card border-b border-border-subtle flex items-center justify-between px-4 md:px-6 text-text-main relative z-50">
      {/* Left side: Logo & Nav */}
      <div className="flex items-center gap-8">
        <h1 className="font-serif text-2xl font-bold text-primary cursor-pointer" onClick={() => setView('landing')}>i-Patuh</h1>
        <div className="hidden md:flex items-center gap-6">
          {navItems.map(item => (
             <button 
              key={item.id}
              onClick={() => setView(item.id as ViewMode)}
              className={`text-sm font-medium transition-colors ${
                view === item.id ? 'text-primary' : 'text-text-muted hover:text-text-main'
              }`}
             >
              {item.label}
             </button>
          ))}
        </div>
      </div>
      
      {/* Center: Search bar (desktop only) - HIDDEN ON ADVANCED SEARCH PAGE */}
      {view !== 'advanced-search' && (
        <div className="hidden lg:flex flex-1 justify-center px-8" ref={dropdownRef}>
          <div className="relative w-full max-w-lg">
            <div className={`relative flex items-center w-full bg-bg-main border ${isFocused ? 'border-primary ring-1 ring-primary/50' : 'border-border-subtle'} rounded-xl transition-all`}>
              <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onKeyDown={handleInputSubmit}
                  placeholder="Search for a text... (⌘ + K)"
                  className="flex-1 bg-transparent py-2.5 pl-10 pr-4 text-sm placeholder:text-text-muted focus:outline-none font-sans"
                />
                <Search size={18} className="absolute left-3.5 text-text-muted" />
                
                {/* Right side 'Advanced Search' button inside input container */}
                <button 
                  onClick={() => setView('advanced-search')}
                  className="flex items-center gap-1.5 mr-2 px-3 py-1 text-xs font-medium text-text-main bg-white border border-border-subtle rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <Globe size={12} />
                  Advanced Search
                </button>
            </div>

            {/* Search Dropdown */}
            {isFocused && (
              <SearchDropdown 
                recentSearches={recentSearches}
                onSearch={handleSuggestionClick}
                onClearRecent={onClearRecent}
                query={inputValue}
                documents={documents}
                onResultClick={handleDocumentClick}
              />
            )}
          </div>
        </div>
      )}

      {/* Right side: Controls */}
      <div className="flex items-center gap-2 md:gap-4">
        <button className="lg:hidden p-2 text-text-muted hover:text-text-main transition-colors">
          <Search size={20} />
        </button>
        <button className="p-2 text-text-muted hover:text-text-main transition-colors">
          <Moon size={20} />
        </button>
        <button className="p-2 text-text-muted hover:text-text-main transition-colors">
          <User size={20} />
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
