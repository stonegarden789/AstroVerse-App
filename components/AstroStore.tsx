
import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../constants';
import { TOKEN_PACKAGES, formatPrice } from '../utils/monetization';
import { initiatePayment } from '../services/stripeService';

interface AstroStoreProps {
    onClose: () => void;
    onPurchaseToken?: (packId: 'SMALL' | 'MEDIUM' | 'LARGE') => void;
    onSubscribe?: (tierId: string) => void; // Kept for compatibility but unused
    currentBalance: number;
}

export const AstroStore: React.FC<AstroStoreProps> = ({ onClose, currentBalance, onPurchaseToken }) => {
    const { language, currency } = useLanguage();
    const t = translations[language].store;
    const [isProcessing, setIsProcessing] = useState(false);

    const handleBuyToken = async (pack: typeof TOKEN_PACKAGES[0]) => {
        setIsProcessing(true);
        try {
            // Check if we have a handler for immediate simulation (App.tsx logic)
            if (onPurchaseToken) {
                // Simulate async payment delay
                setTimeout(() => {
                    onPurchaseToken(pack.id);
                    setIsProcessing(false);
                }, 1000);
                return;
            }

            await initiatePayment({
                productId: pack.id,
                type: 'TOKEN',
                price: pack.price,
                productName: pack.label,
                currency: currency
            });
        } catch (e) {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 animate-fade-in" onClick={onClose}>
            <div className="card-base w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-10 flex flex-col relative" onClick={e => e.stopPropagation()}>
                
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white text-3xl leading-none">&times;</button>

                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold celestial-title mb-2">
                        {t.title}
                    </h2>
                    <p className="text-gray-400 max-w-xl mx-auto">{t.subtitle}</p>
                </div>

                {/* Balance Display */}
                <div className="flex justify-center mb-10">
                    <div className="flex items-center gap-4 bg-gray-900/80 px-8 py-4 rounded-full border border-violet-500/30 shadow-lg shadow-violet-900/20">
                        <span className="text-gray-300 font-semibold uppercase tracking-wider text-sm">{t.tokenBalance}</span>
                        <span className="text-3xl font-bold text-amber-400 font-mono">{currentBalance.toLocaleString()} 💎</span>
                    </div>
                </div>

                {/* Pay-As-You-Go Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {TOKEN_PACKAGES.map((pack) => {
                        const isBestValue = pack.id === 'LARGE';
                        const isMostPopular = pack.id === 'MEDIUM';

                        return (
                            <div 
                                key={pack.id} 
                                className={`relative p-8 rounded-3xl flex flex-col h-full transition-all hover:-translate-y-2 group shadow-xl ${
                                    isBestValue 
                                        ? 'bg-gradient-to-b from-amber-900/40 to-black border-2 border-amber-500/50' 
                                        : 'bg-black/40 border border-white/10 hover:border-violet-500/40'
                                }`}
                            >
                                {isMostPopular && (
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-violet-600 text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-wider z-10 shadow-lg">
                                        Most Popular
                                    </div>
                                )}
                                {isBestValue && (
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-500 text-black text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-wider z-10 shadow-lg animate-pulse">
                                        Best Value
                                    </div>
                                )}

                                <div className="text-center mb-6">
                                    <h3 className={`text-2xl font-bold mb-2 ${isBestValue ? 'text-amber-100' : 'text-gray-100'}`}>{pack.label}</h3>
                                    {pack.bonus && (
                                        <p className="text-green-400 font-bold text-sm uppercase tracking-wide">{pack.bonus}</p>
                                    )}
                                </div>

                                <div className="text-center mb-8">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <span className="text-5xl drop-shadow-md">💎</span>
                                    </div>
                                    <span className={`text-4xl font-bold ${isBestValue ? 'text-amber-400' : 'text-white'}`}>
                                        {pack.tokens.toLocaleString()}
                                    </span>
                                </div>

                                <div className="mt-auto">
                                    <button 
                                        onClick={() => handleBuyToken(pack)}
                                        disabled={isProcessing}
                                        className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all active:scale-95 disabled:opacity-50 ${
                                            isBestValue 
                                            ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white'
                                            : 'bg-gradient-to-r from-violet-700 to-fuchsia-700 hover:from-violet-600 hover:to-fuchsia-600 text-white'
                                        }`}
                                    >
                                        {isProcessing ? 'Processing...' : `${t.tokens.buyButton} ${formatPrice(pack.price, currency)}`}
                                    </button>
                                    <p className="text-center text-xs text-gray-500 mt-3">
                                        One-time purchase. No subscription.
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                <div className="mt-10 text-center">
                    <p className="text-xs text-gray-500 max-w-2xl mx-auto">
                        Tokens are used for premium AI reports (approx. 500-1000 tokens per detailed report). 
                        Your balance never expires. Secure payment via Stripe.
                    </p>
                </div>
            </div>
        </div>
    );
};
