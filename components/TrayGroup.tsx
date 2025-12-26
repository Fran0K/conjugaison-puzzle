import React, { useState, useRef, useLayoutEffect } from 'react';
import { SmartTray } from './SmartTray';
import { measureTextWidth } from '../utils';
import { TrayConfig, TrayLayoutState } from '../types';

interface TrayGroupProps {
  trays: TrayConfig[];
}

// Tray Group (The Logic Engine)
export const TrayGroup: React.FC<TrayGroupProps> = ({ trays }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  
  // Layout state for each tray in this group
  const [layouts, setLayouts] = useState<TrayLayoutState[]>([]);

  // Measure Container
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Use the content box width
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // --- CORE LAYOUT ALGORITHM ---
  useLayoutEffect(() => {
    if (!containerWidth || trays.length === 0) return;

    // A. Configuration constants
    const isDesktop = window.matchMedia('(min-width: 640px)').matches;
    const fontSize = isDesktop ? '20px' : '14px';
    const font = `700 ${fontSize} "Fredoka", sans-serif`;
    
    // Padding + Buffer + Connector space (Must match PuzzlePiece styling)
    const padding = isDesktop ? 80 : 28; 
    const minWidth = isDesktop ? 120 : 55;
    
    // GAP CONFIGURATION (Must match CSS)
    // Mobile: gap-3 (12px)
    // Desktop: gap-4 (16px)
    const gap = isDesktop ? 16 : 12;

    // B. Calculate max puzzle width for each tray independently
    const trayMaxPieceWidths = trays.map(tray => {
      const maxTextW = tray.items.reduce((max, text) => Math.max(max, measureTextWidth(text, font)), 0);
      return Math.max(maxTextW + padding, minWidth);
    });

    // Helper: Can a tray fit in 1 row (cols: 4)?
    // Logic: (pieceWidth * 4) + (gap * 3) <= containerWidth
    const canUseCols4 = (pieceWidth: number) => {
      const requiredWidth = (pieceWidth * 4) + (gap * 3);
      return requiredWidth <= containerWidth;
    };

    // Helper: Estimate Tray visual width (Mobile only)
    // Mobile SmartTray: p-1.5 (12px total X), gap-3 (12px grid gap)
    // Updated to reflect tighter padding in SmartTray (p-1.5 = 6px * 2 = 12px)
    const getMobileTrayWidth = (cols: number, pWidth: number) => {
      const trayPadding = 12; 
      const gridGap = 12;
      return trayPadding + (cols * pWidth) + (Math.max(0, cols - 1) * gridGap);
    };

    const newLayouts: TrayLayoutState[] = [];
    const trayCount = trays.length;

    // C. Apply Strict Rule Matrix

    if (isDesktop) {
      // --- DESKTOP RULES ---
      if (trayCount >= 3) {
        // Rule: 3+ Trays -> Force cols: 1 (Vertical strips side-by-side)
        newLayouts.push(...trayMaxPieceWidths.map(w => ({ cols: 1, pieceWidth: w })));
      } else if (trayCount === 2) {
        // Rule: 2 Trays -> Both cols: 2
        newLayouts.push(...trayMaxPieceWidths.map(w => ({ cols: 2, pieceWidth: w })));
      } else if (trayCount === 1) {
        // Rule: 1 Tray -> cols: 4
        newLayouts.push({ cols: 4, pieceWidth: trayMaxPieceWidths[0] });
      }
    } else {
      // --- MOBILE RULES ---
      if (trayCount === 4) {
        // Rule: 4 Trays -> Prefer cols: 2 (2x2 Matrix), but fallback to cols: 1 to ensure grid alignment
        
        newLayouts.push(...trayMaxPieceWidths.map(w => ({ cols: 2, pieceWidth: w })));

      } else if (trayCount === 3) {
        // Rule: 3 Trays -> Mixed Layout based on Content (Aux vs Verb)
        // We assume trays are ordered: Aux trays first, then Verb trays.
        // Identify which group has 2 items vs 1 item.
        
        const isTray1Aux = trays[1].type.includes('aux');
        
        let pairIndices: number[];
        let soloIndex: number;

        if (isTray1Aux) {
            // Case: [Aux, Aux, Verb] -> Pair is Aux (0,1), Solo is Verb (2)
            pairIndices = [0, 1];
            soloIndex = 2;
        } else {
            // Case: [Aux, Verb, Verb] -> Solo is Aux (0), Pair is Verb (1,2)
            soloIndex = 0;
            pairIndices = [1, 2];
        }

        // 1. Calculate Solo Layout (Horizontal Strip preference)
        const soloW = trayMaxPieceWidths[soloIndex];
        const soloLayout: TrayLayoutState = canUseCols4(soloW) 
            ? { cols: 4, pieceWidth: soloW } 
            : { cols: 2, pieceWidth: soloW };

        // 2. Calculate Pair Layout (Side-by-side preference)
        const wA = trayMaxPieceWidths[pairIndices[0]];
        const wB = trayMaxPieceWidths[pairIndices[1]];
        
        // Check if they fit side-by-side as cols: 2
        const widthIfCols2 = getMobileTrayWidth(2, wA) + getMobileTrayWidth(2, wB) + gap;
        
        const pairCols = (widthIfCols2 <= containerWidth) ? 2 : 1;
        const pairLayoutA: TrayLayoutState = { cols: pairCols, pieceWidth: wA };
        const pairLayoutB: TrayLayoutState = { cols: pairCols, pieceWidth: wB };

        // 3. Assign layouts preserving order 0, 1, 2
        if (soloIndex === 0) {
            newLayouts.push(soloLayout);
            newLayouts.push(pairLayoutA);
            newLayouts.push(pairLayoutB);
        } else {
            newLayouts.push(pairLayoutA);
            newLayouts.push(pairLayoutB);
            newLayouts.push(soloLayout);
        }

      } else if (trayCount === 2) {
        // Rule: 2 Trays -> Prefer cols: 2, but fallback to cols: 1 if width insufficient to fit side-by-side
        const w0 = trayMaxPieceWidths[0];
        const w1 = trayMaxPieceWidths[1];

        // // Calculate theoretical width if both use cols: 2
        // const widthIfCols2 = getMobileTrayWidth(2, w0) + getMobileTrayWidth(2, w1) + gap;

        // if (widthIfCols2 <= containerWidth) {
        //   newLayouts.push({ cols: 2, pieceWidth: w0 });
        //   newLayouts.push({ cols: 2, pieceWidth: w1 });
        // } 
        // else {
           // Fallback to vertical shelf (cols: 1) to keep them side-by-side
        newLayouts.push({ cols: 1, pieceWidth: w0 });
        newLayouts.push({ cols: 1, pieceWidth: w1 });
        // }
      } else if (trayCount === 1) {
        // Rule: 1 Tray -> Smart Check
        const w0 = trayMaxPieceWidths[0];
        if (canUseCols4(w0)) {
          newLayouts.push({ cols: 4, pieceWidth: w0 });
        } else {
          newLayouts.push({ cols: 2, pieceWidth: w0 });
        }
      }
    }

    setLayouts(newLayouts);

  }, [trays, containerWidth]);

  if (trays.length === 0) return null;

  // Prevent FOUC: Wait until layouts are calculated before rendering children
  // This ensures the entrance animation plays with the CORRECT layout from frame 1
  const isReady = layouts.length === trays.length;

  return (
    <div ref={containerRef} className="w-full flex justify-center">
      {/* 
         Tray Zone Layout:
         - Flex Wrap allows wrapping on mobile if we have 3 or 4 trays.
         - Justify Center keeps them centered.
         - Gap: 12px (mobile) / 16px (desktop)
      */}
      <div className={`flex flex-row flex-wrap justify-center items-start gap-3 sm:gap-4 w-full`}>
        {isReady && trays.map((tray, idx) => {
          const layout = layouts[idx];
          return (
            <SmartTray 
              key={tray.id}
              config={tray}
              layout={layout}
            />
          );
        })}
      </div>
    </div>
  );
};