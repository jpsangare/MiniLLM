import React, { useState } from 'react';
import {
  BookOpen,
  ArrowRight,
  Hash,
  Activity,
  Layers,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  Sliders,
  Compass,
} from 'lucide-react';
import { ActiveTab } from './Header';
import { useLanguage } from '../context/LanguageContext';
import { getTokenColor } from '../utils/tokenizer';

interface PrerequisitesSectionProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const PrerequisitesSection: React.FC<PrerequisitesSectionProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isFr = language === 'fr';

  // Interactive Mini Demo 1: Tokenizer preview
  const [tokenInput, setTokenInput] = useState<string>(
    isFr ? 'le chat mange une pomme' : 'the cat eats an apple'
  );

  const sampleTokens = React.useMemo(() => {
    return tokenInput
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word, idx) => ({
        id: idx + 101,
        text: word,
        color: getTokenColor(idx),
      }));
  }, [tokenInput]);

  // Interactive Mini Demo 2: Conditional Probability
  const [selectedContext, setSelectedContext] = useState<string>(
    isFr ? 'le chat' : 'the cat'
  );

  const probabilityDistributions: Record<
    string,
    { word: string; count: number; total: number; prob: number; color: string }[]
  > = {
    'le chat': [
      { word: 'mange', count: 6, total: 10, prob: 60, color: 'bg-emerald-500' },
      { word: 'dort', count: 3, total: 10, prob: 30, color: 'bg-indigo-500' },
      { word: 'chasse', count: 1, total: 10, prob: 10, color: 'bg-amber-500' },
    ],
    'le renard': [
      { word: 'flatte', count: 5, total: 8, prob: 62.5, color: 'bg-emerald-500' },
      { word: 'mange', count: 2, total: 8, prob: 25, color: 'bg-indigo-500' },
      { word: 'regarde', count: 1, total: 8, prob: 12.5, color: 'bg-amber-500' },
    ],
    'the cat': [
      { word: 'eats', count: 6, total: 10, prob: 60, color: 'bg-emerald-500' },
      { word: 'sleeps', count: 3, total: 10, prob: 30, color: 'bg-indigo-500' },
      { word: 'chases', count: 1, total: 10, prob: 10, color: 'bg-amber-500' },
    ],
    'the fox': [
      { word: 'flatters', count: 5, total: 8, prob: 62.5, color: 'bg-emerald-500' },
      { word: 'eats', count: 2, total: 8, prob: 25, color: 'bg-indigo-500' },
      { word: 'watches', count: 1, total: 8, prob: 12.5, color: 'bg-amber-500' },
    ],
  };

  const currentDist =
    probabilityDistributions[selectedContext] ||
    probabilityDistributions[isFr ? 'le chat' : 'the cat'];

  // Interactive Mini Demo 3: Embedding 2D distance
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);

  const embeddingPoints = [
    { label: isFr ? 'chat' : 'cat', x: 25, y: 35, category: 'animaux', catLabel: isFr ? 'Animaux' : 'Animals' },
    { label: isFr ? 'loup' : 'wolf', x: 22, y: 48, category: 'animaux', catLabel: isFr ? 'Animaux' : 'Animals' },
    { label: isFr ? 'renard' : 'fox', x: 30, y: 42, category: 'animaux', catLabel: isFr ? 'Animaux' : 'Animals' },
    { label: isFr ? 'pomme' : 'apple', x: 75, y: 70, category: 'nourriture', catLabel: isFr ? 'Nourriture' : 'Food' },
    { label: isFr ? 'tarte' : 'pie', x: 80, y: 65, category: 'nourriture', catLabel: isFr ? 'Nourriture' : 'Food' },
    { label: isFr ? 'fromage' : 'cheese', x: 70, y: 78, category: 'nourriture', catLabel: isFr ? 'Nourriture' : 'Food' },
    { label: isFr ? 'hiver' : 'winter', x: 35, y: 80, category: 'saison', catLabel: isFr ? 'Saisons' : 'Seasons' },
    { label: isFr ? 'été' : 'summer', x: 42, y: 85, category: 'saison', catLabel: isFr ? 'Saisons' : 'Seasons' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-xs transition-colors duration-200">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>{isFr ? 'Notions Fondamentales · 3 Prérequis Clés' : 'Core Foundations · 3 Key Prerequisites'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {isFr
              ? 'Les 3 Notions Indispensables pour Comprendre les LLM'
              : 'The 3 Essential Notions to Understand LLMs'}
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            {isFr
              ? 'Avant d\'explorer les modèles de langage et les réseaux de neurones, prenez 2 minutes pour vous familiariser avec ces trois briques mathématiques et informatiques. Tout le fonctionnement des IA génératives repose sur elles.'
              : 'Before exploring language models and neural networks, take 2 minutes to discover these three mathematical and computational pillars. All generative AI is built upon them.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('donnees')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <span>{isFr ? 'Je maîtrise déjà ➔ Passer à l’Étape 1 : Données' : 'Already clear ➔ Go to Step 1: Data'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('userguide')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>{isFr ? 'Retour au Guide d’accueil' : 'Back to Welcome Guide'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Prerequisite Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prerequisite 1: Token */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 space-y-4 shadow-2xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Hash className="w-5 h-5" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {isFr ? 'Notion 1' : 'Pillar 1'}
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {isFr ? 'Le Token (L’Atome du Texte)' : 'The Token (Text Atom)'}
              </h2>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {isFr
                ? 'Les ordinateurs ne manipulent pas des lettres ou des phrases, mais des nombres. Un « token » est un morceau de texte (mot, syllabe ou caractère) associé à un identifiant unique (Token ID).'
                : 'Computers do not process letters or sentences, but numbers. A "token" is a chunk of text (word, sub-word, or punctuation) mapped to a unique numeric Token ID.'}
            </p>

            {/* Interactive mini-demo */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/60 space-y-2.5">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 block">
                {isFr ? 'Testez le découpage en direct :' : 'Live Token Split Preview:'}
              </span>
              <input
                type="text"
                value={tokenInput}
                onChange={e => setTokenInput(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono"
                placeholder="Tapez une phrase..."
              />

              <div className="flex flex-wrap gap-1.5 pt-1">
                {sampleTokens.map(tok => (
                  <span
                    key={tok.id}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono border"
                    style={{
                      backgroundColor: `${tok.color}15`,
                      borderColor: `${tok.color}50`,
                      color: tok.color,
                    }}
                  >
                    <span>{tok.text}</span>
                    <span className="text-[9px] opacity-70">#{tok.id}</span>
                  </span>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
              {isFr
                ? 'Dans un LLM réel (comme GPT), le vocabulaire compte ~100 000 tokens (BPE).'
                : 'In real LLMs (like GPT), vocabulary spans ~100,000 sub-word tokens (BPE).'}
            </p>
          </div>

          <button
            onClick={() => onNavigate('donnees')}
            className="w-full py-2 px-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-semibold text-xs border border-indigo-200 dark:border-indigo-800 transition-colors inline-flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>{isFr ? 'Explorer la Tokenisation' : 'Explore Tokenization'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Prerequisite 2: Conditional Probability */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 space-y-4 shadow-2xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {isFr ? 'Notion 2' : 'Pillar 2'}
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {isFr ? 'La Probabilité Conditionnelle' : 'Conditional Probability'}
              </h2>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {isFr
                ? 'Un LLM prédit le mot suivant selon la formule P(mot suivant | contexte). Il calcule : sachant le texte précédent, quelle est la fréquence statistique de chaque candidat dans le corpus d’apprentissage ?'
                : 'An LLM predicts the next word via P(next word | context). It computes: given prior text, what is the statistical frequency of each candidate in training data?'}
            </p>

            {/* Interactive distribution preview */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/60 space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                <span>{isFr ? 'Contexte précédent :' : 'Prior context:'}</span>
                <span className="font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400">
                  "{selectedContext}"
                </span>
              </div>

              <div className="space-y-1.5 pt-1">
                {currentDist.map(item => (
                  <div key={item.word} className="space-y-0.5">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-800 dark:text-slate-200 font-semibold">{item.word}</span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {item.count}/{item.total} ({item.prob}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`${item.color} h-full rounded-full transition-all duration-300`}
                        style={{ width: `${item.prob}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
              {isFr
                ? 'Le total de toutes les probabilités conditionnelles est toujours égal à 100% (1.0).'
                : 'The sum of all conditional probabilities is strictly 100% (1.0).'}
            </p>
          </div>

          <button
            onClick={() => onNavigate('matrice')}
            className="w-full py-2 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-semibold text-xs border border-emerald-200 dark:border-emerald-800 transition-colors inline-flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>{isFr ? 'Voir la Matrice Complète' : 'Inspect Full Matrix'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Prerequisite 3: Vector / Embedding */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 space-y-4 shadow-2xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Layers className="w-5 h-5" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                {isFr ? 'Notion 3' : 'Pillar 3'}
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {isFr ? 'Le Vecteur & Embedding (Espace Sémantique)' : 'Vector & Embedding (Semantic Space)'}
              </h2>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {isFr
                ? 'Un « embedding » est une liste de coordonnées projetant un mot dans un espace géométrique. Des mots qui partagent le même contexte (ex: chat, loup, renard) se retrouvent proches géométriquement.'
                : 'An "embedding" is a list of numerical coordinates mapping a word in space. Words appearing in similar contexts cluster close together geometrically.'}
            </p>

            {/* Interactive mini 2D map */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/60 space-y-2">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 block">
                {isFr ? 'Survolez un mot pour voir ses voisins :' : 'Hover a word to see its cluster:'}
              </span>

              <div className="relative h-28 w-full bg-white dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800 overflow-hidden">
                {/* Axis lines */}
                <div className="absolute top-1/2 left-0 right-0 border-t border-slate-100 dark:border-slate-900" />
                <div className="absolute left-1/2 top-0 bottom-0 border-l border-slate-100 dark:border-slate-900" />

                {embeddingPoints.map(pt => {
                  const isHovered = hoveredPoint === pt.label;
                  return (
                    <button
                      key={pt.label}
                      onMouseEnter={() => setHoveredPoint(pt.label)}
                      onMouseLeave={() => setHoveredPoint(null)}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[10px] font-mono transition-transform cursor-pointer ${
                        pt.category === 'animaux'
                          ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800'
                          : pt.category === 'nourriture'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      } ${isHovered ? 'scale-125 z-10 font-bold ring-2 ring-purple-400' : ''}`}
                      style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                    >
                      {pt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
              {isFr
                ? 'En 2D pour les humains ; en 4096 dimensions continues dans un modèle réel.'
                : 'Projected in 2D for human eyes; ~4096 continuous dimensions in real LLMs.'}
            </p>
          </div>

          <button
            onClick={() => onNavigate('modele')}
            className="w-full py-2 px-3 rounded-lg bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-700 dark:text-purple-300 font-semibold text-xs border border-purple-200 dark:border-purple-800 transition-colors inline-flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>{isFr ? 'Visualiser l’Espace 2D du Modèle' : 'View Model 2D Space'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Guided Walkthrough Banner */}
      <div className="bg-indigo-600 text-white rounded-xl p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-2xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-200">
            {isFr ? 'Prêt à démarrer l’expérimentation ?' : 'Ready to start experimenting?'}
          </span>
          <h3 className="text-lg sm:text-xl font-bold">
            {isFr ? 'Parcours Conseillé : Étape 1 · Données & Tokenisation' : 'Guided Track: Step 1 · Data & Tokens'}
          </h3>
          <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
            {isFr
              ? 'Voyez comment un texte libre est découpé mot par mot, explorez la table de fréquence et apprenez votre premier modèle didactique.'
              : 'See how raw text is broken down word by word, explore frequency counts, and train your first educational model.'}
          </p>
        </div>

        <button
          onClick={() => onNavigate('donnees')}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-sm shadow-sm transition-colors cursor-pointer shrink-0"
        >
          <span>{isFr ? 'Commencer l’Étape 1 ➔' : 'Start Step 1 ➔'}</span>
        </button>
      </div>
    </div>
  );
};
