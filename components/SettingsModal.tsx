

import React, { useState, useEffect } from 'react';
import { GRAMMAR_RULES } from '../constants';
import { X, Check, Filter } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTenses: string[];
  onSave: (tenses: string[]) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, selectedTenses, onSave }) => {
  const { t, tTense } = useLanguage();
  const [tempSelected, setTempSelected] = useState<string[]>([]);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setTempSelected(selectedTenses);
    }
  }, [isOpen, selectedTenses]);

  if (!isOpen) return null;

  const handleToggle = (tenseId: string) => {
    setTempSelected(prev => {
      if (prev.includes(tenseId)) {
        // Allow deselecting all manually too, though the user now has a dedicated button
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 + pt-[calc(env(safe-area-inset-top)+16px)] bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 md:px-6 md:py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-2xl">
          <div className="flex items-center gap-2">
            
            <h2 className="text-xl font-display font-bold text-french-dark">
              {t('filter_title')}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="flex justify-between items-end mb-4">
             <p className="text-sm text-gray-500">{t('filter_desc')}</p>
             <div className="flex gap-4">
               <button 
                 onClick={handleSelectAll}
                 className="text-sm font-bold text-french-blue hover:underline"
               >
                 {t('select_all')}
               </button>
               <button 
                 onClick={handleDeselectAll}
                 className="text-sm font-bold text-french-red hover:underline"
               >
                 {t('deselect_all')}
               </button>
             </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {GRAMMAR_RULES.map((rule) => {
              const isSelected = tempSelected.includes(rule.id);
              return (
                <label 
                  key={rule.id}
                  className={`
                    relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                    ${isSelected 
                      ? `${rule.color.replace('text-', 'border-').split(' ')[1]} bg-white shadow-sm` 
                      : 'border-gray-100 bg-gray-50 opacity-70 hover:opacity-100'
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
                  <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-colors
                    ${isSelected 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : 'bg-white border-gray-300'
                    }
                  `}>
                    {isSelected && <Check className="w-4 h-4" />}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{tTense(rule.id)}</h3>
                    <p className="text-xs text-gray-500 truncate">{rule.example}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-4 py-3 md:px-6 md:py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
           <button
            onClick={onClose}
            className="px-6 py-2.5 md:py-3 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-colors"
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-2.5 md:py-3 bg-french-dark text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg"
          >
            {t('validate')} ({tempSelected.length})
          </button>
        </div>
      </div>
    </div>
  );
};
