
/* -------------------------------------------------------------------------- */
/* FIREBASE FIRESTORE SERVICE (CLIENT LAYER)                                  */
/* -------------------------------------------------------------------------- */

import type { User, SavedReport } from '../types';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getApp } from 'firebase/app';

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- REAL-TIME TOKEN CONSUMPTION (SIMULATED OR CLOUD) ---

export const consumeUserTokens = async (userId: string, amount: number, featureName: string): Promise<boolean> => {
    // 1. Try Cloud Function first (if configured in production)
    try {
        const app = getApp();
        const functions = getFunctions(app);
        const consumeFn = httpsCallable<{amount: number, featureName: string}, {success: boolean}>(functions, 'consumeTokens');
        
        await consumeFn({ amount, featureName });
        return true;
    } catch (e: any) {
        // Fallback to Simulation if Cloud Function fails or not set up (Local Dev)
        console.warn("Cloud function failed or not available, falling back to local simulation.", e);
        
        // Check specific error code from Cloud Function
        if (e.code === 'failed-precondition' || e.message === 'INSUFFICIENT_FUNDS') {
            throw new Error("INSUFFICIENT_FUNDS");
        }

        return await simulateAtomicTransaction(userId, amount, featureName);
    }
};

// Local Simulation of Atomic Transaction
const simulateAtomicTransaction = async (userId: string, amount: number, featureName: string): Promise<boolean> => {
    await delay(300); // Latency
    const key = `astro_user_${userId}`;
    const usageKey = `astro_usage_${userId}`;
    
    try {
        const userDataStr = localStorage.getItem(key);
        if (!userDataStr) throw new Error("User not found");
        
        const user = JSON.parse(userDataStr) as User;
        
        // Critical Balance Check
        if (user.tokens < amount) {
            throw new Error("INSUFFICIENT_FUNDS");
        }
        
        // "Atomic" Update
        user.tokens -= amount;
        localStorage.setItem(key, JSON.stringify(user));
        
        // Log History
        const historyStr = localStorage.getItem(usageKey);
        const history = historyStr ? JSON.parse(historyStr) : [];
        history.push({
            action: featureName,
            cost: amount,
            timestamp: new Date().toISOString(),
            balanceAfter: user.tokens
        });
        localStorage.setItem(usageKey, JSON.stringify(history));
        
        return true;
    } catch (e: any) {
        if (e.message === "INSUFFICIENT_FUNDS") throw e;
        console.error("Simulation Error:", e);
        return false;
    }
};

// --- EXISTING PERSISTENCE METHODS ---

export const saveUserData = async (userId: string, data: Partial<User>) => {
  await delay(300);
  try {
    const key = `astro_user_${userId}`;
    const existingStr = localStorage.getItem(key);
    const existing = existingStr ? JSON.parse(existingStr) : {};
    const merged = { ...existing, ...data };
    localStorage.setItem(key, JSON.stringify(merged));
  } catch (e) {
    console.error("Error saving user data (Sim): ", e);
  }
};

export const getUserData = async (userId: string): Promise<User | null> => {
  await delay(300);
  try {
    const key = `astro_user_${userId}`;
    const dataStr = localStorage.getItem(key);
    return dataStr ? JSON.parse(dataStr) as User : null;
  } catch (e) {
    console.error("Error fetching user data (Sim):", e);
    return null;
  }
};

export const saveReport = async (userId: string, reportType: string, finalContent: string, tokensSpent: number) => {
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
  } catch (e) {
    console.error("Error saving report (Sim):", e);
  }
};

export const getSavedReports = async (userId: string): Promise<SavedReport[]> => {
    await delay(300);
    try {
        const key = `astro_reports_${userId}`;
        const existingStr = localStorage.getItem(key);
        return existingStr ? JSON.parse(existingStr) : [];
    } catch (e) {
        console.error("Error fetching reports (Sim):", e);
        return [];
    }
};
