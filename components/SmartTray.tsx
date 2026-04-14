import React from 'react';
import { PuzzlePiece } from './PuzzlePiece';
import { TrayConfig, TrayLayoutState } from '../types';
import { COLORS, TRAY, CONNECTOR, FONT } from '../theme';

interface SmartTrayProps {
  config: TrayConfig;
  layout: TrayLayoutState;
}

// Smart Tray (Pure Renderer)
// Strictly follows props from TrayGroup
export const SmartTray: React.FC<SmartTrayProps> = ({ config, layout }) => {
  const { items, type, selected, onSelect, title, color } = config;
  const showConn = config.showConnectors !== false; // match PuzzlePiece default (true)
  const { cols, pieceWidth, fontSize, isDesktop } = layout;

  const trayBg = color === 'amber' ? COLORS.aux.trayBg : (color === 'blue' ? COLORS.verb.trayBg : '#ffffff');
  const titleColor = color === 'amber' ? COLORS.aux.active : (color === 'blue' ? COLORS.verb.active : '#EF4135');

  const conn = isDesktop ? CONNECTOR.desktop : CONNECTOR.mobile;
  const trayConfig = isDesktop ? TRAY.desktop : TRAY.mobile;
  const padding = trayConfig.padding;
  const gap = trayConfig.gap;
  const titleFontSize = isDesktop ? FONT.trayTitle.desktop : FONT.trayTitle.mobile;

  // Right buffer: stem trays have convex tab protruding right
  const rightBuffer = (showConn && type.includes('stem'))
    ? conn.protrusion : 0;

  // For multi-column stem trays, increase column gap so visual gap (after tab)
  // equals the row gap
  const columnGap = (showConn && type.includes('stem') && cols >= 2) ? gap + conn.protrusion : gap;
  const rowGap = gap;

  return (
    <div
      className={`rounded-2xl flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 transition-all`}
      style={{
        backgroundColor: trayBg,
        width: 'fit-content',
        maxWidth: '100%',
        padding: `${padding}px ${padding + rightBuffer}px ${padding}px`,
      }}
    >
      <div
        className="font-bold uppercase tracking-widest mb-2 pb-1 w-full text-center truncate"
        style={{ color: titleColor, fontSize: `${titleFontSize}px` }}
      >
        {title}
      </div>

      <div
        className="grid justify-items-center content-start"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          rowGap: `${rowGap}px`,
          columnGap: `${columnGap}px`,
          width: 'fit-content',
        }}
      >
        {items.map((item, i) => (
          <PuzzlePiece
            key={`${type}-${i}`}
            text={item}
            type={type}
            isSelected={selected === item}
            onClick={() => onSelect(item)}
            showConnectors={showConn}
            fixedWidth={pieceWidth}
            fontSize={fontSize}
            isDesktop={isDesktop}
          />
        ))}
      </div>
    </div>
  );
};
