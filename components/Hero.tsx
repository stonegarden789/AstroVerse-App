
import React from 'react';
import { BirthDataForm } from './BirthDataForm';
import { ZodiacRotator } from './ZodiacRotator';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../constants';
import type { BirthData, User } from '../types';
import { LunarGuide } from './LunarGuide';

interface HeroProps {
  onSubmit: (data: BirthData, shouldSave: boolean) => void;
  user: User | null;
}

export const Hero: React.FC<HeroProps> = ({ onSubmit, user }) => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <>
      {/* Header Banner Section */}
      <header
        className="relative flex flex-col items-center justify-center p-4 pt-[65px] min-h-[500px] overflow-hidden -mt-[65px] fade-to-bottom"
      >
        <div 
            className="absolute inset-0 bg-cover bg-center animate-slow-zoom"
            style={{ backgroundImage: "url('https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" }}
        ></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center flex flex-col items-center justify-center flex-grow py-12">
          <ZodiacRotator />
          <div className="max-w-xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-bold celestial-title mt-4 uppercase font-garamond tracking-tighter">
              {t.hero.title}
            </h1>
          </div>
          {t.hero.quote && (
            <p className="text-sm md:text-base italic text-violet-200 mt-6 max-w-xl mx-auto">
              "{t.hero.quote}"
            </p>
          )}
        </div>
      </header>
      
      {/* Form Section */}
      <main className="pt-16 pb-12 sm:pt-24 sm:pb-16">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-8">
             <p className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto">
              {t.hero.subtitle}
            </p>
          </div>
          <div className="w-full max-w-xl mx-auto relative z-20">
            <BirthDataForm onSubmit={onSubmit} initialData={user} />
          </div>
        </div>
      </main>

      {/* Quote above Lunar Guide */}
      <div className="w-full max-w-xl mx-auto px-4 mb-6 text-center">
        <p className="text-violet-200/80 italic font-garamond text-lg leading-relaxed">
          "{t.hero.lunarIntroQuote}"
        </p>
      </div>

      <LunarGuide />

      {/* Footer */}
      <footer className="w-full text-center py-6">
        <p className="text-xs text-gray-400">© 2025 AstroVerse. {t.footer.rights}</p>
      </footer>
    </>
  );
};
