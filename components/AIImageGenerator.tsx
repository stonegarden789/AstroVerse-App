import React, { useState, useCallback } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../constants';
import { generateImageWithPrompt } from '../services/geminiService';
import { Spinner } from './Spinner';

type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";

export const AIImageGenerator: React.FC = () => {
    const { language } = useLanguage();
    const t = translations[language].aiImageGenerator;

    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!prompt.trim()) return;

        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);

        try {
            const resultBase64 = await generateImageWithPrompt(prompt, aspectRatio);
            setGeneratedImage(`data:image/jpeg;base64,${resultBase64}`);
        } catch (err) {
            setError(translations[language].error.reading);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [prompt, aspectRatio, language]);

    const handleStartOver = () => {
        setPrompt('');
        setAspectRatio('1:1');
        setGeneratedImage(null);
        setError(null);
    };

    return (
        <div className="card-base p-6 sm:p-8 rounded-2xl space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold celestial-title">{t.title}</h2>
                <p className="text-gray-400 mt-2">{t.subtitle}</p>
            </div>
            
            {isLoading && (
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-violet-500/30 rounded-xl bg-black/20">
                    <Spinner />
                    <p className="mt-4 text-violet-300 font-bold animate-pulse">✨ {t.generating} ✨</p>
                    <p className="text-xs text-gray-400 mt-2">Creating high-fidelity image...</p>
                </div>
            )}

            {!isLoading && error && (
                <div className="text-center animate-fade-in">
                    <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg" role="alert">
                        <strong className="font-bold">{translations[language].error.title}</strong>
                        <p>{error}</p>
                    </div>
                    <button onClick={handleStartOver} className="button-primary mt-6">{t.startOver}</button>
                </div>
            )}
            
            {!isLoading && !generatedImage && (
                 <div className="space-y-6 animate-fade-in max-w-xl mx-auto">
                     <div>
                        <label htmlFor="generate-prompt" className="block text-sm font-medium text-gray-300 mb-2">{t.promptLabel}</label>
                        <textarea
                            id="generate-prompt" rows={4} value={prompt} onChange={(e) => setPrompt(e.target.value)}
                            placeholder={t.promptPlaceholder}
                            className="w-full bg-gray-900/50 border border-violet-800/50 text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-violet-400 outline-none"
                        />
                     </div>
                     <div>
                        <label htmlFor="aspect-ratio" className="block text-sm font-medium text-gray-300 mb-2">{t.aspectRatioLabel}</label>
                        <select
                            id="aspect-ratio"
                            value={aspectRatio}
                            onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                            className="w-full bg-gray-900/50 border border-violet-800/50 text-white rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-violet-400 outline-none"
                        >
                            <option value="1:1">1:1 (Square)</option>
                            <option value="3:4">3:4 (Portrait)</option>
                            <option value="4:3">4:3 (Landscape)</option>
                            <option value="9:16">9:16 (Tall)</option>
                            <option value="16:9">16:9 (Wide)</option>
                        </select>
                     </div>
                     <button onClick={handleGenerate} disabled={!prompt.trim()} className="w-full button-primary flex items-center justify-center gap-2">
                        {t.generateButton}
                     </button>
                 </div>
            )}
            
            {!isLoading && generatedImage && (
                 <div className="space-y-6 animate-fade-in text-center">
                    <div className="relative inline-block group">
                        <img src={generatedImage} alt="Generated by AI" className="rounded-lg max-w-full mx-auto shadow-2xl shadow-violet-500/20" />
                        <div className="absolute inset-0 border-4 border-violet-500/20 rounded-lg pointer-events-none"></div>
                    </div>
                    <div className="pt-4">
                         <button onClick={handleStartOver} className="button-primary bg-gray-600 hover:bg-gray-700">{t.startOver}</button>
                    </div>
                 </div>
            )}
        </div>
    );
};