import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../constants';
import { TOKEN_PACKAGES, formatPrice } from '../utils/monetization';
import { initiatePayment } from '../services/stripeService';

interface AstroStoreProps {
    onClose: () => void;
    onPurchaseToken?: (packId: 'SMALL' | 'MEDIUM' | 'LARGE') => void;
    currentBalance: number;
}

export const AstroStore: React.FC<AstroStoreProps> = ({ onClose, currentBalance }) => {
    const { language, currency } = useLanguage();
    const t = translations[language].store;
    const [isProcessing, setIsProcessing] = useState(false);

    const handleBuyToken = async (pack: typeof TOKEN_PACKAGES[0]) => {
        setIsProcessing(true);
        try {
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
            <div className="card-base w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 flex flex-col" onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-3xl font-bold celestial-title flex items-center gap-2">
                            {t.title}
                        </h2>
                        <p className="text-gray-400 mt-1">{t.subtitle}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                </div>

                {/* Balance Display */}
                <div className="flex flex-col sm:flex-row justify-center items-center bg-gray-900/50 rounded-xl p-4 mb-8 border border-white/5">
                    <div className="flex items-center gap-3">
                        <span className="text-gray-400 font-semibold">{t.tokenBalance}</span>
                        <span className="text-3xl font-bold text-amber-400">{currentBalance} 💎</span>
                    </div>
                </div>

                {/* Token Grid - The Only Payment Option */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {TOKEN_PACKAGES.map((pack) => {
                        const packKey = pack.id.toLowerCase() as 'small' | 'medium' | 'large';
                        const packInfo = t.tokens[packKey];

                        return (
                            <div key={pack.id} className="relative p-6 rounded-2xl border border-white/10 bg-black/40 flex flex-col h-full hover:border-amber-500/30 transition-all hover:-translate-y-2 group shadow-xl">
                                {pack.id === 'MEDIUM' && (
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10">
                                        Best Value
                                    </div>
                                )}
                                <h3 className="text-xl font-bold text-amber-100 mb-2">{packInfo.title}</h3>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-3xl font-bold text-white">{formatPrice(pack.price, currency)}</span>
                                </div>
                                <div className="flex items-center gap-2 mb-6">
                                    <span className="text-4xl filter drop-shadow-md group-hover:scale-110 transition-transform">💎</span>
                                    <span className="text-2xl font-bold text-amber-400">{pack.tokens}</span>
                                </div>
                                <button 
                                    onClick={() => handleBuyToken(pack)}
                                    disabled={isProcessing}
                                    className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg mt-auto disabled:opacity-50 transition-all active:scale-95"
                                >
                                    {isProcessing ? 'Processing...' : t.tokens.buyButton}
                                </button>
                            </div>
                        );
                    })}
                </div>
                
                <div className="mt-8 text-center bg-black/30 p-4 rounded-lg border border-white/5">
                    <p className="text-xs text-gray-500">
                        Secure Payment via Stripe. Tokens grant access to advanced AI astrological readings and deep archetypal analysis.
                    </p>
                </div>
            </div>
        </div>
    );
};