
import { GrammarRule } from "./types";

export const GRAMMAR_RULES: GrammarRule[] = [
  // --- Simple Tenses ---
  {
    id: "Présent",
    title: "Présent de l'Indicatif",
    formula: "Base: Radical du Présent + Terminaisons",
    description: "Le temps de base. Les terminaisons varient selon le groupe (-e, -es, -e... ou -s, -s, -t...). C'est souvent la source des autres radicaux.",
    example: "Je parle (Parl- + -e)",
    color: "bg-gray-100 border-gray-500 text-gray-900"
  },
  {
    id: "Passé Composé",
    title: "Le Passé Composé",
    formula: "Auxiliaire (Présent) + Participe Passé",
    description: "L'auxiliaire Avoir ou Être conjugué au Présent, suivi du Participe Passé du verbe.",
    example: "J'ai mangé",
    color: "bg-red-100 border-red-500 text-red-900"
  },
  {
    id: "Imparfait",
    title: "L'Imparfait",
    formula: "Base: Présent 'Nous' + Terminaisons Imparfait",
    description: "Prenez la forme 'Nous' du présent (ex: nous finissons), coupez le '-ons' pour le radical (finiss-), ajoutez : -ais, -ais, -ait, -ions, -iez, -aient.",
    example: "Je finissais (Finiss- + -ais)",
    color: "bg-orange-100 border-orange-500 text-orange-900"
  },
  {
    id: "Futur Simple",
    title: "Le Futur Simple",
    formula: "Base: Infinitif + Terminaisons 'Avoir'",
    description: "Le radical est l'infinitif complet (ex: Manger-). Les terminaisons sont celles du verbe Avoir au présent : -ai, -as, -a, -ons, -ez, -ont.",
    example: "Je mangerai (Manger- + -ai)",
    color: "bg-blue-100 border-blue-500 text-blue-900"
  },
  {
    id: "Conditionnel Présent",
    title: "Le Conditionnel Présent",
    formula: "Base: Radical du Futur + Terminaisons Imparfait",
    description: "Utilise le radical du Futur Simple (l'infinitif) avec les terminaisons de l'Imparfait (-ais, -ais, -ait, -ions, -iez, -aient).",
    example: "Je mangerais (Manger- + -ais)",
    color: "bg-purple-100 border-purple-500 text-purple-900"
  },
  {
    id: "Subjonctif Présent",
    title: "Le Subjonctif Présent",
    formula: "Base: Présent 'Ils' + Terminaisons Subjonctif",
    description: "Prenez la forme 'Ils' du présent (ex: ils viennent), enlevez '-ent' (vienn-). Ajoutez : -e, -es, -e, -ions, -iez, -ent.",
    example: "Que je vienne (Vienn- + -e)",
    color: "bg-emerald-100 border-emerald-500 text-emerald-900"
  },
  {
    id: "Plus-que-parfait",
    title: "Le Plus-que-parfait",
    formula: "Auxiliaire (Imparfait) + Participe Passé",
    description: "L'auxiliaire Avoir ou Être conjugué à l'Imparfait, suivi du Participe Passé.",
    example: "J'avais mangé",
    color: "bg-yellow-100 border-yellow-500 text-yellow-900"
  },
  {
    id: "Futur Antérieur",
    title: "Le Futur Antérieur",
    formula: "Auxiliaire (Futur) + Participe Passé",
    description: "L'auxiliaire conjugué au Futur Simple + Participe Passé.",
    example: "J'aurai fini",
    color: "bg-cyan-100 border-cyan-500 text-cyan-900"
  },
  {
    id: "Conditionnel Passé",
    title: "Le Conditionnel Passé",
    formula: "Auxiliaire (Conditionnel) + Participe Passé",
    description: "L'auxiliaire conjugué au Conditionnel Présent + Participe Passé.",
    example: "J'aurais voulu",
    color: "bg-indigo-100 border-indigo-500 text-indigo-900"
  },
  {
    id: "Subjonctif Passé",
    title: "Le Subjonctif Passé",
    formula: "Aux (Subj. Présent) + Participe Passé",
    description: "L'auxiliaire conjugué au Subjonctif Présent + Participe Passé.",
    example: "Que j'aie fini",
    color: "bg-green-100 border-green-500 text-green-900"
  },
  {
    id: "Passé Antérieur",
    title: "Le Passé Antérieur",
    formula: "Auxiliaire (Passé Simple) + Participe Passé",
    description: "L'auxiliaire conjugué au Passé Simple + Participe Passé. Rare, littéraire.",
    example: "J'eus fini",
    color: "bg-zinc-100 border-zinc-500 text-zinc-900"
  },
  {
    id: "Subjonctif Plus-que-parfait",
    title: "Le Subjonctif P.Q.P.",
    formula: "Aux (Subj. Imparfait) + Participe Passé",
    description: "Temps littéraire. L'auxiliaire conjugué au Subjonctif Imparfait + Participe Passé.",
    example: "Que j'eusse fini",
    color: "bg-lime-100 border-lime-500 text-lime-900"
  },
  {
    id: "Subjonctif Imparfait",
    title: "Le Subjonctif Imparfait",
    formula: "Base: Passé Simple + Terminaisons (Lit.)",
    description: "Temps littéraire (soutenu). Formé sur la 2ème pers. du singulier du Passé Simple + -sse, -sses, -^t, -ssions, -ssiez, -ssent.",
    example: "Que je parlasse, Qu'il fût",
    color: "bg-teal-100 border-teal-500 text-teal-900"
  },
  {
    id: "Passé Simple",
    title: "Le Passé Simple",
    formula: "Base: Radical Spécial + Terminaisons Spécifiques",
    description: "Temps littéraire. Terminaisons en -ai, -is, ou -us selon le groupe. Souvent irrégulier.",
    example: "Il mangea, Il finit",
    color: "bg-stone-100 border-stone-500 text-stone-900"
  },
];

export const ALL_TENSES = GRAMMAR_RULES.map(rule => rule.id);

export const SHIMMER_CLASS = "animate-pulse bg-slate-200 rounded";
