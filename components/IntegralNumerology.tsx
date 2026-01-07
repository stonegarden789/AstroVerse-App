import React, { useState, useCallback, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../constants';
import { generateNumerologyReport } from '../services/geminiService';
import { LoadingScreen } from './LoadingScreen';
import { AudioPlayer } from './AudioPlayer';
import { ShareButton } from './ShareButton';
import { MarkdownRenderer } from './MarkdownRenderer';

export const IntegralNumerology: React.FC = () => {
    const { language } = useLanguage();
    const t = translations[language].integralNumerology;
    
    const [fullName, setFullName] = useState('');
    const [dob, setDob] = useState('');
    const [report, setReport] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState({ fullName: false, dob: false });

    const handleGenerate = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setReport(null);

        try {
            const result = await generateNumerologyReport(fullName, dob, language);
            setReport(result);
        } catch (err) {
            setError(translations[language].error.reading);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [fullName, dob, language]);
    
    useEffect(() => {
        if (report) {
            handleGenerate();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = { fullName: !fullName.trim(), dob: !dob };
        setErrors(newErrors);
        if (!newErrors.fullName && !newErrors.dob) {
            handleGenerate();
        }
    };
    
    const handleStartOver = () => {
        setFullName('');
        setDob('');
        setReport(null);
        setError(null);
        setErrors({ fullName: false, dob: false });
    };

    return (
        <div className="card-base p-6 sm:p-8 rounded-2xl space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold celestial-title">{t.title}</h2>
                {!report && <p className="text-gray-400 mt-2 max-w-2xl mx-auto">{t.subtitle}</p>}
            </div>
            
            {isLoading && <LoadingScreen />}

            {!isLoading && error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-center" role="alert">
                    <strong className="font-bold">{translations[language].error.title}</strong>
                    <p>{error}</p>
                </div>
            )}

            {!isLoading && !report && (
                <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto animate-fade-in" noValidate>
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">{t.form.fullNameLabel}</label>
                        <input
                            type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required
                            placeholder={t.form.fullNamePlaceholder}
                            className={`w-full bg-gray-900/50 border ${errors.fullName ? 'border-red-500' : 'border-violet-800/50'} text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-violet-400 focus:border-violet-400 outline-none transition-all placeholder-gray-500`}
                        />
                         {errors.fullName && <p className="text-red-400 text-xs mt-1">{translations[language].form.required}</p>}
                    </div>
                    <div>
                        <label htmlFor="dob" className="block text-sm font-medium text-gray-300 mb-2">{t.form.dobLabel}</label>
                        <input
                            type="date" id="dob" value={dob} onChange={(e) => setDob(e.target.value)} required
                            className={`w-full bg-gray-900/50 border ${errors.dob ? 'border-red-500' : 'border-violet-800/50'} text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-violet-400 focus:border-violet-400 outline-none transition-all`}
                        />
                         {errors.dob && <p className="text-red-400 text-xs mt-1">{translations[language].form.required}</p>}
                    </div>
                    <button type="submit" className="w-full button-primary py-3">{t.form.button}</button>
                </form>
            )}

            {!isLoading && report && (
                <div className="animate-fade-in space-y-6">
                     <div className="text-center">
                        <h3 className="text-2xl font-bold celestial-title">{t.reportTitle}</h3>
                    </div>
                    <div className="text-gray-300 leading-relaxed p-4 bg-black/20 rounded-lg">
                        <MarkdownRenderer content={report} className="markdown-content" />
                    </div>
                     <div className="flex flex-col sm:flex-row pt-4 gap-4">
                        <AudioPlayer textToSpeak={report} />
                        <ShareButton shareText={report} shareTitle={t.reportTitle} />
                    </div>
                     <div className="text-center pt-4">
                        <button onClick={handleStartOver} className="button-primary bg-gray-600 hover:bg-gray-700 shadow-gray-500/40 hover:shadow-gray-500/60">
                            {translations[language].reading.newReadingButton}
                        </button>
                     </div>
                </div>
            )}
        </div>
    );
};
