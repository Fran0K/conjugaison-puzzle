import React, { useState, useRef, useImperativeHandle } from 'react';
import { Settings, BookText, Info, ChevronDown } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { Language } from '../locales';
import { SUPPORTED_LANGUAGES } from '../constants';

interface GameHeaderProps {
  onOpenSettings: () => void;
  onOpenGrammar: () => void;
  onOpenAbout: () => void;
  settingRef?: React.RefObject<HTMLButtonElement | null>;
  langBtnRef?: React.RefObject<HTMLDivElement | null>;
  grammarRef?: React.RefObject<HTMLButtonElement | null>;
  AboutRef?: React.RefObject<HTMLButtonElement | null>;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ 
  onOpenSettings, 
  onOpenGrammar, 
  onOpenAbout,
  settingRef,
  grammarRef,
  langBtnRef,
  AboutRef, 
}) => {
  const { t, language, setLanguage } = useLanguage();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const selectLanguage = (lang: Language) => {
    setLanguage(lang);
    setIsLangMenuOpen(false);
  };

  return (
    <>
      {isLangMenuOpen && (
        <div className="fixed inset-0 z-20 cursor-default" onClick={() => setIsLangMenuOpen(false)} />
      )}

      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="mx-auto px-4 sm:px-8 h-14 sm:h-16 flex items-center justify-between">
          
          {/* Logo Area */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <img 
                src="/img/logo_desk.png" 
                alt={t('title')} 
                className="hidden sm:block h-10 w-auto object-contain" 
              />
              <img 
                src="/img/logo_mobi.png" 
                alt={t('title')} 
                className="block sm:hidden h-8 w-auto object-contain" 
              />
            </div>
            <h1 className="text-xl font-display font-bold text-french-dark hidden sm:block">
              {t('title')}
            </h1>
          </div>
          
          {/* Controls Area */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Tense Selector */}
            <button 
            ref={settingRef}
            onClick={onOpenSettings} 
            className="p-2 text-gray-400 hover:text-french-blue hover:bg-blue-50 rounded-full transition-colors">
              <Settings className="w-6 h-6" />
            </button>
            {/* Gammar teaching Selector */}
            <button 
            ref = {grammarRef}
            onClick={onOpenGrammar} className="p-2 text-gray-400 hover:text-french-blue hover:bg-blue-50 rounded-full transition-colors">
              <BookText className="w-6 h-6" />
            </button>
            
             {/* Language Selector */}
            <div className="relative" ref={langBtnRef} >
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="p-2 rounded-full hover:bg-blue-50 transition-colors flex items-center justify-center"
                title={currentLangObj.label}
              >
                <span className="text-2xl leading-none">{currentLangObj.flag}</span>
              </button>

              {isLangMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1 overflow-hidden z-40 animate-in fade-in zoom-in-95 duration-200">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => selectLanguage(lang.code)}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors ${
                        language === lang.code ? 'bg-blue-50 text-french-blue' : 'text-gray-700'
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* About Page Selector */}
             <button 
             ref={AboutRef}
             onClick={onOpenAbout} 
             className="p-2 text-gray-400 hover:text-french-blue hover:bg-blue-50 rounded-full transition-colors">
               <Info className="w-6 h-6" />
             </button>
          </div>
        </div>
      </header>
    </>
  );
};
