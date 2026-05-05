
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

// --- Memory Cache for Rule Templates ---
// This table is small (~100-200 rows) and rarely changes.
// Fetched once and kept in memory for the session.
let ruleTemplatesCache: Map<string, Record<string, string> | null> | null = null;

const getTemplateCacheKey = (verbGroup: string, tense: string, person: string | null) =>
  `${verbGroup}:${tense}:${person ?? 'NULL'}`;

const ensureRuleTemplatesCache = async (): Promise<Map<string, Record<string, string> | null>> => {
  if (ruleTemplatesCache) return ruleTemplatesCache;
  if (!supabase) return new Map();

  const { data, error } = await supabase
    .from('rule_templates')
    .select('verb_group, tense, person, template_content');

  if (error || !data) {
    console.error('Failed to fetch rule_templates:', error);
    return new Map();
  }

  ruleTemplatesCache = new Map();
  for (const row of data as any[]) {
    const key = getTemplateCacheKey(row.verb_group, row.tense, row.person);
    ruleTemplatesCache.set(key, row.template_content || null);
  }
  return ruleTemplatesCache;
};

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
 * Fetch explanation using the fallback chain:
 * 1. puzzle_appendices (exact: verb_id + tense + person)
 * 2. puzzle_appendices (tense-level: verb_id + tense + person=null)
 * 3. rule_templates cache (verb_group + tense + person) — no network call
 * 4. rule_templates cache (verb_group + tense + person=null) — no network call
 */
export const fetchExplanation = async (
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

  // Level 3 & 4: Use rule_templates cache (no network calls)
  const cache = await ensureRuleTemplatesCache();

  const l3Key = getTemplateCacheKey(verbGroup, tense, person);
  const cachedL3 = cache.get(l3Key);
  if (cachedL3) {
    let content = cachedL3[languageCode] || cachedL3['en'] || "";
    content = content.replace(/\{ending\}/g, correctEnding || '');
    if (content) return { explanation: content, ruleSummary: "" };
  }

  const l4Key = getTemplateCacheKey(verbGroup, tense, null);
  const cachedL4 = cache.get(l4Key);
  if (cachedL4) {
    let content = cachedL4[languageCode] || cachedL4['en'] || "";
    content = content.replace(/\{ending\}/g, correctEnding || '');
    if (content) return { explanation: content, ruleSummary: "" };
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

  if (verbs) {
    cachedVerbIds = verbs.map(v => v.id);
  }

  return cachedVerbIds || [];
};

/**
 * Phase 1: Fetch puzzle data only (fast, 1 query per verb).
 * Returns puzzle without explanation + metadata needed for background explanation fetch.
 */
interface PuzzleCoreResult {
  puzzle: PuzzleData;
  verbId: string;
  verbGroup: string;
}

const fetchPuzzleCore = async (
  verbId: string,
  allowedTenses?: string[],
  languageCode: string = 'en'
): Promise<PuzzleCoreResult | null> => {
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

  if (error || !puzzles || puzzles.length === 0) {
    return null;
  }

  const randomPuzzleIndex = Math.floor(Math.random() * puzzles.length);
  const dbPuzzle = puzzles[randomPuzzleIndex] as any;

  const verbGroup = dbPuzzle.verbs?.verb_group || '';
  const isEtre = dbPuzzle.verbs?.is_etre ?? false;

  const puzzle = mapDatabasePuzzleToUI(dbPuzzle, languageCode, "", "", isEtre);
  puzzle.explanationLoading = true;

  return { puzzle, verbId, verbGroup };
};

/**
 * Batch-fetch appendices for multiple puzzles.
 * Returns a Map keyed by `${verbId}:${tense}:${person}` or `${verbId}:${tense}:NULL`.
 */
const fetchAppendixBatch = async (
  params: Array<{ verbId: string; tense: string; person: string }>,
  languageCode: string,
): Promise<Map<string, { explanation: string; ruleSummary: string }>> => {
  const result = new Map<string, { explanation: string; ruleSummary: string }>();

  if (!supabase || params.length === 0) return result;

  // Build OR filter combining exact-person and null-person matches
  const filters = params.flatMap(p => [
    `and(verb_id.eq.${p.verbId},tense.eq.${p.tense},person.eq.${p.person})`,
    `and(verb_id.eq.${p.verbId},tense.eq.${p.tense},person.is.null)`,
  ]);

  const { data, error } = await supabase
    .from('puzzle_appendices')
    .select('verb_id, tense, person, rule_summary, explanation_translations')
    .or(filters.join(','));

  if (error || !data) return result;

  for (const row of data as any[]) {
    const personKey = row.person ?? 'NULL';
    const key = `${row.verb_id}:${row.tense}:${personKey}`;
    // Prefer exact-person match over null-person match
    if (personKey === 'NULL' && result.has(`${row.verb_id}:${row.tense}:${row.person}`)) {
      continue; // Don't overwrite exact match with generic match
    }
    const translations = row.explanation_translations || {};
    result.set(key, {
      explanation: translations[languageCode] || translations['en'] || "",
      ruleSummary: row.rule_summary || "",
    });
  }

  return result;
};

/**
 * Public API: Fetch a batch of puzzles WITHOUT waiting for explanations (fast).
 * Returns puzzles immediately with explanationLoading=true.
 * Starts background explanation fetches and calls onExplanationReady when each arrives.
 */
export const fetchPuzzleBatchQuick = async (
  count: number = 1,
  allowedTenses?: string[],
  languageCode: string = 'en',
  onExplanationReady?: (
    puzzleId: string,
    data: { explanation: string; ruleSummary: string }
  ) => void,
): Promise<PuzzleData[]> => {
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
    const selectedIds: string[] = [];
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * allVerbIds.length);
      selectedIds.push(allVerbIds[randomIndex]);
    }

    // Phase 1: Fetch all puzzle cores in parallel (fast, ~1 query each)
    const coreResults = await Promise.all(
      selectedIds.map(id => fetchPuzzleCore(id, allowedTenses, languageCode))
    );

    // Filter nulls
    const validResults: PuzzleCoreResult[] = coreResults.filter(
      (r): r is PuzzleCoreResult => r !== null
    );

    const puzzles = validResults.map(r => r.puzzle);

    // Phase 2: Fire background explanation resolution (truly non-blocking)
    if (onExplanationReady) {
      // Do NOT await — let explanations resolve after puzzles are returned
      Promise.resolve().then(async () => {
        try {
          // Batch-fetch appendices
          const appendixMap = await fetchAppendixBatch(
            validResults.map(r => ({
              verbId: r.verbId,
              tense: r.puzzle.tense,
              person: r.puzzle.person,
            })),
            languageCode,
          );

          // Get rule_templates cache (may trigger 1 fetch if not yet loaded)
          const templateCache = await ensureRuleTemplatesCache();

          // Resolve each puzzle's explanation
          for (const r of validResults) {
            const { puzzle, verbId, verbGroup } = r;

            // Try exact-person appendix match
            const exactKey = `${verbId}:${puzzle.tense}:${puzzle.person}`;
            let appendixData = appendixMap.get(exactKey);

            // Try null-person appendix match
            if (!appendixData) {
              const tenseKey = `${verbId}:${puzzle.tense}:NULL`;
              appendixData = appendixMap.get(tenseKey);
            }

            if (appendixData && appendixData.explanation) {
              onExplanationReady(puzzle.id!, appendixData);
              continue;
            }

            // Try rule_templates cache (L3 + L4, no network calls)
            const l3Key = getTemplateCacheKey(verbGroup, puzzle.tense, puzzle.person);
            const cachedL3 = templateCache.get(l3Key);
            if (cachedL3) {
              let content = cachedL3[languageCode] || cachedL3['en'] || "";
              content = content.replace(/\{ending\}/g, puzzle.correctEnding || '');
              if (content) {
                onExplanationReady(puzzle.id!, { explanation: content, ruleSummary: "" });
                continue;
              }
            }

            const l4Key = getTemplateCacheKey(verbGroup, puzzle.tense, null);
            const cachedL4 = templateCache.get(l4Key);
            if (cachedL4) {
              let content = cachedL4[languageCode] || cachedL4['en'] || "";
              content = content.replace(/\{ending\}/g, puzzle.correctEnding || '');
              if (content) {
                onExplanationReady(puzzle.id!, { explanation: content, ruleSummary: "" });
                continue;
              }
            }

            // No explanation found at any level
            onExplanationReady(puzzle.id!, { explanation: "No explanation available.", ruleSummary: "" });
          }
        } catch (err) {
          console.error("Background explanation fetch failed:", err);
        }
      });
    }

    return puzzles;

  } catch (err) {
    console.error("Unexpected error in fetchPuzzleBatchQuick:", err);
    return [];
  }
};

/**
 * Legacy API: Fetch a batch of random puzzles with explanations (blocking).
 * Uses Promise.all to fetch concurrently.
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

    const selectedIds: string[] = [];
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * allVerbIds.length);
      selectedIds.push(allVerbIds[randomIndex]);
    }

    // Execute queries in parallel
    const promises = selectedIds.map(async (id) => {
      const core = await fetchPuzzleCore(id, allowedTenses, languageCode);
      if (!core) return null;

      const { explanation, ruleSummary } = await fetchExplanation(
        core.verbId,
        core.verbGroup,
        core.puzzle.tense,
        core.puzzle.person,
        core.puzzle.correctEnding,
        languageCode,
      );

      core.puzzle.explanation = explanation;
      core.puzzle.ruleSummary = ruleSummary;
      core.puzzle.explanationLoading = false;
      return core.puzzle;
    });

    const results = await Promise.all(promises);
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
