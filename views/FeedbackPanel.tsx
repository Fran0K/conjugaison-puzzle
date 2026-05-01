import React from 'react';
import { Trophy, ScanSearch, Volume2, Frown, Armchair, Lasso, CheckCircle2 } from 'lucide-react';
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

      <div className="relative">
        {/* Floating circle icon - overlaps card top edge */}
        <div
          className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 w-20 h-20 rounded-full flex items-center justify-center"
        >
          <CheckCircle2 className="w-10 h-10 text-white" fill="#358153" />
        </div>
        {/* Notch cutout - semicircle matching page background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[20px] bg-[var(--background,#faf9f7)] rounded-b-full z-10" />
        <div className="px-4 pt-14 sm:px-6 sm:pt-14 pb-4 sm:pb-6 rounded-3xl text-center animate-in zoom-in-95 duration-300 bg-[#edf1e8]">
        <h3 className="text-xl sm:text-lg font-display font-base mb-1 text-[#40a661] inline-flex items-center gap-8">
          <span className="inline-block w-2 h-2 rotate-45 bg-[#5ba8e8] opacity-50" />
          <span className="inline-block w-1.5 h-1.5 rotate-45 bg-[#f5c542] opacity-70" />
          <span>{feedback}</span>
          <span className="inline-block w-1.5 h-1.5 rotate-45 bg-[#f5c542] opacity-70" />
          <span className="inline-block w-2 h-2 rotate-45 bg-[#5ba8e8] opacity-50" />
        </h3>
        <div className="flex flex-col items-center gap-3">
          {/* Pronoun + verb */}
          <div className="text-black text-2xl sm:text-3xl font-bold px-5 py-2.5">
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
              className="text-sm font-medium text-[#42865c] bg-white px-8 py-2.5 rounded-full transition-all duration-300 active:scale-95 hover:shadow-clay-hover flex items-center gap-1.5"
              title={t('speak')}
            >
              <Volume2 className="w-4 h-4 mr-2" />
              {t('speak')}
            </button>
          )}
        </div>

        <div className="text-[#4c4c4c] bg-[#dce9d4] text-base mb-1 text-left mt-4 p-4 rounded-xl">
          <span className="text-[#3f7258] font-medium block mb-2 text-sm uppercase tracking-tight flex items-center gap-1">
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

        <div className="text-[#4c4c4c] text-base text-left mt-4 bg-[#f5f9f2] p-4 rounded-xl">
  
  {/* 标题 */}
  <div className="text-[#42865c] capitalize font-semibold text-lg flex justify-between">
    <div>{puzzle.verb}</div>
    <div>{puzzle.translation}</div>
  </div>

  {/* Example */}
  {puzzle.example && (
    <div className="mt-3 pt-3 border-t border-[#4c4c4c]">

      <span className="text-[#3f7258] font-medium block mb-2 text-sm uppercase tracking-tight flex items-center gap-1">
        <Lasso className="w-4 h-4 shrink-0" />
        {t('exampleSentence')}
      </span>

      <p className="text-base font-medium mb-1 leading-relaxed text-[#4c4c4c]">
        {puzzle.example.sentence}
      </p>

      <p className="text-base italic text-[#679b7b] leading-relaxed">
        {(language !== 'fr' && puzzle.example.translations[language as keyof typeof puzzle.example.translations]) || (language !== 'fr' ? puzzle.example.translations.en : '')}
      </p>

    </div>
  )}
</div>

      </div>
      </div>
    </div>
  );
};
