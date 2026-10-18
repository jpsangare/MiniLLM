import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  BookOpen,
  Sparkles,
  Database,
  Sliders,
  FileText,
  Bot,
  Code2,
  CheckCircle2,
  Zap,
  HelpCircle,
  Lightbulb,
  ThumbsUp,
  ShieldCheck,
  ShieldAlert,
  Cpu,
  Layers,
  Activity,
  FileUp,
  Scale,
  MessageSquare,
  TrendingUp,
  Award,
  ChevronDown,
  ChevronUp,
  Grid,
} from 'lucide-react';
import { ActiveTab } from './Header';
import { ModelNatureDisclaimer } from './ModelNatureDisclaimer';
import { ProgressTrackerCard, CANONICAL_5_STEPS } from './ProgressIndicator';
import { useLanguage } from '../context/LanguageContext';

interface UserGuideSectionProps {
  onNavigate: (tab: ActiveTab) => void;
  completedStepNumbers?: number[];
  onResetProgress?: () => void;
}

export const UserGuideSection: React.FC<UserGuideSectionProps> = ({
  onNavigate,
  completedStepNumbers = [],
  onResetProgress,
}) => {
  const { language } = useLanguage();
  const isFr = language === 'fr';
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const steps = [
    {
      number: '1',
      title: 'Étape 1 : Données d\'Entraînement & Tokenisation',
      tabKey: 'donnees' as ActiveTab,
      subTabs: [
        { label: 'Données & Tokens', key: 'donnees' as ActiveTab },
        { label: 'Dictionnaire Vocabulaire', key: 'donnees' as ActiveTab },
      ],
      icon: Database,
      badge: 'Étape 1 · Données & Vocabulaire',
      color: 'border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300',
      description:
        'Comprenez comment la machine découpe le texte brut en tokens discrets et leur assigne des Token IDs uniques. Testez différents corpus bilingues et inspectez la table de fréquence des mots.',
      actions: [
        'Basculez entre corpus français et anglais (Fables, Cuisine, Météo, Biais).',
        'Éditez le corpus textuel libre pour injecter de nouvelles phrases d\'apprentissage.',
        'Observez l\'attribution instantanée des Token IDs et des balises spéciales <DEBUT> et <FIN>.',
      ],
      buttonLabel: 'Explorer les Données & Tokens',
    },
    {
      number: '2',
      title: 'Étape 2 : Modèle & Poids de Transition',
      tabKey: 'matrice' as ActiveTab,
      subTabs: [
        { label: 'Poids & Matrice', key: 'matrice' as ActiveTab },
        { label: 'Mon Modèle (2D)', key: 'modele' as ActiveTab },
      ],
      icon: Grid,
      badge: 'Étape 2 · Poids & Probabilités',
      color: 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300',
      description:
        'Le modèle apprend en comptant les transitions : P(mot suivant | contexte). Visualisez la matrice complète des probabilités, exportez le checkpoint standard JSON et observez les regroupements de mots en 2D.',
      actions: [
        'Consultez la matrice interactive des co-occurrences pour chaque mot.',
        'Basculez la fenêtre de contexte de 1 à 2 mots précédents.',
        'Téléchargez les poids du modèle en format JSON ou lancez une session d\'entraînement simulée.',
      ],
      buttonLabel: 'Inspecter les Poids & la Matrice',
    },
    {
      number: '3',
      title: 'Étape 3 : Inférence, Softmax & Température',
      tabKey: 'generation' as ActiveTab,
      subTabs: [
        { label: 'Inférence & Softmax', key: 'generation' as ActiveTab },
        { label: 'Cartes d\'Attention', key: 'generation' as ActiveTab },
        { label: 'Gradients & Backprop', key: 'generation' as ActiveTab },
      ],
      icon: Sparkles,
      badge: 'Étape 3 · Génération & Échantillonnage',
      color: 'border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300',
      description:
        'Générez du texte mot à mot en direct. Modulez le curseur de Température pour passer d\'une répétition déterministe à une exploration créative, surveillez la perplexité et explorez les Attention Maps.',
      actions: [
        'Lancez l\'Auto-Play pour voir le modèle prédire token par token en direct.',
        'Ajustez la température de 0.1 à 2.0 et observez l\'aplatissement de la courbe Softmax.',
        'Activez le visualiseur de rétropropagation pour voir le gradient ∂Loss/∂z = p - y en action.',
      ],
      buttonLabel: 'Tester l\'Inférence & Softmax',
    },
    {
      number: '4',
      title: 'Étape 4 : Alignement (Fine-Tuning SFT & RLHF)',
      tabKey: 'finetune' as ActiveTab,
      subTabs: [
        { label: 'Phase 1 : Fine-Tuning (SFT)', key: 'finetune' as ActiveTab },
        { label: 'Phase 2 : Renforcement (RLHF/DPO)', key: 'rlhf' as ActiveTab },
      ],
      icon: Sliders,
      badge: 'Étape 4 · Alignement & Sécurité',
      color: 'border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300',
      description:
        'Un modèle brut complète sans structure. Le SFT lui apprend le rôle d\'assistant via des paires Q/R, tandis que le RLHF/DPO pénalise les réponses dangereuses sous contrainte de divergence KL.',
      actions: [
        'Entraînez le modèle sur des paires d\'instructions personnalisées.',
        'Votez 👍 / 👎 sur des paires de sécurité et appliquez des récompenses.',
        'Réglez la pénalité de divergence KL pour empêcher le reward hacking.',
      ],
      buttonLabel: 'Pratiquer l\'Alignement (SFT & RLHF)',
    },
    {
      number: '5',
      title: 'Étape 5 : Augmentation RAG & Chatbot Multi-Moteurs',
      tabKey: 'rag' as ActiveTab,
      subTabs: [
        { label: 'RAG Simple (Documents)', key: 'rag' as ActiveTab },
        { label: 'Chatbot Multi-Moteur', key: 'chat' as ActiveTab },
      ],
      icon: FileText,
      badge: 'Étape 5 · Déploiement & RAG',
      color: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300',
      description:
        'Injectez des documents texte (.txt) pour réduire fortement les hallucinations en fournissant les extraits dans le prompt. Concluez par un dialogue libre avec les 4 moteurs dans le Chatbot.',
      actions: [
        'Importez une notice ou fiche produit et inspectez les scores de chunks.',
        'Comparez la réponse sans document avec la réponse ancrée par le RAG.',
        'Discutez dans le Chatbot en basculant en 1 clic entre Modèle Base, SFT, RLHF et RAG.',
      ],
      buttonLabel: 'Explorer le RAG & le Chatbot',
    },
  ];

  const faqs = [
    {
      q: 'Mon modèle génère parfois des phrases étranges ou incomplètes, pourquoi ?',
      a: 'C\'est tout à fait normal ! Un LLM statistique génère chaque mot selon la distribution de probabilité apprise sur le corpus. Si le corpus est court ou si la température est élevée (> 1.2), le modèle explore des chemins statistiques moins probables. En diminuant la température (ex: 0.2) ou en enrichissant le texte d\'entraînement, la cohérence augmente fortement.',
    },
    {
      q: 'Quelle est la vraie différence entre le Fine-Tuning (SFT) et le Renforcement (RLHF) ?',
      a: 'Le Fine-Tuning (SFT) enseigne au modèle la forme d\'une réponse en lui montrant des paires idéales (Question -> Réponse). Le Renforcement (RLHF), quant à lui, intervient après : il lui présente deux réponses possibles et utilise les préférences humaines (👍 / 👎) pour pénaliser les comportements dangereux et encourager les réponses polies et sûres, tout en utilisant la divergence KL pour éviter qu\'il n\'oublie ses bases.',
    },
    {
      q: 'Pourquoi utiliser le RAG au lieu de fine-tuner le modèle ?',
      a: 'Le fine-tuning modifie les poids internes du modèle, ce qui demande du calcul et risque d\'introduire des oublis ou des inexactitudes sur les faits précis. Le RAG ne touche pas aux poids : il va chercher le paragraphe exact dans votre fichier texte et l\'injecte directement dans le prompt. C\'est immédiat, direct et réduit drastiquement les hallucinations en s\'appuyant sur vos textes de référence.',
    },
    {
      q: 'À quoi sert la pénalité de divergence KL (Beta) dans l\'onglet RLHF ?',
      a: 'La divergence de Kullback-Leibler (KL) mesure la distance entre la nouvelle distribution de probabilités et celle du modèle de base. Sans pénalité KL (Beta = 0), le modèle maximise aveuglément les récompenses et risque un "mode collapse" (répéter en boucle la même phrase récompensée). La pénalité KL le force à rester ancré dans sa langue d\'origine.',
    },
    {
      q: 'Où sont stockées mes données et mes modèles ?',
      a: 'Tout fonctionne à 100% dans la mémoire vive de votre navigateur. Aucune donnée saisie, aucun document et aucun poids de modèle ne sont envoyés vers un serveur externe. Vous pouvez également exporter la configuration complète sous forme de fichier JSON via l\'onglet "Mon Modèle".',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-xs transition-colors duration-200">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>Guide d'Utilisation Officiel · MiniLLM Studio</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Comprendre et Piloter chaque Étape d'un LLM
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            MiniLLM Studio est un laboratoire pédagogique didactique interactif. De la donnée brute non structurée jusqu'au chatbot de production aligné par renforcement, vous manipulez chaque concept sans boîte noire : <strong>tokens discrets, matrices de probabilités conditionnelles, divergence KL, embeddings 2D et indexation documentaire RAG</strong>.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Menu latéral rétractable d'un clic (espace de travail optimisé)
            </span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              100% local dans votre navigateur (zéro API opaque)
            </span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Export de votre modèle en JSON et Python pur
            </span>
          </div>

          {/* Primary Quick Start CTAs */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            {/* Primary 'Commencer ici' button */}
            <button
              onClick={() => onNavigate(completedStepNumbers.length === 0 ? 'prerequisites' : 'donnees')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow transition-all cursor-pointer ring-2 ring-indigo-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Commencer ici : Parcours Conseillé ➔</span>
            </button>

            <button
              onClick={() => onNavigate('prerequisites')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-indigo-500" />
              <span>0. Les 3 Prérequis</span>
            </button>

            <button
              onClick={() => onNavigate('glossary')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
              <span>Glossaire & Lexique</span>
            </button>

            <button
              onClick={() => onNavigate('quiz')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-200 font-semibold text-xs border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Grand Quiz (8 Q.)</span>
            </button>
          </div>
        </div>

        {/* Global LLM Pipeline Blueprint - 5 Canonical Harmonized Steps */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Le Cycle de Vie Complet d'un Grand Modèle de Langage (LLM) en 5 Étapes :
            </span>
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium hidden sm:inline">
              Cliquez sur une étape pour y accéder
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs font-mono">
            <button
              onClick={() => onNavigate('donnees')}
              className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold block">Étape 1</span>
                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 group-hover:translate-x-0.5 transition-all" />
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block mt-1">Données & Tokens</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5 font-sans">Corpus & Token IDs</span>
            </button>

            <button
              onClick={() => onNavigate('matrice')}
              className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100/80 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold block">Étape 2</span>
                <ArrowRight className="w-3 h-3 text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-200 group-hover:translate-x-0.5 transition-all" />
              </div>
              <span className="font-bold text-blue-900 dark:text-blue-200 block mt-1">Poids & Matrice</span>
              <span className="text-[10px] text-blue-700 dark:text-blue-400 block mt-0.5 font-sans">Probabilités apprises</span>
            </button>

            <button
              onClick={() => onNavigate('generation')}
              className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100/80 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold block">Étape 3</span>
                <ArrowRight className="w-3 h-3 text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-200 group-hover:translate-x-0.5 transition-all" />
              </div>
              <span className="font-bold text-amber-900 dark:text-amber-200 block mt-1">Inférence & Softmax</span>
              <span className="text-[10px] text-amber-700 dark:text-amber-400 block mt-0.5 font-sans">Température & Hasard</span>
            </button>

            <button
              onClick={() => onNavigate('finetune')}
              className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100/80 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold block">Étape 4</span>
                <ArrowRight className="w-3 h-3 text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-200 group-hover:translate-x-0.5 transition-all" />
              </div>
              <span className="font-bold text-purple-900 dark:text-purple-200 block mt-1">Alignement</span>
              <span className="text-[10px] text-purple-700 dark:text-purple-400 block mt-0.5 font-sans">SFT, RLHF & Sécurité</span>
            </button>

            <button
              onClick={() => onNavigate('rag')}
              className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">Étape 5</span>
                <ArrowRight className="w-3 h-3 text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-200 group-hover:translate-x-0.5 transition-all" />
              </div>
              <span className="font-bold text-emerald-900 dark:text-emerald-200 block mt-1">RAG & Chatbot</span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block mt-0.5 font-sans">Documents & Dialogue</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1) Encadré bien visible sur la nature du modèle */}
      <ModelNatureDisclaimer defaultExpanded={true} />

      {/* 5) Indicateur de progression des 5 étapes (cases cochées) */}
      <ProgressTrackerCard
        completedStepNumbers={completedStepNumbers}
        onNavigate={onNavigate}
        onResetProgress={onResetProgress}
      />

      {/* Navigation Map Guide - 4 Menu Sections */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 transition-colors duration-200">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Organisation du Menu en 4 Sections & Liens avec les 5 Étapes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-slate-100">1. Modèle de Base</span>
              <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded font-mono">Étapes 1, 2, 3</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              Comprend : <strong>1. Données & Tokens</strong> (corpus et vocabulaire), <strong>Mon Modèle</strong> (projection 2D), <strong>2. Poids & Matrice</strong> (probabilités) et <strong>3. Inférence & Softmax</strong> (génération mot à mot).
            </p>
            <button
              onClick={() => onNavigate('donnees')}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold inline-flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>Accéder au Modèle de Base</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-3.5 rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50/30 dark:bg-purple-950/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-900 dark:text-purple-200">2. Alignement & RL</span>
              <span className="text-[10px] bg-purple-200 dark:bg-purple-900/80 text-purple-800 dark:text-purple-200 px-1.5 py-0.5 rounded font-mono">Étape 4</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              Comprend 2 phases complémentaires : <strong>4. Fine-Tuning (SFT)</strong> pour spécialiser le modèle sur des Q/R, et <strong>4. Renforcement (RLHF/DPO)</strong> pour injecter des valeurs de sécurité et atténuer fortement les dérives sous contrainte KL.
            </p>
            <button
              onClick={() => onNavigate('finetune')}
              className="text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100 font-semibold inline-flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>Accéder à l'Alignement</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-3.5 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-900 dark:text-emerald-200">3. Applications & RAG</span>
              <span className="text-[10px] bg-emerald-200 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 px-1.5 py-0.5 rounded font-mono">Étape 5</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              Chargez un document texte pur (.txt). Le modèle recherche l'extrait le plus pertinent et répond en réduisant fortement les hallucinations. Testez ensuite le dialogue dans le <strong>Chatbot Multi-Moteurs</strong>.
            </p>
            <button
              onClick={() => onNavigate('rag')}
              className="text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-100 font-semibold inline-flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>Accéder au RAG & Chatbot</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-3.5 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-950/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-900 dark:text-amber-200">4. Ressources & Guides</span>
              <span className="text-[10px] bg-amber-200 dark:bg-amber-900/80 text-amber-800 dark:text-amber-200 px-1.5 py-0.5 rounded font-mono">Documentation</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              Consultez les <strong>0. Prérequis</strong> pour réviser les notions clés, explorez le <strong>Glossaire Technique</strong> avec recherche instantanée, ou inspectez le <strong>Code & Fonctions</strong> TypeScript.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => onNavigate('prerequisites')}
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold text-[11px] cursor-pointer"
              >
                Prérequis
              </button>
              <span className="text-slate-300">·</span>
              <button
                onClick={() => onNavigate('glossary')}
                className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold text-[11px] cursor-pointer"
              >
                Glossaire
              </button>
              <span className="text-slate-300">·</span>
              <button
                onClick={() => onNavigate('guide')}
                className="text-amber-600 dark:text-amber-400 hover:underline font-semibold text-[11px] cursor-pointer"
              >
                Code
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Guided Walkthrough Steps */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Le Parcours d'Apprentissage Conseillé en 5 Étapes
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Suivez cette progression logique pour appréhender concrètement la mécanique des modèles d'IA générative.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map(step => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4 hover:shadow-xs transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${step.color}`}>
                      {step.badge}
                    </span>

                    <Icon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 block">
                      Ce que vous pouvez manipuler :
                    </span>
                    <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                      {step.actions.map((act, i) => (
                        <li key={i}>{act}</li>
                      ))}
                    </ul>
                  </div>

                  {step.subTabs && step.subTabs.length > 1 && (
                    <div className="pt-1">
                      <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 block mb-1">
                        Sous-pages associées :
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {step.subTabs.map(sub => (
                          <button
                            key={`${step.number}-${sub.label}`}
                            onClick={() => onNavigate(sub.key)}
                            className="text-[10px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded transition-colors cursor-pointer"
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => onNavigate(step.tabKey)}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    <span>{step.buttonLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Focus Explanatory Section on Reinforcement (RLHF) */}
      <div className="bg-gradient-to-br from-rose-50 via-white to-purple-50 dark:from-slate-900 dark:via-purple-950/20 dark:to-slate-900 border border-rose-200 dark:border-rose-900/60 rounded-xl p-6 sm:p-7 space-y-5 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Focus : Comment fonctionne la simulation du Renforcement (RLHF) ?
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Comprendre le rôle des votes humains, du Reward et de la pénalité de divergence KL.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('rlhf')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/70 hover:bg-rose-200 dark:hover:bg-rose-900/70 rounded-lg transition-colors cursor-pointer self-start sm:self-center border border-rose-200 dark:border-rose-800"
          >
            <span>Ouvrir l'Atelier RLHF</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-white dark:bg-slate-900/90 p-4 rounded-lg border border-rose-100 dark:border-slate-800 shadow-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-bold">
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>1. Feedback Humain (👍 / 👎)</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
              On présente au modèle des questions sensibles (nourriture, sécurité, politesse). Vous votez pour désigner la réponse saine (<code className="text-emerald-700 dark:text-emerald-400 font-mono font-semibold">chosen</code>) et la réponse toxique (<code className="text-rose-700 dark:text-rose-400 font-mono font-semibold">rejected</code>).
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900/90 p-4 rounded-lg border border-rose-100 dark:border-slate-800 shadow-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-purple-700 dark:text-purple-400 font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>2. Modèle de Récompense</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
              Chaque token de la trajectoire approuvée reçoit un bonus positif (<code className="text-emerald-700 dark:text-emerald-400 font-mono">+Reward</code>), tandis que les mots dangereux de la mauvaise trajectoire subissent une pénalité négative (<code className="text-rose-700 dark:text-rose-400 font-mono">-Reward</code>).
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900/90 p-4 rounded-lg border border-rose-100 dark:border-slate-800 shadow-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-400 font-bold">
              <Activity className="w-3.5 h-3.5" />
              <span>3. Pénalité de Divergence KL</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
              La divergence <code className="font-mono text-indigo-700 dark:text-indigo-300">D_KL(π_RL || π_base)</code> empêche le modèle de détruire sa grammaire de base. Le coefficient <strong>Beta</strong> agit comme un élastique de rappel pour éviter le "mode collapse".
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900/90 p-4 rounded-lg border border-rose-100 dark:border-slate-800 shadow-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>4. Résultat Concret</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
              À la génération, cette simulation pédagogique montre comment les probabilités des mots toxiques (ex: <em>empoisonnee</em>) sont fortement réduites par le gradient, favorisant les réponses bienveillantes.
            </p>
          </div>
        </div>
      </div>

      {/* 5 Practical Instant Experiments */}
      <div className="bg-slate-900 text-white rounded-xl p-6 sm:p-7 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-400">
            <Zap className="w-5 h-5" />
            <h2 className="text-sm font-semibold uppercase tracking-wider">
              5 Expériences Pratiques à Réaliser en 3 Minutes
            </h2>
          </div>
          <span className="text-xs text-slate-400">Interactif & Reproductible</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          <div className="p-3.5 bg-slate-800/90 rounded-lg border border-slate-700 space-y-2 flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-indigo-300 block">
                A. L'effet Température
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Dans <strong>Inférence & Softmax</strong>, testez Température = 0.1 (strict, répétitif) puis = 1.8 (aléatoire, créatif).
              </p>
            </div>
            <button
              onClick={() => onNavigate('generation')}
              className="text-[10px] text-indigo-300 hover:text-white font-medium inline-flex items-center gap-1 cursor-pointer mt-2"
            >
              <span>Tester la température</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-3.5 bg-slate-800/90 rounded-lg border border-slate-700 space-y-2 flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-blue-300 block">
                B. Injecter un Fait
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Dans <strong>Données & Tokens</strong>, ajoutez <code>"le chat conduit un avion"</code>. Tapez <code>"le chat"</code> en inférence : le fait apparaît immédiatement !
              </p>
            </div>
            <button
              onClick={() => onNavigate('donnees')}
              className="text-[10px] text-blue-300 hover:text-white font-medium inline-flex items-center gap-1 cursor-pointer mt-2"
            >
              <span>Ajouter un fait</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-3.5 bg-slate-800/90 rounded-lg border border-slate-700 space-y-2 flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-purple-300 block">
                C. Aligner en SFT
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Dans <strong>Alignement (Phase 1)</strong>, lancez le Fine-Tuning. Comparez la complétion brute avec la réponse formulée en assistant.
              </p>
            </div>
            <button
              onClick={() => onNavigate('finetune')}
              className="text-[10px] text-purple-300 hover:text-white font-medium inline-flex items-center gap-1 cursor-pointer mt-2"
            >
              <span>Lancer le SFT</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-3.5 bg-slate-800/90 rounded-lg border border-slate-700 space-y-2 flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-rose-300 block">
                D. Atténuer le Poison (RLHF)
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Dans <strong>Alignement (Phase 2)</strong>, votez 👍 sur la nourriture saine et 👎 sur le poison. Appliquez le RLHF : la simulation montre comment la probabilité du mot toxique est drastiquement atténuée.
              </p>
            </div>
            <button
              onClick={() => onNavigate('rlhf')}
              className="text-[10px] text-rose-300 hover:text-white font-medium inline-flex items-center gap-1 cursor-pointer mt-2"
            >
              <span>Tester le RLHF</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-3.5 bg-slate-800/90 rounded-lg border border-slate-700 space-y-2 flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-emerald-300 block">
                E. RAG vs Hallucination
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Dans <strong>RAG Simple</strong>, demandez <code>"quelle est la garantie"</code>. Sans RAG, le modèle invente. Avec RAG, il cite la phrase exacte du document.
              </p>
            </div>
            <button
              onClick={() => onNavigate('rag')}
              className="text-[10px] text-emerald-300 hover:text-white font-medium inline-flex items-center gap-1 cursor-pointer mt-2"
            >
              <span>Tester le RAG</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Invitation vers la Page Dédiée du Grand Quiz */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-purple-500/10 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-6 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                <Award className="w-5 h-5" />
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Page Dédiée : Grand Quiz des Connaissances LLM
              </h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800">
                8 Questions Clés
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Testez et consolidez votre maîtrise de chaque étape (Tokenisation, Poids & Matrices, Attention Maps, Perplexité, Rétropropagation, SFT, RLHF et RAG) avec feedback interactif immédiat et calcul de votre rang de maîtrise technique sur sa page dédiée.
            </p>
          </div>
          <button
            onClick={() => onNavigate('quiz')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors shrink-0 cursor-pointer group"
          >
            <span>Ouvrir la page du Quiz</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Interactive FAQ Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4 transition-colors duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-semibold">
              Foire Aux Questions (FAQ) & Clés de Compréhension
            </h3>
          </div>
          <button
            onClick={() => onNavigate('guide')}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium cursor-pointer inline-flex items-center gap-1"
          >
            <span>Consulter les fonctions du code (&lt;/&gt;)</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2.5">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-3.5 text-left bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between gap-4 cursor-pointer transition-colors"
              >
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {faq.q}
                </span>
                {openFaqIndex === idx ? (
                  <ChevronUp className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                )}
              </button>

              {openFaqIndex === idx && (
                <div className="p-3.5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Glossary Express */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4 transition-colors duration-200">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm font-semibold">
            Lexique Express des Termes Clés
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">Token & Token ID</span>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              Morceau de texte atomique (mot ou ponctuation) auquel l'ordinateur associe un identifiant numérique entier.
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">Poids & Transitions</span>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              Matrices numériques stockées mesurant la probabilité conditionnelle qu'un mot succède à un contexte donné.
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">Fine-Tuning (SFT)</span>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              Ajustement supervisé des poids sur des exemples précis (Question ➔ Réponse) pour enseigner le comportement d'assistant.
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">RLHF & Pénalité KL</span>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              Alignement par renforcement selon les préférences humaines (+/-). La pénalité KL empêche le modèle de détruire son langage d'origine.
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">RAG (Retrieval-Augmented)</span>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              Extraction du passage pertinent d'un document brut directement injecté dans le prompt pour sourcer les réponses et réduire fortement les hallucinations.
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">Température (Softmax)</span>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              Facteur diviseur des logits : proche de 0 = strict et déterministe (Greedy) ; supérieur à 1 = créatif et stochastique.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
