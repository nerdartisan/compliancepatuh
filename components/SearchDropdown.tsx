
import React from 'react';
import { POPULAR_SEARCHES, POPULAR_COLLECTIONS } from '../constants';
import { TrendingUp, ArrowRight, FileText, BookOpen } from './Icons';
import { ComplianceDocument } from '../types';

interface SearchDropdownProps {
  recentSearches: string[];
  onSearch: (query: string) => void;
  onClearRecent: () => void;
  query?: string;
  documents?: ComplianceDocument[];
  onResultClick?: (docId: string) => void;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({ 
  recentSearches, 
  onSearch, 
  onClearRecent,
  query = '',
  documents = [],
  onResultClick
}) => {
  // Fuzzy search logic
  const normalizedQuery = query.toLowerCase().trim();
  const matchingDocs = normalizedQuery 
    ? documents.filter(doc => 
        doc.title.toLowerCase().includes(normalizedQuery) || 
        doc.summary.toLowerCase().includes(normalizedQuery)
      ).slice(0, 3) // Limit to top 3
    : [];

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-bg-card rounded-xl shadow-xl border border-border-subtle overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 flex flex-col max-h-[80vh] overflow-y-auto">
      
      {/* Filters / Tabs (Visual only based on screenshot) */}
      <div className="flex items-center gap-2 p-2 border-b border-border-subtle bg-bg-main/30 overflow-x-auto">
        {['All', 'Texts', 'Authors', 'Genres'].map((tab, i) => (
          <button 
            key={tab} 
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${i === 0 ? 'bg-white text-text-main shadow-sm border border-border-subtle' : 'text-text-muted hover:text-text-main hover:bg-bg-main'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Matching Documents Section (Fuzzy Search Results) */}
      {matchingDocs.length > 0 && (
        <div className="p-2 border-b border-border-subtle bg-bg-main/10">
          <h4 className="px-2 py-1 text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Top Matches</h4>
          {matchingDocs.map(doc => (
             <div 
               key={doc.id}
               onClick={() => onResultClick && onResultClick(doc.id)}
               className="group flex flex-col gap-1 p-3 rounded-lg hover:bg-bg-main cursor-pointer transition-colors border border-transparent hover:border-border-subtle"
             >
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="text-sm font-serif text-text-muted mb-1">
                          Search book content for <span className="text-text-main font-semibold">"{query}"</span>
                        </div>
                        <h4 className="text-base font-serif font-medium text-text-main group-hover:text-primary transition-colors line-clamp-1">
                          {doc.title}
                        </h4>
                    </div>
                    <ArrowRight size={14} className="text-text-muted group-hover:text-primary transform -rotate-45 group-hover:rotate-0 transition-all duration-300" />
                </div>
                
                <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
                    <span className="font-medium text-text-main">{doc.id}</span>
                    <span>•</span>
                    <span className="font-serif italic">{doc.source}</span>
                    <span className="ml-auto bg-bg-card border border-border-subtle px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide text-text-muted">
                        {doc.type === 'Regulation' ? 'Reg' : 'Text'}
                    </span>
                </div>
             </div>
          ))}
        </div>
      )}

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
              <BookOpen size={12} className="text-gray-400" />
              {collection}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchDropdown;
