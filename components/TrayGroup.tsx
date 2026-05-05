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

// --- Layout unit: a pair (2 trays side-by-side) or a solo (1 tray) ---
type LayoutUnit =
  | { kind: 'pair'; indices: [number, number] }
  | { kind: 'solo'; index: number };

/**
 * Group trays into layout units.
 * Adjacent same-category (both aux or both verb) trays form pairs.
 */
function groupIntoUnits(trays: TrayConfig[]): LayoutUnit[] {
  const units: LayoutUnit[] = [];
  let i = 0;
  while (i < trays.length) {
    if (i + 1 < trays.length) {
      const curIsAux = trays[i].type.includes('aux');
      const nextIsAux = trays[i + 1].type.includes('aux');
      if (curIsAux === nextIsAux) {
        units.push({ kind: 'pair', indices: [i, i + 1] });
        i += 2;
        continue;
      }
    }
    units.push({ kind: 'solo', index: i });
    i += 1;
  }
  return units;
}

// Tray Group (The Logic Engine)
export const TrayGroup: React.FC<TrayGroupProps> = ({ trays }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
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

    const isDesktop = window.matchMedia(`(min-width: ${BREAKPOINT}px)`).matches;
    const fontBase = isDesktop ? FONT.desktop : FONT.mobile;
    const refWidth = isDesktop ? SCALING.desktop.refWidth : SCALING.mobile.refWidth;
    const fontSize = Math.max(fontBase.min, Math.round(fontBase.base * containerWidth / refWidth));
    const font = `${FONT.weight} ${fontSize}px ${FONT.family}`;
    const pieceConfig = isDesktop ? PIECE.desktop : PIECE.mobile;
    const trayConfig = isDesktop ? TRAY.desktop : TRAY.mobile;
    const gap = trayConfig.gap;
    const conn = isDesktop ? CONNECTOR.desktop : CONNECTOR.mobile;

    // Calculate max piece width per tray (stem + connector gets extra width for凸)
    const pieceWidths = trays.map(tray => {
      const maxTextW = tray.items.reduce((max, text) => Math.max(max, measureTextWidth(text, font)), 0);
      const contentW = Math.max(maxTextW + pieceConfig.padding, pieceConfig.minWidth);
      const showConn = tray.showConnectors !== false;
      const isStem = tray.type.includes('stem');
      return (isStem && showConn) ? contentW + conn.protrusion : contentW;
    });

    // Calculate rendered tray width for a given cols config
    const calcTrayWidth = (cols: number, pWidth: number) =>
      trayConfig.padding + (cols * pWidth) + Math.max(0, cols - 1) * gap + trayConfig.padding;

    const newLayouts: TrayLayoutState[] = new Array(trays.length);

    if (isDesktop) {
      // --- DESKTOP ---
      // 1 tray: cols:4 | 2 trays: cols:2 | 3+ trays: cols:1
      const cols = trays.length === 1 ? 4 : trays.length === 2 ? 2 : 1;
      trays.forEach((_, i) => {
        newLayouts[i] = { cols, pieceWidth: pieceWidths[i], fontSize, isDesktop };
      });
    } else {
      // --- MOBILE: recursive pair/solo ---
      const units = groupIntoUnits(trays);
      for (const unit of units) {
        if (unit.kind === 'pair') {
          const [a, b] = unit.indices;
          const pairFitsCols2 = calcTrayWidth(2, pieceWidths[a]) + gap + calcTrayWidth(2, pieceWidths[b]) <= containerWidth;
          const cols = pairFitsCols2 ? 2 : 1;
          newLayouts[a] = { cols, pieceWidth: pieceWidths[a], fontSize, isDesktop };
          newLayouts[b] = { cols, pieceWidth: pieceWidths[b], fontSize, isDesktop };
        } else {
          const idx = unit.index;
          const cols = calcTrayWidth(4, pieceWidths[idx]) <= containerWidth ? 4 : 2;
          newLayouts[idx] = { cols, pieceWidth: pieceWidths[idx], fontSize, isDesktop };
        }
      }
    }

    setLayouts(newLayouts);
  }, [trays, containerWidth]);

  if (trays.length === 0) return null;

  const isReady = layouts.length === trays.length;
  const isDesktop = window.matchMedia(`(min-width: ${BREAKPOINT}px)`).matches;
  const gap = isDesktop ? TRAY.desktop.gap : TRAY.mobile.gap;

  const renderTray = (idx: number) => (
    <SmartTray key={trays[idx].id} config={trays[idx]} layout={layouts[idx]} />
  );

  // --- RENDER ---
  if (!isDesktop && isReady) {
    const units = groupIntoUnits(trays);
    return (
      <div ref={containerRef} className="w-full flex justify-center">
        <div className="flex flex-row flex-wrap justify-center items-start w-full" style={{ gap: `${gap}px` }}>
          {units.map((unit, i) =>
            unit.kind === 'pair' ? (
              <div key={`p-${i}`} className="flex flex-row flex-wrap justify-center items-start" style={{ gap: `${gap}px` }}>
                {renderTray(unit.indices[0])}
                {renderTray(unit.indices[1])}
              </div>
            ) : renderTray(unit.index)
          )}
        </div>
      </div>
    );
  }

  // Desktop (or not ready): flat rendering
  return (
    <div ref={containerRef} className="w-full flex justify-center">
      <div className="flex flex-row flex-wrap justify-center items-start w-full" style={{ gap: `${gap}px` }}>
        {isReady && trays.map((tray, idx) => (
          <SmartTray key={tray.id} config={tray} layout={layouts[idx]} />
        ))}
      </div>
    </div>
  );
};
