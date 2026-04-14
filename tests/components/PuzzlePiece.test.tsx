import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PuzzlePiece } from '../../components/PuzzlePiece';

describe('PuzzlePiece', () => {
  const onClickMock = vi.fn();

  const defaultProps = {
    text: 'TestPiece',
    type: 'stem' as const,
    isSelected: false,
    onClick: onClickMock,
  };

  beforeEach(() => {
    onClickMock.mockClear();
  });

  it('renders the text correctly', () => {
    render(<PuzzlePiece {...defaultProps} />);
    expect(screen.getByText('TestPiece')).toBeInTheDocument();
  });

  it('handles click events', () => {
    render(<PuzzlePiece {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('applies selected styles when isSelected is true', () => {
    render(<PuzzlePiece {...defaultProps} isSelected={true} />);
    const button = screen.getByRole('button');
    // Active verb color is applied via inline style
    expect(button).toHaveStyle({ backgroundColor: '#0ca5e9' });
  });

  it('does not fire click when disabled', () => {
    render(<PuzzlePiece {...defaultProps} disabled={true} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClickMock).not.toHaveBeenCalled();
  });

  it('renders correct style for Auxiliary type', () => {
    render(<PuzzlePiece {...defaultProps} type="aux-stem" />);
    const button = screen.getByRole('button');
    // Inactive aux color is applied via inline style
    expect(button).toHaveStyle({ backgroundColor: '#fed8aa' });
  });

  it('respects fixedWidth prop when provided', () => {
    const width = 150;
    render(<PuzzlePiece {...defaultProps} fixedWidth={width} />);
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({ minWidth: `${width}px`, width: '100%' });
  });

  it('applies fontSize prop as inline style', () => {
    render(<PuzzlePiece {...defaultProps} fontSize={18} />);
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({ fontSize: '18px' });
  });

  it('defaults to 14px font size on mobile', () => {
    render(<PuzzlePiece {...defaultProps} isDesktop={false} />);
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({ fontSize: '14px' });
  });

  it('defaults to 20px font size on desktop', () => {
    render(<PuzzlePiece {...defaultProps} isDesktop={true} />);
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({ fontSize: '20px' });
  });
});
