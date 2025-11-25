import { initializeApp } from "firebase/app";
import { getStorage, ref, listAll, getDownloadURL, getMetadata, getBytes } from "firebase/storage";
import { ComplianceDocument, DocumentType } from "../types";

// Removed static import of pdfjs-dist to prevent top-level await/load issues
// We will import it dynamically when needed

const firebaseConfig = {
    apiKey: "AIzaSyBa6XAasJFlGaTb14Cjf0nOTWnKy2nl2wU",
    authDomain: "patuh-9cb04.firebaseapp.com",
    projectId: "patuh-9cb04",
    storageBucket: "patuh-9cb04.firebasestorage.app",
    messagingSenderId: "213226514554",
    appId: "1:213226514554:web:1875cf6cb6f4345c7bf3c3",
    measurementId: "G-5193ZP7FR6"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const extractTextFromPdf = async (url: string): Promise<string> => {
    try {
        // Dynamic import ensures the app loads even if PDF.js has issues
        // It also handles different export structures (default vs named)
        const pdfjsModule = await import('pdfjs-dist');
        const pdfjs = (pdfjsModule as any).getDocument ? pdfjsModule : (pdfjsModule as any).default;

        if (!pdfjs || !pdfjs.getDocument) {
            console.warn("PDF.js could not be loaded");
            return "";
        }

        // Initialize worker if not already done
        if (pdfjs.GlobalWorkerOptions && !pdfjs.GlobalWorkerOptions.workerSrc) {
            pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.mjs`;
        }
        
        const loadingTask = pdfjs.getDocument(url);
        const pdf = await loadingTask.promise;
        let fullText = '';
        
        // Limit pages to avoid browser crash/timeout on huge docs. 
        // 15 pages is usually enough for the 'Key Summary' and introduction context.
        const maxPages = Math.min(pdf.numPages, 15); 
        
        for (let i = 1; i <= maxPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            // Add spaces between items to preserve some layout structure
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            fullText += `--- Page ${i} ---\n${pageText}\n\n`;
        }
        
        if (pdf.numPages > maxPages) {
            fullText += `\n[...Truncated. Total pages: ${pdf.numPages}]`;
        }

        return fullText;
    } catch (error) {
        console.warn("Error parsing PDF content or loading PDF.js:", error);
        return "";
    }
}

const processStorageItems = async (items: any[], existingIds: Set<string>): Promise<ComplianceDocument[]> => {
    const docs: ComplianceDocument[] = [];
    
    // Process items in parallel
    await Promise.all(items.map(async (itemRef) => {
        // Skip corpus.json or system files
        if (itemRef.name === 'corpus.json' || itemRef.name.startsWith('.')) return;
        
        // Generate a clean ID
        const id = itemRef.name.replace(/\.[^/.]+$/, ""); // Remove extension
        
        // Prevent duplicates
        if (existingIds.has(id)) return;

        try {
             const url = await getDownloadURL(itemRef);
             let metadata;
             try {
                metadata = await getMetadata(itemRef);
             } catch (e) {
                // Metadata might be missing or not accessible, proceed with defaults
             }

             // Determine content
             let content = metadata?.customMetadata?.summary || "Content available in PDF viewer.";
             const isPdf = itemRef.name.toLowerCase().endsWith('.pdf');
             
             // If it's a PDF and we don't have a manual summary, try to extract text
             if (isPdf && (!metadata?.customMetadata?.summary || content === "Content available in PDF viewer.")) {
                 const extracted = await extractTextFromPdf(url);
                 if (extracted && extracted.trim().length > 0) {
                     content = extracted;
                 }
             }

             const doc: ComplianceDocument = {
                id: id,
                title: metadata?.customMetadata?.title || itemRef.name.replace(/_/g, ' ').replace(/\.pdf$/i, ''),
                source: metadata?.customMetadata?.source || "Firebase Storage",
                type: (metadata?.customMetadata?.type as DocumentType) || DocumentType.REGULATION,
                region: metadata?.customMetadata?.region || "Malaysia",
                department: metadata?.customMetadata?.department || "General",
                lastUpdated: metadata?.updated ? new Date(metadata.updated).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                tags: metadata?.customMetadata?.tags ? metadata.customMetadata.tags.split(',') : ['PDF'],
                content: content,
                summary: metadata?.customMetadata?.summary || content.slice(0, 200) + "...",
                url: url,
                pageReference: "Full Document"
             };
             
             docs.push(doc);
             existingIds.add(id);
        } catch (err) {
            console.error(`Error processing file ${itemRef.name}:`, err);
        }
    }));

    return docs;
};

export const fetchDocuments = async (): Promise<ComplianceDocument[]> => {
  try {
    const docs: ComplianceDocument[] = [];
    const existingIds = new Set<string>();

    // 1. Try to fetch 'corpus.json' for structured metadata index
    try {
        const corpusRef = ref(storage, 'corpus.json');
        const bytes = await getBytes(corpusRef);
        const text = new TextDecoder().decode(bytes);
        const corpusData = JSON.parse(text);
        
        if (Array.isArray(corpusData)) {
            corpusData.forEach((d: any) => {
                const docId = d.id || `doc-${Date.now()}-${Math.random()}`;
                if (!existingIds.has(docId)) {
                     docs.push({
                        ...d,
                        id: docId,
                        // Ensure defaults for optional fields
                        type: d.type || DocumentType.INTERNAL_POLICY,
                        lastUpdated: d.lastUpdated || new Date().toISOString().split('T')[0],
                        tags: d.tags || [],
                        content: d.content || "",
                        summary: d.summary || ""
                    });
                    existingIds.add(docId);
                }
            });
        }
    } catch (e) {
        // It's fine if corpus.json doesn't exist
    }

    // 2. List files from 'documents/' folder
    try {
        const listRefDocs = ref(storage, 'documents/');
        const resDocs = await listAll(listRefDocs);
        const folderDocs = await processStorageItems(resDocs.items, existingIds);
        docs.push(...folderDocs);
    } catch (e) {
        console.warn("Documents folder listing failed (folder might not exist):", e);
    }

    // 3. List files from Root (fallback or user dropped files here)
    try {
        const listRefRoot = ref(storage);
        const resRoot = await listAll(listRefRoot);
        const rootDocs = await processStorageItems(resRoot.items, existingIds);
        docs.push(...rootDocs);
    } catch (e) {
        console.error("Error listing root bucket:", e);
    }

    return docs;
  } catch (error) {
    console.error("Critical error fetching documents from Firebase:", error);
    return [];
  }
};