import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../constants';
import { useTTS } from '../contexts/TTSContext';

interface AudioPlayerProps {
    textToSpeak: string;
}

const AudioWaveIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path>
    </svg>
);
const StopIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 6h12v12H6z"></path>
    </svg>
);

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ textToSpeak }) => {
    const { language } = useLanguage();
    const t = translations[language];
    const tts = useTTS();

    // Determine the state for this specific audio player instance
    const isThisPlayerActive = tts.currentlyPlayingId === textToSpeak;
    const isLoading = isThisPlayerActive && tts.isLoading;
    const isPlaying = isThisPlayerActive && tts.isPlaying;

    const handlePlay = () => {
        if (textToSpeak) {
            tts.play(textToSpeak, textToSpeak);
        }
    };
    
    const handleStop = () => {
        tts.stop();
    };

    const buttonText = isLoading ? t.loading.substring(0, t.loading.length - 3) : (isPlaying ? t.reading.listeningButton : t.reading.listenButton);

    return (
        <div className="w-full">
            {isThisPlayerActive && tts.error && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded-lg text-sm text-center mb-2" role="alert">
                {t.error.audio}
              </div>
            )}
            <div className="flex gap-2">
                <button
                    onClick={handlePlay}
                    disabled={isPlaying || isLoading}
                    className="w-full button-primary flex items-center justify-center gap-2"
                >
                    <AudioWaveIcon className={`w-5 h-5 ${isPlaying && !isLoading ? 'animate-pulse' : ''}`} />
                    {buttonText}
                </button>
                {isPlaying && (
                     <button
                        onClick={handleStop}
                        className="button-primary flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 shadow-red-500/40 hover:shadow-red-500/60 p-3"
                        title="Stop"
                    >
                       <StopIcon className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
}
