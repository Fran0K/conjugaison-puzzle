
import React, { useState } from 'react';
import { GRAMMAR_RULES } from '../constants';
import { CEFRLevel } from '../types';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { LEVEL_COLORS } from '../theme';

interface GrammarModalProps {
  isOpen: boolean;
  onClose: () => void;
}


export const GrammarModal: React.FC<GrammarModalProps> = ({ isOpen, onClose }) => {
  const { t, tTense, tRule } = useLanguage();
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToggle = (id: string) => {
    setExpandedRuleId(prev => prev === id ? null : id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-[calc(env(safe-area-inset-top)+16px)] bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90dvh] flex flex-col overflow-hidden">
        <div className="px-4 py-3 md:px-6 md:py-4 flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-3xl">
          <h2 className="text-xl font-m text-[#55534e] tracking-tight" >
            {t('rules')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-oat-light rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-warm-charcoal" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-3 scrollbar-hide hover:scrollbar-default ">
          <div className="grid gap-4 ">
            {GRAMMAR_RULES.map((rule) => {
              if (!rule.id || !rule.level) return null;
              const localizedRule = tRule(rule.id);
              const isExpanded = expandedRuleId === rule.id;
              if (!localizedRule) return null;

              const capsuleColor = LEVEL_COLORS[rule.level];

              return (
                <div
                  key={rule.id}
                  className={`rounded-2xl transition-shadow  transition-all duration-300 active:scale-95 hover:shadow-clay-hover overflow-hidden ${isExpanded ? 'border border-[#55534e]' : 'cursor-pointer'} ` }
                  style={{ backgroundColor: '#f5f4f2' }}
                  onClick={() => handleToggle(rule.id)}
                >
                  <div className="p-4 md:p-5">
                    <div className="flex flex-col gap-1 mb-2">
                      <div className="flex items-center justify-between">
                        <span
                          className="text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full text-white"
                          style={{ backgroundColor: capsuleColor }}
                        >
                          {rule.level}
                        </span>

                        <div className={`p-1 rounded-full transition-colors ${isExpanded ? 'bg-black/10' : 'bg-transparent'}`}>
                          {isExpanded ? <ChevronUp className="w-5 h-5 opacity-70" /> : <ChevronDown className="w-5 h-5 opacity-50" />}
                        </div>

                      </div>
                      <h3 className="font-medium tracking-normal text-xl text-black" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                        {localizedRule.title || tTense(rule.id)}
                      </h3>
                    </div>

                    <div className="text-sm mb-3 font-medium">
                      {localizedRule.formula}
                    </div>

                    {!isExpanded && (
                      <div className="text-sm italic font-medium text-warm-charcoal">
                        Ex: {localizedRule.example}
                      </div>
                    )}
                  </div>

                  {isExpanded && (
                    <div className="bg-white p-4 md:p-5 animate-in slide-in-from-top-2 duration-200">
                       <h4 className="text-xs font-semibold uppercase tracking-widest text-warm-silver mb-3">{t('Detail')}</h4>
                       {localizedRule.details ? (
                         <div className="space-y-3">
                           {localizedRule.details.map((detail, idx) => (
                             <div key={idx} className="bg-[#f5f4f2] p-3 rounded-xl">
                               <div className="font-semibold text-sm mb-1 text-black">{detail.label}</div>
                               <div className="text-sm text-warm-charcoal mb-1">{detail.text}</div>
                               {detail.examples && (
                                 <div className="text-xs italic text-warm-silver pt-2 mt-2">
                                   Ex: {detail.examples}
                                 </div>
                               )}
                             </div>
                           ))}
                         </div>
                       ) : (
                         <div className="text-sm text-warm-charcoal">
                            Exemple détaillé: <span className="font-medium italic text-black">{localizedRule.example}</span>
                            <br/><br/>
                            {localizedRule.description}
                         </div>
                       )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
