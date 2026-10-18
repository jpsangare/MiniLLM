import React from 'react';
import { BookOpen, AlertTriangle, Lightbulb, Zap, ShieldAlert, Cpu, ArrowRight } from 'lucide-react';
import { ActiveTab } from './Header';

interface ConceptsGuideProps {
  onGoToData: () => void;
  onGoToGeneration: () => void;
}

export const ConceptsGuide: React.FC<ConceptsGuideProps> = ({
  onGoToData,
  onGoToGeneration,
}) => {
  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
            Comprendre les Mystères des LLM par l'Expérience
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Pourquoi ChatGPT ou Gemini semblent-ils intelligents ? Pourquoi inventent-ils parfois des faits faux (hallucinations) ? Pourquoi ne savent-ils pas compter les lettres dans un mot ? Voici les réponses directes basées sur ce que vous venez d'expérimenter.
          </p>
        </div>
      </div>

      {/* Grid of Key Concepts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Concept 1: Pas de pensée, juste de la statistique */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              1. Les LLM ne "pensent" pas : ils prédisent
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              Quand vous posez une question à un LLM, il ne cherche pas dans une base de données de vérité. Il évalue la question comme un début de texte (prompt) et calcule <strong>quel mot est le plus statistiquement probable pour suivre</strong>.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              L'illusion d'intelligence provient uniquement du fait que le langage humain est hautement structuré et que le modèle a analysé des milliards de pages web.
            </p>
          </div>
        </div>

        {/* Concept 2: Pourquoi les hallucinations arrivent */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              2. D'où viennent les "hallucinations" ?
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              Un LLM n'a aucun mécanisme natif pour dire <em>"je ne sais pas"</em>. Sa seule mission mathématique est de fournir le token suivant avec la plus haute probabilité.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              Si une question porte sur un sujet absent de ses données d'entraînement (ou combinant des contextes contradictoires), il assemblera des mots qui ont l'air grammaticalement convaincants... mais totalement faux dans la réalité !
            </p>
          </div>
        </div>

        {/* Concept 3: Le rôle des données d'entraînement (Garbage In, Garbage Out) */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              3. Vos données définissent tout le savoir du modèle
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              Si le corpus d'apprentissage dit <em>"la Terre est plate"</em>, le modèle attribuera la plus haute probabilité statistique au fait que la Terre est plate.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              C'est pourquoi le tri, le nettoyage et l'alignement des données d'entraînement (RLHF / fine-tuning) représentent plus de 80% du travail des chercheurs en IA.
            </p>
          </div>
        </div>

        {/* Concept 4: La Température */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              4. Le curseur Température : Hasard vs Rigueur
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              La <strong>température</strong> est une formule mathématique (Softmax) appliquée aux scores de chaque mot :
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside mt-2">
              <li><strong>T proche de 0 :</strong> On prend toujours le mot le plus fréquent. Réponse robotique et répétitive.</li>
              <li><strong>T ≈ 0.7 :</strong> Le réglage idéal pour équilibrer créativité et cohérence.</li>
              <li><strong>T &gt; 1.5 :</strong> Tous les mots reçoivent des probabilités proches, le modèle devient délirant.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Interactive Experiments to Try */}
      <div className="bg-slate-900 text-white rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-indigo-400">
          <ShieldAlert className="w-4 h-4" />
          <span className="text-xs font-semibold tracking-wide uppercase">
            3 Expériences pratiques à faire dans cette application
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Exp 1 */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-4 space-y-2">
            <span className="text-xs font-semibold text-indigo-400">
              Expérience A : Créer un fait sur-mesure
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Dans l'onglet <strong>1. Données</strong>, ajoutez la phrase <code>"le chat pilote un avion"</code>. Entraînez le modèle, puis allez dans <strong>3. Inférence</strong> et tapez <code>"le chat"</code> : regardez l'avion apparaître dans les probabilités !
            </p>
            <button
              onClick={onGoToData}
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 pt-2 cursor-pointer"
            >
              <span>Essayer dans l'onglet Données</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Exp 2 */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-4 space-y-2">
            <span className="text-xs font-semibold text-indigo-400">
              Expérience B : Pousser la température à 2.0
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Dans l'onglet <strong>3. Inférence</strong>, réglez la température à 2.0 et lancez la génération automatique. Observez comment la phrase part dans tous les sens car les probabilités sont complètement écrasées.
            </p>
            <button
              onClick={onGoToGeneration}
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 pt-2 cursor-pointer"
            >
              <span>Tester la température</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Exp 3 */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-4 space-y-2">
            <span className="text-xs font-semibold text-indigo-400">
              Expérience C : Charger le corpus "Biais"
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Sélectionnez le corpus <strong>"Démonstrateur de Biais"</strong> : la pomme y est décrite comme bleue et sous la terre. Le modèle n'a aucun moyen de savoir que la pomme est rouge ou dans un arbre !
            </p>
            <button
              onClick={onGoToData}
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 pt-2 cursor-pointer"
            >
              <span>Voir le corpus Biais</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
