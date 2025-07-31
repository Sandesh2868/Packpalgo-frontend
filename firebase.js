// Firebase configuration for PackPalGo GoSplit feature
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase configuration object
// Note: Replace with your actual Firebase config when deploying
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "packpalgo-demo.firebaseapp.com",
  projectId: "packpalgo-demo",
  storageBucket: "packpalgo-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:demo123456789"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;