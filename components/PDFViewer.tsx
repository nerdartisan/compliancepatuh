import React, { useState } from 'react';
import { X, ExternalLink, Download, FileText } from './Icons';
import { ComplianceDocument } from '../types';

interface PDFViewerProps {
  document: ComplianceDocument;
  onClose: () => void;
  initialPage?: number;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ document, onClose, initialPage }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Construct URL with page fragment if available
  // Standard browser PDF viewers support #page=N
  const pdfUrl = initialPage 
    ? `${document.url}#page=${initialPage}` 
    : document.url;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-bg-main animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-bg-card border-b border-border-subtle shadow-sm flex-shrink-0">
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 text-primary">
            <FileText size={20} />
          </div>
          <div className="flex flex-col overflow-hidden">
            <h2 className="font-sans font-bold text-text-main text-lg truncate pr-4">{document.title}</h2>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">{document.id}</span>
              <span>•</span>
              <span>{document.source}</span>
              {initialPage && (
                <>
                  <span>•</span>
                  <span className="text-primary font-bold bg-primary/10 px-1.5 py-0.5 rounded">Page {initialPage}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button 
            onClick={() => window.open(pdfUrl, '_blank')}
            className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-main hover:bg-bg-main rounded-lg border border-transparent hover:border-border-subtle transition-all"
            title="Open in new tab"
          >
            <ExternalLink size={16} />
            <span>New Tab</span>
          </button>
          
          <a 
            href={document.url} 
            download
            className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg shadow-sm transition-all"
            title="Download PDF"
          >
            <Download size={16} />
            <span>Download</span>
          </a>

          <div className="w-px h-8 bg-border-subtle mx-1 hidden md:block"></div>

          <button 
            onClick={onClose}
            className="p-2 text-text-muted hover:text-text-main hover:bg-bg-main rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 relative bg-gray-100 w-full h-full overflow-hidden flex flex-col items-center justify-center">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-0 text-text-muted">
             <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
             <p className="font-medium animate-pulse">Loading Document...</p>
          </div>
        )}
        
        {document.url ? (
            <iframe 
                src={pdfUrl} 
                className="w-full h-full z-10 shadow-lg" 
                title={document.title}
                onLoad={() => setIsLoading(false)}
            />
        ) : (
            <div className="z-10 bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
                <FileText size={48} className="mx-auto text-text-muted mb-4" />
                <h3 className="text-xl font-bold text-text-main mb-2">Document Unavailable</h3>
                <p className="text-text-muted mb-6">The source file for this document could not be loaded directly.</p>
                <button onClick={onClose} className="text-primary hover:underline font-medium">Close Viewer</button>
            </div>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;