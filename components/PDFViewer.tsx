
import React, { useState } from 'react';
import { X, ExternalLink, Download, FileText, AlertCircle } from './Icons';
import { ComplianceDocument } from '../types';

interface PDFViewerProps {
  document: ComplianceDocument;
  onClose: () => void;
  initialPage?: number;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ document, onClose, initialPage }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Use Google Docs Viewer to bypass X-Frame-Options (CORS) from external government sites
  const encodedUrl = encodeURIComponent(document.url || '');
  const viewerUrl = `https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-bg-main animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-bg-card border-b border-border-subtle shadow-sm flex-shrink-0 z-10">
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
                  <span className="text-primary font-bold bg-yellow-100 text-yellow-800 border border-yellow-200 px-2 py-0.5 rounded flex items-center gap-1">
                     Reference: Page {initialPage}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button 
            onClick={() => window.open(document.url, '_blank')}
            className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-main hover:bg-bg-main rounded-lg border border-transparent hover:border-border-subtle transition-all"
            title="Open original file directly"
          >
            <ExternalLink size={16} />
            <span>Open Original</span>
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
          <div className="absolute inset-0 flex flex-col items-center justify-center z-0 text-text-muted bg-gray-50/50 backdrop-blur-sm">
             <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
             <p className="font-medium animate-pulse">Loading Document Preview...</p>
             <p className="text-xs text-text-muted mt-2">Using secure viewer proxy</p>
          </div>
        )}
        
        {document.url ? (
            <>
                <iframe 
                    src={viewerUrl} 
                    className="w-full h-full z-10 shadow-lg bg-white" 
                    title={document.title}
                    onLoad={() => setIsLoading(false)}
                    referrerPolicy="no-referrer"
                    sandbox="allow-scripts allow-same-origin allow-popups"
                />
                
                {/* Fallback / Warning Banner */}
                {!isLoading && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-white/90 backdrop-blur-md border border-border-subtle shadow-lg rounded-full px-4 py-2 flex items-center gap-3 text-xs text-text-muted opacity-80 hover:opacity-100 transition-opacity">
                        <AlertCircle size={14} className="text-orange-500" />
                        <span>Preview not loading?</span>
                        <button 
                            onClick={() => window.open(document.url, '_blank')}
                            className="text-primary font-bold hover:underline"
                        >
                            Open Source File
                        </button>
                    </div>
                )}
            </>
        ) : (
            <div className="z-10 bg-white p-8 rounded-xl shadow-lg text-center max-w-md border border-border-subtle">
                <FileText size={48} className="mx-auto text-text-muted mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-text-main mb-2">Preview Unavailable</h3>
                <p className="text-text-muted mb-6 text-sm">The source URL for this document is missing or invalid.</p>
                <button onClick={onClose} className="px-6 py-2 bg-bg-main hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">Close Viewer</button>
            </div>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;
