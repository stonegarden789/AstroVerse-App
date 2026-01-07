
/* -------------------------------------------------------------------------- */
/* FIREBASE FIRESTORE SERVICE (SIMULATION LAYER)                              */
/* -------------------------------------------------------------------------- */
/* 
   NOTE: The Real Firebase implementation is commented out below.
   Currently using LocalStorage to prevent "Missing or insufficient permissions" 
   errors because the app uses Mock Auth (AuthModal.tsx) which does not 
   create a valid Firebase Auth session required for Firestore writes.
*/

import type { User, SavedReport } from '../types';

// --- MOCK / LOCAL STORAGE IMPLEMENTATION ---

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Salveaza datele astrale ale utilizatorului (Simulation)
export const saveUserData = async (userId: string, data: Partial<User>) => {
  await delay(300); // Simulate network
  try {
    const key = `astro_user_${userId}`;
    const existingStr = localStorage.getItem(key);
    const existing = existingStr ? JSON.parse(existingStr) : {};
    
    // Merge existing data with new data
    const merged = { ...existing, ...data };
    
    localStorage.setItem(key, JSON.stringify(merged));
    console.log("[Firebase Sim] Date astrale salvate cu succes pentru ID:", userId);
  } catch (e) {
    console.error("Eroare la salvarea datelor (Sim): ", e);
    throw new Error("Nu am putut salva datele utilizatorului (Local Storage).");
  }
};

// Preluarea datelor astrale ale utilizatorului la logare (Simulation)
export const getUserData = async (userId: string): Promise<User | null> => {
  await delay(300);
  try {
    const key = `astro_user_${userId}`;
    const dataStr = localStorage.getItem(key);
    
    if (dataStr) {
      return JSON.parse(dataStr) as User;
    } else {
      return null;
    }
  } catch (e) {
    console.error("Eroare la preluarea datelor (Sim):", e);
    return null;
  }
};

// Salvarea unui raport AI generat (Simulation)
export const saveReport = async (
  userId: string, 
  reportType: string, 
  finalContent: string, 
  tokensSpent: number
) => {
  await delay(300);
  try {
    const key = `astro_reports_${userId}`;
    const existingStr = localStorage.getItem(key);
    const reports: SavedReport[] = existingStr ? JSON.parse(existingStr) : [];
    
    const newReport: SavedReport = {
        reportId: `rep_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        userId,
        reportType,
        content: finalContent,
        generationDate: new Date().toISOString(),
        costTokens: tokensSpent
    };

    reports.push(newReport);
    localStorage.setItem(key, JSON.stringify(reports));
    
    console.log(`[Firebase Sim] Raportul ${reportType} a fost salvat permanent.`);
  } catch (e) {
    console.error("Eroare la salvarea raportului (Sim):", e);
    throw new Error("Nu am putut salva raportul AI (Local Storage).");
  }
};

// Preluarea tuturor rapoartelor salvate ale unui utilizator (Simulation)
export const getSavedReports = async (userId: string): Promise<SavedReport[]> => {
    await delay(300);
    try {
        const key = `astro_reports_${userId}`;
        const existingStr = localStorage.getItem(key);
        return existingStr ? JSON.parse(existingStr) : [];
    } catch (e) {
        console.error("Eroare la preluarea rapoartelor salvate (Sim):", e);
        return [];
    }
};


/* -------------------------------------------------------------------------- */
/* REAL FIREBASE IMPLEMENTATION (UNCOMMENT WHEN AUTH IS CONFIGURED)           */
/* -------------------------------------------------------------------------- */

/*
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore'; 

const firebaseConfig = {
  apiKey: "AIzaSyAgfslmxYM0auVo2e2sU2jeB3l7eeNy8cY",
  authDomain: "astroverse-9daa2.firebaseapp.com",
  projectId: "astroverse-9daa2",
  storageBucket: "astroverse-9daa2.firebasestorage.app",
  messagingSenderId: "385241837152",
  appId: "1:385241837152:web:77ce8994975f92961e1d05",
  measurementId: "G-QZSH147HG8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app); 

export const saveUserData = async (userId: string, data: Partial<User>) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, data, { merge: true }); 
    console.log("Date astrale salvate cu succes pentru ID:", userId);
  } catch (e) {
    console.error("Eroare la salvarea datelor: ", e);
    throw new Error("Nu am putut salva datele utilizatorului pe Firebase.");
  }
};

export const getUserData = async (userId: string): Promise<User | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      return docSnap.data() as User;
    } else {
      return null;
    }
  } catch (e) {
    console.error("Eroare la preluarea datelor:", e);
    return null;
  }
};

export const saveReport = async (
  userId: string, 
  reportType: string, 
  finalContent: string, 
  tokensSpent: number
) => {
  try {
    await addDoc(collection(db, 'reports'), {
      userId: userId,
      reportType: reportType,
      content: finalContent, 
      generationDate: new Date().toISOString(),
      costTokens: tokensSpent 
    } as Omit<SavedReport, 'reportId'>);
    console.log(`Raportul ${reportType} a fost salvat permanent in Firestore.`);
  } catch (e) {
    console.error("Eroare la salvarea raportului:", e);
    throw new Error("Nu am putut salva raportul AI in baza de date.");
  }
};

export const getSavedReports = async (userId: string): Promise<SavedReport[]> => {
    try {
        const reportsRef = collection(db, 'reports');
        const q = query(reportsRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        
        const reports: SavedReport[] = [];
        querySnapshot.forEach((doc) => {
            reports.push({ id: doc.id, ...doc.data() } as SavedReport);
        });
        
        return reports;
    } catch (e) {
        console.error("Eroare la preluarea rapoartelor salvate:", e);
        return [];
    }
};
*/
