import React, { useState, useCallback, useEffect } from 'react';
import { generateDreamInterpretation } from '../services/geminiService';
import type { BirthData } from '../types';
import { LoadingScreen } from './LoadingScreen';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../constants';
import { AudioPlayer } from './AudioPlayer';
import { ShareButton } from './ShareButton';
import { MarkdownRenderer } from './MarkdownRenderer';

interface DreamInterpretationProps {
    birthData: BirthData;
}

export const DreamInterpretation: React.FC<DreamInterpretationProps> = ({ birthData }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [interpretation, setInterpretation] = useState<string>('');
    const [dream, setDream] = useState('');
    const { language } = useLanguage();
    const t = translations[language];

    const handleGenerate = useCallback(async () => {
        if (!dream.trim()) return;
        setIsLoading(true);
        setError(null);
        setInterpretation('');
        try {
            const result = await generateDreamInterpretation(dream, birthData, language);
            setInterpretation(result);
        } catch (err) {
            setError(t.error.reading);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [dream, birthData, language, t.error.reading]);

    // FIX: This effect now correctly re-generates the interpretation if the language is changed
    // after an interpretation has already been generated, ensuring the content matches the selected language.
    useEffect(() => {
        if (interpretation) {
            handleGenerate();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language]);


    return (
        <div className="card-base p-6 sm:p-8 rounded-2xl space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold celestial-title">{t.dreamInterpretation.title}</h2>
                <p className="text-gray-400 mt-2">{t.dreamInterpretation.subtitle}</p>
            </div>

            {!interpretation && (
                <div className="space-y-4">
                    <textarea
                        rows={5}
                        value={dream}
                        onChange={(e) => setDream(e.target.value)}
                        placeholder={t.dreamInterpretation.placeholder}
                        className="w-full bg-gray-900/50 border border-violet-800/50 text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-violet-400 focus:border-violet-400 outline-none transition-all placeholder-gray-500"
                    ></textarea>
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !dream.trim()}
                        className="w-full button-primary"
                    >
                        {t.dreamInterpretation.button}
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

            {interpretation && (
                <div className="animate-fade-in space-y-4">
                    <div className="text-gray-300 leading-relaxed p-4 bg-black/20 rounded-lg">
                        <MarkdownRenderer content={interpretation} className="markdown-content" />
                    </div>
                    <div className="flex flex-col sm:flex-row pt-4 gap-4">
                        <AudioPlayer textToSpeak={interpretation} />
                        <ShareButton shareText={interpretation} shareTitle={t.dreamInterpretation.title} />
                    </div>
                </div>
            )}
        </div>
    );
};