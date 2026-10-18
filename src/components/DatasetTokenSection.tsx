import React, { useState } from 'react';
import { PredefinedDataset, Token, Vocabulary } from '../types/llm';
import { PREDEFINED_DATASETS } from '../data/defaultDatasets';
import { getTokenColor } from '../utils/tokenizer';
import { BookOpen, HelpCircle, ArrowRight, Check, Sparkles } from 'lucide-react';

interface DatasetTokenSectionProps {
  corpusText: string;
  setCorpusText: (text: string) => void;
  sentences: string[][];
  vocabulary: Vocabulary;
  selectedDatasetId: string;
  setSelectedDatasetId: (id: string) => void;
  onNavigateToWeights: () => void;
  onTriggerTrain: () => void;
  isTraining: boolean;
}

export const DatasetTokenSection: React.FC<DatasetTokenSectionProps> = ({
  corpusText,
  setCorpusText,
  sentences,
  vocabulary,
  selectedDatasetId,
  setSelectedDatasetId,
  onNavigateToWeights,
  onTriggerTrain,
  isTraining,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customPromptTest, setCustomPromptTest] = useState('le chat mange');

  const totalTokens = sentences.reduce((acc, s) => acc + s.length, 0);

  const filteredVocab = vocabulary.tokens.filter(t =>
    t.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectPreset = (dataset: PredefinedDataset) => {
    setSelectedDatasetId(dataset.id);
    setCorpusText(dataset.text);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Concept Introduction */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
            Étape 1 : Les Données d'Entraînement et la Tokenisation
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Un grand modèle de langage (LLM comme GPT ou Gemini) n'a aucune pensée innée. Il commence toujours par un <strong>corpus de texte</strong>. Avant de calculer, il découpe ce texte en fragments appelés <strong>tokens</strong> et leur associe un numéro d'identification unique (Token ID).
          </p>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
            <span>{sentences.length} phrases d'apprentissage</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{totalTokens} tokens au total</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{vocabulary.tokens.length} tokens uniques dans le dictionnaire</span>
          </div>
        </div>
      </div>

      {/* Main 2-Zone Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Zone: Corpus Selector & Live Tokenized Text (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Preset Buttons */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-900">
                Choisir un corpus d'apprentissage
              </label>
              <span className="text-xs text-slate-400">Cliquez pour charger</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PREDEFINED_DATASETS.map(dataset => {
                const isSelected = selectedDatasetId === dataset.id;
                return (
                  <button
                    key={dataset.id}
                    onClick={() => handleSelectPreset(dataset)}
                    className={`p-3 text-left rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-semibold text-slate-900 truncate">
                      {dataset.title}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {dataset.description}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Editable Corpus Box */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-700">
                  Texte brut d'entraînement (éditable en direct)
                </label>
                <span className="text-xs text-slate-400">
                  Une phrase par ligne
                </span>
              </div>
              <textarea
                value={corpusText}
                onChange={e => {
                  setCorpusText(e.target.value);
                  setSelectedDatasetId('custom');
                }}
                rows={7}
                className="w-full font-mono text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all leading-relaxed"
                placeholder="Entrez vos propres phrases pour entraîner le modèle..."
              />
            </div>
          </div>

          {/* Live Tokenization Visualizer */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Visualisation de la Tokenisation en direct
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chaque mot reçoit un identifiant numérique (ID). Notez les balises spéciales <code>&lt;DEBUT&gt;</code> et <code>&lt;FIN&gt;</code> ajoutées à chaque phrase.
                </p>
              </div>
            </div>

            {/* Display tokenized sentences */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {sentences.map((sentence, sIdx) => (
                <div
                  key={sIdx}
                  className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex flex-wrap items-center gap-1.5 text-xs"
                >
                  <span className="text-[10px] text-slate-400 font-mono w-5 shrink-0">
                    #{sIdx + 1}
                  </span>

                  {/* Start Token */}
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-mono bg-slate-200 text-slate-800 border-slate-300"
                    title={`Token ID: ${vocabulary.startTokenId}`}
                  >
                    <span>&lt;DEBUT&gt;</span>
                    <span className="opacity-60 text-[9px] tabular-nums">({vocabulary.startTokenId})</span>
                  </span>

                  {/* Words */}
                  {sentence.map((word, wIdx) => {
                    const tokenId = vocabulary.tokenToId.get(word) ?? -1;
                    const colorClass = getTokenColor(tokenId);
                    return (
                      <span
                        key={wIdx}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-mono transition-transform hover:scale-105 cursor-default ${colorClass}`}
                        title={`Token: "${word}" | ID: ${tokenId}`}
                      >
                        <span className="font-medium">{word}</span>
                        <span className="opacity-60 text-[9px] tabular-nums">({tokenId})</span>
                      </span>
                    );
                  })}

                  {/* End Token */}
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-mono bg-slate-200 text-slate-800 border-slate-300"
                    title={`Token ID: ${vocabulary.endTokenId}`}
                  >
                    <span>&lt;FIN&gt;</span>
                    <span className="opacity-60 text-[9px] tabular-nums">({vocabulary.endTokenId})</span>
                  </span>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-xs text-slate-500">
                Prêt pour l'apprentissage statistique
              </span>
              <button
                onClick={onNavigateToWeights}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer shadow-xs"
              >
                <span>Afficher mon modèle LLM</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Zone: Vocabulary Dictionary & Key Insights (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Vocab Table */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Dictionnaire de Vocabulaire (V)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Taille du vocabulaire : <span className="font-semibold text-slate-700 tabular-nums">{vocabulary.tokens.length} tokens</span>
                </p>
              </div>
            </div>

            <input
              type="text"
              placeholder="Filtrer un token..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />

            <div className="max-h-72 overflow-y-auto border border-slate-100 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 sticky top-0">
                  <tr>
                    <th className="py-2 px-3 font-medium">ID</th>
                    <th className="py-2 px-3 font-medium">Token</th>
                    <th className="py-2 px-3 font-medium text-right">Rôle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredVocab.map(token => (
                    <tr key={token.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2 px-3 font-mono text-slate-500 tabular-nums">
                        {token.id}
                      </td>
                      <td className="py-2 px-3 font-medium text-slate-800">
                        <span className={`px-2 py-0.5 rounded border text-[11px] font-mono ${getTokenColor(token.id)}`}>
                          {token.text}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right text-[11px] text-slate-500">
                        {token.isSpecial ? (
                          <span className="text-indigo-600 font-medium">Balise spéciale</span>
                        ) : (
                          <span>Mot régulier</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Educational Concept Box */}
          <div className="bg-slate-900 text-white rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-indigo-400">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs font-semibold tracking-wide uppercase">
                Ce qu'il faut retenir
              </span>
            </div>
            <h4 className="text-sm font-semibold text-white">
              L'ordinateur ne comprend pas les lettres
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Pour une machine, le mot <em>"chat"</em> n'a aucun sens. En associant chaque token à un nombre entier (son <strong>Token ID</strong>), le modèle peut convertir ces identifiants en coordonnées mathématiques (appelées <em>embeddings</em> ou vecteurs).
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Dans les modèles récents comme GPT-4 ou Gemini, la tokenisation utilise des morceaux de mots (ex: subwords ou BPE) et le vocabulaire compte souvent 32 000 à 100 000 tokens !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
