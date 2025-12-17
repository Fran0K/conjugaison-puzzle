
import React from 'react';
import { SlotType } from '../types';

interface PuzzlePieceProps {
  text: string;
  type: SlotType;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
  isCorrect?: boolean | null; 
  showConnectors?: boolean; 
  fixedWidth?: number; // New prop for precise content-based layout
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

  // --- Theme Color Logic ---
  let bgClass = "";
  let textClass = "";
  let borderClass = "";
  let ringClass = "";

  if (isAux) {
     bgClass = "bg-amber-50";
     textClass = "text-amber-900";
     borderClass = "border-amber-300";
  } else {
     bgClass = "bg-blue-50";
     textClass = "text-blue-900";
     borderClass = "border-blue-300";
  }

  if (isSelected) {
    if (isAux) {
      bgClass = "bg-amber-500";
      textClass = "text-white";
      borderClass = "border-amber-600";
      ringClass = "ring-2 sm:ring-4 ring-amber-200";
    } else {
      bgClass = "bg-french-blue";
      textClass = "text-white";
      borderClass = "border-blue-600";
      ringClass = "ring-2 sm:ring-4 ring-blue-200";
    }
  }

  if (isCorrect === true) {
    bgClass = "bg-green-500";
    textClass = "text-white";
    borderClass = "border-green-600";
    ringClass = "ring-2 sm:ring-4 ring-green-200";
  } else if (isCorrect === false) {
    bgClass = "bg-french-red";
    textClass = "text-white";
    borderClass = "border-red-600";
    ringClass = "ring-2 sm:ring-4 ring-red-200";
  }

  const shadowClass = "drop-shadow-sm";
  const borderStyle = (isStem && showConnectors) ? "border-dashed" : "border-solid";

  // Removed w-full to strictly follow content-based layout rules
  const baseClasses = `relative group transition-all duration-200 select-none flex items-center justify-center font-display font-bold text-sm sm:text-xl transform hover:-translate-y-1 active:translate-y-0 overflow-visible ${shadowClass} border-2 ${borderStyle} ${bgClass} ${textClass} ${borderClass} ${ringClass}`;

  // --- Shape Logic ---
  let shapeClass = "";

  // Connectors visuals are purely decorative overlays now, 
  // padding is handled by the layout engine calculation + base styles
  if (isStem) {
    if (showConnectors) {
      shapeClass = "rounded-l-lg rounded-r-none pr-3 pl-2 py-2 sm:pr-6 sm:pl-4 sm:py-4";
    } else {
      shapeClass = "rounded-xl px-1 py-2 sm:px-6 sm:py-4"; 
    }
  } else {
    shapeClass = "rounded-r-lg rounded-l-none pl-3 pr-2 py-2 sm:pl-6 sm:pr-4 sm:py-4";
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

  // Logic to enforce exact width if provided
  const style: React.CSSProperties = fixedWidth ? { width: `${fixedWidth}px`, minWidth: `${fixedWidth}px` } : { minWidth: '60px' };

  return (
    <button
      onClick={!disabled ? onClick : undefined}
      draggable={!disabled}
      onDragStart={handleDragStart}
      disabled={disabled}
      style={style}
      className={`${baseClasses} ${shapeClass} ${disabled ? 'opacity-50 cursor-not-allowed transform-none' : 'cursor-grab active:cursor-grabbing'}`}
    >
      
      {/* ---------------- STEM (Base) CONNECTOR LOGIC ---------------- */}
      {isStem && showConnectors && (
        <>
          <div className={`absolute right-[-8px] sm:right-[-12px] top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-6 sm:h-6 rounded-full border-2 border-dashed z-10 ${bgClass} ${borderClass}`}></div>
          <div className={`absolute right-[-4px] sm:right-[-6px] top-1/2 transform -translate-y-1/2 w-2 h-3 sm:w-3 sm:h-4 z-20 ${bgClass}`}></div>
        </>
      )}

      {/* ---------------- ENDING (Fin) CONNECTOR LOGIC ---------------- */}
      {!isStem && showConnectors && (
         <>
           <div className="absolute left-[-8px] sm:left-[-12px] top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-white z-20"></div>
           <div 
             className={`absolute left-[-8px] sm:left-[-12px] top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-6 sm:h-6 rounded-full border-2 bg-transparent z-30 pointer-events-none ${borderClass}`}
             style={{ clipPath: 'inset(0 0 0 50%)' }} 
           ></div>
         </>
      )}
      
      <span className="relative z-30 truncate px-1">{text}</span>
    </button>
  );
};
