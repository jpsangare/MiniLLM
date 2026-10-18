import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ModelWeights, Vocabulary, ChatMessage, Token } from '../types/llm';
import { generateTokensSequence, retrieveRelevantChunk, chunkText } from '../utils/modelEngine';
import { encodePrompt, getTokenColor } from '../utils/tokenizer';
import { Send, Bot, User, Sparkles, RotateCcw, Sliders, ShieldCheck, FileText, ArrowRight } from 'lucide-react';

interface ChatbotSectionProps {
  baseModel: ModelWeights;
  fineTunedModel: ModelWeights | null;
  rlModel: ModelWeights | null;
  vocabulary: Vocabulary;
  contextWindow: number;
  uploadedText: string;
  onNavigateToFineTune: () => void;
  onNavigateToRl: () => void;
  onNavigateToRag: () => void;
}

export const ChatbotSection: React.FC<ChatbotSectionProps> = ({
  baseModel,
  fineTunedModel,
  rlModel,
  vocabulary,
  contextWindow,
  uploadedText,
  onNavigateToFineTune,
  onNavigateToRl,
  onNavigateToRag,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: 'Bonjour ! Je suis votre mini-LLM. Vous pouvez discuter avec moi en utilisant le modèle de base, votre version fine-tunée, la version alignée par RLHF, ou le mode RAG avec document.',
      timestamp: '12:00',
      modelType: 'base',
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [selectedModelType, setSelectedModelType] = useState<'base' | 'finetuned' | 'rlhf' | 'rag'>('base');
  const [temperature, setTemperature] = useState<number>(0.7);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showTokensDebug, setShowTokensDebug] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  // Pick active model
  const activeModel = useMemo(() => {
    if (selectedModelType === 'finetuned' && fineTunedModel) return fineTunedModel;
    if (selectedModelType === 'rlhf' && rlModel) return rlModel;
    return baseModel;
  }, [selectedModelType, fineTunedModel, rlModel, baseModel]);

  const handleSendMessage = () => {
    if (!inputText.trim() || isGenerating) return;

    const userText = inputText.trim();
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsGenerating(true);

    // Simulate generation with slight realistic latency
    setTimeout(() => {
      let promptToUse = userText.toLowerCase();
      let retrievedChunkText = '';

      if (selectedModelType === 'rag' && uploadedText.trim()) {
        const chunks = chunkText(uploadedText);
        const { bestChunk } = retrieveRelevantChunk(chunks, userText);
        if (bestChunk) {
          retrievedChunkText = bestChunk.text;
          promptToUse = `${bestChunk.text} question ${userText.toLowerCase()}`;
        }
      }

      const encoded = encodePrompt(promptToUse, vocabulary);
      const generated = generateTokensSequence(
        activeModel,
        vocabulary,
        encoded,
        contextWindow,
        temperature,
        14
      );

      const responseWords = generated
        .filter(t => !t.isSpecial)
        .map(t => t.text);

      let finalText = responseWords.join(' ');
      if (selectedModelType === 'rag' && retrievedChunkText) {
        finalText = `${retrievedChunkText}`;
      } else if (!finalText) {
        finalText = 'Je ne trouve pas de suite statistique pour ce contexte.';
      }

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        sender: 'assistant',
        text: finalText,
        tokens: generated,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelType: selectedModelType,
        retrievedChunk: retrievedChunkText,
        tokensCount: generated.length,
      };

      setMessages(prev => [...prev, assistantMsg]);
      setIsGenerating(false);
    }, 450);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: 'Historique effacé. Prêt pour une nouvelle conversation !',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelType: selectedModelType,
      },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                Interface Conversationnelle
              </span>
              <span className="text-xs text-slate-500">
                · Utiliser le modèle comme un chatbot
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Chatbot : Dialogue avec votre Modèle
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed mt-1 max-w-3xl">
              Discutez directement avec votre modèle. Vous pouvez basculer entre le <strong>Modèle de base</strong> (pré-entraîné), le <strong>Modèle Fine-tuné</strong> (aligné pour répondre aux questions) et le <strong>Mode RAG</strong> (alimenté par votre document texte).
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleClearChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Effacer la conversation</span>
            </button>
          </div>
        </div>

        {/* Model Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-700 mr-2">Moteur actif :</span>

          {/* Mode 1: Base */}
          <button
            onClick={() => setSelectedModelType('base')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
              selectedModelType === 'base'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold shadow-xs ring-1 ring-indigo-600'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            1. Modèle de Base (Pré-entraîné)
          </button>

          {/* Mode 2: Fine-Tuned */}
          <button
            onClick={() => {
              if (!fineTunedModel) {
                onNavigateToFineTune();
              } else {
                setSelectedModelType('finetuned');
              }
            }}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedModelType === 'finetuned'
                ? 'border-purple-600 bg-purple-50 text-purple-900 font-semibold shadow-xs ring-1 ring-purple-600'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>2. Modèle Fine-Tuné</span>
            {!fineTunedModel && (
              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded border border-slate-200">
                Non configuré
              </span>
            )}
          </button>

          {/* Mode 3: RLHF */}
          <button
            onClick={() => {
              if (!rlModel) {
                onNavigateToRl();
              } else {
                setSelectedModelType('rlhf');
              }
            }}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedModelType === 'rlhf'
                ? 'border-rose-600 bg-rose-50 text-rose-900 font-semibold shadow-xs ring-1 ring-rose-600'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>3. Aligné RLHF</span>
            {!rlModel && (
              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded border border-slate-200">
                Non configuré
              </span>
            )}
          </button>

          {/* Mode 4: RAG */}
          <button
            onClick={() => {
              if (!uploadedText.trim()) {
                onNavigateToRag();
              } else {
                setSelectedModelType('rag');
              }
            }}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedModelType === 'rag'
                ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold shadow-xs ring-1 ring-emerald-600'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>4. Mode RAG (Document)</span>
            {!uploadedText.trim() && (
              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded border border-slate-200">
                Document vide
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Chat Area & Settings Drawer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Chat Window (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col h-[520px]">
          {/* Messages Feed */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {messages.map(msg => {
              const isAssistant = msg.sender === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isAssistant ? '' : 'flex-row-reverse'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                      isAssistant
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-700 text-white'
                    }`}
                  >
                    {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed space-y-1.5 ${
                      isAssistant
                        ? 'bg-slate-50 text-slate-900 border border-slate-200 rounded-tl-xs'
                        : 'bg-indigo-600 text-white rounded-tr-xs shadow-xs'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {/* RAG citation tag */}
                    {msg.retrievedChunk && (
                      <div className="pt-1 text-[10px] text-emerald-700 flex items-center gap-1 font-mono">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Source : Extrait de votre document RAG</span>
                      </div>
                    )}

                    {/* Tokens Debug Pill list */}
                    {showTokensDebug && msg.tokens && msg.tokens.length > 0 && (
                      <div className="pt-2 border-t border-slate-200/60 flex flex-wrap gap-1">
                        {msg.tokens.map((tok, i) => (
                          <span
                            key={i}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${getTokenColor(tok.id)}`}
                          >
                            {tok.text} ({tok.id})
                          </span>
                        ))}
                      </div>
                    )}

                    <div
                      className={`text-[10px] text-right ${
                        isAssistant ? 'text-slate-400' : 'text-indigo-200'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {isGenerating && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                  <span>Le modèle calcule les prochains tokens...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-slate-50 border-t border-slate-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                disabled={isGenerating}
                placeholder={
                  selectedModelType === 'rag'
                    ? 'Posez une question sur le document (ex: quelle est la garantie ?)...'
                    : 'Discutez avec le modèle (ex: le renard, que mange le chat ?)...'
                }
                className="flex-1 text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isGenerating}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Envoyer</span>
              </button>
            </div>

            {/* Quick chips */}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2 overflow-x-auto">
              <span>Suggestions :</span>
              {['question que mange le', 'le chat', 'le renard', 'quelle est la garantie'].map(seed => (
                <button
                  key={seed}
                  onClick={() => setInputText(seed)}
                  className="underline hover:text-indigo-600 cursor-pointer whitespace-nowrap"
                >
                  "{seed}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Chatbot Controls & Model Inspector (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Temperature & Token View */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <span>Paramètres de dialogue</span>
              </h3>
            </div>

            {/* Temperature slider */}
            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>Température :</span>
                <span className="font-mono font-bold text-indigo-700">{temperature.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.8"
                step="0.05"
                value={temperature}
                onChange={e => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Inspect tokens toggle */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-700">Inspecter les Token IDs :</span>
              <button
                onClick={() => setShowTokensDebug(!showTokensDebug)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer border ${
                  showTokensDebug
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {showTokensDebug ? 'Activé' : 'Désactivé'}
              </button>
            </div>
          </div>

          {/* Model active profile */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <h4 className="text-xs font-semibold text-slate-900">
              Profil du modèle sélectionné
            </h4>

            {selectedModelType === 'base' && (
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Modèle de Base :</strong> Prédiction autorégressive pure basée sur les fréquences du corpus général. Il complète les phrases sans instruction particulière.
              </p>
            )}

            {selectedModelType === 'finetuned' && (
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Modèle Fine-Tuné :</strong> Ses poids ont été renforcés sur des questions/réponses précises pour se comporter comme un assistant ciblé.
              </p>
            )}

            {selectedModelType === 'rlhf' && (
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Modèle Aligné RLHF :</strong> Optimisé par apprentissage par renforcement (Reward Model + pénalité KL). Privilégie la sécurité, la politesse et étouffe les mots toxiques.
              </p>
            )}

            {selectedModelType === 'rag' && (
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Mode RAG :</strong> Avant de répondre, le système extrait le paragraphe le plus proche dans votre document texte et l'utilise comme vérité terrain.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
