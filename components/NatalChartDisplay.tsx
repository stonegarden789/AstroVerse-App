import React, { useState, useEffect, useCallback } from 'react';
import type { BirthData, User, Comment } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../constants';
import { FeedbackSection } from './FeedbackSection';
import { LoadingScreen } from './LoadingScreen';
import { generateAstrologyReading } from '../services/geminiService';
import { AudioPlayer } from './AudioPlayer';
import { ShareButton } from './ShareButton';
import { InfoPill } from './InfoPill';
import { MarkdownRenderer } from './MarkdownRenderer';

interface NatalChartDisplayProps {
  birthData: BirthData;
  user: User | null;
  comments: Comment[];
  onAddComment: (comment: { rating: number; text:string }) => void;
  onSignIn: () => void;
}

export const NatalChartDisplay: React.FC<NatalChartDisplayProps> = ({ birthData, user, comments, onAddComment, onSignIn }) => {
  const { language } = useLanguage();
  const t = translations[language];
  const [reading, setReading] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReading = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
        const result = await generateAstrologyReading(birthData, language, t);
        setReading(result);
    } catch (err) {
        setError(t.error.reading);
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  }, [birthData, language, t]);

  useEffect(() => {
    fetchReading();
  }, [fetchReading]);


  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
     return (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-center" role="alert">
            <strong className="font-bold">{t.error.title}</strong>
            <p>{error}</p>
        </div>
     );
  }

  return (
    <div className="space-y-12 animate-fade-in">
        <div className="card-base p-6 sm:p-8 rounded-2xl space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold celestial-title">{t.reading.title}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <InfoPill label={t.reading.date} value={birthData.date} />
                <InfoPill label={t.reading.time} value={birthData.time} />
                <InfoPill label={t.reading.location} value={birthData.location} />
            </div>

            <div className="text-gray-300 leading-relaxed p-4 bg-black/20 rounded-lg">
                <MarkdownRenderer content={reading} className="markdown-content" />
            </div>
            
            {reading && (
                <div className="flex flex-col sm:flex-row pt-4 gap-4">
                    <AudioPlayer textToSpeak={reading} />
                    <ShareButton shareText={reading} shareTitle={t.reading.title} />
                </div>
            )}
        </div>
        <FeedbackSection
            user={user}
            comments={comments}
            // FIX: Corrected typo from onAdd-comment to onAddComment
            onAddComment={onAddComment}
            onSignIn={onSignIn}
        />
    </div>
  );
};