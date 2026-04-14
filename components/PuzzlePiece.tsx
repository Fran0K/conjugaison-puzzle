
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

  // --- Theme Color Logic (from theme.ts) ---
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

  // Connector sizing from theme
  const conn = isDesktop ? CONNECTOR.desktop : CONNECTOR.mobile;
  const tabSizePx = conn.tabSize;
  const tabOffsetPx = conn.protrusion;

  // --- Shape Logic ---
  let shapeClass = "";

  if (isStem) {
    if (showConnectors) {
      shapeClass = "rounded-l-lg rounded-r-none";
    } else {
      shapeClass = "rounded-xl";
    }
  } else {
    shapeClass = "rounded-r-lg rounded-l-none";
  }

  // Padding (responsive)
  const paddingClass = isDesktop
    ? (isStem && showConnectors ? "py-3 pl-3 pr-4" : isStem ? "px-4 py-3" : "pl-4 pr-3 py-3")
    : (isStem && showConnectors ? "py-2 pl-2 pr-3" : isStem ? "px-2 py-2" : "pl-3 pr-2 py-2");

  const handleDragStart = (e: React.DragEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("text/plain", text);
    e.dataTransfer.setData("application/x-puzzle-type", type);
    e.dataTransfer.effectAllowed = "copy";
  };

  const effectiveFontSize = fontSize ?? (isDesktop ? 20 : 14);

  const style: React.CSSProperties = {
    backgroundColor: bg,
    color: textColor,
    fontSize: `${effectiveFontSize}px`,
    ...(fixedWidth ? { minWidth: `${fixedWidth}px`, width: '100%' } : { minWidth: '80px' }),
  };

  const showHoverEffect = !disabled && !isSelected && isCorrect === null;

  return (
    <button
      onClick={!disabled ? () => { setIsHovered(false); onClick(); } : undefined}
      draggable={!disabled}
      onDragStart={handleDragStart}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={style}
      className={`relative group transition-[shadow,transform,background-color,color] duration-300 select-none flex items-center justify-center font-display font-bold overflow-visible ${shapeClass} ${paddingClass} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'} ${showHoverEffect ? 'hover:-translate-y-1 hover:shadow-clay-hover hover:-rotate-z-[2deg]' : ''}`}
    >

      {/* Convex tab (stem): circle protrudes right, same bg color */}
      {isStem && showConnectors && (
        <div
          className="absolute top-1/2 -translate-y-1/2 rounded-full transition-colors duration-300"
          style={{
            backgroundColor: bg,
            width: `${tabSizePx}px`,
            height: `${tabSizePx}px`,
            right: `${-tabOffsetPx}px`,
          }}
        />
      )}

      {/* Concave slot (ending): right semicircle overlay, tray bg color */}
      {!isStem && showConnectors && (
        <div
          className="absolute top-1/2 -translate-y-1/2 rounded-r-full"
          style={{
            backgroundColor: isAux ? COLORS.aux.trayBg : COLORS.verb.trayBg,
            width: `${tabSizePx / 2}px`,
            height: `${tabSizePx}px`,
            left: 0,
          }}
        />
      )}

      <span className="relative z-30 px-1">{text}</span>
    </button>
  );
};
