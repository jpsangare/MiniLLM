import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  ArrowRight,
  Sparkles,
  Zap,
  BookOpen,
  Filter,
  Lightbulb,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { ActiveTab } from './Header';

export interface QuizQuestion {
  id: number;
  stage: 'Base & Données' | 'Inférence & Softmax' | 'Fine-Tuning SFT' | 'RLHF & Alignement' | 'RAG & Architecture';
  targetTab: ActiveTab;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  conceptKey: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    stage: 'Base & Données',
    targetTab: 'donnees',
    question: 'Que fait précisément l\'étape de "Tokenisation" dans un modèle de langage (LLM) ?',
    options: [
      'Elle traduit instantanément le texte dans une autre langue humaine.',
      'Elle segmente le flux textuel brut en unités atomiques (tokens) et leur attribue un identifiant numérique entier unique (Token ID).',
      'Elle exécute un correcteur orthographique automatique avant l\'entraînement.',
      'Elle compresse le texte en format binaire MP3 pour la synthèse vocale.',
    ],
    correctIndex: 1,
    explanation:
      'Les réseaux neuronaux ne manipulent que des tenseurs numériques. La tokenisation transforme chaque mot ou sous-mot en un entier unique (Token ID) mappé dans un dictionnaire de vocabulaire (V).',
    conceptKey: 'Tokenisation & Vocabulaire',
  },
  {
    id: 2,
    stage: 'Inférence & Softmax',
    targetTab: 'generation',
    question: 'Quel est l\'effet d\'une température très basse (ex: T = 0.1 ou Greedy) lors du calcul Softmax ?',
    options: [
      'Le modèle génère des mots totalement aléatoires et incohérents.',
      'Les probabilités sont fortement amplifiées sur le token le plus probable, rendant la génération quasi-déterministe et répétable.',
      'Le modèle divise par 10 sa consommation de mémoire RAM.',
      'Le modèle inverse l\'ordre des mots de la phrase.',
    ],
    correctIndex: 1,
    explanation:
      'Dans la formule Softmax(z_i / T), diviser les logits par un petit nombre T accentue l\'écart entre le maximum et les autres valeurs, concentrant toute la probabilité sur le mot de tête.',
    conceptKey: 'Température Softmax & Déterminisme',
  },
  {
    id: 3,
    stage: 'Inférence & Softmax',
    targetTab: 'generation',
    question: 'Que mesure l\'indicateur de "Perplexité" (PPL) calculé lors de la prédiction du prochain token ?',
    options: [
      'La vitesse en millisecondes d\'exécution du processeur.',
      'Le nombre de fautes de grammaire contenues dans le texte saisi.',
      'L\'incertitude ou l\'hésitation du modèle (exponentielle de l\'entropie) : plus la perplexité est basse, plus le modèle est confiant.',
      'Le taux de compression JPEG de l\'interface visuelle.',
    ],
    correctIndex: 2,
    explanation:
      'La perplexité PPL = exp(Cross-Entropy). Une perplexité de 1.0 indique une confiance maximale (100% sur un seul token), tandis qu\'une perplexité élevée signale une incertitude dispersée entre de nombreuses options.',
    conceptKey: 'Perplexité & Certitude du Modèle',
  },
  {
    id: 4,
    stage: 'Inférence & Softmax',
    targetTab: 'generation',
    question: 'À quoi sert le mécanisme d\'Attention (Attention Maps) dans un modèle Transformer ?',
    options: [
      'À mesurer le temps de réponse de la connexion internet.',
      'À attribuer dynamiquement des poids d\'importance aux mots précédents dans le contexte pour influencer la prédiction du prochain mot.',
      'À effacer automatiquement les tokens les plus anciens du disque dur.',
      'À bloquer les requêtes malveillantes de l\'utilisateur.',
    ],
    correctIndex: 1,
    explanation:
      'L\'attention causale permet au modèle de pondérer l\'importance des mots du contexte passé. Un mot clé comme « chat » captera une forte attention lors de la prédiction du verbe « miaule » ou de l\'adjectif.',
    conceptKey: 'Mécanisme d\'Attention & Poids Causaux',
  },
  {
    id: 5,
    stage: 'Base & Données',
    targetTab: 'matrice',
    question: 'Lors de la rétropropagation (Backpropagation), que représente le gradient ∂Loss / ∂z ?',
    options: [
      'La température de chauffe de la puce GPU pendant le calcul.',
      'L\'écart direct (p - y) entre la distribution prédite par le modèle (p) et la cible réelle observée (y, one-hot).',
      'Le volume total de données stockées dans le fichier README.md.',
      'Le pourcentage de tokens inconnus (<UNK>) dans le corpus.',
    ],
    correctIndex: 1,
    explanation:
      'Avec la fonction de coût Cross-Entropy et l\'activation Softmax, la dérivée se simplifie remarquablement en ∂Loss/∂z_i = p_i - y_i. Le gradient indique directement la direction et l\'intensité de la correction à apporter aux poids.',
    conceptKey: 'Backpropagation & Gradients',
  },
  {
    id: 6,
    stage: 'Fine-Tuning SFT',
    targetTab: 'finetune',
    question: 'Pourquoi un modèle de base (pré-entraîné) a-t-il besoin de Fine-Tuning Supervisé (SFT) ?',
    options: [
      'Parce qu\'un modèle de base ne sait que continuer statistiquement du texte brut, alors que le SFT lui apprend la structure d\'échange « Question ➔ Réponse » propre à un assistant.',
      'Parce que le modèle de base perd la mémoire après 24 heures sans redémarrage.',
      'Parce que le Fine-Tuning réduit la taille des fichiers sur le disque dur.',
      'Parce que sans SFT, le modèle refuse d\'afficher du français.',
    ],
    correctIndex: 0,
    explanation:
      'Le pré-entraînement apprend la grammaire et les statistiques du monde, mais le modèle continue tout sans filtre (ex: à « Quelle heure est-il ? », il pourrait répondre « demande Pierre à Marie »). Le SFT lui apprend le comportement d\'un assistant utile qui répond directement.',
    conceptKey: 'Supervised Fine-Tuning (SFT)',
  },
  {
    id: 7,
    stage: 'RLHF & Alignement',
    targetTab: 'rlhf',
    question: 'Quel est le rôle crucial de la pénalité de divergence KL (Kullback-Leibler) en RLHF ?',
    options: [
      'Elle force le modèle à parler uniquement en rimes poétiques.',
      'Elle empêche le modèle optimisé de s\'éloigner de façon destructive de son modèle de référence initial (évitant le mode collapse et le piratage de la récompense).',
      'Elle accélère la vitesse de frappe dans l\'invite de commande.',
      'Elle supprime automatiquement les balises HTML indésirables.',
    ],
    correctIndex: 1,
    explanation:
      'Sans pénalité KL, l\'optimisation par renforcement (Reward Hacking) pourrait pousser le modèle à répéter en boucle des formules obséquieuses ou absurdes pour maximiser la récompense, détruisant ses capacités linguistiques de base.',
    conceptKey: 'Pénalité KL & Stabilité RLHF',
  },
  {
    id: 8,
    stage: 'RAG & Architecture',
    targetTab: 'rag',
    question: 'Quelle est la différence fondamentale entre le RAG (Retrieval-Augmented Generation) et le ré-entraînement des poids ?',
    options: [
      'Le RAG modifie tous les poids du réseau de neurones en temps réel.',
      'Le RAG injecte les passages factuels pertinents d\'une base documentaire directement dans le contexte du prompt sans altérer les poids du modèle.',
      'Le RAG remplace complètement la tokenisation par des requêtes SQL.',
      'Le RAG ne fonctionne qu\'avec des images et non du texte.',
    ],
    correctIndex: 1,
    explanation:
      'Le RAG ne modifie aucun paramètre interne du LLM : il effectue une recherche sémantique dans des documents externes et colle les extraits pertinents dans le prompt, réduisant fortement les hallucinations sur des données privées ou récentes.',
    conceptKey: 'RAG vs Ré-entraînement',
  },
];

interface QuizSectionProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({ onNavigate }) => {
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [selectedFilter, setSelectedFilter] = useState<string>('Tous');

  const stages = useMemo(() => {
    return ['Tous', 'Base & Données', 'Inférence & Softmax', 'Fine-Tuning SFT', 'RLHF & Alignement', 'RAG & Architecture'];
  }, []);

  const filteredQuestions = useMemo(() => {
    if (selectedFilter === 'Tous') return QUIZ_QUESTIONS;
    return QUIZ_QUESTIONS.filter(q => q.stage === selectedFilter);
  }, [selectedFilter]);

  const totalAnswered = useMemo(() => {
    return Object.keys(userAnswers).length;
  }, [userAnswers]);

  const correctCount = useMemo(() => {
    return QUIZ_QUESTIONS.reduce((acc, q) => {
      return userAnswers[q.id] === q.correctIndex ? acc + 1 : acc;
    }, 0);
  }, [userAnswers]);

  const progressPercentage = Math.round((totalAnswered / QUIZ_QUESTIONS.length) * 100);
  const scorePercentage = totalAnswered > 0 ? Math.round((correctCount / QUIZ_QUESTIONS.length) * 100) : 0;

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
  };

  // Evaluation Title
  const getMasteryRank = () => {
    if (totalAnswered === 0) return { title: 'Non commencé', color: 'text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700', desc: 'Répondez aux questions pour tester vos acquis.' };
    if (correctCount === QUIZ_QUESTIONS.length) {
      return {
        title: 'Architecte LLM Émérite (100%)',
        color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800',
        desc: 'Félicitations ! Vous maîtrisez l\'intégralité du pipeline des modèles de langage, du token à l\'alignement RLHF !',
      };
    }
    if (correctCount >= 6) {
      return {
        title: 'Ingénieur IA Confirmé',
        color: 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-800',
        desc: 'Très bon niveau technique ! Vous comprenez en profondeur la mécanique d\'attention, la Softmax et le fine-tuning.',
      };
    }
    if (correctCount >= 4) {
      return {
        title: 'Praticien en Apprentissage',
        color: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800',
        desc: 'Bons fondamentaux. Continuez d\'explorer les modules interactifs pour consolider la rétropropagation et l\'alignement.',
      };
    }
    return {
      title: 'Découvreur Curieux',
      color: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800',
      desc: 'N\'hésitez pas à relire les sections explicatives du guide et à tester les mini-expériences interactives.',
    };
  };

  const rank = getMasteryRank();

  return (
    <div className="space-y-6">
      {/* Page Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs transition-colors duration-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                <Award className="w-5 h-5 sm:w-6 sm:h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    Grand Quiz des Connaissances LLM
                  </h1>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
                    {QUIZ_QUESTIONS.length} Questions Clés
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Évaluation interactive et didactique de votre compréhension de chaque rouage d'un grand modèle de langage.
                </p>
              </div>
            </div>
          </div>

          {/* Page Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('userguide')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Consulter le guide explicatif"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Consulter le Guide</span>
            </button>
            <button
              onClick={handleResetQuiz}
              disabled={totalAnswered === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Effacer mes réponses et recommencer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Quiz Card */}
      <div id="quiz-section" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6 shadow-xs transition-colors duration-200">

      {/* Score Card & Mastery Badge */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Progression globale</span>
            <span className="font-mono text-slate-500 dark:text-slate-400">{totalAnswered} / {QUIZ_QUESTIONS.length} répondues</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Score de réussite</span>
            <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300">{correctCount} / {QUIZ_QUESTIONS.length} ({scorePercentage}%)</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                correctCount >= 6 ? 'bg-emerald-500' : correctCount >= 4 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${scorePercentage}%` }}
            />
          </div>
        </div>

        <div className={`p-2.5 rounded-lg border text-xs flex flex-col justify-center ${rank.color}`}>
          <div className="flex items-center gap-1.5 font-bold">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>{rank.title}</span>
          </div>
          <span className="text-[11px] leading-tight opacity-90 mt-0.5">{rank.desc}</span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5" />
          Filtrer :
        </span>
        {stages.map(stage => (
          <button
            key={stage}
            onClick={() => setSelectedFilter(stage)}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer text-xs ${
              selectedFilter === stage
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {stage}
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q, qIndex) => {
          const userAnswer = userAnswers[q.id];
          const isAnswered = userAnswer !== undefined;
          const isCorrect = isAnswered && userAnswer === q.correctIndex;

          return (
            <div
              key={q.id}
              className={`p-5 rounded-xl border transition-all ${
                !isAnswered
                  ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  : isCorrect
                  ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/20'
                  : 'border-rose-200 dark:border-rose-800 bg-rose-50/20 dark:bg-rose-950/20'
              }`}
            >
              {/* Question Top Metadata */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center font-mono">
                    {q.id}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {q.stage}
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                    · {q.conceptKey}
                  </span>
                </div>

                {isAnswered && (
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    {isCorrect ? (
                      <span className="text-emerald-700 dark:text-emerald-300 flex items-center gap-1 bg-emerald-100/80 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        Exact (+1 point)
                      </span>
                    ) : (
                      <span className="text-rose-700 dark:text-rose-300 flex items-center gap-1 bg-rose-100/80 dark:bg-rose-950/80 px-2.5 py-0.5 rounded-md border border-rose-200 dark:border-rose-800">
                        <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                        À revoir
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Question Text */}
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3.5 leading-snug">
                {q.question}
              </h4>

              {/* Options */}
              <div className="space-y-2 mb-3">
                {q.options.map((option, optIdx) => {
                  const isSelected = userAnswer === optIdx;
                  const isOptionCorrect = optIdx === q.correctIndex;

                  let optionStyle = 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300';

                  if (isAnswered) {
                    if (isOptionCorrect) {
                      optionStyle = 'border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-200 font-medium shadow-xs';
                    } else if (isSelected && !isOptionCorrect) {
                      optionStyle = 'border-rose-400 dark:border-rose-600 bg-rose-50 dark:bg-rose-950/50 text-rose-950 dark:text-rose-200 line-through';
                    } else {
                      optionStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 text-slate-400 dark:text-slate-600 opacity-60';
                    }
                  } else if (isSelected) {
                    optionStyle = 'border-indigo-400 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-950 dark:text-indigo-200 font-medium';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`w-full text-left p-3 rounded-lg border text-xs flex items-start gap-3 transition-colors cursor-pointer ${optionStyle}`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[10px] font-mono font-bold mt-0.5 ${
                          isAnswered
                            ? isOptionCorrect
                              ? 'bg-emerald-600 text-white'
                              : isSelected
                              ? 'bg-rose-500 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                            : isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1 leading-relaxed">{option}</span>
                      {isAnswered && isOptionCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      )}
                      {isAnswered && isSelected && !isOptionCorrect && (
                        <XCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Pedagogical Explanation & Module Link */}
              {isAnswered && (
                <div className="mt-3 pt-3 border-t border-slate-200/70 dark:border-slate-700/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-white/70 dark:bg-slate-800/60 p-3 rounded-lg">
                  <div className="flex items-start gap-2 max-w-2xl">
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">Explication didactique : </span>
                      <span className="text-slate-600 dark:text-slate-300 leading-relaxed">{q.explanation}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate(q.targetTab)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold rounded-lg border border-indigo-200 dark:border-indigo-800 text-xs shrink-0 transition-colors cursor-pointer self-start sm:self-auto"
                    title={`Aller à la page dédiée pour pratiquer : ${q.targetTab}`}
                  >
                    <span>Explorer dans l'app</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>

    {/* Quiz Completion & Next Steps Card */}
    {totalAnswered === QUIZ_QUESTIONS.length && (
      <div className="bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-purple-500/10 border border-emerald-300 dark:border-emerald-800 rounded-xl p-6 shadow-xs text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
          <Award className="w-8 h-8" />
        </div>
        <div className="max-w-xl mx-auto space-y-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Quiz terminé avec succès ! Score final : {correctCount} / {QUIZ_QUESTIONS.length} ({scorePercentage}%)
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Rang obtenu : <strong className="text-slate-900 dark:text-white font-semibold">{rank.title}</strong>. {rank.desc}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handleResetQuiz}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Refaire le quiz</span>
          </button>
          <button
            onClick={() => onNavigate('chat')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <span>Tester le Chatbot Multi-Moteurs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigate('generation')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 rounded-lg transition-colors cursor-pointer"
          >
            <span>Atelier Inférence & Gradients</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    )}
  </div>
);
};
