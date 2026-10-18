import React, { useState, useMemo } from 'react';
import { ModelWeights, Vocabulary, TokenEmbedding2D, SerializedModel } from '../types/llm';
import { computeTokenEmbeddings2D, serializeModel } from '../utils/modelEngine';
import { getTokenColor } from '../utils/tokenizer';
import {
  Cpu,
  Database,
  Download,
  Copy,
  Check,
  Code2,
  Share2,
  Layers,
  ArrowRight,
  Sparkles,
  Info,
  Maximize2
} from 'lucide-react';

interface ModelOverviewSectionProps {
  model: ModelWeights;
  vocabulary: Vocabulary;
  sentences: string[][];
  contextWindow: number;
  onNavigateToInference: () => void;
  onNavigateToMatrix: () => void;
}

export const ModelOverviewSection: React.FC<ModelOverviewSectionProps> = ({
  model,
  vocabulary,
  sentences,
  contextWindow,
  onNavigateToInference,
  onNavigateToMatrix,
}) => {
  const [activePipelineStep, setActivePipelineStep] = useState<number>(2);
  const [selectedTokenHover, setSelectedTokenHover] = useState<TokenEmbedding2D | null>(null);
  const [clusterFilter, setClusterFilter] = useState<string>('all');
  const [copiedJson, setCopiedJson] = useState(false);
  const [viewMode, setViewMode] = useState<'architecture' | 'embeddings' | 'json' | 'python'>('architecture');

  // Compute 2D embeddings
  const embeddings = useMemo(() => {
    return computeTokenEmbeddings2D(sentences, vocabulary);
  }, [sentences, vocabulary]);

  // Serialized model JSON
  const serializedModel: SerializedModel = useMemo(() => {
    return serializeModel(model, vocabulary, contextWindow);
  }, [model, vocabulary, contextWindow]);

  const jsonString = useMemo(() => {
    return JSON.stringify(serializedModel, null, 2);
  }, [serializedModel]);

  // Estimated memory size (in KB)
  const memorySizeKb = (new Blob([jsonString]).size / 1024).toFixed(1);

  // Clusters list
  const clusters = useMemo(() => {
    const set = new Set(embeddings.map(e => e.cluster));
    return Array.from(set);
  }, [embeddings]);

  const filteredEmbeddings = useMemo(() => {
    if (clusterFilter === 'all') return embeddings;
    return embeddings.filter(e => e.cluster === clusterFilter);
  }, [embeddings, clusterFilter]);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mini-llm-model-${model.vocabSize}tokens.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Pipeline architecture definitions
  const pipelineSteps = [
    {
      id: 1,
      title: '1. Tokeniseur & Vocabulaire',
      subtitle: `Dictionnaire de ${vocabulary.tokens.length} tokens`,
      detail: 'Reçoit le texte brut de l\'utilisateur et le convertit en séquence d\'entiers numériques (Token IDs). Chaque mot et balise a une clé unique.',
      metric: `${vocabulary.tokens.length} IDs indexés`,
    },
    {
      id: 2,
      title: '2. Encodage & Fenêtre de Contexte',
      subtitle: `Mémoire de ${contextWindow} token(s)`,
      detail: `${contextWindow === 1 ? 'Agrège le dernier token observé' : `Agrège les ${contextWindow} derniers tokens observés`} pour former la clé de contexte active. C'est l'équivalent du buffer d'entrée du mécanisme d'attention.`,
      metric: `${model.contextTransitions.size} contextes appris`,
    },
    {
      id: 3,
      title: '3. Tenseur des Poids (Transitions)',
      subtitle: `${model.totalTransitions} poids conditionnels`,
      detail: 'Table multidimensionnelle associant chaque contexte aux fréquences observées dans le corpus. Représente le savoir acquis lors de l\'apprentissage.',
      metric: `Loss: ${model.loss} · PPL: ${serializedModel.meta.perplexity}`,
    },
    {
      id: 4,
      title: '4. Couche Softmax & Température',
      subtitle: 'Normalisation probabiliste',
      detail: 'Applique la fonction Softmax aux logits avec le paramètre de température Tau. Transforme les scores bruts en probabilités sommant exactement à 100%.',
      metric: 'Distribution normalisée',
    },
    {
      id: 5,
      title: '5. Moteur d\'Échantillonnage',
      subtitle: 'Tirage autorégressif',
      detail: 'Sélectionne probabilistiquement le token suivant (Greedy ou Roulette multinominale) et le réinjecte à l\'entrée pour continuer la génération.',
      metric: 'Prochain mot prédit',
    },
  ];

  // Python inference snippet
  const pythonSnippet = `# Code minimal d'inférence en Python pour faire tourner CE modèle :
import json, random, math

# 1. Charger les poids de votre modèle exporté
with open('mini-llm-model.json', 'r', encoding='utf-8') as f:
    model = json.load(f)

weights = model['weights']
temperature = 0.8

def predict_next(context_words):
    # Clé de contexte (IDs séparés par virgule)
    # Ici on cherche dans la table de transitions
    for key, transitions in weights.items():
        # Exemple de sélection par softmax avec température
        probs = [math.exp(math.log(max(t['prob'], 1e-4)) / temperature) for t in transitions]
        total = sum(probs)
        normalized = [p / total for p in probs]
        chosen = random.choices(transitions, weights=normalized)[0]
        return chosen['token']
    return "<FIN>"

print("Modèle prêt ! Vocabulaire:", model['meta']['vocabSize'], "tokens")
`;

  return (
    <div className="space-y-6">
      {/* Top Banner & Model Identity Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                MiniLLM-FR-v1
              </span>
              <span className="text-xs text-slate-500">
                · Modèle Autorégressif à Attention Contextuelle
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Fiche d'Identité & Architecture du Modèle
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed mt-1 max-w-2xl">
              Inspectez la structure complète de votre modèle de langage : ses couches internes, ses paramètres entraînés, son espace sémantique 2D et son fichier de poids sérialisé.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadJson}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
              title="Télécharger le fichier de modèle JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exporter (JSON)</span>
            </button>
            <button
              onClick={onNavigateToInference}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer shadow-xs"
            >
              <span>Tester le modèle</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 5 Key Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Taille du Vocabulaire</span>
            <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">
              {vocabulary.tokens.length}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">tokens uniques</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Poids Conditionnels</span>
            <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">
              {model.totalTransitions}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">transitions apprises</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Perte (Loss)</span>
            <span className="text-lg font-bold font-mono text-indigo-700 tabular-nums">
              {model.loss}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">entropie croisée</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Perplexité (PPL)</span>
            <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">
              {serializedModel.meta.perplexity}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">e^(loss) théorique</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Poids Mémoire</span>
            <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">
              {memorySizeKb} <span className="text-xs font-normal text-slate-500">Ko</span>
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">format JSON sérialisé</span>
          </div>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg w-fit text-xs font-medium">
        <button
          onClick={() => setViewMode('architecture')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            viewMode === 'architecture'
              ? 'bg-slate-100 text-slate-900 font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Pipeline & Architecture
        </button>
        <button
          onClick={() => setViewMode('embeddings')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            viewMode === 'embeddings'
              ? 'bg-slate-100 text-slate-900 font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Espace Sémantique 2D (Embeddings)
        </button>
        <button
          onClick={() => setViewMode('json')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            viewMode === 'json'
              ? 'bg-slate-100 text-slate-900 font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Fichier de Modèle (model.json)
        </button>
        <button
          onClick={() => setViewMode('python')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            viewMode === 'python'
              ? 'bg-slate-100 text-slate-900 font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Script d'Inférence Python
        </button>
      </div>

      {/* VIEW 1: Interactive Pipeline Flow */}
      {viewMode === 'architecture' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Sequential Modules List */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Pipeline de Calcul Interne du LLM
                </h2>
                <p className="text-xs text-slate-500">
                  Cliquez sur un bloc pour inspecter son rôle et ses données.
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {pipelineSteps.map((step, idx) => {
                const isSelected = activePipelineStep === step.id;
                return (
                  <div
                    key={step.id}
                    onClick={() => setActivePipelineStep(step.id)}
                    className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-xs font-bold ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {step.id}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-900">
                            {step.title}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {step.subtitle}
                          </div>
                        </div>
                      </div>

                      <span className="text-[11px] font-mono font-medium text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {step.metric}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-indigo-100 text-xs text-slate-700 leading-relaxed">
                        {step.detail}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Technical Inspector for the active block */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 text-white rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-indigo-400">
                <Cpu className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Détail du composant #{activePipelineStep}
                </span>
              </div>

              <div>
                <h3 className="text-base font-semibold text-white">
                  {pipelineSteps.find(s => s.id === activePipelineStep)?.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mt-1">
                  {pipelineSteps.find(s => s.id === activePipelineStep)?.detail}
                </p>
              </div>

              {activePipelineStep === 1 && (
                <div className="bg-slate-800 rounded-lg p-3 text-xs space-y-2">
                  <span className="text-slate-400 text-[11px] block">Extrait de l'index des IDs :</span>
                  <div className="flex flex-wrap gap-1">
                    {vocabulary.tokens.slice(0, 10).map(t => (
                      <span key={t.id} className="font-mono text-[10px] bg-slate-700 px-1.5 py-0.5 rounded">
                        {t.text} ({t.id})
                      </span>
                    ))}
                    <span className="text-slate-500 text-[10px] self-center">...</span>
                  </div>
                </div>
              )}

              {activePipelineStep === 2 && (
                <div className="bg-slate-800 rounded-lg p-3 text-xs space-y-1.5">
                  <span className="text-slate-400 text-[11px] block">Taille de fenêtre actuelle :</span>
                  <div className="font-mono text-indigo-300 text-sm font-semibold">
                    {contextWindow} token(s) de contexte glissant
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Plus la fenêtre est grande, plus le modèle retient la cohérence globale du sujet.
                  </p>
                </div>
              )}

              {activePipelineStep === 3 && (
                <div className="bg-slate-800 rounded-lg p-3 text-xs space-y-2">
                  <div className="flex justify-between text-[11px] text-slate-300">
                    <span>Contextes distincts :</span>
                    <span className="font-mono font-semibold">{model.contextTransitions.size}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-300">
                    <span>Total transitions apprises :</span>
                    <span className="font-mono font-semibold">{model.totalTransitions}</span>
                  </div>
                  <button
                    onClick={onNavigateToMatrix}
                    className="w-full text-center text-xs font-medium text-indigo-300 hover:text-white bg-slate-700 py-1.5 rounded transition-colors mt-2 cursor-pointer"
                  >
                    Explorer la matrice complète ➔
                  </button>
                </div>
              )}

              {activePipelineStep === 4 && (
                <div className="bg-slate-800 rounded-lg p-3 text-xs font-mono text-slate-300 space-y-1">
                  <span className="text-slate-400 text-[11px] block">Formule Softmax :</span>
                  <div className="text-indigo-300">P(w_i) = exp(z_i / Tau) / Sum(exp(z_j / Tau))</div>
                  <p className="text-[11px] text-slate-400 pt-1 font-sans">
                    La température Tau contrôle la dispersion de l'entropie.
                  </p>
                </div>
              )}

              {activePipelineStep === 5 && (
                <div className="bg-slate-800 rounded-lg p-3 text-xs space-y-2">
                  <span className="text-slate-300 text-[11px] block">Mode autorégressif :</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Le token prédit est concaténé à la séquence existante pour devenir le contexte du tour suivant, jusqu'à la balise <code>&lt;FIN&gt;</code>.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Action */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <h4 className="text-xs font-semibold text-slate-900">
                Action Recommandée
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Visualisez la carte des relations sémantiques formées entre les mots dans vos données.
              </p>
              <button
                onClick={() => setViewMode('embeddings')}
                className="w-full text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Ouvrir la Carte 2D des Embeddings ➔
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: 2D Embeddings Semantic Map */}
      {viewMode === 'embeddings' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Projection 2D des Embeddings Sémantiques
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Chaque point représente un mot. Les mots qui apparaissent dans des contextes similaires se regroupent naturellement par similarité statistique !
              </p>
            </div>

            {/* Cluster Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400">Filtrer :</span>
              <select
                value={clusterFilter}
                onChange={e => setClusterFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="all">Tous les groupes ({embeddings.length})</option>
                {clusters.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Interactive 2D Coordinate Canvas */}
          <div className="relative w-full h-96 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 select-none">
            {/* Background grid lines */}
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-10 pointer-events-none">
              {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className="border border-slate-500" />
              ))}
            </div>

            {/* Axis labels */}
            <div className="absolute bottom-2 right-3 text-[10px] font-mono text-slate-500 pointer-events-none">
              Axe 1 : Rôle Syntaxique (Sujet ↔ Prédicat)
            </div>
            <div className="absolute top-2 left-3 text-[10px] font-mono text-slate-500 pointer-events-none">
              Axe 2 : Voisinage Contextuel
            </div>

            {/* Render Token Nodes */}
            {filteredEmbeddings.map(tok => {
              const isSelected = selectedTokenHover?.id === tok.id;
              return (
                <button
                  key={tok.id}
                  onClick={() => setSelectedTokenHover(tok)}
                  onMouseEnter={() => setSelectedTokenHover(tok)}
                  style={{
                    left: `${tok.x}%`,
                    top: `${tok.y}%`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 rounded-md text-[11px] font-mono transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-500 text-white ring-2 ring-white z-20 scale-125 font-bold shadow-lg'
                      : 'bg-slate-800/90 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700 z-10'
                  }`}
                  title={`${tok.text} | Groupe: ${tok.cluster}`}
                >
                  {tok.text}
                </button>
              );
            })}

            {/* Hover details floating overlay */}
            {selectedTokenHover && (
              <div className="absolute bottom-4 left-4 bg-slate-800/95 border border-slate-700 p-3 rounded-lg text-white text-xs max-w-xs shadow-xl pointer-events-none">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-indigo-400 text-sm">
                    "{selectedTokenHover.text}"
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ID #{selectedTokenHover.id}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300">
                  Groupe : <strong>{selectedTokenHover.cluster}</strong>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Fréquence corpus : {selectedTokenHover.frequency} fois · Coordonnées ({selectedTokenHover.x}, {selectedTokenHover.y})
                </div>
              </div>
            )}
          </div>

          {/* Cluster Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-2 border-t border-slate-100">
            <span className="font-semibold text-slate-800">Familles repérées :</span>
            {clusters.map(cluster => (
              <span key={cluster} className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500/80 inline-block" />
                <span>{cluster}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: Serialized Model File (JSON) */}
      {viewMode === 'json' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Fichier de Poids Sérialisé (model.json)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Structure exportable contenant la configuration, le vocabulaire et les matrices de transitions du modèle.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyJson}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedJson ? 'Copié !' : 'Copier'}</span>
              </button>
              <button
                onClick={handleDownloadJson}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Télécharger</span>
              </button>
            </div>
          </div>

          <pre className="bg-slate-900 text-slate-200 p-4 rounded-lg font-mono text-xs max-h-96 overflow-y-auto leading-relaxed border border-slate-800">
            {jsonString}
          </pre>
        </div>
      )}

      {/* VIEW 4: Python Inference Script */}
      {viewMode === 'python' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Faire tourner ce modèle en Python
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Script autonome en Python pur (sans aucune bibliothèque externe) pour exécuter l'inférence avec vos poids téléchargés.
              </p>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(pythonSnippet);
                setCopiedJson(true);
                setTimeout(() => setCopiedJson(false), 2000);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedJson ? 'Code copié !' : 'Copier le script'}</span>
            </button>
          </div>

          <pre className="bg-slate-900 text-emerald-300 p-4 rounded-lg font-mono text-xs max-h-96 overflow-y-auto leading-relaxed border border-slate-800">
            {pythonSnippet}
          </pre>
        </div>
      )}
    </div>
  );
};
