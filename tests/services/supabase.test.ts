import { describe, it, expect } from 'vitest';
import { mapDatabasePuzzleToUI } from '../../services/supabase';
import { DatabasePuzzle } from '../../types';

describe('Supabase Service', () => {
  describe('mapDatabasePuzzleToUI', () => {
    const mockDbPuzzle: DatabasePuzzle = {
      id: '123',
      verb_id: 'v1',
      tense: 'Présent',
      person: 'Je',
      pronoun: "J'",
      is_regular: true,
      correct_stem: 'parl',
      correct_ending: 'e',
      distractor_stems: ['fin'],
      distractor_endings: ['es'],
      aux_stem: null,
      aux_ending: null,
      distractor_aux_stems: null,
      distractor_aux_endings: null,
      rule_summary: 'Rule...',
      explanation_translations: {
        en: 'English Expl',
        fr: 'French Expl'
      },
      created_at: '2024-01-01',
      verbs: {
        id: 'v1',
        infinitive: 'parler',
        translations: {
          en: 'to speak',
          zh: '说话'
        },
        verb_group: '1_er_regular',
        is_etre: false,
        created_at: '2024-01-01'
      }
    };

    it('should map database fields to UI PuzzleData correctly', () => {
      const result = mapDatabasePuzzleToUI(mockDbPuzzle, 'en', 'English Expl', 'Rule...');

      expect(result.id).toBe('123');
      expect(result.verb).toBe('parler');
      expect(result.translation).toBe('to speak'); // en
      expect(result.correctStem).toBe('parl');
      expect(result.correctEnding).toBe('e');
      expect(result.pronoun).toBe("J'");
      expect(result.explanation).toBe('English Expl');
      expect(result.ruleSummary).toBe('Rule...');
    });

    it('should fallback to English if requested language is missing', () => {
      const result = mapDatabasePuzzleToUI(mockDbPuzzle, 'ja');
      expect(result.translation).toBe('to speak'); // Fallback to EN
    });

    it('should default explanation when not provided', () => {
      const result = mapDatabasePuzzleToUI(mockDbPuzzle, 'en');
      expect(result.explanation).toBe('No explanation available.');
    });

    it('should handle compound tenses (Auxiliary)', () => {
        const compoundMock = {
            ...mockDbPuzzle,
            aux_stem: 'av',
            aux_ending: 'ai',
            distractor_aux_stems: ['su'],
            distractor_aux_endings: ['is']
        };
        const result = mapDatabasePuzzleToUI(compoundMock, 'fr');

        expect(result.auxStem).toBe('av');
        expect(result.auxEnding).toBe('ai');
        expect(result.auxDistractorStems).toEqual(['su']);
    });

    it('should pass isEtre flag through to UI', () => {
        const result = mapDatabasePuzzleToUI(mockDbPuzzle, 'en', 'Expl', 'Rule', true);
        expect(result.isEtre).toBe(true);

        const resultFalse = mapDatabasePuzzleToUI(mockDbPuzzle, 'en', 'Expl', 'Rule', false);
        expect(resultFalse.isEtre).toBe(false);
    });
  });
});