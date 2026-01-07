import React, { useState, useEffect } from 'react';
import { Spinner } from './Spinner';
import { useLanguage } from '../hooks/useLanguage';
import { translations, ASTRO_QUOTES } from '../constants';

export const LoadingScreen: React.FC = () => {
    const { language } = useLanguage();
    const t = translations[language];
    const [quote, setQuote] = useState('');

    useEffect(() => {
        // Pick a random quote on component mount
        setQuote(ASTRO_QUOTES[Math.floor(Math.random() * ASTRO_QUOTES.length)]);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-64">
            <Spinner />
            <p className="mt-4 text-lg text-violet-300 animate-pulse">{t.loading}</p>
            {quote && <p className="mt-2 text-sm text-gray-400 italic text-center">"{quote}"</p>}
        </div>
    );
};
