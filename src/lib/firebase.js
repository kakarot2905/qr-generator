import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAWxR-DNGUe_-8d71Sfywp3wDI7h_pcmrQ",
  authDomain: "qrgen-65c54.firebaseapp.com",
  projectId: "qrgen-65c54",
  storageBucket: "qrgen-65c54.firebasestorage.app",
  messagingSenderId: "787924714537",
  appId: "1:787924714537:web:e7b871e59027f6bcd98838",
  measurementId: "G-KL7LFC03NK",
};

// Initialize only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
// Fail fast instead of silently retrying for ~2 min when Storage is
// misconfigured (e.g. bucket not enabled), so the UI can show an error.
storage.maxUploadRetryTime = 15000;
storage.maxOperationRetryTime = 15000;
export const googleProvider = new GoogleAuthProvider();
