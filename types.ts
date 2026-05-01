
export enum GameState {
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

// Helper type for granular validation
export interface ValidationState {
  stem?: boolean;
  ending?: boolean;
  auxStem?: boolean;
  auxEnding?: boolean;
}

// Frontend Puzzle Data Interface (used by components)
export interface PuzzleData {
  id?: string;
  verb: string;
  tense: string;
  person: string; // Standard (Je)
  pronoun: string; // Display (J')
  translation: string; // The translated verb meaning
  is_regular: boolean;
  
  // Main Verb (or Participle in compound tenses)
  correctStem: string;
  correctEnding: string | null; // Nullable for indivisible irregulars (e.g. "vais")
  distractorStems: string[];
  distractorEndings: string[];

  // Auxiliary (Optional, for compound tenses only)
  auxStem?: string | null;
  auxEnding?: string | null;
  auxDistractorStems?: string[];
  auxDistractorEndings?: string[];

  explanation: string; // The translated explanation
  ruleSummary: string;
  isEtre?: boolean; // true = verb uses être, frontend shows gender agreement note

  // Example sentence (optional, may not exist for all puzzles)
  example?: ExampleData;
}

export interface ExampleData {
  id: string;
  sentence: string; // French example sentence
  translations: {
    en: string;
    zh: string;
    ja: string;
  };
}

export interface GrammarDetail {
  label: string; // e.g., "1er Groupe (-er)"
  text: string;  // e.g., "Terminaisons: -e, -es, -e..."
  examples?: string;
}

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2';

export interface GrammarRule {
  id: string;
  title: string;
  formula: string;
  description: string;
  example: string;
  level: CEFRLevel;
  details?: GrammarDetail[];
}

// Extended slot types for precise drag and drop validation
export type SlotType = 'stem' | 'ending' | 'aux-stem' | 'aux-ending';

// --- UI / Layout Types ---

export interface TrayConfig {
  id: string;
  items: string[];
  type: SlotType;
  selected: string | null;
  onSelect: (item: string) => void;
  title: string;
  color: 'amber' | 'blue' | 'red';
  showConnectors?: boolean;
}

export interface TrayLayoutState {
  cols: number; // 1, 2, or 4
  pieceWidth: number;
  fontSize: number;    // dynamic font size in px
  isDesktop: boolean;  // for SmartTray padding/connector calculations
}

// --- Database Types (Supabase) ---

export interface DatabaseVerb {
  id: string;
  infinitive: string;
  // JSONB column: { "en": "to eat", "zh": "吃", "ja": "食べる" }
  translations: Record<string, string>;
  verb_group: string; // e.g. '1_er_regular', '3_irregular', '1_er_ger'
  is_etre: boolean; // true = uses être as auxiliary, frontend generates gender agreement note
  created_at: string;
}

export interface DatabasePuzzle {
  id: string;
  verb_id: string;
  tense: string;
  person: string;
  pronoun: string; // Added field
  is_regular: boolean;
  
  // Main Verb / Participle
  correct_stem: string;
  correct_ending: string | null;
  distractor_stems: string[];
  distractor_endings: string[] | null; 
  
  // Auxiliary columns
  aux_stem: string | null;
  aux_ending: string | null;
  distractor_aux_stems: string[] | null;
  distractor_aux_endings: string[] | null;

  rule_summary: string;

  // JSONB column: { "en": "Explanation...", "zh": "解释...", "ja": "解説..." }
  explanation_translations: Record<string, string>;

  created_at: string;

  // Joined fields (aliased from v2 tables)
  verbs?: DatabaseVerb;
  examples?: DatabaseExample[];
}

// --- New Schema Types (rule_templates & puzzle_appendices) ---

export interface DatabaseRuleTemplate {
  id: string;
  verb_group: string;
  tense: string;
  // JSONB: { "zh": "第一组规则动词现在时" }
  rule_summary: Record<string, string>;
  // JSONB: { "zh": "对于以 -er 结尾的动词，去掉词尾，加上 '{ending}'。" }
  template_content: Record<string, string>;
}

export interface DatabasePuzzleAppendix {
  id: string;
  verb_id: string;
  tense: string;
  person: string | null; // null = applies to entire tense
  rule_summary: string;
  // JSONB: { "en": "...", "zh": "...", "ja": "...", "fr": "..." }
  explanation_translations: Record<string, string>;
}

export interface DatabaseExample {
  id: string;
  puzzle_id: string;
  sentence: string;
  translations: Record<string, string>;
}

export interface DatabaseUserHistory {
  id: string;
  user_id: string;
  puzzle_id: string;
  is_correct: boolean;
  attempted_at: string;
}
