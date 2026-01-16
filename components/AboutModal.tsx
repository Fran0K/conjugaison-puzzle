
import React from 'react';
import { PuzzlePiece, XCircle, Heart, DiscordLogo, EnvelopeSimple, Browser, LinkedinLogo, CursorClick, Plus, CheckCircle, ArrowCounterClockwise,Eyes,Coffee, X } from "@phosphor-icons/react";
import { useLanguage } from '../LanguageContext';


interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestartTutorial?: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, onRestartTutorial }) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 + pt-[calc(env(safe-area-inset-top)+16px)]  bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header - Fixed */}
        <div className="px-4 py-3 md:px-6 md:py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
          <h2 className="text-xl font-display font-bold text-french-dark">
            {t('about')}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X weight="bold" className="w-6 h-6 text-black-500" />
          </button>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-3 md:px-6 md:py-4 ">
           <div className="flex flex-col items-center text-center mb-8">
              {/* Logo / Icon */}
              <img 
                src="/img/logo_about.png" 
                alt="ConjuPuzzle" 
                className="w-24 h-24 mb-4 object-contain "/>
              <h1 className="text-2xl font-bold text-gray-800">ConjuPuzzle</h1>
              <p className="text-xs font-mono text-gray-400 mt-1">1.0.1</p>
              <p className="text-sm text-gray-600 mt-4 leading-relaxed max-w-sm">
                {t('about_desc')}
              </p>
           </div>

           {/* How To Play Section */}
           <div className="mb-8">
             <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-french-dark ">
                {t('how_to_title')}
              </h3>

              {onRestartTutorial && (
                <button 
                  onClick={() => {
                    onClose();
                    onRestartTutorial();
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold transition-all text-xs"
                >
                  <ArrowCounterClockwise className="w-4 h-4" />
                  {t('restart_tutorial')}
                </button>
              )}
            </div>
             
             <div className="space-y-4">
               {/* Step 1 */}
               <div className="flex gap-4 items-start">
                 <div className="w-8 h-8 rounded-full bg-blue-50 text-french-blue flex items-center justify-center shrink-0 mt-0.5">
                   <Eyes className="w-5 h-5" />
                 </div>
                 <div className="text-left">
                   <h4 className="font-bold text-gray-800 text-sm">{t('step_1_title')}</h4>
                   <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{t('step_1_desc')}</p>
                 </div>
               </div>

               {/* Step 2 */}
               <div className="flex gap-4 items-start">
                 <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                   <PuzzlePiece className="w-5 h-5" />
                 </div>
                 <div className="text-left">
                   <h4 className="font-bold text-gray-800 text-sm">{t('step_2_title')}</h4>
                   <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{t('step_2_desc')}</p>
                 </div>
               </div>

               {/* Step 3 */}
               <div className="flex gap-4 items-start">
                 <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                   <CursorClick className="w-5 h-5" />
                 </div>
                 <div className="text-left">
                   <h4 className="font-bold text-gray-800 text-sm">{t('step_3_title')}</h4>
                   <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{t('step_3_desc')}</p>
                 </div>
               </div>

               {/* Step 4 */}
               <div className="flex gap-4 items-start">
                 <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0 mt-0.5">
                   <CheckCircle className="w-5 h-5" />
                 </div>
                 <div className="text-left">
                   <h4 className="font-bold text-gray-800 text-sm">{t('step_4_title')}</h4>
                   <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{t('step_4_desc')}</p>
                 </div>
               </div>
             </div>
           </div>

           {/* Footer: Author */}
           <div className="w-full border-t border-gray-100 pt-6 pb-4 md:pb-4 text-center">
             <a
                href="https://www.buymeacoffee.com/fran0k"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#FFDD00] text-[#000000] rounded-full font-display font-bold shadow-sm hover:shadow-md hover:scale-105 transition-all mb-6 active:scale-95"
              >
                <Coffee color="#000000ff" weight="bold" className="w-5 h-5" />
                <span>Buy me a coffee</span>
             </a>
            <div className="flex justify-center gap-2">
             <p className="text-sm text-gray-500 font-semibold flex items-center justify-center gap-1">
               {t('author')} <Heart  color="#f95d5d" weight="fill" className="w-4 h-4 " />
             </p>
             <p className="text-gray-500 font-semibold text-sm">
               Frank Lam
             </p>
             </div>
             <div className="flex justify-center mt-3 gap-4">
                <a href = "https://discord.gg/H9NBS3Nu" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-french-dark transition-colors">
                  <DiscordLogo className="w-6 h-6" />
                </a>
                <a href="https://www.hacomata.buzz/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-french-dark transition-colors">
                  <Browser className="w-6 h-6" />
                </a>
                <a href="https://www.linkedin.com/in/haochang-lin-a99606223/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-french-dark transition-colors">
                  <LinkedinLogo className="w-6 h-6" />
                </a>
                <a href="mailto:lhc1256744295@hotmail.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-french-dark transition-colors">
                  <EnvelopeSimple className="w-6 h-6" />
                </a>
             </div>
             <div className='flex-row items-center justify-center pt-4'>
             
              <p className="text-sm gap-2 text-gray-500 font-semibold">
                Copyright © 2025 Conjupuzzle.
              </p>
              <p className="text-sm gap-2 text-gray-500 font-semibold">
                All Rights Reserved.
              </p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};
