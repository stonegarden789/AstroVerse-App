
/* -------------------------------------------------------------------------- */
/*                        COST CONFIGURATION MAP                              */
/* -------------------------------------------------------------------------- */
/*
   ECONOMIC MODEL (PAY-AS-YOU-GO):
   $10.00 = 10,000 Tokens 
   Rate: $1 = 1,000 Tokens
   
   PROFIT MARGIN TARGET: >85%
*/

export const TOKEN_COSTS = {
    // Core AI Readings ($0.50 - $1.00 value)
    AI_FUTURE_FORECAST: 1000,      // $1.00
    VOCATIONAL_REPORT: 500,        // $0.50
    INTEGRAL_PROFILE: 700,         // $0.70
    NATAL_CHART_READING: 500,      // $0.50
    
    // Interactive ($0.20 - $0.30 value)
    ORACLE_CHAT_MESSAGE: 200,      // $0.20
    DREAM_INTERPRETATION: 300,     // $0.30
    
    // Visuals ($1.50 value - High Compute)
    GENERATE_CHART_VISUAL: 1500,   // $1.50
    
    // Community ($0.10 value)
    SEND_INTENT: 100,              // $0.10
    
    // Premium Unlocks
    FULL_CHINESE_FORECAST: 1000    // $1.00
};

export type FeatureKey = keyof typeof TOKEN_COSTS;
