/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { ActiveTab, Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DatasetTokenSection } from './components/DatasetTokenSection';
import { ModelOverviewSection } from './components/ModelOverviewSection';
import { ModelWeightsSection } from './components/ModelWeightsSection';
import { InferencePlayground } from './components/InferencePlayground';
import { FunctionsGuideSection } from './components/FunctionsGuideSection';
import { FineTuningSection } from './components/FineTuningSection';
import { RagSection } from './components/RagSection';
import { ChatbotSection } from './components/ChatbotSection';
import { UserGuideSection } from './components/UserGuideSection';
import { QuizSection } from './components/QuizSection';
import { ReinforcementSection } from './components/ReinforcementSection';
import { PREDEFINED_DATASETS, getDefaultDatasetForLanguage } from './data/defaultDatasets';
import { buildVocabulary, splitSentences } from './utils/tokenizer';
import { trainModel } from './utils/modelEngine';
import { useLanguage } from './context/LanguageContext';

export default function App() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<ActiveTab>('userguide');
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>(() => {
    return language === 'en' ? 'fables_en' : 'fables';
  });
  const [corpusText, setCorpusText] = useState<string>(() => {
    const def = getDefaultDatasetForLanguage(language);
    return def.text;
  });
  const [contextWindow, setContextWindow] = useState<number>(1);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainingProgress, setTrainingProgress] = useState<number>(0);

  // When language switches, if user is on default dataset of other language, adapt to matching dataset
  useEffect(() => {
    if (language === 'en' && selectedDatasetId === 'fables') {
      const enDefault = PREDEFINED_DATASETS.find(d => d.id === 'fables_en');
      if (enDefault) {
        setSelectedDatasetId('fables_en');
        setCorpusText(enDefault.text);
      }
    } else if (language === 'fr' && selectedDatasetId === 'fables_en') {
      const frDefault = PREDEFINED_DATASETS.find(d => d.id === 'fables');
      if (frDefault) {
        setSelectedDatasetId('fables');
        setCorpusText(frDefault.text);
      }
    }
  }, [language, selectedDatasetId]);

  // Retractable sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('minillm_sidebar_collapsed');
      return stored === 'true';
    } catch {
      return false;
    }
  });
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('minillm_sidebar_collapsed', String(isSidebarCollapsed));
    } catch {
      // ignore
    }
  }, [isSidebarCollapsed]);

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
    const defaultData = getDefaultDatasetForLanguage(language);
    setSelectedDatasetId(defaultData.id);
    setCorpusText(defaultData.text);
    setContextWindow(1);
    setFineTunedModel(null);
    setRlModel(null);
    setUploadedRagText('');
    setActiveTab('userguide');
  }, [language]);

  const totalTokensCount = useMemo(() => {
    return sentences.reduce((acc, s) => acc + s.length, 0);
  }, [sentences]);

  const isBaseModelGroup = ['donnees', 'modele', 'matrice', 'generation'].includes(activeTab);
  const isAlignmentGroup = ['finetune', 'rlhf'].includes(activeTab);

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-950 selection:text-indigo-900 dark:selection:text-indigo-200 transition-colors duration-200">
      {/* Retractable Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        onReset={handleReset}
        vocabSize={vocabulary.tokens.length}
        totalTokensCount={totalTokensCount}
      />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navigation & Breadcrumbs Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onReset={handleReset}
          vocabSize={vocabulary.tokens.length}
          totalTokensCount={totalTokensCount}
          onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
          onOpenMobileSidebar={() => setIsMobileOpen(true)}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* Main Content Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sub-navigation for Base Model sections */}
        {isBaseModelGroup && (
          <div className="mb-6 flex items-center gap-1 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg w-fit text-xs font-medium shadow-2xs">
            <button
              onClick={() => setActiveTab('donnees')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeTab === 'donnees'
                  ? 'bg-slate-100 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {t('subnav.dataTokens')}
            </button>
            <button
              onClick={() => setActiveTab('modele')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeTab === 'modele'
                  ? 'bg-slate-100 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {t('subnav.myModel')}
            </button>
            <button
              onClick={() => setActiveTab('matrice')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeTab === 'matrice'
                  ? 'bg-slate-100 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {t('subnav.weightsMatrix')}
            </button>
            <button
              onClick={() => setActiveTab('generation')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeTab === 'generation'
                  ? 'bg-slate-100 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {t('subnav.inferenceSoftmax')}
            </button>
          </div>
        )}

        {/* Sub-navigation for Alignment sections (Fine-Tuning & RLHF) */}
        {isAlignmentGroup && (
          <div className="mb-6 flex items-center gap-1 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg w-fit text-xs font-medium shadow-2xs">
            <button
              onClick={() => setActiveTab('finetune')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeTab === 'finetune'
                  ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-200 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {t('subnav.sft')}
            </button>
            <button
              onClick={() => setActiveTab('rlhf')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeTab === 'rlhf'
                  ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {t('subnav.rlhf')}
            </button>
          </div>
        )}

        {/* 0. User Guide & Dedicated Quiz */}
        {activeTab === 'userguide' && (
          <UserGuideSection onNavigate={setActiveTab} />
        )}

        {activeTab === 'quiz' && (
          <QuizSection onNavigate={setActiveTab} />
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
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 mt-12 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            <span className="font-semibold text-slate-700 dark:text-slate-200">{t('app.title')}</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>{t('footer.builtWith')}</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setActiveTab('userguide')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              {t('footer.guide')}
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-emerald-600 dark:text-emerald-400 font-medium"
            >
              {t('footer.quiz')}
            </button>
            <button
              onClick={() => setActiveTab('donnees')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              {t('footer.data')}
            </button>
            <button
              onClick={() => setActiveTab('finetune')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Fine-Tuning
            </button>
            <button
              onClick={() => setActiveTab('rag')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              RAG
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Chatbot
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              {t('footer.code')}
            </button>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
