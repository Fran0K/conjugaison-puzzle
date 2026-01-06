
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { DatabasePuzzle, PuzzleData } from '../types';

// Use Vite environment variables
// Cast import.meta to any to avoid TypeScript errors if types are missing
const supabaseUrl = "https://ojpxifdqrehlzodcamhr.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qcHhpZmRxcmVobHpvZGNhbWhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyOTA5NDcsImV4cCI6MjA4MDg2Njk0N30.LATtUWNJgTkL-9tVRp0n2GmpbilFNDH0ziVcS2oZetY"

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing! Please check your .env file.");
}

export const supabase: SupabaseClient | null = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// --- Memory Cache for Verb IDs ---
// Avoids fetching the entire ID list on every single puzzle request
let cachedVerbIds: string[] | null = null;

/**
 * Mapper: Extracts the correct language from JSONB columns
 */
export const mapDatabasePuzzleToUI = (dbPuzzle: DatabasePuzzle, languageCode: string): PuzzleData => {
  // 1. Extract Verb Translation
  // Default to English if specific language is missing
  const verbTranslations = dbPuzzle.verbs?.translations || {};
  const verbTrans = verbTranslations[languageCode] || verbTranslations['en'] || dbPuzzle.verbs?.infinitive || '';

  // 2. Extract Explanation Translation
  const explanationTranslations = dbPuzzle.explanation_translations || {};
  const explanation = explanationTranslations[languageCode] || explanationTranslations['en'] || "No explanation available.";

  return {
    id: dbPuzzle.id,
    verb: dbPuzzle.verbs?.infinitive || 'Unknown',
    tense: dbPuzzle.tense,
    person: dbPuzzle.person,
    pronoun: dbPuzzle.pronoun || dbPuzzle.person, // Fallback to person if pronoun is empty (safety)
    translation: verbTrans,
    is_regular: dbPuzzle.is_regular, 
    
    correctStem: dbPuzzle.correct_stem,
    correctEnding: dbPuzzle.correct_ending || null, // Ensure it is null if empty
    distractorStems: dbPuzzle.distractor_stems,
    distractorEndings: dbPuzzle.distractor_endings || [],

    auxStem: dbPuzzle.aux_stem,
    auxEnding: dbPuzzle.aux_ending,
    auxDistractorStems: dbPuzzle.distractor_aux_stems || [],
    auxDistractorEndings: dbPuzzle.distractor_aux_endings || [],

    explanation: explanation,
    ruleSummary: dbPuzzle.rule_summary 
  };
};

/**
 * Internal helper to ensure we have the list of all verb IDs
 */
const ensureVerbIds = async (): Promise<string[]> => {
  if (cachedVerbIds && cachedVerbIds.length > 0) {
    return cachedVerbIds;
  }

  if (!supabase) return [];

  const { data: verbs, error } = await supabase.from('verbs').select('id');
  
  if (error) {
    console.error('Error fetching verb IDs:', error);
    return [];
  }

  if (verbs) {
    cachedVerbIds = verbs.map(v => v.id);
  }
  
  return cachedVerbIds || [];
};

/**
 * Fetches a single puzzle for a specific random verb ID
 */
const fetchPuzzleForVerbId = async (verbId: string, allowedTenses?: string[], languageCode: string = 'en'): Promise<PuzzleData | null> => {
  if (!supabase) return null;

  let query = supabase
    .from('puzzles')
    .select(`
      *,
      verbs (
        infinitive,
        translations
      )
    `)
    .eq('verb_id', verbId);
  
  if (allowedTenses && allowedTenses.length > 0) {
    query = query.in('tense', allowedTenses);
  }

  const { data: puzzles, error } = await query;

  if (error) {
    console.error(`Error fetching puzzles for verb ${verbId}:`, error);
    return null;
  }

  if (!puzzles || puzzles.length === 0) {
    return null;
  }

  // Pick one random puzzle for this verb
  const randomPuzzleIndex = Math.floor(Math.random() * puzzles.length);
  return mapDatabasePuzzleToUI(puzzles[randomPuzzleIndex] as any, languageCode);
};

/**
 * Public API: Fetch a batch of random puzzles
 * Uses Promise.all to fetch concurrently
 */
export const fetchPuzzleBatch = async (count: number = 1, allowedTenses?: string[], languageCode: string = 'en'): Promise<PuzzleData[]> => {
  if (!supabase) return [];

  try {
    const allVerbIds = await ensureVerbIds();
    
    if (allVerbIds.length === 0) {
      console.warn('Database is empty: No verbs found.');
      return [];
    }

    // Pick 'count' random verb IDs
    // It's okay if we pick the same verb twice in a batch, but we try to be random
    const selectedIds: string[] = [];
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * allVerbIds.length);
      selectedIds.push(allVerbIds[randomIndex]);
    }

    // Execute queries in parallel
    const promises = selectedIds.map(id => fetchPuzzleForVerbId(id, allowedTenses, languageCode));
    const results = await Promise.all(promises);

    // Filter out nulls (failed fetches or verbs with no puzzles in selected tenses)
    return results.filter((p): p is PuzzleData => p !== null);

  } catch (err) {
    console.error("Unexpected error in fetchPuzzleBatch:", err);
    return [];
  }
};

/**
 * Legacy wrapper for backward compatibility (fetches 1)
 */
export const fetchRandomPuzzleFromDB = async (allowedTenses?: string[], languageCode: string = 'en'): Promise<PuzzleData | null> => {
  const batch = await fetchPuzzleBatch(1, allowedTenses, languageCode);
  return batch.length > 0 ? batch[0] : null;
};
