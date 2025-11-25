
import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, X, Sparkles, Check, Zap } from './Icons';
import { ComplianceDocument, DocumentType } from '../types';
import { DEPARTMENTS } from '../constants';
import { analyzeDocument } from '../services/geminiService';

interface AdminPageProps {
  onUpload: (doc: ComplianceDocument) => void;
  documents?: ComplianceDocument[]; // Optional for future dup checking
}

const AdminPage: React.FC<AdminPageProps> = ({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('Securities Commission Malaysia');
  const [type, setType] = useState<DocumentType>(DocumentType.GUIDELINE);
  const [region, setRegion] = useState('Malaysia');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState(''); 
  const [tags, setTags] = useState<string[]>([]);
  const [lastUpdated, setLastUpdated] = useState(new Date().toISOString().split('T')[0]);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = async (selectedFile: File) => {
    if (selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      
      // Start AI Analysis
      setIsAnalyzing(true);
      try {
        const analysis = await analyzeDocument(selectedFile);
        
        if (analysis.title) setTitle(analysis.title);
        if (analysis.summary) setSummary(analysis.summary);
        if (analysis.content) setContent(analysis.content);
        if (analysis.region) setRegion(analysis.region);
        if (analysis.lastUpdated) setLastUpdated(analysis.lastUpdated);
        if (analysis.tags) setTags(analysis.tags);
        
        // Try to map the AI detected type to our Enum
        if (analysis.type) {
            const upperType = analysis.type.toUpperCase();
            if (upperType.includes('REGULATION')) setType(DocumentType.REGULATION);
            else if (upperType.includes('POLICY')) setType(DocumentType.INTERNAL_POLICY);
            else if (upperType.includes('AUDIT')) setType(DocumentType.AUDIT_REQUIREMENT);
            else setType(DocumentType.GUIDELINE);
        }

        // Try to map department
        if (analysis.department) {
            const match = DEPARTMENTS.find(d => d.toLowerCase().includes(analysis.department?.toLowerCase() || ''));
            if (match) setDepartment(match);
        }

      } catch (error) {
        console.error("Analysis failed", error);
        // Fallback to basic filename
        if (!title) {
             setTitle(selectedFile.name.replace('.pdf', '').replace(/_/g, ' '));
        }
      } finally {
        setIsAnalyzing(false);
      }

    } else {
      alert('Please upload a PDF file.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    // Create a Blob URL for local preview
    const blobUrl = URL.createObjectURL(file);

    const newDoc: ComplianceDocument = {
      id: `doc-${Date.now()}`,
      title,
      source,
      type,
      region,
      department,
      lastUpdated: lastUpdated,
      url: blobUrl,
      tags: [...tags, department, type, 'New Upload'],
      content: content || "Content available in PDF viewer.", 
      summary: summary || `Uploaded document: ${title}`,
      pageReference: "Full Document"
    };

    onUpload(newDoc);
  };

  return (
    <div className="flex flex-col h-full w-full bg-bg-main overflow-y-auto font-sans">
      <div className="bg-text-main text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-white/70">Upload and analyze compliance guidelines with AI.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-6 py-8 -mt-8">
        <div className="bg-bg-card rounded-2xl shadow-xl border border-border-subtle p-8">
          <h2 className="text-xl font-bold text-text-main mb-6 flex items-center gap-2">
            <UploadCloud className="text-primary" />
            Upload New Document
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* File Drop Zone */}
            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all relative overflow-hidden ${
                isDragging 
                  ? 'border-primary bg-primary/5' 
                  : file 
                    ? 'border-green-50' 
                    : 'border-gray-300 hover:border-primary/50 hover:bg-gray-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="application/pdf"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
              />
              
              {file ? (
                <div className="relative z-10">
                    <div className="flex items-center justify-center gap-4">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                        <FileText size={24} />
                    </div>
                    <div className="text-left">
                        <p className="font-medium text-text-main">{file.name}</p>
                        <p className="text-xs text-text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setFile(null); setContent(''); setTitle(''); setSummary(''); }}
                        className="p-2 hover:bg-white rounded-full text-text-muted hover:text-red-500 transition-colors ml-4"
                    >
                        <X size={20} />
                    </button>
                    </div>
                    {isAnalyzing && (
                        <div className="mt-4 flex flex-col items-center text-primary animate-pulse">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <Sparkles size={16} />
                                Analyzing Document...
                            </div>
                            <p className="text-xs opacity-80 mt-1">Extracting text, summary, and metadata</p>
                        </div>
                    )}
                </div>
              ) : (
                <div className="cursor-pointer relative z-10" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-16 h-16 bg-bg-main rounded-full flex items-center justify-center mx-auto mb-4 text-text-muted">
                    <UploadCloud size={32} />
                  </div>
                  <p className="text-text-main font-medium mb-1">Click to upload or drag and drop</p>
                  <p className="text-sm text-text-muted">PDF files only (max 10MB)</p>
                </div>
              )}
            </div>

            {/* Metadata Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-text-main mb-2">Document Title</label>
                <div className="relative">
                    <input 
                    type="text" 
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-bg-main border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary pr-8"
                    placeholder={isAnalyzing ? "Extracting..." : "e.g. Guidelines on Technology Risk"}
                    />
                    {title && !isAnalyzing && <Check size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-main mb-2">Source / Authority</label>
                <input 
                  type="text" 
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full bg-bg-main border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-main mb-2">Document Type</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value as DocumentType)}
                  className="w-full bg-bg-main border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {Object.values(DocumentType).map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-main mb-2">Department</label>
                <select 
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-bg-main border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Text Content (Optional - for AI) */}
            <div>
              <label className="block text-sm font-semibold text-text-main mb-2 flex justify-between">
                <span className="flex items-center gap-2">Key Summary {summary && <Zap size={12} className="text-yellow-500" />}</span>
                <span className="text-xs font-normal text-text-muted">Displayed in library preview</span>
              </label>
              <textarea 
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                className="w-full bg-bg-main border border-border-subtle rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                placeholder={isAnalyzing ? "AI is generating a summary..." : "Brief description of the document..."}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-main mb-2 flex justify-between">
                <span className="flex items-center gap-2">
                   Extracted Text Content 
                   {content ? <Check size={14} className="text-green-500" /> : <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">Required for AI</span>}
                </span>
              </label>
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                className="w-full bg-bg-main border border-border-subtle rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-mono text-xs"
                placeholder={isAnalyzing ? "AI is reading the document..." : "Paste the text content here to make it searchable by the AI..."}
              />
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-border-subtle flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => { setFile(null); setTitle(''); setContent(''); }}
                className="px-6 py-2.5 text-sm font-medium text-text-muted hover:text-text-main transition-colors"
              >
                Clear
              </button>
              <button 
                type="submit"
                disabled={!file || !title || isAnalyzing}
                className="px-8 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center gap-2"
              >
                {isAnalyzing ? <Sparkles size={16} className="animate-spin" /> : <Check size={16} />}
                {isAnalyzing ? 'Analyzing...' : 'Save to Guidelines Library'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
