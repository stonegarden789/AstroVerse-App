import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../constants';

interface ShareModalProps {
  onClose: () => void;
  shareText: string;
  shareTitle: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ onClose, shareText, shareTitle }) => {
    const { language } = useLanguage();
    const t = translations[language];
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        // Fallback for older browsers
        const fallbackCopy = () => {
            const textArea = document.createElement("textarea");
            textArea.value = shareText;
            textArea.style.position = "fixed"; 
            textArea.style.top = "-9999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                }
            } catch (err) {
                console.error('Fallback copy failed', err);
            }
            document.body.removeChild(textArea);
        };

        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            }).catch(err => {
                console.error('Async copy failed, falling back.', err);
                fallbackCopy();
            });
        } else {
            fallbackCopy();
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="card-base w-full max-w-md rounded-2xl p-6 space-y-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold celestial-title">{shareTitle}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
                </div>
                
                <textarea
                    readOnly
                    className="w-full h-48 bg-gray-900/50 border border-violet-800/50 text-white rounded-lg p-3 text-sm resize-none"
                    value={shareText}
                />

                <div>
                    <button
                        onClick={handleCopy}
                        className="flex items-center justify-center gap-3 w-full p-3 rounded-lg text-white font-semibold transition-colors bg-violet-600 hover:bg-violet-700"
                    >
                        {isCopied ? t.featurePage.shareModal.copied : t.featurePage.shareModal.copy}
                    </button>
                </div>
            </div>
        </div>
    );
};