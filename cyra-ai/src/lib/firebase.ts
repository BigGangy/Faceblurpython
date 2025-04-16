import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDhWZACNC7Y7deLIsHrtecnjWtF011whv4",
  authDomain: "cyra-ai-3c026.firebaseapp.com",
  projectId: "cyra-ai-3c026",
  storageBucket: "cyra-ai-3c026.firebasestorage.app",
  messagingSenderId: "26287707684",
  appId: "1:26287707684:web:c02509f836308ed87eaab1",
  measurementId: "G-QP48RXRC3V"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { app, auth, db, storage, analytics }; 