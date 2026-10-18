import React, { useState } from 'react';
import { Info, Check, X, ChevronDown, ChevronUp, Cpu, Sparkles, BookOpen } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ModelNatureDisclaimerProps {
  className?: string;
  defaultExpanded?: boolean;
}

export const ModelNatureDisclaimer: React.FC<ModelNatureDisclaimerProps> = ({
  className = '',
  defaultExpanded = true,
}) => {
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);

  const isFr = language === 'fr';

  return (
    <div
      className={`border rounded-xl transition-all duration-200 overflow-hidden ${
        isExpanded
          ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/80 shadow-xs'
          : 'bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-900/60'
      } ${className}`}
    >
      {/* Header bar */}
      <div className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-700/60 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-200/80 dark:bg-amber-900/70 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                {isFr ? 'Simulation Pédagogique Jouet (Toy Model)' : 'Educational Toy Simulation'}
              </span>
              <span className="text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                {isFr ? 'Comptage de co-occurrences · Pas un transformeur de milliards de paramètres' : 'Co-occurrence counting · Not a billion-parameter Transformer'}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
              {isFr
                ? 'Nature du modèle : ce qu’il simule fidèlement et ce qu’il ne simule pas'
                : 'Model Nature: What it accurately simulates vs what it does not'}
            </h3>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(prev => !prev)}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-amber-300 dark:border-amber-700/60 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer shrink-0"
        >
          <span>{isExpanded ? (isFr ? 'Masquer les détails' : 'Hide details') : (isFr ? 'En savoir plus' : 'Learn more')}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Main explanation content */}
      {isExpanded && (
        <div className="px-4 sm:px-5 pb-5 pt-0 border-t border-amber-200/70 dark:border-amber-800/50 space-y-4">
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
            {isFr ? (
              <>
                <strong>MiniLLM Studio est un modèle didactique miniature :</strong> il fonctionne sur un corpus court (quelques dizaines à centaines de tokens) et utilise des statistiques de transition locales (matrices de co-occurrence de type chaîne de Markov / n-grammes). Il a été conçu pour ouvrir la « boîte noire » et rendre chaque équation directement observable, manipulable et transparente.
              </>
            ) : (
              <>
                <strong>MiniLLM Studio is a miniature educational model:</strong> it runs on a concise corpus (dozens to hundreds of tokens) using local statistical transitions (Markov / n-gram co-occurrence matrices). It is designed to open the "black box" and make every equation directly visible, interactive, and transparent.
              </>
            )}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Column 1: What it simulates */}
            <div className="bg-white/80 dark:bg-slate-900/80 rounded-lg p-3.5 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold text-xs uppercase tracking-wide">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{isFr ? 'Ce que cette simulation reproduit fidèlement' : 'What this simulation faithfully reproduces'}</span>
              </div>
              <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                  <span><strong>Tokenisation & Vocabulaire :</strong> Découpage en jetons discrets et assignation de Token IDs uniques.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                  <span><strong>Probabilités conditionnelles & Logits :</strong> Calcul de <em>P(mot suivant | contexte)</em> et conversion en scores.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                  <span><strong>Softmax & Température ($T$) :</strong> Transformation des logits en distribution de probabilité et contrôle du hasard.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                  <span><strong>Fine-Tuning supervisé (SFT) :</strong> Rééquilibrage des probabilités cibles sur des paires Question ➔ Réponse.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                  <span><strong>Alignement RLHF / DPO :</strong> Optimisation de politique sous pénalité de divergence KL pour favoriser des réponses sûres.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                  <span><strong>Augmentation documentaire (RAG) :</strong> Découpage en chunks et injection du passage pertinent dans l'invite.</span>
                </li>
              </ul>
            </div>

            {/* Column 2: What it does NOT simulate */}
            <div className="bg-white/80 dark:bg-slate-900/80 rounded-lg p-3.5 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wide">
                <X className="w-4 h-4 text-rose-500" />
                <span>{isFr ? 'Ce qu’elle ne simule pas (limites par rapport à GPT / Gemini)' : 'What it does NOT simulate (vs real GPT / Gemini)'}</span>
              </div>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold">✗</span>
                  <span><strong>Pas de Self-Attention multi-têtes :</strong> Pas de calcul de dépendances croisées matricielles profondes entre tokens distants.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold">✗</span>
                  <span><strong>Pas d'espace latent dense multi-dimensionnel :</strong> Pas de couches cachées continues à 4096 dimensions.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold">✗</span>
                  <span><strong>Pas de rétropropagation massive sur GPU :</strong> L'apprentissage est un comptage instantané, pas des téraflops d'optimisation AdamW.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold">✗</span>
                  <span><strong>Pas de raisonnement émergent ou de bon sens :</strong> Le modèle ne comprend pas le sens du monde ; il recombine des co-occurrences observées.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold">✗</span>
                  <span><strong>Pas d'échelle encyclopédique :</strong> La mémoire du modèle est strictement confinée au texte fourni dans le tableau de bord.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
