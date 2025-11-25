import { createClient } from '@supabase/supabase-js';

// Access credentials from environment variables or use provided defaults
// Note: In a production React app, these would typically be REACT_APP_SUPABASE_URL, etc.
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://cjfoymkliuwlzgkboues.supabase.co';
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
        console.warn("Falling back to local Blob URL due to upload failure.");
        return URL.createObjectURL(file);
    }
};