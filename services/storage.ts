
// This service acts as a "Virtual File System" for the application.
// Since browsers cannot write directly to the project's source folders (like /guidelines),
// we use IndexedDB to create a persistent, dedicated storage area named 'guidelines'.

const DB_NAME = 'i-patuh-db';
const GUIDELINES_STORE = 'guidelines';

let dbPromise: Promise<IDBDatabase> | null = null;

const openDB = (): Promise<IDBDatabase> => {
    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve, reject) => {
        if (!window.indexedDB) {
            reject(new Error("IndexedDB not supported in this browser"));
            return;
        }

        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = (e) => {
            const db = (e.target as IDBOpenDBRequest).result;
            // Create a dedicated store for the guidelines
            if (!db.objectStoreNames.contains(GUIDELINES_STORE)) {
                db.createObjectStore(GUIDELINES_STORE);
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => {
            dbPromise = null; // Reset on failure
            reject(request.error);
        };
    });
    return dbPromise;
};

/**
 * Stores a PDF file blob into the 'guidelines' store.
 * @param id The unique document ID (acts as filename)
 * @param blob The file data
 */
export const saveFileToGuidelines = async (id: string, blob: Blob): Promise<void> => {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(GUIDELINES_STORE, 'readwrite');
            const store = tx.objectStore(GUIDELINES_STORE);
            const request = store.put(blob, id);
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    } catch (e) {
        console.error("Storage Service: Failed to save file", e);
        throw e;
    }
};

/**
 * Retrieves a PDF file blob from the 'guidelines' store.
 * @param id The unique document ID
 */
export const getFileFromGuidelines = async (id: string): Promise<Blob | undefined> => {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(GUIDELINES_STORE, 'readonly');
            const store = tx.objectStore(GUIDELINES_STORE);
            const request = store.get(id);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    } catch (e) {
        console.error("Storage Service: Failed to retrieve file", e);
        return undefined;
    }
};
