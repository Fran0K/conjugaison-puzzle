import React from 'react';
import { Lightbulb, BookOpen } from 'lucide-react';
import { PuzzleData } from '../types';
import { useLanguage } from '../LanguageContext';
import { useModalAnimation } from '../hooks/useModalAnimation';

interface PuzzleBoardProps {
  puzzle: PuzzleData;
  showHint: boolean;
  onToggleHint: () => void;
  // Ref passed for tutorial spotlight
  objectiveRef?: React.RefObject<HTMLDivElement | null>;
}

export const PuzzleBoard: React.FC<PuzzleBoardProps> = ({
  puzzle,
  showHint,
  onToggleHint,
  objectiveRef
}) => {
  const { t, tTense, tRule } = useLanguage();
  // onClose is a no-op: parent already manages showHint state
  const { shouldRender: hintVisible, closing: hintClosing, handleAnimationEnd } = useModalAnimation(showHint, () => {});

  const localizedRuleObj = tRule(puzzle.tense);
  const translatedRuleFormula = localizedRuleObj ? localizedRuleObj.formula : "";

  return (
    <div className="w-full text-center mb-6 sm:mb-10 px-1">
      <div className="relative inline-block w-full max-w-lg" ref={objectiveRef}>
        <div className="bg-white px-4 py-5 sm:px-12 sm:py-6 rounded-3xl relative overflow-hidden transition-all duration-300">
          <div className="text-3xl sm:text-5xl font-display font-black text-french-dark tracking-tight pb-2">
            <span className="text-french-blue">{puzzle.person}</span>
            <span className="mx-2 sm:mx-3 text-gray-300">·</span>
            <span className="relative inline-block">
                <span className="relative z-10 text-french-red">{puzzle.verb}</span>
            </span>
          </div>
          <div className="text-sm sm:text-lg font-bold text-warm-charcoal mt-1 sm:mt-2">
            {tTense(puzzle.tense)}
          </div>
          <button
              onClick={onToggleHint}
              className={`absolute bottom-2 right-2 p-2.5 rounded-full transition-all z-20 ${
                showHint
                  ? 'bg-[#d1fae5] text-[#076046] '
                  : 'bg-white/50 hover:bg-white backdrop-blur-sm text-warm-silver border-transparent hover:text-[#12b981]'
              }`}
              aria-label={t('hint')}
          >
              <Lightbulb className="w-5 h-5" />
          </button>
        </div>

        {hintVisible && (
           <div
             className={`w-full mt-3 ${hintClosing ? 'modal-content-exit' : 'modal-content-enter'}`}
             onAnimationEnd={handleAnimationEnd}
           >
              <div className="mx-auto bg-[#12b981] text-[#fff] text-xs px-4 py-3 rounded-2xl border text-center relative z-10">
                <div className="flex items-center justify-center gap-2 mb-1 opacity-80">
                  <BookOpen className="w-3 h-3" />
                  <span className="uppercase font-bold tracking-widest text-[10px]">{t('hint')}</span>
                </div>
                {translatedRuleFormula}
              </div>
           </div>
        )}
      </div>
    </div>
  );
};
