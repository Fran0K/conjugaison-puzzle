import React from 'react';
import { Trophy, ScanSearch, Volume2, Frown, Armchair, Lasso } from 'lucide-react';
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
         <h3 className="text-lg font-bold text-[#eee9df] flex items-center justify-center gap-2">
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

      <div className="p-4 sm:p-6 rounded-3xl text-center animate-in zoom-in-95 duration-300 bg-[#ec785d]">
        <h3 className="text-xl sm:text-lg font-display font-base mb-1 text-[#F8DCD4]">
          {feedback}
        </h3>
        <div className="flex flex-col items-center gap-3">
          {/* Pronoun + verb */}
          <div className="text-[#fff] text-2xl sm:text-3xl font-bold px-5 py-2.5">
            {puzzle.pronoun}
            <span className={puzzle.pronoun.endsWith("'") ? "" : "ml-1.5"}>
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
              className="text-sm font-medium text-[#4c4c4c] bg-[#ffc154] px-8 py-2.5 rounded-full transition-all duration-300 active:scale-95 hover:shadow-clay-hover flex items-center gap-1.5"
              title={t('speak')}
            >
              <Volume2 className="w-4 h-4 mr-2" />
              {t('speak')}
            </button>
          )}
        </div>

        <div className="text-[#4c4c4c] text-base mb-1 text-left mt-4 bg-[#F8A58E] p-4 rounded-xl">
          <span className="text-[#000]/90 font-medium block mb-2 text-sm uppercase tracking-tight flex items-center gap-1">
            <Armchair className="w-4 h-4 shrink-0" />
            {t('explanation')}
          </span>

          <p className="text-base leading-relaxed">
            {puzzle.explanation}
          </p>

          {/* être gender agreement note — only for compound tenses */}
          {puzzle.isEtre && puzzle.auxStem && ['je', 'tu', 'Je', 'Tu'].includes(puzzle.person) && (
            <p className="text-sm mt-2 text-[#4c4c4c]/70 italic">
              {t('etre_gender_sing').replace('{form}', `${puzzle.correctStem}${puzzle.correctEnding || ''}e`)}
            </p>
          )}
          {puzzle.isEtre && puzzle.auxStem && ['nous', 'vous', 'Nous', 'Vous'].includes(puzzle.person) && (
            <p className="text-sm mt-2 text-[#4c4c4c]/70 italic">
              {t('etre_gender_plural').replace('{form}', `${puzzle.correctStem}${puzzle.correctEnding || ''}es`)}
            </p>
          )}
        </div>

        <div className="text-[#4c4c4c] text-base text-left mt-4 bg-[#F8A679] p-4 rounded-xl">
  
  {/* 标题 */}
  <div className="capitalize font-semibold text-lg flex justify-between">
    <div>{puzzle.verb}</div>
    <div>{puzzle.translation}</div>
  </div>

  {/* Example */}
  {puzzle.example && (
    <div className="mt-3 pt-3 border-t border-[#4c4c4c]">

      <span className="text-[#000]/90 font-medium block mb-2 text-sm uppercase tracking-tight flex items-center gap-1">
        <Lasso className="w-4 h-4 shrink-0" />
        {t('exampleSentence')}
      </span>

      <p className="text-base font-medium mb-1 leading-relaxed">
        {puzzle.example.sentence}
      </p>

      <p className="text-base italic text-[#4c4c4c]/80 leading-relaxed">
        {puzzle.example.translations[language] || puzzle.example.translations.en}
      </p>

    </div>
  )}
</div>

      </div>
    </div>
  );
};
