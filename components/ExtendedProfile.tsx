
import React, { useState, useMemo } from 'react';
import type { BirthData } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../constants';
import { getVedicRashi, getCelticTreeSign, isOphiuchus } from '../utils/extendedSystems';
import { generateExtendedProfile } from '../services/geminiService';
import { Spinner } from './Spinner';
import { MarkdownRenderer } from './MarkdownRenderer';
import { AudioPlayer } from './AudioPlayer';
import { ShareButton } from './ShareButton';

interface ExtendedProfileProps {
    birthData: BirthData;
}

const SystemCard: React.FC<{ title: string, value: string, icon: string, colorClass: string }> = ({ title, value, icon, colorClass }) => (
    <div className={`p-6 rounded-2xl border ${colorClass} flex flex-col items-center text-center space-y-2 bg-black/20`}>
        <div className="text-4xl mb-2">{icon}</div>
        <h4 className="text-xs uppercase tracking-widest text-gray-400 font-bold">{title}</h4>
        <p className="text-xl font-serif font-bold text-white">{value}</p>
    </div>
);

export const ExtendedProfile: React.FC<ExtendedProfileProps> = ({ birthData }) => {
    const { language } = useLanguage();
    const t = translations[language].extendedProfile;

    // Calculate core data immediately
    const profileData = useMemo(() => {
        if (!birthData.date) return null;
        return {
            vedic: getVedicRashi(birthData.date),
            celtic: getCelticTreeSign(birthData.date),
            ophiuchus: isOphiuchus(birthData.date)
        };
    }, [birthData]);

    const [report, setReport] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!profileData) return;
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateExtendedProfile(
                birthData, 
                language, 
                profileData.vedic, 
                profileData.celtic, 
                profileData.ophiuchus
            );
            setReport(result);
        } catch (err) {
            console.error(err);
            setError(translations[language].error.reading);
        } finally {
            setIsLoading(false);
        }
    };

    if (!profileData) return null;

    return (
        <div className="card-base p-6 sm:p-8 rounded-2xl space-y-10 animate-fade-in border-t-4 border-t-indigo-600">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold celestial-title">{t.title}</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">{t.subtitle}</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SystemCard 
                    title={t.labels.vedicSign} 
                    value={profileData.vedic} 
                    icon="🕉️" 
                    colorClass="border-orange-500/30" 
                />
                <SystemCard 
                    title={t.labels.celticTree} 
                    value={profileData.celtic} 
                    icon="🌳" 
                    colorClass="border-green-500/30" 
                />
                <SystemCard 
                    title={t.labels.ophiuchusStatus} 
                    value={profileData.ophiuchus ? t.labels.isOphiuchus : t.labels.isNotOphiuchus} 
                    icon="🐍" 
                    colorClass="border-purple-500/30" 
                />
            </div>

            {/* Action Area */}
            <div className="text-center pt-4">
                {!report && !isLoading && (
                    <button 
                        onClick={handleGenerate} 
                        className="bg-gradient-to-r from-indigo-900 to-purple-900 hover:from-indigo-800 hover:to-purple-800 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-indigo-900/40 transition-all transform hover:scale-105 border border-white/10 uppercase tracking-wider text-sm"
                    >
                        {t.button}
                    </button>
                )}
                
                {isLoading && (
                    <div className="flex flex-col items-center justify-center h-40">
                        <Spinner />
                        <p className="mt-4 text-indigo-300 animate-pulse font-serif">Aligning Sidereal & Natural Cycles...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-900/50 text-red-200 p-4 rounded-lg mt-4">{error}</div>
                )}
            </div>

            {/* AI Report */}
            {report && (
                <div className="animate-fade-in space-y-6">
                    <div className="prose prose-invert max-w-none text-gray-300 bg-black/30 p-8 rounded-xl border border-indigo-500/20">
                        <MarkdownRenderer content={report} className="markdown-content" />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <AudioPlayer textToSpeak={report} />
                        <ShareButton shareText={report} shareTitle={t.title} />
                    </div>
                </div>
            )}
        </div>
    );
};
