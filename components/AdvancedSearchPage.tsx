
import React, { useState } from 'react';
import { Search, ChevronRight, ArrowRight, ArrowLeft, LayoutGrid, List } from './Icons';

const BookCover = ({ title, author, color, pattern }: { title: string, author: string, color: string, pattern: 'islamic-1' | 'islamic-2' | 'islamic-3' | 'islamic-4' }) => {
  const getPattern = () => {
    // CSS patterns for the covers
    switch(pattern) {
      case 'islamic-1': return { backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '10px 10px' };
      case 'islamic-2': return { backgroundImage: 'linear-gradient(45deg, #00000022 25%, transparent 25%, transparent 75%, #00000022 75%, #00000022), linear-gradient(45deg, #00000022 25%, transparent 25%, transparent 75%, #00000022 75%, #00000022)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' };
      case 'islamic-3': return { backgroundImage: 'repeating-linear-gradient(45deg, #00000011 0, #00000011 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' };
      default: return { backgroundImage: 'linear-gradient(90deg, #00000011 1px, transparent 1px), linear-gradient(#00000011 1px, transparent 1px)', backgroundSize: '15px 15px' };
    }
  };

  return (
    <div className={`relative aspect-[3/4] rounded-sm shadow-md overflow-hidden ${color} cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1`}>
      <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={getPattern()}></div>
      <div className="absolute inset-0 border-4 border-yellow-500/20 m-2"></div>
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-white/90 text-text-main font-serif text-sm p-2 shadow-sm mb-2 w-full font-bold">
          {title}
        </div>
        <div className="text-white/90 text-xs font-serif mt-2">{author}</div>
      </div>
    </div>
  );
};

const AdvancedSearchPage = () => {
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (query.trim()) {
      setHasSearched(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-bg-main overflow-y-auto">
      {/* Search Header Area */}
      <div className="bg-bg-card border-b border-border-subtle p-6 pb-0">
        <div className="max-w-6xl mx-auto w-full">
            <h1 className="sr-only">Advanced Search</h1>
            
            {/* Search Bar moved here */}
            <div className="relative w-full max-w-3xl mb-8">
               <input 
                 type="text" 
                 value={query}
                 onChange={(e) => setQuery(e.target.value)}
                 onKeyDown={handleKeyDown}
                 placeholder="Search specifically for regulations, circulars, or policies..."
                 className="w-full bg-bg-main border border-border-subtle rounded-xl py-3 pl-12 pr-14 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow shadow-sm placeholder:text-text-muted"
                 autoFocus
               />
               <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
               <button 
                 onClick={handleSearch}
                 className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white p-1.5 rounded-lg hover:bg-primary-dark transition-colors"
               >
                 <ArrowRight size={18} />
               </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-6 overflow-x-auto pb-4 border-b border-transparent">
               {['All', 'Content', 'Policy Docs', 'Departments', 'Regions', 'Dates'].map((tab, i) => (
                 <button 
                   key={tab}
                   className={`text-sm font-medium pb-3 border-b-2 transition-colors whitespace-nowrap ${
                     i === 0 
                       ? 'text-text-main border-text-main' 
                       : 'text-text-muted border-transparent hover:text-text-main hover:border-border-subtle'
                   }`}
                 >
                   {tab}
                 </button>
               ))}
               <div className="flex-1"></div>
               <div className="flex flex-col gap-0.5">
                  <button className="text-text-muted hover:text-text-main"><ChevronRight size={14} className="-rotate-90" /></button>
                  <button className="text-text-muted hover:text-text-main"><ChevronRight size={14} className="rotate-90" /></button>
               </div>
            </div>
        </div>
      </div>

      <div className="flex-1 p-6 md:p-8">
        <div className="max-w-6xl mx-auto w-full space-y-10">
          
          {hasSearched ? (
            <>
              {/* Content Section */}
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-text-main font-serif">Content</h2>
                  <div className="flex items-center gap-2">
                    <button className="text-sm text-primary hover:underline">View All</button>
                    <div className="flex gap-1">
                      <button className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-text-muted"><ArrowLeft size={16}/></button>
                      <button className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-text-muted"><ArrowRight size={16}/></button>
                    </div>
                  </div>
                </div>

                {/* Content Card - Updated for BNM / RMBIT */}
                <div className="bg-bg-card rounded-xl border border-border-subtle p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative group">
                  <div className="flex flex-col gap-4">
                    <div className="font-serif text-lg leading-relaxed text-text-main">
                      "Financial institutions must ensure that the <span className="text-primary font-bold">adoption of cloud services</span> (including public, private and hybrid clouds) does not compromise the security and confidentiality of customer information..."
                    </div>
                    <div className="font-serif text-base text-text-main/80 italic">
                      — Risk Management in Technology (RMiT), Paragraph 10.5
                    </div>
                    <div className="text-xs text-text-muted font-mono mt-2">
                      Ref: BNM/RH/PD 028-5 • Effective June 2020
                    </div>
                    <div className="mt-4 pt-4 border-t border-border-subtle flex justify-between items-end">
                      <div>
                        <div className="text-sm font-bold text-text-main">Policy Document</div>
                        <div className="text-xs text-text-muted">Bank Negara Malaysia</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-text-main">Technology Risk</div>
                        <div className="text-xs text-text-muted">Sector: Banking & DTI</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Texts Section */}
              <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-text-main font-serif">Related Policies</h2>
                  <div className="flex items-center gap-2">
                    <button className="text-sm text-primary hover:underline">View All</button>
                    <div className="flex gap-1">
                      <button className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-text-muted"><ArrowLeft size={16}/></button>
                      <button className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-text-muted"><ArrowRight size={16}/></button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <BookCover 
                    title="Financial Services Act 2013"
                    author="Laws of Malaysia"
                    color="bg-[#1A237E]"
                    pattern="islamic-1"
                  />
                  <BookCover 
                    title="AML/CFT Policy"
                    author="Bank Negara Malaysia"
                    color="bg-[#B71C1C]"
                    pattern="islamic-2"
                  />
                  <BookCover 
                    title="RMiT Guidelines"
                    author="Technology Risk"
                    color="bg-[#1B5E20]"
                    pattern="islamic-3"
                  />
                  <BookCover 
                    title="e-Money Policy"
                    author="Payment Systems"
                    color="bg-[#F57F17]"
                    pattern="islamic-4"
                  />
                </div>
              </section>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-text-muted">
              <Search size={48} className="mb-4 opacity-20" />
              <p className="text-lg font-medium">Enter a term to start searching</p>
              <p className="text-sm">Try searching for "RMiT", "Cloud", or "AML"</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchPage;
