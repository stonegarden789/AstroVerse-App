import React, { useState, useCallback, useEffect } from 'react';
import { generateCompatibilityReading } from '../services/geminiService';
import type { BirthData } from '../types';
import { BirthDataForm } from './BirthDataForm';
import { LoadingScreen } from './LoadingScreen';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../constants';
import { AudioPlayer } from './AudioPlayer';
import { ShareButton } from './ShareButton';
import { InfoPill } from './InfoPill';
import { MarkdownRenderer } from './MarkdownRenderer';

interface CompatibilityProps {
    birthData: BirthData;
}

export const Compatibility: React.FC<CompatibilityProps> = ({ birthData: personAData }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [reading, setReading] = useState<string>('');
    const [personBData, setPersonBData] = useState<BirthData | null>(null);
    const { language } = useLanguage();
    const t = translations[language];

    const handleFormSubmit = useCallback(async (data: BirthData) => {
        setPersonBData(data);
        setIsLoading(true);
        setError(null);
        setReading('');
        try {
            const result = await generateCompatibilityReading(personAData, data, language);
            setReading(result);
        } catch (err) {
            setError(t.error.reading);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [personAData, language, t.error.reading]);

    // FIX: This effect now correctly re-generates the reading if the language is changed
    // after a reading has already been generated, ensuring the content matches the selected language.
    useEffect(() => {
        if (reading && personBData) {
            handleFormSubmit(personBData);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language]);


    return (
        <div className="card-base p-6 sm:p-8 rounded-2xl space-y-6">
            <div className="text-center">
                 <h2 className="text-3xl font-bold celestial-title">{t.dashboard.compatibility.title}</h2>
                <p className="text-gray-400 mt-2">{t.dashboard.compatibility.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-black/20 rounded-lg">
                <div className="space-y-4">
                    <h3 className="font-bold text-lg text-center text-gray-200 mb-2">{t.dashboard.compatibility.person1}</h3>
                     <div className="flex flex-wrap justify-center gap-2">
                        <InfoPill label={t.reading.date} value={personAData.date} size="sm" />
                        <InfoPill label={t.reading.time} value={personAData.time} size="sm" />
                        <InfoPill label={t.reading.location} value={personAData.location} size="sm" />
                    </div>
                </div>
                 <div className="space-y-4">
                    <h3 className="font-bold text-lg text-center text-gray-200 mb-2">{t.dashboard.compatibility.person2}</h3>
                    <BirthDataForm onSubmit={handleFormSubmit} />
                </div>
            </div>

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
                        <ShareButton shareText={reading} shareTitle={t.dashboard.compatibility.title} />
                    </div>
                </div>
            )}
        </div>
    );
};