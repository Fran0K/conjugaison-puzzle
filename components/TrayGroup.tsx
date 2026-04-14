import React, { useState, useRef, useLayoutEffect } from 'react';
import { SmartTray } from './SmartTray';
import { measureTextWidth } from '../utils';
import { TrayConfig, TrayLayoutState } from '../types';
import {
  BREAKPOINT,
  CONNECTOR,
  FONT,
  PIECE,
  TRAY,
  SCALING,
} from '../theme';

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
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // --- CORE LAYOUT ALGORITHM ---
  useLayoutEffect(() => {
    if (!containerWidth || trays.length === 0) return;

    // A. Configuration from theme
    const isDesktop = window.matchMedia(`(min-width: ${BREAKPOINT}px)`).matches;

    // Dynamic font sizing based on container width
    const fontBase = isDesktop ? FONT.desktop : FONT.mobile;
    const refWidth = isDesktop ? SCALING.desktop.refWidth : SCALING.mobile.refWidth;
    const fontSize = Math.max(fontBase.min, Math.round(fontBase.base * containerWidth / refWidth));

    const font = `${FONT.weight} ${fontSize}px ${FONT.family}`;
    const pieceConfig = isDesktop ? PIECE.desktop : PIECE.mobile;
    const trayConfig = isDesktop ? TRAY.desktop : TRAY.mobile;
    const gap = trayConfig.gap;
    const tabProtrusion = isDesktop ? CONNECTOR.desktop.protrusion : CONNECTOR.mobile.protrusion;

    // B. Calculate max puzzle width for each tray independently
    const trayMaxPieceWidths = trays.map(tray => {
      const maxTextW = tray.items.reduce((max, text) => Math.max(max, measureTextWidth(text, font)), 0);
      return Math.max(maxTextW + pieceConfig.padding, pieceConfig.minWidth);
    });

    // Helper: Calculate rendered tray width (must match SmartTray exactly)
    const calcTrayWidth = (cols: number, pWidth: number, trayType: string, showConn?: boolean) => {
      const conn = showConn !== false; // match PuzzlePiece/SmartTray default
      const rightBuf = (conn && trayType.includes('stem')) ? tabProtrusion : 0;
      const colGap = (conn && trayType.includes('stem') && cols >= 2) ? gap + tabProtrusion : gap;
      return trayConfig.padding + (cols * pWidth) + Math.max(0, cols - 1) * colGap
        + rightBuf + trayConfig.padding;
    };

    // Helper: Can a tray fit in 1 row (cols: 4)?
    const canUseCols4 = (pieceWidth: number, trayType: string, showConn?: boolean) =>
      calcTrayWidth(4, pieceWidth, trayType, showConn) <= containerWidth;

    const newLayouts: TrayLayoutState[] = [];
    const trayCount = trays.length;

    // C. Apply Strict Rule Matrix (per TrayDisplay.md)

    if (isDesktop) {
      // --- DESKTOP RULES ---
      if (trayCount >= 3) {
        // Rule: 3+ Trays -> cols: 1 (4,1 vertical strips side-by-side)
        newLayouts.push(...trayMaxPieceWidths.map((w, i) => ({
          cols: 1, pieceWidth: w, fontSize, isDesktop,
        })));
      } else if (trayCount === 2) {
        // Rule: 2 Trays -> both cols: 2 (2,2), side by side
        newLayouts.push(...trayMaxPieceWidths.map(w => ({
          cols: 2, pieceWidth: w, fontSize, isDesktop,
        })));
      } else if (trayCount === 1) {
        // Rule: 1 Tray -> cols: 4 (1,4)
        newLayouts.push({ cols: 4, pieceWidth: trayMaxPieceWidths[0], fontSize, isDesktop });
      }
    } else {
      // --- MOBILE RULES ---
      if (trayCount === 4) {
        // Rule: 4 Trays -> two tray pairs, each tray cols: 2 (2,2)
        newLayouts.push(...trayMaxPieceWidths.map(w => ({
          cols: 2, pieceWidth: w, fontSize, isDesktop,
        })));

      } else if (trayCount === 3) {
        // Rule: 3 Trays -> Mixed Layout based on Content (Aux vs Verb)
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

        // 1. Solo Layout: (1,4) horizontal strip preference
        const soloW = trayMaxPieceWidths[soloIndex];
        const soloHasConn = trays[soloIndex].showConnectors ?? false;
        const soloType = trays[soloIndex].type;
        const soloShowConn = trays[soloIndex].showConnectors;
        const soloLayout: TrayLayoutState = canUseCols4(soloW, soloType, soloShowConn)
          ? { cols: 4, pieceWidth: soloW, fontSize, isDesktop }
          : { cols: 2, pieceWidth: soloW, fontSize, isDesktop };

        // 2. Pair Layout: (2,2) side-by-side preference
        const wA = trayMaxPieceWidths[pairIndices[0]];
        const wB = trayMaxPieceWidths[pairIndices[1]];

        const widthIfCols2 = calcTrayWidth(2, wA, trays[pairIndices[0]].type, trays[pairIndices[0]].showConnectors)
          + calcTrayWidth(2, wB, trays[pairIndices[1]].type, trays[pairIndices[1]].showConnectors) + gap;
        const pairCols = (widthIfCols2 <= containerWidth) ? 2 : 1;

        const pairLayoutA: TrayLayoutState = { cols: pairCols, pieceWidth: wA, fontSize, isDesktop };
        const pairLayoutB: TrayLayoutState = { cols: pairCols, pieceWidth: wB, fontSize, isDesktop };

        // 3. Assign layouts preserving order 0, 1, 2
        if (soloIndex === 0) {
          newLayouts.push(soloLayout, pairLayoutA, pairLayoutB);
        } else {
          newLayouts.push(pairLayoutA, pairLayoutB, soloLayout);
        }

      } else if (trayCount === 2) {
        // Rule: 2 Trays -> (4,1) per tray, two trays side by side horizontally
        newLayouts.push({ cols: 1, pieceWidth: trayMaxPieceWidths[0], fontSize, isDesktop });
        newLayouts.push({ cols: 1, pieceWidth: trayMaxPieceWidths[1], fontSize, isDesktop });

      } else if (trayCount === 1) {
        // Rule: 1 Tray -> cols: 4 (1,4) if fits, else cols: 2
        const w0 = trayMaxPieceWidths[0];
        if (canUseCols4(w0, trays[0].type, trays[0].showConnectors)) {
          newLayouts.push({ cols: 4, pieceWidth: w0, fontSize, isDesktop });
        } else {
          newLayouts.push({ cols: 2, pieceWidth: w0, fontSize, isDesktop });
        }
      }
    }

    setLayouts(newLayouts);

  }, [trays, containerWidth]);

  if (trays.length === 0) return null;

  // Prevent FOUC: Wait until layouts are calculated before rendering children
  const isReady = layouts.length === trays.length;

  const gap = window.matchMedia(`(min-width: ${BREAKPOINT}px)`).matches
    ? TRAY.desktop.gap : TRAY.mobile.gap;

  return (
    <div ref={containerRef} className="w-full flex justify-center">
      <div
        className="flex flex-row flex-wrap justify-center items-start w-full"
        style={{ gap: `${gap}px` }}
      >
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
