
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { DatabasePuzzle, DatabasePuzzleAppendix, DatabaseRuleTemplate, DatabaseVerb, PuzzleData } from '../types';
import { ExampleData } from '../types';
import { fetchMockPuzzleBatch } from './mockData';

const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
const mockMode = params?.get('mock'); // undefined | '' | 'loading'
const useMock = mockMode !== null;

// Use Vite environment variables
// Cast import.meta to any to avoid TypeScript errors if types are missing
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

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
 * Now accepts external explanation/ruleSummary from the fallback query chain.
 */
export const mapDatabasePuzzleToUI = (
  dbPuzzle: DatabasePuzzle,
  languageCode: string,
  explanation: string = "No explanation available.",
  ruleSummary: string = "",
  isEtre: boolean = false,
): PuzzleData => {
  // 1. Extract Verb Translation
  // Default to English if specific language is missing
  const verbTranslations = dbPuzzle.verbs?.translations || {};
  const verbTrans = verbTranslations[languageCode] || verbTranslations['en'] || dbPuzzle.verbs?.infinitive || '';

  // 2. Extract Example Data (optional)
  let example: ExampleData | undefined;
  if (dbPuzzle.examples && dbPuzzle.examples.length > 0) {
    const dbExample = dbPuzzle.examples[Math.floor(Math.random() * dbPuzzle.examples.length)];
    example = {
      id: dbExample.id,
      sentence: dbExample.sentence,
      translations: {
        en: dbExample.translations?.en || '',
        zh: dbExample.translations?.zh || '',
        ja: dbExample.translations?.ja || '',
      }
    };
  }

  return {
    id: dbPuzzle.id,
    verb: dbPuzzle.verbs?.infinitive || 'Unknown',
    tense: dbPuzzle.tense,
    person: dbPuzzle.person,
    pronoun: dbPuzzle.pronoun || dbPuzzle.person,
    translation: verbTrans,
    is_regular: dbPuzzle.is_regular,

    correctStem: dbPuzzle.correct_stem,
    correctEnding: dbPuzzle.correct_ending || null,
    distractorStems: dbPuzzle.distractor_stems,
    distractorEndings: dbPuzzle.distractor_endings || [],

    auxStem: dbPuzzle.aux_stem,
    auxEnding: dbPuzzle.aux_ending,
    auxDistractorStems: dbPuzzle.distractor_aux_stems || [],
    auxDistractorEndings: dbPuzzle.distractor_aux_endings || [],

    explanation,
    ruleSummary,
    isEtre,
    example,
  };
};

/**
 * Fetch explanation using the 3-level fallback chain:
 * 1. puzzle_appendices (exact: verb_id + tense + person)
 * 2. puzzle_appendices (tense-level: verb_id + tense + person=null)
 * 3. rule_templates (verb_group + tense) with placeholder replacement
 */
const fetchExplanation = async (
  verbId: string,
  verbGroup: string,
  tense: string,
  person: string,
  correctEnding: string | null,
  languageCode: string,
): Promise<{ explanation: string; ruleSummary: string }> => {
  if (!supabase) {
    return { explanation: "No supabase explanation available.", ruleSummary: "" };
  }

  // Level 1: Exact person match in puzzle_appendices
  const { data: exactAppendix } = await supabase
    .from('puzzle_appendices')
    .select('rule_summary, explanation_translations')
    .eq('verb_id', verbId)
    .eq('tense', tense)
    .eq('person', person)
    .maybeSingle();

  if (exactAppendix) {
    const translations = (exactAppendix as any).explanation_translations || {};
    return {
      explanation: translations[languageCode] || translations['en'] || "No l1 explanation available.",
      ruleSummary: (exactAppendix as any).rule_summary || "",
    };
  }

  // Level 2: Tense-level match in puzzle_appendices (person=null)
  const { data: tenseAppendix } = await supabase
    .from('puzzle_appendices')
    .select('rule_summary, explanation_translations')
    .eq('verb_id', verbId)
    .eq('tense', tense)
    .is('person', null)
    .maybeSingle();

  if (tenseAppendix) {
    const translations = (tenseAppendix as any).explanation_translations || {};
    return {
      explanation: translations[languageCode] || translations['en'] || "No l2 explanation available.",
      ruleSummary: (tenseAppendix as any).rule_summary || "",
    };
  }

  // Level 3: rule_templates with exact person match (verb_group + tense + person)
  const { data: personTemplate, error: l3err } = await supabase
    .from('rule_templates')
    .select('template_content')
    .eq('verb_group', verbGroup)
    .eq('tense', tense)
    .eq('person', person)
    .maybeSingle();
  console.log('[L3] rule_templates query:', { verbGroup, tense, person }, '→', personTemplate, 'err:', l3err);

  if (personTemplate) {
    const templateContent = (personTemplate as any).template_content || {};
    let content = templateContent[languageCode] || templateContent['en'] || "";
    content = content.replace(/\{ending\}/g, correctEnding || '');
    return {
      explanation: content || "No l3 explanation available.",
      ruleSummary: "",
    };
  }

  // Level 4: rule_templates generic (verb_group + tense, person=null)
  const { data: template, error: l4err } = await supabase
    .from('rule_templates')
    .select('template_content')
    .eq('verb_group', verbGroup)
    .eq('tense', tense)
    .is('person', null)
    .maybeSingle();
  console.log('[L4] rule_templates query:', { verbGroup, tense, person: null }, '→', template, 'err:', l4err);

  if (template) {
    const templateContent = (template as any).template_content || {};
    let content = templateContent[languageCode] || templateContent['en'] || "";
    content = content.replace(/\{ending\}/g, correctEnding || '');
    return {
      explanation: content || "No l4 explanation available.",
      ruleSummary: "",
    };
  }

  return { explanation: "No explanation available.", ruleSummary: "" };
};

/**
 * Internal helper to ensure we have the list of all verb IDs
 */
const ensureVerbIds = async (): Promise<string[]> => {
  if (cachedVerbIds && cachedVerbIds.length > 0) {
    return cachedVerbIds;
  }

  if (!supabase) return [];

  const { data: verbs, error } = await supabase.from('verbs_v2').select('id');

  if (error) {
    console.error('Error fetching verb IDs:', error);
    return [];
  }

  console.log('[ensureVerbIds] count:', verbs?.length, 'table: verbs_v2');

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
    .from('puzzles_v2')
    .select(`
      *,
      verbs:verbs_v2 (
        infinitive,
        translations,
        verb_group,
        is_etre
      ),
      examples:examples_v2 (
        id,
        sentence,
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

  console.log('[fetchPuzzle] puzzles count:', puzzles?.length, 'error:', error);

  if (!puzzles || puzzles.length === 0) {
    return null;
  }

  // Pick one random puzzle for this verb
  const randomPuzzleIndex = Math.floor(Math.random() * puzzles.length);
  const dbPuzzle = puzzles[randomPuzzleIndex] as any;

  // Debug: check what keys the join returns
  console.log('[fetchPuzzle] dbPuzzle keys:', Object.keys(dbPuzzle));
  console.log('[fetchPuzzle] verbs:', dbPuzzle.verbs);

  // Fetch explanation via fallback chain
  const verbGroup = dbPuzzle.verbs?.verb_group || '';
  const { explanation, ruleSummary } = await fetchExplanation(
    verbId,
    verbGroup,
    dbPuzzle.tense,
    dbPuzzle.person,
    dbPuzzle.correct_ending,
    languageCode,
  );

  const isEtre = dbPuzzle.verbs?.is_etre ?? false;

  return mapDatabasePuzzleToUI(dbPuzzle, languageCode, explanation, ruleSummary, isEtre);
};

/**
 * Public API: Fetch a batch of random puzzles
 * Uses Promise.all to fetch concurrently
 */
export const fetchPuzzleBatch = async (count: number = 1, allowedTenses?: string[], languageCode: string = 'en'): Promise<PuzzleData[]> => {
  if (useMock) {
    if (mockMode === 'loading') return new Promise(() => {}); // Stay in LOADING forever
    if (mockMode === 'error') return []; // Trigger ERROR state
    return fetchMockPuzzleBatch(count, allowedTenses, languageCode);
  }

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
