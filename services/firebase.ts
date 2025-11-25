import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBa6XAasJFlGaTb14Cjf0nOTWnKy2nl2wU",
  authDomain: "patuh-9cb04.firebaseapp.com",
  projectId: "patuh-9cb04",
  storageBucket: "patuh-9cb04.firebasestorage.app",
  messagingSenderId: "213226514554",
  appId: "1:213226514554:web:1875cf6cb6f4345c7bf3c3",
  measurementId: "G-5193ZP7FR6"
};

let app;
let storage;

try {
  app = initializeApp(firebaseConfig);
  storage = getStorage(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
}

/**
 * Uploads a file (Blob/File) to Firebase Storage and returns the download URL.
 * @param file The file object to upload
 * @param docId The unique ID of the document (used for filename)
 */
export const uploadToFirebase = async (file: Blob | File, docId: string): Promise<string> => {
    if (!storage) {
        throw new Error("Firebase Storage not initialized");
    }
    try {
        const storageRef = ref(storage, `guidelines/${docId}.pdf`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log("Uploaded successfully:", downloadURL);
        return downloadURL;
    } catch (error) {
        console.error("Error uploading to Firebase:", error);
        throw error;
    }
};