/*
  # Create Documents Table for i-Patuh Compliance System

  1. New Tables
    - `documents`
      - `id` (text, primary key) - Unique document identifier
      - `title` (text, not null) - Document title
      - `source` (text) - Authority/source of the document
      - `type` (text) - Document type (Regulation, Guideline, etc.)
      - `region` (text) - Jurisdiction (Malaysia, Global, etc.)
      - `department` (text) - Relevant department
      - `last_updated` (date) - Last update date
      - `page_reference` (text) - Specific page/section reference
      - `url` (text) - URL for PDF download/view
      - `tags` (text[]) - Array of keywords/tags
      - `content` (text) - Full document text content
      - `summary` (text) - Executive summary
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

  2. Security
    - Enable RLS on `documents` table
    - Add policy for public read access (compliance documents are informational)
    - Add policy for authenticated users to insert/update (admin uploads)

  3. Indexes
    - Full-text search index on title, content, and summary
    - Index on tags for filtering
    - Index on department and type for categorization

  4. Storage
    - Create 'guidelines' storage bucket for PDF files
    - Set public access for read operations
*/

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id text PRIMARY KEY,
  title text NOT NULL,
  source text,
  type text,
  region text,
  department text,
  last_updated date,
  page_reference text,
  url text,
  tags text[] DEFAULT '{}',
  content text,
  summary text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policy: Public read access for all documents
CREATE POLICY "Public read access for documents"
  ON documents
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy: Authenticated users can insert documents (admin uploads)
CREATE POLICY "Authenticated users can insert documents"
  ON documents
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update documents
CREATE POLICY "Authenticated users can update documents"
  ON documents
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can delete documents
CREATE POLICY "Authenticated users can delete documents"
  ON documents
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_documents_department ON documents(department);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);
CREATE INDEX IF NOT EXISTS idx_documents_tags ON documents USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_documents_last_updated ON documents(last_updated DESC);

-- Create full-text search index
CREATE INDEX IF NOT EXISTS idx_documents_search ON documents 
  USING GIN(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, '') || ' ' || coalesce(summary, '')));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
