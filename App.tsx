
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { fetchPuzzleBatch } from './services/supabase';
import { PuzzleData, GameState, SlotType, TrayConfig } from './types';
import { DropZone } from './components/DropZone';
import { TrayGroup } from './components/TrayGroup';
import { GrammarModal } from './components/GrammarModal';
import { SettingsModal } from './components/SettingsModal';
import { AboutModal } from './components/AboutModal';
import { TutorialOverlay, TutorialStep } from './components/TutorialOverlay';
import { ALL_TENSES, SHIMMER_CLASS } from './constants';
import { BookOpen, RefreshCw, ArrowRight, Database, Settings, Lightbulb, ChevronDown, Info, Plus, Search } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { Language } from './locales';
import { cleanAndShuffle } from './utils';

// --- APP ---

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
];

const TENSES_STORAGE_KEY = 'app_tenses_pref';
const ONBOARDING_STORAGE_KEY = 'app_has_seen_tutorial_v2'; 

// Queue Configuration
const INITIAL_BATCH_SIZE = 5;
const REFILL_THRESHOLD = 2;
const REFILL_BATCH_SIZE = 3;

const App: React.FC = () => {
  const { t, tTense, tRule, language, setLanguage } = useLanguage();

  const [gameState, setGameState] = useState<GameState>(GameState.LOADING);
  const [puzzle, setPuzzle] = useState<PuzzleData | null>(null);
  
  // Queue State
  const puzzleQueue = useRef<PuzzleData[]>([]);
  const isFetchingRef = useRef(false); // Semaphore to prevent double fetching

  // Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [selectedTenses, setSelectedTenses] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(TENSES_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) { console.warn("Failed to parse saved tenses pref"); }
      }
    }
    return ALL_TENSES;
  });

  const [showHint, setShowHint] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  // Refs
  const langBtnRef = useRef<HTMLDivElement>(null);
  const settingsBtnRef = useRef<HTMLButtonElement>(null);
  const objectiveRef = useRef<HTMLDivElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const trayRef = useRef<HTMLDivElement>(null);
  const grammarRef = useRef<HTMLButtonElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  // Available pieces
  const [availableStems, setAvailableStems] = useState<string[]>([]);
  const [availableEndings, setAvailableEndings] = useState<string[]>([]);
  const [availableAuxStems, setAvailableAuxStems] = useState<string[]>([]);
  const [availableAuxEndings, setAvailableAuxEndings] = useState<string[]>([]);
  
  // User selection
  const [selectedStem, setSelectedStem] = useState<string | null>(null);
  const [selectedEnding, setSelectedEnding] = useState<string | null>(null);
  const [selectedAuxStem, setSelectedAuxStem] = useState<string | null>(null);
  const [selectedAuxEnding, setSelectedAuxEnding] = useState<string | null>(null);
  
  const [showGrammar, setShowGrammar] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Init
  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      const hasSeen = localStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (!hasSeen) {
        setTimeout(() => setShowTutorial(true), 800);
      }
    }
  }, [gameState]);

  const handleTutorialComplete = () => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    setShowTutorial(false);
  };

  const handleRestartTutorial = () => setShowTutorial(true);

  // --- Puzzle Logic ---

  const setupPuzzleState = (newPuzzle: PuzzleData) => {
    setPuzzle(newPuzzle);
    setAvailableStems(cleanAndShuffle(newPuzzle.correctStem, newPuzzle.distractorStems));
    
    if (newPuzzle.correctEnding !== null) {
       setAvailableEndings(cleanAndShuffle(newPuzzle.correctEnding, newPuzzle.distractorEndings));
    } else {
       setAvailableEndings([]);
    }

    if (newPuzzle.auxStem) {
      setAvailableAuxStems(cleanAndShuffle(newPuzzle.auxStem, newPuzzle.auxDistractorStems));
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
  };

  const fetchMorePuzzles = async (count: number) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      const newPuzzles = await fetchPuzzleBatch(count, selectedTenses, language);
      puzzleQueue.current = [...puzzleQueue.current, ...newPuzzles];
    } catch (e) {
      console.error("Bg fetch failed", e);
    } finally {
      isFetchingRef.current = false;
    }
  };

  const loadNewPuzzle = useCallback(async () => {
    // Reset UI state
    setFeedback(null);
    setSelectedStem(null);
    setSelectedEnding(null);
    setSelectedAuxStem(null);
    setSelectedAuxEnding(null);
    setShowHint(false); 
    
    // 1. Check Queue
    if (puzzleQueue.current.length > 0) {
      // Instant Load
      const nextPuzzle = puzzleQueue.current.shift()!;
      setupPuzzleState(nextPuzzle);

      // Background Refill if low
      if (puzzleQueue.current.length <= REFILL_THRESHOLD) {
        fetchMorePuzzles(REFILL_BATCH_SIZE);
      }
    } else {
      // 2. Queue Empty (Cold start or network lag)
      setGameState(GameState.LOADING);
      try {
        const newPuzzles = await fetchPuzzleBatch(INITIAL_BATCH_SIZE, selectedTenses, language);
        if (newPuzzles && newPuzzles.length > 0) {
          puzzleQueue.current = newPuzzles;
          const first = puzzleQueue.current.shift()!;
          setupPuzzleState(first);
        } else {
          setGameState(GameState.ERROR);
        }
      } catch (error) {
        console.error(error);
        setGameState(GameState.ERROR);
      }
    }
  }, [selectedTenses, language]);

  // Initial Load
  useEffect(() => { loadNewPuzzle(); }, []);

  // Flush queue when settings change to ensure fresh data
  useEffect(() => {
    puzzleQueue.current = [];
    if (gameState !== GameState.LOADING) {
       loadNewPuzzle();
    }
  }, [selectedTenses, language]);

  const handleCheck = () => {
    if (!puzzle) return;
    const isStemCorrect = selectedStem === puzzle.correctStem;
    const isEndingCorrect = puzzle.correctEnding !== null ? (selectedEnding === puzzle.correctEnding) : true;
    let isAuxCorrect = true;
    if (puzzle.auxStem) {
        const isAuxStemCorrect = selectedAuxStem === puzzle.auxStem;
        const isAuxEndingCorrect = puzzle.auxEnding !== null ? selectedAuxEnding === puzzle.auxEnding : true;
        isAuxCorrect = isAuxStemCorrect && isAuxEndingCorrect;
    }

    if (isStemCorrect && isEndingCorrect && isAuxCorrect) {
      setGameState(GameState.SUCCESS);
      setFeedback(t('correct'));
    } else {
      setFeedback(t('wrong'));
      setTimeout(() => {
          setFeedback((current) => current === t('wrong') ? null : current);
      }, 3000);
    }
  };

  const handleSkip = () => loadNewPuzzle();
  
  const handleSettingsSave = (newTenses: string[]) => {
      setSelectedTenses(newTenses);
      localStorage.setItem(TENSES_STORAGE_KEY, JSON.stringify(newTenses));
  };

  const selectLanguage = (lang: Language) => {
    setLanguage(lang);
    setIsLangMenuOpen(false);
  };

  const clearFeedback = () => {
    if (feedback && gameState !== GameState.SUCCESS) setFeedback(null);
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
       if (puzzle.correctEnding !== null) {
          isComplete = !!selectedStem && !!selectedEnding;
       } else {
          isComplete = !!selectedStem;
       }
    }
  }
  
  const localizedRuleObj = puzzle ? tRule(puzzle.tense) : null;
  // -- hint message --
  const translatedRuleFormula = localizedRuleObj ? localizedRuleObj.formula : "";
  const currentLangObj = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];
  const showAuxConnectors = puzzle ? (puzzle.auxEnding !== null) : false;
  const showVerbConnectors = puzzle ? (puzzle.correctEnding !== null) : false;

  const hasAuxStem = availableAuxStems.length > 0;
  const hasAuxEnd = availableAuxEndings.length > 0;
  const hasVerbStem = availableStems.length > 0;
  const hasVerbEnd = availableEndings.length > 0;

  // --- TRAY CONFIGURATION ---
  const auxTrays: TrayConfig[] = useMemo(() => {
    const trays = [];
    if (hasAuxStem) {
      trays.push({
        id: 'aux-stem',
        items: availableAuxStems,
        type: 'aux-stem' as SlotType,
        selected: selectedAuxStem,
        onSelect: (item: string) => { setSelectedAuxStem(prev => prev === item ? null : item); clearFeedback(); },
        title: hasAuxEnd ? t('lbl_aux_stem') : t('lbl_aux'),
        color: 'amber' as const,
        showConnectors: showAuxConnectors
      });
    }
    if (hasAuxEnd) {
      trays.push({
        id: 'aux-ending',
        items: availableAuxEndings,
        type: 'aux-ending' as SlotType,
        selected: selectedAuxEnding,
        onSelect: (item: string) => { setSelectedAuxEnding(prev => prev === item ? null : item); clearFeedback(); },
        title: t('lbl_aux_ending'),
        color: 'amber' as const
      });
    }
    return trays;
  }, [hasAuxStem, hasAuxEnd, availableAuxStems, availableAuxEndings, selectedAuxStem, selectedAuxEnding, showAuxConnectors, t]);

  const verbTrays: TrayConfig[] = useMemo(() => {
    const trays = [];
    if (hasVerbStem) {
      trays.push({
        id: 'stem',
        items: availableStems,
        type: 'stem' as SlotType,
        selected: selectedStem,
        onSelect: (item: string) => { setSelectedStem(prev => prev === item ? null : item); clearFeedback(); },
        title: hasVerbEnd ? t('lbl_verb_stem') : t('lbl_verb'),
        color: 'blue' as const,
        showConnectors: showVerbConnectors
      });
    }
    if (hasVerbEnd) {
      trays.push({
        id: 'ending',
        items: availableEndings,
        type: 'ending' as SlotType,
        selected: selectedEnding,
        onSelect: (item: string) => { setSelectedEnding(prev => prev === item ? null : item); clearFeedback(); },
        title: t('lbl_verb_ending'),
        color: 'blue' as const
      });
    }
    return trays;
  }, [hasVerbStem, hasVerbEnd, availableStems, availableEndings, selectedStem, selectedEnding, showVerbConnectors, t]);

  // Combine trays for the layout engine
  const allTrays = [...auxTrays, ...verbTrays];

  // Mobile DropZone Layout Strategy:
  const isCompactDropZone = allTrays.length <= 2;

  const tutorialSteps: TutorialStep[] = [
    { targetRef: objectiveRef, titleKey: 'tour_obj_title', descKey: 'tour_obj_desc', position: 'bottom' },
    { targetRef: dropZoneRef, titleKey: 'tour_zone_title', descKey: 'tour_zone_desc', position: 'bottom' },
    { targetRef: trayRef, titleKey: 'tour_tray_title', descKey: 'tour_tray_desc', position: 'top' },
    { targetRef: footerRef, titleKey: 'tour_footer_title', descKey: 'tour_footer_desc', position: 'top' },
    { targetRef: langBtnRef, titleKey: 'tour_lang_title', descKey: 'tour_lang_desc', position: 'bottom' },
    { targetRef: settingsBtnRef, titleKey: 'tour_settings_title', descKey: 'tour_settings_desc', position: 'bottom' },
    { targetRef: grammarRef, titleKey: 'tour_grammar_title', descKey: 'tour_grammar_desc', position: 'bottom' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-french-blue selection:text-white pb-20 sm:pb-15">
      
      {isLangMenuOpen && (
        <div className="fixed inset-0 z-20 cursor-default" onClick={() => setIsLangMenuOpen(false)} />
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <img 
                src="/img/logo_desk.png" 
                alt={t('title')} 
                className="hidden sm:block h-10 w-auto object-contain" 
              />
              <img 
                src="/img/logo_mobi.png" 
                alt={t('title')} 
                className="block sm:hidden h-8 w-auto object-contain" 
              />
          </div>
            <h1 className="text-xl font-display font-bold text-french-dark hidden sm:block">
              {t('title')}
            </h1>
        </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
             <div className="relative" ref={langBtnRef}>
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

            <button ref={settingsBtnRef} onClick={() => setShowSettings(true)} className="p-2 text-gray-400 hover:text-french-blue hover:bg-blue-50 rounded-full transition-colors">
              <Settings className="w-6 h-6" />
            </button>
            <button ref={grammarRef} onClick={() => setShowGrammar(true)} className="p-2 text-gray-400 hover:text-french-blue hover:bg-blue-50 rounded-full transition-colors">
              <BookOpen className="w-6 h-6" />
            </button>
             <button onClick={() => setShowAbout(true)} className="p-2 text-gray-400 hover:text-french-blue hover:bg-blue-50 rounded-full transition-colors">
               <Info className="w-6 h-6" />
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-4 py-4 sm:py-8 flex flex-col items-center">
        
        {gameState === GameState.LOADING && (
          <div className="w-full flex flex-col items-center gap-4 animate-pulse mt-10">
            <div className={`h-24 w-full  ${SHIMMER_CLASS}`}></div>
            <div className={`h-16 w-full ${SHIMMER_CLASS}`}></div>
            <div className={`h-40 w-full ${SHIMMER_CLASS}`}></div>
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
            {/* Objective Card */}
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
                  <div className="text-sm sm:text-lg font-medium text-gray-400 mt-1 sm:mt-2">
                    {tTense(puzzle.tense)}
                  </div>
                  <button
                      onClick={() => setShowHint(!showHint)}
                      className={`absolute bottom-2 right-2 p-2.5 rounded-full shadow-sm border transition-all z-20 ${
                        showHint 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white/50 hover:bg-white backdrop-blur-sm text-gray-400 border-transparent hover:border-gray-100 hover:text-french-blue'
                      }`}
                      aria-label={t('hint')}
                  >
                      {showHint ? <Lightbulb className="w-5 h-5" /> : <Lightbulb className="w-5 h-5" />}
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

            {/* Drop Zones */}
            <div ref={dropZoneRef} className={`flex ${isCompactDropZone ? 'flex-row' : 'flex-col'} sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-10 w-full transition-all duration-300`}>
              {isCompound && (
                <div className="flex items-center justify-center bg-amber-50 p-1 sm:p-1.5 rounded-2xl shadow-sm border border-amber-100">
                  <DropZone 
                    type="aux-stem" 
                    content={selectedAuxStem} 
                    placeholder={puzzle.is_regular ? t('stem_zone') : t('stem_zone')} 
                    onClear={() => { setSelectedAuxStem(null); clearFeedback(); }}
                    onDrop={(text) => { setSelectedAuxStem(text); clearFeedback(); }}
                    isCorrect={gameState === GameState.SUCCESS ? true : (feedback ? false : null)}
                    position={puzzle.auxEnding !== null ? 'left' : 'single'}
                  />
                  {puzzle.auxEnding !== null && (
                    <DropZone 
                      type="aux-ending" 
                      content={selectedAuxEnding} 
                      placeholder={t('ending_zone')} 
                      onClear={() => { setSelectedAuxEnding(null); clearFeedback(); }}
                      onDrop={(text) => { setSelectedAuxEnding(text); clearFeedback(); }}
                      isCorrect={gameState === GameState.SUCCESS ? true : (feedback ? false : null)}
                      position="right"
                    />
                  )}
                </div>
              )}

              {isCompound && (
                 <Plus className={`text-gray-300 w-4 h-4 sm:w-5 sm:h-5 ${isCompactDropZone ? 'rotate-0' : 'rotate-90'} sm:rotate-0 transition-transform`} />
              )}

              <div className="flex items-center justify-center bg-blue-50 p-1 sm:p-1.5 rounded-2xl shadow-sm border border-blue-100">
                <DropZone 
                  type="stem" 
                  content={selectedStem} 
                  placeholder={puzzle.is_regular ? t('stem_zone') : t('stem_zone')} 
                  onClear={() => { setSelectedStem(null); clearFeedback(); }}
                  onDrop={(text) => { setSelectedStem(text); clearFeedback(); }}
                  isCorrect={gameState === GameState.SUCCESS ? true : (feedback ? false : null)}
                  position={puzzle.correctEnding !== null ? 'left' : 'single'}
                />
                
                {puzzle.correctEnding !== null && (
                  <DropZone 
                    type="ending" 
                    content={selectedEnding} 
                    placeholder={t('ending_zone')} 
                    onClear={() => { setSelectedEnding(null); clearFeedback(); }}
                    onDrop={(text) => { setSelectedEnding(text); clearFeedback(); }}
                    isCorrect={gameState === GameState.SUCCESS ? true : (feedback ? false : null)}
                    position="right"
                  />
                )}
              </div>
            </div>

            {/* --- SMART TRAY ZONE --- */}
            <div className="w-full max-w-5xl mt-0 mb-6 sm:mb-10" ref={trayRef}>
              {gameState !== GameState.SUCCESS && allTrays.length > 0 && (
                <TrayGroup trays={allTrays} />
              )}
            </div>

            {/* Error Feedback */}
            {gameState !== GameState.SUCCESS && feedback && (
               <div className="mb-6 p-3 rounded-xl border-2 text-center bg-red-50 border-red-200 animate-in zoom-in-95">
                 <h3 className="text-lg font-bold text-red-700">{feedback}</h3>
               </div>
            )}

            {/* Success Feedback */}
            {gameState === GameState.SUCCESS && feedback && (
              <div className="w-full max-w-lg mt-0 pb-2 px-1">
                <div className="p-4 sm:p-6 rounded-3xl border-2 text-center animate-in zoom-in-95 duration-300 bg-green-50 border-green-200">
                  <h3 className="text-xl sm:text-2xl font-display font-bold mb-2 text-green-700">
                    {feedback}
                  </h3>
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
                </div>
              </div>
            )}
            
            {/* Footer - ACTIONS */}
            <div className="fixed bottom-0 left-0 right-0 px-4 py-3 md:py-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-none z-40 flex flex-col items-center justify-center sm:static sm:bg-transparent sm:border-0 sm:backdrop-blur-none">
              <div ref={footerRef} className="flex gap-3 sm:gap-4 w-full justify-center max-w-4xl mx-auto">
                  {gameState === GameState.SUCCESS ? (
                     <button 
                     onClick={loadNewPuzzle}
                     className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-french-dark text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-bold border-2 border-gray-900 shadow-sm hover:bg-gray-800 transition-all active:scale-95 ring-4 ring-gray-100"
                   >
                     <span>{t('next')}</span>
                     <ArrowRight className="w-5 h-5" />
                   </button>
                  ) : (
                    <>
                       <button 
                        onClick={handleSkip}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-gray-600 px-4 py-3 sm:px-6 rounded-xl font-bold transition-all border-2 border-gray-200 bg-white hover:bg-gray-50 shadow-sm active:scale-95"
                      >
                        <RefreshCw className="w-5 h-5" />
                        <span>{t('skip')}</span>
                      </button>
                      <button 
                        onClick={handleCheck}
                        disabled={!isComplete}
                        className={`flex-[2] sm:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold transition-all border-2 ${
                          isComplete 
                          ? 'bg-green-600 text-white border-green-700 shadow-sm hover:bg-green-700 active:scale-95' 
                          : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'
                        }`}
                      >
                        <Search className="w-5 h-5" />
                        <span>{t('check')}</span>
                      </button>
                    </>
                  )}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Modals */}
      <TutorialOverlay isOpen={showTutorial} steps={tutorialSteps} onComplete={handleTutorialComplete} />
      <GrammarModal isOpen={showGrammar} onClose={() => setShowGrammar(false)} />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} selectedTenses={selectedTenses} onSave={handleSettingsSave} />
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} onRestartTutorial={handleRestartTutorial} />
    </div>
  );
};

export default App;
