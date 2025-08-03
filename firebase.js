// Firebase configuration for PackPalGo GoSplit feature
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase configuration object
// Note: Replace with your actual Firebase config when deploying
const firebaseConfig = {
  apiKey: "AIzaSyDY0qB0-QYVvLkCpJM3wvMmXZPmiaDrwhI",
  authDomain: "packpalgo-d522b.firebaseapp.com",
  projectId: "packpalgo-d522b",
  storageBucket: "packpalgo-d522b.firebasestorage.app",
  messagingSenderId: "205227784028",
  appId: "1:205227784028:web:1ac405aee52c3ae859f399",
  measurementId: "G-G8QJ0KKPG2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
