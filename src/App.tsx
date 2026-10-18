/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useCallback } from 'react';
import { ActiveTab, Header } from './components/Header';
import { DatasetTokenSection } from './components/DatasetTokenSection';
import { ModelOverviewSection } from './components/ModelOverviewSection';
import { ModelWeightsSection } from './components/ModelWeightsSection';
import { InferencePlayground } from './components/InferencePlayground';
import { FunctionsGuideSection } from './components/FunctionsGuideSection';
import { FineTuningSection } from './components/FineTuningSection';
import { RagSection } from './components/RagSection';
import { ChatbotSection } from './components/ChatbotSection';
import { UserGuideSection } from './components/UserGuideSection';
import { ReinforcementSection } from './components/ReinforcementSection';
import { PREDEFINED_DATASETS } from './data/defaultDatasets';
import { buildVocabulary, splitSentences } from './utils/tokenizer';
import { trainModel } from './utils/modelEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('userguide');
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('fables');
  const [corpusText, setCorpusText] = useState<string>(PREDEFINED_DATASETS[0].text);
  const [contextWindow, setContextWindow] = useState<number>(1);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainingProgress, setTrainingProgress] = useState<number>(0);

  // Advanced features state
  const [fineTunedModel, setFineTunedModel] = useState<any | null>(null);
  const [rlModel, setRlModel] = useState<any | null>(null);
  const [uploadedRagText, setUploadedRagText] = useState<string>('');

  // 1. Sentences parsed from current corpus
  const sentences = useMemo(() => {
    return splitSentences(corpusText);
  }, [corpusText]);

  // 2. Vocabulary built from sentences
  const vocabulary = useMemo(() => {
    return buildVocabulary(sentences);
  }, [sentences]);

  // 3. Statistical Model Weights trained from sentences & vocabulary
  const model = useMemo(() => {
    return trainModel(sentences, vocabulary, contextWindow);
  }, [sentences, vocabulary, contextWindow]);

  // Handle animated training simulation
  const handleRetrain = useCallback((epochs: number) => {
    setIsTraining(true);
    setTrainingProgress(0);

    const stepDuration = 250;
    let currentStep = 0;
    const totalSteps = epochs;

    const interval = setInterval(() => {
      currentStep++;
      setTrainingProgress(Math.round((currentStep / totalSteps) * 100));

      if (currentStep >= totalSteps) {
        clearInterval(interval);
        setTimeout(() => {
          setIsTraining(false);
          setTrainingProgress(0);
        }, 300);
      }
    }, stepDuration);
  }, []);

  const handleReset = useCallback(() => {
    const defaultData = PREDEFINED_DATASETS[0];
    setSelectedDatasetId(defaultData.id);
    setCorpusText(defaultData.text);
    setContextWindow(1);
    setFineTunedModel(null);
    setRlModel(null);
    setUploadedRagText('');
    setActiveTab('userguide');
  }, []);

  const totalTokensCount = useMemo(() => {
    return sentences.reduce((acc, s) => acc + s.length, 0);
  }, [sentences]);

  const isBaseModelGroup = ['donnees', 'modele', 'matrice', 'generation'].includes(activeTab);
  const isAlignmentGroup = ['finetune', 'rlhf'].includes(activeTab);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* 3-zone Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onReset={handleReset}
        vocabSize={vocabulary.tokens.length}
        totalTokensCount={totalTokensCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sub-navigation for Base Model sections */}
        {isBaseModelGroup && (
          <div className="mb-6 flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg w-fit text-xs font-medium">
            <button
              onClick={() => setActiveTab('donnees')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeTab === 'donnees'
                  ? 'bg-slate-100 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Données & Tokens
            </button>
            <button
              onClick={() => setActiveTab('modele')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeTab === 'modele'
                  ? 'bg-slate-100 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mon Modèle (Architecture)
            </button>
            <button
              onClick={() => setActiveTab('matrice')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeTab === 'matrice'
                  ? 'bg-slate-100 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Poids & Matrice
            </button>
            <button
              onClick={() => setActiveTab('generation')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeTab === 'generation'
                  ? 'bg-slate-100 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Inférence & Softmax
            </button>
          </div>
        )}

        {/* Sub-navigation for Alignment sections (Fine-Tuning & RLHF) */}
        {isAlignmentGroup && (
          <div className="mb-6 flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg w-fit text-xs font-medium">
            <button
              onClick={() => setActiveTab('finetune')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeTab === 'finetune'
                  ? 'bg-purple-100 text-purple-800 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Phase 1 : Fine-Tuning (SFT)
            </button>
            <button
              onClick={() => setActiveTab('rlhf')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeTab === 'rlhf'
                  ? 'bg-rose-100 text-rose-800 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Phase 2 : Renforcement (RLHF / DPO)
            </button>
          </div>
        )}

        {/* 0. User Guide */}
        {activeTab === 'userguide' && (
          <UserGuideSection onNavigate={setActiveTab} />
        )}

        {/* 1. Base Model views */}
        {activeTab === 'donnees' && (
          <DatasetTokenSection
            corpusText={corpusText}
            setCorpusText={setCorpusText}
            sentences={sentences}
            vocabulary={vocabulary}
            selectedDatasetId={selectedDatasetId}
            setSelectedDatasetId={setSelectedDatasetId}
            onNavigateToWeights={() => setActiveTab('modele')}
            onTriggerTrain={() => handleRetrain(5)}
            isTraining={isTraining}
          />
        )}

        {activeTab === 'modele' && (
          <ModelOverviewSection
            model={model}
            vocabulary={vocabulary}
            sentences={sentences}
            contextWindow={contextWindow}
            onNavigateToInference={() => setActiveTab('generation')}
            onNavigateToMatrix={() => setActiveTab('matrice')}
          />
        )}

        {activeTab === 'matrice' && (
          <ModelWeightsSection
            model={model}
            vocabulary={vocabulary}
            contextWindow={contextWindow}
            setContextWindow={setContextWindow}
            onNavigateToInference={() => setActiveTab('generation')}
            onRetrain={handleRetrain}
            isTraining={isTraining}
            trainingProgress={trainingProgress}
          />
        )}

        {activeTab === 'generation' && (
          <InferencePlayground
            model={model}
            vocabulary={vocabulary}
            contextWindow={contextWindow}
            initialPrompt={
              PREDEFINED_DATASETS.find(d => d.id === selectedDatasetId)?.suggestedPrompt || 'le renard'
            }
          />
        )}

        {/* 2. Alignment Views */}
        {activeTab === 'finetune' && (
          <FineTuningSection
            baseModel={model}
            vocabulary={vocabulary}
            contextWindow={contextWindow}
            fineTunedModel={fineTunedModel}
            setFineTunedModel={setFineTunedModel}
            onNavigateToChat={() => setActiveTab('chat')}
          />
        )}

        {activeTab === 'rlhf' && (
          <ReinforcementSection
            baseModel={fineTunedModel || model}
            vocabulary={vocabulary}
            contextWindow={contextWindow}
            rlModel={rlModel}
            setRlModel={setRlModel}
            onNavigateToChat={() => setActiveTab('chat')}
          />
        )}

        {/* 3. Simple RAG View */}
        {activeTab === 'rag' && (
          <RagSection
            model={model}
            vocabulary={vocabulary}
            contextWindow={contextWindow}
            onNavigateToChat={() => setActiveTab('chat')}
            uploadedText={uploadedRagText}
            setUploadedText={setUploadedRagText}
          />
        )}

        {/* 4. Chatbot View */}
        {activeTab === 'chat' && (
          <ChatbotSection
            baseModel={model}
            fineTunedModel={fineTunedModel}
            rlModel={rlModel}
            vocabulary={vocabulary}
            contextWindow={contextWindow}
            uploadedText={uploadedRagText}
            onNavigateToFineTune={() => setActiveTab('finetune')}
            onNavigateToRl={() => setActiveTab('rlhf')}
            onNavigateToRag={() => setActiveTab('rag')}
          />
        )}

        {/* 5. Code Functions Guide */}
        {activeTab === 'guide' && (
          <FunctionsGuideSection
            onGoToData={() => setActiveTab('donnees')}
            onGoToModel={() => setActiveTab('modele')}
            onGoToWeights={() => setActiveTab('matrice')}
            onGoToGeneration={() => setActiveTab('generation')}
            onGoToFineTune={() => setActiveTab('finetune')}
            onGoToRl={() => setActiveTab('rlhf')}
            onGoToRag={() => setActiveTab('rag')}
            onGoToChat={() => setActiveTab('chat')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span>MiniLLM Studio</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>Comprendre les grands modèles de langage par la pratique</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('userguide')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Guide
            </button>
            <button
              onClick={() => setActiveTab('donnees')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Modèle de Base
            </button>
            <button
              onClick={() => setActiveTab('finetune')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Fine-Tuning
            </button>
            <button
              onClick={() => setActiveTab('rag')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              RAG Simple
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Chatbot
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Fonctions du Code
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
