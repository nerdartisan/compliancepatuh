
import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, X, Sparkles, Check } from './Icons';
import { ComplianceDocument, DocumentType } from '../types';
import { DEPARTMENTS } from '../constants';

interface AdminPageProps {
  onUpload: (doc: ComplianceDocument) => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('Securities Commission Malaysia');
  const [type, setType] = useState<DocumentType>(DocumentType.GUIDELINE);
  const [region, setRegion] = useState('Malaysia');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState(''); // Manually pasted content for now (since no OCR backend)
  
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

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      // Auto-fill title from filename
      if (!title) {
        setTitle(selectedFile.name.replace('.pdf', '').replace(/_/g, ' '));
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
      lastUpdated: new Date().toISOString().split('T')[0],
      url: blobUrl,
      tags: [department, type, 'New Upload'],
      content: content || "Content available in PDF viewer.", // Fallback if no text pasted
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
          <p className="text-white/70">Upload and manage compliance guidelines.</p>
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
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                isDragging 
                  ? 'border-primary bg-primary/5' 
                  : file 
                    ? 'border-green-500 bg-green-50' 
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
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="p-2 hover:bg-white rounded-full text-text-muted hover:text-red-500 transition-colors ml-4"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <div className="cursor-pointer" onClick={() => fileInputRef.current?.click()}>
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
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-bg-main border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="e.g. Guidelines on Technology Risk"
                />
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
                <span>Key Summary</span>
                <span className="text-xs font-normal text-text-muted">Displayed in library preview</span>
              </label>
              <textarea 
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                className="w-full bg-bg-main border border-border-subtle rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                placeholder="Brief description of the document..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-main mb-2 flex justify-between">
                <span className="flex items-center gap-2">
                   Extracted Text Content 
                   <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">Recommended for AI</span>
                </span>
              </label>
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                className="w-full bg-bg-main border border-border-subtle rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-mono text-xs"
                placeholder="Paste the text content here to make it searchable by the AI..."
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
                disabled={!file || !title}
                className="px-8 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center gap-2"
              >
                <Check size={16} />
                Upload to Library
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
