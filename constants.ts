
import { GrammarRule } from "./types";
import { Language } from "./locales";

export const STORAGE_KEYS = {
  LANGUAGE: 'app_language_pref',
  TENSES: 'app_tenses_pref',
  ONBOARDING: 'app_has_seen_tutorial_v2',
};

export const SUPPORTED_LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
];

/**
 * Metadata for Grammar Rules.
 * Text content is now managed in locales.ts for i18n support.
 */
export const GRAMMAR_RULES: Partial<GrammarRule>[] = [
  {
    id: "Présent",
    example: "Je parle. Je finis. Je prends",
    level: "A1",
  },
  {
    id: "Passé Composé",
    example: "J'ai mangé. Je suis allé",
    level: "A2",
  },
  {
    id: "Imparfait",
    example: "Je finissais",
    level: "A2",
  },
  {
    id: "Futur Simple",
    example: "Je mangerai",
    level: "A2",
  },
  {
    id: "Conditionnel Présent",
    example: "Je mangerais",
    level: "B1",
  },
  {
    id: "Subjonctif Présent",
    example: "Que je vienne",
    level: "B1",
  },
  {
    id: "Plus-que-parfait",
    example: "J'avais fini",
    level: "B1",
  },
  // {
  //   id: "Subjonctif Imparfait",
  //   example: "Qu'il parlât, qu'il fût",
  //   level: "B2",
  // },
  {
    id: "Futur Antérieur",
    example: "J'aurai terminé",
    level: "B2",
  },
  {
    id: "Conditionnel Passé",
    example: "J'aurais dû venir",
    level: "B2",
  },
  {
    id: "Subjonctif Passé",
    example: "Que j'aie fini",
    level: "B2",
  },
  // {
  //   id: "Subjonctif Plus-que-parfait",
  //   example: "Que j'eusse fini",
  //   level: "B2"
  // }
];

export const ALL_TENSES = GRAMMAR_RULES.map(rule => rule.id!);

// Default selection for new users: Present, Compound Past, Imperfect
export const DEFAULT_TENSES = ["Présent", "Passé Composé", "Imparfait"];

export const SHIMMER_CLASS = "animate-pulse bg-oat-light rounded";
