
import React, { useState } from 'react';
import { SlotType } from '../types';
import { COLORS, CONNECTOR } from '../theme';

interface PuzzlePieceProps {
  text: string;
  type: SlotType;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
  isCorrect?: boolean | null;
  showConnectors?: boolean;
  fixedWidth?: number;
  fontSize?: number;
  isDesktop?: boolean;
}

export const PuzzlePiece: React.FC<PuzzlePieceProps> = ({
  text,
  type,
  isSelected,
  onClick,
  disabled,
  isCorrect,
  showConnectors = true,
  fixedWidth,
  fontSize,
  isDesktop = false,
}) => {
  const isStem = type.includes('stem');
  const isAux = type.includes('aux');
  const [isHovered, setIsHovered] = useState(false);

  // --- Color Logic ---
  const colorSet = isAux ? COLORS.aux : COLORS.verb;
  const isActive = isHovered || isSelected;

  let bg = isActive ? colorSet.active : colorSet.inactive;
  let textColor = isActive ? colorSet.textActive : colorSet.text;

  if (isCorrect === true) {
    bg = COLORS.feedback.correct;
    textColor = '#ffffff';
  } else if (isCorrect === false) {
    bg = COLORS.feedback.incorrect;
    textColor = '#ffffff';
  }

  const conn = isDesktop ? CONNECTOR.desktop : CONNECTOR.mobile;
  const r = conn.protrusion;
  const showHoverEffect = !disabled && !isSelected && isCorrect === null;
  const effectiveFontSize = fontSize ?? (isDesktop ? 20 : 14);

  const handleDragStart = (e: React.DragEvent) => {
    if (disabled) { e.preventDefault(); return; }
    e.dataTransfer.setData("text/plain", text);
    e.dataTransfer.setData("application/x-puzzle-type", type);
    e.dataTransfer.effectAllowed = "copy";
  };

  // ===== Two rendering paths =====

  // --- Path A: With connectors (mask凸/凹) ---
  if (showConnectors) {
    let maskValue: string;
    let borderRadius: string;
    let padStyle: React.CSSProperties;

    if (isStem) {
      // Right凸: rectangular body + circular bump on right
      maskValue = `radial-gradient(${r}px at calc(100% - ${r}px) 50%, #000 calc(100% - 1px), transparent), linear-gradient(#000 0 0) 0 0 / calc(100% - ${r}px) 100% no-repeat`;
      borderRadius = isDesktop ? '12px 0 0 12px' : '8px 0 0 8px';
      padStyle = {
        paddingLeft: isDesktop ? '16px' : '8px',
        paddingRight: isDesktop ? `${16 + Math.round(r / 2)}px` : `${8 + Math.round(r / 2)}px`,
        paddingBlock: isDesktop ? '12px' : '8px',
      };
    } else {
      // Left凹: rectangular body with semicircular indent on left
      maskValue = `radial-gradient(${r}px at 0% 50%, transparent calc(100% - 1px), #000)`;
      borderRadius = isDesktop ? '0 12px 12px 0' : '0 8px 8px 0';
      padStyle = {
        paddingInline: isDesktop ? '16px' : '8px',
        paddingBlock: isDesktop ? '12px' : '8px',
      };
    }

    const dropShadow = (isHovered && showHoverEffect) ? 'drop-shadow(-4px 4px 0px rgb(0,0,0))' : undefined;

    return (
      <button
        onClick={!disabled ? () => { setIsHovered(false); onClick(); } : undefined}
        draggable={!disabled}
        onDragStart={handleDragStart}
        disabled={disabled}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          backgroundColor: bg,
          color: textColor,
          fontSize: `${effectiveFontSize}px`,
          ...(fixedWidth ? { minWidth: `${fixedWidth}px`, width: '100%' } : { minWidth: '80px' }),
          mask: maskValue,
          WebkitMask: maskValue,
          borderRadius,
          ...(dropShadow ? { filter: dropShadow } : {}),
          ...padStyle,
        }}
        className={`select-none flex items-center justify-center font-display font-bold transition-[filter,transform,background-color,color] duration-300 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'} ${showHoverEffect ? 'hover:-translate-y-1' : ''}`}
      >
        <span className="relative z-30 px-1">{text}</span>
      </button>
    );
  }

  // --- Path B: Without connectors (plain rounded square) ---
  const bRadius = isDesktop ? 12 : 8;
  const dropShadowB = (isHovered && showHoverEffect) ? 'drop-shadow(-4px 4px 0px rgb(0,0,0))' : undefined;

  return (
    <button
      onClick={!disabled ? () => { setIsHovered(false); onClick(); } : undefined}
      draggable={!disabled}
      onDragStart={handleDragStart}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: bg,
        color: textColor,
        fontSize: `${effectiveFontSize}px`,
        ...(fixedWidth ? { minWidth: `${fixedWidth}px`, width: '100%' } : { minWidth: '80px' }),
        borderRadius: `${bRadius}px`,
        clipPath: `inset(0 round ${bRadius}px)`,
        ...(dropShadowB ? { filter: dropShadowB } : {}),
      }}
      className={`select-none flex items-center justify-center font-display font-bold transition-[filter,transform,background-color,color] duration-300 ${isDesktop ? 'px-4 py-3' : 'px-2 py-2'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'} ${showHoverEffect ? 'hover:-translate-y-1' : ''}`}
    >
      <span className="relative z-30 px-1">{text}</span>
    </button>
  );
};
