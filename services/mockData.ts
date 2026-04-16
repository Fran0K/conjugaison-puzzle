import { PuzzleData } from '../types';

// --- Mock puzzles covering different UI states ---
// Simple tense, compound tense, with/without example

const MOCK_PUZZLES: PuzzleData[] = [
  {
    id: 'mock-1',
    verb: 'choisir',
    tense: 'Conditionnel Présent',
    person: 'tu',
    pronoun: 'Tu',
    translation: 'to choose',
    is_regular: true,
    correctStem: 'choisir',
    correctEnding: 'ais',
    distractorStems: ['choisi', 'choisiss', 'chois'],
    distractorEndings: ['ai', 'ois', 'as'],
    explanation: 'The conditional uses the infinitive "choisir" plus the ending "-ais" for "tu".',
    ruleSummary: 'Infinitive + conditional endings.',
    example: {
      id: 'ex-1',
      sentence: 'Tu choisirais quel restaurant pour ce soir ?',
      translations: {
        en: 'Which restaurant would you choose for tonight?',
        zh: '今晚你会选哪家餐厅？',
        ja: '今夜はどのレストランを選ぶだろうか？',
      },
    },
  },
  {
    id: 'mock-2',
    verb: 'savoir',
    tense: 'Futur Antérieur',
    person: 'je',
    pronoun: "j'",
    translation: 'to know',
    is_regular: false,
    correctStem: 'su',
    correctEnding: null,
    distractorStems: ['savu', 'saché', 'sit'],
    distractorEndings: ['e', 'is', 'it'],
    auxStem: 'aur',
    auxEnding: 'ai',
    auxDistractorStems: ['ser', 'av', 'a'],
    auxDistractorEndings: ['ais', 'as', 'a'],
    explanation: 'The futur antérieur uses "avoir" in future + "su".',
    ruleSummary: 'Compound tense using avoir (future) + "su".',
    example: {
      id: 'ex-2',
      sentence: "D'ici demain, j'aurai su comment résoudre ce problème.",
      translations: {
        en: 'By tomorrow, I will have known how to solve this problem.',
        zh: '到明天，我就会知道如何解决这个问题了。',
        ja: '明日までには、この問題の解決方法を知っているだろう。',
      },
    },
  },
  {
    id: 'mock-3',
    verb: 'parler',
    tense: 'Indicatif Présent',
    person: 'nous',
    pronoun: 'Nous',
    translation: 'to speak',
    is_regular: true,
    correctStem: 'parl',
    correctEnding: 'ons',
    distractorStems: ['parle', 'parlons', 'parl'],
    distractorEndings: ['ez', 'es', 'e'],
    explanation: 'Regular -er verb: stem "parl" + ending "-ons" for "nous".',
    ruleSummary: 'Stem + -ons.',
    // No example — tests the case where example is undefined
  },
  {
    id: 'mock-4',
    verb: 'partir',
    tense: 'Passé Composé',
    person: 'il',
    pronoun: 'Il',
    translation: 'to leave',
    is_regular: false,
    correctStem: 'parti',
    correctEnding: null,
    distractorStems: ['partu', 'partant', 'partis'],
    distractorEndings: ['e', 'is', 'es'],
    auxStem: 'est',
    auxEnding: null,
    auxDistractorStems: ['a', 'ét', 'soy'],
    auxDistractorEndings: ['it', 'es', 'ons'],
    explanation: 'Passé composé with "être" + past participle "parti" for "il".',
    ruleSummary: 'être (present) + parti.',
    example: {
      id: 'ex-4',
      sentence: 'Il est parti très tôt ce matin.',
      translations: {
        en: 'He left very early this morning.',
        zh: '他今天一大早就走了。',
        ja: '彼は今朝とても早く出発した。',
      },
    },
  },
];

export const MOCK_DELAY_MS = 500;

/**
 * Returns mock puzzle data, cycling through the array.
 * Simulates network delay.
 */
export const fetchMockPuzzleBatch = async (
  count: number = 1,
  _allowedTenses?: string[],
  _languageCode: string = 'en',
): Promise<PuzzleData[]> => {
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY_MS));

  const results: PuzzleData[] = [];
  for (let i = 0; i < count; i++) {
    results.push(MOCK_PUZZLES[i % MOCK_PUZZLES.length]);
  }
  return results;
};
