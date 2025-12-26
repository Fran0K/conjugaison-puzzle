
import React from 'react';
import { X, Heart, Github, Linkedin, Link, Eye, MousePointerClick, CheckCircle2, Plus, Puzzle, RotateCcw, Mail } from 'lucide-react';
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
            <X className="w-5 h-5 text-gray-500" />
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
              <h1 className="text-2xl font-bold text-gray-800">{t('title')}</h1>
              <p className="text-xs font-mono text-gray-400 mt-1">{t('version')}</p>
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
                  <RotateCcw className="w-4 h-4" />
                  {t('restart_tutorial')}
                </button>
              )}
            </div>
             
             <div className="space-y-4">
               {/* Step 1 */}
               <div className="flex gap-4 items-start">
                 <div className="w-8 h-8 rounded-full bg-blue-50 text-french-blue flex items-center justify-center shrink-0 mt-0.5">
                   <Eye className="w-4 h-4" />
                 </div>
                 <div className="text-left">
                   <h4 className="font-bold text-gray-800 text-sm">{t('step_1_title')}</h4>
                   <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{t('step_1_desc')}</p>
                 </div>
               </div>

               {/* Step 2 */}
               <div className="flex gap-4 items-start">
                 <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                   <Plus className="w-4 h-4" />
                 </div>
                 <div className="text-left">
                   <h4 className="font-bold text-gray-800 text-sm">{t('step_2_title')}</h4>
                   <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{t('step_2_desc')}</p>
                 </div>
               </div>

               {/* Step 3 */}
               <div className="flex gap-4 items-start">
                 <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                   <MousePointerClick className="w-4 h-4" />
                 </div>
                 <div className="text-left">
                   <h4 className="font-bold text-gray-800 text-sm">{t('step_3_title')}</h4>
                   <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{t('step_3_desc')}</p>
                 </div>
               </div>

               {/* Step 4 */}
               <div className="flex gap-4 items-start">
                 <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0 mt-0.5">
                   <CheckCircle2 className="w-4 h-4" />
                 </div>
                 <div className="text-left">
                   <h4 className="font-bold text-gray-800 text-sm">{t('step_4_title')}</h4>
                   <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{t('step_4_desc')}</p>
                 </div>
               </div>
             </div>
           </div>

           {/* Footer: Author */}
           <div className="w-full border-t border-gray-100 pt-6 pb-4 md:pb-10 text-center">
             <p className="text-sm text-gray-500 mb-2 font-semibold flex items-center justify-center gap-1">
               {t('author')} <Heart className="w-3 h-3 text-red-500 fill-current" />
             </p>
             <p className="text-french-dark font-bold text-lg">
               Frank Lam
             </p>
             <div className="flex justify-center mt-3 gap-4">
                <a href="https://github.com/Fran0K/fran0k.github.io" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-800 transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="https://www.hacomata.buzz/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-800 transition-colors">
                  <Link className="w-5 h-5" />
                </a>
                <a href="https://www.linkedin.com/in/haochang-lin-a99606223/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-800 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="mailto:lhc1256744295@hotmail.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-800 transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
             </div>
             <p className="text-sm text-gray-500 font-semibold flex items-center justify-center pt-4">
               Copyright © 2025 Conjupuzzle. All Rights Reserved.
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};
