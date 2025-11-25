
import { createClient } from '@supabase/supabase-js';
import { ComplianceDocument } from '../types';

// Access credentials from environment variables or use provided defaults
// Note: In a production React app, these would typically be REACT_APP_SUPABASE_URL, etc.
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://cjfoymkliuwlzgkboues.supabase.co';
// Note: The user provided key appears to be a Service Role secret (starts with sb_secret). 
// In a real production client-side app, you should use the ANON key to respect RLS.
// However, for this specific implementation context, we use the provided key.
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_secret_idw2Cd3URuCneEHACiVF5w_-e7emVOf';

// Initialize the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Uploads a file (Blob/File) to Supabase Storage and returns the public URL.
 * @param file The file object to upload
 * @param docId The unique ID of the document (used for filename)
 */
export const uploadToSupabase = async (file: Blob | File, docId: string): Promise<string> => {
    try {
        const fileName = `${docId}.pdf`;
        
        console.log(`Attempting upload to 'guidelines/${fileName}'...`);

        // 1. Upload to the 'guidelines' bucket
        // Ensure you have created a public bucket named 'guidelines' in your Supabase Storage dashboard
        const { data, error } = await supabase.storage
            .from('guidelines')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (error) {
            console.error("Supabase Upload Error Details:", error);
            throw error;
        }

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('guidelines')
            .getPublicUrl(fileName);

        console.log("Uploaded successfully to Supabase:", publicUrl);
        return publicUrl;
    } catch (error) {
        console.error("Error uploading to Supabase:", error);
        // Fallback to local blob if cloud upload fails so the user can still work in the current session
        // BUT: This URL will not be valid after refresh. The documentService handles this.
        console.warn("Falling back to local Blob URL due to upload failure.");
        return URL.createObjectURL(file);
    }
};

/**
 * Saves document metadata and content to the Supabase Database.
 * Assumes a table named 'documents' exists.
 */
export const saveDocumentMetadata = async (doc: ComplianceDocument): Promise<void> => {
    try {
        console.log("Saving metadata to Supabase DB...");
        const { error } = await supabase
            .from('documents')
            .upsert({
                id: doc.id,
                title: doc.title,
                source: doc.source,
                type: doc.type,
                region: doc.region,
                department: doc.department,
                last_updated: doc.lastUpdated, // Mapping camelCase to snake_case for DB
                page_reference: doc.pageReference,
                url: doc.url,
                tags: doc.tags,
                content: doc.content,
                summary: doc.summary,
                // user_id: doc.user_id // Add if auth is enabled
            });

        if (error) {
            console.error("Supabase DB Error:", error);
            throw error;
        }
        console.log("Metadata saved successfully.");
    } catch (error) {
        console.error("Error saving document metadata to Supabase:", error);
        throw error;
    }
};

/**
 * Fetches all user-uploaded documents from Supabase Database.
 */
export const fetchUserDocuments = async (): Promise<ComplianceDocument[]> => {
    try {
        const { data, error } = await supabase
            .from('documents')
            .select('*');

        if (error) {
            console.error("Supabase Fetch Error:", error);
            return [];
        }

        // Map DB snake_case back to TypeScript camelCase
        return (data || []).map((d: any) => ({
            id: d.id,
            title: d.title,
            source: d.source,
            type: d.type,
            region: d.region,
            department: d.department,
            lastUpdated: d.last_updated,
            pageReference: d.page_reference,
            url: d.url,
            tags: d.tags || [],
            content: d.content,
            summary: d.summary
        }));
    } catch (error) {
        console.error("Error fetching documents from Supabase:", error);
        return [];
    }
};
