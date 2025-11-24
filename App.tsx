
import React, { useState, useRef, useEffect } from 'react';
import { ViewMode, ChatMessage, ComplianceDocument } from './types';
import { MOCK_DOCUMENTS, INITIAL_SUGGESTIONS } from './constants';
import AppHeader from './components/AppHeader';
import ChatHistorySidebar from './components/ChatHistorySidebar';
import LibraryPage from './components/LibraryPage';
import SearchDropdown from './components/SearchDropdown';
import { queryComplianceEngine } from './services/geminiService';
import { 
  ArrowRight, 
  ArrowLeft,
  FileText, 
  BookOpen, 
  Search,
  X,
  Menu,
  Settings,
  Sparkles
} from './components/Icons';

// Simple Markdown Parser for the specific citation format
const FormattedText = ({ text, onCitationClick }: { text: string, onCitationClick: (e: React.MouseEvent, id: string) => void }) => {
  const parts = text.split(/(\[\[.*?\]\])/g);
  return (
    <span className="leading-relaxed text-text-main">
      {parts.map((part, index) => {
        const match = part.match(/\[\[(.*?)\]\]/);
        if (match) {
          const docId = match[1];
          return (
            <button
              key={index}
              onClick={(e) => onCitationClick(e, docId)}
              className="inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 bg-accent-light text-primary-dark hover:bg-blue-200 rounded text-xs font-semibold align-baseline border border-blue-200 transition-colors cursor-pointer select-none"
            >
              <BookOpen size={10} />
              Ref: {docId}
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
  position, 
  onClose, 
  onViewDoc 
}: { 
  docId: string, 
  position: { x: number, y: number }, 
  onClose: () => void, 
  onViewDoc: (id: string) => void 
}) => {
  const doc = MOCK_DOCUMENTS.find(d => d.id === docId);
  if (!doc) return null;

  // Calculate position logic to keep it on screen
  const width = 350;
  const height = 300; // estimated max height
  
  let left = position.x;
  let top = position.y + 12; // slight buffer

  if (left + width > window.innerWidth) {
    left = window.innerWidth - width - 24;
  }
  
  const isBottomOverflow = top + height > window.innerHeight;
  if (isBottomOverflow) {
    top = position.y - height - 100;
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-transparent" onClick={onClose} />
      <div 
        className="fixed z-50 bg-bg-card rounded-xl shadow-2xl border border-border-subtle w-[350px] overflow-hidden animate-in fade-in zoom-in-95 duration-200 ring-1 ring-black/5"
        style={{ top, left }}
      >
        <div className="bg-text-main text-white p-3 flex justify-between items-center">
           <div className="flex items-center gap-2">
             <BookOpen size={14} className="text-gray-300"/>
             <span className="font-serif font-medium text-sm">Source Reference</span>
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
             <X size={16} />
           </button>
        </div>
        
        <div className="p-4 max-h-[300px] overflow-y-auto">
           <div className="flex items-start justify-between mb-3">
             <h4 className="font-bold text-text-main text-sm leading-tight flex-1">{doc.title}</h4>
             <span className="text-[10px] font-bold text-text-muted border border-border-subtle px-1.5 py-0.5 rounded ml-2 whitespace-nowrap bg-bg-main">{doc.id}</span>
           </div>
           
           <div className="text-xs text-text-muted mb-2 pb-2 border-b border-border-subtle">
              <span className="font-semibold text-text-main">Type:</span> {doc.type} • <span className="font-semibold text-text-main">Region:</span> {doc.region}
           </div>

           <div className="bg-bg-main p-3 rounded border border-border-subtle mb-3">
             <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Key Summary</div>
             <p className="text-xs text-text-muted leading-relaxed font-serif">
               {doc.summary}
             </p>
           </div>
           
           <div className="mb-4">
              <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Document Excerpt</div>
              <div className="text-xs text-text-muted font-mono bg-bg-main p-2 rounded border border-border-subtle leading-relaxed max-h-24 overflow-hidden relative">
                {doc.content.trim()}
                <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-bg-main to-transparent pointer-events-none"></div>
              </div>
           </div>

           <button 
             onClick={() => onViewDoc(docId)}
             className="w-full flex items-center justify-center gap-2 bg-bg-main text-text-main border border-border-subtle text-xs font-semibold py-2.5 rounded-lg hover:bg-gray-200 hover:border-gray-300 transition-all"
           >
             <span>Open Full Document</span>
             <ArrowRight size={14} />
           </button>
        </div>
      </div>
    </>
  );
};

const getPatternStyle = (type: 'grid' | 'waves' | 'scales' | 'dots' | 'default') => {
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

const CollectionCard = ({ title, count, colorClass, pattern = 'default' }: { title: string, count: string, colorClass: string, pattern?: 'grid' | 'waves' | 'scales' | 'dots' | 'default' }) => (
  <div className={`relative h-48 rounded-xl overflow-hidden cursor-pointer group transition-transform hover:-translate-y-1 ${colorClass}`}>
    <div className="absolute inset-0 opacity-30 pointer-events-none mix-blend-overlay" style={getPatternStyle(pattern)}></div>
    
    <div className="absolute inset-0 p-6 flex flex-col justify-end text-white z-10">
      <h3 className="font-serif text-2xl mb-1 font-medium tracking-wide">{title}</h3>
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
  
  const [activeCitation, setActiveCitation] = useState<{id: string, x: number, y: number} | null>(null);
  const [activeChatId, setActiveChatId] = useState<string>('chat-1');
  
  const [isLandingSearchFocused, setIsLandingSearchFocused] = useState(false);
  const landingSearchRef = useRef<HTMLDivElement>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

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

    const responseText = await queryComplianceEngine(messages, queryText);

    const referencedIds = MOCK_DOCUMENTS
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

  const handleDocumentSelect = (docId: string) => {
    // Find doc to get title for search term or just use ID
    const doc = MOCK_DOCUMENTS.find(d => d.id === docId);
    if (doc) {
      setLibrarySearchTerm(doc.title);
      setView('library');
      setIsLandingSearchFocused(false);
    }
  };

  const handleCitationClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setActiveCitation({
      id,
      x: rect.left,
      y: rect.bottom
    });
  };
  
  const renderLanding = () => (
    <div className="flex flex-col h-full w-full overflow-y-auto bg-bg-main font-sans w-full">
      <div className="w-full bg-text-main pb-32 relative flex-shrink-0 transition-all duration-500 z-30">
        <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto text-white/90 text-sm font-medium">
          {/* Left Side */}
          <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 font-serif text-lg font-bold text-white">
                  <span className="w-8 h-8 bg-primary rounded flex items-center justify-center font-bold">L</span>
                  Lexicon
              </div>
              <div className="hidden md:flex items-center gap-8">
                  <button onClick={() => setView('library')} className="hover:text-white transition-colors">Browse</button>
                  <a href="#" className="hover:text-white transition-colors">About</a>
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

        <div className="relative z-30 flex flex-col items-center justify-center pt-8 md:pt-16 px-4">
          <h1 className="font-serif text-4xl md:text-6xl text-white text-center mb-6 tracking-tight leading-tight">
            AI-Powered Compliance Research
          </h1>
          <p className="text-white/80 text-center mb-10 text-lg font-light tracking-wide max-w-2xl">
            Explore, search, and analyze over 15,000 internal & regulatory texts with precision and authority.
          </p>

          <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full backdrop-blur-md transition-all text-sm mb-10 border border-white/20 group">
            <span className="w-5 h-5 bg-white text-primary rounded-full flex items-center justify-center text-[8px] pl-0.5 group-hover:scale-110 transition-transform">▶</span> 
            How Lexicon Works - 2:00
          </button>

          <div 
            className="w-full max-w-3xl bg-bg-card rounded-[2rem] p-3 shadow-2xl shadow-black/20 relative group focus-within:ring-4 focus-within:ring-primary/20 transition-all z-20"
            ref={landingSearchRef}
          >
             <div className="px-6 pt-3 pb-1">
               <textarea 
                 className="w-full text-xl md:text-2xl text-text-main placeholder:text-gray-300 resize-none outline-none bg-transparent h-14 font-light leading-relaxed"
                 placeholder="Send a message..."
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onFocus={() => setIsLandingSearchFocused(true)}
                 onKeyDown={(e) => {
                   if (e.key === 'Enter' && !e.shiftKey) {
                     e.preventDefault();
                     handleSearch();
                   }
                 }}
               />
             </div>
             
             <div className="flex items-center justify-between px-4 pb-2 mt-2">
               <div className="flex items-center gap-2 bg-bg-main p-1.5 rounded-full">
                 <button className="bg-bg-card shadow-sm text-text-main px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2">
                   <Sparkles size={14} className="text-primary" />
                   AI Chat
                 </button>
                 <button onClick={() => setView('library')} className="text-text-muted px-4 py-2 rounded-full text-sm font-medium hover:text-text-main transition-all flex items-center gap-2 hover:bg-gray-200/50">
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
                   onClick={() => handleSearch()}
                   disabled={!input.trim()}
                   className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-105"
                 >
                   <ArrowRight size={18} />
                 </button>
               </div>
             </div>

             {/* Search Dropdown for Landing Page */}
             {isLandingSearchFocused && (
               <SearchDropdown 
                 recentSearches={recentSearches}
                 onSearch={(query) => {
                   handleSearch(query);
                   setIsLandingSearchFocused(false);
                 }}
                 onClearRecent={() => setRecentSearches([])}
                 query={input}
                 documents={MOCK_DOCUMENTS}
                 onResultClick={handleDocumentSelect}
               />
             )}
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 mt-8 relative z-10">
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

      <div className="relative z-20 w-full px-4 md:px-8 pb-16 -mt-20">
         <div className="max-w-7xl mx-auto bg-bg-card rounded-[2.5rem] shadow-xl border border-border-subtle p-8 md:p-12">
            <div className="flex items-center justify-between mb-10 text-text-main">
              <div className="flex items-center gap-4">
                <h2 className="font-serif font-bold text-3xl text-text-main">Collections</h2>
                <span className="bg-gray-200 text-text-muted text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">6 Categories</span>
              </div>
              <div className="flex gap-3">
                <button className="w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center text-text-muted hover:text-text-main hover:border-text-main transition-all bg-bg-card">
                  <ArrowLeft size={18} />
                </button>
                <button className="w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center text-text-muted hover:text-text-main hover:border-text-main transition-all bg-bg-card">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <CollectionCard title="Global Regulations" count="320 Texts" colorClass="bg-[#2E2E2E]" pattern="grid" />
                <CollectionCard title="Internal Policies" count="1,294 Texts" colorClass="bg-[#666666]" pattern="scales" />
                <CollectionCard title="Audit Guidelines" count="888 Texts" colorClass="bg-[#343A40]" pattern="waves" />
                <CollectionCard title="Risk History" count="475 Texts" colorClass="bg-[#144EB6]" pattern="dots" />
                <CollectionCard title="Legal Opinions" count="15 Texts" colorClass="bg-text-muted" pattern="grid" />
                <CollectionCard title="Operational Docs" count="69 Texts" colorClass="bg-[#212529]" pattern="scales" />
            </div>
         </div>
      </div>
    </div>
  );

  const renderAppView = () => {
    if (view === 'library') {
      return <LibraryPage initialSearchTerm={librarySearchTerm} />;
    }

    // Default to search view
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
              position={activeCitation}
              onClose={() => setActiveCitation(null)}
              onViewDoc={(id) => {
                setSelectedDocId(id);
                setActiveCitation(null);
              }}
            />
          )}

          {/* Main Chat Area */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-12">
            <div className="max-w-4xl mx-auto space-y-8">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  {msg.role === 'model' && (
                    <div className="w-8 h-8 min-w-[32px] rounded-full bg-text-main text-white flex items-center justify-center font-serif text-xs">
                      L
                    </div>
                  )}
                  
                  <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-bg-card px-6 py-4 rounded-2xl text-text-main border border-border-subtle' : ''}`}>
                     {msg.role === 'model' ? (
                       <div className="prose prose-stone max-w-none text-base font-serif">
                         <FormattedText text={msg.content} onCitationClick={handleCitationClick} />
                       </div>
                     ) : (
                       <p className="text-base font-serif">{msg.content}</p>
                     )}
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex gap-4">
                   <div className="w-8 h-8 rounded-full bg-text-main text-white flex items-center justify-center font-serif text-xs animate-pulse">
                      L
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

          {/* Input Bar */}
          <div className="p-6 bg-bg-main/80 backdrop-blur-sm border-t border-border-subtle">
             <div className="max-w-4xl mx-auto">
               <div className="relative bg-bg-card rounded-2xl p-2.5 shadow-lg shadow-black/5 border border-gray-300/80">
                 <textarea 
                   className="w-full text-base text-text-main placeholder:text-text-muted resize-none outline-none bg-transparent h-12 p-3 pr-24 font-serif"
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
        </div>
      </div>
    );
  };
  
  const isLandingView = view === 'landing';

  return (
    <div className="flex h-screen w-screen bg-bg-main font-sans text-text-main overflow-hidden flex-col">
      {!isLandingView && 
        <AppHeader 
          view={view} 
          setView={setView} 
          onSearch={handleSearch}
          recentSearches={recentSearches}
          onClearRecent={() => setRecentSearches([])}
          onDocumentSelect={handleDocumentSelect}
        />
      }
      
      <main className="flex-1 h-full overflow-hidden flex w-full">
        {isLandingView ? renderLanding() : renderAppView()}
      </main>
    </div>
  );
};

export default App;
