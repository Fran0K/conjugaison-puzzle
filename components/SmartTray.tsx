import React from 'react';
import { PuzzlePiece } from './PuzzlePiece';
import { TrayConfig, TrayLayoutState } from '../types';

interface SmartTrayProps { 
  config: TrayConfig;
  layout: TrayLayoutState;
}

// Smart Tray (Pure Renderer)
// Strictly follows props from TrayGroup
export const SmartTray: React.FC<SmartTrayProps> = ({ config, layout }) => {
  const { items, type, selected, onSelect, title, color, showConnectors } = config;
  const { cols, pieceWidth } = layout;

  const titleColor = color === 'amber' ? 'text-[#fb923c]' : (color === 'blue' ? 'text-[#0ca5e9]' : 'text-french-red');
  const trayBg = color === 'amber' ? '#ffedd5' : (color === 'blue' ? '#e1f3fe' : '#ffffff');

  return (
    <div
      className={`p-2 sm:p-4 rounded-2xl flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 transition-all`}
      style={{
         backgroundColor: trayBg,
         // If layout is vertical (cols=1), fit content. If grid (cols=2), fit content but respect parent flex.
         // If horizontal strip (cols=4), width is based on content.
         width: 'fit-content',
         maxWidth: '100%'
      }}
    >
      <div className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2 pb-1 w-full text-center truncate ${titleColor}`}>
        {title}
      </div>
      
      <div 
        className="grid gap-3 sm:gap-4 justify-items-center content-start"
        style={{ 
          // Explicit grid template
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          width: 'fit-content'
        }}
      >
        {items.map((item, i) => (
          <PuzzlePiece 
            key={`${type}-${i}`} 
            text={item} 
            type={type} 
            isSelected={selected === item} 
            onClick={() => onSelect(item)} 
            showConnectors={showConnectors}
            fixedWidth={pieceWidth}
          />
        ))}
      </div>
    </div>
  );
};