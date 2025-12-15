import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Language, TRANSLATIONS } from './locales';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof TRANSLATIONS.fr.ui) => string;
  tTense: (key: string) => string;
  tRule: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'app_language_pref';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize from localStorage or default to 'fr'
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      // Validate that the saved language is a valid key
      if (saved && (saved === 'fr' || saved === 'en' || saved === 'zh' || saved === 'ja')) {
        return saved as Language;
      }
    }
    return 'fr';
  });

  // Wrapper to update both state and localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  };

  const t = (key: keyof typeof TRANSLATIONS.fr.ui): string => {
    return TRANSLATIONS[language].ui[key] || TRANSLATIONS['fr'].ui[key];
  };

  const tTense = (tenseId: string): string => {
    // @ts-ignore
    return TRANSLATIONS[language].tenses[tenseId] || tenseId;
  };

  const tRule = (tenseId: string): string => {
    // @ts-ignore
    return TRANSLATIONS[language].rules[tenseId] || "";
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tTense, tRule }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};