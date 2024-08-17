import { getApps, initializeApp, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY as string,
  authDomain: "askmypdf-b3b09.firebaseapp.com",
  projectId: "askmypdf-b3b09",
  storageBucket: "askmypdf-b3b09.appspot.com",
  messagingSenderId: "385100958095",
  appId: "1:385100958095:web:a3d4560f6a5c69864563fa",
  measurementId: "G-Y7NL1MWKHK",
};

// Initialize Firebase app if not already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);

export const storage = getStorage(app);
