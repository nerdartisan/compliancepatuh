
export enum DocumentType {
  REGULATION = 'Regulation',
  INTERNAL_POLICY = 'Internal Policy',
  GUIDELINE = 'Guideline',
  AUDIT_REQUIREMENT = 'Audit Requirement'
}

export interface ComplianceDocument {
  id: string;
  title: string;
  source: string; // e.g., "EU Parliament", "Internal Risk Committee"
  type: DocumentType;
  region: string;
  department: string;
  lastUpdated: string;
  tags: string[];
  content: string; // The full text or structured chunks
  summary: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  relatedDocIds?: string[];
  isThinking?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  date: string; // e.g., "Today", "Yesterday", "5 Days Ago"
  messages: ChatMessage[];
}

export interface SearchState {
  query: string;
  isSearching: boolean;
  results: ChatMessage[];
}

export type ViewMode = 'landing' | 'search' | 'library' | 'graph' | 'advanced-search';
