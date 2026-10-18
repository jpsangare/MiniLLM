import React, { useState } from 'react';
import { ModelWeights, Vocabulary } from '../types/llm';
import { getTokenColor } from '../utils/tokenizer';
import {
  Activity,
  Play,
  ArrowRight,
  Layers,
  Database,
  Download,
  FileJson,
  Check,
  Copy,
  X,
  FileCode,
  Sparkles,
} from 'lucide-react';

interface ModelWeightsSectionProps {
  model: ModelWeights;
  vocabulary: Vocabulary;
  contextWindow: number;
  setContextWindow: (w: number) => void;
  onNavigateToInference: () => void;
  onRetrain: (epochs: number) => void;
  isTraining: boolean;
  trainingProgress: number; // 0 to 100
}

export const ModelWeightsSection: React.FC<ModelWeightsSectionProps> = ({
  model,
  vocabulary,
  contextWindow,
  setContextWindow,
  onNavigateToInference,
  onRetrain,
  isTraining,
  trainingProgress,
}) => {
  const [selectedContextKey, setSelectedContextKey] = useState<string>('');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Extract all available contexts in model
  const contextKeys = Array.from(model.contextTransitions.keys());

  // Default selection if none or invalid
  const currentKey = selectedContextKey && model.contextTransitions.has(selectedContextKey)
    ? selectedContextKey
    : contextKeys[0] || '';

  const activeTransitions = model.contextTransitions.get(currentKey) || [];
  const currentTotal = model.contextTotalCounts.get(currentKey) || 1;

  // Format context label for humans
  const formatContextLabel = (key: string) => {
    if (!key) return '';
    const ids = key.split(',').map(Number);
    return ids
      .map(id => vocabulary.idToToken.get(id) || `<${id}>`)
      .join(' ');
  };

  // Generate complete structured JSON representing the model weights & vocabulary
  const generateWeightsJson = () => {
    const weightsMatrix = Array.from(model.contextTransitions.entries()).map(
      ([contextKey, transitions]) => {
        const contextIds = contextKey.split(',').map(Number);
        const contextWords = contextIds.map(
          id => vocabulary.idToToken.get(id) || `<${id}>`
        );
        const totalOccurrences = model.contextTotalCounts.get(contextKey) || 0;

        return {
          contextKey,
          contextIds,
          contextWords: contextWords.join(' '),
          totalOccurrences,
          transitions: transitions.map(tr => ({
            targetId: tr.targetId,
            targetWord: tr.targetText,
            count: tr.count,
            probability: Number(tr.probability.toFixed(4)),
            percentage: Number((tr.probability * 100).toFixed(2)),
          })),
        };
      }
    );

    const exportData = {
      format: 'Educational-LLM-Weights-v1',
      metadata: {
        exportedAt: new Date().toISOString(),
        modelType: 'Autoregressive N-Gram Language Model',
        contextWindowTokens: contextWindow,
        contextWindowType: contextWindow === 1 ? 'Bigram' : contextWindow === 2 ? 'Trigram' : `${contextWindow}-gram`,
        vocabularySize: vocabulary.tokens.length,
        totalTransitionsLearned: model.totalTransitions,
        distinctContextsCount: model.contextTransitions.size,
        loss: model.loss,
        epochs: model.epochs,
      },
      vocabulary: vocabulary.tokens.map(t => ({
        id: t.id,
        text: t.text,
        isSpecial: t.text.startsWith('<') && t.text.endsWith('>'),
      })),
      weightsMatrix,
    };

    return JSON.stringify(exportData, null, 2);
  };

  const getExportFileName = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    return `modele_poids_ctx${contextWindow}_loss${model.loss.toFixed(2)}_${timestamp}.json`;
  };

  // Download the JSON file
  const handleDownloadJson = () => {
    const jsonString = generateWeightsJson();
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', getExportFileName());
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copy to clipboard
  const handleCopyJson = async () => {
    const jsonString = generateWeightsJson();
    try {
      await navigator.clipboard.writeText(jsonString);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  // Calculate approximate file size
  const exportPayloadString = React.useMemo(() => generateWeightsJson(), [model, vocabulary, contextWindow]);
  const estimatedSizeKb = (new TextEncoder().encode(exportPayloadString).length / 1024).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Banner with Stats & Direct Export Action */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="max-w-3xl">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
              Étape 2 : L'Entraînement et la Matrice des Poids
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed">
              Pendant l'entraînement, le modèle lit les données des millions de fois pour apprendre <strong>la probabilité de chaque mot suivant étant donné un contexte</strong>. Dans un grand LLM, ces probabilités sont stockées sous forme de milliards de paramètres numériques (les <em>poids</em> des couches neuronales et d'attention).
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
              <span className="font-mono tabular-nums">{model.totalTransitions} transitions apprises</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{model.contextTransitions.size} contextes distincts</span>
              <span aria-hidden="true">·</span>
              <span>Perte (Loss) : <strong className="font-mono tabular-nums text-indigo-700">{model.loss}</strong></span>
              <span aria-hidden="true">·</span>
              <span>Époques : <strong className="font-mono tabular-nums text-slate-700">{model.epochs}</strong></span>
            </div>
          </div>

          {/* Quick Export CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 self-start lg:self-center shrink-0">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer shadow-xs"
              title="Aperçu interactif et structure du JSON"
            >
              <FileJson className="w-4 h-4 text-indigo-600" />
              <span>Aperçu JSON</span>
            </button>
            <button
              onClick={handleDownloadJson}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shadow-xs"
              title="Télécharger directement le fichier JSON des poids"
            >
              <Download className="w-4 h-4" />
              <span>Exporter les Poids (.json)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Zone Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Zone: Interactive Weights Matrix & Training Dashboard (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Training Controls Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Paramètres de l'entraînement
                </h2>
                <p className="text-xs text-slate-500">
                  Ajustez la taille du contexte et lancez des passes d'apprentissage (époques).
                </p>
              </div>

              {/* Context Window Selector */}
              <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg text-xs font-medium">
                <span className="text-slate-500 px-2">Contexte :</span>
                <button
                  onClick={() => setContextWindow(1)}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    contextWindow === 1
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Le modèle ne regarde que le dernier mot"
                >
                  1 token (Bigramme)
                </button>
                <button
                  onClick={() => setContextWindow(2)}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    contextWindow === 2
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Le modèle observe les deux derniers mots"
                >
                  2 tokens (Trigramme)
                </button>
              </div>
            </div>

            {/* Run Epochs Button */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => onRetrain(5)}
                disabled={isTraining}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isTraining ? 'Entraînement en cours...' : 'Entraîner le modèle (5 époques)'}</span>
              </button>

              {isTraining && (
                <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full transition-all duration-200"
                    style={{ width: `${trainingProgress}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Context Explorer & Distribution Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Visualisation des Poids : P(Token suivant | Contexte)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sélectionnez un contexte dans la liste pour observer la distribution de probabilités apprise par le modèle.
                </p>
              </div>

              {/* Small fast export link */}
              <button
                onClick={handleDownloadJson}
                className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Télécharger JSON</span>
              </button>
            </div>

            {/* Context Pills Grid */}
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1.5 block">
                Contextes appris dans vos données ({contextKeys.length}) :
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 border border-slate-100 rounded-lg bg-slate-50">
                {contextKeys.map(key => {
                  const isSelected = key === currentKey;
                  const label = formatContextLabel(key);
                  const count = model.contextTotalCounts.get(key) || 0;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedContextKey(key)}
                      className={`px-2.5 py-1 text-xs rounded-md border font-mono transition-colors cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs font-semibold'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span>{label}</span>
                      <span className={`text-[10px] tabular-nums ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                        ({count})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Distribution Graph for selected Context */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                  <span>Après le contexte :</span>
                  <span className="font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    "{formatContextLabel(currentKey)}"
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono tabular-nums">
                  Total occurrences : {currentTotal}
                </span>
              </div>

              {activeTransitions.length === 0 ? (
                <div className="text-xs text-slate-400 italic py-4 text-center">
                  Aucune transition enregistrée.
                </div>
              ) : (
                <div className="space-y-2">
                  {activeTransitions.map(tr => {
                    const pct = Math.round(tr.probability * 100);
                    return (
                      <div key={tr.targetId} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded border text-[11px] font-mono ${getTokenColor(tr.targetId)}`}>
                              {tr.targetText}
                            </span>
                            <span className="text-slate-400 text-[11px] font-mono tabular-nums">
                              (vu {tr.count} fois)
                            </span>
                          </div>
                          <span className="font-mono font-semibold text-slate-800 tabular-nums">
                            {pct}% ({tr.probability.toFixed(3)})
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom action button */}
            <div className="pt-3 flex items-center justify-between border-t border-slate-100">
              <span className="text-xs text-slate-500">
                Passez au laboratoire pour tester la génération
              </span>
              <button
                onClick={onNavigateToInference}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer shadow-xs"
              >
                <span>Tester la génération de texte</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Zone: Export Card & Concept Deck (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card: Exporting Model Checkpoints */}
          <div className="bg-gradient-to-br from-indigo-50/70 to-purple-50/70 border border-indigo-200/80 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <FileCode className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Exportation des Poids (Checkpoints)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Format universel JSON standard
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200">
                ~{estimatedSizeKb} Ko
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Dans l'écosystème d'IA moderne (Hugging Face, PyTorch, Safetensors), un <strong>checkpoint</strong> sauvegarde les poids entraînés pour pouvoir déployer le modèle, reprendre l'entraînement ou effectuer du fine-tuning.
            </p>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-white/80 rounded-lg border border-indigo-100">
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Contextes</span>
                <span className="font-mono font-bold text-slate-800">{model.contextTransitions.size}</span>
              </div>
              <div className="p-2.5 bg-white/80 rounded-lg border border-indigo-100">
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Transitions</span>
                <span className="font-mono font-bold text-slate-800">{model.totalTransitions}</span>
              </div>
            </div>

            {/* Export buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleDownloadJson}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Télécharger .JSON</span>
              </button>
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <FileJson className="w-3.5 h-3.5 text-indigo-600" />
                <span>Inspecter</span>
              </button>
            </div>
          </div>

          {/* Concept 1: What is a weight? */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-600" />
              <span>Qu'est-ce qu'un "Poids" dans un LLM ?</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dans notre modèle minimal, un "poids" est directement la <strong>force d'association statistique</strong> entre un contexte donné et le mot suivant.
            </p>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs text-slate-800 leading-relaxed">
              P(mot | contexte) = Nombre d'apparitions / Total du contexte
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Dans un véritable réseau de neurones Transformer (comme GPT ou Gemini), ces poids sont des matrices de nombres flottants ajustés par descente de gradient, représentant l'importance de chaque mot par rapport à tous les autres (l'<strong>Attention</strong>).
            </p>
          </div>

          {/* Concept 2: Loss & Convergence */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              <span>La Fonction de Perte (Loss)</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              La <em>Loss</em> (entropie croisée) mesure à quel point le modèle est surpris par les vrais mots du texte.
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li><strong>Loss élevée :</strong> Le modèle hésite entre tous les mots de manière désordonnée.</li>
              <li><strong>Loss basse :</strong> Le modèle prédit avec précision les motifs récurrents des données d'entraînement.</li>
            </ul>
          </div>

          {/* Concept 3: Context Window */}
          <div className="bg-slate-900 text-white rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-indigo-400">
              <Layers className="w-4 h-4" />
              <span className="text-xs font-semibold tracking-wide uppercase">
                Fenêtre de contexte
              </span>
            </div>
            <h4 className="text-sm font-semibold text-white">
              1 token vs 2 tokens : Pourquoi c'est crucial
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Avec <strong>1 token</strong> de mémoire, le mot <em>"le"</em> peut être suivi de <em>"chat"</em>, <em>"loup"</em>, <em>"fromage"</em> au hasard.
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Avec <strong>2 tokens</strong> (ex: <em>"mange le"</em>), le modèle peut favoriser <em>"fromage"</em> car la paire est fréquente dans le corpus ! C'est le principe fondamental de la fenêtre de contexte des LLM.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive JSON Inspection & Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <FileJson className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>Export des Poids du Modèle</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                      {getExportFileName()}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Structure complète : métadonnées, vocabulaire ({vocabulary.tokens.length} tokens) et matrice de transition
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsExportModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                title="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Specs Bar */}
            <div className="px-6 py-2.5 bg-slate-100/70 border-b border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
              <div className="flex items-center gap-4 font-mono text-[11px]">
                <span>Taille estimée : <strong>{estimatedSizeKb} Ko</strong></span>
                <span>•</span>
                <span>Contextes : <strong>{model.contextTransitions.size}</strong></span>
                <span>•</span>
                <span>Perte (Loss) : <strong>{model.loss}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyJson}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-green-700 font-semibold">Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copier le JSON</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownloadJson}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger</span>
                </button>
              </div>
            </div>

            {/* Code Preview Box */}
            <div className="p-4 flex-1 overflow-y-auto bg-slate-900 text-slate-200 font-mono text-xs leading-relaxed select-text">
              <pre className="whitespace-pre overflow-x-auto">
                <code>{exportPayloadString}</code>
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Ce fichier JSON peut être importé dans d'autres scripts d'inférence ou d'analyse statistique.</span>
              </span>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
