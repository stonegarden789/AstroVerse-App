import React, { useState, useCallback, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../constants';
import { generateDecisionMatrixReport } from '../services/geminiService';
import { LoadingScreen } from './LoadingScreen';
import { AudioPlayer } from './AudioPlayer';
import { ShareButton } from './ShareButton';
import { MarkdownRenderer } from './MarkdownRenderer';
import type { CognitiveProfile } from '../types';

interface DecisionMatrixProps {
    cognitiveProfile: CognitiveProfile | null; // Allow null
}

export const DecisionMatrix: React.FC<DecisionMatrixProps> = ({ cognitiveProfile }) => {
    const { language } = useLanguage();
    const t = translations[language].decisionMatrix;

    const [decision, setDecision] = useState('');
    const [report, setReport] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!decision.trim() || !cognitiveProfile) return;
        setIsLoading(true);
        setError(null);
        setReport('');
        try {
            const result = await generateDecisionMatrixReport(cognitiveProfile, decision, language);
            setReport(result);
        } catch (err) {
            setError(translations[language].error.reading);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [decision, cognitiveProfile, language]);
    
    useEffect(() => {
        if (report) {
            handleGenerate();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language]);


    const handleStartOver = () => {
        setDecision('');
        setReport(null);
        setError(null);
    }

    if (!cognitiveProfile) {
        return (
            <div className="card-base p-6 sm:p-8 rounded-2xl text-center">
                 <h2 className="text-3xl font-bold celestial-title">{t.title}</h2>
                 <p className="text-gray-300 mt-4">{translations[language].dashboard.decisionMatrix.disabledTooltip}</p>
            </div>
        )
    }

    return (
        <div className="card-base p-6 sm:p-8 rounded-2xl space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold celestial-title">{t.title}</h2>
            </div>

            {isLoading && <LoadingScreen />}

            {!isLoading && error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-center" role="alert">
                    <strong className="font-bold">{translations[language].error.title}</strong>
                    <p>{error}</p>
                </div>
            )}
            
            {!isLoading && !report && (
                 <div className="space-y-4 animate-fade-in">
                    <div>
                        <label htmlFor="decision" className="block text-lg font-medium text-gray-300 mb-2">{t.step1.title}</label>
                        <textarea
                            id="decision"
                            rows={3}
                            value={decision}
                            onChange={(e) => setDecision(e.target.value)}
                            placeholder={t.step1.placeholder}
                            className="w-full bg-gray-900/50 border border-violet-800/50 text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-violet-400 focus:border-violet-400 outline-none transition-all placeholder-gray-500"
                        />
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={!decision.trim()}
                        className="w-full button-primary"
                    >
                        {t.button}
                    </button>
                </div>
            )}
            
            {!isLoading && report && (
                <div className="animate-fade-in space-y-6">
                     <div className="text-center">
                        <h3 className="text-2xl font-bold celestial-title">{t.resultTitle}</h3>
                    </div>
                    <div className="text-gray-300 leading-relaxed p-4 bg-black/20 rounded-lg">
                        <MarkdownRenderer content={report} className="markdown-content" />
                    </div>
                     <div className="flex flex-col sm:flex-row pt-4 gap-4">
                        <AudioPlayer textToSpeak={report} />
                        <ShareButton shareText={report} shareTitle={t.resultTitle} />
                    </div>
                     <div className="text-center pt-4">
                        <button onClick={handleStartOver} className="button-primary bg-gray-600 hover:bg-gray-700 shadow-gray-500/40 hover:shadow-gray-500/60">
                            {t.startOver}
                        </button>
                     </div>
                </div>
            )}
        </div>
    );
};
