import React from 'react';
import { PuzzlePiece } from './PuzzlePiece';
import { SlotType } from '../types';

interface PuzzleOption {
  id: string;
  text: string;
  type: SlotType;
}

interface PuzzleZoneProps {
  options: PuzzleOption[]; // 这里的数组最多12个
  onPieceClick: (option: PuzzleOption) => void;
}

export const PuzzleZone: React.FC<PuzzleZoneProps> = ({ options, onPieceClick }) => {
  return (
    // 使用 Flex 布局，自动换行，居中对齐
    <div className="flex flex-wrap gap-4 p-4 justify-center w-full">
      {options.map((option) => (
        <PuzzlePiece
          key={option.id}
          text={option.text}
          type={option.type}
          isSelected={false}
          onClick={() => onPieceClick(option)}
          // 移除 fixedWidth，让 PuzzlePiece 根据内容自适应或使用默认最小宽度
        />
      ))}
    </div>
  );
};