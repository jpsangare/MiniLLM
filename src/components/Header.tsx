import React from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';

export type ActiveTab = 'userguide' | 'donnees' | 'modele' | 'matrice' | 'generation' | 'finetune' | 'rlhf' | 'rag' | 'chat' | 'guide';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onReset: () => void;
  vocabSize: number;
  totalTokensCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onReset,
  vocabSize,
  totalTokensCount,
}) => {
  const isBaseModelGroup = ['donnees', 'modele', 'matrice', 'generation'].includes(activeTab);
  const isAlignmentGroup = ['finetune', 'rlhf'].includes(activeTab);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Wordmark in single line display face */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <span className="font-mono font-bold text-base leading-none">M</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
            MiniLLM Studio
          </span>
          <span className="hidden lg:inline text-xs text-slate-400 font-normal">
            · Simulateur pédagogique
          </span>
        </div>

        {/* Zone 2: 5 single-line nav tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 md:gap-3 text-xs sm:text-sm font-medium text-slate-600 overflow-x-auto py-2">
          <button
            onClick={() => setActiveTab('userguide')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'userguide'
                ? 'bg-slate-100 text-indigo-700 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            0. Guide
          </button>
          <button
            onClick={() => setActiveTab(isBaseModelGroup ? activeTab : 'donnees')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              isBaseModelGroup
                ? 'bg-slate-100 text-indigo-700 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            1. Modèle Base
          </button>
          <button
            onClick={() => setActiveTab(isAlignmentGroup ? activeTab : 'finetune')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              isAlignmentGroup
                ? 'bg-purple-50 text-purple-700 font-semibold border border-purple-200'
                : 'hover:text-slate-900'
            }`}
          >
            2. Alignement & RL
          </button>
          <button
            onClick={() => setActiveTab('rag')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'rag'
                ? 'bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200'
                : 'hover:text-slate-900'
            }`}
          >
            3. RAG Simple
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200'
                : 'hover:text-slate-900'
            }`}
          >
            4. Chatbot
          </button>
        </nav>

        {/* Zone 3: Single primary action & Code button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('guide')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-semibold'
                : 'text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50'
            }`}
            title="Cartographie des fonctions du code"
          >
            <span className="font-mono text-[11px]">&lt;/&gt;</span>
            <span className="hidden sm:inline">Code & Fonctions</span>
          </button>

          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title="Réinitialiser avec le corpus par défaut"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Réinitialiser</span>
          </button>
        </div>
      </div>
    </header>
  );
};
