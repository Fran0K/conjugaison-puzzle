import React, { useState, useEffect, useCallback } from 'react';
import { fetchRandomPuzzleFromDB } from './services/supabase';
import { PuzzleData, GameState, SlotType } from './types';
import { PuzzlePiece } from './components/PuzzlePiece';
import { DropZone } from './components/DropZone';
import { GrammarModal } from './components/GrammarModal';
import { SettingsModal } from './components/SettingsModal';
import { AboutModal } from './components/AboutModal';
import { ALL_TENSES, SHIMMER_CLASS } from './constants';
import { BookOpen, RefreshCw, ArrowRight, BrainCircuit, Database, Settings, Lightbulb, ChevronDown, Info, Plus } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { Language } from './locales';

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

// Deduplicate and filter empty strings
function cleanAndShuffle(correct: string | null | undefined, distractors: string[] | null | undefined): string[] {
  const set = new Set<string>();
  
  if (correct && correct.trim()) set.add(correct.trim());
  if (distractors) {
    distractors.forEach(d => {
      if (d && d.trim()) set.add(d.trim());
    });
  }
  
  return shuffleArray(Array.from(set));
}

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
];

const App: React.FC = () => {
  const { t, tTense, tRule, language, setLanguage } = useLanguage();

  const [gameState, setGameState] = useState<GameState>(GameState.LOADING);
  const [puzzle, setPuzzle] = useState<PuzzleData | null>(null);
  
  // Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [selectedTenses, setSelectedTenses] = useState<string[]>(ALL_TENSES);

  // Hint State
  const [showHint, setShowHint] = useState(false);
  
  // Language Menu State
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  // About Modal State
  const [showAbout, setShowAbout] = useState(false);

  // --- Available pieces in the "tray" ---
  // Verb / Main Parts
  const [availableStems, setAvailableStems] = useState<string[]>([]);
  const [availableEndings, setAvailableEndings] = useState<string[]>([]);
  // Auxiliary Parts (only used if puzzle.auxStem exists)
  const [availableAuxStems, setAvailableAuxStems] = useState<string[]>([]);
  const [availableAuxEndings, setAvailableAuxEndings] = useState<string[]>([]);
  
  // --- User selection ---
  // Verb / Main Parts
  const [selectedStem, setSelectedStem] = useState<string | null>(null);
  const [selectedEnding, setSelectedEnding] = useState<string | null>(null);
  // Auxiliary Parts
  const [selectedAuxStem, setSelectedAuxStem] = useState<string | null>(null);
  const [selectedAuxEnding, setSelectedAuxEnding] = useState<string | null>(null);
  
  // UI States
  const [showGrammar, setShowGrammar] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadNewPuzzle = useCallback(async () => {
    setGameState(GameState.LOADING);
    setFeedback(null);
    setSelectedStem(null);
    setSelectedEnding(null);
    setSelectedAuxStem(null);
    setSelectedAuxEnding(null);
    setShowHint(false); 
    
    try {
      const newPuzzle = await fetchRandomPuzzleFromDB(selectedTenses, language);
      
      if (newPuzzle) {
        setPuzzle(newPuzzle);
        
        // 1. Setup Main Verb / Participle pieces
        setAvailableStems(cleanAndShuffle(newPuzzle.correctStem, newPuzzle.distractorStems));
        
        // Only load ending pieces if the puzzle actually HAS an ending (regular or split irregular)
        if (newPuzzle.correctEnding !== null) {
           setAvailableEndings(cleanAndShuffle(newPuzzle.correctEnding, newPuzzle.distractorEndings));
        } else {
           setAvailableEndings([]);
        }

        // 2. Setup Auxiliary pieces (if compound tense)
        if (newPuzzle.auxStem) {
          setAvailableAuxStems(cleanAndShuffle(newPuzzle.auxStem, newPuzzle.auxDistractorStems));
          
          // Check if aux ending is relevant (e.g. if aux is split)
          if (newPuzzle.auxEnding !== null) {
            setAvailableAuxEndings(cleanAndShuffle(newPuzzle.auxEnding, newPuzzle.auxDistractorEndings));
          } else {
            setAvailableAuxEndings([]);
          }
        } else {
          setAvailableAuxStems([]);
          setAvailableAuxEndings([]);
        }

        setGameState(GameState.PLAYING);
      } else {
         if (selectedTenses.length === 0) {
             console.warn("No tenses selected.");
         }
         setGameState(GameState.ERROR);
      }

    } catch (error) {
      console.error(error);
      setGameState(GameState.ERROR);
    }
  }, [selectedTenses, language]);

  useEffect(() => {
    loadNewPuzzle();
  }, [loadNewPuzzle]);

  const handleCheck = () => {
    if (!puzzle) return;
    
    // Check Main Verb
    const isStemCorrect = selectedStem === puzzle.correctStem;
    
    // Check ending: 
    // If correctEnding exists, check it. 
    // If it's null (indivisible irregular like "vais"), it's automatically correct (no piece needed).
    const isEndingCorrect = puzzle.correctEnding !== null
      ? (selectedEnding === puzzle.correctEnding) 
      : true;

    // Check Auxiliary (if applicable)
    let isAuxCorrect = true;
    if (puzzle.auxStem) {
        const isAuxStemCorrect = selectedAuxStem === puzzle.auxStem;
        // Same logic for Aux ending: if it's null, it's auto-correct
        const isAuxEndingCorrect = puzzle.auxEnding !== null 
          ? selectedAuxEnding === puzzle.auxEnding
          : true;
        isAuxCorrect = isAuxStemCorrect && isAuxEndingCorrect;
    }

    if (isStemCorrect && isEndingCorrect && isAuxCorrect) {
      setGameState(GameState.SUCCESS);
      setFeedback(t('correct'));
    } else {
      setFeedback(t('wrong'));
    }
  };

  const handleSkip = () => {
     loadNewPuzzle();
  };
  
  const handleSettingsSave = (newTenses: string[]) => {
      setSelectedTenses(newTenses);
  };

  const selectLanguage = (lang: Language) => {
    setLanguage(lang);
    setIsLangMenuOpen(false);
  };

  // Completion logic
  const isCompound = !!puzzle?.auxStem;
  
  let isComplete = false;
  if (puzzle) {
    if (isCompound) {
      const auxEndingNeeded = puzzle.auxEnding !== null;
      const auxComplete = auxEndingNeeded ? (!!selectedAuxStem && !!selectedAuxEnding) : !!selectedAuxStem;
      
      const mainEndingNeeded = puzzle.correctEnding !== null;
      const mainComplete = mainEndingNeeded ? (!!selectedStem && !!selectedEnding) : !!selectedStem;
      
      isComplete = auxComplete && mainComplete;
    } else {
       // Simple Tense
       if (puzzle.correctEnding !== null) {
          isComplete = !!selectedStem && !!selectedEnding;
       } else {
          isComplete = !!selectedStem;
       }
    }
  }

  const translatedRuleSummary = puzzle ? tRule(puzzle.tense) : "";
  const currentLangObj = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  // --- LAYOUT LOGIC FOR TRAY ---
  const showAuxConnectors = puzzle ? (puzzle.auxEnding !== null) : false;
  const showVerbConnectors = puzzle ? (puzzle.correctEnding !== null) : false;

  // Flags for available trays
  const hasAuxStem = isCompound && availableAuxStems.length > 0;
  const hasAuxEnd = isCompound && availableAuxEndings.length > 0;
  const hasVerbStem = availableStems.length > 0;
  const hasVerbEnd = availableEndings.length > 0;

  const trayCount = (hasAuxStem ? 1 : 0) + (hasAuxEnd ? 1 : 0) + (hasVerbStem ? 1 : 0) + (hasVerbEnd ? 1 : 0);

  // Reusable Tray Block Component
  const TrayBlock = ({ 
    items, 
    type, 
    selected, 
    onSelect, 
    title, 
    color, 
    gridClass, // Passed directly now for maximum flexibility
    containerClass = "w-full", // The outer wrapper width (default full, overridable)
    showConnectors 
  }: { 
    items: string[], 
    type: SlotType, 
    selected: string | null, 
    onSelect: (s: string) => void, 
    title: string, 
    color: 'amber' | 'blue' | 'red',
    gridClass: string,
    containerClass?: string,
    showConnectors?: boolean
  }) => {
    const borderColor = color === 'amber' ? 'border-amber-100' : (color === 'blue' ? 'border-blue-100' : 'border-red-100');
    const titleColor = color === 'amber' ? 'text-amber-500' : (color === 'blue' ? 'text-french-blue' : 'text-french-red');
    
    return (
      <div className={`bg-white p-3 sm:p-4 rounded-xl border ${borderColor} shadow-sm flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 ${containerClass}`}>
        <div className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2 border-b ${borderColor} pb-1 w-full text-center truncate ${titleColor}`}>
          {title}
        </div>
        <div className={gridClass}>
          {items.map((item, i) => (
            <PuzzlePiece 
              key={`${type}-${i}`} 
              text={item} 
              type={type} 
              isSelected={selected === item} 
              onClick={() => onSelect(item)} 
              showConnectors={showConnectors}
            />
          ))}
        </div>
      </div>
    );
  };

  // --- HELPER FOR RENDERING TRAYS ---
  // Updated to pass containerClass to TrayBlock
  const AuxStemTray = ({ gridClass, containerClass }: { gridClass: string, containerClass?: string }) => (
    <TrayBlock 
      items={availableAuxStems}
      type="aux-stem"
      selected={selectedAuxStem}
      onSelect={setSelectedAuxStem}
      title={`Aux · ${t('stems_tray')}`}
      color="amber"
      gridClass={gridClass}
      containerClass={containerClass}
      showConnectors={showAuxConnectors}
    />
  );

  const AuxEndTray = ({ gridClass, containerClass }: { gridClass: string, containerClass?: string }) => (
    <TrayBlock 
      items={availableAuxEndings}
      type="aux-ending"
      selected={selectedAuxEnding}
      onSelect={setSelectedAuxEnding}
      title={`Aux · ${t('endings_tray')}`}
      color="amber"
      gridClass={gridClass}
      containerClass={containerClass}
    />
  );

  const VerbStemTray = ({ gridClass, containerClass }: { gridClass: string, containerClass?: string }) => (
    <TrayBlock 
      items={availableStems}
      type="stem"
      selected={selectedStem}
      onSelect={setSelectedStem}
      title={`Verb · ${t('stems_tray')}`}
      color="blue"
      gridClass={gridClass}
      containerClass={containerClass}
      showConnectors={showVerbConnectors}
    />
  );

  const VerbEndTray = ({ gridClass, containerClass }: { gridClass: string, containerClass?: string }) => (
    <TrayBlock 
      items={availableEndings}
      type="ending"
      selected={selectedEnding}
      onSelect={setSelectedEnding}
      title={`Verb · ${t('endings_tray')}`}
      color="blue"
      gridClass={gridClass}
      containerClass={containerClass}
    />
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-french-blue selection:text-white pb-32 sm:pb-20">
      
      {/* Click outside handler for language menu */}
      {isLangMenuOpen && (
        <div 
          className="fixed inset-0 z-20 cursor-default"
          onClick={() => setIsLangMenuOpen(false)}
        />
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-french-blue rounded-lg flex items-center justify-center text-white font-bold font-display shadow-sm">
              C
            </div>
            <h1 className="text-xl font-display font-bold text-french-dark hidden sm:block">
              {t('title')}
            </h1>
            {/* Info Button for Mobile (next to title) */}
             <button onClick={() => setShowAbout(true)} className="sm:hidden p-1 text-gray-300 hover:text-french-blue transition-colors">
               <Info className="w-4 h-4" />
             </button>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
             {/* Language Dropdown */}
             <div className="relative">
                <button 
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors border border-gray-200"
                >
                  <span className="text-sm">{currentLangObj.flag}</span>
                  <span className="hidden sm:inline">{currentLangObj.label}</span>
                  <span className="sm:hidden uppercase">{currentLangObj.code}</span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>

                {isLangMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1 overflow-hidden z-40 animate-in fade-in zoom-in-95 duration-200">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => selectLanguage(lang.code)}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors ${
                          language === lang.code ? 'bg-blue-50 text-french-blue' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                )}
             </div>

            <button onClick={() => setShowSettings(true)} className="p-2 hover:bg-blue-50 rounded-full transition-colors text-gray-400">
              <Settings className="w-6 h-6" />
            </button>

            <button onClick={() => setShowGrammar(true)} className="p-2 text-french-blue hover:bg-blue-50 rounded-full transition-colors">
              <BookOpen className="w-6 h-6" />
            </button>

             {/* Info Button for Desktop */}
             <button onClick={() => setShowAbout(true)} className="hidden sm:block p-2 text-gray-400 hover:text-french-blue hover:bg-blue-50 rounded-full transition-colors">
               <Info className="w-6 h-6" />
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-4 py-4 sm:py-8 flex flex-col items-center">
        
        {/* Loading State */}
        {gameState === GameState.LOADING && (
          <div className="w-full flex flex-col items-center gap-8 animate-pulse mt-10">
            <div className={`h-8 w-64 ${SHIMMER_CLASS}`}></div>
            <div className={`h-24 w-full max-w-md ${SHIMMER_CLASS}`}></div>
            <div className={`h-32 w-full ${SHIMMER_CLASS}`}></div>
            <div className="mt-4 text-gray-400 text-sm font-medium">{t('loading')}</div>
          </div>
        )}

        {gameState === GameState.ERROR && (
           <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md mt-10">
             <div className="text-french-blue mb-4 bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
               <Database className="w-8 h-8"/>
             </div>
             <h2 className="text-xl font-bold text-gray-800 mb-2">{t('error_title')}</h2>
             <p className="text-gray-500 mb-6 text-sm">{t('error_desc')}</p>
             <button onClick={loadNewPuzzle} className="px-6 py-3 bg-french-blue text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
               {t('retry')}
             </button>
           </div>
        )}

        {(gameState === GameState.PLAYING || gameState === GameState.SUCCESS) && puzzle && (
          <>
            {/* The Challenge - Card Area */}
            <div className="w-full text-center mb-6 sm:mb-8 px-1">
              <div className="relative inline-block w-full max-w-lg">
                
                {/* Card Background & Content */}
                <div className="bg-white px-4 py-5 sm:px-12 sm:py-6 rounded-3xl shadow-lg shadow-blue-100/50 border border-blue-50 relative overflow-hidden transition-all duration-300">
                  <span className="block text-[10px] sm:text-xs text-gray-400 font-bold tracking-[0.2em] uppercase mb-2">
                    {t('objective')}
                  </span>
                  <div className="text-3xl sm:text-5xl font-display font-black text-french-dark tracking-tight">
                    <span className="text-french-blue">{puzzle.pronoun}</span> 
                    <span className="mx-1 sm:mx-2 text-gray-300">·</span>
                    <span className="text-french-red relative inline-block">
                      {puzzle.verb}
                      <svg className="absolute w-full h-2 bottom-0 sm:bottom-1 left-0 text-red-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                        <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                      </svg>
                    </span>
                  </div>
                  <div className="text-sm sm:text-lg font-medium text-gray-400 mt-1 sm:mt-2">
                    {tTense(puzzle.tense)}
                  </div>

                  {/* MOBILE ONLY: Hint Button */}
                  <button
                      onClick={() => setShowHint(!showHint)}
                      className={`sm:hidden absolute bottom-2 right-2 p-2.5 rounded-full shadow-sm border transition-all z-20 ${
                        showHint 
                          ? 'bg-blue-600 text-white border-blue-600 rotate-12' 
                          : 'bg-white/50 hover:bg-white backdrop-blur-sm text-gray-400 border-transparent hover:border-gray-100 hover:text-french-blue'
                      }`}
                      aria-label={t('hint')}
                  >
                      {showHint ? <BrainCircuit className="w-5 h-5" /> : <Lightbulb className="w-5 h-5" />}
                  </button>
                </div>

                {/* MOBILE ONLY: Rule Bubble */}
                {showHint && (
                   <div className="sm:hidden w-full mt-3 animate-in slide-in-from-top-2 fade-in duration-300">
                      <div className="mx-auto bg-blue-600 text-white text-xs px-4 py-3 rounded-2xl shadow-md border border-blue-400/50 text-center relative z-10">
                        <div className="flex items-center justify-center gap-2 mb-1 opacity-80">
                          <BookOpen className="w-3 h-3" />
                          <span className="uppercase font-bold tracking-widest text-[10px]">{t('rules')}</span>
                        </div>
                        {translatedRuleSummary}
                      </div>
                   </div>
                )}
              </div>

              {/* DESKTOP ONLY: Original Centered Hint Row */}
              <div className="hidden sm:flex justify-center mt-6 h-10">
                {!showHint ? (
                  <button onClick={() => setShowHint(true)} className="flex items-center gap-2 text-sm bg-white text-french-blue hover:bg-blue-50 px-4 py-2 rounded-full border border-blue-100 shadow-sm transition-all">
                    <Lightbulb className="w-4 h-4" />
                    <span className="font-semibold">{t('hint')}</span>
                  </button>
                ) : (
                  <button onClick={() => setShowHint(false)} className="flex items-center justify-center gap-2 text-sm bg-blue-50 text-blue-800 hover:bg-blue-100 px-4 py-2 rounded-full border border-blue-100 shadow-sm animate-in fade-in zoom-in-95 transition-colors cursor-pointer">
                    <BrainCircuit className="w-4 h-4" />
                    <span className="font-semibold">{translatedRuleSummary}</span>
                  </button>
                )}
              </div>
            </div>

            {/* --- DROP ZONES (PUZZLE AREA) --- */}
            {/* Force single row on Desktop (sm:flex-row) regardless of Aux */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-10 w-full transition-all duration-300">
              
              {/* GROUP 1: AUXILIARY (Optional) */}
              {isCompound && (
                <div className="flex items-center justify-center bg-amber-50 p-1 sm:p-1.5 rounded-2xl shadow-sm border border-amber-100">
                  <DropZone 
                    type="aux-stem" 
                    content={selectedAuxStem} 
                    placeholder="Aux" 
                    onClear={() => setSelectedAuxStem(null)}
                    onDrop={(text) => setSelectedAuxStem(text)}
                    isCorrect={gameState === GameState.SUCCESS ? true : null}
                    position={puzzle.auxEnding !== null ? 'left' : 'single'}
                  />
                  {puzzle.auxEnding !== null && (
                    <DropZone 
                      type="aux-ending" 
                      content={selectedAuxEnding} 
                      placeholder={t('ending_zone')} 
                      onClear={() => setSelectedAuxEnding(null)}
                      onDrop={(text) => setSelectedAuxEnding(text)}
                      isCorrect={gameState === GameState.SUCCESS ? true : null}
                      position="right"
                    />
                  )}
                </div>
              )}

              {/* Connecting Icon between Aux and Verb */}
              {isCompound && (
                 <Plus className="text-gray-300 w-4 h-4 sm:w-5 sm:h-5 rotate-90 sm:rotate-0" />
              )}

              {/* GROUP 2: MAIN VERB */}
              <div className="flex items-center justify-center bg-blue-50 p-1 sm:p-1.5 rounded-2xl shadow-sm border border-blue-100">
                <DropZone 
                  type="stem" 
                  content={selectedStem} 
                  placeholder={puzzle.is_regular ? t('stem_zone') : t('stem_zone')} 
                  onClear={() => setSelectedStem(null)}
                  onDrop={(text) => setSelectedStem(text)}
                  isCorrect={gameState === GameState.SUCCESS ? true : (feedback && !feedback.includes(t('correct')) ? false : null)}
                  position={puzzle.correctEnding !== null ? 'left' : 'single'}
                />
                
                {/* Only show ending drop zone if correctEnding is not null */}
                {puzzle.correctEnding !== null && (
                  <DropZone 
                    type="ending" 
                    content={selectedEnding} 
                    placeholder={t('ending_zone')} 
                    onClear={() => setSelectedEnding(null)}
                    onDrop={(text) => setSelectedEnding(text)}
                    isCorrect={gameState === GameState.SUCCESS ? true : (feedback && !feedback.includes(t('correct')) ? false : null)}
                    position="right"
                  />
                )}
              </div>
            </div>

            {/* --- PIECES TRAY (CANDIDATES) --- */}
            {/* LAYOUT LOGIC BASED ON TRAY COUNT */}
            <div className="w-full max-w-4xl mt-0">
              {gameState !== GameState.SUCCESS && (
                <>
                
                  {/* CASE 1: ALL 4 TRAYS (Compound + Split Aux + Split Verb) */}
                  {trayCount === 4 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                       {/* Mobile: 2 rows (2 cols each). Desktop: 1 row (4 cols). */}
                       {/* Internal Grid: Mobile=2x2 (grid-cols-2). Desktop=1x4 (sm:grid-cols-1) vertical stack. */}
                       <AuxStemTray gridClass="grid grid-cols-2 sm:grid-cols-1 gap-2 w-full justify-items-center" />
                       <AuxEndTray gridClass="grid grid-cols-2 sm:grid-cols-1 gap-2 w-full justify-items-center" />
                       <VerbStemTray gridClass="grid grid-cols-2 sm:grid-cols-1 gap-2 w-full justify-items-center" />
                       <VerbEndTray gridClass="grid grid-cols-2 sm:grid-cols-1 gap-2 w-full justify-items-center" />
                    </div>
                  )}

                  {/* CASE 2: 3 TRAYS (e.g. Aux(single) + Verb(split)) */}
                  {trayCount === 3 && (
                     <div className="flex flex-col gap-3 w-full sm:flex-row sm:justify-center">
                        {/* 1 Row on Desktop. Trays themselves auto-sized. */}
                        
                        {!hasAuxEnd ? (
                           // Lonely Aux Stem
                           <AuxStemTray 
                             gridClass="grid grid-cols-4 sm:grid-cols-1 gap-2 w-full justify-items-center" 
                             containerClass="w-full sm:w-fit"
                           />
                        ) : (
                          // Lonely Verb Stem
                          <VerbStemTray 
                             gridClass="grid grid-cols-4 sm:grid-cols-1 gap-2 w-full justify-items-center"
                             containerClass="w-full sm:w-fit"
                          />
                        )}
                        
                        {/* The 'Pair' - Wrapped for Mobile 2-col, Desktop Flex */}
                        <div className="grid grid-cols-2 gap-3 w-full sm:flex sm:w-auto sm:gap-3">
                            {!hasAuxEnd ? (
                               <>
                                 <VerbStemTray 
                                   gridClass="grid grid-cols-2 sm:grid-cols-1 gap-2 w-full justify-items-center"
                                   containerClass="w-full sm:w-fit"
                                 />
                                 <VerbEndTray 
                                   gridClass="grid grid-cols-2 sm:grid-cols-1 gap-2 w-full justify-items-center"
                                   containerClass="w-full sm:w-fit"
                                 />
                               </>
                            ) : (
                               <>
                                 <AuxStemTray 
                                   gridClass="grid grid-cols-2 sm:grid-cols-1 gap-2 w-full justify-items-center"
                                   containerClass="w-full sm:w-fit"
                                 />
                                 <AuxEndTray 
                                   gridClass="grid grid-cols-2 sm:grid-cols-1 gap-2 w-full justify-items-center"
                                   containerClass="w-full sm:w-fit"
                                 />
                               </>
                            )}
                        </div>
                     </div>
                  )}

                  {/* CASE 3: 2 TRAYS (Standard Regular Verb) */}
                  {trayCount === 2 && (
                    <div className="grid grid-cols-2 sm:flex sm:flex-row justify-center gap-3 w-full">
                        {/* Side by Side on Desktop (centered flex) and Mobile (grid). 2x2 grid inside. */}
                        {/* ADDED sm:gap-4 to gridClass for internal spacing */}
                        {hasAuxStem ? (
                          <>
                            <AuxStemTray 
                              gridClass="grid grid-cols-2 gap-2 sm:gap-4 w-full justify-items-center" 
                              containerClass="w-full sm:w-fit"
                            />
                            {hasAuxEnd ? (
                              <AuxEndTray 
                                gridClass="grid grid-cols-2 gap-2 sm:gap-4 w-full justify-items-center"
                                containerClass="w-full sm:w-fit"
                              />
                            ) : (
                              <VerbStemTray 
                                gridClass="grid grid-cols-2 gap-2 sm:gap-4 w-full justify-items-center"
                                containerClass="w-full sm:w-fit"
                              />
                            )}
                          </>
                        ) : (
                          <>
                            <VerbStemTray 
                              gridClass="grid grid-cols-2 gap-2 sm:gap-4 w-full justify-items-center"
                              containerClass="w-full sm:w-fit"
                            />
                            <VerbEndTray 
                              gridClass="grid grid-cols-2 gap-2 sm:gap-4 w-full justify-items-center"
                              containerClass="w-full sm:w-fit"
                            />
                          </>
                        )}
                    </div>
                  )}

                  {/* CASE 4: 1 TRAY (Simple Irregular Verb) */}
                  {trayCount === 1 && (
                    <div className="w-full flex justify-center">
                       {/* Desktop: Centered, w-fit ensures border shrinks. w-full removed from inner container on desktop. */}
                       <VerbStemTray 
                         gridClass="grid grid-cols-4 sm:flex sm:flex-wrap sm:justify-center gap-2 sm:gap-3 w-full sm:px-8 justify-items-center" 
                         containerClass="w-full sm:w-fit sm:max-w-5xl"
                       />
                    </div>
                  )}

                </>
              )}
            </div>

            {/* Feedback & Result */}
            {feedback && (
              <div className={`mt-6 sm:mt-8 p-4 sm:p-6 rounded-2xl border-2 text-center animate-in zoom-in-95 duration-300 ${
                gameState === GameState.SUCCESS ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <h3 className={`text-xl sm:text-2xl font-display font-bold mb-2 ${
                   gameState === GameState.SUCCESS ? 'text-green-700' : 'text-red-700'
                }`}>
                  {feedback}
                </h3>
                {gameState === GameState.SUCCESS && (
                  <div className="space-y-4 mt-4">
                    <div className="text-base sm:text-lg text-green-900 bg-white/60 inline-block px-4 py-2 sm:px-6 rounded-xl">
                      {puzzle.pronoun} 
                      <span className="font-bold ml-2">
                        {puzzle.auxStem ? `${puzzle.auxStem}${puzzle.auxEnding || ''} ` : ''}
                        <span className="border-b-2 border-green-500">{puzzle.correctStem}{puzzle.correctEnding || ''}</span>
                      </span>
                    </div>
                    <p className="text-sm text-green-700 italic flex items-center justify-center gap-2">
                      <span>{currentLangObj.flag}</span> "{puzzle.translation}"
                    </p>
                    <div className="text-sm bg-green-100/50 p-4 rounded-xl text-left text-green-900 border border-green-100 mt-4">
                       <span className="font-bold block mb-1 text-xs uppercase opacity-70 flex items-center gap-1">
                         <BookOpen className="w-3 h-3" /> {t('explanation')}
                       </span>
                       {puzzle.explanation}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Sticky Action Footer */}
            <div className="fixed bottom-0 left-0 right-0 p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40 flex justify-center gap-3 sm:gap-4 sm:static sm:bg-transparent sm:border-0 sm:shadow-none sm:mt-8 sm:backdrop-blur-none">
              {gameState === GameState.SUCCESS ? (
                 <button 
                 onClick={loadNewPuzzle}
                 className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-french-dark text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-bold shadow-xl hover:bg-gray-800 hover:scale-105 transition-all active:scale-95 ring-4 ring-gray-100"
               >
                 <span>{t('next')}</span>
                 <ArrowRight className="w-5 h-5" />
               </button>
              ) : (
                <>
                   <button 
                    onClick={handleSkip}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 px-4 py-3 sm:px-6 rounded-xl font-semibold transition-colors hover:bg-gray-100 bg-gray-50 sm:bg-transparent"
                  >
                    <RefreshCw className="w-5 h-5" />
                    <span>{t('skip')}</span>
                  </button>
                  <button 
                    onClick={handleCheck}
                    disabled={!isComplete}
                    className={`flex-[2] sm:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold shadow-lg transition-all ${
                      isComplete 
                      ? 'bg-french-blue text-white shadow-blue-200 hover:scale-105 active:scale-95' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <span>{t('check')}</span>
                  </button>
                </>
              )}
            </div>

          </>
        )}
      </main>

      <GrammarModal isOpen={showGrammar} onClose={() => setShowGrammar(false)} />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} selectedTenses={selectedTenses} onSave={handleSettingsSave} />
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
    </div>
  );
};

export default App;