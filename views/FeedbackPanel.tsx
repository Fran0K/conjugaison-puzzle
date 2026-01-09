import React from 'react';
import { Trophy, BookOpen } from 'lucide-react';
import { PuzzleData, GameState } from '../types';
import { useLanguage } from '../LanguageContext';
import { SUPPORTED_LANGUAGES } from '../constants';

interface FeedbackPanelProps {
  gameState: GameState;
  feedback: string | null;
  puzzle: PuzzleData;
  successCount: number;
  onMilestoneClick: () => void;
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({
  gameState,
  feedback,
  puzzle,
  successCount,
  onMilestoneClick
}) => {
  const { t, language } = useLanguage();

  if (!feedback && gameState !== GameState.SUCCESS) return null;

  // Helper for flag display using centralized constant
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language);
  const flag = currentLangObj ? currentLangObj.flag : '🇬🇧';

  const isMilestone = gameState === GameState.SUCCESS && successCount > 0 && successCount % 1 === 0;

  // 1. Error / Warning Mode
  if (gameState !== GameState.SUCCESS) {
    return (
       <div className="w-full max-w-lg mb-6 p-3 rounded-xl border-2 text-center bg-red-50 border-red-200 animate-in zoom-in-95">
         <h3 className="text-lg font-bold text-red-700">{feedback}</h3>
       </div>
    );
  }

  // 2. Success Mode
  return (
    <div className="w-full max-w-lg mt-0 mb-6 pb-2 px-1 relative">
      
      {/* Milestone Message */}
      {isMilestone && (
        <div className="mb-6 animate-in bounce-in duration-700 w-full">
          <div 
            onClick={onMilestoneClick}
            className="w-full bg-orange-400 text-white px-6 py-3 rounded-full font-display text-lg flex items-center justify-center gap-2 transform transition-transform cursor-pointer active:scale-95 select-none shadow-md"
          >
            <Trophy className="w-6 h-6 text-yellow-100" fill="currentColor" />
            {/* @ts-ignore */}
            {t('milestone').replace('{n}', successCount)}
          </div>
        </div>
      )}

      <div className="p-4 sm:p-6 rounded-3xl border-2 text-center animate-in zoom-in-95 duration-300 bg-green-50 border-green-200">
        <h3 className="text-xl sm:text-2xl font-display font-bold mb-2 text-green-700">
          {feedback}
        </h3>
        <div className="space-y-4 mt-4">
            <div className="text-base sm:text-lg text-green-900 bg-white/60 inline-block px-4 py-2 sm:px-6 rounded-xl">
              {puzzle.pronoun} 
              <span className="font-bold ml-2">
                <span className="border-b-2 border-green-500">{puzzle.auxStem ? `${puzzle.auxStem}${puzzle.auxEnding || ''} ` : ''}</span>
                <span className="border-b-2 border-green-500">{puzzle.correctStem}{puzzle.correctEnding || ''}</span>
              </span>
            </div>
            <p className="text-sm text-green-700 italic flex items-center justify-center gap-2">
              <span>{flag}</span> "{puzzle.translation}"
            </p>
            <div className="text-sm bg-green-100/50 p-4 rounded-xl text-left text-green-900 border border-green-100 mt-4">
              <span className="font-bold block mb-1 text-xs uppercase opacity-70 flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> {t('explanation')}
              </span>
              {puzzle.explanation}
            </div>
        </div>
      </div>
    </div>
  );
};
