import React, { useState, useEffect, useRef } from 'react';
import {
  GenerationStep,
  ModelWeights,
  NextTokenCandidate,
  Token,
  Vocabulary,
} from '../types/llm';
import { encodePrompt, getTokenColor, END_TOKEN } from '../utils/tokenizer';
import {
  predictNextTokenCandidates,
  sampleCandidate,
  computeAttentionMap,
} from '../utils/modelEngine';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Dice5,
  ArrowRight,
  Sparkles,
  Gauge,
  Info,
  Eye,
  Network,
  Grid,
} from 'lucide-react';

interface InferencePlaygroundProps {
  model: ModelWeights;
  vocabulary: Vocabulary;
  contextWindow: number;
  initialPrompt?: string;
}

export const InferencePlayground: React.FC<InferencePlaygroundProps> = ({
  model,
  vocabulary,
  contextWindow,
  initialPrompt = 'le renard',
}) => {
  const [promptText, setPromptText] = useState(initialPrompt);
  const [temperature, setTemperature] = useState<number>(0.8);
  const [generatedTokens, setGeneratedTokens] = useState<Token[]>([]);
  const [stepsHistory, setStepsHistory] = useState<GenerationStep[]>([]);
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);
  const [lastSampledCandidate, setLastSampledCandidate] = useState<NextTokenCandidate | null>(null);
  const [showPplExplanation, setShowPplExplanation] = useState(false);

  // Attention Map State
  const [activeAttentionHead, setActiveAttentionHead] = useState<'global' | 'syntax' | 'semantic'>('global');
  const [attentionViewMode, setAttentionViewMode] = useState<'linear' | 'matrix'>('linear');
  const [hoveredCandidateText, setHoveredCandidateText] = useState<string | null>(null);
  const [hoveredMatrixCell, setHoveredMatrixCell] = useState<{ query: string; key: string; weight: number } | null>(null);
  const [showAttentionExplainer, setShowAttentionExplainer] = useState<boolean>(false);

  const autoGenTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Encode current full sentence (initial prompt + generated tokens)
  const currentTokens = React.useMemo(() => {
    const base = encodePrompt(promptText, vocabulary);
    return [...base, ...generatedTokens];
  }, [promptText, generatedTokens, vocabulary]);

  // Predict next token candidates based on current context
  const { candidates, activeContextTokens } = React.useMemo(() => {
    return predictNextTokenCandidates(
      currentTokens,
      model,
      vocabulary,
      contextWindow,
      temperature
    );
  }, [currentTokens, model, vocabulary, contextWindow, temperature]);

  // Compute Attention Map for the sequence
  const attentionData = React.useMemo(() => {
    return computeAttentionMap(
      currentTokens,
      contextWindow,
      activeAttentionHead,
      hoveredCandidateText || undefined
    );
  }, [currentTokens, contextWindow, activeAttentionHead, hoveredCandidateText]);

  // Check if reached end token
  const hasEnded = generatedTokens.length > 0 &&
    generatedTokens[generatedTokens.length - 1].text === END_TOKEN;

  // Single step generation
  const handleGenerateNextToken = () => {
    if (candidates.length === 0 || hasEnded) return;

    const { chosen, randomSample } = sampleCandidate(candidates, temperature);
    setLastSampledCandidate(chosen);

    const newToken: Token = {
      id: chosen.id,
      text: chosen.text,
      isSpecial: chosen.text === END_TOKEN,
    };

    const chosenProb = chosen.probability;
    const stepPerplexity = chosenProb > 0 ? Math.exp(-Math.log(Math.max(chosenProb, 0.0001))) : 99;

    const newStep: GenerationStep = {
      stepIndex: generatedTokens.length + 1,
      contextTokens: [...activeContextTokens],
      candidates: [...candidates],
      chosenToken: newToken,
      temperature,
      randomValue: randomSample,
      chosenProbability: chosenProb,
      stepPerplexity: Number(stepPerplexity.toFixed(2)),
    };

    setGeneratedTokens(prev => [...prev, newToken]);
    setStepsHistory(prev => [...prev, newStep]);

    if (newToken.text === END_TOKEN) {
      setIsAutoGenerating(false);
    }
  };

  // Auto-generation loop
  useEffect(() => {
    if (isAutoGenerating && !hasEnded && generatedTokens.length < 20) {
      autoGenTimerRef.current = setTimeout(() => {
        handleGenerateNextToken();
      }, 650);
    } else {
      setIsAutoGenerating(false);
    }

    return () => {
      if (autoGenTimerRef.current) {
        clearTimeout(autoGenTimerRef.current);
      }
    };
  }, [isAutoGenerating, generatedTokens.length, hasEnded]);

  const handleResetGeneration = () => {
    setIsAutoGenerating(false);
    setGeneratedTokens([]);
    setStepsHistory([]);
    setLastSampledCandidate(null);
    setHoveredCandidateText(null);
  };

  const handleApplyPresetPrompt = (text: string) => {
    handleResetGeneration();
    setPromptText(text);
  };

  // Instantaneous context perplexity (branching factor / entropy of next token candidates)
  const contextPerplexity = React.useMemo(() => {
    if (candidates.length === 0) return null;
    let entropy = 0;
    for (const cand of candidates) {
      if (cand.probability > 0) {
        entropy -= cand.probability * Math.log(cand.probability);
      }
    }
    return Math.exp(entropy);
  }, [candidates]);

  // Cumulative sequence metrics over all generated tokens
  const sequenceMetrics = React.useMemo(() => {
    if (stepsHistory.length === 0) return null;
    let totalNLL = 0;
    for (const step of stepsHistory) {
      const p = step.chosenProbability ?? (step.candidates.find(c => c.id === step.chosenToken.id)?.probability || 0.001);
      totalNLL += -Math.log(Math.max(p, 0.0001));
    }
    const avgLoss = totalNLL / stepsHistory.length;
    const ppl = Math.exp(avgLoss);
    return {
      avgLoss: Number(avgLoss.toFixed(3)),
      perplexity: Number(ppl.toFixed(2)),
      tokenCount: stepsHistory.length,
    };
  }, [stepsHistory]);

  // Current active perplexity to display primarily
  const activePerplexity = sequenceMetrics ? sequenceMetrics.perplexity : (contextPerplexity ? Number(contextPerplexity.toFixed(2)) : null);

  // Confidence score mapped from perplexity (1.0 -> 100%, 2.0 -> 50%, 4.0 -> 25%)
  const confidenceScore = activePerplexity !== null
    ? Math.max(5, Math.min(100, Math.round((1 / Math.max(1, activePerplexity)) * 100)))
    : 100;

  const getPerplexityStatus = (ppl: number | null) => {
    if (ppl === null) {
      return {
        label: 'En attente',
        color: 'text-slate-500 bg-slate-100 border-slate-200',
        barColor: 'bg-slate-300',
        desc: 'Saisissez un prompt ou lancez la génération.',
      };
    }
    if (ppl <= 1.5) {
      return {
        label: 'Excellente Certitude',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        barColor: 'bg-emerald-500',
        desc: 'Le modèle est très sûr de sa trajectoire (faible perplexité).',
      };
    }
    if (ppl <= 3.5) {
      return {
        label: 'Incertitude Modérée',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        barColor: 'bg-amber-500',
        desc: 'Hésitation équilibrée entre plusieurs suites plausibles.',
      };
    }
    return {
      label: 'Forte Perplexité',
      color: 'text-rose-700 bg-rose-50 border-rose-200',
      barColor: 'bg-rose-500',
      desc: 'Le modèle est très hésitant ou la température disperse les choix.',
    };
  };

  const pplStatus = getPerplexityStatus(activePerplexity);

  // Temperature description helper
  const getTempDescription = (temp: number) => {
    if (temp <= 0.2) return 'Quasi-déterministe (Greedy) : Choix systématique du mot n°1 (Perplexité minimale)';
    if (temp <= 0.8) return 'Équilibré : Respecte fidèlement les proportions du corpus';
    if (temp <= 1.4) return 'Créatif : Permet d’explorer des mots moins fréquents (Perplexité accrue)';
    return 'Très chaotique : Aplatit la courbe, dispersion maximale des probabilités';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700">
              Génération & Inférence
            </span>
            <span className="text-xs text-slate-400">· Mécanisme d'attention et perplexité en temps réel</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
            Étape 3 : L'Inférence, l'Attention et la Softmax
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Un LLM ne rédige jamais une phrase entière d'un coup. Il procède de manière <strong>autorégressive</strong> : à chaque étape, il focalise son <strong>attention</strong> sur les mots clés du passé, calcule la distribution Softmax des candidats selon la température, et évalue son niveau de certitude via la <strong>Perplexité</strong>.
          </p>
        </div>
      </div>

      {/* Main 2-Zone Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Zone: Live Generation Stage + Attention Maps + Candidates (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Prompt & Current Text Box */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-900">
                Prompt initial (début de phrase)
              </label>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span>Suggestions :</span>
                {['le chat', 'le renard', 'pour faire', 'en hiver'].map(seed => (
                  <button
                    key={seed}
                    onClick={() => handleApplyPresetPrompt(seed)}
                    className="underline hover:text-indigo-600 cursor-pointer"
                  >
                    "{seed}"
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={promptText}
                onChange={e => {
                  setPromptText(e.target.value);
                  handleResetGeneration();
                }}
                className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                placeholder="Ex: le renard..."
              />
              <button
                onClick={handleResetGeneration}
                className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                title="Effacer la génération"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Live Text Display with Tokens and Highlighting */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-700">
                    Texte en cours ({currentTokens.length} tokens) :
                  </span>
                  {activePerplexity !== null && (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono border ${pplStatus.color}`}>
                      <Gauge className="w-3 h-3" />
                      <span>PPL: {activePerplexity.toFixed(2)}</span>
                    </span>
                  )}
                </div>

                {hasEnded && (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    ✓ Fin de phrase atteinte (&lt;FIN&gt;)
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-1.5 min-h-12 text-sm">
                {currentTokens.map((tok, idx) => {
                  const isPrompt = idx < encodePrompt(promptText, vocabulary).length;
                  const isActiveContext = activeContextTokens.some(ac => ac.id === tok.id);

                  return (
                    <span
                      key={idx}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border font-mono text-xs transition-all ${
                        isActiveContext
                          ? 'ring-2 ring-indigo-500 ring-offset-1 font-semibold'
                          : ''
                      } ${getTokenColor(tok.id)}`}
                      title={`Token: "${tok.text}" | ID: ${tok.id}`}
                    >
                      <span>{tok.text}</span>
                      {tok.isSpecial && (
                        <span className="text-[10px] opacity-70">★</span>
                      )}
                    </span>
                  );
                })}

                {/* Animated typing cursor */}
                {!hasEnded && (
                  <span className="w-2 h-5 bg-indigo-500 rounded-xs animate-pulse inline-block" />
                )}
              </div>

              {/* Context Legend */}
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-xs border-2 border-indigo-500 bg-indigo-50 inline-block" />
                  <span>
                    Contexte actif inspecté :{' '}
                    <strong>
                      {activeContextTokens.length > 0
                        ? activeContextTokens.map(t => t.text).join(' ')
                        : 'START'}
                    </strong>
                  </span>
                </div>
                <span>Fenêtre : {contextWindow} token(s)</span>
              </div>
            </div>

            {/* Generation Controls */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleGenerateNextToken}
                disabled={hasEnded || candidates.length === 0}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>Prédire le prochain mot (+1 token)</span>
              </button>

              <button
                onClick={() => setIsAutoGenerating(!isAutoGenerating)}
                disabled={hasEnded || candidates.length === 0}
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer border ${
                  isAutoGenerating
                    ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {isAutoGenerating ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Génération continue</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Attention Mechanism (Attention Maps) Component */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-sm font-bold text-slate-900">
                      Mécanisme d'Attention (Attention Map)
                    </h2>
                    <button
                      onClick={() => setShowAttentionExplainer(!showAttentionExplainer)}
                      className="text-slate-400 hover:text-purple-600 transition-colors cursor-pointer"
                      title="Qu'est-ce que le mécanisme d'attention ?"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Visualise l'influence de chaque mot précédent sur la prédiction à venir
                  </p>
                </div>
              </div>

              {/* Mode toggle (Linear vs Matrix 2D) */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium self-start sm:self-center">
                <button
                  onClick={() => setAttentionViewMode('linear')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                    attentionViewMode === 'linear'
                      ? 'bg-white text-purple-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Network className="w-3.5 h-3.5" />
                  <span>Faisceaux Linéaires</span>
                </button>

                <button
                  onClick={() => setAttentionViewMode('matrix')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                    attentionViewMode === 'matrix'
                      ? 'bg-white text-purple-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>Matrice 2D (Query × Key)</span>
                </button>
              </div>
            </div>

            {/* Attention Head Selector */}
            <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
              <span className="text-[11px] text-slate-500 font-medium">Tête d'attention :</span>
              <button
                onClick={() => setActiveAttentionHead('global')}
                className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer text-xs ${
                  activeAttentionHead === 'global'
                    ? 'bg-purple-100/80 border-purple-300 text-purple-900 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                🧠 Synthèse Globale (Multi-Tête)
              </button>
              <button
                onClick={() => setActiveAttentionHead('syntax')}
                className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer text-xs ${
                  activeAttentionHead === 'syntax'
                    ? 'bg-blue-100/80 border-blue-300 text-blue-900 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                🎯 Tête 1 : Syntaxe & Contexte Immédiat
              </button>
              <button
                onClick={() => setActiveAttentionHead('semantic')}
                className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer text-xs ${
                  activeAttentionHead === 'semantic'
                    ? 'bg-emerald-100/80 border-emerald-300 text-emerald-900 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                🦊 Tête 2 : Sémantique Sujet-Verbe
              </button>
            </div>

            {/* Educational Explainer Dropdown */}
            {showAttentionExplainer && (
              <div className="p-3.5 bg-purple-50/70 rounded-lg border border-purple-100 text-xs text-slate-700 space-y-2 leading-relaxed">
                <div className="font-semibold text-purple-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Comment fonctionne l'Attention dans les Transformers ?</span>
                </div>
                <p className="text-[11px]">
                  Dans un Transformer (comme GPT, Gemini ou notre modèle), chaque mot ne regarde pas uniquement son voisin direct. Il compare ce qu'il cherche (<strong>Query</strong>) avec tous les mots précédents (<strong>Keys</strong>) pour calculer des poids d'attention normalisés via Softmax (somme = 100%).
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                  <div className="p-2 bg-white rounded border border-purple-100">
                    <strong className="text-purple-900 block">Query (Q)</strong>
                    <span>La position actuelle cherchant le mot suivant.</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-purple-100">
                    <strong className="text-purple-900 block">Key (K)</strong>
                    <span>Chaque mot antérieur fournissant des indices.</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-purple-100">
                    <strong className="text-purple-900 block">Softmax(QKᵀ / √d)</strong>
                    <span>Poids d'attention attribué à chaque mot du passé.</span>
                  </div>
                </div>
              </div>
            )}

            {/* Candidate Focus Info Badge when hovering */}
            {hoveredCandidateText && (
              <div className="px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-800 flex items-center justify-between">
                <span>
                  Focalisation d'attention pour le mot candidat : <strong>« {hoveredCandidateText} »</strong>
                </span>
                <span className="text-[11px] text-purple-600 font-medium">Affinité sémantique active</span>
              </div>
            )}

            {/* VIEW 1: LINEAR ATTENTION BEAMS */}
            {attentionViewMode === 'linear' && (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Faisceaux d'influence vers le prochain token :</span>
                  <span className="font-mono text-[10px]">Somme d'attention = 100%</span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {attentionData.weights.map((w, idx) => {
                    const pct = w.percentage;
                    const isHigh = pct >= 30;
                    const isMedium = pct >= 15 && pct < 30;

                    return (
                      <div key={idx} className="flex flex-col items-center gap-1 group">
                        {/* Token pill with attention intensity */}
                        <div
                          className={`relative px-3 py-1.5 rounded-lg border font-mono text-xs transition-all shadow-xs ${
                            isHigh
                              ? 'bg-purple-600 text-white border-purple-700 ring-2 ring-purple-300 font-bold scale-105'
                              : isMedium
                              ? 'bg-purple-100 text-purple-900 border-purple-300 font-semibold'
                              : 'bg-white text-slate-700 border-slate-200'
                          }`}
                          style={{
                            boxShadow: isHigh ? '0 0 12px rgba(147, 51, 234, 0.35)' : undefined,
                          }}
                        >
                          <span>{w.token.text}</span>
                          {w.role === 'context' && (
                            <span className="ml-1 text-[9px] opacity-75">★</span>
                          )}
                        </div>

                        {/* Percentage bar & label */}
                        <div className="flex flex-col items-center">
                          <span className={`text-[10px] font-mono font-bold tabular-nums ${
                            isHigh ? 'text-purple-700' : isMedium ? 'text-purple-600' : 'text-slate-400'
                          }`}>
                            {pct}%
                          </span>
                          {/* Mini vertical heat indicator */}
                          <div className="w-1.5 h-3 bg-slate-200 rounded-full overflow-hidden mt-0.5">
                            <div
                              className={`w-full rounded-full ${
                                isHigh ? 'bg-purple-600' : isMedium ? 'bg-purple-400' : 'bg-slate-400'
                              }`}
                              style={{ height: `${Math.min(100, pct * 2.5)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Arrow connecting to Target Slot */}
                  <div className="flex items-center text-purple-500 font-bold px-1">
                    <ArrowRight className="w-4 h-4 animate-pulse" />
                  </div>

                  {/* Target Next Token Slot */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="px-3 py-1.5 rounded-lg border-2 border-dashed border-indigo-400 bg-indigo-50/60 text-indigo-700 font-mono text-xs font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                      <span>[ ? Prochain Token ]</span>
                    </div>
                    <span className="text-[10px] text-indigo-600 font-semibold">Cible</span>
                  </div>
                </div>

                {/* Legend & Interpretation */}
                <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block" />
                      <span>Forte influence (&ge; 30%)</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-200 inline-block" />
                      <span>Influence moyenne (15-29%)</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-200 inline-block" />
                      <span>Faible influence (&lt; 15%)</span>
                    </span>
                  </div>
                  <span>Survolez un candidat ci-dessous pour voir son attention</span>
                </div>
              </div>
            )}

            {/* VIEW 2: 2D CAUSAL ATTENTION MATRIX */}
            {attentionViewMode === 'matrix' && (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3 overflow-x-auto">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Matrice Causal Query (Ligne) × Key (Colonne) :</span>
                  <span className="text-[11px] text-purple-700 font-medium">
                    {hoveredMatrixCell
                      ? `« ${hoveredMatrixCell.query} » ➔ « ${hoveredMatrixCell.key} » : ${(hoveredMatrixCell.weight * 100).toFixed(1)}%`
                      : 'Survolez une cellule pour inspecter l\'attention'}
                  </span>
                </div>

                {/* Matrix Table */}
                <div className="inline-block min-w-full">
                  <table className="border-collapse text-xs font-mono">
                    <thead>
                      <tr>
                        <th className="p-1.5 text-left text-[10px] text-slate-400 font-normal">
                          Query \ Key
                        </th>
                        {currentTokens.map((tok, j) => (
                          <th key={j} className="p-1.5 text-center text-[11px] font-semibold text-slate-700">
                            <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200">
                              {tok.text}
                            </span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {attentionData.causalMatrix.map((row, i) => (
                        <tr key={i} className="border-t border-slate-200/60">
                          <td className="p-1.5 text-[11px] font-semibold text-slate-700 whitespace-nowrap">
                            <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200">
                              {currentTokens[i].text}
                            </span>
                          </td>
                          {currentTokens.map((colTok, j) => {
                            const cell = row.find(c => c.keyIndex === j);
                            const isMasked = j > i; // future token (causally masked)
                            const w = cell ? cell.weight : 0;
                            const pct = Math.round(w * 100);

                            // Color intensity based on attention weight
                            let bgColor = 'bg-slate-100 text-slate-300';
                            if (!isMasked) {
                              if (pct >= 40) bgColor = 'bg-purple-600 text-white font-bold';
                              else if (pct >= 20) bgColor = 'bg-purple-400 text-white';
                              else if (pct >= 10) bgColor = 'bg-purple-200 text-purple-900';
                              else bgColor = 'bg-purple-50 text-purple-800';
                            }

                            return (
                              <td
                                key={j}
                                onMouseEnter={() => {
                                  if (!isMasked) {
                                    setHoveredMatrixCell({
                                      query: currentTokens[i].text,
                                      key: colTok.text,
                                      weight: w,
                                    });
                                  }
                                }}
                                onMouseLeave={() => setHoveredMatrixCell(null)}
                                className={`p-1 text-center transition-all cursor-pointer ${
                                  isMasked ? 'bg-slate-100/50 cursor-not-allowed' : ''
                                }`}
                              >
                                <div
                                  className={`w-10 h-8 rounded flex items-center justify-center text-[10px] tabular-nums transition-transform hover:scale-110 shadow-xs ${bgColor}`}
                                  title={
                                    isMasked
                                      ? 'Masque causal (Futur masqué)'
                                      : `Attention(${currentTokens[i].text} -> ${colTok.text}) = ${pct}%`
                                }
                                >
                                  {isMasked ? '—' : `${pct}%`}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-slate-200 inline-block" />
                    <span>« — » indique le masque causal autorégressif (le modèle ne triche pas avec le futur)</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Candidates Probability Roulette / Bar Chart */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Distribution des candidats pour le mot suivant
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Calculé par Softmax avec la température actuelle (τ = {temperature.toFixed(2)})
                </p>
              </div>

              {contextPerplexity !== null && (
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-mono">PPL Contexte</span>
                  <span className="text-xs font-bold font-mono text-indigo-700">
                    {contextPerplexity.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {candidates.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-lg">
                Aucun candidat possible (contexte inconnu ou phrase terminée).
              </div>
            ) : (
              <div className="space-y-2.5">
                {candidates.map((cand, idx) => {
                  const pct = Math.round(cand.probability * 100);
                  const isJustPicked = lastSampledCandidate?.id === cand.id;
                  const isHovered = hoveredCandidateText === cand.text;

                  return (
                    <div
                      key={cand.id}
                      onMouseEnter={() => setHoveredCandidateText(cand.text)}
                      onMouseLeave={() => setHoveredCandidateText(null)}
                      className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                        isJustPicked
                          ? 'border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500'
                          : isHovered
                          ? 'border-purple-400 bg-purple-50/60 ring-1 ring-purple-300'
                          : 'border-slate-100 bg-slate-50/50 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-400 text-[11px] w-4">
                            #{idx + 1}
                          </span>
                          <span className={`px-2 py-0.5 rounded border text-[11px] font-mono ${getTokenColor(cand.id)}`}>
                            {cand.text}
                          </span>
                          {cand.text === END_TOKEN && (
                            <span className="text-[10px] text-indigo-600 font-medium">
                              (Fin de phrase)
                            </span>
                          )}
                          {isHovered && (
                            <span className="text-[10px] text-purple-700 font-medium hidden sm:inline">
                              (Attention ciblée au-dessus)
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-slate-400 text-[11px] font-mono tabular-nums">
                            Logit: {cand.rawLogit}
                          </span>
                          <span className="font-mono font-semibold text-slate-900 tabular-nums">
                            {pct}% ({cand.probability.toFixed(3)})
                          </span>
                        </div>
                      </div>

                      {/* Probability bar */}
                      <div className="w-full bg-slate-200/70 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isJustPicked ? 'bg-indigo-600' : isHovered ? 'bg-purple-600' : 'bg-slate-700'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Zone: Perplexity Card + Temperature + Generation Log (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Real-time Perplexity Indicator Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                  <Gauge className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-slate-900">
                      Indicateur de Perplexité
                    </h3>
                    <button
                      onClick={() => setShowPplExplanation(!showPplExplanation)}
                      className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                      title="Qu'est-ce que la Perplexité ?"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500">Mesure la qualité de prédiction en temps réel</p>
                </div>
              </div>

              {activePerplexity !== null && (
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${pplStatus.color}`}>
                  {pplStatus.label}
                </span>
              )}
            </div>

            {/* Educational Collapsible Explanation */}
            {showPplExplanation && (
              <div className="p-3 bg-indigo-50/70 rounded-lg border border-indigo-100 text-xs text-slate-700 space-y-1.5 leading-relaxed">
                <div className="font-semibold text-indigo-900 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Comment fonctionne la Perplexité (PPL) ?</span>
                </div>
                <p className="text-[11px]">
                  La <strong>Perplexité (PPL = exp(Loss))</strong> est l'indicateur standard de référence pour évaluer un LLM. Elle quantifie le degré de "surprise" du modèle face au texte :
                </p>
                <ul className="text-[11px] space-y-1 list-disc list-inside text-slate-600">
                  <li><strong>PPL = 1.0</strong> : Certitude absolue (aucune hésitation, prédiction parfaite).</li>
                  <li><strong>PPL = 2.0</strong> : Le modèle hésite à parts égales entre 2 mots possibles.</li>
                  <li><strong>Plus la valeur est basse</strong>, plus la phrase est fluide, logique et maîtrisée par le modèle.</li>
                  <li><strong>Lien avec la Température</strong> : Monter le curseur de température aplatit les probabilités et fait grimper la perplexité en direct.</li>
                </ul>
              </div>
            )}

            {/* Main Numeric Display & Gauge */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-mono text-slate-900 tracking-tight tabular-nums">
                      {activePerplexity !== null ? activePerplexity.toFixed(2) : '—'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">PPL</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    {stepsHistory.length > 0
                      ? `Moyenne sur ${stepsHistory.length} token(s) généré(s)`
                      : 'Degré d\'incertitude sur le prochain mot'}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Indice de Certitude
                  </span>
                  <span className="font-mono text-lg font-bold text-slate-900 tabular-nums">
                    {confidenceScore}%
                  </span>
                </div>
              </div>

              {/* Progress gauge bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${pplStatus.barColor}`}
                    style={{ width: `${confidenceScore}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0% (Incertain)</span>
                  <span>50%</span>
                  <span>100% (Certain)</span>
                </div>
              </div>
            </div>

            {/* Detailed Sub-metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-medium">Prochain Mot (Contexte)</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-mono font-bold text-slate-800 text-sm tabular-nums">
                    {contextPerplexity !== null ? contextPerplexity.toFixed(2) : '—'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">PPL</span>
                </div>
                <span className="text-[10px] text-slate-500 block truncate mt-0.5" title="Nombre effectif de choix plausibles">
                  ~{contextPerplexity !== null ? Math.max(1, Math.round(contextPerplexity)) : 0} choix en balance
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-medium">Séquence Générée</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-mono font-bold text-slate-800 text-sm tabular-nums">
                    {sequenceMetrics !== null ? sequenceMetrics.perplexity.toFixed(2) : '—'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">PPL</span>
                </div>
                <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                  {sequenceMetrics !== null ? `Loss: ${sequenceMetrics.avgLoss}` : 'En attente de génération'}
                </span>
              </div>
            </div>

            {/* Step-by-Step Sparkline / Dots when generated */}
            {stepsHistory.length > 0 && (
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-medium text-slate-700">Évolution de la perplexité par mot :</span>
                  <span className="font-mono text-[10px]">{stepsHistory.length} token(s)</span>
                </div>

                <div className="flex items-end gap-1.5 overflow-x-auto py-1 px-1">
                  {stepsHistory.map((step, sIdx) => {
                    const sPpl = step.stepPerplexity ?? 1;
                    const barColor = sPpl <= 1.5 ? 'bg-emerald-500' : sPpl <= 3.5 ? 'bg-amber-500' : 'bg-rose-500';
                    const heightPx = Math.min(36, Math.max(12, Math.round(sPpl * 8)));

                    return (
                      <div
                        key={sIdx}
                        className="group relative flex flex-col items-center cursor-pointer shrink-0"
                      >
                        <div
                          className={`w-4 rounded-xs ${barColor} opacity-90 group-hover:opacity-100 transition-all flex items-end justify-center pb-0.5`}
                          style={{ height: `${heightPx}px` }}
                        >
                          <span className="text-[8px] text-white font-mono leading-none">
                            {sIdx + 1}
                          </span>
                        </div>

                        {/* Hover Tooltip */}
                        <div className="hidden group-hover:block absolute bottom-full mb-1.5 z-20 whitespace-nowrap bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-lg pointer-events-none font-mono">
                          #{sIdx + 1} «{step.chosenToken.text}» · PPL {sPpl} (P: {Math.round((step.chosenProbability ?? 0) * 100)}%)
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Temperature Slider Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Dice5 className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Température (T)
                </h3>
              </div>
              <span className="font-mono font-bold text-sm text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 tabular-nums">
                {temperature.toFixed(2)}
              </span>
            </div>

            <div>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.05"
                value={temperature}
                onChange={e => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>0.1 (Strict · PPL Basse)</span>
                <span>1.0 (Équilibré)</span>
                <span>2.0 (Créatif · PPL Haute)</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-600 space-y-1">
              <div className="font-medium text-slate-800">
                Effet direct sur la génération et la perplexité :
              </div>
              <p className="text-[11px] text-slate-500">
                {getTempDescription(temperature)}
              </p>
            </div>
          </div>

          {/* History of generation steps */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                Journal des décisions pas à pas
              </h3>
              <span className="text-xs text-slate-400 tabular-nums font-mono">
                {stepsHistory.length} étape(s)
              </span>
            </div>

            {stepsHistory.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-lg">
                Cliquez sur <em>"Prédire le prochain mot"</em> pour observer les calculs internes du modèle et l'évolution de la perplexité.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {stepsHistory.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700">
                        Étape #{step.stepIndex}
                      </span>
                      <div className="flex items-center gap-2 font-mono text-[10px]">
                        {step.chosenProbability !== undefined && (
                          <span className="text-slate-600">
                            P = <strong>{Math.round(step.chosenProbability * 100)}%</strong>
                          </span>
                        )}
                        {step.stepPerplexity !== undefined && (
                          <span className={`px-1.5 py-0.5 rounded border font-bold ${
                            step.stepPerplexity <= 1.5
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                              : step.stepPerplexity <= 3.5
                              ? 'bg-amber-50 border-amber-200 text-amber-700'
                              : 'bg-rose-50 border-rose-200 text-rose-700'
                          }`}>
                            PPL {step.stepPerplexity}
                          </span>
                        )}
                        <span>Tiré : {step.randomValue}</span>
                      </div>
                    </div>

                    <div className="text-slate-600 flex items-center gap-1.5 flex-wrap">
                      <span>Contexte :</span>
                      <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {step.contextTokens.map(t => t.text).join(' ')}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <span>Choisi :</span>
                      <span className={`px-2 py-0.5 rounded border font-mono font-semibold ${getTokenColor(step.chosenToken.id)}`}>
                        {step.chosenToken.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
