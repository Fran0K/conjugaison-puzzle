import React from 'react';
import { RefreshCw, Check, ArrowRight } from 'lucide-react';
import { GameState } from '../types';
import { useLanguage } from '../LanguageContext';

interface ControlBarProps {
  gameState: GameState;
  isCheckDisabled: boolean;
  onCheck: () => void;
  onSkip: () => void;
  onNext: () => void;
  // Ref for tutorial
  footerRef?: React.RefObject<HTMLDivElement | null>;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  gameState,
  isCheckDisabled,
  onCheck,
  onSkip,
  onNext,
  footerRef
}) => {
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-0 left-0 right-0 px-4 py-3 md:py-0 bg-[#faf9f7] backdrop-blur-md shadow-none z-40 flex flex-col items-center justify-center sm:static sm:bg-transparent sm:backdrop-blur-none w-full">
      <div ref={footerRef} className="flex gap-3 sm:gap-4 w-full justify-center max-w-lg mx-auto px-1">
          {gameState === GameState.SUCCESS ? (
             <button 
             onClick={onNext}
             className="w-full flex items-center justify-center gap-2 bg-[#55534e] text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full sm:rounded-2xl font-bold transition-all duration-300 active:scale-95 hover:shadow-clay-hover hover:-rotate-z-[2deg]"
           >
             <span>{t('next')}</span>
             <ArrowRight className="w-5 h-5" />
           </button>
          ) : (
            <>
               <button 
                onClick={onSkip}
                className="flex-1 flex items-center justify-center gap-2 text-warm-charcoal px-4 py-3 sm:px-6 rounded-xl font-bold transition-all duration-300 bg-white hover:bg-[#fc7981] hover:text-white active:scale-95 hover:shadow-clay-hover hover:-rotate-z-[2deg]"
              >
                <RefreshCw className="w-5 h-5" />
                <span>{t('skip')}</span>
              </button>
              <button 
                onClick={onCheck}
                disabled={isCheckDisabled}
                className={`flex-[2] flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold transition-all duration-300 ${
                    !isCheckDisabled
                  ? 'bg-[#078a52] text-white hover:bg-[#078a52] active:scale-95 hover:shadow-clay-hover hover:-rotate-z-[2deg]'
                  : 'bg-oat-light text-warm-silver cursor-not-allowed opacity-60'
                }`}
              >
                <Check className="w-5 h-5" />
                <span>{t('check')}</span>
              </button>
            </>
          )}
      </div>
    </div>
  );
};
