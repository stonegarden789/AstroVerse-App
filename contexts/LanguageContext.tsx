
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import type { Language, Currency } from '../types';

export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  reportLanguage: Language;
  setReportLanguage: (language: Language) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [reportLanguage, setReportLanguage] = useState<Language>('en');
  const [currency, setCurrency] = useState<Currency>('USD');

  // Sync report language with app language if user hasn't explicitly set it differently
  // For simplicity in this version, we'll auto-sync report language when main language changes
  useEffect(() => {
      setReportLanguage(language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ 
        language, setLanguage,
        reportLanguage, setReportLanguage,
        currency, setCurrency
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
