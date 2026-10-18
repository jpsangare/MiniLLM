import { Token, Vocabulary } from '../types/llm';

export const START_TOKEN = '<DEBUT>';
export const END_TOKEN = '<FIN>';
export const UNKNOWN_TOKEN = '<INCONNU>';

// Palette of pleasing distinct token background colors for visualization
export const TOKEN_COLORS = [
  'bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  'bg-purple-50 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  'bg-rose-50 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  'bg-cyan-50 dark:bg-cyan-950/70 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
  'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  'bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800',
  'bg-orange-50 dark:bg-orange-950/70 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800',
  'bg-pink-50 dark:bg-pink-950/70 text-pink-800 dark:text-pink-300 border-pink-200 dark:border-pink-800',
  'bg-lime-50 dark:bg-lime-950/70 text-lime-800 dark:text-lime-300 border-lime-200 dark:border-lime-800',
  'bg-violet-50 dark:bg-violet-950/70 text-violet-800 dark:text-violet-300 border-violet-200 dark:border-violet-800',
];

export function getTokenColor(tokenId: number): string {
  if (tokenId < 0) return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700';
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
