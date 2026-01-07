
import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../constants';
import { MarkdownRenderer } from './MarkdownRenderer';

export const FAQPage: React.FC = () => {
    const { language } = useLanguage();
    const t = translations[language].faq;

    return (
        <div className="card-base p-6 sm:p-10 rounded-3xl space-y-8 animate-fade-in max-w-4xl mx-auto shadow-2xl border border-white/10">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold celestial-title">{t.title}</h2>
            </div>
            
            <div className="text-gray-300 leading-relaxed overflow-y-auto pr-2 max-h-[75vh]">
                {/* 
                    Utilizăm MarkdownRenderer pentru a reda blocul imuabil scientificFaq.
                    Acest bloc este tratat ca document final, respectând protocolul de freeze.
                */}
                <MarkdownRenderer 
                    content={t.scientificFaq} 
                    className="markdown-content" 
                />
            </div>

            <div className="pt-6 border-t border-white/10 text-center">
                <p className="text-xs text-gray-500 uppercase tracking-widest">
                    🏛️ Document Oficial AstroVerse - Secțiune Imuabilă
                </p>
            </div>
        </div>
    );
};
