import React, { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../constants';
import { generateLunarGuide } from '../services/geminiService';
import { MoonPhaseGraphic } from './MoonPhaseGraphic';
import { Spinner } from './Spinner';

export const LunarGuide: React.FC = () => {
    const { language } = useLanguage();
    const t = translations[language];
    const t_lg = t.lunarGuide;
    const [lunarData, setLunarData] = useState<{ phaseName: string; suggestion: string; illuminationPercentage: number; } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLunarData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await generateLunarGuide(language, t);
                setLunarData(data);
            } catch (err) {
                console.error("Failed to fetch lunar data:", err);
                setError(t.error.reading);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLunarData();
    }, [language, t]);

    return (
        <section id="lunar-guide-module" className="container mx-auto px-4 py-8">
            {/* Added max-w-xl to match BirthDataForm width */}
            <div className="max-w-xl mx-auto relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-xl shadow-2xl p-1">
                <div className="absolute inset-0 bg-violet-500/10 pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 gap-8">
                    
                    {isLoading ? (
                        <div className="w-full flex justify-center items-center h-40"><Spinner /></div>
                    ) : error ? (
                         <div className="w-full text-center text-red-400">{error}</div>
                    ) : lunarData ? (
                        <>
                            <div className="flex flex-col items-center md:items-start space-y-2 text-center md:text-left w-full">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-200 text-xs font-bold uppercase tracking-wider mb-2">
                                    <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                                    {t_lg.title}
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white font-garamond tracking-tight">
                                    {lunarData.phaseName}
                                </h2>
                                <p className="text-violet-300 font-mono text-sm">
                                    {t_lg.illumination(lunarData.illuminationPercentage)}
                                </p>
                                <div className="mt-4 pt-4 border-t border-white/10 w-full">
                                    <p className="text-gray-300 text-lg leading-relaxed">
                                        <span className="text-violet-400 font-bold mr-2">✦</span>
                                        {lunarData.suggestion}
                                    </p>
                                </div>
                            </div>

                            <div className="relative flex-shrink-0">
                                {/* Glow effect behind moon */}
                                <div className="absolute inset-0 bg-violet-500/20 blur-3xl rounded-full transform scale-150 animate-pulse-glow" />
                                <MoonPhaseGraphic phaseName={lunarData.phaseName} />
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
        </section>
    );
};