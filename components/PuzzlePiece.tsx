
import React, { useState } from 'react';
import { SlotType } from '../types';

interface PuzzlePieceProps {
  text: string;
  type: SlotType;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
  isCorrect?: boolean | null;
  showConnectors?: boolean;
  fixedWidth?: number;
}

export const PuzzlePiece: React.FC<PuzzlePieceProps> = ({
  text,
  type,
  isSelected,
  onClick,
  disabled,
  isCorrect,
  showConnectors = true,
  fixedWidth
}) => {

  const isStem = type.includes('stem');
  const isAux = type.includes('aux');
  const [isHovered, setIsHovered] = useState(false);

  // --- Theme Color Logic (Material Design) ---
  let bg = "";
  let textClass = "";

  const isActive = isHovered || isSelected;

  if (isAux) {
    bg = isActive ? "#fb923c" : "#fed8aa";
    textClass = isActive ? "text-[#ffffff]" : "text-[#9b3412]";
  } else {
    bg = isActive ? "#0ca5e9" : "#bae6fe";
    textClass = isActive ? "text-[#ffffff]" : "text-[#036aa2]";
  }

  if (isCorrect === true) {
    bg = "#22c55e";
    textClass = "text-white";
  } else if (isCorrect === false) {
    bg = "#EF4135";
    textClass = "text-white";
  }

  const bgStyle: React.CSSProperties = { backgroundColor: bg };

  // Connector sizing
  const tabSize = 'w-5 h-5 sm:w-7 sm:h-7';
  const tabOffset = 'right-[-10px] sm:right-[-14px]';
  const slotOffset = 'left-[-10px] sm:left-[-14px]';

  // --- Shape Logic ---
  let shapeClass = "";

  if (isStem) {
    if (showConnectors) {
      shapeClass = "rounded-l-lg rounded-r-none pr-3 pl-2 py-2 sm:pr-4 sm:pl-3 sm:py-3";
    } else {
      shapeClass = "rounded-xl px-2 py-2 sm:px-4 sm:py-3";
    }
  } else {
    shapeClass = "rounded-r-lg rounded-l-none pl-3 pr-2 py-2 sm:pl-4 sm:pr-3 sm:py-3";
  }

  const handleDragStart = (e: React.DragEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("text/plain", text);
    e.dataTransfer.setData("application/x-puzzle-type", type);
    e.dataTransfer.effectAllowed = "copy";
  };

  const style: React.CSSProperties = fixedWidth
      ? { minWidth: `${fixedWidth}px`, width: '100%', ...bgStyle }
      : { minWidth: '80px', ...bgStyle };

  const showHoverEffect = !disabled && !isSelected && isCorrect === null;

  return (
    <button
      onClick={!disabled ? onClick : undefined}
      draggable={!disabled}
      onDragStart={handleDragStart}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={style}
      className={`relative group transition-[shadow,transform,background-color,color] duration-300 select-none flex items-center justify-center font-display font-bold text-sm sm:text-xl overflow-visible ${textClass} ${shapeClass} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'} ${showHoverEffect ? 'hover:-translate-y-1 hover:shadow-clay-hover hover:-rotate-z-[2deg]' : ''}`}
    >

      {/* Convex tab (stem): circle protrudes right, same bg color */}
      {isStem && showConnectors && (
        <div
          className={`absolute ${tabOffset} top-1/2 -translate-y-1/2 ${tabSize} rounded-full transition-colors duration-300`}
          style={bgStyle}
        />
      )}

      {/* Concave slot (ending): circle matches tray background color */}
      {!isStem && showConnectors && (
        <div
          className={`absolute ${slotOffset} top-1/2 -translate-y-1/2 ${tabSize} rounded-full`}
          style={{ backgroundColor: isAux ? '#ffedd5' : '#e1f3fe' }}
        />
      )}

      <span className="relative z-30 px-1">{text}</span>
    </button>
  );
};
