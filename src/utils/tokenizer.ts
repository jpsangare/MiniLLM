import { Token, Vocabulary } from '../types/llm';

export const START_TOKEN = '<DEBUT>';
export const END_TOKEN = '<FIN>';
export const UNKNOWN_TOKEN = '<INCONNU>';

// Palette of pleasing distinct token background colors for visualization
export const TOKEN_COLORS = [
  'bg-blue-50 text-blue-800 border-blue-200',
  'bg-emerald-50 text-emerald-800 border-emerald-200',
  'bg-amber-50 text-amber-800 border-amber-200',
  'bg-purple-50 text-purple-800 border-purple-200',
  'bg-rose-50 text-rose-800 border-rose-200',
  'bg-cyan-50 text-cyan-800 border-cyan-200',
  'bg-indigo-50 text-indigo-800 border-indigo-200',
  'bg-teal-50 text-teal-800 border-teal-200',
  'bg-orange-50 text-orange-800 border-orange-200',
  'bg-pink-50 text-pink-800 border-pink-200',
  'bg-lime-50 text-lime-800 border-lime-200',
  'bg-violet-50 text-violet-800 border-violet-200',
];

export function getTokenColor(tokenId: number): string {
  if (tokenId < 0) return 'bg-slate-100 text-slate-700 border-slate-300';
  return TOKEN_COLORS[tokenId % TOKEN_COLORS.length];
}

/**
 * Splits text into tokens (words and punctuation), preserving sentence boundaries.
 */
export function rawTokenize(text: string): string[] {
  // Normalize whitespace, keep words and punctuation marks as separate tokens
  const clean = text.trim();
  if (!clean) return [];

  // Match words (including accents) or individual punctuation marks
  const tokens: string[] = [];
  const regex = /[a-zA-Z0-9àâäéèêëîïôöùûüçÀÂÄÉÈÊËÎÏÔÖÙÛÜÇ]+|[.,!?;:'"«»()\-]/g;
  let match;
  while ((match = regex.exec(clean)) !== null) {
    tokens.push(match[0].toLowerCase());
  }
  return tokens;
}

/**
 * Splits training text into distinct sentences / lines
 */
export function splitSentences(corpus: string): string[][] {
  const lines = corpus
    .split(/\n+|\./)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const sentences: string[][] = [];
  for (const line of lines) {
    const raw = rawTokenize(line);
    if (raw.length > 0) {
      sentences.push(raw);
    }
  }
  return sentences;
}

/**
 * Builds vocabulary from the sentences, adding special start/end tokens
 */
export function buildVocabulary(sentences: string[][]): Vocabulary {
  const tokenToId = new Map<string, number>();
  const idToToken = new Map<number, string>();
  const tokens: Token[] = [];

  // Assign Special Tokens first
  let nextId = 0;
  
  tokenToId.set(START_TOKEN, nextId);
  idToToken.set(nextId, START_TOKEN);
  tokens.push({ id: nextId, text: START_TOKEN, isSpecial: true });
  const startTokenId = nextId++;

  tokenToId.set(END_TOKEN, nextId);
  idToToken.set(nextId, END_TOKEN);
  tokens.push({ id: nextId, text: END_TOKEN, isSpecial: true });
  const endTokenId = nextId++;

  // Collect frequency of all unique words
  const frequencyMap = new Map<string, number>();
  for (const sentence of sentences) {
    for (const word of sentence) {
      frequencyMap.set(word, (frequencyMap.get(word) || 0) + 1);
    }
  }

  // Sort by frequency descending for realistic LLM token dictionary IDs
  const sortedWords = Array.from(frequencyMap.entries()).sort((a, b) => b[1] - a[1]);

  for (const [word] of sortedWords) {
    tokenToId.set(word, nextId);
    idToToken.set(nextId, word);
    tokens.push({ id: nextId, text: word });
    nextId++;
  }

  return {
    tokens,
    tokenToId,
    idToToken,
    startTokenId,
    endTokenId,
  };
}

/**
 * Encodes a user string into token IDs according to vocabulary
 */
export function encodePrompt(text: string, vocab: Vocabulary): Token[] {
  const words = rawTokenize(text);
  const result: Token[] = [];

  for (const word of words) {
    const id = vocab.tokenToId.get(word);
    if (id !== undefined) {
      result.push({ id, text: word });
    } else {
      result.push({ id: -1, text: `${word} (?)`, isSpecial: true });
    }
  }

  return result;
}
