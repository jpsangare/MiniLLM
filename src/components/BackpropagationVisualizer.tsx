import React, { useState } from 'react';
import { NextTokenCandidate, Token, Vocabulary } from '../types/llm';
import { getTokenColor } from '../utils/tokenizer';
import {
  Workflow,
  ArrowRight,
  ArrowDown,
  RotateCcw,
  Sparkles,
  Info,
  TrendingDown,
  TrendingUp,
  Sliders,
  CheckCircle2,
  Layers,
  Activity,
  Zap,
} from 'lucide-react';

interface BackpropagationVisualizerProps {
  activeContextTokens: Token[];
  candidates: NextTokenCandidate[];
  vocabulary: Vocabulary;
  temperature: number;
  contextWindow: number;
}

export const BackpropagationVisualizer: React.FC<BackpropagationVisualizerProps> = ({
  activeContextTokens,
  candidates,
  vocabulary,
  temperature,
  contextWindow,
}) => {
  const [learningRate, setLearningRate] = useState<number>(0.2);
  const [selectedTargetId, setSelectedTargetId] = useState<number | null>(null);
  const [activeStepTab, setActiveStepTab] = useState<'all' | 1 | 2 | 3 | 4>('all');
  const [showMathExplainer, setShowMathExplainer] = useState<boolean>(false);
  const [stepSimulated, setStepSimulated] = useState<boolean>(false);

  // Fallback candidate list if none available (e.g. at beginning or unknown context)
  const displayCandidates = React.useMemo(() => {
    if (candidates.length >= 2) {
      return candidates.slice(0, 6);
    }
    // Fallback educational tokens
    const sampleWords = ['mange', 'court', 'chante', 'dort', 'vole', 'boit'];
    const fallbackList: NextTokenCandidate[] = sampleWords.map((word, idx) => {
      const tok = vocabulary.tokens.find(t => t.text.toLowerCase() === word);
      const id = tok ? tok.id : idx + 100;
      const rawLogit = Number((3.5 - idx * 0.6).toFixed(2));
      return {
        id,
        text: word,
        rawLogit,
        probability: 0,
        count: 1,
        cumulativeProb: 0,
      };
    });
    // Softmax
    const maxL = Math.max(...fallbackList.map(c => c.rawLogit));
    const exps = fallbackList.map(c => Math.exp((c.rawLogit - maxL) / temperature));
    const sumExps = exps.reduce((a, b) => a + b, 0);
    return fallbackList.map((c, i) => ({
      ...c,
      probability: Number((exps[i] / sumExps).toFixed(4)),
    }));
  }, [candidates, vocabulary, temperature]);

  // Default target token: pick second candidate or first candidate
  const targetCandidate = React.useMemo(() => {
    if (selectedTargetId !== null) {
      const found = displayCandidates.find(c => c.id === selectedTargetId);
      if (found) return found;
    }
    // Default to candidate #2 if available (to demonstrate boosting a word that wasn't #1)
    return displayCandidates.length > 1 ? displayCandidates[1] : displayCandidates[0];
  }, [selectedTargetId, displayCandidates]);

  // Calculations for Forward, Loss, Backward, and Update
  const pTarget = targetCandidate ? Math.max(0.001, targetCandidate.probability) : 0.1;
  const initialLoss = Number((-Math.log(pTarget)).toFixed(3));

  // Compute Gradients: dL/dz_i = p_i - y_i
  const gradientsData = React.useMemo(() => {
    return displayCandidates.map(c => {
      const y = c.id === targetCandidate.id ? 1.0 : 0.0;
      const gradient = Number((c.probability - y).toFixed(4));
      // In SGD update: deltaLogit = - learningRate * gradient (exact formula without arbitrary scaling)
      const deltaLogit = Number((-learningRate * gradient).toFixed(4));
      const updatedLogit = Number((c.rawLogit + deltaLogit).toFixed(4));

      return {
        ...c,
        targetValue: y,
        gradient,
        deltaLogit,
        updatedLogit,
      };
    });
  }, [displayCandidates, targetCandidate, learningRate]);

  // Compute updated probabilities after step
  const updatedProbabilities = React.useMemo(() => {
    const maxL = Math.max(...gradientsData.map(g => g.updatedLogit));
    const exps = gradientsData.map(g => Math.exp((g.updatedLogit - maxL) / temperature));
    const sumExps = exps.reduce((a, b) => a + b, 0);

    return gradientsData.map((g, i) => {
      const newProb = sumExps > 0 ? exps[i] / sumExps : 1 / gradientsData.length;
      return {
        ...g,
        newProbability: Number(newProb.toFixed(4)),
        probDiffPct: Number(((newProb - g.probability) * 100).toFixed(1)),
      };
    });
  }, [gradientsData, temperature]);

  const targetAfter = updatedProbabilities.find(c => c.id === targetCandidate.id);
  const newLoss = targetAfter
    ? Number((-Math.log(Math.max(0.001, targetAfter.newProbability))).toFixed(3))
    : initialLoss;
  const lossReduction = Number((initialLoss - newLoss).toFixed(3));

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-xs">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-xs">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Calcul des Gradients & Rétropropagation (Backpropagation)
                </h2>
                <button
                  onClick={() => setShowMathExplainer(!showMathExplainer)}
                  className="text-slate-400 hover:text-amber-600 transition-colors cursor-pointer"
                  title="Formule mathématique de la dérivée"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-500">
                Simulation interactive d'une passe arrière (Backward Pass) pour comprendre comment l'erreur ajuste les poids du réseau
              </p>
            </div>
          </div>
        </div>

        {/* View mode toggle (All vs Step-by-Step) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium self-start lg:self-center">
          <button
            onClick={() => setActiveStepTab('all')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeStepTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Vue Synthétique (Flux complet)
          </button>
          <div className="h-4 w-px bg-slate-200 mx-0.5" />
          {[1, 2, 3, 4].map(stepNum => (
            <button
              key={stepNum}
              onClick={() => setActiveStepTab(stepNum as 1 | 2 | 3 | 4)}
              className={`px-2.5 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeStepTab === stepNum
                  ? 'bg-amber-500 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Étape {stepNum}
            </button>
          ))}
        </div>
      </div>

      {/* Math Explanation Collapsible Callout */}
      {showMathExplainer && (
        <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl text-xs text-slate-700 space-y-2.5 leading-relaxed">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              La "Magie Mathématique" de Softmax + Entropie Croisée (Cross-Entropy)
            </span>
            <button
              onClick={() => setShowMathExplainer(false)}
              className="text-xs text-amber-700 hover:text-amber-900 cursor-pointer font-medium"
            >
              Fermer ✕
            </button>
          </div>
          <p>
            Dans tous les grands modèles de langage (LLMs comme GPT ou Gemini), la combinaison de la fonction d'activation <strong>Softmax</strong> et de la fonction de perte <strong>Entropie Croisée</strong> (Loss = -sum y_i * ln(p_i)) produit l'une des dérivées les plus élégantes des mathématiques de l'IA :
          </p>
          <div className="p-3 bg-white/90 rounded-lg border border-amber-200 font-mono text-center text-xs text-amber-950 font-bold">
            Gradient = ∂Loss / ∂zᵢ = pᵢ - yᵢ
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-600">
            <li className="p-2 bg-white/60 rounded border border-amber-100">
              <strong className="text-emerald-700 block">1. Pour le mot cible (y = 1) :</strong>
              Gradient = p - 1 &le; 0 (négatif). En soustrayant le gradient (-η × grad), le logit <strong>augmente</strong> !
            </li>
            <li className="p-2 bg-white/60 rounded border border-amber-100">
              <strong className="text-rose-700 block">2. Pour les autres mots (y = 0) :</strong>
              Gradient = p - 0 &ge; 0 (positif). En soustrayant le gradient (-η × grad), leurs logits <strong>diminuent</strong> !
            </li>
          </ul>
        </div>
      )}

      {/* Control Toolbar: Target Selection & Learning Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl items-center">
        {/* Left: Target Token Selector */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <span>🎯 Mot Cible Attendu dans le dataset (Vérité Terrain · $y=1$) :</span>
            </label>
            <span className="text-[11px] text-slate-500 font-mono">
              Contexte : « {activeContextTokens.map(t => t.text).join(' ')} »
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {displayCandidates.map(cand => {
              const isSelected = cand.id === targetCandidate.id;
              return (
                <button
                  key={cand.id}
                  onClick={() => {
                    setSelectedTargetId(cand.id);
                    setStepSimulated(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-500 text-white border-amber-600 shadow-xs font-bold ring-2 ring-amber-300'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300 hover:bg-amber-50/40'
                  }`}
                >
                  <span>{cand.text}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-amber-100' : 'text-slate-400'}`}>
                    ({Math.round(cand.probability * 100)}%)
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Learning Rate & Simulation Trigger */}
        <div className="lg:col-span-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 lg:pt-0 lg:border-l lg:border-slate-200 lg:pl-4">
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-slate-400" />
                <span>Taux (Learning Rate η) :</span>
              </span>
              <span className="font-mono font-bold text-amber-700 tabular-nums">
                {learningRate.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.6"
              step="0.05"
              value={learningRate}
              onChange={e => {
                setLearningRate(parseFloat(e.target.value));
                setStepSimulated(false);
              }}
              className="w-full accent-amber-500 cursor-pointer h-1.5"
            />
          </div>

          <button
            onClick={() => setStepSimulated(!stepSimulated)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs shrink-0 ${
              stepSimulated
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-amber-500 text-white hover:bg-amber-600'
            }`}
          >
            {stepSimulated ? (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Réinitialiser</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Simuler 1 Pas SGD</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4-STAGE PIPELINE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* STAGE 1: FORWARD PASS */}
        {(activeStepTab === 'all' || activeStepTab === 1) && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  Étape 1 · Forward
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Passe Avant</span>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-900">
                  Logits & Softmax (P)
                </h3>
                <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                  Le réseau produit des scores bruts $z$ convertis en probabilités $p$.
                </p>
              </div>

              {/* Candidates list with raw logit & probability */}
              <div className="space-y-1.5 pt-1">
                {displayCandidates.slice(0, 4).map(c => {
                  const isTarget = c.id === targetCandidate.id;
                  return (
                    <div
                      key={c.id}
                      className={`p-1.5 rounded border text-xs font-mono flex items-center justify-between ${
                        isTarget
                          ? 'bg-amber-50 border-amber-300 font-bold'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-800">{c.text}</span>
                        {isTarget && <span className="text-[9px] text-amber-700">🎯</span>}
                      </div>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="text-slate-400">z={c.rawLogit}</span>
                        <span className="font-bold text-indigo-600">
                          {Math.round(c.probability * 100)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-2 bg-indigo-50/60 rounded border border-indigo-100 text-[10px] text-indigo-900 font-mono">
              p_cible = {Math.round(pTarget * 100)}% ({pTarget.toFixed(3)})
            </div>
          </div>
        )}

        {/* STAGE 2: TARGET & LOSS (CROSS-ENTROPY) */}
        {(activeStepTab === 'all' || activeStepTab === 2) && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  Étape 2 · Perte (Loss)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Entropie Croisée</span>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-900">
                  Calcul de la Perte (L)
                </h3>
                <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                  Mesure la surprise face au mot réel « <strong>{targetCandidate.text}</strong> ».
                </p>
              </div>

              {/* Loss Box & Formula */}
              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2 text-center">
                <div className="text-[11px] font-mono text-slate-500">
                  Loss = -ln(p_cible)
                </div>
                <div className="text-2xl font-black font-mono text-rose-600 tabular-nums">
                  {initialLoss}
                </div>
                <div className="text-[10px] text-slate-400">
                  {initialLoss < 0.5
                    ? '🟢 Faible erreur (Le modèle prédisait déjà bien)'
                    : initialLoss < 1.5
                    ? '🟠 Erreur modérée (Ajustement nécessaire)'
                    : '🔴 Forte erreur (Surprise maximale)'}
                </div>
              </div>
            </div>

            <div className="p-2 bg-rose-50/60 rounded border border-rose-100 text-[10px] text-rose-900 font-mono text-center">
              Vecteur cible Y : [..., 1.0, ...]
            </div>
          </div>
        )}

        {/* STAGE 3: BACKWARD & GRADIENT */}
        {(activeStepTab === 'all' || activeStepTab === 3) && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Étape 3 · Backward
                </span>
                <span className="text-[10px] text-slate-400 font-mono">∂Loss / ∂z</span>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-900">
                  Gradients : (p - y)
                </h3>
                <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                  Indique le sens et la force de la correction pour chaque logit.
                </p>
              </div>

              {/* Gradient indicators */}
              <div className="space-y-1.5 pt-1">
                {gradientsData.slice(0, 4).map(g => {
                  const isNegative = g.gradient < 0; // target token
                  return (
                    <div
                      key={g.id}
                      className={`p-1.5 rounded border text-xs font-mono flex items-center justify-between ${
                        isNegative
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                          : 'bg-rose-50/60 border-rose-200 text-rose-900'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">{g.text}</span>
                        <span className="text-[10px]">
                          (y={g.targetValue})
                        </span>
                      </div>
                      <div className="flex items-center gap-1 font-bold">
                        <span>{g.gradient > 0 ? `+${g.gradient}` : g.gradient}</span>
                        {isNegative ? (
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-2 bg-amber-50/70 rounded border border-amber-200 text-[10px] text-amber-950 font-mono text-center">
              Vert = À Booster ⬆ · Rouge = À Réduire ⬇
            </div>
          </div>
        )}

        {/* STAGE 4: WEIGHT UPDATE & COMPARISON */}
        {(activeStepTab === 'all' || activeStepTab === 4) && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Étape 4 · Update
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Descente SGD</span>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-900">
                  Mise à Jour : W ← W - η · ∇
                </h3>
                <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                  Nouvelle probabilité après la descente de gradient.
                </p>
              </div>

              {/* Before vs After comparison */}
              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Probabilité cible :</span>
                  <div className="flex items-center gap-1.5 font-mono font-bold">
                    <span className="text-slate-400">{Math.round(pTarget * 100)}%</span>
                    <ArrowRight className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700">
                      {targetAfter ? Math.round(targetAfter.newProbability * 100) : 0}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Perte (Loss) :</span>
                  <div className="flex items-center gap-1.5 font-mono font-bold">
                    <span className="text-slate-400">{initialLoss}</span>
                    <ArrowRight className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700">{newLoss}</span>
                  </div>
                </div>

                {/* Reduction badge */}
                <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[11px] text-emerald-700 font-semibold">
                  <span>Gain d'apprentissage :</span>
                  <span>-{lossReduction} Loss</span>
                </div>
              </div>
            </div>

            <div className="p-2 bg-emerald-50/60 rounded border border-emerald-200 text-[10px] text-emerald-900 font-mono text-center">
              ΔLogit = -η · ∇ = -{learningRate} × ({targetAfter?.gradient}) = {targetAfter && targetAfter.deltaLogit > 0 ? `+${targetAfter.deltaLogit}` : targetAfter?.deltaLogit}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Before vs After Visual Distribution Table */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-600" />
              <span>Tableau Comparatif : Répartition des Probabilités (Avant vs Après la Rétropropagation)</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Observez comment l'unique mot cible « {targetCandidate.text} » prend le pas sur les autres tokens sous l'effet du gradient
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1 text-slate-500">
              <span className="w-2.5 h-2.5 rounded bg-slate-300 inline-block" />
              <span>Avant</span>
            </span>
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded bg-emerald-600 inline-block" />
              <span>Après (W - η∇)</span>
            </span>
          </div>
        </div>

        {/* Distribution Rows */}
        <div className="space-y-2 pt-1">
          {updatedProbabilities.map(item => {
            const isTarget = item.id === targetCandidate.id;
            const beforePct = Math.round(item.probability * 100);
            const afterPct = Math.round(item.newProbability * 100);
            const diff = item.probDiffPct;

            return (
              <div
                key={item.id}
                className={`p-2.5 rounded-lg border text-xs transition-all ${
                  isTarget
                    ? 'bg-amber-50/80 border-amber-300 shadow-2xs'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded border font-mono text-[11px] ${getTokenColor(item.id)}`}>
                      {item.text}
                    </span>
                    {isTarget && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-semibold">
                        Cible (y = 1)
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 font-mono">
                      Logit : {item.rawLogit} ➔ {item.updatedLogit} (Δ {item.deltaLogit > 0 ? `+${item.deltaLogit}` : item.deltaLogit})
                    </span>
                  </div>

                  <div className="flex items-center gap-3 font-mono font-semibold">
                    <span className="text-slate-400 tabular-nums">
                      {beforePct}%
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                    <span className={`tabular-nums ${isTarget ? 'text-emerald-700 font-bold' : 'text-slate-700'}`}>
                      {afterPct}%
                    </span>
                    <span className={`text-[11px] tabular-nums ${diff > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                      ({diff > 0 ? `+${diff}%` : `${diff}%`})
                    </span>
                  </div>
                </div>

                {/* Dual Progress Bars */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-slate-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${beforePct}%` }}
                    />
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isTarget ? 'bg-emerald-600' : 'bg-slate-700'
                      }`}
                      style={{ width: `${afterPct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
