import React, { useState, useMemo } from 'react';
import { ModelWeights, Vocabulary, PreferencePair, RlhfMetrics } from '../types/llm';
import { applyReinforcementLearning, generateTokensSequence } from '../utils/modelEngine';
import { encodePrompt } from '../utils/tokenizer';
import {
  ThumbsUp,
  ThumbsDown,
  ShieldAlert,
  Sparkles,
  Sliders,
  Play,
  ArrowRight,
  Award,
  CheckCircle2,
  TrendingUp,
  BookOpen,
  Cpu
} from 'lucide-react';

interface ReinforcementSectionProps {
  baseModel: ModelWeights;
  vocabulary: Vocabulary;
  contextWindow: number;
  rlModel: ModelWeights | null;
  setRlModel: (m: ModelWeights | null) => void;
  onNavigateToChat: () => void;
}

const DEFAULT_PREFERENCES: PreferencePair[] = [
  {
    id: 'pref-1',
    prompt: 'question comment nourrir le chat',
    chosen: 'le chat mange sa gamelle et boit de l eau',
    rejected: 'le chat mange la souris empoisonnee dans la prairie',
    rewardChosen: 1.0,
    rewardRejected: -1.0,
    category: 'Sécurité',
    userVote: 'chosen',
  },
  {
    id: 'pref-2',
    prompt: 'question qui flatte le corbeau',
    chosen: 'le renard flatte le corbeau avec politesse',
    rejected: 'le loup attaque le mouton violemment',
    rewardChosen: 0.9,
    rewardRejected: -0.9,
    category: 'Politesse',
    userVote: 'chosen',
  },
  {
    id: 'pref-3',
    prompt: 'question que faire en hiver',
    chosen: 'en hiver le vent souffle et il fait froid rester au chaud',
    rejected: 'en hiver la neige recouvre et le loup attaque',
    rewardChosen: 0.8,
    rewardRejected: -0.8,
    category: 'Exactitude',
    userVote: 'chosen',
  },
  {
    id: 'pref-4',
    prompt: 'question pour faire une tarte',
    chosen: 'pour faire une tarte couper les pommes avec soin',
    rejected: 'pour faire une tarte couper les doigts avec le couteau',
    rewardChosen: 1.0,
    rewardRejected: -1.2,
    category: 'Sécurité',
    userVote: 'chosen',
  },
];

export const ReinforcementSection: React.FC<ReinforcementSectionProps> = ({
  baseModel,
  vocabulary,
  contextWindow,
  rlModel,
  setRlModel,
  onNavigateToChat,
}) => {
  const [preferences, setPreferences] = useState<PreferencePair[]>(DEFAULT_PREFERENCES);
  const [rewardScaling, setRewardScaling] = useState<number>(1.0);
  const [klCoeff, setKlCoeff] = useState<number>(0.25);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [trainingProgress, setTrainingProgress] = useState<number>(0);
  const [rlMetrics, setRlMetrics] = useState<RlhfMetrics | null>(null);

  const [testPrompt, setTestPrompt] = useState<string>('question comment nourrir le chat');

  // Handle voting
  const handleVote = (id: string, vote: 'chosen' | 'rejected') => {
    setPreferences(prev =>
      prev.map(p => {
        if (p.id !== id) return p;
        return {
          ...p,
          userVote: vote,
          rewardChosen: vote === 'chosen' ? 1.0 : 0.2,
          rewardRejected: vote === 'chosen' ? -1.0 : 0.5,
        };
      })
    );
  };

  // Run RLHF optimization
  const handleRunRLHF = () => {
    setIsOptimizing(true);
    setTrainingProgress(0);

    const stepInterval = 250;
    let step = 0;
    const totalSteps = 4;

    const interval = setInterval(() => {
      step++;
      setTrainingProgress(Math.round((step / totalSteps) * 100));

      if (step >= totalSteps) {
        clearInterval(interval);
        const { alignedModel, metrics } = applyReinforcementLearning(
          baseModel,
          preferences,
          vocabulary,
          contextWindow,
          rewardScaling,
          klCoeff
        );
        setRlModel(alignedModel);
        setRlMetrics(metrics);
        setIsOptimizing(false);
        setTrainingProgress(0);
      }
    }, stepInterval);
  };

  // Live generation comparison
  const encodedTest = useMemo(() => {
    return encodePrompt(testPrompt, vocabulary);
  }, [testPrompt, vocabulary]);

  const baseGeneration = useMemo(() => {
    return generateTokensSequence(baseModel, vocabulary, encodedTest, contextWindow, 0.4, 12);
  }, [baseModel, vocabulary, encodedTest, contextWindow]);

  const rlGeneration = useMemo(() => {
    if (!rlModel) return [];
    return generateTokensSequence(rlModel, vocabulary, encodedTest, contextWindow, 0.4, 12);
  }, [rlModel, vocabulary, encodedTest, contextWindow]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                Alignement & Sécurité
              </span>
              <span className="text-xs text-slate-500">
                · RLHF / DPO (Reinforcement Learning from Human Feedback)
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Le Reinforcement Learning (RLHF) dans les LLM
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed mt-1 max-w-3xl">
              C'est l'étape reine qui transforme une IA brute en un assistant sûr et bienveillant. Le modèle génère plusieurs variantes, un humain (ou Reward Model) note les bonnes et mauvaises réponses, et l'algorithme (PPO/DPO) <strong>renforce les trajectoires souhaitables tout en pénalisant les comportements nocifs</strong> grâce à une pénalité de divergence KL.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {rlModel && (
              <button
                onClick={onNavigateToChat}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer shadow-xs"
              >
                <span>Tester dans le Chatbot</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 4 Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Paires de Préférence</span>
            <span className="text-sm font-bold font-mono text-slate-900">
              {preferences.length} paires annotées
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Choisi (👍) vs Rejeté (👎)</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Récompense Moyenne (Reward)</span>
            <span className="text-sm font-bold font-mono text-emerald-700">
              {rlMetrics ? `+${rlMetrics.avgReward}` : '+0.95 (Estimé)'}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Gain de la politique</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Divergence KL (D_KL)</span>
            <span className="text-sm font-bold font-mono text-indigo-700">
              {rlMetrics ? rlMetrics.klDivergence : '0.08'}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Évite l'oubli catastrophique</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Statut de la Politique</span>
            <span className="text-sm font-bold font-mono text-slate-900 flex items-center gap-1.5">
              {rlModel ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-emerald-700">Modèle Aligné RLHF</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-amber-700">Politique initiale</span>
                </>
              )}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {rlModel ? 'Poids pénalisés & récompensés' : 'Prêt pour l\'optimisation'}
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Zone Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Zone: Human Feedback & Preference Pairs (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Algorithm Controls */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-rose-600" />
                <span>Paramètres de la Boucle RLHF (PPO / DPO)</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Échelle de Récompense (Reward) :</span>
                  <span className="font-mono font-bold text-rose-700">{rewardScaling.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={rewardScaling}
                  onChange={e => setRewardScaling(parseFloat(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Force du gradient sur les tokens choisis
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Coefficient de Pénalité KL (β) :</span>
                  <span className="font-mono font-bold text-indigo-700">{klCoeff.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.8"
                  step="0.05"
                  value={klCoeff}
                  onChange={e => setKlCoeff(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Empêche le modèle de trop dévier du modèle de base
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleRunRLHF}
                disabled={isOptimizing}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>
                  {isOptimizing
                    ? 'Mise à jour des gradients de politique en cours...'
                    : 'Appliquer l\'Optimisation par Renforcement (RLHF)'}
                </span>
              </button>

              {isOptimizing && (
                <div className="mt-3 bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-rose-600 h-full transition-all duration-200"
                    style={{ width: `${trainingProgress}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Preference Dataset Cards */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Jeu de Données de Préférences (Feedback Humain)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Votez pour la réponse que le modèle doit favoriser (👍) ou sanctionner (👎).
              </p>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {preferences.map((pref, idx) => (
                <div
                  key={pref.id}
                  className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-700">Cas #{idx + 1}</span>
                      <span className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-500">
                        {pref.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleVote(pref.id, 'chosen')}
                        className={`p-1.5 rounded-md border text-xs cursor-pointer transition-colors ${
                          pref.userVote === 'chosen'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
                            : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'
                        }`}
                        title="Favoriser cette trajectoire"
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleVote(pref.id, 'rejected')}
                        className={`p-1.5 rounded-md border text-xs cursor-pointer transition-colors ${
                          pref.userVote === 'rejected'
                            ? 'bg-rose-100 text-rose-800 border-rose-300 font-bold'
                            : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'
                        }`}
                        title="Sanctionner cette trajectoire"
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="text-slate-800 font-medium">
                    Prompt : <span className="font-mono font-normal">"{pref.prompt}"</span>
                  </div>

                  {/* Chosen option */}
                  <div className="p-2.5 rounded bg-emerald-50/70 border border-emerald-200 text-[11px] space-y-0.5">
                    <div className="flex items-center justify-between text-emerald-800 font-semibold">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Réponse Choisie (Sûre & Utile)</span>
                      </span>
                      <span className="font-mono tabular-nums">Récompense : +{pref.rewardChosen}</span>
                    </div>
                    <p className="font-mono text-emerald-950">"{pref.chosen}"</p>
                  </div>

                  {/* Rejected option */}
                  <div className="p-2.5 rounded bg-rose-50/70 border border-rose-200 text-[11px] space-y-0.5">
                    <div className="flex items-center justify-between text-rose-800 font-semibold">
                      <span className="flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" />
                        <span>Réponse Rejetée (Toxique ou Nocive)</span>
                      </span>
                      <span className="font-mono tabular-nums">Pénalité : {pref.rewardRejected}</span>
                    </div>
                    <p className="font-mono text-rose-950">"{pref.rejected}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Zone: Policy Drift & Before/After Live Impact (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Comparison Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Impact Direct : Avant vs Après Reinforcement Learning
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Testez un prompt sensible pour voir comment le RL a désamorcé les réponses toxiques.
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">
                Prompt sensible à tester :
              </label>
              <input
                type="text"
                value={testPrompt}
                onChange={e => setTestPrompt(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                placeholder="Ex: question comment nourrir le chat"
              />

              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2">
                <span>Suggestions :</span>
                {['question comment nourrir le chat', 'question pour faire une tarte', 'question qui flatte le corbeau'].map(seed => (
                  <button
                    key={seed}
                    onClick={() => setTestPrompt(seed)}
                    className="underline hover:text-rose-600 cursor-pointer"
                  >
                    "{seed}"
                  </button>
                ))}
              </div>
            </div>

            {/* Side-by-side results */}
            <div className="grid grid-cols-1 gap-3 pt-2">
              {/* Policy A: Unaligned Base Model */}
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    <span>Modèle Non Aligné (Risque de dérive)</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Sans filtre de sécurité</span>
                </div>

                <div className="text-xs font-mono text-slate-800 bg-white p-2.5 rounded border border-slate-200 leading-relaxed min-h-12">
                  <span className="text-slate-400">{testPrompt} </span>
                  <span className="font-semibold text-slate-900">
                    {baseGeneration.map(t => t.text).join(' ')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Le modèle brut n'a aucune notion du danger ou de la politesse : il prédit uniquement les mots statistiquement fréquents, même s'ils mènent à des conseils dangereux.
                </p>
              </div>

              {/* Policy B: RLHF Aligned Model */}
              <div className="p-3.5 rounded-lg border border-emerald-200 bg-emerald-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span>Modèle Aligné par RLHF (Sécurisé & Conforme)</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-mono">Politique optimisée</span>
                </div>

                <div className="text-xs font-mono text-emerald-950 bg-white p-2.5 rounded border border-emerald-200 leading-relaxed min-h-12">
                  <span className="text-slate-400">{testPrompt} </span>
                  {rlModel ? (
                    <span className="font-bold text-emerald-800">
                      {rlGeneration.map(t => t.text).join(' ')}
                    </span>
                  ) : (
                    <span className="text-slate-400 italic font-sans text-xs">
                      Cliquez sur "Appliquer l'Optimisation par Renforcement" pour voir ce résultat...
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-emerald-800">
                  {rlModel
                    ? 'Dans cette simulation pédagogique, le gradient de politique atténue fortement les probabilités des tokens dangereux et favorise les réponses bienveillantes (le risque est réduit sans prétendre à un risque nul dans un vrai modèle).'
                    : 'La politique de sortie pénalisera les comportements indésirables tout en respectant la frontière de divergence KL.'}
                </p>
              </div>
            </div>
          </div>

          {/* Educational Concept: What is the KL penalty? */}
          <div className="bg-slate-900 text-white rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-rose-400">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs font-semibold tracking-wide uppercase">
                Pourquoi la pénalité KL est indispensable ?
              </span>
            </div>
            <h4 className="text-sm font-semibold text-white">
              Le danger du "Reward Hacking" (Le modèle flatteur)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Si vous récompensez un modèle sans contrainte, il va rapidement trouver une faille : par exemple, répéter <em>« Merci beaucoup avec plaisir merci »</em> à chaque réponse parce que ces mots rapportent le maximum de points de politesse !
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              La <strong>pénalité de divergence KL</strong> mesure à chaque étape l'écart entre le nouveau modèle et le modèle de base d'origine, l'empêchant de devenir amnésique ou de produire des réponses absurdes pour maximiser son score.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
