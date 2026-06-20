import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBLPEIaBiNuNBZnVDQt2JMRrg-qQidK3fo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "qrift-da175.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "qrift-da175",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "qrift-da175.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "809757542242",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:809757542242:web:dab55209706bfac48f8e3b",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-F0CHR0VH80"
};

// Now it's always configured because we have actual fallback credentials
export const isFirebaseConfigured = true;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
