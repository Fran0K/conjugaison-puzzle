
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
    color: "bg-gray-100 border-gray-500 text-gray-900",
  },
  {
    id: "Passé Composé",
    example: "J'ai mangé. Je suis allé",
    color: "bg-red-100 border-red-500 text-red-900",
  },
  {
    id: "Imparfait",
    example: "Je finissais",
    color: "bg-orange-100 border-orange-500 text-orange-900",
  },
  {
    id: "Futur Simple",
    example: "Je mangerai",
    color: "bg-blue-100 border-blue-500 text-blue-900",
  },
  {
    id: "Conditionnel Présent",
    example: "Je mangerais",
    color: "bg-purple-100 border-purple-500 text-purple-900"
  },
  {
    id: "Subjonctif Présent",
    example: "Que je vienne",
    color: "bg-emerald-100 border-emerald-500 text-emerald-900",
  },
  {
    id: "Plus-que-parfait",
    example: "J'avais fini",
    color: "bg-yellow-100 border-yellow-500 text-yellow-900"
  },
  // {
  //   id: "Subjonctif Imparfait",
  //   example: "Qu'il parlât, qu'il fût",
  //   color: "bg-teal-100 border-teal-500 text-teal-900",
  // },
  {
    id: "Futur Antérieur",
    example: "J'aurai terminé",
    color: "bg-cyan-100 border-cyan-500 text-cyan-900"
  },
  {
    id: "Conditionnel Passé",
    example: "J'aurais dû venir",
    color: "bg-indigo-100 border-indigo-500 text-indigo-900"
  },
  {
    id: "Subjonctif Passé",
    example: "Que j'aie fini",
    color: "bg-green-100 border-green-500 text-green-900"
  },
  // {
  //   id: "Subjonctif Plus-que-parfait",
  //   example: "Que j'eusse fini",
  //   color: "bg-lime-100 border-lime-500 text-lime-900"
  // }
];

export const ALL_TENSES = GRAMMAR_RULES.map(rule => rule.id!);

// Default selection for new users: Present, Compound Past, Imperfect
export const DEFAULT_TENSES = ["Présent", "Passé Composé", "Imparfait"];

export const SHIMMER_CLASS = "animate-pulse bg-slate-200 rounded";
