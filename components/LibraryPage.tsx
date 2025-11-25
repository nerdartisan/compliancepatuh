import React, { useState, useEffect } from 'react';
import { ComplianceDocument } from '../types';
import FilterSidebar from './FilterSidebar';
import { Search, List, Sparkles } from './Icons';

interface LibraryPageProps {
  initialSearchTerm?: string;
  documents: ComplianceDocument[];
  isLoading?: boolean;
}

const DocumentListItem: React.FC<{ doc: ComplianceDocument }> = ({ doc }) => (
  <div className="border-b border-border-subtle py-4 flex justify-between items-start hover:bg-bg-main/50 transition-colors px-2 -mx-2 rounded-lg group">
    <div>
      <h3 className="font-serif text-lg font-medium text-text-main mb-1 group-hover:text-primary transition-colors">{doc.title}</h3>
      <p className="text-sm text-text-muted">
        {doc.source} • {new Date(doc.lastUpdated).getFullYear()} • {doc.type}
      </p>
      <div className="mt-2 flex gap-2">
        <button 
          onClick={() => doc.url && window.open(doc.url, '_blank')}
          className="text-xs font-semibold bg-bg-main text-text-muted px-3 py-1 rounded-full border border-border-subtle hover:bg-primary hover:text-white hover:border-primary transition-colors"
        >
            View Document
        </button>
      </div>
    </div>
    <div className="text-right text-text-muted flex-shrink-0 ml-4 hidden md:block">
       <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-text-muted">{doc.id}</div>
    </div>
  </div>
);


const LibraryPage: React.FC<LibraryPageProps> = ({ initialSearchTerm = '', documents = [], isLoading = false }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  // Sync prop changes to state if needed (e.g. re-navigating)
  useEffect(() => {
    if (initialSearchTerm) {
      setSearchTerm(initialSearchTerm);
    }
  }, [initialSearchTerm]);

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-1 h-full w-full overflow-hidden bg-bg-card">
      <FilterSidebar />
      <div className="flex-1 flex flex-col h-full">
        <div className="flex-shrink-0 border-b border-border-subtle p-4 flex items-center justify-between bg-bg-main">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search in Texts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-bg-card border border-gray-300 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          </div>
          <div className="flex items-center gap-2 ml-4">
            <select className="text-sm border border-gray-300 rounded-md px-3 py-2 bg-bg-card focus:outline-none focus:ring-1 focus:ring-primary">
              <option>Relevance</option>
              <option>Date Ascending</option>
              <option>Date Descending</option>
            </select>
            <button className="p-2 border border-gray-300 rounded-md bg-bg-card hover:bg-bg-main">
                <List size={20} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-text-muted gap-4">
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                <p className="text-sm font-medium animate-pulse">Syncing with secure storage...</p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-xs font-bold text-text-muted uppercase tracking-wider">
                {filteredDocuments.length} Documents Found
              </div>
              {filteredDocuments.map(doc => (
                <DocumentListItem key={doc.id} doc={doc} />
              ))}
              {filteredDocuments.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-text-muted">
                  <Search size={48} className="mb-4 opacity-20" />
                  <p className="text-lg">No documents found matching "{searchTerm}"</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibraryPage;