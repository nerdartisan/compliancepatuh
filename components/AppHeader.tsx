import React from 'react';
import { Search, Moon, User } from './Icons';
import { ViewMode } from '../types';

interface AppHeaderProps {
  view: ViewMode;
  setView: (view: ViewMode) => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ view, setView }) => {
  const navItems = [
    { id: 'search', label: 'Research' },
    { id: 'library', label: 'Library' },
    { id: 'graph', label: 'Analysis' },
  ];

  return (
    <header className="flex-shrink-0 h-[72px] bg-bg-card border-b border-border-subtle flex items-center justify-between px-4 md:px-6 text-text-main">
      {/* Left side: Logo & Nav */}
      <div className="flex items-center gap-8">
        <h1 className="font-serif text-2xl font-bold">Lexicon</h1>
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
      
      {/* Center: Search bar (desktop only) */}
      <div className="hidden lg:flex flex-1 justify-center px-8">
        <div className="relative w-full max-w-lg">
          <input 
            type="text" 
            placeholder="Search for a text... (⌘ + K)"
            className="w-full bg-bg-main border border-border-subtle rounded-lg py-2.5 pl-10 pr-4 text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
        </div>
      </div>

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