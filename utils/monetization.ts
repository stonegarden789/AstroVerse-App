
/* -------------------------------------------------------------------------- */
/*                     ASTROPROFIT PAY-AS-YOU-GO LOGIC                        */
/* -------------------------------------------------------------------------- */

import type { TokenPackage, Currency, ResourceCost, SubscriptionTier } from '../types';
import { CURRENCIES } from '../constants';

// --- DATA: TOKEN PACKAGES (Pay-As-You-Go Model) ---
// Base Rate: $1 = 1000 Tokens
export const TOKEN_PACKAGES: TokenPackage[] = [
    { 
        id: 'SMALL', 
        tokens: 10000, 
        price: 10.00, 
        profitMargin: 0.85, 
        label: 'Starters Pack (10k)' 
    },
    { 
        id: 'MEDIUM', 
        tokens: 22000, 
        price: 20.00, 
        profitMargin: 0.88, 
        label: 'Cosmic Voyager (22k)',
        bonus: '10% BONUS' 
    }, 
    { 
        id: 'LARGE', 
        tokens: 50000, 
        price: 40.00, 
        profitMargin: 0.90, 
        label: 'Infinity Bundle (50k)',
        bonus: '25% BONUS' 
    } 
];

// Deprecated in Pay-As-You-Go model, keeping empty array or minimal for type safety if referenced elsewhere
export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [];

// --- DATA: RESOURCE COSTS (Updated Scale) ---
// Cost Scale: ~500 tokens = $0.50
export const RESOURCE_COSTS: Record<string, ResourceCost> = {
    'Natal_Chart_Reading': { tokens: 500, cogs: 0.05, logType: 'LOG_REPORT_AI' },
    'AI_Future_Forecast': { tokens: 1000, cogs: 0.15, logType: 'LOG_REPORT_AI' },
    'Vocational_Report': { tokens: 500, cogs: 0.05, logType: 'LOG_REPORT_CAREER' },
    'Integral_Profile': { tokens: 700, cogs: 0.10, logType: 'LOG_REPORT_PSYCHO' },
    'Oracle_Chat': { tokens: 200, cogs: 0.02, logType: 'LOG_CHAT_AI' },
    'Dream_Interpretation': { tokens: 300, cogs: 0.04, logType: 'LOG_REPORT_AI' },
    'Generate_Chart_Visual': { tokens: 1500, cogs: 0.20, logType: 'LOG_REPORT_AI' }, // Image Gen is expensive
    'Send_Intent': { tokens: 100, cogs: 0.00, logType: 'LOG_CHAT_AI' },
    'Full_Chinese_Forecast': { tokens: 1000, cogs: 0.10, logType: 'LOG_REPORT_AI' }
};

// --- UTILITIES ---

export const formatPrice = (priceInUSD: number, currency: Currency): string => {
    const currencyData = CURRENCIES[currency];
    const converted = priceInUSD * currencyData.rate;
    if (currency === 'RON') return `${converted.toFixed(0)} ${currencyData.symbol}`;
    return `${currencyData.symbol}${converted.toFixed(2)}`;
};

// --- LOGIC ENGINE ---

export class MonetizationManager {
    static calculateMargin(revenue: number, cogs: number): number {
        if (revenue === 0) return 0;
        return (revenue - cogs) / revenue;
    }

    static purchaseTokens(userId: string, packId: 'SMALL' | 'MEDIUM' | 'LARGE'): { tokensAdded: number, cost: number } {
        const pack = TOKEN_PACKAGES.find(p => p.id === packId);
        if (!pack) throw new Error("Invalid Package");
        return { tokensAdded: pack.tokens, cost: pack.price };
    }

    // Deprecated but kept for compatibility
    static subscribe(userId: string, tierId: string): { tokensAdded: number, cost: number } {
        return { tokensAdded: 0, cost: 0 };
    }
}
