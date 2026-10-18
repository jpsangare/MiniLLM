import React from 'react';
import { CheckCircle2, Circle, ArrowRight, Sparkles, RotateCcw } from 'lucide-react';
import { ActiveTab } from './Header';
import { useLanguage } from '../context/LanguageContext';

export interface StepDefinition {
  number: number;
  id: string;
  tabKey: ActiveTab;
  titleFr: string;
  titleEn: string;
  descFr: string;
  descEn: string;
  badgeFr: string;
  badgeEn: string;
  matchedTabs: ActiveTab[];
}

export const CANONICAL_5_STEPS: StepDefinition[] = [
  {
    number: 1,
    id: 'step-1',
    tabKey: 'donnees',
    titleFr: 'Étape 1 : Données & Tokenisation',
    titleEn: 'Step 1: Data & Tokenization',
    descFr: 'Corpus textuel, découpage en jetons discrets et vocabulaire de base.',
    descEn: 'Raw text corpus, token segmentation, and discrete vocabulary table.',
    badgeFr: 'Fondations',
    badgeEn: 'Foundations',
    matchedTabs: ['donnees'],
  },
  {
    number: 2,
    id: 'step-2',
    tabKey: 'matrice',
    titleFr: 'Étape 2 : Modèle & Poids de Transition',
    titleEn: 'Step 2: Model & Transition Weights',
    descFr: 'Probabilités conditionnelles, comptage des co-occurrences et matrice.',
    descEn: 'Conditional probabilities, co-occurrence counts, and transition matrix.',
    badgeFr: 'Apprentissage',
    badgeEn: 'Training',
    matchedTabs: ['modele', 'matrice'],
  },
  {
    number: 3,
    id: 'step-3',
    tabKey: 'generation',
    titleFr: 'Étape 3 : Inférence, Softmax & Température',
    titleEn: 'Step 3: Inference, Softmax & Temperature',
    descFr: 'Génération de texte mot à mot, réglage de la température et perplexité.',
    descEn: 'Word-by-word autoregressive generation, temperature scaling, perplexity.',
    badgeFr: 'Inférence',
    badgeEn: 'Inference',
    matchedTabs: ['generation'],
  },
  {
    number: 4,
    id: 'step-4',
    tabKey: 'finetune',
    titleFr: 'Étape 4 : Alignement (Fine-Tuning SFT & RLHF)',
    titleEn: 'Step 4: Alignment (SFT Fine-Tuning & RLHF)',
    descFr: 'Spécialisation sur questions/réponses et atténuation des réponses toxiques.',
    descEn: 'Instruction tuning on Q&A pairs and preference reward optimization.',
    badgeFr: 'Sécurité & Q/R',
    badgeEn: 'Safety & Q/A',
    matchedTabs: ['finetune', 'rlhf'],
  },
  {
    number: 5,
    id: 'step-5',
    tabKey: 'rag',
    titleFr: 'Étape 5 : Augmentation RAG & Chatbot Multi-Moteurs',
    titleEn: 'Step 5: RAG Augmentation & Multi-Engine Chat',
    descFr: 'Ancrage documentaire sur fichiers .txt et dialogue comparatif en direct.',
    descEn: 'Document grounding on .txt files and side-by-side interactive chat.',
    badgeFr: 'Déploiement',
    badgeEn: 'Deployment',
    matchedTabs: ['rag', 'chat'],
  },
];

interface ProgressTrackerCardProps {
  completedStepNumbers: number[];
  onNavigate: (tab: ActiveTab) => void;
  onResetProgress?: () => void;
  className?: string;
}

export const ProgressTrackerCard: React.FC<ProgressTrackerCardProps> = ({
  completedStepNumbers,
  onNavigate,
  onResetProgress,
  className = '',
}) => {
  const { language } = useLanguage();
  const isFr = language === 'fr';

  const count = completedStepNumbers.length;
  const percentage = Math.round((count / CANONICAL_5_STEPS.length) * 100);

  // Determine next step
  const nextStep = CANONICAL_5_STEPS.find(s => !completedStepNumbers.includes(s.number)) || CANONICAL_5_STEPS[0];

  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 space-y-4 shadow-xs transition-colors duration-200 ${className}`}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {isFr ? 'Parcours d’Apprentissage Conseillé' : 'Recommended Learning Track'}
            </span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {isFr ? `${count}/5 étapes complétées` : `${count}/5 steps completed`} ({percentage}%)
            </span>
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {isFr
              ? 'Indicateur de Progression des 5 Étapes du Modèle'
              : '5-Step Educational Model Progress Indicator'}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {count < 5 && (
            <button
              onClick={() => onNavigate(nextStep.tabKey)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <span>{isFr ? `Continuer : ${nextStep.titleFr}` : `Continue: ${nextStep.titleEn}`}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {onResetProgress && count > 0 && (
            <button
              onClick={onResetProgress}
              title={isFr ? 'Réinitialiser la progression' : 'Reset progress'}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* 5 Checklist Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
        {CANONICAL_5_STEPS.map(step => {
          const isDone = completedStepNumbers.includes(step.number);

          return (
            <button
              key={step.id}
              onClick={() => onNavigate(step.tabKey)}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 group ${
                isDone
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-slate-800 dark:text-slate-200'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                    isDone
                      ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {isFr ? step.badgeFr : step.badgeEn}
                </span>

                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-indigo-400 shrink-0" />
                )}
              </div>

              <div>
                <span className="font-bold text-xs block text-slate-900 dark:text-slate-100 leading-snug">
                  {isFr ? step.titleFr : step.titleEn}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1 leading-normal">
                  {isFr ? step.descFr : step.descEn}
                </span>
              </div>

              <div className="pt-1 flex items-center justify-between text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                <span>{isDone ? (isFr ? '✓ Revoir l’étape' : '✓ Review step') : (isFr ? 'Visiter ➔' : 'Visit ➔')}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

interface CompactProgressPillProps {
  completedCount: number;
  totalCount?: number;
  onClick?: () => void;
}

export const CompactProgressPill: React.FC<CompactProgressPillProps> = ({
  completedCount,
  totalCount = 5,
  onClick,
}) => {
  const { language } = useLanguage();
  const isFr = language === 'fr';

  return (
    <button
      onClick={onClick}
      title={isFr ? 'Progression dans le parcours conseillé des 5 étapes' : '5-step curriculum progress'}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer"
    >
      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
      <span>
        {isFr ? `Parcours : ${completedCount}/${totalCount} étapes` : `Track: ${completedCount}/${totalCount} steps`}
      </span>
    </button>
  );
};
