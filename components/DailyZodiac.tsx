import React, { useState, useCallback, useEffect } from 'react';
import { generateDailyHoroscope } from '../services/geminiService';
import type { BirthData } from '../types';
import { LoadingScreen } from './LoadingScreen';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../constants';
import { AudioPlayer } from './AudioPlayer';
import { ShareButton } from './ShareButton';
import { MarkdownRenderer } from './MarkdownRenderer';

interface DailyZodiacProps {
    birthData: BirthData;
}

export const DailyZodiac: React.FC<DailyZodiacProps> = ({ birthData }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [reading, setReading] = useState<string>('');
    const { language } = useLanguage();
    const t = translations[language];

    const handleGenerate = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setReading('');
        try {
            const result = await generateDailyHoroscope(birthData, language);
            setReading(result);
        } catch (err) {
            setError(t.error.reading);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [birthData, language, t.error.reading]);

    // FIX: This effect now correctly re-generates the reading if the language is changed
    // after a reading has already been generated, ensuring the content matches the selected language.
    useEffect(() => {
        if (reading) {
            handleGenerate();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language]);

    return (
        <div className="card-base p-6 sm:p-8 rounded-2xl space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold celestial-title">{t.dashboard.dailyZodiac.title}</h2>
                <p className="text-gray-400 mt-2">{t.dashboard.dailyZodiac.description}</p>
            </div>
            
            {!reading && !isLoading && (
                 <div className="text-center pt-4">
                    <button
                        onClick={handleGenerate}
                        className="button-primary"
                    >
                        {t.dashboard.dailyZodiac.button}
                    </button>
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
                        <ShareButton shareText={reading} shareTitle={t.dashboard.dailyZodiac.title} />
                    </div>
                </div>
            )}
        </div>
    );
};