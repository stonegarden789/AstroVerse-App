
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { translations, SUPPORTED_LANGUAGES, LANGUAGE_NAMES } from '../constants';
import type { User, AppView, BirthData, CognitiveProfile } from '../types';

interface HeaderProps {
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  isTransparentOnTop: boolean;
  onNavigate: (view: AppView) => void;
  birthData: BirthData | null;
  cognitiveProfile: CognitiveProfile | null;
  onOpenStore: () => void; // New Prop
}

const MenuItem: React.FC<{
    onClick: () => void;
    disabled?: boolean;
    children: React.ReactNode;
}> = ({ onClick, disabled, children }) => (
    <li>
        <button 
            onClick={onClick} 
            disabled={disabled} 
            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-violet-700/50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {children}
        </button>
    </li>
);

const MenuSectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="px-4 pt-2 pb-1 text-xs font-bold text-violet-400 uppercase tracking-wider">{children}</li>
);

export const Header: React.FC<HeaderProps> = ({ user, onSignIn, onSignOut, isTransparentOnTop, onNavigate, birthData, cognitiveProfile, onOpenStore }) => {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    if (isTransparentOnTop) {
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Set initial state
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isTransparentOnTop]);
  
  const handleMenuNavigate = (view: AppView) => {
    onNavigate(view);
    setIsMenuOpen(false);
  };

  const showSolidBg = !isTransparentOnTop || isScrolled;
  const hasBirthData = !!birthData;

  return (
    <header className={`py-4 border-b sticky top-0 z-50 transition-all duration-300 ${
        showSolidBg
        ? 'border-white/10 bg-[#100f2c]/80 backdrop-blur-sm'
        : 'border-transparent'
    }`}>
      <div className="container mx-auto max-w-5xl px-4 flex justify-between items-center">
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center justify-center w-10 h-10 text-gray-300 hover:text-white transition-colors duration-200 rounded-full hover:bg-white/10" title={t.header.menu.home}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            {isMenuOpen && (
                 <div className="absolute left-0 mt-2 w-72 card-base rounded-md shadow-lg z-20 max-h-[80vh] overflow-y-auto">
                    <ul className="py-1">
                        <MenuItem onClick={() => handleMenuNavigate(hasBirthData ? 'dashboard' : 'form')}>{t.header.menu.home}</MenuItem>
                        <hr className="border-t border-white/10 my-1" />
                        
                        <MenuSectionHeader>Core Readings</MenuSectionHeader>
                        <MenuItem onClick={() => handleMenuNavigate('natalChart')} disabled={!hasBirthData}>{t.header.menu.natalChart}</MenuItem>
                        <MenuItem onClick={() => handleMenuNavigate('extendedProfile')} disabled={!hasBirthData}>{t.header.menu.extendedProfile}</MenuItem>
                        <MenuItem onClick={() => handleMenuNavigate('chineseZodiac')} disabled={!hasBirthData}>{t.header.menu.chineseZodiac}</MenuItem>
                        <MenuItem onClick={() => handleMenuNavigate('energeticAlignment')} disabled={!hasBirthData}>{t.header.menu.energeticAlignment}</MenuItem>
                        <MenuItem onClick={() => handleMenuNavigate('bioRhythms')} disabled={!hasBirthData}>{t.header.menu.bioRhythms}</MenuItem>
                        <MenuItem onClick={() => handleMenuNavigate('askTheOracle')} disabled={!hasBirthData}>{t.header.menu.askTheOracle}</MenuItem>
                        <MenuItem onClick={() => handleMenuNavigate('dreamInterpretation')} disabled={!hasBirthData}>{t.header.menu.dreamInterpretation}</MenuItem>
                        <MenuItem onClick={() => handleMenuNavigate('astroView')}>{t.header.menu.astroView}</MenuItem>
                        <MenuItem onClick={() => handleMenuNavigate('vocationalReport')} disabled={!hasBirthData}>{t.header.menu.vocationalReport}</MenuItem>
                        <MenuItem onClick={() => handleMenuNavigate('integralNumerology')}>{t.header.menu.integralNumerology}</MenuItem>
                        <MenuItem onClick={() => handleMenuNavigate('tarotOracle')}>{t.header.menu.tarotOracle}</MenuItem>
                        
                        <hr className="border-t border-white/10 my-1" />
                        <MenuSectionHeader>Forecasts</MenuSectionHeader>
                        <MenuItem onClick={() => handleMenuNavigate('aiFuture')} disabled={!hasBirthData}>{t.header.menu.aiFuture}</MenuItem>
                        <MenuItem onClick={() => handleMenuNavigate('compatibility')} disabled={!hasBirthData}>{t.header.menu.compatibility}</MenuItem>
                        <MenuItem onClick={() => handleMenuNavigate('dailyZodiac')} disabled={!hasBirthData}>{t.header.menu.dailyZodiac}</MenuItem>
                        <MenuItem onClick={() => handleMenuNavigate('futureEvents')} disabled={!hasBirthData}>{t.header.menu.futureEvents}</MenuItem>
                        <MenuItem onClick={() => handleMenuNavigate('legendsMythology')} disabled={!hasBirthData}>{t.header.menu.legendsMythology}</MenuItem>
                        
                        <hr className="border-t border-white/10 my-1" />
                        <MenuSectionHeader>Psychometrics</MenuSectionHeader>
                        <MenuItem onClick={() => handleMenuNavigate('cognitiveProfiler')}>{t.header.menu.cognitiveProfiler}</MenuItem>
                        <MenuItem onClick={() => handleMenuNavigate('decisionMatrix')} disabled={!hasBirthData || !cognitiveProfile}>{t.header.menu.decisionMatrix}</MenuItem>
                        <MenuItem onClick={() => handleMenuNavigate('integralNeuroEmotiveProfile')}>{t.header.menu.integralNeuroEmotiveProfile}</MenuItem>

                        <hr className="border-t border-white/10 my-1" />
                        <MenuSectionHeader>Community & Learning</MenuSectionHeader>
                        <MenuItem onClick={() => handleMenuNavigate('astroAcademy')}>{t.header.menu.astroAcademy}</MenuItem>
                        <MenuItem onClick={() => handleMenuNavigate('astroConnections')}>{t.header.menu.astroConnections}</MenuItem>

                        <hr className="border-t border-white/10 my-1" />
                        <MenuSectionHeader>Resources</MenuSectionHeader>
                        <MenuItem onClick={() => handleMenuNavigate('aboutAstrology')}>{t.header.menu.aboutAstrology}</MenuItem>
                        <MenuItem onClick={() => handleMenuNavigate('cosmicCodex')}>{t.header.menu.cosmicCodex}</MenuItem>
                        <MenuItem onClick={() => handleMenuNavigate('aboutProject')}>{t.header.menu.aboutProject}</MenuItem>
                        <MenuItem onClick={() => handleMenuNavigate('faq')}>{t.header.menu.faq}</MenuItem>
                    </ul>
                 </div>
            )}
        </div>

        <div className="flex items-center space-x-3">
          {/* Wallet / Tokens Button */}
          {user && (
              <button 
                onClick={onOpenStore}
                className="flex items-center gap-2 px-3 h-10 rounded-full bg-black/40 border border-amber-500/30 text-amber-400 hover:bg-amber-900/20 transition-all font-bold text-sm"
                title="Wallet"
              >
                  <span>💎</span>
                  <span>{user.tokens}</span>
              </button>
          )}

          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center justify-center w-10 h-10 text-sm font-semibold text-gray-300 hover:text-white transition-colors duration-200 rounded-full hover:bg-white/10"
              title="Change Language"
            >
              <span>{LANGUAGE_NAMES[language]}</span>
            </button>
            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-20 card-base rounded-md shadow-lg z-20">
                <ul className="py-1">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <li key={lang}>
                      <button
                        onClick={() => {
                          setLanguage(lang);
                          setIsLangDropdownOpen(false);
                        }}
                        className={`w-full text-center px-4 py-2 text-sm rounded transition-colors ${
                          language === lang
                            ? 'bg-violet-600 text-white'
                            : 'text-gray-300 hover:bg-violet-700/50'
                        }`}
                      >
                        <span>{LANGUAGE_NAMES[lang]}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {user ? (
            <div className="flex items-center space-x-2 sm:space-x-3">
               <button 
                onClick={() => onNavigate('profile')} 
                className="flex items-center justify-center w-10 h-10 text-sm font-semibold text-gray-300 hover:text-white transition-colors duration-200 rounded-full hover:bg-white/10"
                title="Profile Settings"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.532 1.532 0 012.287-.947c1.372.836 2.942-.734-2.106-2.106a1.532 1.532 0 01-.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
              </button>
              <button onClick={onSignOut} className="button-primary px-4 py-2 text-sm">
                {t.header.signOut}
              </button>
            </div>
          ) : (
            <button onClick={onSignIn} className="button-primary px-4 py-2 text-sm">
              {t.header.signIn}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
