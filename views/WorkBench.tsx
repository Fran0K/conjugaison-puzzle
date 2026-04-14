
import React from 'react';
import { Plus } from 'lucide-react';
import { DropZone } from '../components/DropZone';
import { PuzzleData, GameState, ValidationState } from '../types';
import { useLanguage } from '../LanguageContext';

interface WorkBenchProps {
  puzzle: PuzzleData;
  gameState: GameState;
  selection: {
    stem: string | null;
    ending: string | null;
    auxStem: string | null;
    auxEnding: string | null;
  };
  validation: ValidationState | null;
  actions: {
    selectStem: (s: string) => void;
    selectEnding: (s: string) => void;
    selectAuxStem: (s: string) => void;
    selectAuxEnding: (s: string) => void;
  };
  // Ref for tutorial
  dropZoneRef?: React.RefObject<HTMLDivElement | null>;
}

export const WorkBench: React.FC<WorkBenchProps> = ({
  puzzle,
  gameState,
  selection,
  validation,
  actions,
  dropZoneRef
}) => {
  const { t } = useLanguage();

  const isCompound = !!puzzle.auxStem;
  
  // Logic for mobile layout compacting
  // Rule:
  // 1. Simple Tense (!isCompound) -> Always Horizontal (Compact)
  // 2. Compound Tense -> Horizontal ONLY IF both Aux and Verb are single blocks (no endings).
  //    If either Aux or Verb has an ending, force Vertical (Stack) to ensure enough width.
  const isCompact = !isCompound || (puzzle.auxEnding === null && puzzle.correctEnding === null);

  return (
    <div 
      ref={dropZoneRef} 
      className={`flex ${isCompact ? 'flex-row' : 'flex-col'} sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-10 w-full transition-all duration-300`}
    >
      {isCompound && (
        <div className="flex items-center justify-center bg-[#ffedd5]/70 p-1 sm:p-1.5 rounded-2xl">
          <DropZone 
            type="aux-stem" 
            content={selection.auxStem} 
            placeholder={t('stem_zone')} 
            onClear={() => actions.selectAuxStem(selection.auxStem!)}
            onDrop={(text) => actions.selectAuxStem(text)}
            isCorrect={gameState === GameState.SUCCESS ? true : (validation?.auxStem ?? null)}
            position={puzzle.auxEnding !== null ? 'left' : 'single'}
          />
          {puzzle.auxEnding !== null && (
            <DropZone 
              type="aux-ending" 
              content={selection.auxEnding} 
              placeholder={t('ending_zone')} 
              onClear={() => actions.selectAuxEnding(selection.auxEnding!)}
              onDrop={(text) => actions.selectAuxEnding(text)}
              isCorrect={gameState === GameState.SUCCESS ? true : (validation?.auxEnding ?? null)}
              position="right"
            />
          )}
        </div>
      )}

      {isCompound && (
         <Plus className={`text-[#55534e] w-4 h-4 sm:w-5 sm:h-5 ${isCompact ? 'rotate-0' : 'rotate-90'} sm:rotate-0 transition-transform`} />
      )}

      <div className="flex items-center justify-center bg-[#e1f3fe]/70 p-1 sm:p-1.5 rounded-2xl">
        <DropZone 
          type="stem" 
          content={selection.stem} 
          placeholder={t('stem_zone')} 
          onClear={() => actions.selectStem(selection.stem!)}
          onDrop={(text) => actions.selectStem(text)}
          isCorrect={gameState === GameState.SUCCESS ? true : (validation?.stem ?? null)}
          position={puzzle.correctEnding !== null ? 'left' : 'single'}
        />
        
        {puzzle.correctEnding !== null && (
          <DropZone 
            type="ending" 
            content={selection.ending} 
            placeholder={t('ending_zone')} 
            onClear={() => actions.selectEnding(selection.ending!)}
            onDrop={(text) => actions.selectEnding(text)}
            isCorrect={gameState === GameState.SUCCESS ? true : (validation?.ending ?? null)}
            position="right"
          />
        )}
      </div>
    </div>
  );
};
