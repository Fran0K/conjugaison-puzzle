import React from 'react';
import { GRAMMAR_RULES } from '../constants';
import { X } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface GrammarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GrammarModal: React.FC<GrammarModalProps> = ({ isOpen, onClose }) => {
  const { t, tTense, tRule } = useLanguage();
  if (!isOpen) return null;

  return (
    // <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 + pt-[calc(env(safe-area-inset-top)+16px)] bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="px-4 py-3 md:px-6 md:py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-2xl">
          <h2 className="text-2xl font-display font-bold text-french-dark">
            {t('rules')}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <p className="text-gray-600">
            Logique des temps / Tense Logic:
          </p>

          <div className="grid gap-4">
            {GRAMMAR_RULES.map((rule) => (
              <div key={rule.id} className={`p-5 rounded-xl border-l-4 ${rule.color}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                  <h3 className="font-bold text-lg">{tTense(rule.id)}</h3>
                </div>
                <div className="font-mono text-sm bg-white/50 inline-block px-3 py-1 rounded mb-3 font-semibold">
                  {rule.formula}
                </div>
                <p className="text-sm mb-3 opacity-90 leading-relaxed">
                  {tRule(rule.id) || rule.description}
                </p>
                <div className="text-sm italic font-medium">
                  Ex: {rule.example}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="px-4 py-3 md:px-6 md:py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full py-2.5 md:py-3 bg-french-dark text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};