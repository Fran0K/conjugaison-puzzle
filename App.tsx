import React, { useState, useEffect, useRef } from 'react';
import { GameState } from './types';
import { GrammarModal } from './components/GrammarModal';
import { SettingsModal } from './components/SettingsModal';
import { AboutModal } from './components/AboutModal';
import { TutorialOverlay, TutorialStep } from './components/TutorialOverlay';
import { ALL_TENSES,DEFAULT_TENSES, STORAGE_KEYS } from './constants';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useLanguage } from './LanguageContext';
import { Confetti } from './components/Confetti';
import { usePuzzleEngine } from './hooks/usePuzzleEngine';
import { useGameplay } from './hooks/useGameplay';

// Views
import { GameHeader } from './views/GameHeader';
import { PuzzleBoard } from './views/PuzzleBoard';
import { WorkBench } from './views/WorkBench';
import { SupplyLayout } from './views/SupplyLayout';
import { FeedbackPanel } from './views/FeedbackPanel';
import { ControlBar } from './views/ControlBar';

const App: React.FC = () => {
  const { t, language } = useLanguage();

  // --- Settings / Persistence ---
  const [selectedTenses, setSelectedTenses] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.TENSES);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) { console.warn("Failed to parse saved tenses pref"); }
      }
    }
    return DEFAULT_TENSES;
  });

  const handleSettingsSave = (newTenses: string[]) => {
      setSelectedTenses(newTenses);
      localStorage.setItem(STORAGE_KEYS.TENSES, JSON.stringify(newTenses));
  };

  // --- Hooks (Logic Layer) ---
  const { puzzle, gameState, setGameState, loadNextPuzzle } = usePuzzleEngine(language, selectedTenses);
  
  // Game Stats
  const [successCount, setSuccessCount] = useState(0);
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  const handlePuzzleSuccess = () => {
    setGameState(GameState.SUCCESS);
    setSuccessCount(prev => prev + 1);
  };

  const gameplay = useGameplay(puzzle, t, handlePuzzleSuccess);

  // --- UI State (Modals) ---
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showGrammar, setShowGrammar] = useState(false);

  // --- Tutorial Logic ---
  // Refs for spotlight targets (passed down to views)
  const objectiveRef = useRef<HTMLDivElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const trayRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const settingRef = useRef<HTMLButtonElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const grammarRef = useRef<HTMLButtonElement>(null);
  const AboutRef = useRef<HTMLButtonElement>(null);

  // Trigger Tutorial on first load
  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      const hasSeen = localStorage.getItem(STORAGE_KEYS.ONBOARDING);
      if (!hasSeen) {
        setTimeout(() => setShowTutorial(true), 800);
      }
    }
  }, [gameState]);

  const handleTutorialComplete = () => {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING, 'true');
    setShowTutorial(false);
  };

  const handleRestartTutorial = () => setShowTutorial(true);

  const isMilestone = gameState === GameState.SUCCESS && successCount > 0 && successCount % 5 === 0;
  
  const tutorialSteps: TutorialStep[] = [
    { targetRef: objectiveRef, titleKey: 'tour_obj_title', descKey: 'tour_obj_desc', position: 'bottom' },
    { targetRef: trayRef, titleKey: 'tour_tray_title', descKey: 'tour_tray_desc', position: 'top' },
    { targetRef: dropZoneRef, titleKey: 'tour_zone_title', descKey: 'tour_zone_desc', position: 'bottom' },
    { targetRef: footerRef, titleKey: 'tour_footer_title', descKey: 'tour_footer_desc', position: 'top' },
    { targetRef: settingRef, titleKey: 'tour_header_title', descKey: 'tour_header_desc', position: 'bottom' },
    { targetRef: grammarRef, titleKey: 'tour_grammar_title', descKey: 'tour_grammar_desc', position: 'bottom' },
    { targetRef: langRef, titleKey: 'tour_lang_title', descKey: 'tour_lang_desc', position: 'bottom' },
    { targetRef: AboutRef, titleKey: 'tour_about_title', descKey: 'tour_about_desc', position: 'bottom' },
  ];


  return (
    <div className="h-[100dvh] overflow-y-auto overscroll-y-contain bg-cream text-gray-800 font-sans selection:bg-french-blue selection:text-white pb-[max(5rem,calc(3rem+env(safe-area-inset-bottom)))] sm:pb-15">

      {isMilestone && <Confetti key={confettiTrigger} />}

      <GameHeader 
        settingRef={settingRef}
        grammarRef={grammarRef}
        AboutRef={AboutRef}
        langBtnRef={langRef}
        onOpenSettings={() => setShowSettings(true)}
        onOpenGrammar={() => setShowGrammar(true)}
        onOpenAbout={() => setShowAbout(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-4 py-4 sm:py-8 flex flex-col items-center">
        
        {/* Loading State */}
        {gameState === GameState.LOADING && (
          <div className="w-full flex flex-col items-center justify-center gap-4 min-h-[60vh]">
            <div className="items-center justify-center mx-auto">
              {/* <DotLottieReact src="/img/Folders.lottie" loop autoplay className="w-60 h-60" /> */}
              {/* <DotLottieReact src="/img/Catloader.lottie" loop autoplay/> */}
              <DotLottieReact src="/img/Catinarocket.lottie" loop autoplay className="w-60 h-60" />
              {/* <DotLottieReact src="/img/catMarkloading.lottie" loop autoplay className="w-50 h-50" /> */}
            </div>

            <div className="text-[#55534e] text-l font-medium tracking-wide">
              {t('loading')}
            </div>
          </div>
          
        )}

        {/* Error State */}
        {gameState === GameState.ERROR && (
           <div className="w-full flex flex-col items-center justify-center gap-4 min-h-[60vh]">
            <h2 className="text-4xl leading-8 italic font-bold text-black sm:mb-8">{t('error_title')}</h2>
            <div className="flex items-center justify-center mx-auto sm:mb-8">
              <DotLottieReact src="/img/emptybox3.lottie" loop autoplay className="w-60 h-60" />
            </div>
            <p className="text-warm-charcoal mb-8 text-m">{t('error_desc')}</p>
            <button onClick={loadNextPuzzle} className="px-12 sm:px-24 py-3 bg-[#856af2] text-white rounded-full font-bold hover:shadow-clay-hover">
              {t('retry')}
            </button>
           </div>
        )}

        {/* Active Game State */}
        {(gameState === GameState.PLAYING || gameState === GameState.SUCCESS) && puzzle && (
          <>
            <PuzzleBoard 
              puzzle={puzzle} 
              showHint={gameplay.ui.showHint} 
              onToggleHint={gameplay.ui.toggleHint} 
              objectiveRef={objectiveRef}
            />

            <WorkBench 
              puzzle={puzzle}
              gameState={gameState}
              selection={gameplay.selection}
              validation={gameplay.validation.state ?? null}
              actions={gameplay.actions}
              dropZoneRef={dropZoneRef}
            />

            {gameState !== GameState.SUCCESS && (
              <SupplyLayout 
                puzzle={puzzle}
                pieces={gameplay.pieces}
                selection={gameplay.selection}
                actions={gameplay.actions}
                trayRef={trayRef}
              />
            )}

            <FeedbackPanel 
              gameState={gameState}
              feedback={gameplay.validation.feedback}
              puzzle={puzzle}
              successCount={successCount}
              isMilestone={isMilestone}
              onMilestoneClick={() => setConfettiTrigger(t => t + 1)}
            />
            
            <ControlBar 
              gameState={gameState}
              isCheckDisabled={!gameplay.ui.isComplete}
              onCheck={gameplay.actions.check}
              onSkip={loadNextPuzzle}
              onNext={loadNextPuzzle}
              footerRef={footerRef}
            />
          </>
        )}
      </main>

      {/* Global Modals */}
      <TutorialOverlay isOpen={showTutorial} steps={tutorialSteps} onComplete={handleTutorialComplete} />
      <GrammarModal isOpen={showGrammar} onClose={() => setShowGrammar(false)} />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} selectedTenses={selectedTenses} onSave={handleSettingsSave} />
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} onRestartTutorial={handleRestartTutorial} />
    </div>
  );
};

export default App;
