import React, { useState, useEffect } from 'react';
import { initiatePayment } from '../services/stripeService';
import { getEnvVar } from '../utils/getEnvVar';

/**
 * Debug Component for Stripe Integration.
 * Visually confirms if the environment variable is readable in the current runtime (Vite vs Node/AI Studio).
 */
export const StripeDebug: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [keyStatus, setKeyStatus] = useState<string>('Checking...');
    const [hasKey, setHasKey] = useState(false);

    // Check key on mount
    useEffect(() => {
        const key = getEnvVar('VITE_STRIPE_PUBLIC_KEY');

        if (key && key.length > 0 && !key.includes('REPLACE_ME')) {
            // Show first 8 chars for verification without exposing full key
            setKeyStatus(`✅ Key Loaded (${key.substring(0, 8)}...)`);
            setHasKey(true);
        } else {
            setKeyStatus('❌ MISSING KEY (.env)');
            setHasKey(false);
        }
    }, []);

    const handleTestPayment = async () => {
        setIsLoading(true);
        try {
            await initiatePayment({
                productId: 'TEST_DEBUG_PACK',
                type: 'TOKEN',
                price: 1.00,
                productName: '🔍 Stripe Debug Test',
                currency: 'usd'
            });
        } catch (error) {
            console.error("Debug payment failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Render nothing if not desired in production, or keep hidden/small
    // if (!hasKey) return null; 

    return (
        <div className="fixed bottom-4 right-4 z-50 p-4 bg-gray-900 border border-violet-500 rounded-lg shadow-xl max-w-xs animate-fade-in">
            <h3 className="text-violet-400 font-bold mb-2 text-sm uppercase tracking-wider">🛠️ Stripe Debugger</h3>
            
            <div className={`mb-3 text-xs font-mono p-2 rounded ${hasKey ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                {keyStatus}
            </div>

            <button 
                onClick={handleTestPayment}
                disabled={isLoading || !hasKey}
                className={`w-full py-2 px-3 rounded font-bold text-xs text-white transition-colors ${
                    isLoading 
                    ? 'bg-gray-600 cursor-wait' 
                    : 'bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
            >
                {isLoading ? 'Initiating...' : 'Test Pay $1.00'}
            </button>
            
            <p className="mt-2 text-[9px] text-gray-500 text-center">
                Use card 4242... for success.
            </p>
        </div>
    );
};