
/* -------------------------------------------------------------------------- */
/*                     ASTROPROFIT ULTRA-SAFE V2.0 LOGIC                      */
/* -------------------------------------------------------------------------- */

import type { TransactionLog, TransactionType, ResourceCost, SubscriptionTier, TokenPackage, Currency } from '../types';
import { CURRENCIES } from '../constants';

// --- CONSTANTS: FINANCIAL RULES ---
const COGS_TOKEN = 0.30; // Cost per token in USD
// MIN_MARGIN = 0.70; // 70% Gross Margin rule

// --- DATA: RESOURCE COSTS (COST OF GOODS) ---
export const RESOURCE_COSTS: Record<string, ResourceCost> = {
    'AI_Future_Forecast': { tokens: 10, cogs: 3.00, logType: 'LOG_REPORT_AI' },
    'Integral_Neuro_Emotive_Profile': { tokens: 7, cogs: 2.10, logType: 'LOG_REPORT_PSYCHO' },
    'Vocational_Report': { tokens: 5, cogs: 1.50, logType: 'LOG_REPORT_CAREER' },
    'Ask_the_Oracle': { tokens: 2, cogs: 0.60, logType: 'LOG_CHAT_AI' },
    // Free features have 0 cost
    'Daily_Zodiac': { tokens: 0, cogs: 0, logType: 'LOG_REPORT_AI' } 
};

// --- DATA: TOKEN PACKAGES ---
export const TOKEN_PACKAGES: TokenPackage[] = [
    { id: 'SMALL', tokens: 10, price: 12.00, profitMargin: 0.75, label: 'Starter Pack' },
    { id: 'MEDIUM', tokens: 30, price: 29.99, profitMargin: 0.70, label: 'Cosmic Voyager' },
    { id: 'LARGE', tokens: 50, price: 49.99, profitMargin: 0.70, label: 'Infinity Bundle' }
];

// --- DATA: SUBSCRIPTION TIERS ---
export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
    { id: 'EXPLORER', name: 'Astro Explorer', price: 9.99, tokensIncluded: 5, discountOnExtras: 0.10, cogs: 1.50 },
    { id: 'INSIGHT', name: 'Astro-Insight', price: 19.99, tokensIncluded: 15, discountOnExtras: 0.15, cogs: 4.50 },
    { id: 'PRIME', name: 'Celestial Prime', price: 29.99, tokensIncluded: 30, discountOnExtras: 0.20, cogs: 9.00 }
];

// --- UTILITIES ---

export const formatPrice = (priceInUSD: number, currency: Currency): string => {
    const currencyData = CURRENCIES[currency];
    const converted = priceInUSD * currencyData.rate;
    // Format: $10.00 or 46.00 RON or €9.20
    if (currency === 'RON') return `${converted.toFixed(2)} ${currencyData.symbol}`;
    return `${currencyData.symbol}${converted.toFixed(2)}`;
};

// --- LOGIC ENGINE ---

export class MonetizationManager {
    
    // Calculates profit margin: (Revenue - COGS) / Revenue
    static calculateMargin(revenue: number, cogs: number): number {
        if (revenue === 0) return 0;
        return (revenue - cogs) / revenue;
    }

    // Creates a standardized log entry
    static createLogEntry(
        userId: string, 
        type: TransactionType, 
        tokensConsumed: number, 
        tokensAdded: number, 
        revenue: number, 
        cogs: number
    ): TransactionLog {
        const margin = this.calculateMargin(revenue, cogs);
        
        const log: TransactionLog = {
            id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            timestamp: new Date().toISOString(),
            userId,
            transactionType: type,
            tokensConsumed,
            tokensAdded,
            cogsCostUsd: cogs,
            revenueUsd: revenue,
            profitMargin: parseFloat(margin.toFixed(2))
        };

        // In a real app, send 'log' to backend analytics here
        console.log("💰 [AstroProfit Log]:", log);
        
        return log;
    }

    // --- CONSUMPTION LOGIC ---
    // Returns { success: boolean, cost: number, log?: TransactionLog }
    static checkAndLogConsumption(userId: string, userTokens: number, featureName: string): { success: boolean, cost: number, log?: TransactionLog } {
        const resource = RESOURCE_COSTS[featureName];
        
        if (!resource) {
            console.warn(`Feature ${featureName} not found in pricing. Assuming free.`);
            return { success: true, cost: 0 };
        }

        if (userTokens >= resource.tokens) {
            // Success: Deduct and Log Cost
            const log = this.createLogEntry(
                userId, 
                resource.logType, 
                resource.tokens, 
                0, 
                0, // No immediate revenue on consumption (revenue is at purchase)
                resource.cogs
            );
            return { success: true, cost: resource.tokens, log };
        } else {
            // Failure: Insufficient Funds
            const log = this.createLogEntry(userId, 'LOG_FAIL_CONSUMPTION', 0, 0, 0, 0);
            return { success: false, cost: resource.tokens, log };
        }
    }

    // --- PURCHASE LOGIC ---
    static purchaseTokens(userId: string, packageId: 'SMALL' | 'MEDIUM' | 'LARGE'): { tokensAdded: number, log: TransactionLog } {
        const pack = TOKEN_PACKAGES.find(p => p.id === packageId);
        if (!pack) throw new Error("Invalid Package");

        // COGS for purchase is 0 (digital good), but we track liability. 
        // Real COGS happens at consumption. 
        // However, for margin calculation of the SALE, we can estimate future COGS or treat as 100% margin here 
        // and deduct at usage. 
        // The prompt asks to calculate margin for the purchase based on rules. 
        // Rule: Token Price > COGS / (1 - Margin).
        // Let's log the revenue.
        
        const log = this.createLogEntry(
            userId,
            'LOG_TOKEN_PURCHASE',
            0,
            pack.tokens,
            pack.price,
            0 // Cost incurred at consumption
        );

        return { tokensAdded: pack.tokens, log };
    }

    static subscribe(userId: string, tierId: 'EXPLORER' | 'INSIGHT' | 'PRIME'): { tokensAdded: number, log: TransactionLog } {
        const tier = SUBSCRIPTION_TIERS.find(t => t.id === tierId);
        if (!tier) throw new Error("Invalid Tier");

        const log = this.createLogEntry(
            userId,
            'LOG_SUBSCRIPTION',
            0,
            tier.tokensIncluded,
            tier.price,
            tier.cogs // We attribute the cost of included tokens immediately or progressively. Let's do immediate for safety.
        );

        return { tokensAdded: tier.tokensIncluded, log };
    }
}
