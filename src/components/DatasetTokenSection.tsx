import React, { useState, useMemo } from 'react';
import { PredefinedDataset, Vocabulary } from '../types/llm';
import { PREDEFINED_DATASETS } from '../data/defaultDatasets';
import { getTokenColor } from '../utils/tokenizer';
import { BookOpen, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

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
}) => {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [langFilter, setLangFilter] = useState<'all' | 'fr' | 'en'>(language);

  // Sync langFilter with global language if changed
  React.useEffect(() => {
    setLangFilter(language);
  }, [language]);

  const totalTokens = sentences.reduce((acc, s) => acc + s.length, 0);

  const filteredDatasets = useMemo(() => {
    if (langFilter === 'all') return PREDEFINED_DATASETS;
    return PREDEFINED_DATASETS.filter(d => d.lang === langFilter);
  }, [langFilter]);

  const filteredVocab = vocabulary.tokens.filter(t =>
    t.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectPreset = (dataset: PredefinedDataset) => {
    setSelectedDatasetId(dataset.id);
    setCorpusText(dataset.text);
  };

  const isEnglish = language === 'en';

  return (
    <div className="space-y-6">
      {/* Top Banner: Concept Introduction */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 transition-colors duration-200">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2">
            {t('data.banner.title')}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            {t('data.banner.desc')}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span>{sentences.length} {t('data.banner.sentences')}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{totalTokens} {t('data.banner.totalTokens')}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{vocabulary.tokens.length} {t('data.banner.uniqueTokens')}</span>
          </div>
        </div>
      </div>

      {/* Main 2-Zone Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Zone: Corpus Selector & Live Tokenized Text (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Preset Buttons */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 transition-colors duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {t('data.corpus.choose')}
                </label>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  {t('data.corpus.clickToLoad')}
                </p>
              </div>

              {/* Language filter for datasets */}
              <div className="inline-flex items-center p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 self-start sm:self-auto text-xs">
                <button
                  type="button"
                  onClick={() => setLangFilter('all')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    langFilter === 'all'
                      ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-2xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {t('data.corpus.filterAll')}
                </button>
                <button
                  type="button"
                  onClick={() => setLangFilter('fr')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    langFilter === 'fr'
                      ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-2xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {t('data.corpus.filterFr')}
                </button>
                <button
                  type="button"
                  onClick={() => setLangFilter('en')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    langFilter === 'en'
                      ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-2xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {t('data.corpus.filterEn')}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {filteredDatasets.map(dataset => {
                const isSelected = selectedDatasetId === dataset.id;
                return (
                  <button
                    key={dataset.id}
                    onClick={() => handleSelectPreset(dataset)}
                    className={`p-3 text-left rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/50 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {dataset.title}
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-sm font-semibold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
                        {dataset.lang === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                      {dataset.description}
                    </div>
                    {dataset.suggestedPrompt && (
                      <div className="mt-2 text-[10px] text-indigo-600 dark:text-indigo-400 font-mono truncate">
                        Prompt : "{dataset.suggestedPrompt}"
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Editable Corpus Box */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {t('data.corpus.rawLabel')}
                </label>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {t('data.corpus.oneLine')}
                </span>
              </div>
              <textarea
                value={corpusText}
                onChange={e => {
                  setCorpusText(e.target.value);
                  setSelectedDatasetId('custom');
                }}
                rows={7}
                className="w-full font-mono text-xs text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all leading-relaxed"
                placeholder={t('data.corpus.placeholder')}
              />
            </div>
          </div>

          {/* Live Tokenization Visualizer */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {t('data.live.title')}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isEnglish
                    ? 'Each word receives a numerical identifier (ID). Note the special tags <START> and <END> added to each sequence.'
                    : 'Chaque mot reçoit un identifiant numérique (ID). Notez les balises spéciales <DEBUT> et <FIN> ajoutées à chaque phrase.'}
                </p>
              </div>
            </div>

            {/* Display tokenized sentences */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {sentences.map((sentence, sIdx) => (
                <div
                  key={sIdx}
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-1.5 text-xs"
                >
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono w-5 shrink-0">
                    #{sIdx + 1}
                  </span>

                  {/* Start Token */}
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-mono bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600"
                    title={`Token ID: ${vocabulary.startTokenId}`}
                  >
                    <span>{isEnglish ? '<START>' : '<DEBUT>'}</span>
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
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-mono bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600"
                    title={`Token ID: ${vocabulary.endTokenId}`}
                  >
                    <span>{isEnglish ? '<END>' : '<FIN>'}</span>
                    <span className="opacity-60 text-[9px] tabular-nums">({vocabulary.endTokenId})</span>
                  </span>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {t('data.live.ready')}
              </span>
              <button
                onClick={onNavigateToWeights}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <span>{t('data.live.nextBtn')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Zone: Vocabulary Dictionary & Key Insights (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Vocab Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {t('data.vocab.title')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t('data.vocab.size')}{' '}
                  <span className="font-semibold text-slate-700 dark:text-slate-200 tabular-nums">
                    {vocabulary.tokens.length} {t('header.tokens')}
                  </span>
                </p>
              </div>
            </div>

            <input
              type="text"
              placeholder={t('data.vocab.search')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />

            <div className="max-h-72 overflow-y-auto border border-slate-100 dark:border-slate-800 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 sticky top-0">
                  <tr>
                    <th className="py-2 px-3 font-medium">{t('data.vocab.colId')}</th>
                    <th className="py-2 px-3 font-medium">{t('data.vocab.colToken')}</th>
                    <th className="py-2 px-3 font-medium text-right">{t('data.vocab.colRole')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredVocab.map(token => (
                    <tr key={token.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-2 px-3 font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                        {token.id}
                      </td>
                      <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200">
                        <span className={`px-2 py-0.5 rounded border text-[11px] font-mono ${getTokenColor(token.id)}`}>
                          {token.text}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right text-[11px] text-slate-500 dark:text-slate-400">
                        {token.isSpecial ? (
                          <span className="text-indigo-600 dark:text-indigo-400 font-medium">{t('data.vocab.specialTag')}</span>
                        ) : (
                          <span>{t('data.vocab.regularWord')}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Educational Concept Box */}
          <div className="bg-slate-900 text-white rounded-xl p-5 space-y-3 shadow-md">
            <div className="flex items-center gap-2 text-indigo-400">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs font-semibold tracking-wide uppercase">
                {t('data.takeaway.title')}
              </span>
            </div>
            <h4 className="text-sm font-semibold text-white">
              {t('data.takeaway.heading')}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t('data.takeaway.p1')}
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t('data.takeaway.p2')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
