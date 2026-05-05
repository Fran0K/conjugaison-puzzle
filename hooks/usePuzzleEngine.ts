import { useState, useRef, useCallback, useEffect } from 'react';
import { fetchPuzzleBatchQuick } from '../services/supabase';
import { PuzzleData, GameState } from '../types';
import { Language } from '../locales';

// Configuration for the puzzle queue
const INITIAL_BATCH_SIZE = 5;
const REFILL_THRESHOLD = 2;
const REFILL_BATCH_SIZE = 3;

export const usePuzzleEngine = (
  language: Language,
  selectedTenses: string[]
) => {
  const [puzzle, setPuzzle] = useState<PuzzleData | null>(null);
  const [gameState, setGameState] = useState<GameState>(GameState.LOADING);

  // Internal Queue State
  const puzzleQueue = useRef<PuzzleData[]>([]);
  const isFetchingRef = useRef(false);

  // Callback for background explanation resolution
  const handleExplanationReady = useCallback(
    (puzzleId: string, data: { explanation: string; ruleSummary: string }) => {
      // Update the puzzle in the queue if it's still there
      puzzleQueue.current = puzzleQueue.current.map(p =>
        p.id === puzzleId
          ? { ...p, ...data, explanationLoading: false }
          : p
      );

      // If this is the currently displayed puzzle, update it directly
      setPuzzle(prev =>
        prev && prev.id === puzzleId
          ? { ...prev, ...data, explanationLoading: false }
          : prev
      );
    },
    []
  );

  // Background fetch to keep the queue populated
  const fetchMore = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      const newPuzzles = await fetchPuzzleBatchQuick(
        REFILL_BATCH_SIZE,
        selectedTenses,
        language,
        handleExplanationReady,
      );
      puzzleQueue.current = [...puzzleQueue.current, ...newPuzzles];
    } catch (e) {
      console.error("Bg fetch failed", e);
    } finally {
      isFetchingRef.current = false;
    }
  }, [language, selectedTenses, handleExplanationReady]);

  // Core function to rotate to the next puzzle
  const loadNextPuzzle = useCallback(async () => {
    // 1. Try to pop from Queue
    if (puzzleQueue.current.length > 0) {
      const next = puzzleQueue.current.shift()!;
      setPuzzle(next);
      setGameState(GameState.PLAYING); // Reset state to PLAYING

      // Trigger background refill if needed
      if (puzzleQueue.current.length <= REFILL_THRESHOLD) {
        fetchMore();
      }
      return;
    }

    // 2. Queue is Empty (Cold Start or Network Lag) -> Fetch Directly
    setGameState(GameState.LOADING);
    setPuzzle(null);

    try {
      const newPuzzles = await fetchPuzzleBatchQuick(
        INITIAL_BATCH_SIZE,
        selectedTenses,
        language,
        handleExplanationReady,
      );
      if (newPuzzles && newPuzzles.length > 0) {
        puzzleQueue.current = newPuzzles;
        const first = puzzleQueue.current.shift()!;
        setPuzzle(first);
        setGameState(GameState.PLAYING);
      } else {
        setGameState(GameState.ERROR);
      }
    } catch (e) {
      console.error(e);
      setGameState(GameState.ERROR);
    }
  }, [fetchMore, language, selectedTenses, handleExplanationReady]);

  // Initial Load / Reset when dependencies (Language/Tenses) change
  useEffect(() => {
    // Flush queue to ensure we don't show stale puzzles (e.g. wrong language)
    puzzleQueue.current = [];
    loadNextPuzzle();
  }, [language, selectedTenses, loadNextPuzzle]);

  return {
    puzzle,
    gameState,
    setGameState, // Expose setter so the Game Logic can set SUCCESS state
    loadNextPuzzle
  };
};
