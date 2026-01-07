
import React, { useState, useCallback, useEffect } from 'react';
import { generateFutureReading } from '../services/geminiService';
import type { BirthData, User } from '../types';
import { LoadingScreen } from './LoadingScreen';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../constants';
import { AudioPlayer } from './AudioPlayer';
import { ShareButton } from './ShareButton';
import { MarkdownRenderer } from './MarkdownRenderer';
import { MonetizationManager, RESOURCE_COSTS } from '../utils/monetization';
import { saveReport } from '../utils/firebase';

interface AIFutureProps {
    birthData: BirthData;
    user: User | null;
    onConsumeTokens: (amount: number, feature: string) => boolean; // Prop to handle consumption
    onOpenStore: () => void;
}

export const AIFuture: React.FC<AIFutureProps> = ({ birthData, user, onConsumeTokens, onOpenStore }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [reading, setReading] = useState<string>('');
    const { language, reportLanguage } = useLanguage();
    const t = translations[language];
    const forecastYear = new Date().getFullYear() + 1;
    
    // Feature Cost Logic
    const FEATURE_NAME = 'AI_Future_Forecast';
    const cost = RESOURCE_COSTS[FEATURE_NAME].tokens;

    const handleGenerate = useCallback(async () => {
        // 1. Check User Login
        if (!user) {
            alert("Please sign in to access premium AI forecasts.");
            return;
        }

        // 2. Check & Consume Tokens
        const success = onConsumeTokens(cost, FEATURE_NAME);
        if (!success) {
            onOpenStore(); // Open the modal if failed
            return;
        }

        // 3. Proceed if successful
        setIsLoading(true);
        setError(null);
        setReading('');
        try {
            // Use reportLanguage instead of UI language for the generation
            const result = await generateFutureReading(birthData, reportLanguage, forecastYear);
            setReading(result);
            
            // 4. SAVE THE REPORT TO PERSISTENCE (FIRESTORE)
            await saveReport(user.email, FEATURE_NAME, result, cost);

        } catch (err) {
            setError(t.error.reading);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [birthData, reportLanguage, t.error.reading, forecastYear, user, onConsumeTokens, onOpenStore, cost, FEATURE_NAME]);

    useEffect(() => {
        if (reading) {
            // handleGenerate(); // Removed auto-regen on lang switch to prevent double billing/loop
        }
    }, [language, reading]);


    return (
        <div className="card-base p-6 sm:p-8 rounded-2xl space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold celestial-title">{t.aiFuture.title(forecastYear)}</h2>
                <p className="text-gray-400 mt-2">{t.aiFuture.description}</p>
            </div>
            
            {!reading && !isLoading && (
                 <div className="text-center pt-8">
                    <div className="mb-6 p-4 bg-black/30 rounded-xl border border-white/5 inline-block">
                        <p className="text-sm text-gray-300 mb-2">{t.store.premiumUnlock.title}</p>
                        <p className="text-xs text-gray-500 mb-4">{t.store.premiumUnlock.desc}</p>
                        <button
                            onClick={handleGenerate}
                            className="button-primary flex items-center gap-2 mx-auto bg-gradient-to-r from-violet-700 to-fuchsia-700 hover:from-violet-600 hover:to-fuchsia-600"
                        >
                            <span>🔐</span> {t.store.premiumUnlock.unlockButton} {cost} 💎
                        </button>
                    </div>
                 </div>
            )}

            {isLoading && (
                <div className="flex flex-col items-center justify-center h-32">
                    <LoadingScreen />
                </div>
            )}

            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-center" role="alert">
                <strong className="font-bold">{t.error.title}</strong>
                <p>{error}</p>
              </div>
            )}

            {reading && (
                <div className="animate-fade-in space-y-4">
                    <div className="text-gray-300 leading-relaxed p-4 bg-black/20 rounded-lg">
                        <MarkdownRenderer content={reading} className="markdown-content" />
                    </div>
                    <div className="flex flex-col sm:flex-row pt-4 gap-4">
                        <AudioPlayer textToSpeak={reading} />
                        <ShareButton shareText={reading} shareTitle={t.aiFuture.title(forecastYear)} />
                    </div>
                </div>
            )}
        </div>
    );
};
