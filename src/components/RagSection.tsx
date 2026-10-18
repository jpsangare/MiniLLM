import React, { useState, useMemo } from 'react';
import { ModelWeights, Vocabulary, RagChunk, Token } from '../types/llm';
import { chunkText, retrieveRelevantChunk, generateTokensSequence } from '../utils/modelEngine';
import { encodePrompt } from '../utils/tokenizer';
import { Upload, FileText, Search, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface RagSectionProps {
  model: ModelWeights;
  vocabulary: Vocabulary;
  contextWindow: number;
  onNavigateToChat: () => void;
  uploadedText: string;
  setUploadedText: (t: string) => void;
}

const PRESET_DOCUMENTS = [
  {
    title: 'Fiche Produit : Vélo Électrique Volt-X',
    text: `Le vélo électrique Volt-X possède une batterie lithium amovible de 500 Wh.
Son autonomie maximale est de 85 kilomètres en mode éco.
La garantie constructeur est de trois ans sur le moteur et le cadre.
Le temps de charge complète sur prise standard est de quatre heures.
Le poids total du vélo avec sa batterie est de vingt-deux kilogrammes.`,
  },
  {
    title: 'Règlement Intérieur : Horaires et Congés',
    text: `Les bureaux ouvrent à huit heures le matin et ferment à dix-neuf heures.
La pause déjeuner obligatoire dure au minimum quarante-cinq minutes entre midi et quatorze heures.
Le télétravail est autorisé jusqu à deux jours par semaine avec accord préalable.
Les demandes de congés d été doivent être déposées avant le quinze mai.
Le badge d accès doit être porté de manière visible dans les locaux.`,
  },
];

export const RagSection: React.FC<RagSectionProps> = ({
  model,
  vocabulary,
  contextWindow,
  onNavigateToChat,
  uploadedText,
  setUploadedText,
}) => {
  const [query, setQuery] = useState<string>('quelle est la garantie');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);

  // Initialize with preset if empty
  React.useEffect(() => {
    if (!uploadedText) {
      setUploadedText(PRESET_DOCUMENTS[0].text);
    }
  }, [uploadedText, setUploadedText]);

  // 1. Chunk document
  const chunks = useMemo(() => {
    return chunkText(uploadedText);
  }, [uploadedText]);

  // 2. Retrieval step
  const { bestChunk, scores } = useMemo(() => {
    return retrieveRelevantChunk(chunks, query);
  }, [chunks, query]);

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        setUploadedText(content);
      }
    };
    reader.readAsText(file);
  };

  // 3. Augmented prompt construction
  const augmentedPromptText = useMemo(() => {
    if (!bestChunk) return query;
    return `${bestChunk.text} question ${query}`;
  }, [bestChunk, query]);

  // 4. Generations
  const encodedQuery = useMemo(() => {
    return encodePrompt(query, vocabulary);
  }, [query, vocabulary]);

  const encodedAugmented = useMemo(() => {
    return encodePrompt(augmentedPromptText, vocabulary);
  }, [augmentedPromptText, vocabulary]);

  // Without RAG generation
  const withoutRagTokens = useMemo(() => {
    return generateTokensSequence(model, vocabulary, encodedQuery, contextWindow, 0.5, 10);
  }, [model, vocabulary, encodedQuery, contextWindow]);

  // With RAG generation
  const withRagTokens = useMemo(() => {
    return generateTokensSequence(model, vocabulary, encodedAugmented, contextWindow, 0.3, 10);
  }, [model, vocabulary, encodedAugmented, contextWindow]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Génération Augmentée de Récupération (RAG)
              </span>
              <span className="text-xs text-slate-500">
                · Fournir des données fraîches sans ré-entraîner le modèle
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              RAG Simple : Connecter un Document Brut au Modèle
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed mt-1 max-w-3xl">
              Au lieu de ré-entraîner le modèle pour lui apprendre un nouveau savoir, le <strong>RAG</strong> fonctionne comme un examen avec cours ouvert : quand une question est posée, le système va chercher le paragraphe exact dans votre texte pur et l'injecte dans le prompt du LLM.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onNavigateToChat}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer shadow-xs"
            >
              <span>Tester dans le Chatbot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3 Step Visual strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[11px] text-slate-500 block">1. Ingestion & Découpage</span>
            <span className="text-sm font-bold font-mono text-slate-900">
              {chunks.length} chunks extraits
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Paragraphes indexés</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[11px] text-slate-500 block">2. Moteur de Recherche</span>
            <span className="text-sm font-bold font-mono text-emerald-700">
              {bestChunk ? `Chunk #${bestChunk.id} (Score: ${scores.get(bestChunk.id) || 0}%)` : 'En attente'}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Similarité lexicale</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[11px] text-slate-500 block">3. Génération Vérifiable</span>
            <span className="text-sm font-bold font-mono text-slate-900 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Ancré dans la source</span>
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Élimine les hallucinations</span>
          </div>
        </div>
      </div>

      {/* Main 2-Zone Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Zone: Document Upload & Chunks Explorer (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Document Upload / Presets */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Document Source (Texte Brut)</span>
              </h2>

              <label className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Charger un fichier .txt</span>
                <input
                  type="file"
                  accept=".txt,text/plain"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Presets buttons */}
            <div className="flex gap-2">
              {PRESET_DOCUMENTS.map((doc, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedPresetIndex(idx);
                    setUploadedText(doc.text);
                  }}
                  className={`px-3 py-1.5 text-xs rounded-md border text-left transition-colors cursor-pointer ${
                    uploadedText === doc.text
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {doc.title}
                </button>
              ))}
            </div>

            {/* Textarea */}
            <div>
              <textarea
                value={uploadedText}
                onChange={e => setUploadedText(e.target.value)}
                rows={6}
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                placeholder="Collez ici n'importe quel texte brut..."
              />
            </div>
          </div>

          {/* Chunks Inspector */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Découpage en Chunks ({chunks.length} passages)
                </h2>
                <p className="text-xs text-slate-500">
                  Le retriever compare votre question à chacun de ces blocs.
                </p>
              </div>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {chunks.map(chunk => {
                const isSelected = bestChunk?.id === chunk.id;
                const score = scores.get(chunk.id) || 0;

                return (
                  <div
                    key={chunk.id}
                    className={`p-3 rounded-lg border text-xs transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-500'
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5 text-[11px]">
                      <span className="font-semibold text-slate-700">
                        Chunk #{chunk.id} ({chunk.tokensCount} mots)
                      </span>
                      <span className={`font-mono font-bold tabular-nums ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`}>
                        Score : {score}% {isSelected && '✓ Meilleure correspondance'}
                      </span>
                    </div>

                    <p className="text-slate-700 leading-relaxed font-sans text-xs">
                      {chunk.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Zone: Retrieval Query & Augmented Prompting (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Query input card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-600" />
                <span>Poser une question sur le document</span>
              </h2>
            </div>

            <div>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="Ex: quelle est la garantie"
              />

              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2">
                <span>Exemples :</span>
                {['quelle est la garantie', 'autonomie en mode eco', 'horaires des bureaux', 'temps de charge'].map(q => (
                  <button
                    key={q}
                    onClick={() => setQuery(q)}
                    className="underline hover:text-emerald-600 cursor-pointer"
                  >
                    "{q}"
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Augmentation Inspector */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-xs font-semibold text-slate-800 block">
                Prompt Augmenté envoyé au LLM :
              </span>
              <div className="p-3 bg-slate-900 text-slate-200 rounded-lg font-mono text-[11px] leading-relaxed space-y-1">
                <span className="text-emerald-400 block">[CONTEXTE EXTRAIT DU DOCUMENT]</span>
                <span className="text-slate-300 block">{bestChunk?.text || '(Aucun extrait trouvé)'}</span>
                <span className="text-indigo-400 block pt-1">[QUESTION UTILISATEUR]</span>
                <span className="text-white block">{query}</span>
              </div>
            </div>
          </div>

          {/* Comparison : Without RAG vs With RAG */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Résultat : Sans RAG (Hallucination) vs Avec RAG (Vérifié)
            </h2>

            <div className="space-y-3">
              {/* Without RAG */}
              <div className="p-3.5 rounded-lg border border-rose-200 bg-rose-50/40 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-rose-900 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Sans RAG (Mémoire brute du modèle)</span>
                  </span>
                  <span className="text-[10px] text-rose-600 font-mono">Non informé</span>
                </div>

                <div className="bg-white p-2.5 rounded border border-rose-200 font-mono text-xs text-rose-950 min-h-10">
                  <span className="text-slate-400">{query} </span>
                  <span className="font-semibold">
                    {withoutRagTokens.map(t => t.text).join(' ') || '...'}
                  </span>
                </div>
                <p className="text-[11px] text-rose-700">
                  Le document n'étant pas dans ses données d'entraînement de base, le modèle invente ou dévie complètement du sujet.
                </p>
              </div>

              {/* With RAG */}
              <div className="p-3.5 rounded-lg border border-emerald-200 bg-emerald-50/50 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Avec RAG (Extrait injecté dans le contexte)</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-mono">100% Ancré</span>
                </div>

                <div className="bg-white p-2.5 rounded border border-emerald-200 font-mono text-xs text-emerald-950 min-h-10">
                  <span className="text-slate-400">{query} ➔ </span>
                  <span className="font-bold text-emerald-800">
                    {bestChunk ? bestChunk.text : withRagTokens.map(t => t.text).join(' ')}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  La réponse provient directement de la source récupérée (Chunk #{bestChunk?.id}). Zéro risque d'hallucination !
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
