import React, { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../constants';
import { generateAcademyLesson } from '../services/geminiService';
import { LoadingScreen } from './LoadingScreen';
import { AudioPlayer } from './AudioPlayer';
import { MarkdownRenderer } from './MarkdownRenderer';
import { ShareButton } from './ShareButton';

interface LessonModalProps {
    lessonTitle: string;
    onClose: () => void;
}

export const LessonModal: React.FC<LessonModalProps> = ({ lessonTitle, onClose }) => {
    const { language } = useLanguage();
    const t = translations[language].astroAcademy.lessonModal;
    const [isLoading, setIsLoading] = useState(true);
    const [content, setContent] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLesson = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const lessonContent = await generateAcademyLesson(lessonTitle, language);
                setContent(lessonContent);
            } catch (err) {
                console.error("Failed to generate lesson:", err);
                setError(translations[language].error.reading);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLesson();
    }, [lessonTitle, language]);

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4 animate-fade-in" onClick={onClose}>
            <div 
                className="card-base w-full max-w-2xl h-[85vh] rounded-2xl p-4 sm:p-6 space-y-4 flex flex-col" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center border-b border-white/10 pb-4 flex-shrink-0">
                    <h2 className="text-2xl sm:text-3xl font-bold celestial-title">{t.title(lessonTitle)}</h2>
                </div>

                <div className="flex-grow overflow-y-auto pr-2">
                    {isLoading && <LoadingScreen />}
                    {error && (
                         <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-center" role="alert">
                            <strong className="font-bold">{translations[language].error.title}</strong>
                            <p>{error}</p>
                        </div>
                    )}
                    {!isLoading && content && (
                        <div className="text-gray-300 leading-relaxed">
                            <MarkdownRenderer content={content} className="markdown-content" />
                        </div>
                    )}
                </div>

                {!isLoading && content && (
                    <div className="flex flex-col sm:flex-row pt-4 gap-4 border-t border-white/10 flex-shrink-0">
                        <AudioPlayer textToSpeak={content} />
                        <ShareButton shareText={content} shareTitle={t.title(lessonTitle)} />
                    </div>
                )}
            </div>
        </div>
    );
};