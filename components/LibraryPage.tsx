import React, { useState, useEffect } from 'react';
import { ComplianceDocument } from '../types';
import FilterSidebar from './FilterSidebar';
import { Search, List } from './Icons';

interface LibraryPageProps {
  initialSearchTerm?: string;
  documents: ComplianceDocument[];
}

const DocumentListItem: React.FC<{ doc: ComplianceDocument }> = ({ doc }) => (
  <div className="border-b border-border-subtle py-4 flex justify-between items-start">
    <div>
      <h3 className="font-serif text-lg font-medium text-text-main mb-1">{doc.title}</h3>
      <p className="text-sm text-text-muted">
        {doc.source} (d. {new Date(doc.lastUpdated).getFullYear()})
      </p>
      <div className="mt-2 flex gap-2">
        <button 
          onClick={() => doc.url && window.open(doc.url, '_blank')}
          className="text-xs font-semibold bg-bg-main text-text-muted px-3 py-1 rounded-full border border-border-subtle hover:bg-gray-200 transition-colors"
        >
            PDF
        </button>
        <button className="text-xs font-semibold bg-bg-main text-text-muted px-3 py-1 rounded-full border border-border-subtle hover:bg-gray-200 transition-colors">E-Book</button>
      </div>
    </div>
    <div className="text-right text-text-muted flex-shrink-0 ml-4">
       <h4 className="font-serif text-lg font-medium text-text-main">{doc.title}</h4>
       <p className="text-sm">{doc.source} / {doc.lastUpdated}</p>
    </div>
  </div>
);


const LibraryPage: React.FC<LibraryPageProps> = ({ initialSearchTerm = '', documents = [] }) => {
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
        <div className="flex-1 overflow-y-auto px-6">
          {filteredDocuments.map(doc => (
            <DocumentListItem key={doc.id} doc={doc} />
          ))}
          {filteredDocuments.length === 0 && (
            <div className="p-10 text-center text-text-muted">
              No documents found matching "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibraryPage;