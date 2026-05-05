import React from 'react';
import { PuzzlePiece } from './PuzzlePiece';
import { TrayConfig, TrayLayoutState } from '../types';
import { COLORS, TRAY, FONT } from '../theme';

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

  const trayConfig = isDesktop ? TRAY.desktop : TRAY.mobile;
  const padding = trayConfig.padding;
  const gap = trayConfig.gap;
  const titleFontSize = isDesktop ? FONT.trayTitle.desktop : FONT.trayTitle.mobile;

  return (
    <div
      className={`rounded-2xl flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 transition-all`}
      style={{
        backgroundColor: trayBg,
        width: 'fit-content',
        maxWidth: '100%',
        padding: `${padding}px`,
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
          rowGap: `${gap}px`,
          columnGap: `${gap}px`,
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
