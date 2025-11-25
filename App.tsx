
import React, { useState, useRef, useEffect } from 'react';
import { ViewMode, ChatMessage, ComplianceDocument } from './types';
import { INITIAL_SUGGESTIONS, DEPARTMENTS } from './constants';
import AppHeader from './components/AppHeader';
import ChatHistorySidebar from './components/ChatHistorySidebar';
import LibraryPage from './components/LibraryPage';
import SearchDropdown from './components/SearchDropdown';
import AdvancedSearchPage from './components/AdvancedSearchPage';
import AboutPage from './components/AboutPage';
import AdminPage from './components/AdminPage';
import PDFViewer from './components/PDFViewer';
import { queryComplianceEngine } from './services/geminiService';
import { fetchDocuments, saveDocument } from './services/documentService';
import { 
  ArrowRight, 
  ArrowLeft,
  FileText, 
  BookOpen, 
  Search,
  Menu,
  Settings,
  Sparkles,
  X
} from './components/Icons';

// Simple Markdown Parser for the specific citation format
// Parses [[docId|Page X]] or [[docId]]
const FormattedText = ({ text, onCitationClick }: { text: string, onCitationClick: (e: React.MouseEvent, id: string, page?: string) => void }) => {
  // Regex to match [[id|page]] or [[id]]
  const parts = text.split(/(\[\[.*?\]\])/g);
  return (
    <span className="leading-relaxed text-text-main font-sans">
      {parts.map((part, index) => {
        const match = part.match(/\[\[(.*?)(?:\|(.*?))?\]\]/);
        if (match) {
          const docId = match[1];
          const pageRef = match[2]; // Might be "Page 5" or undefined
          return (
            <button
              key={index}
              onClick={(e) => onCitationClick(e, docId, pageRef)}
              className="inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 bg-accent-light text-primary-dark hover:bg-blue-200 rounded text-xs font-semibold align-baseline border border-blue-200 transition-colors cursor-pointer select-none"
            >
              <BookOpen size={10} />
              Ref: {docId} {pageRef ? ` • ${pageRef}` : ''}
            </button>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};

const CitationPopup = ({ 
  docId, 
  pageRef,
  onClose, 
  onViewDoc,
  documents 
}: { 
  docId: string, 
  pageRef?: string,
  onClose: () => void, 
  onViewDoc: (id: string, page?: number) => void,
  documents: ComplianceDocument[]
}) => {
  
  const doc = documents.find(d => d.id === docId);
  if (!doc) return null;

  // Extract page number if present in "Page X" string
  const pageNumber = pageRef ? parseInt(pageRef.replace(/\D/g, '')) : undefined;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-bg-card rounded-2xl shadow-2xl border border-border-subtle w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-text-main text-white px-6 py-4 flex justify-between items-center flex-shrink-0">
           <div className="flex items-center gap-3">
             <BookOpen size={20} className="text-gray-300"/>
             <div>
                <span className="font-sans font-bold text-lg block leading-none mb-1">Source Reference</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider opacity-70 bg-white/10 px-1.5 py-0.5 rounded">{doc.id}</span>
                  {pageRef && (
                    <span className="text-[10px] uppercase tracking-wider font-bold text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 px-1.5 py-0.5 rounded">
                      {pageRef}
                    </span>
                  )}
                </div>
             </div>
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-1.5 transition-colors">
             <X size={20} />
           </button>
        </div>
        
        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto">
           <div className="flex items-start justify-between mb-6">
             <div className="flex-1">
                 <h4 className="font-sans font-bold text-2xl text-text-main mb-2">{doc.title}</h4>
                 <div className="text-sm text-text-muted flex flex-wrap gap-4">
                    <span className="flex items-center gap-1"><span className="font-semibold text-text-main">Type:</span> {doc.type}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full self-center"></span>
                    <span className="flex items-center gap-1"><span className="font-semibold text-text-main">Region:</span> {doc.region}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full self-center"></span>
                    <span className="flex items-center gap-1"><span className="font-semibold text-text-main">Updated:</span> {doc.lastUpdated}</span>
                 </div>
             </div>
           </div>

           <div className="bg-bg-main p-4 rounded-xl border border-border-subtle mb-6">
             <div className="text-xs text-primary font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                <Sparkles size={12} />
                Key Summary
             </div>
             <p className="text-sm text-text-main leading-relaxed font-sans">
               {doc.summary}
             </p>
           </div>
           
           <div className="mb-6">
              <div className="text-xs text-text-muted font-bold uppercase tracking-wider mb-2">Document Excerpt</div>
              <div className="text-sm text-text-main font-mono bg-gray-50 p-4 rounded-xl border border-border-subtle leading-relaxed whitespace-pre-line">
                {doc.content ? doc.content.slice(0, 500) + (doc.content.length > 500 ? "..." : "") : "Text content not available."}
              </div>
           </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-subtle bg-bg-main flex justify-end flex-shrink-0">
           <button 
             onClick={() => onViewDoc(docId, pageNumber)}
             className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-dark transition-all font-medium shadow-sm hover:shadow-md"
           >
             <span>Open Full Document {pageRef ? `at ${pageRef}` : ''}</span>
             <ArrowRight size={16} />
           </button>
        </div>
      </div>
    </div>
  );
};

type PatternType = 'grid' | 'waves' | 'scales' | 'dots' | 'default';

const getPatternStyle = (type: PatternType) => {
  switch (type) {
    case 'grid':
      return { 
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '20px 20px' 
      };
    case 'waves':
      return { 
        backgroundImage: 'radial-gradient(circle at 50% 0, transparent 40%, rgba(255,255,255,0.05) 41%, transparent 42%)',
        backgroundSize: '30px 20px'
      };
    case 'scales':
      return { 
        backgroundImage: 'radial-gradient(circle at 0% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 100% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        backgroundSize: '30px 30px'
      };
    case 'dots':
      return { 
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)',
        backgroundSize: '15px 15px'
      };
    default:
      return { 
        backgroundImage: 'radial-gradient(circle at 50% 120%, rgba(255,255,255,0.4) 0%, transparent 60%)' 
      };
  }
};

interface CollectionCardProps {
  title: string;
  count: string;
  colorClass: string;
  pattern?: PatternType;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ title, count, colorClass, pattern = 'default' }) => (
  <div className={`relative h-48 rounded-xl overflow-hidden cursor-pointer group transition-transform hover:-translate-y-1 ${colorClass}`}>
    <div className="absolute inset-0 opacity-30 pointer-events-none mix-blend-overlay" style={getPatternStyle(pattern as PatternType)}></div>
    
    <div className="absolute inset-0 p-6 flex flex-col justify-end text-white z-10">
      <h3 className="font-sans text-lg leading-tight mb-2 font-medium tracking-wide">{title}</h3>
      <p className="text-sm opacity-80 font-light flex items-center gap-1">
        <FileText size={12} />
        {count}
      </p>
    </div>
  </div>
);

const App = () => {
  const [view, setView] = useState<ViewMode>('landing');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [librarySearchTerm, setLibrarySearchTerm] = useState('');
  const [docs, setDocs] = useState<ComplianceDocument[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);
  
  const [activeCitation, setActiveCitation] = useState<{id: string, pageRef?: string, x: number, y: number} | null>(null);
  const [activeChatId, setActiveChatId] = useState<string>('chat-1');
  
  // New state for PDF Viewer
  const [viewingDoc, setViewingDoc] = useState<{ doc: ComplianceDocument, page?: number } | null>(null);

  const [isLandingSearchFocused, setIsLandingSearchFocused] = useState(false);
  const [landingSearchMode, setLandingSearchMode] = useState<'chat' | 'search'>('chat');
  const landingSearchRef = useRef<HTMLDivElement>(null);

  // Pagination for Departments
  const [deptPage, setDeptPage] = useState(0);
  const deptsPerPage = 6;

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load documents from documentService
    const load = async () => {
        setIsLoadingDocs(true);
        try {
            const fetched = await fetchDocuments();
            setDocs(fetched);
        } catch (err) {
            console.error("Failed to load documents", err);
        } finally {
            setIsLoadingDocs(false);
        }
    };
    load();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Click outside handler for landing page search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (landingSearchRef.current && !landingSearchRef.current.contains(event.target as Node)) {
        setIsLandingSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (queryText: string = input) => {
    if (!queryText.trim()) return;

    // Add to recent searches if not exists, keep max 5
    if (!recentSearches.includes(queryText)) {
      setRecentSearches(prev => [queryText, ...prev].slice(0, 5));
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: queryText,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);
    setView('search');
    setSelectedDocId(null);
    setActiveCitation(null);
    setIsLandingSearchFocused(false);

    // Use current docs for the AI query
    const responseText = await queryComplianceEngine(messages, queryText, docs);

    const referencedIds = docs
      .filter(doc => responseText.includes(doc.id))
      .map(doc => doc.id);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      content: responseText,
      timestamp: Date.now(),
      relatedDocIds: referencedIds
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsProcessing(false);
  };

  const handleLandingSubmit = () => {
    const queryText = input.trim();
    if (!queryText) return;

    if (landingSearchMode === 'chat') {
        handleSearch(queryText);
    } else {
        // Search Mode logic
        if (!recentSearches.includes(queryText)) {
            setRecentSearches(prev => [queryText, ...prev].slice(0, 5));
        }
        setLibrarySearchTerm(queryText);
        setView('library');
        setInput('');
        setIsLandingSearchFocused(false);
    }
  };

  const handleDocumentSelect = (docId: string) => {
    const doc = docs.find(d => d.id === docId);
    if (doc) {
      setLibrarySearchTerm(doc.title);
      setView('library');
      setIsLandingSearchFocused(false);
    }
  };

  const handleDocumentUpload = (newDoc: ComplianceDocument) => {
    // Persist the document (stripping blob url for storage)
    saveDocument(newDoc);
    
    // Update local state immediately with the full doc (including blob url) so the user can view it now
    setDocs(prev => [newDoc, ...prev]);
    setLibrarySearchTerm(newDoc.title);
    setView('library');
  };

  const handleCitationClick = (e: React.MouseEvent, id: string, pageRef?: string) => {
    e.preventDefault();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setActiveCitation({
      id,
      pageRef,
      x: rect.left,
      y: rect.bottom
    });
  };
  
  const handleViewDocument = (docId: string, page?: number) => {
    const doc = docs.find(d => d.id === docId);
    if (doc) {
        setViewingDoc({ doc, page });
        setActiveCitation(null); // Close citation popup if open
    }
  };

  const handleDeptNext = () => {
    if ((deptPage + 1) * deptsPerPage < DEPARTMENTS.length) {
      setDeptPage(prev => prev + 1);
    }
  };

  const handleDeptPrev = () => {
    if (deptPage > 0) {
      setDeptPage(prev => prev - 1);
    }
  };
  
  const renderLanding = () => (
    <div className="flex flex-col h-full w-full overflow-y-auto bg-bg-main font-sans w-full relative">
      {/* 
        HERO SECTION 
      */}
      <div className="w-full bg-text-main pb-32 relative flex-shrink-0">
        <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto text-white/90 text-sm font-medium">
          {/* Left Side */}
          <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 font-sans text-lg font-bold text-white cursor-pointer" onClick={() => setView('landing')}>
                  <span className="w-8 h-8 bg-primary rounded flex items-center justify-center font-bold">i</span>
                  i-Patuh
              </div>
              <div className="hidden md:flex items-center gap-8">
                  <button onClick={() => setView('library')} className="hover:text-white transition-colors">Browse</button>
                  <button onClick={() => setView('about')} className="hover:text-white transition-colors">About</button>
                  <a href="#" className="hover:text-white transition-colors">Contribute</a>
              </div>
          </div>
          
          {/* Right Side */}
          <div className="flex items-center gap-4">
              <button onClick={() => setView('search')} className="hidden md:flex bg-white/10 px-3 py-1 rounded-full hover:bg-white/20 transition-colors items-center gap-2 text-white border border-white/10">
                  <Sparkles size={14} className="text-yellow-400" />
                  AI Chat <span className="bg-primary text-white text-[10px] px-1.5 rounded-sm font-bold uppercase tracking-wider">New</span>
              </button>
              <div className="md:hidden">
                  <Menu className="text-white" />
              </div>
          </div>
        </nav>

        <div className="relative z-50 flex flex-col items-center justify-center pt-8 md:pt-16 px-4">
          <h1 className="font-sans text-4xl md:text-6xl text-white text-center mb-6 tracking-tight leading-tight">
            AI-Powered Compliance Research
          </h1>
          <p className="text-white/80 text-center mb-10 text-lg font-light tracking-wide max-w-2xl">
            Explore, search, and analyze over {docs.length > 0 ? docs.length : '15,000'} internal & regulatory texts with precision and authority.
          </p>

          <button 
            onClick={() => setView('about')}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full backdrop-blur-md transition-all text-sm mb-10 border border-white/20 group"
          >
            <span className="w-5 h-5 bg-white text-primary rounded-full flex items-center justify-center text-[8px] pl-0.5 group-hover:scale-110 transition-transform">▶</span> 
            How i-Patuh Works - 2:00
          </button>

          {/* Search Container */}
          <div 
            className="w-full max-w-3xl bg-bg-card rounded-[2rem] p-3 shadow-2xl shadow-black/20 relative group focus-within:ring-4 focus-within:ring-primary/20 transition-all z-50"
            ref={landingSearchRef}
          >
             <div className="px-6 pt-3 pb-1">
               <textarea 
                 className="w-full text-xl md:text-2xl text-text-main placeholder:text-gray-300 resize-none outline-none bg-transparent h-14 font-light leading-relaxed font-sans"
                 placeholder={landingSearchMode === 'chat' ? "Send a message..." : "Search for documents..."}
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onFocus={() => setIsLandingSearchFocused(true)}
                 onKeyDown={(e) => {
                   if (e.key === 'Enter' && !e.shiftKey) {
                     e.preventDefault();
                     handleLandingSubmit();
                   }
                 }}
               />
             </div>
             
             <div className="flex items-center justify-between px-4 pb-2 mt-2">
               <div className="flex items-center gap-2 bg-bg-main p-1.5 rounded-full">
                 <button 
                   onClick={() => setLandingSearchMode('chat')}
                   className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${landingSearchMode === 'chat' ? 'bg-bg-card shadow-sm text-text-main' : 'text-text-muted hover:text-text-main'}`}
                 >
                   <Sparkles size={14} className={landingSearchMode === 'chat' ? "text-primary" : "text-gray-400"} />
                   AI Chat
                 </button>
                 <button 
                   onClick={() => setLandingSearchMode('search')}
                   className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${landingSearchMode === 'search' ? 'bg-bg-card shadow-sm text-text-main' : 'text-text-muted hover:text-text-main hover:bg-gray-200/50'}`}
                 >
                   <Search size={14} />
                   Search
                 </button>
               </div>

               <div className="flex items-center gap-3">
                 <button className="flex items-center gap-2 text-text-muted border border-border-subtle px-4 py-2.5 rounded-full text-sm hover:bg-bg-main transition-colors font-medium">
                    <Settings size={14} />
                    <span>Filters</span>
                 </button>
                 <button 
                   onClick={() => handleLandingSubmit()}
                   disabled={!input.trim()}
                   className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-105"
                 >
                   <ArrowRight size={18} />
                 </button>
               </div>
             </div>

             {/* Search Dropdown for Landing Page */}
             {isLandingSearchFocused && landingSearchMode === 'search' && (
               <SearchDropdown 
                 recentSearches={recentSearches}
                 onSearch={(query) => {
                   setInput(query);
                   if (!recentSearches.includes(query)) {
                       setRecentSearches(prev => [query, ...prev].slice(0, 5));
                   }
                   setLibrarySearchTerm(query);
                   setView('library');
                   setInput('');
                   setIsLandingSearchFocused(false);
                 }}
                 onClearRecent={() => setRecentSearches([])}
                 query={input}
                 documents={docs}
                 onResultClick={handleDocumentSelect}
               />
             )}
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 mt-8 relative z-40">
            {[
              "Explain Policy", 
              "Find Regulation", 
              "Interpret Guidelines", 
              "Compare Rules"
            ].map((label) => (
              <button 
                key={label}
                onClick={() => handleSearch(label)}
                className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-white hover:text-primary-dark transition-all shadow-sm"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 
        DEPARTMENTS / COLLECTIONS SECTION
      */}
      <div className="relative z-30 w-full px-4 md:px-8 pb-16 -mt-20">
         <div className="max-w-7xl mx-auto bg-bg-card rounded-[2.5rem] shadow-xl border border-border-subtle p-8 md:p-12">
            <div className="flex items-center justify-between mb-10 text-text-main">
              <div className="flex items-center gap-4">
                <h2 className="font-sans font-bold text-3xl text-text-main">Departments</h2>
                <span className="bg-gray-200 text-text-muted text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  {DEPARTMENTS.length} Units
                </span>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handleDeptPrev}
                  disabled={deptPage === 0}
                  className={`w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center transition-all bg-bg-card ${deptPage === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-text-muted hover:text-text-main hover:border-text-main'}`}
                >
                  <ArrowLeft size={18} />
                </button>
                <button 
                   onClick={handleDeptNext}
                   disabled={(deptPage + 1) * deptsPerPage >= DEPARTMENTS.length}
                   className={`w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center transition-all bg-bg-card ${(deptPage + 1) * deptsPerPage >= DEPARTMENTS.length ? 'text-gray-300 cursor-not-allowed' : 'text-text-muted hover:text-text-main hover:border-text-main'}`}
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {DEPARTMENTS.slice(deptPage * deptsPerPage, (deptPage + 1) * deptsPerPage).map((dept, index) => {
                  const styles: { color: string; pattern: PatternType }[] = [
                      { color: 'bg-[#2E2E2E]', pattern: 'grid' },
                      { color: 'bg-[#144EB6]', pattern: 'waves' },
                      { color: 'bg-[#343A40]', pattern: 'scales' },
                      { color: 'bg-[#666666]', pattern: 'dots' },
                      { color: 'bg-[#212529]', pattern: 'grid' },
                      { color: 'bg-[#495057]', pattern: 'scales' }
                  ];
                  const style = styles[index % styles.length];
                  const count = Math.floor((dept.length * 123) % 500) + 50; 
                  
                  return (
                    <CollectionCard 
                      key={dept} 
                      title={dept} 
                      count={`${count} Docs`} 
                      colorClass={style.color} 
                      pattern={style.pattern} 
                    />
                  );
                })}
            </div>
            
            <div className="mt-6 flex justify-center gap-2">
                {Array.from({ length: Math.ceil(DEPARTMENTS.length / deptsPerPage) }).map((_, i) => (
                    <div 
                        key={i} 
                        className={`h-1.5 rounded-full transition-all ${i === deptPage ? 'w-6 bg-primary' : 'w-2 bg-gray-200'}`} 
                    />
                ))}
            </div>
         </div>
      </div>
    </div>
  );

  const renderAppView = () => {
    if (view === 'about') {
        return <AboutPage />;
    }

    if (view === 'admin') {
      return <AdminPage onUpload={handleDocumentUpload} documents={docs} />;
    }

    if (view === 'library') {
      return (
        <LibraryPage 
            initialSearchTerm={librarySearchTerm} 
            documents={docs} 
            isLoading={isLoadingDocs} 
            onViewDocument={handleViewDocument}
        />
      );
    }

    if (view === 'advanced-search') {
      return <AdvancedSearchPage />;
    }

    // Default to search view
    const isChatEmpty = messages.length === 0;

    return (
      <div className="flex-1 flex h-full w-full overflow-hidden">
        <ChatHistorySidebar 
          activeChatId={activeChatId}
          onSelectChat={(id) => setActiveChatId(id)}
        />

        <div className="flex-1 flex flex-col h-full bg-bg-main relative">
          {activeCitation && (
            <CitationPopup 
              docId={activeCitation.id}
              pageRef={activeCitation.pageRef}
              onClose={() => setActiveCitation(null)}
              onViewDoc={handleViewDocument}
              documents={docs}
            />
          )}

          {isChatEmpty ? (
            // WELCOME / EMPTY STATE
            <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-bg-card rounded-2xl shadow-sm border border-border-subtle flex items-center justify-center mb-6">
                    <Sparkles size={32} className="text-primary" />
                </div>
                <h1 className="text-3xl md:text-4xl font-sans font-bold text-text-main mb-2">Welcome to i-Patuh!</h1>
                <p className="text-text-muted text-lg font-light mb-10">Type your first question below</p>

                {/* Suggestion Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mb-8">
                   {INITIAL_SUGGESTIONS.map((suggestion, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleSearch(suggestion)}
                        className="bg-bg-card hover:bg-white border border-border-subtle hover:border-primary/50 hover:shadow-md p-4 rounded-xl text-left transition-all group h-full flex items-center"
                      >
                        <span className="text-sm font-medium text-text-main group-hover:text-primary transition-colors line-clamp-2">
                          {suggestion}
                        </span>
                      </button>
                   ))}
                </div>

                {/* Input Area (Welcome Mode) */}
                <div className="w-full max-w-2xl bg-bg-card rounded-[24px] border border-border-subtle shadow-lg shadow-black/5 p-4 relative group focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    <textarea 
                        className="w-full bg-transparent text-base text-text-main placeholder:text-text-muted/50 resize-none outline-none h-12 p-1 font-sans"
                        placeholder="Send a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                         onKeyDown={(e) => {
                             if (e.key === 'Enter' && !e.shiftKey) {
                               e.preventDefault();
                               handleSearch();
                             }
                        }}
                    />
                    <div className="flex items-center justify-between mt-2">
                        <button className="flex items-center gap-2 text-text-muted hover:text-text-main bg-bg-main px-3 py-1.5 rounded-full text-xs font-medium transition-colors border border-border-subtle">
                             <Settings size={14} />
                             <span>Filters</span>
                        </button>
                        <button 
                             onClick={() => handleSearch()}
                             disabled={!input.trim()}
                             className="w-9 h-9 bg-primary/10 text-primary rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all disabled:opacity-50"
                        >
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-[10px] text-text-muted/60 uppercase tracking-widest font-semibold">
                    AI can make mistakes. Check important info.
                </div>
            </div>
          ) : (
            // ACTIVE CHAT STATE
            <>
              {/* Main Chat Area */}
              <div className="flex-1 overflow-y-auto p-6 lg:p-12">
                <div className="max-w-4xl mx-auto space-y-8">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                      {msg.role === 'model' && (
                        <div className="w-8 h-8 min-w-[32px] rounded-full bg-text-main text-white flex items-center justify-center font-sans text-xs">
                          i
                        </div>
                      )}
                      
                      <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-bg-card px-6 py-4 rounded-2xl text-text-main border border-border-subtle' : ''}`}>
                        {msg.role === 'model' ? (
                          <div className="prose prose-stone max-w-none text-base font-sans">
                            <FormattedText text={msg.content} onCitationClick={handleCitationClick} />
                          </div>
                        ) : (
                          <p className="text-base font-sans">{msg.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {isProcessing && (
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-text-main text-white flex items-center justify-center font-sans text-xs animate-pulse">
                          i
                        </div>
                        <div className="flex items-center gap-2 text-text-muted text-sm">
                          <span className="animate-bounce">●</span>
                          <span className="animate-bounce delay-100">●</span>
                          <span className="animate-bounce delay-200">●</span>
                        </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>
              </div>

              {/* Input Bar (Sticky) */}
              <div className="p-6 bg-bg-main/80 backdrop-blur-sm border-t border-border-subtle">
                <div className="max-w-4xl mx-auto">
                  <div className="relative bg-bg-card rounded-2xl p-2.5 shadow-lg shadow-black/5 border border-gray-300/80">
                    <textarea 
                      className="w-full text-base text-text-main placeholder:text-text-muted resize-none outline-none bg-transparent h-12 p-3 pr-24 font-sans"
                      placeholder="Send a message..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSearch();
                        }
                      }}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <button className="flex items-center gap-2 text-text-muted border border-border-subtle px-3 py-1.5 rounded-lg text-sm hover:bg-bg-main transition-colors font-medium">
                            <Settings size={14} />
                            <span>Filters</span>
                        </button>
                        <button 
                          onClick={() => handleSearch()}
                          disabled={!input.trim()}
                          className="w-9 h-9 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                        >
                          <ArrowRight size={16} />
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };
  
  const isLandingView = view === 'landing';

  return (
    <div className="flex h-screen w-screen bg-bg-main font-sans text-text-main overflow-hidden flex-col">
      {/* Global PDF Viewer Overlay */}
      {viewingDoc && (
        <PDFViewer 
            document={viewingDoc.doc} 
            initialPage={viewingDoc.page}
            onClose={() => setViewingDoc(null)} 
        />
      )}

      {!isLandingView && 
        <AppHeader 
          view={view} 
          setView={setView} 
          onSearch={handleSearch}
          recentSearches={recentSearches}
          onClearRecent={() => setRecentSearches([])}
          onDocumentSelect={handleDocumentSelect}
          documents={docs}
        />
      }
      
      <main className="flex-1 h-full overflow-hidden flex w-full">
        {isLandingView ? renderLanding() : renderAppView()}
      </main>
    </div>
  );
};

export default App;
