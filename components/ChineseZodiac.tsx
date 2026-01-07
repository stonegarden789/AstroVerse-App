
import React, { useState, useEffect, useMemo } from 'react';
import type { BirthData } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../constants';
import { getChineseZodiacInfo } from '../utils/chineseZodiac';
import { generateChineseForecast } from '../services/geminiService';
import { Spinner } from './Spinner';
import { MarkdownRenderer } from './MarkdownRenderer';
import { AudioPlayer } from './AudioPlayer';
import { ShareButton } from './ShareButton';

interface ChineseZodiacProps {
    birthData: BirthData;
}

const ChineseCard: React.FC<{ label: string, value: string | React.ReactNode, icon?: string, colorClass?: string }> = ({ label, value, icon, colorClass = "text-amber-400" }) => (
    <div className="bg-red-950/30 border border-red-500/20 p-4 rounded-xl flex flex-col items-center text-center hover:bg-red-900/40 transition-colors">
        {icon && <span className="text-2xl mb-2">{icon}</span>}
        <span className="text-xs text-amber-200/60 uppercase tracking-wider font-semibold mb-1">{label}</span>
        <span className={`text-lg font-bold font-serif ${colorClass}`}>{value}</span>
    </div>
);

export const ChineseZodiac: React.FC<ChineseZodiacProps> = ({ birthData }) => {
    const { language } = useLanguage();
    const t = translations[language].chineseZodiac;
    
    // Core data (calculated locally) for instant display
    const zodiacData = useMemo(() => {
        if (!birthData || !birthData.date) return null;
        return getChineseZodiacInfo(birthData.date, language);
    }, [birthData, language]);

    // Forecast state (fetched from AI)
    const [forecast, setForecast] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRevealForecast = async () => {
        if (!birthData.date) return;
        setIsLoading(true);
        setError(null);
        try {
            // Updated to pass the full birthData object for accurate 4-pillar calculation by AI
            const result = await generateChineseForecast(birthData, language);
            setForecast(result);
        } catch (err) {
            console.error(err);
            setError(translations[language].error.reading);
        } finally {
            setIsLoading(false);
        }
    };

    if (!zodiacData) return null;

    return (
        <div className="card-base p-6 sm:p-8 rounded-2xl space-y-8 animate-fade-in border-t-4 border-t-red-700">
            {/* Header / Identity */}
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold celestial-title text-amber-100">{t.title}</h2>
                <p className="text-amber-200/60 max-w-xl mx-auto">{t.subtitle}</p>
                
                <div className="relative inline-block mt-6">
                    <div className="absolute inset-0 bg-red-600 blur-2xl opacity-20 rounded-full"></div>
                    <div className="relative bg-gradient-to-br from-red-900 to-black border-2 border-amber-600/50 w-32 h-32 rounded-full flex items-center justify-center shadow-2xl mx-auto">
                        <span className="text-6xl filter drop-shadow-lg">
                            {/* Simple mapping for Emoji based on animal name (English key) */}
                            {zodiacData.animalEn === 'Rat' && '🐀'}
                            {zodiacData.animalEn === 'Ox' && '🐂'}
                            {zodiacData.animalEn === 'Tiger' && '🐅'}
                            {zodiacData.animalEn === 'Rabbit' && '🐇'}
                            {zodiacData.animalEn === 'Dragon' && '🐉'}
                            {zodiacData.animalEn === 'Snake' && '🐍'}
                            {zodiacData.animalEn === 'Horse' && '🐎'}
                            {zodiacData.animalEn === 'Goat' && '🐐'}
                            {zodiacData.animalEn === 'Monkey' && '🐒'}
                            {zodiacData.animalEn === 'Rooster' && '🐓'}
                            {zodiacData.animalEn === 'Dog' && '🐕'}
                            {zodiacData.animalEn === 'Pig' && '🐖'}
                        </span>
                    </div>
                </div>
                
                <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-red-400 font-serif mt-4">
                    {zodiacData.animal}
                </h3>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ChineseCard label={t.labels.element} value={zodiacData.element} icon="🔥" />
                <ChineseCard label={t.labels.polarity} value={zodiacData.yinYang} icon="☯️" />
                <ChineseCard label={t.labels.luckyNumbers} value={zodiacData.luckyNumbers.join(', ')} icon="🔢" />
                <ChineseCard label={t.labels.luckyColors} value={zodiacData.luckyColors.join(', ')} icon="🎨" />
            </div>

            {/* Description & Traits */}
            <div className="bg-black/40 p-6 rounded-xl border border-white/5">
                <p className="text-gray-300 italic text-center mb-6">"{zodiacData.description}"</p>
                <div className="flex flex-wrap justify-center gap-2">
                    {zodiacData.traits.map((trait, i) => (
                        <span key={i} className="px-3 py-1 bg-amber-900/30 text-amber-200 border border-amber-700/30 rounded-full text-sm">
                            {trait}
                        </span>
                    ))}
                </div>
            </div>

            {/* Compatibility */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-900/20 p-4 rounded-xl border border-green-500/20 text-center">
                    <h4 className="text-green-400 font-bold mb-2 uppercase tracking-wide text-sm">{t.labels.compatibility}</h4>
                    <p className="text-gray-300">{zodiacData.compatibility.join(' • ')}</p>
                </div>
                <div className="bg-red-900/20 p-4 rounded-xl border border-red-500/20 text-center">
                    <h4 className="text-red-400 font-bold mb-2 uppercase tracking-wide text-sm">{t.labels.incompatibility}</h4>
                    <p className="text-gray-300">{zodiacData.incompatibility.join(' • ')}</p>
                </div>
            </div>

            {/* AI Forecast Section */}
            <div className="pt-8 border-t border-red-900/30">
                {!forecast && !isLoading && (
                    <div className="text-center">
                        <button 
                            onClick={handleRevealForecast}
                            className="bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-amber-100 font-bold py-4 px-8 rounded-full shadow-lg shadow-red-900/40 transition-all transform hover:scale-105 uppercase tracking-wide text-sm sm:text-base"
                        >
                            {language === 'ro' ? 'Dezvăluie Profilul Complet (An, Lună, Zi, Oră)' : 'Reveal Complete Profile (Year, Month, Day, Hour)'}
                        </button>
                    </div>
                )}

                {isLoading && (
                    <div className="flex flex-col items-center justify-center h-40">
                        <Spinner />
                        <p className="mt-4 text-amber-200/70 animate-pulse font-serif">Consulting the Four Pillars of Destiny...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-900/50 text-red-200 p-4 rounded-lg text-center mt-4">
                        {error}
                    </div>
                )}

                {forecast && (
                    <div className="animate-fade-in space-y-6">
                        <div className="prose prose-invert max-w-none text-gray-300 bg-black/20 p-6 sm:p-8 rounded-xl border border-amber-900/30">
                            <MarkdownRenderer content={forecast} className="markdown-content" />
                        </div>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <AudioPlayer textToSpeak={forecast} />
                            <ShareButton shareText={forecast} shareTitle={`${t.title} - ${zodiacData.animal}`} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
