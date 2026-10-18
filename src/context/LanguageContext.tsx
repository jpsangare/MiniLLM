import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LANGUAGE_STORAGE_KEY = 'minillm_language';

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  fr: {
    // Top Header & Global
    'app.title': 'MiniLLM Studio',
    'app.subtitle': 'Laboratoire didactique & interactif d’apprentissage des modèles de langage',
    'header.expandSidebar': 'Déplier la bande latérale',
    'header.collapseSidebar': 'Replier la bande latérale',
    'header.expand': 'Déplier',
    'header.collapse': 'Replier',
    'header.openMenu': 'Ouvrir le menu latéral',
    'header.vocab': 'Vocabulaire',
    'header.words': 'mots',
    'header.corpus': 'Corpus',
    'header.tokens': 'tokens',
    'header.code': 'Code & Fonctions',
    'header.codeTooltip': 'Consulter la cartographie des fonctions et le code source',
    'header.reset': 'Réinitialiser',
    'header.resetTooltip': 'Réinitialiser l’application aux paramètres par défaut',
    'header.lang': 'Langue',
    'header.langTooltip': 'Changer la langue de l’interface (Français / English)',

    // Breadcrumb sections
    'section.discovery': 'Découverte',
    'section.assessment': 'Évaluation',
    'section.baseModel': '1. Modèle de Base',
    'section.alignment': '2. Alignement & RL',
    'section.apps': '3. Applications',
    'section.docs': 'Documentation',

    // Tab titles
    'tab.userguide': 'Guide d’Utilisation & Concepts Clés',
    'tab.prerequisites': 'Prérequis Mathématiques & Notions Clés',
    'tab.glossary': 'Glossaire & Lexique Technique',
    'tab.quiz': 'Grand Quiz des Connaissances LLM',
    'tab.donnees': 'Étape 1 · Données & Tokenisation',
    'tab.modele': 'Mon Modèle · Architecture & Espace 2D',
    'tab.matrice': 'Étape 2 · Poids, Matrice & Export JSON',
    'tab.generation': 'Étape 3 · Inférence, Softmax, Attention & Gradients',
    'tab.finetune': 'Étape 4a · Fine-Tuning Supervisé (SFT)',
    'tab.rlhf': 'Étape 4b · Renforcement par Préférences (RLHF / DPO)',
    'tab.rag': 'Étape 5a · RAG Simple · Documents & Ancrage',
    'tab.chat': 'Étape 5b · Chatbot Multi-Moteur (Base, SFT, RLHF, RAG)',
    'tab.guide': 'Cartographie des Fonctions & Code Source',

    // Sidebar navigation groups
    'nav.group.discovery': 'DÉCOUVERTE & FONDATIONS',
    'nav.group.base': '1. MODÈLE DE BASE',
    'nav.group.alignment': '2. ALIGNEMENT & RL',
    'nav.group.apps': '3. APPLICATIONS',
    'nav.group.resources': '4. RESSOURCES',
    'nav.group.docs': 'DOCUMENTATION',

    // Sidebar items
    'nav.userguide': '0. Guide Découverte',
    'nav.userguide.short': 'Guide',
    'nav.prerequisites': '0. Prérequis & Notions',
    'nav.prerequisites.short': 'Prérequis',
    'nav.prerequisites.badge': '3 Clés',
    'nav.glossary': 'Glossaire & Lexique',
    'nav.glossary.short': 'Glossaire',
    'nav.glossary.badge': 'Recherche',
    'nav.quiz': 'Grand Quiz LLM',
    'nav.quiz.short': 'Quiz',
    'nav.quiz.badge': '8 Q.',
    'nav.donnees': '1. Données & Tokens',
    'nav.donnees.short': '1. Données',
    'nav.modele': 'Mon Modèle (2D)',
    'nav.modele.short': 'Modèle 2D',
    'nav.matrice': '2. Poids & Matrice',
    'nav.matrice.short': '2. Poids',
    'nav.generation': '3. Inférence & Softmax',
    'nav.generation.short': '3. Inférence',
    'nav.finetune': '4. Fine-Tuning (SFT)',
    'nav.finetune.short': '4. Fine-Tune',
    'nav.rlhf': '4. Renforcement (RLHF/DPO)',
    'nav.rlhf.short': '4. RLHF/DPO',
    'nav.rag': '5. RAG Simple',
    'nav.rag.short': '5. RAG',
    'nav.chat': '5. Chatbot Multi-Moteur',
    'nav.chat.short': '5. Chatbot',
    'nav.guide': 'Code & Fonctions',
    'nav.guide.short': 'Code',

    // Sub-navigation bar
    'subnav.dataTokens': 'Données & Tokens',
    'subnav.myModel': 'Mon Modèle',
    'subnav.weightsMatrix': 'Poids & Matrice',
    'subnav.inferenceSoftmax': 'Inférence & Softmax',
    'subnav.sft': 'Fine-Tuning SFT',
    'subnav.rlhf': 'Renforcement RLHF',

    // Dataset & Tokenization section
    'data.banner.title': 'Étape 1 : Les Données d\'Entraînement et la Tokenisation',
    'data.banner.desc': 'Un grand modèle de langage (LLM comme GPT ou Gemini) n\'a aucune pensée innée. Il commence toujours par un corpus de texte. Avant de calculer, il découpe ce texte en fragments appelés tokens et leur associe un numéro d\'identification unique (Token ID).',
    'data.banner.sentences': 'phrases d\'apprentissage',
    'data.banner.totalTokens': 'tokens au total',
    'data.banner.uniqueTokens': 'tokens uniques dans le dictionnaire',
    'data.corpus.choose': 'Choisir un corpus d\'apprentissage',
    'data.corpus.clickToLoad': 'Cliquez pour charger',
    'data.corpus.filterAll': 'Tous',
    'data.corpus.filterFr': '🇫🇷 Français',
    'data.corpus.filterEn': '🇬🇧 English',
    'data.corpus.rawLabel': 'Texte brut d\'entraînement (éditable en direct)',
    'data.corpus.oneLine': 'Une phrase par ligne',
    'data.corpus.placeholder': 'Entrez vos propres phrases pour entraîner le modèle...',
    'data.corpus.suggestedPrompt': 'Prompt suggéré',
    'data.live.title': 'Visualisation de la Tokenisation en direct',
    'data.live.desc': 'Chaque mot reçoit un identifiant numérique (ID). Notez les balises spéciales <DEBUT> et <FIN> ajoutées à chaque phrase.',
    'data.live.ready': 'Prêt pour l\'apprentissage statistique',
    'data.live.nextBtn': 'Afficher mon modèle LLM',
    'data.vocab.title': 'Dictionnaire de Vocabulaire (V)',
    'data.vocab.size': 'Taille du vocabulaire :',
    'data.vocab.search': 'Filtrer un token...',
    'data.vocab.colId': 'ID',
    'data.vocab.colToken': 'Token',
    'data.vocab.colRole': 'Rôle',
    'data.vocab.specialTag': 'Balise spéciale',
    'data.vocab.regularWord': 'Mot régulier',
    'data.takeaway.title': 'Ce qu\'il faut retenir',
    'data.takeaway.heading': 'L\'ordinateur ne comprend pas les lettres',
    'data.takeaway.p1': 'Pour une machine, le mot "chat" n\'a aucun sens. En associant chaque token à un nombre entier (son Token ID), le modèle peut convertir ces identifiants en coordonnées mathématiques (appelées embeddings ou vecteurs).',
    'data.takeaway.p2': 'Dans les modèles récents comme GPT-4 ou Gemini, la tokenisation utilise des morceaux de mots (ex: subwords ou BPE) et le vocabulaire compte souvent 32 000 à 100 000 tokens !',
    'data.switchLangCorpus': 'Charger le corpus équivalent en anglais ?',
    'data.switchLangCorpusBtn': 'Charger corpus EN',

    // Footer
    'footer.builtWith': 'Laboratoire Didactique d’Apprentissage des Modèles de Langage (LLM)',
    'footer.guide': 'Guide',
    'footer.quiz': 'Grand Quiz',
    'footer.data': 'Données',
    'footer.model': 'Modèle',
    'footer.weights': 'Poids',
    'footer.inference': 'Inférence',
    'footer.code': 'Code',
  },
  en: {
    // Top Header & Global
    'app.title': 'MiniLLM Studio',
    'app.subtitle': 'Interactive Didactic Laboratory for Learning Language Models',
    'header.expandSidebar': 'Expand sidebar',
    'header.collapseSidebar': 'Collapse sidebar',
    'header.expand': 'Expand',
    'header.collapse': 'Collapse',
    'header.openMenu': 'Open side menu',
    'header.vocab': 'Vocabulary',
    'header.words': 'words',
    'header.corpus': 'Corpus',
    'header.tokens': 'tokens',
    'header.code': 'Code & Functions',
    'header.codeTooltip': 'Browse code architecture and functions map',
    'header.reset': 'Reset',
    'header.resetTooltip': 'Reset application to default settings',
    'header.lang': 'Language',
    'header.langTooltip': 'Switch interface language (French / English)',

    // Breadcrumb sections
    'section.discovery': 'Discovery',
    'section.assessment': 'Assessment',
    'section.baseModel': '1. Base Model',
    'section.alignment': '2. Alignment & RL',
    'section.apps': '3. Applications',
    'section.docs': 'Documentation',

    // Tab titles
    'tab.userguide': 'User Guide & Key Concepts',
    'tab.prerequisites': 'Mathematical Prerequisites & Core Concepts',
    'tab.glossary': 'Technical Glossary & Lexicon',
    'tab.quiz': 'Grand LLM Knowledge Quiz',
    'tab.donnees': 'Step 1 · Data & Tokenization',
    'tab.modele': 'My Model · Architecture & 2D Space',
    'tab.matrice': 'Step 2 · Weights, Matrix & JSON Export',
    'tab.generation': 'Step 3 · Inference, Softmax, Attention & Gradients',
    'tab.finetune': 'Step 4a · Supervised Fine-Tuning (SFT)',
    'tab.rlhf': 'Step 4b · Reinforcement via Preferences (RLHF / DPO)',
    'tab.rag': 'Step 5a · Simple RAG · Documents & Grounding',
    'tab.chat': 'Step 5b · Multi-Engine Chatbot (Base, SFT, RLHF, RAG)',
    'tab.guide': 'Functions Map & Source Code',

    // Sidebar navigation groups
    'nav.group.discovery': 'DISCOVERY & FOUNDATIONS',
    'nav.group.base': '1. BASE MODEL',
    'nav.group.alignment': '2. ALIGNMENT & CONTROL',
    'nav.group.apps': '3. APPLICATIONS',
    'nav.group.resources': '4. RESOURCES',
    'nav.group.docs': 'DOCUMENTATION',

    // Sidebar items
    'nav.userguide': '0. Discovery Guide',
    'nav.userguide.short': 'Guide',
    'nav.prerequisites': '0. Prerequisites & Concepts',
    'nav.prerequisites.short': 'Prerequisites',
    'nav.prerequisites.badge': '3 Keys',
    'nav.glossary': 'Technical Glossary',
    'nav.glossary.short': 'Glossary',
    'nav.glossary.badge': 'Search',
    'nav.quiz': 'Grand LLM Quiz',
    'nav.quiz.short': 'Quiz',
    'nav.quiz.badge': '8 Q.',
    'nav.donnees': '1. Data & Tokens',
    'nav.donnees.short': '1. Data',
    'nav.modele': 'My Model (2D)',
    'nav.modele.short': 'Model 2D',
    'nav.matrice': '2. Weights & Matrix',
    'nav.matrice.short': '2. Weights',
    'nav.generation': '3. Inference & Softmax',
    'nav.generation.short': '3. Inference',
    'nav.finetune': '4. Fine-Tuning (SFT)',
    'nav.finetune.short': '4. Fine-Tune',
    'nav.rlhf': '4. Reinforcement (RLHF/DPO)',
    'nav.rlhf.short': '4. RLHF/DPO',
    'nav.rag': '5. Simple RAG',
    'nav.rag.short': '5. RAG',
    'nav.chat': '5. Multi-Engine Chatbot',
    'nav.chat.short': '5. Chatbot',
    'nav.guide': 'Code & Functions',
    'nav.guide.short': 'Code',

    // Sub-navigation bar
    'subnav.dataTokens': 'Data & Tokens',
    'subnav.myModel': 'My Model',
    'subnav.weightsMatrix': 'Weights & Matrix',
    'subnav.inferenceSoftmax': 'Inference & Softmax',
    'subnav.sft': 'Supervised Fine-Tuning',
    'subnav.rlhf': 'Reinforcement RLHF',

    // Dataset & Tokenization section
    'data.banner.title': 'Step 1: Training Data and Tokenization',
    'data.banner.desc': 'A large language model (LLM like GPT or Gemini) has no innate knowledge. It always begins with a text corpus. Before computing, it segments this text into chunks called tokens and assigns each a unique numerical ID (Token ID).',
    'data.banner.sentences': 'training sentences',
    'data.banner.totalTokens': 'total tokens',
    'data.banner.uniqueTokens': 'unique tokens in vocabulary',
    'data.corpus.choose': 'Select a training corpus',
    'data.corpus.clickToLoad': 'Click to load',
    'data.corpus.filterAll': 'All',
    'data.corpus.filterFr': '🇫🇷 Français',
    'data.corpus.filterEn': '🇬🇧 English',
    'data.corpus.rawLabel': 'Raw Training Text (Live Editable)',
    'data.corpus.oneLine': 'One sentence per line',
    'data.corpus.placeholder': 'Enter your own sentences to train the model...',
    'data.corpus.suggestedPrompt': 'Suggested prompt',
    'data.live.title': 'Live Tokenization Visualization',
    'data.live.desc': 'Each word receives a numerical identifier (ID). Notice the special tags <DEBUT> and <FIN> added to each sentence.',
    'data.live.ready': 'Ready for statistical training',
    'data.live.nextBtn': 'Display my LLM model',
    'data.vocab.title': 'Vocabulary Dictionary (V)',
    'data.vocab.size': 'Vocabulary size:',
    'data.vocab.search': 'Filter a token...',
    'data.vocab.colId': 'ID',
    'data.vocab.colToken': 'Token',
    'data.vocab.colRole': 'Role',
    'data.vocab.specialTag': 'Special tag',
    'data.vocab.regularWord': 'Regular word',
    'data.takeaway.title': 'Key Takeaway',
    'data.takeaway.heading': 'Computers do not understand letters',
    'data.takeaway.p1': 'To a machine, the word "cat" has no meaning. By mapping each token to an integer (its Token ID), the model converts these identifiers into mathematical coordinates (called embeddings or vectors).',
    'data.takeaway.p2': 'In modern models like GPT-4 or Gemini, tokenization uses word pieces (e.g., subwords or BPE) and the vocabulary often spans 32,000 to 100,000 tokens!',
    'data.switchLangCorpus': 'Load the English equivalent corpus?',
    'data.switchLangCorpusBtn': 'Load EN corpus',

    // Footer
    'footer.builtWith': 'Interactive Didactic Laboratory for Learning Language Models (LLM)',
    'footer.guide': 'Guide',
    'footer.quiz': 'Grand Quiz',
    'footer.data': 'Data',
    'footer.model': 'Model',
    'footer.weights': 'Weights',
    'footer.inference': 'Inference',
    'footer.code': 'Code',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
      if (saved === 'fr' || saved === 'en') {
        return saved;
      }
    } catch {
      // fallback
    }
    return 'fr';
  });

  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      document.documentElement.lang = language;
    } catch {
      // ignore
    }
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState(prev => (prev === 'fr' ? 'en' : 'fr'));
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      let str = TRANSLATIONS[language]?.[key] ?? TRANSLATIONS['fr']?.[key] ?? key;
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          str = str.replace(new RegExp(`{${k}}`, 'g'), String(v));
        });
      }
      return str;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
