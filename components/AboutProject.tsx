
import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../constants';
import { MarkdownRenderer } from './MarkdownRenderer';

export const AboutProject: React.FC = () => {
    const { language } = useLanguage();
    const t = translations[language].aboutProject;

    return (
        <div className="card-base p-6 sm:p-8 rounded-2xl space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold celestial-title">{t.title}</h2>
            </div>
            <div className="text-gray-300 leading-relaxed p-6 bg-black/20 rounded-lg animate-fade-in">
                <MarkdownRenderer content={t.placeholder} className="markdown-content" />
            </div>
        </div>
    );
};
