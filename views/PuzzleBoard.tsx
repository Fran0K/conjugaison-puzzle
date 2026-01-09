import React from 'react';
import { Lightbulb, BookOpen } from 'lucide-react';
import { PuzzleData } from '../types';
import { useLanguage } from '../LanguageContext';

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

  const localizedRuleObj = tRule(puzzle.tense);
  const translatedRuleFormula = localizedRuleObj ? localizedRuleObj.formula : "";

  return (
    <div className="w-full text-center mb-6 sm:mb-10 px-1">
      <div className="relative inline-block w-full max-w-lg" ref={objectiveRef}>
        <div className="bg-white px-4 py-5 sm:px-12 sm:py-6 rounded-3xl shadow-lg shadow-blue-100/50 border border-blue-50 relative overflow-hidden transition-all duration-300">
          <div className="text-3xl sm:text-5xl font-display font-black text-french-dark tracking-tight pb-2">
            <span className="text-french-blue">{puzzle.person}</span> 
            <span className="mx-2 sm:mx-3 text-gray-300">·</span>
            <span className="relative inline-block">
                <span className="relative z-10 text-french-red">{puzzle.verb}</span>
            </span>
          </div>
          <div className="text-sm sm:text-lg font-bold text-gray-500 mt-1 sm:mt-2">
            {tTense(puzzle.tense)}
          </div>
          <button
              onClick={onToggleHint}
              className={`absolute bottom-2 right-2 p-2.5 rounded-full shadow-sm border transition-all z-20 ${
                showHint 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white/50 hover:bg-white backdrop-blur-sm text-gray-400 border-transparent hover:border-gray-100 hover:text-french-blue'
              }`}
              aria-label={t('hint')}
          >
              <Lightbulb className="w-5 h-5" />
          </button>
        </div>
        
        {showHint && (
           <div className="w-full mt-3 animate-in slide-in-from-top-2 fade-in duration-300">
              <div className="mx-auto bg-blue-600 text-white text-xs px-4 py-3 rounded-2xl shadow-md border border-blue-400/50 text-center relative z-10">
                <div className="flex items-center justify-center gap-2 mb-1 opacity-80">
                  <BookOpen className="w-3 h-3" />
                  <span className="uppercase font-bold tracking-widest text-[10px]">{t('rules')}</span>
                </div>
                {translatedRuleFormula}
              </div>
           </div>
        )}
      </div>
    </div>
  );
};
