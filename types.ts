
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
  
  // Joined fields
  verbs?: DatabaseVerb;
}

export interface DatabaseUserHistory {
  id: string;
  user_id: string;
  puzzle_id: string;
  is_correct: boolean;
  attempted_at: string;
}
