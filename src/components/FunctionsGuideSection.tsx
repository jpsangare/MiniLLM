import React, { useState } from 'react';
import {
  Code2,
  FileCode,
  ArrowRight,
  Database,
  Layers,
  Sparkles,
  Zap,
  Cpu,
  BookOpen,
  Check
} from 'lucide-react';
import { ConceptsGuide } from './ConceptsGuide';

interface FunctionsGuideSectionProps {
  onGoToData: () => void;
  onGoToModel: () => void;
  onGoToWeights: () => void;
  onGoToGeneration: () => void;
  onGoToFineTune?: () => void;
  onGoToRl?: () => void;
  onGoToRag?: () => void;
  onGoToChat?: () => void;
}

interface CodeFunctionItem {
  name: string;
  file: string;
  signature: string;
  role: string;
  input: string;
  output: string;
}

interface StepCodeInfo {
  stepNumber: number;
  stepTitle: string;
  summary: string;
  fileColor: string;
  functions: CodeFunctionItem[];
  actionLabel: string;
  onAction: () => void;
}

export const FunctionsGuideSection: React.FC<FunctionsGuideSectionProps> = ({
  onGoToData,
  onGoToModel,
  onGoToWeights,
  onGoToGeneration,
  onGoToFineTune,
  onGoToRl,
  onGoToRag,
  onGoToChat,
}) => {
  const [subView, setSubView] = useState<'functions' | 'concepts'>('functions');
  const [activeStepTab, setActiveStepTab] = useState<number>(0);

  const stepsData: StepCodeInfo[] = [
    {
      stepNumber: 1,
      stepTitle: 'Données & Tokenisation',
      summary: 'Transformation du texte brut en nombres entiers (Token IDs) exploitables par la machine.',
      fileColor: 'text-blue-600 bg-blue-50 border-blue-200',
      actionLabel: 'Tester la Tokenisation ➔',
      onAction: onGoToData,
      functions: [
        {
          name: 'splitSentences(corpus)',
          file: 'src/utils/tokenizer.ts',
          signature: '(corpus: string) => string[][]',
          role: 'Découpe le texte brut d’entraînement en phrases distinctes.',
          input: 'Texte brut (string)',
          output: 'Tableau de phrases découpées en mots',
        },
        {
          name: 'rawTokenize(text)',
          file: 'src/utils/tokenizer.ts',
          signature: '(text: string) => string[]',
          role: 'Extrait les mots et sépare les signes de ponctuation.',
          input: 'Une phrase (string)',
          output: 'Liste de mots normalisés en minuscules',
        },
        {
          name: 'buildVocabulary(sentences)',
          file: 'src/utils/tokenizer.ts',
          signature: '(sentences: string[][]) => Vocabulary',
          role: 'Associe chaque mot unique à un ID numérique et ajoute les balises <DEBUT> et <FIN>.',
          input: 'Phrases tokenisées',
          output: 'Dictionnaire { tokens, tokenToId, idToToken }',
        },
        {
          name: 'encodePrompt(text, vocab)',
          file: 'src/utils/tokenizer.ts',
          signature: '(text: string, vocab: Vocabulary) => Token[]',
          role: 'Convertit le prompt saisi par l\'utilisateur en séquence d\'IDs du vocabulaire.',
          input: 'Prompt utilisateur + Vocabulaire',
          output: 'Tableau de tokens avec leurs IDs respectifs',
        },
      ],
    },
    {
      stepNumber: 2,
      stepTitle: 'Entraînement & Poids',
      summary: 'Calcul des statistiques de co-occurrence et des probabilités de transition conditionnelles.',
      fileColor: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      actionLabel: 'Voir la Matrice des Poids ➔',
      onAction: onGoToWeights,
      functions: [
        {
          name: 'getContextKey(tokenIds)',
          file: 'src/utils/modelEngine.ts',
          signature: '(tokenIds: number[]) => string',
          role: 'Formate les IDs de contexte en une clé textuelle de recherche (ex: "3,12").',
          input: 'Tableau d\'IDs de contexte',
          output: 'Clé de contexte (string)',
        },
        {
          name: 'trainModel(sentences, vocab, contextWindow)',
          file: 'src/utils/modelEngine.ts',
          signature: '(sentences, vocab, window, smoothing) => ModelWeights',
          role: 'Compte les paires (contexte -> mot suivant) et calcule la matrice des probabilités et la Loss.',
          input: 'Phrases + Vocabulaire + Taille fenêtre',
          output: 'Poids du modèle { contextTransitions, loss, totalTransitions }',
        },
        {
          name: 'generateWeightsJson(model, vocab, window)',
          file: 'src/components/ModelWeightsSection.tsx',
          signature: '() => string (JSON formatté)',
          role: 'Sérialise l\'intégralité des poids appris et des métadonnées sous format JSON téléchargeable (checkpoint standard).',
          input: 'ModelWeights + Vocabulaire + Fenêtre de contexte',
          output: 'Fichier JSON téléchargeable (.json) et copiable',
        },
      ],
    },
    {
      stepNumber: 3,
      stepTitle: 'Architecture & Export du Modèle',
      summary: 'Projection sémantique 2D des tokens et sérialisation complète du modèle en JSON.',
      fileColor: 'text-purple-600 bg-purple-50 border-purple-200',
      actionLabel: 'Inspecter Mon Modèle ➔',
      onAction: onGoToModel,
      functions: [
        {
          name: 'computeTokenEmbeddings2D(sentences, vocab)',
          file: 'src/utils/modelEngine.ts',
          signature: '(sentences: string[][], vocab: Vocabulary) => TokenEmbedding2D[]',
          role: 'Projette les tokens dans un espace vectoriel 2D en regroupant les mots selon leurs contextes.',
          input: 'Corpus + Vocabulaire',
          output: 'Coordonnées (x, y) et clusters sémantiques',
        },
        {
          name: 'serializeModel(model, vocab, contextWindow)',
          file: 'src/utils/modelEngine.ts',
          signature: '(model, vocab, window) => SerializedModel',
          role: 'Génère le fichier de configuration et de poids exportable au format standard JSON.',
          input: 'Modèle + Vocabulaire',
          output: 'Objet JSON { meta, vocabulary, weights }',
        },
      ],
    },
    {
      stepNumber: 4,
      stepTitle: 'Inférence & Softmax (Température)',
      summary: 'Évaluation du contexte courant, calcul des logits et application de la température.',
      fileColor: 'text-amber-600 bg-amber-50 border-amber-200',
      actionLabel: 'Tester l\'Inférence ➔',
      onAction: onGoToGeneration,
      functions: [
        {
          name: 'predictNextTokenCandidates(...)',
          file: 'src/utils/modelEngine.ts',
          signature: '(promptTokens, model, vocab, window, temp) => { candidates, activeContext }',
          role: 'Identifie le contexte actif, récupère les logits et applique Softmax avec le diviseur de température Tau.',
          input: 'Tokens actuels + Modèle + Température',
          output: 'Liste ordonnée des candidats avec leurs probabilités',
        },
        {
          name: 'computeRealtimePerplexity(...)',
          file: 'src/components/InferencePlayground.tsx',
          signature: '(candidates, stepsHistory) => { contextPpl, sequencePpl }',
          role: 'Calcule l\'entropie de Shannon pour le prochain mot et l\'exponentielle de la perte moyenne (PPL = exp(NLL)).',
          input: 'Candidats Softmax + Historique des tokens générés',
          output: 'Perplexité en direct, indice de certitude (%) et sparkline',
        },
        {
          name: 'computeAttentionMap(...)',
          file: 'src/utils/modelEngine.ts',
          signature: '(tokens, window, headId, candidate) => AttentionMapData',
          role: 'Calcule les poids d\'attention Softmax(QKᵀ) et la matrice causale 2D pour visualiser l\'influence des mots passés.',
          input: 'Tokens actuels + Fenêtre + Tête d\'attention + Candidat survolé',
          output: 'Poids d\'attention normalisés (%) et matrice Query × Key',
        },
        {
          name: 'computeGradientsAndBackprop(...)',
          file: 'src/components/BackpropagationVisualizer.tsx',
          signature: '(candidates, targetId, learningRate) => { gradients, updatedLogits, newLoss }',
          role: 'Simule la rétropropagation : calcule les gradients ∂Loss/∂z = p - y, applique la descente SGD (W ← W - η∇) et mesure le gain d\'apprentissage.',
          input: 'Candidats Softmax + Token cible réel + Taux d\'apprentissage η',
          output: 'Gradients individuels, mise à jour des logits et comparaison de probabilités',
        },
      ],
    },
    {
      stepNumber: 5,
      stepTitle: 'Génération Autorégressive',
      summary: 'Tirage aléatoire probabiliste du mot suivant et réinjection dans le contexte.',
      fileColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      actionLabel: 'Générer du Texte ➔',
      onAction: onGoToGeneration,
      functions: [
        {
          name: 'sampleCandidate(candidates, temperature)',
          file: 'src/utils/modelEngine.ts',
          signature: '(candidates: NextTokenCandidate[], temp: number) => { chosen, randomSample }',
          role: 'Tire le token suivant : déterministe (Greedy) si T ≤ 0.1, roulette multinominale sinon.',
          input: 'Liste des candidats + Température',
          output: 'Token sélectionné + Valeur du tirage aléatoire',
        },
        {
          name: 'handleGenerateNextToken()',
          file: 'src/components/InferencePlayground.tsx',
          signature: '() => void',
          role: 'Ajoute le mot choisi au texte, met à jour le journal et déclenche le cycle suivant.',
          input: 'État actuel de la génération',
          output: 'Mise à jour du texte et de l\'historique',
        },
      ],
    },
    {
      stepNumber: 6,
      stepTitle: 'Alignement : Fine-Tuning & RLHF',
      summary: 'Ajustement supervisé (SFT) et optimisation par renforcement avec pénalité KL.',
      fileColor: 'text-rose-600 bg-rose-50 border-rose-200',
      actionLabel: 'Tester l\'Alignement (RLHF) ➔',
      onAction: onGoToRl || onGoToFineTune || onGoToWeights,
      functions: [
        {
          name: 'fineTuneModel(...)',
          file: 'src/utils/modelEngine.ts',
          signature: '(baseModel, pairs, vocab, window, lr, epochs) => ModelWeights',
          role: 'Renforce les transitions cibles pour aligner le modèle sur des paires Question -> Réponse.',
          input: 'Modèle de base + Paires d\'instructions + Taux d\'apprentissage',
          output: 'Modèle fine-tuné spécialisé',
        },
        {
          name: 'applyReinforcementLearning(...)',
          file: 'src/utils/modelEngine.ts',
          signature: '(baseModel, preferences, vocab, window, scaling, klCoeff) => { alignedModel, metrics }',
          role: 'Applique le gradient de préférence humaine (+ reward / - pénalité) et régule avec la divergence KL.',
          input: 'Paires de préférence 👍/👎 + Coeff KL',
          output: 'Modèle aligné RLHF + Métriques (Reward, D_KL)',
        },
      ],
    },
    {
      stepNumber: 7,
      stepTitle: 'RAG Simple (Connaissance Document)',
      summary: 'Découpage du texte en chunks et recherche lexicale pour enrichir le prompt.',
      fileColor: 'text-teal-600 bg-teal-50 border-teal-200',
      actionLabel: 'Tester le RAG ➔',
      onAction: onGoToRag || onGoToGeneration,
      functions: [
        {
          name: 'chunkText(documentText)',
          file: 'src/utils/modelEngine.ts',
          signature: '(documentText: string) => RagChunk[]',
          role: 'Découpe un texte brut en passages cohérents (chunks) indexés avec leur nombre de tokens.',
          input: 'Document brut (string)',
          output: 'Tableau de chunks indexés',
        },
        {
          name: 'retrieveRelevantChunk(chunks, query)',
          file: 'src/utils/modelEngine.ts',
          signature: '(chunks, query) => { bestChunk, scores }',
          role: 'Calcule le score de correspondance lexicale entre la question et chaque chunk pour extraire la source.',
          input: 'Chunks + Question utilisateur',
          output: 'Meilleur extrait trouvé + Scores de confiance (%)',
        },
      ],
    },
    {
      stepNumber: 8,
      stepTitle: 'Chatbot & Multi-Moteurs',
      summary: 'Routage en direct vers le moteur actif (Base, SFT, RLHF, RAG) et loupe des Token IDs.',
      fileColor: 'text-blue-600 bg-blue-50 border-blue-200',
      actionLabel: 'Ouvrir le Chatbot ➔',
      onAction: onGoToChat || onGoToGeneration,
      functions: [
        {
          name: 'generateTokensSequence(...)',
          file: 'src/utils/modelEngine.ts',
          signature: '(promptTokens, model, vocab, window, temp, maxTokens) => Token[]',
          role: 'Génère la complétion conversationnelle continue jusqu\'à la balise <FIN> ou la limite max.',
          input: 'Tokens du message + Poids du moteur sélectionné',
          output: 'Séquence complète des tokens de la réponse',
        },
        {
          name: 'handleSendMessage(...)',
          file: 'src/components/ChatbotSection.tsx',
          signature: '() => void',
          role: 'Achemine le message vers le bon moteur (Base, Fine-tuné, RLHF ou RAG avec extraction de chunk).',
          input: 'Texte utilisateur + Sélecteur de moteur',
          output: 'Bulle de discussion et affichage optionnel des IDs de tokens',
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                Architecture Logicielle
              </span>
              <span className="text-xs text-slate-500">
                · Cartographie des fonctions utilisées par étape
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Les Fonctions du Code par Étape
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed mt-1 max-w-3xl">
              Vue synthétique et claire de toutes les fonctions TypeScript appelées dans l'application, organisées selon les 5 étapes du pipeline LLM.
            </p>
          </div>

          {/* Sub-view toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium shrink-0">
            <button
              onClick={() => setSubView('functions')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                subView === 'functions'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fonctions du Code
            </button>
            <button
              onClick={() => setSubView('concepts')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                subView === 'concepts'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Concepts & Pourquoi ça marche
            </button>
          </div>
        </div>
      </div>

      {subView === 'concepts' ? (
        <ConceptsGuide onGoToData={onGoToData} onGoToGeneration={onGoToGeneration} />
      ) : (
        <div className="space-y-6">
          {/* Visual Execution Flow Pipeline Banner */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Flux d'exécution de bout en bout
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1">
              {stepsData.map((step, idx) => {
                const isActive = activeStepTab === idx;
                return (
                  <button
                    key={step.stepNumber}
                    onClick={() => setActiveStepTab(idx)}
                    className={`p-3 text-left rounded-lg border transition-all cursor-pointer ${
                      isActive
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-600'
                        : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono font-bold text-slate-700">
                        Étape {step.stepNumber}
                      </span>
                      {isActive && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </div>
                    <div className="text-xs font-semibold text-slate-900 truncate">
                      {step.stepTitle}
                    </div>
                    <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                      {step.functions.length} fonction(s)
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Step Functions Card */}
          {(() => {
            const currentStep = stepsData[activeStepTab];
            return (
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-indigo-600 text-white font-mono text-xs font-bold flex items-center justify-center">
                        {currentStep.stepNumber}
                      </span>
                      <h2 className="text-base font-bold text-slate-900">
                        {currentStep.stepTitle}
                      </h2>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {currentStep.summary}
                    </p>
                  </div>

                  <button
                    onClick={currentStep.onAction}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer self-start sm:self-auto shrink-0"
                  >
                    <span>{currentStep.actionLabel}</span>
                  </button>
                </div>

                {/* Table of Functions */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-100 rounded-lg overflow-hidden">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                      <tr>
                        <th className="py-2.5 px-3">Fonction</th>
                        <th className="py-2.5 px-3">Fichier</th>
                        <th className="py-2.5 px-3">Rôle synthétique</th>
                        <th className="py-2.5 px-3">Entrée</th>
                        <th className="py-2.5 px-3">Sortie</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentStep.functions.map((fn, fIdx) => (
                        <tr key={fIdx} className="hover:bg-slate-50/70 transition-colors">
                          {/* Function Name */}
                          <td className="py-3 px-3 font-mono font-semibold text-indigo-700 whitespace-nowrap">
                            <code>{fn.name}</code>
                          </td>

                          {/* Source File */}
                          <td className="py-3 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                              {fn.file}
                            </span>
                          </td>

                          {/* Role */}
                          <td className="py-3 px-3 text-slate-700">
                            {fn.role}
                          </td>

                          {/* Input */}
                          <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                            {fn.input}
                          </td>

                          {/* Output */}
                          <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                            {fn.output}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {/* Quick Recap of All 5 Steps in a Single Concise View */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Vue d'ensemble rapide (toutes les étapes)
            </h3>

            <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden">
              {stepsData.map(step => (
                <div key={step.stepNumber} className="p-3.5 hover:bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2.5 md:w-1/3">
                    <span className="font-mono font-bold text-slate-400 text-xs w-4">
                      #{step.stepNumber}
                    </span>
                    <span className="font-semibold text-slate-900">
                      {step.stepTitle}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 md:flex-1">
                    {step.functions.map((fn, i) => (
                      <span
                        key={i}
                        className="font-mono text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                        title={fn.role}
                      >
                        {fn.name.split('(')[0]}()
                      </span>
                    ))}
                  </div>

                  <div className="text-slate-400 text-[11px] font-mono shrink-0">
                    {step.functions[0]?.file}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
