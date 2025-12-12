
import React, { useState } from 'react';
import { SlotType } from '../types';

interface DropZoneProps {
  type: SlotType;
  content: string | null;
  placeholder: string;
  isCorrect?: boolean | null;
  onClear: () => void;
  onDrop: (text: string) => void;
  position?: 'left' | 'right' | 'single';
}

export const DropZone: React.FC<DropZoneProps> = ({ 
  type, 
  content, 
  placeholder, 
  isCorrect, 
  onClear, 
  onDrop,
  position 
}) => {
  const [isOver, setIsOver] = useState(false);
  
  const isStem = type.includes('stem');
  const isAux = type.includes('aux');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    
    const droppedType = e.dataTransfer.getData("application/x-puzzle-type");
    const droppedText = e.dataTransfer.getData("text/plain");

    // Strict validation: dropped type must match dropzone type
    if (droppedType === type && droppedText) {
      onDrop(droppedText);
    }
  };

  // --- Theme Logic ---
  // Default Empty State
  let borderColor = isAux ? "border-amber-200" : "border-blue-200";
  let bgColor = "bg-white"; 
  let textColor = isAux ? "text-amber-300" : "text-blue-300";
  let additionalClasses = "";

  // Filled State (Pending Check)
  if (content) {
    textColor = isAux ? "text-amber-900" : "text-blue-900";
    bgColor = isAux ? "bg-amber-50" : "bg-blue-50";
    borderColor = isAux ? "border-amber-500" : "border-blue-500";
  }

  // Validated State (Correct/Incorrect)
  if (isCorrect === true) {
    borderColor = "border-green-500";
    bgColor = "bg-green-50";
    textColor = "text-green-700";
  } else if (isCorrect === false) {
    borderColor = "border-red-500";
    bgColor = "bg-red-50";
    textColor = "text-red-700";
  }

  // Drag Over Feedback
  if (isOver) {
    borderColor = "border-blue-500";
    bgColor = "bg-blue-50";
    additionalClasses = "ring-4 ring-blue-200 scale-105 z-10";
  }

  // --- Shape Logic ---
  // Mobile optimized shapes (padding reduced)
  let shapeClass = "";
  
  if (position) {
    if (position === 'single') {
      // Solid border for standalone pieces
      shapeClass = "rounded-xl border-2 px-3 sm:px-6";
    } else if (position === 'left') {
      // Dashed border on the right seam ONLY
      shapeClass = "rounded-l-xl rounded-r-none border-r-2 border-dashed pr-4 pl-3 sm:pr-8 sm:pl-6";
    } else if (position === 'right') {
      shapeClass = "rounded-r-xl rounded-l-none pl-4 pr-3 sm:pl-8 sm:pr-6";
    }
  } else {
    // Default Fallback
    shapeClass = isStem
      ? "rounded-l-xl rounded-r-none border-r-2 border-dashed pr-4 pl-3 sm:pr-8 sm:pl-6"
      : "rounded-r-xl rounded-l-none pl-4 pr-3 sm:pl-8 sm:pr-6";
  }

  // Determine if notch should be shown
  const showNotch = position === 'left' || (!position && isStem);

  return (
    <div 
      onClick={content && isCorrect === null ? onClear : undefined}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative h-14 sm:h-24 min-w-[80px] sm:min-w-[140px] flex items-center justify-center 
        border-2 ${borderColor} ${bgColor} ${shapeClass}
        transition-all duration-300
        ${content && isCorrect === null ? 'cursor-pointer hover:opacity-80 group' : ''}
        ${additionalClasses}
      `}
    >
       {/* Notch representation for dropzone */}
       {showNotch && (
        <div className={`absolute right-[-8px] sm:right-[-12px] top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-6 sm:h-6 rounded-full border-2 z-10 ${
             isOver ? 'bg-blue-50 border-blue-500' :
             content ? (
               isCorrect === true ? 'bg-green-50 border-green-500' : 
               (isCorrect === false ? 'bg-red-50 border-red-500' : 
               (isAux ? 'bg-amber-50 border-amber-500' : 'bg-blue-50 border-blue-500'))
             ) : (isAux ? 'bg-white border-amber-200' : 'bg-white border-blue-200')
        }`}></div>
      )}

      {content ? (
        <span className="text-lg sm:text-2xl font-display font-bold">{content}</span>
      ) : (
        <span className={`font-display font-semibold text-[10px] sm:text-sm uppercase tracking-wider select-none pointer-events-none text-center ${textColor}`}>
          {placeholder}
        </span>
      )}
      
      {/* Label for Aux/Verb distinction */}
      <span className={`absolute -top-2 sm:-top-3 left-2 text-[8px] sm:text-[10px] font-bold uppercase px-1 rounded-full border ${
        isAux 
        ? 'bg-amber-50 text-amber-500 border-amber-100' 
        : 'bg-blue-50 text-blue-400 border-blue-100'
      }`}>
        {isAux ? (isStem ? "Aux" : "Aux") : (isStem ? "Verb" : "Verb")}
      </span>
      
      {/* Hover to remove indicator (only if filled, not validated, and not dragging) */}
      {content && isCorrect === null && !isOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-[inherit] backdrop-blur-[1px]">
          <span className="text-[10px] sm:text-xs font-bold text-red-600 uppercase">Retirer</span>
        </div>
      )}
    </div>
  );
};