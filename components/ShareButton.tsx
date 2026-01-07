import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../constants';
import { ShareModal } from './ShareModal';

interface ShareButtonProps {
  shareText: string;
  shareTitle?: string;
}

const ShareIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z" />
    </svg>
);

export const ShareButton: React.FC<ShareButtonProps> = ({ shareText, shareTitle }) => {
    const { language } = useLanguage();
    const t = translations[language];
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleShare = () => {
        if (!shareText) return;
        // Always open the custom modal for a consistent, bug-free experience.
        setIsModalOpen(true);
    };

    return (
        <>
            <button
                onClick={handleShare}
                disabled={!shareText}
                className="w-full button-primary flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/40 hover:shadow-emerald-500/60 disabled:opacity-50 disabled:cursor-not-allowed"
                title={t.featurePage.share.button}
            >
                <ShareIcon className="w-5 h-5" />
                {t.featurePage.share.button}
            </button>
            {isModalOpen && (
                <ShareModal 
                    onClose={() => setIsModalOpen(false)}
                    shareText={shareText}
                    shareTitle={shareTitle || t.featurePage.share.title}
                />
            )}
        </>
    );
};