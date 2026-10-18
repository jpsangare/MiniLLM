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
} from 'lucide-react';
import { ActiveTab } from './Header';

interface UserGuideSectionProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const UserGuideSection: React.FC<UserGuideSectionProps> = ({ onNavigate }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const steps = [
    {
      number: '1',
      title: 'Le Modèle de Base : Données, Poids & Inférence',
      tabKey: 'donnees' as ActiveTab,
      subTabs: [
        { label: 'Données & Tokens', key: 'donnees' as ActiveTab },
        { label: 'Mon Modèle', key: 'modele' as ActiveTab },
        { label: 'Poids & Matrice', key: 'matrice' as ActiveTab },
        { label: 'Inférence & Softmax', key: 'generation' as ActiveTab },
      ],
      icon: Database,
      badge: 'Étape 1 · Pré-entraînement Fondamental',
      color: 'border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300',
      description:
        'Comprenez comment la machine découpe le texte brut en tokens numériques (Token IDs), calcule les statistiques de co-occurrence P(mot suivant | contexte), et génère du texte mot à mot avec la formule Softmax et le curseur de température.',
      actions: [
        'Éditez le corpus textuel libre pour injecter de nouvelles connaissances.',
        'Consultez la matrice complète des probabilités et téléchargez les poids du modèle en format JSON (checkpoint standard).',
        'Générez du texte avec le bouton Auto-play (progression en direct dans l\'invite de commande), observez l\'indicateur de Perplexité en temps réel et visualisez les Attention Maps (faisceaux et matrice causale).',
        'Simulez la rétropropagation (Backpropagation) : visualisez le calcul des gradients ∂Loss/∂z = p - y et la mise à jour des poids par descente de gradient.',
      ],
      buttonLabel: 'Explorer les Données & Tokens',
    },
    {
      number: '2',
      title: 'Fine-Tuning Supervisé (SFT) : Spécialisation en Q/R',
      tabKey: 'finetune' as ActiveTab,
      subTabs: [
        { label: 'Phase 1 : Fine-Tuning (SFT)', key: 'finetune' as ActiveTab },
        { label: 'Phase 2 : Renforcement (RLHF)', key: 'rlhf' as ActiveTab },
      ],
      icon: Sliders,
      badge: 'Étape 2 · Alignement Supervisé',
      color: 'border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300',
      description:
        'Un modèle brut ne sait que compléter des phrases. Le Fine-Tuning (SFT) ajuste ses poids sur des paires « Question ➔ Réponse » pour lui apprendre à adopter le rôle d\'un assistant structuré sans ré-entraîner toute la langue.',
      actions: [
        'Configurez le taux d\'apprentissage (Learning Rate) et le nombre d\'époques.',
        'Ajoutez vos propres paires d\'instructions personnalisées.',
        'Comparez côte à côte : complétion brute (Base) vs réponse ciblée (SFT).',
      ],
      buttonLabel: 'Pratiquer le Fine-Tuning SFT',
    },
    {
      number: '3',
      title: 'Renforcement (RLHF / DPO) : Sécurité & Bienveillance',
      tabKey: 'rlhf' as ActiveTab,
      subTabs: [
        { label: 'Phase 2 : Renforcement (RLHF)', key: 'rlhf' as ActiveTab },
        { label: 'Phase 1 : Fine-Tuning (SFT)', key: 'finetune' as ActiveTab },
      ],
      icon: ThumbsUp,
      badge: 'Étape 3 · Alignement par Préférences',
      color: 'border-rose-200 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300',
      description:
        'Le RLHF (Reinforcement Learning from Human Feedback) enseigne la sécurité et la nuance : votez 👍 / 👎 sur des paires de réponses, appliquez une récompense (Reward) et régulez la dérive avec la pénalité de divergence KL.',
      actions: [
        'Votez sur des paires sensibles (sécurité alimentaire, politesse, exactitude).',
        'Ajustez l\'échelle de récompense et le coefficient de divergence KL (Beta).',
        'Visualisez en direct l\'effondrement des probabilités des mots toxiques.',
      ],
      buttonLabel: 'Simuler le Renforcement RLHF',
    },
    {
      number: '4',
      title: 'Le RAG Simple : Zéro Hallucination avec un Document',
      tabKey: 'rag' as ActiveTab,
      subTabs: [
        { label: 'RAG Simple (Documents)', key: 'rag' as ActiveTab },
      ],
      icon: FileText,
      badge: 'Étape 4 · Connaissance Externe Dynamique',
      color: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300',
      description:
        'Comment donner des connaissances fraîches ou privées à un LLM sans modifier ses poids ? Le RAG découpe votre document (.txt) en passages (chunks) et injecte l\'extrait pertinent dans le prompt pour garantir une réponse 100% vérifiable.',
      actions: [
        'Importez un fichier .txt ou collez une notice / règlement d\'entreprise.',
        'Posez une question et inspectez le score de similarité de chaque chunk.',
        'Comparez en direct : hallucination sans RAG vs certitude absolue avec RAG.',
      ],
      buttonLabel: 'Tester le RAG Documentaire',
    },
    {
      number: '5',
      title: 'Le Chatbot : Dialogue avec vos 4 Moteurs',
      tabKey: 'chat' as ActiveTab,
      subTabs: [
        { label: 'Chatbot Multi-Moteurs', key: 'chat' as ActiveTab },
      ],
      icon: Bot,
      badge: 'Étape 5 · Déploiement & Comparaison',
      color: 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300',
      description:
        'L\'aboutissement concret : une interface de messagerie où vous dialoguez librement avec le modèle en basculant en 1 clic entre le Modèle de Base, la version Fine-tunée, la version alignée par RLHF et le mode RAG.',
      actions: [
        'Basculez d\'un moteur à l\'autre à tout moment de la conversation.',
        'Activez « Inspecter les Token IDs » pour voir la représentation interne sous chaque bulle.',
        'Testez comment chaque moteur réagit à la même question.',
      ],
      buttonLabel: 'Ouvrir le Chatbot',
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
      a: 'Le fine-tuning modifie les poids internes du modèle, ce qui demande du calcul et risque d\'introduire des oublis ou des inexactitudes sur les faits précis. Le RAG ne touche pas aux poids : il va chercher le paragraphe exact dans votre fichier texte et l\'injecte directement dans le prompt. C\'est immédiat, gratuit, et garanti sans hallucination.',
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
            MiniLLM Studio est un laboratoire pédagogique interactif complet. De la donnée brute non structurée jusqu'au chatbot de production aligné par renforcement, vous manipulez chaque concept sans boîte noire : <strong>tokens réels, matrices de probabilités, divergence KL, embeddings 2D et indexation documentaire RAG</strong>.
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

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('quiz')}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Tester mes connaissances (Grand Quiz LLM · Page Dédiée) ➔</span>
            </button>
          </div>
        </div>

        {/* Global LLM Pipeline Blueprint */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Le Cycle de Vie Complet d'un Grand Modèle de Langage (LLM) :
            </span>
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium hidden sm:inline">
              Cliquez sur un bloc pour y accéder
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs font-mono">
            <button
              onClick={() => onNavigate('donnees')}
              className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Étape 1</span>
                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 group-hover:translate-x-0.5 transition-all" />
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block mt-1">Pré-entraînement</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5 font-sans">Corpus & Poids de base</span>
            </button>

            <button
              onClick={() => onNavigate('finetune')}
              className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100/80 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-purple-500 dark:text-purple-400 block">Étape 2</span>
                <ArrowRight className="w-3 h-3 text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-200 group-hover:translate-x-0.5 transition-all" />
              </div>
              <span className="font-bold text-purple-900 dark:text-purple-200 block mt-1">Fine-Tuning SFT</span>
              <span className="text-[10px] text-purple-700 dark:text-purple-400 block mt-0.5 font-sans">Apprend à répondre (Q/R)</span>
            </button>

            <button
              onClick={() => onNavigate('rlhf')}
              className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100/80 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-rose-500 dark:text-rose-400 block">Étape 3</span>
                <ArrowRight className="w-3 h-3 text-rose-400 group-hover:text-rose-700 dark:group-hover:text-rose-200 group-hover:translate-x-0.5 transition-all" />
              </div>
              <span className="font-bold text-rose-900 dark:text-rose-200 block mt-1">Renforcement RLHF</span>
              <span className="text-[10px] text-rose-700 dark:text-rose-400 block mt-0.5 font-sans">Préférences, Reward & KL</span>
            </button>

            <button
              onClick={() => onNavigate('rag')}
              className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-emerald-500 block">Étape 4</span>
                <ArrowRight className="w-3 h-3 text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-200 group-hover:translate-x-0.5 transition-all" />
              </div>
              <span className="font-bold text-emerald-900 dark:text-emerald-200 block mt-1">RAG Document</span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block mt-0.5 font-sans">Chunks & Anti-hallucination</span>
            </button>

            <button
              onClick={() => onNavigate('chat')}
              className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100/80 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-indigo-500 block">Étape 5</span>
                <ArrowRight className="w-3 h-3 text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-200 group-hover:translate-x-0.5 transition-all" />
              </div>
              <span className="font-bold text-indigo-900 dark:text-indigo-200 block mt-1">Chatbot Final</span>
              <span className="text-[10px] text-indigo-700 dark:text-indigo-400 block mt-0.5 font-sans">Dialogue avec les 4 moteurs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Map Guide */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 transition-colors duration-200">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Organisation du Site & Barre de Navigation
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-slate-100">1. Modèle Base</span>
              <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded font-mono">4 vues</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              Comprend 4 sous-onglets : <strong>Données & Tokens</strong> (corpus et vocabulaire), <strong>Mon Modèle</strong> (architecture & projection 2D), <strong>Poids & Matrice</strong> (probabilités) et <strong>Inférence & Softmax</strong> (génération).
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
              <span className="text-[10px] bg-purple-200 dark:bg-purple-900/80 text-purple-800 dark:text-purple-200 px-1.5 py-0.5 rounded font-mono">2 phases</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              Comprend 2 phases complémentaires : <strong>Phase 1 : Fine-Tuning (SFT)</strong> pour spécialiser le modèle sur des Q/R, et <strong>Phase 2 : Renforcement (RLHF)</strong> pour injecter des valeurs de sécurité et éliminer les dérives.
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
              <span className="font-bold text-emerald-900 dark:text-emerald-200">3. RAG Simple</span>
              <span className="text-[10px] bg-emerald-200 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 px-1.5 py-0.5 rounded font-mono">Sans ré-entraînement</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              Chargez un document texte pur (.txt) ou saisissez des informations privées. Le modèle recherche l'extrait le plus pertinent et répond avec une certitude absolue sans toucher à ses poids.
            </p>
            <button
              onClick={() => onNavigate('rag')}
              className="text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-100 font-semibold inline-flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>Accéder au RAG Simple</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-3.5 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50/30 dark:bg-indigo-950/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-900 dark:text-indigo-200">4. Chatbot & Code</span>
              <span className="text-[10px] bg-indigo-200 dark:bg-indigo-900/80 text-indigo-800 dark:text-indigo-200 px-1.5 py-0.5 rounded font-mono">Dialogue & Carto</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              Le <strong>Chatbot</strong> permet de discuter en basculant en 1 clic entre les 4 moteurs. Le bouton <strong>Code & Fonctions (&lt;/&gt;)</strong> détaille les fonctions TypeScript utilisées à chaque niveau.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => onNavigate('chat')}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Chatbot</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => onNavigate('guide')}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Code & Fonctions</span>
                <ArrowRight className="w-3 h-3" />
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
                            key={sub.key}
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
              À la génération, les probabilités des mots toxiques (ex: <em>empoisonnee</em>) tombent vers 0%, tandis que les recommandations saines prennent 100% de la distribution sans perdre la fluidité du français.
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
                D. Éliminer le Poison (RLHF)
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Dans <strong>Alignement (Phase 2)</strong>, votez 👍 sur la nourriture saine et 👎 sur le poison. Appliquez le RLHF : le poison disparaît totalement !
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
              Extraction du passage pertinent d'un document brut directement injecté dans le prompt pour sourcer les réponses sans hallucination.
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
