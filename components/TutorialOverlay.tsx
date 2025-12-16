
import React, { useEffect, useState, useCallback } from 'react';
import { useLanguage } from '../LanguageContext';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';

export interface TutorialStep {
  targetRef: React.RefObject<HTMLElement | null>;
  titleKey: string;
  descKey: string;
  position: 'top' | 'bottom' | 'auto';
}

interface TutorialOverlayProps {
  isOpen: boolean;
  steps: TutorialStep[];
  onComplete: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ isOpen, steps, onComplete }) => {
  const { t } = useLanguage();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 }); // Init 0 to trigger hydration safe check

  const step = steps[currentStepIndex];

  // --- 1. Measure & Auto-Scroll Logic ---
  const updateTarget = useCallback(() => {
    if (step && step.targetRef.current) {
      const element = step.targetRef.current;
      
      // Auto-scroll the element into view on mobile/desktop
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

      // Wait a moment for scroll to settle before grabbing rect
      // (Simple timeout is usually sufficient for this UX)
      setTimeout(() => {
         const rect = element.getBoundingClientRect();
         setTargetRect(rect);
      }, 450);
    }
  }, [step]);

  // Initialize and Update on Step Change
  useEffect(() => {
    if (isOpen) {
      // Set initial window size
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      updateTarget();
    } else {
        // Reset index when closed so it starts from 0 next time
        setCurrentStepIndex(0);
    }
  }, [isOpen, currentStepIndex, updateTarget]);

  // Handle Resize & Scroll events to keep spotlight sync
  useEffect(() => {
    if (!isOpen) return;

    const handleUpdate = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      if (step && step.targetRef.current) {
        setTargetRect(step.targetRef.current.getBoundingClientRect());
      }
    };

    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate, { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate);
    };
  }, [isOpen, step]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  if (!isOpen || !targetRect) return null;

  // --- 2. Responsive Tooltip Calculation ---
  
  // Max width of tooltip is 320px, but on small screens use width - 32px (16px padding on each side)
  const tooltipMaxWidth = 320;
  const safeMargin = 16;
  const currentTooltipWidth = Math.min(tooltipMaxWidth, windowSize.width - (safeMargin * 2));

  // Horizontal Position: Center relative to target, but clamp to screen edges
  let tooltipLeft = targetRect.left + (targetRect.width / 2) - (currentTooltipWidth / 2);
  
  // Clamp Left
  if (tooltipLeft < safeMargin) {
      tooltipLeft = safeMargin;
  }
  // Clamp Right
  if (tooltipLeft + currentTooltipWidth > windowSize.width - safeMargin) {
      tooltipLeft = windowSize.width - safeMargin - currentTooltipWidth;
  }

  // Vertical Position:
  const gap = 12;
  const spaceAbove = targetRect.top;
  const spaceBelow = windowSize.height - targetRect.bottom;
  
  let usedPosition = step.position;

  // Auto-flip based on available space
  if (usedPosition === 'auto') {
      // Prefer bottom if there's enough space (e.g., > 180px)
      // Otherwise check top. If neither is great, pick the larger one.
      if (spaceBelow > 200) {
          usedPosition = 'bottom';
      } else if (spaceAbove > 200) {
          usedPosition = 'top';
      } else {
          usedPosition = spaceBelow > spaceAbove ? 'bottom' : 'top';
      }
  }

  let tooltipTop = 0;
  let transformOrigin = 'center top';

  if (usedPosition === 'bottom') {
      tooltipTop = targetRect.bottom + gap;
      transformOrigin = 'center top';
  } else {
      tooltipTop = targetRect.top - gap;
      transformOrigin = 'center bottom';
      // We will use translateY(-100%) in styles, so 'top' here is actually the bottom edge of tooltip visually
  }

  // Calculate Arrow Position relative to tooltip box
  // The arrow should point to the center of the target
  const arrowTargetCenter = targetRect.left + (targetRect.width / 2);
  // Arrow relative left = (TargetCenter - TooltipLeft)
  let arrowLeft = arrowTargetCenter - tooltipLeft;
  // Clamp arrow so it doesn't detach from corners (border radius is ~16px)
  const arrowSafeZone = 20; 
  if (arrowLeft < arrowSafeZone) arrowLeft = arrowSafeZone;
  if (arrowLeft > currentTooltipWidth - arrowSafeZone) arrowLeft = currentTooltipWidth - arrowSafeZone;

  // Spotlight Style
  const spotlightStyle: React.CSSProperties = {
    position: 'fixed',
    top: targetRect.top,
    left: targetRect.left,
    width: targetRect.width,
    height: targetRect.height,
    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75)', // The dark overlay
    borderRadius: '12px',
    zIndex: 50,
    pointerEvents: 'none', // Allow clicks to pass through to the highlighted element
    transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)', // Smooth transition for moving/resizing
  };

  const isLastStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  return (
    <div className="fixed inset-0 z-[60]">
        
        {/* Spotlight Highlight Box */}
        <div style={spotlightStyle} className="ring-2 ring-white/50" />

        {/* Tooltip Card */}
        <div 
            className="absolute bg-white p-5 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-300 flex flex-col gap-3"
            style={{
                top: tooltipTop,
                left: tooltipLeft,
                width: currentTooltipWidth,
                transform: usedPosition === 'top' ? 'translateY(-100%)' : 'none',
                transformOrigin: transformOrigin,
                zIndex: 60
            }}
        >
            <div className="flex justify-between items-start">
                <h3 className="font-display font-bold text-lg text-french-blue leading-tight">
                    {/* @ts-ignore dynamic key */}
                    {t(step.titleKey)}
                </h3>
                <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full shrink-0 ml-2">
                    {currentStepIndex + 1} / {steps.length}
                </span>
            </div>
            
            <p className="text-sm text-gray-600 leading-relaxed">
                {/* @ts-ignore dynamic key */}
                {t(step.descKey)}
            </p>

            <div className="flex justify-between items-center pt-2">
                {/* Previous Button */}
                <button 
                   onClick={handlePrev}
                   disabled={isFirstStep}
                   className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold transition-all
                     ${isFirstStep ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100 active:bg-gray-200'}
                   `}
                >
                   <ChevronLeft className="w-4 h-4" />
                   {/* @ts-ignore */}
                   {t('tour_prev')}
                </button>

                {/* Next Button */}
                <button 
                    onClick={handleNext}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-md active:scale-95 ${isLastStep ? 'bg-green-500 active:bg-green-600' : 'bg-french-dark active:bg-gray-800'}`}
                >
                    {isLastStep ? (
                        <>
                           {t('tour_finish')} <Check className="w-4 h-4" />
                        </>
                    ) : (
                        <>
                           {t('tour_next')} <ChevronRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </div>
            
            {/* Arrow/Triangle */}
            <div 
                className={`absolute w-4 h-4 bg-white transform rotate-45 border-r border-b border-gray-100 shadow-sm`}
                style={{
                    left: arrowLeft,
                    // If bottom, arrow is on top (-8px). If top, arrow is on bottom (100% - 8px).
                    top: usedPosition === 'bottom' ? '-8px' : undefined,
                    bottom: usedPosition === 'top' ? '-8px' : undefined,
                    // Rotate based on side to ensure shadow/border match
                    // -135deg points UP (using border-r/b), 45deg points DOWN (using border-r/b)
                    transform: usedPosition === 'bottom' ? 'rotate(-135deg)' : 'rotate(45deg)',
                    zIndex: 61 // Cover the card border
                }}
            />
        </div>
    </div>
  );
};
