
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
  // We construct specific class strings to share between the Parent and the Connector children (Knob/Bridge)
  // ensuring they always match perfectly in color and hover state.
  
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
  // 2. Main Verb Style (Blue) - Updated from White/Gray
  else {
     bgClass = "bg-blue-50";
     textClass = "text-blue-900";
     borderClass = "border-blue-300";
  }

  // 3. Selection Override
  if (isSelected) {
    bgClass = "bg-french-blue";
    textClass = "text-white";
    borderClass = "border-blue-600";
    ringClass = "ring-2 sm:ring-4 ring-blue-200";
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

  // --- Style Logic Updates ---
  // 1. Shadow: Use drop-shadow-sm for a lighter, unified shadow effect across all shapes.
  // 2. Border Style: Base/Stem gets 'border-dashed' ONLY if it has connectors. Standalone = Solid.
  const shadowClass = "drop-shadow-sm";
  const borderStyle = (isStem && showConnectors) ? "border-dashed" : "border-solid";

  // --- Base Classes ---
  // 1. "group": Allows children to react to parent hover.
  // 2. "overflow-visible": Essential so the Knob can stick out.
  const baseClasses = `relative group transition-all duration-200 select-none flex items-center justify-center font-display font-bold text-sm sm:text-xl transform hover:-translate-y-1 active:translate-y-0 overflow-visible ${shadowClass} border-2 ${borderStyle} ${bgClass} ${textClass} ${borderClass} ${ringClass}`;

  // --- Shape Logic ---
  let shapeClass = "";

  // Note: 'w-full' removed from both shapes to prevent stretching in grid, relying on min-w instead.
  if (isStem) {
    if (showConnectors) {
      // Base Piece (Knob on Right)
      // Standard rounded-left, square-right to attach knob
      shapeClass = "rounded-l-lg rounded-r-none pr-3 pl-2 py-2 sm:pr-6 sm:pl-4 sm:py-4 min-w-[60px] sm:min-w-[100px]";
    } else {
      // Standalone (Tray) - Fully rounded, solid block
      shapeClass = "rounded-xl px-1 py-2 sm:px-6 sm:py-4 min-w-[65px] sm:min-w-[100px]"; 
    }
  } else {
    // Ending Piece (Socket on Left)
    // Standard rounded-right, square-left for socket
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
      // Removed maskStyle to fix black drag ghost
      className={`${baseClasses} ${shapeClass} ${disabled ? 'opacity-50 cursor-not-allowed transform-none' : 'cursor-grab active:cursor-grabbing'}`}
    >
      
      {/* ---------------- STEM (Base) CONNECTOR LOGIC ---------------- */}
      {/* Creates a convex knob on the right side */}
      {isStem && showConnectors && (
        <>
          {/* 1. The Knob (Circle) */}
          {/* Sits outside the parent to the right. Always dashed to match the new parent style. */}
          <div className={`absolute right-[-10px] sm:right-[-12px] top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-6 sm:h-6 rounded-full border-2 border-dashed z-10 ${bgClass} ${borderClass}`}></div>
          
          {/* 2. The Bridge (Rectangle) */}
          {/* Sits over the seam. Hides the parent's right border and the knob's left border. */}
          {/* Matches background color exactly. High z-index. */}
          <div className={`absolute right-[-2px] top-1/2 transform -translate-y-1/2 w-[6px] h-[8px] sm:h-[12px] z-20 ${bgClass}`}></div>
        </>
      )}

      {/* ---------------- ENDING (Fin) CONNECTOR LOGIC ---------------- */}
      {/* Creates a visual concave socket on the left side */}
      {!isStem && showConnectors && (
         <>
           {/* 1. The Hole Simulator (White Circle Overlay) */}
           {/* Replaces the CSS Mask. Simulates transparency by matching the TRAY background (white). 
               This fixes the black box issue during drag. */}
           <div className="absolute left-[-6px] top-1/2 transform -translate-y-1/2 w-[12px] h-[12px] rounded-full bg-white z-20"></div>

           {/* 2. The Socket Contour (Border Arc) */}
           {/* Positioned exactly over the white circle to draw the dashed border. */}
           <div 
             className={`absolute left-[-6px] top-1/2 transform -translate-y-1/2 w-[12px] h-[12px] rounded-full border-2 border-dashed bg-transparent z-30 pointer-events-none ${borderClass}`}
             style={{ clipPath: 'inset(0 0 0 50%)' }}
           ></div>
         </>
      )}
      
      <span className="relative z-30">{text}</span>
    </button>
  );
};