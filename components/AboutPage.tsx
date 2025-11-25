
import React from 'react';
import { ShieldAlert, Zap, Search, Globe, Network } from './Icons';

const AboutPage = () => {
  return (
    <div className="flex flex-col h-full w-full bg-bg-main overflow-y-auto font-sans">
      {/* Hero Header */}
      <div className="bg-text-main text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
            <span className="font-serif font-bold text-3xl text-white">i</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">About i-Patuh</h1>
          <p className="text-xl text-white/80 font-light leading-relaxed max-w-2xl mx-auto">
            The intelligent compliance research platform designed to streamline regulatory discovery and interpretation for modern financial institutions.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-16 w-full">
        
        {/* Mission Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-2">Our Mission</h2>
            <h3 className="font-serif text-3xl font-bold text-text-main mb-6">Simplifying Complexity in Regulatory Compliance</h3>
            <p className="text-text-main/80 leading-relaxed mb-4">
              Navigating the labyrinth of financial regulations, internal policies, and audit guidelines is a critical challenge. i-Patuh creates a unified knowledge environment where compliance professionals can find answers instantly.
            </p>
            <p className="text-text-main/80 leading-relaxed">
              By leveraging advanced generative AI, we transform static PDF documents into a dynamic, queryable intelligence layer, ensuring consistent enforcement and reducing operational risk.
            </p>
          </div>
          <div className="bg-bg-card p-8 rounded-2xl shadow-xl border border-border-subtle relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
             <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-4 p-3 bg-bg-main rounded-lg border border-border-subtle">
                   <ShieldAlert className="text-primary" />
                   <span className="font-medium">Risk Mitigation</span>
                </div>
                <div className="flex items-center gap-4 p-3 bg-bg-main rounded-lg border border-border-subtle">
                   <Search className="text-primary" />
                   <span className="font-medium">Semantic Discovery</span>
                </div>
                <div className="flex items-center gap-4 p-3 bg-bg-main rounded-lg border border-border-subtle">
                   <Network className="text-primary" />
                   <span className="font-medium">Cross-Doc Correlation</span>
                </div>
             </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
           <h2 className="text-center font-serif text-3xl font-bold text-text-main mb-12">Key Capabilities</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-bg-card p-6 rounded-xl border border-border-subtle hover:shadow-lg transition-shadow">
                 <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-primary mb-4">
                    <Zap size={24} />
                 </div>
                 <h4 className="font-bold text-lg mb-2">Instant Interpretation</h4>
                 <p className="text-sm text-text-muted leading-relaxed">
                    Ask complex questions in natural language and get cited, authoritative answers derived directly from BNM guidelines and internal circulars.
                 </p>
              </div>
              
              <div className="bg-bg-card p-6 rounded-xl border border-border-subtle hover:shadow-lg transition-shadow">
                 <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
                    <Globe size={24} />
                 </div>
                 <h4 className="font-bold text-lg mb-2">Centralized Corpus</h4>
                 <p className="text-sm text-text-muted leading-relaxed">
                    A single source of truth that ingests regulations (RMiT, AML/CFT), legal opinions, and operational procedures into one searchable index.
                 </p>
              </div>

              <div className="bg-bg-card p-6 rounded-xl border border-border-subtle hover:shadow-lg transition-shadow">
                 <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4">
                    <Network size={24} />
                 </div>
                 <h4 className="font-bold text-lg mb-2">Conflict Detection</h4>
                 <p className="text-sm text-text-muted leading-relaxed">
                    Automatically identify dependencies and potential conflicts between new regulatory requirements and existing internal policies.
                 </p>
              </div>
           </div>
        </div>

        {/* Tech Stack Footer */}
        <div className="bg-text-main text-white rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
           <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
           <div className="relative z-10">
              <h3 className="font-serif text-2xl font-bold mb-4">Powered by Gemini 2.5</h3>
              <p className="text-white/70 max-w-2xl mx-auto mb-8">
                i-Patuh utilizes Google's latest multimodal models to provide reasoning capabilities that go beyond simple keyword matching, ensuring high-accuracy compliance enforcement.
              </p>
              <div className="flex justify-center gap-4 text-sm font-mono text-white/50">
                 <span>v1.0.0-beta</span>
                 <span>•</span>
                 <span>BNM Compliance Module</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
