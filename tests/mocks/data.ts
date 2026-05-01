import { PuzzleData } from '../../types';

export const mockPuzzleData: PuzzleData = {
  id: 'test-1',
  verb: 'parler',
  tense: 'Présent',
  person: 'Je',
  pronoun: 'Je',
  translation: 'to speak',
  is_regular: true,
  correctStem: 'parl',
  correctEnding: 'e',
  distractorStems: ['fin'],
  distractorEndings: ['es', 'ons'],
  auxStem: null,
  auxEnding: null,
  auxDistractorStems: [],
  auxDistractorEndings: [],
  explanation: 'Test Explanation',
  ruleSummary: 'Rule Summary'
};

export const mockCompoundPuzzleData: PuzzleData = {
  id: 'test-compound-1',
  verb: 'manger',
  tense: 'Passé Composé',
  person: 'Je',
  pronoun: "J'",
  translation: 'to have eaten',
  is_regular: true,
  
  // Auxiliary (J'ai)
  auxStem: 'a',
  auxEnding: 'i', // Often empty for simple auxiliaries, but testing structure
  auxDistractorStems: ['su'],
  auxDistractorEndings: ['is'],

  // Participle (mangé)
  correctStem: 'mang',  
  correctEnding: 'é',
  distractorStems: ['parl'],
  distractorEndings: ['er', 'ez'],
  
  explanation: 'Compound Explanation',
  ruleSummary: 'Aux + PP'
};