
import React from 'react';
import { SlotType } from '../types';

interface PuzzlePieceProps {
  text: string;
  type: SlotType;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
  isCorrect?: boolean | null; 
  showConnectors?: boolean; // New prop to toggle puzzle shape vs standalone block
}

export const PuzzlePiece: React.FC<PuzzlePieceProps> = ({ 
  text, 
  type, 
  isSelected, 
  onClick, 
  disabled, 
  isCorrect,
  showConnectors = true // Default to true for backward compatibility
}) => {
  
  const isStem = type.includes('stem');
  const isAux = type.includes('aux');

  // --- Theme Color Logic ---
  
  let bgClass = "";
  let textClass = "";
  let borderClass = "";
  let ringClass = "";

  // 1. Auxiliary Style (Amber)
  if (isAux) {
     bgClass = "bg-amber-50";
     textClass = "text-amber-900";
     borderClass = "border-amber-300";
  } 
  // 2. Main Verb Style (Blue)
  else {
     bgClass = "bg-blue-50";
     textClass = "text-blue-900";
     borderClass = "border-blue-300";
  }

  // 3. Selection Override
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

  // 4. Validation Override
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

  const baseClasses = `relative group transition-all duration-200 select-none flex items-center justify-center font-display font-bold text-sm sm:text-xl transform hover:-translate-y-1 active:translate-y-0 overflow-visible ${shadowClass} border-2 ${borderStyle} ${bgClass} ${textClass} ${borderClass} ${ringClass}`;

  // --- Shape Logic ---
  let shapeClass = "";

  if (isStem) {
    if (showConnectors) {
      // Base Piece (Knob on Right)
      shapeClass = "rounded-l-lg rounded-r-none pr-3 pl-2 py-2 sm:pr-6 sm:pl-4 sm:py-4 min-w-[60px] sm:min-w-[100px]";
    } else {
      // Standalone (Tray)
      shapeClass = "rounded-xl px-1 py-2 sm:px-6 sm:py-4 min-w-[65px] sm:min-w-[100px]"; 
    }
  } else {
    // Ending Piece (Socket on Left)
    shapeClass = "rounded-r-lg rounded-l-none pl-3 pr-2 py-2 sm:pl-6 sm:pr-4 sm:py-4 min-w-[60px] sm:min-w-[100px]";
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

  return (
    <button
      onClick={!disabled ? onClick : undefined}
      draggable={!disabled}
      onDragStart={handleDragStart}
      disabled={disabled}
      className={`${baseClasses} ${shapeClass} ${disabled ? 'opacity-50 cursor-not-allowed transform-none' : 'cursor-grab active:cursor-grabbing'}`}
    >
      
      {/* ---------------- STEM (Base) CONNECTOR LOGIC ---------------- */}
      {/* Creates a convex knob on the right side */}
      {isStem && showConnectors && (
        <>
          {/* 1. The Knob (Circle) */}
          {/* Radius Unified: w-4 (16px) / sm:w-6 (24px) */}
          {/* Position: Center of knob is at parent's right edge (0px) */}
          <div className={`absolute right-[-8px] sm:right-[-12px] top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-6 sm:h-6 rounded-full border-2 border-dashed z-10 ${bgClass} ${borderClass}`}></div>
          
          {/* 2. The Bridge (Rectangle) */}
          {/* No clip-path needed. We simply center it over the seam. */}
          {/* Width: 8px / 12px (half of knob width is usually enough, but we use slightly less height to fit inside curve) */}
          {/* Right: -4px / -6px (Negative half width -> Centers it on the 0px line) */}
          <div className={`absolute right-[-4px] sm:right-[-6px] top-1/2 transform -translate-y-1/2 w-2 h-3 sm:w-3 sm:h-4 z-20 ${bgClass}`}></div>
        </>
      )}

      {/* ---------------- ENDING (Fin) CONNECTOR LOGIC ---------------- */}
      {/* Creates a visual concave socket on the left side */}
      {!isStem && showConnectors && (
         <>
           {/* 1. The Hole Simulator (White Circle Overlay) */}
           {/* Radius Unified: w-4 (16px) / sm:w-6 (24px) */}
           {/* Position: Center of circle is at parent's left edge (0px) */}
           <div className="absolute left-[-8px] sm:left-[-12px] top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-white z-20"></div>

           {/* 2. The Socket Contour (Border Arc) */}
           {/* Same size and position as the white circle */}
           <div 
             className={`absolute left-[-8px] sm:left-[-12px] top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-6 sm:h-6 rounded-full border-2 bg-transparent z-30 pointer-events-none ${borderClass}`}
             style={{ clipPath: 'inset(0 0 0 50%)' }} // Keep right half (Inner C shape)
           ></div>
         </>
      )}
      
      <span className="relative z-30">{text}</span>
    </button>
  );
};
