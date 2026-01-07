import React, { useState, useEffect } from 'react';
import { generateCosmicCodex } from '../services/geminiService';
import { LoadingScreen } from './LoadingScreen';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../constants';
import { AudioPlayer } from './AudioPlayer';
import { ShareButton } from './ShareButton';
import { MarkdownRenderer } from './MarkdownRenderer';

export const CosmicCodex: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [content, setContent] = useState<string>('');
    const { language } = useLanguage();
    const t = translations[language];
    
    useEffect(() => {
        const fetchContent = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const result = await generateCosmicCodex(language);
                setContent(result);
            } catch (err) {
                setError(t.error.reading);
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchContent();
    }, [language, t.error.reading]);


    return (
        <div className="card-base p-6 sm:p-8 rounded-2xl space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold celestial-title">{t.cosmicCodex.title}</h2>
                <p className="text-gray-400 mt-2">{t.cosmicCodex.subtitle}</p>
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

            {content && (
                <div className="animate-fade-in space-y-4">
                    <div className="text-gray-300 leading-relaxed p-4 bg-black/20 rounded-lg">
                        <MarkdownRenderer content={content} className="markdown-content" />
                    </div>
                     <div className="flex flex-col sm:flex-row pt-4 gap-4">
                        <AudioPlayer textToSpeak={content} />
                        <ShareButton shareText={content} shareTitle={t.cosmicCodex.title} />
                    </div>
                </div>
            )}
        </div>
    );
};