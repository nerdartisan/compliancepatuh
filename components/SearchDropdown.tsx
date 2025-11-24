
import React from 'react';
import { POPULAR_SEARCHES, POPULAR_COLLECTIONS } from '../constants';
import { TrendingUp, ArrowRight } from './Icons';

interface SearchDropdownProps {
  recentSearches: string[];
  onSearch: (query: string) => void;
  onClearRecent: () => void;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({ recentSearches, onSearch, onClearRecent }) => {
  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-bg-card rounded-xl shadow-xl border border-border-subtle overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      
      {/* Recent Searches Section */}
      {recentSearches.length > 0 && (
        <div className="p-4 border-b border-border-subtle">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-text-main">Recent Searches</h4>
            <button 
              onClick={(e) => { e.preventDefault(); onClearRecent(); }}
              className="text-xs text-primary hover:underline font-medium"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => onSearch(search)}
                className="bg-bg-main hover:bg-gray-200 border border-border-subtle text-text-main px-3 py-1.5 rounded-lg text-sm font-serif transition-colors text-left"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Popular Searches Section */}
      <div className="p-4 border-b border-border-subtle">
        <h4 className="text-sm font-bold text-text-main mb-3">Popular Searches</h4>
        <div className="flex flex-wrap gap-2">
          {POPULAR_SEARCHES.map((term, index) => (
            <button
              key={index}
              onClick={() => onSearch(term)}
              className="flex items-center gap-2 bg-bg-card border border-border-subtle hover:border-primary/50 hover:bg-bg-main text-text-muted hover:text-primary px-3 py-2 rounded-lg text-sm transition-all"
            >
              <TrendingUp size={14} />
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Popular Collections Section */}
      <div className="p-4 bg-bg-main/50">
        <h4 className="text-sm font-bold text-text-main mb-3">Popular Collections</h4>
        <div className="flex flex-wrap gap-2">
          {POPULAR_COLLECTIONS.map((collection, index) => (
            <button
              key={index}
              onClick={() => onSearch(collection)}
              className="flex items-center gap-2 bg-white border border-border-subtle text-text-muted hover:text-text-main hover:shadow-sm px-3 py-1.5 rounded-md text-sm transition-all"
            >
              <TrendingUp size={12} className="text-gray-400" />
              {collection}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchDropdown;
