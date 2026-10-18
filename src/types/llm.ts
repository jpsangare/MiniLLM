export interface Token {
  id: number;
  text: string;
  isSpecial?: boolean;
}

export interface Vocabulary {
  tokens: Token[];
  tokenToId: Map<string, number>;
  idToToken: Map<number, string>;
  startTokenId: number;
  endTokenId: number;
}

export interface TransitionProb {
  targetId: number;
  targetText: string;
  count: number;
  probability: number; // Raw empirical prob
}

export interface ModelWeights {
  vocabSize: number;
  // contextKey (e.g. "id" or "id1,id2") -> map of targetId -> count
  contextTransitions: Map<string, TransitionProb[]>;
  contextTotalCounts: Map<string, number>;
  totalTransitions: number;
  loss: number;
  epochs: number;
}

export interface NextTokenCandidate {
  id: number;
  text: string;
  count: number;
  rawLogit: number;
  probability: number; // after softmax with temperature
  cumulativeProb: number;
}

export interface GenerationStep {
  stepIndex: number;
  contextTokens: Token[];
  candidates: NextTokenCandidate[];
  chosenToken: Token;
  temperature: number;
  randomValue: number;
  chosenProbability?: number;
  stepPerplexity?: number;
}

export interface TokenEmbedding2D {
  id: number;
  text: string;
  x: number; // 0 to 100 percentage in 2D coordinate space
  y: number;
  cluster: string;
  frequency: number;
}

export interface SerializedModel {
  meta: {
    name: string;
    version: string;
    architecture: string;
    vocabSize: number;
    contextWindow: number;
    loss: number;
    perplexity: number;
    createdAt: string;
  };
  vocabulary: Array<{ id: number; token: string; isSpecial?: boolean }>;
  weights: Record<string, Array<{ targetId: number; token: string; prob: number; count: number }>>;
}

export interface PredefinedDataset {
  id: string;
  title: string;
  description: string;
  text: string;
  suggestedPrompt: string;
  lang?: 'fr' | 'en';
  category?: string;
}

export interface FineTunePair {
  id: string;
  prompt: string;
  response: string;
  category?: string;
}

export interface RagChunk {
  id: number;
  text: string;
  tokensCount: number;
  score?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  tokens?: Token[];
  timestamp: string;
  modelType?: 'base' | 'finetuned' | 'rag' | 'rlhf';
  retrievedChunk?: string;
  tokensCount?: number;
}

export interface PreferencePair {
  id: string;
  prompt: string;
  chosen: string; // Réponse souhaitée / approuvée (Score positif)
  rejected: string; // Réponse indésirable / toxique (Score négatif)
  rewardChosen: number;
  rewardRejected: number;
  category: 'Sécurité' | 'Exactitude' | 'Politesse' | 'Concision';
  userVote?: 'chosen' | 'rejected';
}

export interface RlhfMetrics {
  avgReward: number;
  klDivergence: number;
  policyEntropy: number;
  stepsTrained: number;
}

export interface TokenAttentionWeight {
  index: number;
  token: Token;
  weight: number; // 0 to 1
  percentage: number; // 0 to 100
  role: 'context' | 'subject' | 'syntax' | 'recency';
}

export interface AttentionMapData {
  headId: 'global' | 'syntax' | 'semantic';
  weights: TokenAttentionWeight[];
  causalMatrix: {
    queryIndex: number;
    queryToken: Token;
    keyIndex: number;
    keyToken: Token;
    weight: number;
  }[][];
}

