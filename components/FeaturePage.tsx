import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../constants';

interface FeaturePageProps {
  onBack: () => void;
  children: React.ReactNode;
}

export const FeaturePage: React.FC<FeaturePageProps> = ({ onBack, children }) => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="bg-white/5 hover:bg-white/20 text-white font-bold py-2 px-4 rounded-full transition-colors text-sm"
        >
          &larr; {t.featurePage.backButton}
        </button>
      </div>
      {children}
    </div>
  );
};