import React, { useState, useEffect, useRef } from 'react';
import { GameState } from './types';
import { GrammarModal } from './components/GrammarModal';
import { SettingsModal } from './components/SettingsModal';
import { AboutModal } from './components/AboutModal';
import { TutorialOverlay, TutorialStep } from './components/TutorialOverlay';
import { ALL_TENSES,DEFAULT_TENSES, SHIMMER_CLASS, STORAGE_KEYS } from './constants';
import {Database} from "@phosphor-icons/react";
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
  const settingRef = useRef<HTMLElement>(null);

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
  ];


  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-french-blue selection:text-white pb-20 sm:pb-15">
      
      {isMilestone && <Confetti key={confettiTrigger} />}

      <GameHeader 
        headerRef={settingRef}
        onOpenSettings={() => setShowSettings(true)}
        onOpenGrammar={() => setShowGrammar(true)}
        onOpenAbout={() => setShowAbout(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-4 py-4 sm:py-8 flex flex-col items-center">
        
        {/* Loading State */}
        {gameState === GameState.LOADING && (
          <div className="w-full flex flex-col items-center gap-4 animate-pulse mt-10">
            <div className={`h-24 w-full  ${SHIMMER_CLASS}`}></div>
            <div className={`h-16 w-full ${SHIMMER_CLASS}`}></div>
            <div className={`h-40 w-full ${SHIMMER_CLASS}`}></div>
            <div className="mt-4 text-gray-400 text-sm font-medium">{t('loading')}</div>
          </div>
        )}

        {/* Error State */}
        {gameState === GameState.ERROR && (
           <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md mt-10">
             <div className="text-french-blue mb-4 bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
               <Database className="w-8 h-8"/>
             </div>
             <h2 className="text-xl font-bold text-gray-800 mb-2">{t('error_title')}</h2>
             <p className="text-gray-500 mb-6 text-sm">{t('error_desc')}</p>
             <button onClick={loadNextPuzzle} className="px-6 py-3 bg-french-blue text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
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
