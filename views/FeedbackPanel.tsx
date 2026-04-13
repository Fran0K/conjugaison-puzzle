import React from 'react';
import { Trophy, ScanSearch, Volume2, Frown } from 'lucide-react';
import { PuzzleData, GameState } from '../types';
import { useLanguage } from '../LanguageContext';
import { SUPPORTED_LANGUAGES } from '../constants';

interface FeedbackPanelProps {
  gameState: GameState;
  feedback: string | null;
  puzzle: PuzzleData;
  successCount: number;
  isMilestone: boolean;
  onMilestoneClick: () => void;
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({
  gameState,
  feedback,
  puzzle,
  successCount,
  isMilestone,
  onMilestoneClick
}) => {
  const { t, language } = useLanguage();

  if (!feedback && gameState !== GameState.SUCCESS) return null;

  // Helper for flag display using centralized constant
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language);
  const flag = currentLangObj ? currentLangObj.flag : '🇬🇧';

  // 1. Error / Warning Mode
  if (gameState !== GameState.SUCCESS) {
    return (
       <div className="w-full max-w-lg mb-6 p-3 rounded-xl text-center bg-[#b53333] border-red-200 animate-in zoom-in-95">
         <h3 className="text-lg font-bold text-[#ecca00] flex items-center justify-center gap-2">
            <Frown className="w-5 h-5" />
            {feedback}
            </h3>
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
            className="w-full text-[#5d5e61] px-6 py-3 rounded-full font-display text-lg flex items-center justify-center gap-2 transform transition-transform cursor-pointer active:scale-95 select-none"
            style={{ background: 'linear-gradient(135deg, #00c3ff, #ffff1c)' }}
          >
            <Trophy className="w-6 h-6 text-[#5d5e61]" fill="currentColor" />
            {/* @ts-ignore */}
            {t('milestone').replace('{n}', successCount)}
          </div>
        </div>
      )}

      <div className="p-4 sm:p-6 rounded-3xl text-center animate-in zoom-in-95 duration-300 bg-white">
        <h3 className="text-base sm:text-lg font-display font-base mb-1 text-[#55534e]">
          {feedback}
        </h3>
        <div className="flex flex-col items-center gap-3">
          {/* Pronoun + verb */}
          <div className="text-[#5d5e61] text-2xl sm:text-3xl font-bold px-5 py-2.5">
            {puzzle.pronoun}
            <span className="ml-1.5">
              {puzzle.auxStem ? `${puzzle.auxStem}${puzzle.auxEnding || ''} ` : ''}
              {puzzle.correctStem}{puzzle.correctEnding || ''}
            </span>
          </div>
          {/* Play button */}
          {typeof window !== 'undefined' && window.speechSynthesis && (
            <button
              onClick={() => {
                const aux = puzzle.auxStem ? (puzzle.auxStem + (puzzle.auxEnding || '')) : '';
                const verb = puzzle.correctStem + (puzzle.correctEnding || '');
                const text = [puzzle.pronoun, aux, verb].filter(Boolean).join(' ');
                window.speechSynthesis.cancel();
                window.speechSynthesis.resume();
                const voices = window.speechSynthesis.getVoices();
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'fr-FR';
                const voice = voices.find(v => v.name === 'Thomas')
                  || voices.find(v => v.lang === 'fr-FR')
                  || voices.find(v => v.lang.startsWith('fr'));
                if (voice) utterance.voice = voice;
                window.speechSynthesis.speak(utterance);
              }}
              className="text-sm font-medium text-[#fff] bg-[#ff752d] px-8 py-2.5 rounded-xl transition-all duration-300 active:scale-95 hover:shadow-clay-hover hover:-rotate-z-[2deg] flex items-center gap-1.5"
              title={t('speak')}
            >
              <Volume2 className="w-4 h-4 mr-2" />
              {t('speak')}
            </button>
          )}
        </div>
        
        <div className="text-sm text-left text-[#0a5b40] mt-4 bg-[#d1fae6] p-4 rounded-xl">
          <span className="font-bold block mb-1 text-l uppercase tracking-wider text-[#0a5b40] flex items-center gap-1">
            <ScanSearch className="w-3 h-3" /> {t('explanation')}
          </span>
          {puzzle.explanation}
        </div>

        <div className="text-l text-left text-[#3730a3] mt-4 bg-[#e1e7ff] p-4 rounded-xl">
          <div className="font-medium flex justify-between">
            <div>
              {puzzle.verb}
            </div>
            <div>
              {puzzle.translation}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
