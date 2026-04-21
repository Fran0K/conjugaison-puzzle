import React, { useState, useEffect } from 'react';
import { GRAMMAR_RULES } from '../constants';
import { CEFRLevel } from '../types';
import { X, Check, Filter } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { LEVEL_COLORS } from '../theme';
import { useModalAnimation } from '../hooks/useModalAnimation';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTenses: string[];
  onSave: (tenses: string[]) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, selectedTenses, onSave }) => {
  const { t, tTense } = useLanguage();
  const [tempSelected, setTempSelected] = useState<string[]>([]);
  const { shouldRender, closing, handleAnimationEnd } = useModalAnimation(isOpen, onClose);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setTempSelected(selectedTenses);
    }
  }, [isOpen, selectedTenses]);

  if (!shouldRender) return null;

  const handleToggle = (tenseId: string) => {
    setTempSelected(prev => {
      if (prev.includes(tenseId)) {
        return prev.filter(id => id !== tenseId);
      } else {
        return [...prev, tenseId];
      }
    });
  };

  const handleSelectAll = () => {
    setTempSelected(GRAMMAR_RULES.map(r => r.id));
  };

  const handleDeselectAll = () => {
    setTempSelected([]);
  };

  const handleSave = () => {
    onSave(tempSelected);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 pt-[calc(env(safe-area-inset-top)+16px)] bg-black/50 backdrop-blur-sm ${closing ? 'modal-overlay-exit' : 'modal-overlay-enter'}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className={`bg-cream rounded-3xl w-full max-w-lg max-h-[90dvh] flex flex-col border border-oat ${closing ? 'modal-content-exit' : 'modal-content-enter'}`}>
        {/* Header */}
        <div className="px-4 py-3 md:px-6 md:py-4 flex justify-between items-center sticky top-0 bg-cream z-10 rounded-t-3xl">
          <div className="flex items-center gap-2">

            <h2 className="text-xl font-m text-[#55534e] tracking-tight">
              {t('filter_title')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-oat-light rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-warm-charcoal" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-6 scrollbar-hide hover:scrollbar-default">
          <div className="flex justify-between items-end mb-4">
             <p className="text-sm text-warm-charcoal">{t('filter_desc')}</p>
             <div className="flex gap-4">
               <button
                 onClick={handleSelectAll}
                 className="text-sm font-semibold text-black hover:underline"
               >
                 {t('select_all')}
               </button>
               <button
                 onClick={handleDeselectAll}
                 className="text-sm font-semibold text-[#e60023] hover:underline"
               >
                 {t('deselect_all')}
               </button>
             </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {GRAMMAR_RULES.map((rule) => {
              const isSelected = tempSelected.includes(rule.id);
              const level = rule.level as CEFRLevel | undefined;
              return (
                <label
                  key={rule.id}
                  className={`
                    relative flex items-center p-4 rounded-2xl border cursor-pointer transition-all duration-200
                    ${isSelected
                      ? 'border-[#55534e] bg-white'
                      : 'border-oat-light bg-cream/50 opacity-60 hover:opacity-100'
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isSelected}
                    onChange={() => handleToggle(rule.id)}
                  />

                  {/* Custom Checkbox */}
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 transition-colors"
                    style={{
                      borderColor: level ? LEVEL_COLORS[level] : '#dad4c8',
                      backgroundColor: isSelected && level ? LEVEL_COLORS[level] : 'transparent',
                      color: '#ffffff',
                    }}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-m text-black">{tTense(rule.id)}</h3>
                    <p className="text-xs text-warm-silver truncate">{rule.example}</p>
                  </div>

                  {level && (
                    <span
                      className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: LEVEL_COLORS[level] }}
                    >
                      {level}
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 md:px-6 md:py-4 border-t border-oat bg-cream rounded-b-3xl flex justify-end gap-3">
           <button
            onClick={onClose}
            className="px-6 py-2.5 md:py-3 text-warm-charcoal font-semibold hover:bg-oat-light rounded-xl transition-colors p-2 border border-[#9f9b93] "
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-2.5 md:py-3 bg-black text-white rounded-xl font-semibold hover:bg-warm-charcoal transition-colors"
          >
            {t('validate')} ({tempSelected.length})
          </button>
        </div>
      </div>
    </div>
  );
};
