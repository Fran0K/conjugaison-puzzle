import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FeedbackPanel } from '../../views/FeedbackPanel';
import { LanguageProvider } from '../../LanguageContext';
import { GameState } from '../../types';
import { mockPuzzleData, mockCompoundPuzzleData } from '../mocks/data';

// Mock speechSynthesis
const mockSpeak = vi.fn();
const mockCancel = vi.fn();
const mockResume = vi.fn();
const mockGetVoices = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();

  Object.defineProperty(window, 'speechSynthesis', {
    writable: true,
    value: {
      speak: mockSpeak,
      cancel: mockCancel,
      resume: mockResume,
      getVoices: mockGetVoices.mockReturnValue([
        { name: 'Thomas', lang: 'fr-FR', voiceURI: 'Thomas' },
        { name: 'Google français', lang: 'fr-FR', voiceURI: 'Google français' },
        { name: 'Microsoft Pauline', lang: 'fr-FR', voiceURI: 'Microsoft Pauline' },
      ]),
    },
  });
});

const renderPanel = (props: {
  gameState?: GameState;
  feedback?: string | null;
  puzzle?: any;
  successCount?: number;
  isMilestone?: boolean;
}) => {
  return render(
    <LanguageProvider>
      <FeedbackPanel
        gameState={props.gameState ?? GameState.SUCCESS}
        feedback={props.feedback ?? 'Correct !'}
        puzzle={props.puzzle ?? mockPuzzleData}
        successCount={props.successCount ?? 1}
        isMilestone={props.isMilestone ?? false}
        onMilestoneClick={vi.fn()}
      />
    </LanguageProvider>
  );
};

describe('FeedbackPanel speak button', () => {
  it('renders speak button on success', () => {
    renderPanel({});
    expect(screen.getByTitle('Listen')).toBeInTheDocument();
  });

  it('speaks the correct text for a simple tense', () => {
    renderPanel({ puzzle: mockPuzzleData });
    fireEvent.click(screen.getByTitle('Listen'));

    expect(mockCancel).toHaveBeenCalled();
    expect(mockResume).toHaveBeenCalled();
    expect(mockSpeak).toHaveBeenCalledTimes(1);

    const utterance = mockSpeak.mock.calls[0][0];
    expect(utterance.text).toBe('Je parle');
    expect(utterance.lang).toBe('fr-FR');
  });

  it('speaks the correct text for a compound tense', () => {
    renderPanel({ puzzle: mockCompoundPuzzleData });
    fireEvent.click(screen.getByTitle('Listen'));

    const utterance = mockSpeak.mock.calls[0][0];
    expect(utterance.text).toBe("J' ai mangé");
  });

  it('selects Thomas voice when available', () => {
    renderPanel({ puzzle: mockPuzzleData });
    fireEvent.click(screen.getByTitle('Listen'));

    const utterance = mockSpeak.mock.calls[0][0];
    expect(utterance.voice.name).toBe('Thomas');
  });

  it('falls back to fr-FR voice when Thomas is unavailable', () => {
    mockGetVoices.mockReturnValue([
      { name: 'Google français', lang: 'fr-FR', voiceURI: 'Google français' },
    ]);

    renderPanel({ puzzle: mockPuzzleData });
    fireEvent.click(screen.getByTitle('Listen'));

    const utterance = mockSpeak.mock.calls[0][0];
    expect(utterance.voice.name).toBe('Google français');
  });

  it('does not render speak button when speechSynthesis is unavailable', () => {
    Object.defineProperty(window, 'speechSynthesis', {
      writable: true,
      value: undefined,
    });

    renderPanel({});
    expect(screen.queryByTitle('Listen')).not.toBeInTheDocument();
  });

  it('does not render speak button when not in success state', () => {
    renderPanel({ gameState: GameState.PLAYING, feedback: 'Try again' });
    expect(screen.queryByTitle('Listen')).not.toBeInTheDocument();
  });
});
