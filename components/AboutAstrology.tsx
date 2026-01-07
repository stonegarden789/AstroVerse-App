
import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../constants';
import { AudioPlayer } from './AudioPlayer';
import { ShareButton } from './ShareButton';
import { MarkdownRenderer } from './MarkdownRenderer';

export const AboutAstrology: React.FC = () => {
    const { language } = useLanguage();
    const t = translations[language].aboutAstrology;

    return (
        <div className="card-base p-6 sm:p-8 rounded-2xl space-y-6 animate-fade-in">
            <div className="text-center">
                <h2 className="text-3xl font-bold celestial-title">{t.title}</h2>
            </div>

            <div className="space-y-4">
                <div className="text-gray-300 leading-relaxed p-6 bg-black/20 rounded-lg">
                    <MarkdownRenderer content={t.content} className="markdown-content" />
                </div>
                <div className="flex flex-col sm:flex-row pt-4 gap-4">
                    <AudioPlayer textToSpeak={t.content} />
                    <ShareButton shareText={t.content} shareTitle={t.title} />
                </div>
            </div>
        </div>
    );
};
