import { initializeApp } from "firebase/app";
import { getStorage, ref, listAll, getDownloadURL, getMetadata, getBytes } from "firebase/storage";
import { ComplianceDocument, DocumentType } from "../types";

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

export const fetchDocuments = async (): Promise<ComplianceDocument[]> => {
  try {
    const docs: ComplianceDocument[] = [];

    // 1. Try to fetch a 'corpus.json' file which contains structured data (full text, etc.)
    try {
        const corpusRef = ref(storage, 'corpus.json');
        const bytes = await getBytes(corpusRef);
        const text = new TextDecoder().decode(bytes);
        const corpusData = JSON.parse(text);
        
        if (Array.isArray(corpusData)) {
            // Map JSON data to ComplianceDocument, adding defaults if missing
            const jsonDocs = corpusData.map((d: any) => ({
                id: d.id || `doc-${Date.now()}`,
                title: d.title || "Untitled Document",
                source: d.source || "Firebase Index",
                type: d.type || DocumentType.INTERNAL_POLICY,
                region: d.region || "Malaysia",
                department: d.department || "General",
                lastUpdated: d.lastUpdated || new Date().toISOString().split('T')[0],
                tags: d.tags || [],
                content: d.content || "",
                summary: d.summary || "",
                url: d.url, // If the JSON points to external URLs
                pageReference: d.pageReference
            }));
            docs.push(...jsonDocs);
        }
    } catch (e) {
        console.log("No corpus.json found or invalid format. Falling back to file listing.");
    }

    // 2. List individual PDF files in the 'documents/' folder
    try {
        const listRef = ref(storage, 'documents/');
        const res = await listAll(listRef);

        const fileDocs = await Promise.all(res.items.map(async (itemRef) => {
          // Skip if this ID already exists from corpus.json
          const id = itemRef.name.replace(/\.[^/.]+$/, "");
          if (docs.find(d => d.id === id)) return null;

          const url = await getDownloadURL(itemRef);
          let metadata;
          try {
            metadata = await getMetadata(itemRef);
          } catch (e) {
            console.warn("Could not fetch metadata for", itemRef.name);
          }

          return {
            id: id,
            title: metadata?.customMetadata?.title || itemRef.name.replace(/_/g, ' ').replace('.pdf', ''),
            source: metadata?.customMetadata?.source || "Firebase Storage",
            type: (metadata?.customMetadata?.type as DocumentType) || DocumentType.REGULATION,
            region: metadata?.customMetadata?.region || "Malaysia",
            department: metadata?.customMetadata?.department || "General",
            lastUpdated: metadata?.updated ? new Date(metadata.updated).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            tags: metadata?.customMetadata?.tags ? metadata.customMetadata.tags.split(',') : ['PDF'],
            content: metadata?.customMetadata?.summary || "Content available in PDF viewer.", // Fallback content for AI context
            summary: metadata?.customMetadata?.summary || "Document loaded from cloud storage.",
            url: url,
            pageReference: "Full Document"
          } as ComplianceDocument;
        }));

        // Filter out nulls
        fileDocs.forEach(d => {
            if (d) docs.push(d);
        });

    } catch (e) {
        console.error("Error listing documents folder:", e);
    }

    return docs;
  } catch (error) {
    console.error("Critical error fetching documents from Firebase:", error);
    return [];
  }
};
