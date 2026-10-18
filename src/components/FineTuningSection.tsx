import React, { useState, useMemo } from 'react';
import { ModelWeights, Vocabulary, FineTunePair, Token } from '../types/llm';
import { fineTuneModel, generateTokensSequence } from '../utils/modelEngine';
import { encodePrompt, getTokenColor } from '../utils/tokenizer';
import { Sliders, Sparkles, Play, Check, ArrowRight, GitFork, BookOpen, Layers } from 'lucide-react';

interface FineTuningSectionProps {
  baseModel: ModelWeights;
  vocabulary: Vocabulary;
  contextWindow: number;
  fineTunedModel: ModelWeights | null;
  setFineTunedModel: (m: ModelWeights | null) => void;
  onNavigateToChat: () => void;
}

const DEFAULT_FINETUNE_PAIRS: FineTunePair[] = [
  {
    id: 'ft-1',
    prompt: 'question que mange le renard',
    response: 'le renard mange le fromage',
    category: 'Faits ciblés',
  },
  {
    id: 'ft-2',
    prompt: 'question ou dort le chat',
    response: 'le chat dort sur le coussin',
    category: 'Faits ciblés',
  },
  {
    id: 'ft-3',
    prompt: 'question qui surveille le troupeau',
    response: 'le chien surveille le troupeau',
    category: 'Faits ciblés',
  },
  {
    id: 'ft-4',
    prompt: 'question qui chasse la souris',
    response: 'le chat chasse la souris',
    category: 'Faits ciblés',
  },
];

export const FineTuningSection: React.FC<FineTuningSectionProps> = ({
  baseModel,
  vocabulary,
  contextWindow,
  fineTunedModel,
  setFineTunedModel,
  onNavigateToChat,
}) => {
  const [pairs, setPairs] = useState<FineTunePair[]>(DEFAULT_FINETUNE_PAIRS);
  const [learningRate, setLearningRate] = useState<number>(0.7);
  const [epochs, setEpochs] = useState<number>(4);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainingProgress, setTrainingProgress] = useState<number>(0);
  const [testPrompt, setTestPrompt] = useState<string>('question que mange le');

  // New pair inputs
  const [newPrompt, setNewPrompt] = useState<string>('');
  const [newResponse, setNewResponse] = useState<string>('');

  // Handle fine-tuning action
  const handleRunFineTuning = () => {
    setIsTraining(true);
    setTrainingProgress(0);

    const stepInterval = 200;
    let step = 0;
    const totalSteps = 5;

    const interval = setInterval(() => {
      step++;
      setTrainingProgress(Math.round((step / totalSteps) * 100));

      if (step >= totalSteps) {
        clearInterval(interval);
        const tuned = fineTuneModel(
          baseModel,
          pairs,
          vocabulary,
          contextWindow,
          learningRate,
          epochs
        );
        setFineTunedModel(tuned);
        setIsTraining(false);
        setTrainingProgress(0);
      }
    }, stepInterval);
  };

  const handleAddPair = () => {
    if (!newPrompt.trim() || !newResponse.trim()) return;
    const newEntry: FineTunePair = {
      id: `ft-${Date.now()}`,
      prompt: newPrompt.trim().toLowerCase(),
      response: newResponse.trim().toLowerCase(),
      category: 'Personnalisé',
    };
    setPairs(prev => [...prev, newEntry]);
    setNewPrompt('');
    setNewResponse('');
  };

  const handleDeletePair = (id: string) => {
    setPairs(prev => prev.filter(p => p.id !== id));
  };

  // Generate comparison responses
  const encodedTest = useMemo(() => {
    return encodePrompt(testPrompt, vocabulary);
  }, [testPrompt, vocabulary]);

  const baseGeneration = useMemo(() => {
    return generateTokensSequence(baseModel, vocabulary, encodedTest, contextWindow, 0.4, 10);
  }, [baseModel, vocabulary, encodedTest, contextWindow]);

  const tunedGeneration = useMemo(() => {
    if (!fineTunedModel) return [];
    return generateTokensSequence(fineTunedModel, vocabulary, encodedTest, contextWindow, 0.4, 10);
  }, [fineTunedModel, vocabulary, encodedTest, contextWindow]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
                Apprentissage Spécialisé
              </span>
              <span className="text-xs text-slate-500">
                · Comprendre le Fine-Tuning (Instruction Tuning)
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Le Fine-Tuning : Adapter un Modèle Existant
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed mt-1 max-w-3xl">
              Le <strong>pré-entraînement</strong> apprend les régularités générales de la langue. Le <strong>fine-tuning</strong> prend ce modèle de base déjà fonctionnel et ajuste légèrement ses poids sur des paires <em>« Instruction ➔ Réponse »</em> pour lui apprendre une tâche ou un comportement précis sans devoir tout ré-entraîner de zéro !
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {fineTunedModel && (
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

        {/* 3 Metrics comparison cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Modèle de Base (Pré-entraîné)</span>
            <span className="text-sm font-bold font-mono text-slate-900">
              {baseModel.totalTransitions} transitions de base
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Loss de départ : {baseModel.loss}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Données d'Alignement (Paires)</span>
            <span className="text-sm font-bold font-mono text-purple-700">
              {pairs.length} exemples d'instructions
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Format : Prompt ➔ Réponse</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Statut du Fine-Tuning</span>
            <span className="text-sm font-bold font-mono text-slate-900 flex items-center gap-1.5">
              {fineTunedModel ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-emerald-700">Modèle Aligné Prêt</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-amber-700">En attente d'ajustement</span>
                </>
              )}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {fineTunedModel ? `Nouvelle Loss: ${fineTunedModel.loss}` : 'Cliquez sur Lancer'}
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Zone Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Zone: Fine-Tuning Dataset & Hyperparameters (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Hyperparameters Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-600" />
                <span>Hyperparamètres du Fine-Tuning</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Taux d'apprentissage (LR) :</span>
                  <span className="font-mono font-bold text-purple-700">{learningRate.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={learningRate}
                  onChange={e => setLearningRate(parseFloat(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Contrôle l'intensité du renforcement des poids
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Passes d'entraînement (Époques) :</span>
                  <span className="font-mono font-bold text-purple-700">{epochs}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="1"
                  value={epochs}
                  onChange={e => setEpochs(parseInt(e.target.value, 10))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Nombre de répétitions sur le jeu de données
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleRunFineTuning}
                disabled={isTraining}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isTraining ? 'Ajustement des poids en cours...' : 'Lancer le Fine-Tuning'}</span>
              </button>

              {isTraining && (
                <div className="mt-3 bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-purple-600 h-full transition-all duration-200"
                    style={{ width: `${trainingProgress}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Dataset Pairs List */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Données d'Alignement ({pairs.length} paires)
                </h2>
                <p className="text-xs text-slate-500">
                  Le modèle apprendra spécifiquement à associer ces questions à ces réponses.
                </p>
              </div>
            </div>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {pairs.map((pair, idx) => (
                <div
                  key={pair.id}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-purple-700">
                      Exemple #{idx + 1}
                    </span>
                    <button
                      onClick={() => handleDeletePair(pair.id)}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer text-[10px]"
                    >
                      Supprimer
                    </button>
                  </div>

                  <div className="space-y-1 font-mono text-[11px]">
                    <div className="text-slate-600">
                      <span className="text-slate-400">Prompt : </span>
                      <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-medium text-slate-800">
                        {pair.prompt}
                      </span>
                    </div>
                    <div className="text-slate-600">
                      <span className="text-slate-400">Cible : </span>
                      <span className="bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 font-medium text-purple-900">
                        {pair.response}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add custom pair form */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-xs font-semibold text-slate-800 block">
                Ajouter une nouvelle paire d'alignement :
              </span>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Ex: question que chasse le chat"
                  value={newPrompt}
                  onChange={e => setNewPrompt(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
                <input
                  type="text"
                  placeholder="Ex: le chat chasse la souris dans le pré"
                  value={newResponse}
                  onChange={e => setNewResponse(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
                <button
                  onClick={handleAddPair}
                  disabled={!newPrompt.trim() || !newResponse.trim()}
                  className="px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-md transition-colors cursor-pointer disabled:opacity-50"
                >
                  + Ajouter à l'entraînement
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Zone: Side-by-Side Live Comparison (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Comparatif en Direct : Avant vs Après Fine-Tuning
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Tapez un prompt pour observer comment le fine-tuning a orienté le comportement du modèle.
              </p>
            </div>

            {/* Prompt input */}
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">
                Prompt de test :
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={testPrompt}
                  onChange={e => setTestPrompt(e.target.value)}
                  className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  placeholder="Ex: question que mange le"
                />
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1.5">
                <span>Suggestions :</span>
                {['question que mange le', 'question ou dort le', 'question qui chasse'].map(seed => (
                  <button
                    key={seed}
                    onClick={() => setTestPrompt(seed)}
                    className="underline hover:text-purple-600 cursor-pointer"
                  >
                    "{seed}"
                  </button>
                ))}
              </div>
            </div>

            {/* Side-by-side results */}
            <div className="grid grid-cols-1 gap-3 pt-2">
              {/* Box A: Base Model */}
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    <span>Modèle de Base (Non fine-tuné)</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Complétion brute</span>
                </div>

                <div className="text-xs font-mono text-slate-800 bg-white p-2.5 rounded border border-slate-200 leading-relaxed min-h-12">
                  <span className="text-slate-400">{testPrompt} </span>
                  <span className="font-semibold text-slate-900">
                    {baseGeneration.map(t => t.text).join(' ')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Le modèle de base continue la phrase au hasard des fréquences générales de son corpus sans chercher à répondre à la question.
                </p>
              </div>

              {/* Box B: Fine-Tuned Model */}
              <div className="p-3.5 rounded-lg border border-purple-200 bg-purple-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-purple-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-600" />
                    <span>Modèle Fine-Tuné (Spécialisé)</span>
                  </span>
                  <span className="text-[10px] text-purple-700 font-mono">Comportement ciblé</span>
                </div>

                <div className="text-xs font-mono text-purple-950 bg-white p-2.5 rounded border border-purple-200 leading-relaxed min-h-12">
                  <span className="text-slate-400">{testPrompt} </span>
                  {fineTunedModel ? (
                    <span className="font-bold text-purple-700">
                      {tunedGeneration.map(t => t.text).join(' ')}
                    </span>
                  ) : (
                    <span className="text-slate-400 italic font-sans text-xs">
                      Cliquez sur "Lancer le Fine-Tuning" à gauche pour générer ce résultat...
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-purple-800">
                  {fineTunedModel
                    ? 'Le modèle a ajusté ses poids de transition pour privilégier la réponse demandée par les exemples !'
                    : 'Les poids de ce modèle seront ajustés pour privilégier la réponse cible.'}
                </p>
              </div>
            </div>
          </div>

          {/* Educational Insight Card */}
          <div className="bg-slate-900 text-white rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-purple-400">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs font-semibold tracking-wide uppercase">
                Ce qu'il faut comprendre
              </span>
            </div>
            <h4 className="text-sm font-semibold text-white">
              Pourquoi le Fine-Tuning est-il utile ?
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Avant le fine-tuning par instructions (ex: InstructGPT), un modèle comme GPT-3 ne répondait pas aux questions : si vous écriviez <em>"Quelle est la capitale de la France ?"</em>, il pouvait continuer par <em>"2. Quelle est la capitale de l'Espagne ?"</em> comme dans un manuel scolaire !
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Le fine-tuning lui apprend le <strong>rôle d'un assistant serviable</strong> sans avoir besoin de réapprendre la grammaire et le vocabulaire depuis le début.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
