import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  ArrowRight,
  Filter,
  Sparkles,
  ExternalLink,
  Layers,
  Cpu,
  Sliders,
  FileText,
  Flame,
  Award,
} from 'lucide-react';
import { ActiveTab } from './Header';
import { useLanguage } from '../context/LanguageContext';

interface GlossarySectionProps {
  onNavigate: (tab: ActiveTab) => void;
}

interface GlossaryTerm {
  id: string;
  term: string;
  termEn: string;
  category: 'fondamentaux' | 'architecture' | 'entrainement' | 'alignement' | 'rag';
  shortDefFr: string;
  shortDefEn: string;
  fullDefFr: string;
  fullDefEn: string;
  inAppFr: string;
  inAppEn: string;
  inRealLlmFr?: string;
  inRealLlmEn?: string;
  relatedTab?: ActiveTab;
  tabLabelFr?: string;
  tabLabelEn?: string;
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'token',
    term: 'Token & Tokenisation',
    termEn: 'Token & Tokenization',
    category: 'fondamentaux',
    shortDefFr: 'Découpage du texte brut en jetons élémentaires (mots ou sous-mots) associés à un identifiant entier (Token ID).',
    shortDefEn: 'Segmenting raw text into elementary units (words or sub-words) mapped to an integer Token ID.',
    fullDefFr: 'La tokenisation est la première étape du pipeline. Les réseaux neuronaux ne traitent pas directement des caractères textuels mais des suites d\'identifiants entiers.',
    fullDefEn: 'Tokenization is the first pipeline step. Neural networks process integer sequences, not raw characters.',
    inAppFr: 'Dans cette simulation jouet : chaque mot séparé par un espace ou une ponctuation devient un token unique, coloré et indexé.',
    inAppEn: 'In this toy simulation: each word separated by whitespace/punctuation becomes an indexed, colored token.',
    inRealLlmFr: 'Dans un vrai LLM : utilisation d\'algorithmes de sous-mots (BPE, WordPiece, SentencePiece) avec un vocabulaire de ~32 000 à 128 000 tokens.',
    inRealLlmEn: 'In real LLMs: sub-word tokenizers (BPE, SentencePiece) with ~32k to 128k vocabulary entries.',
    relatedTab: 'donnees',
    tabLabelFr: 'Voir l’Étape 1 : Données & Tokens',
    tabLabelEn: 'View Step 1: Data & Tokens',
  },
  {
    id: 'logits',
    term: 'Logits',
    termEn: 'Logits',
    category: 'architecture',
    shortDefFr: 'Scores numériques bruts non normalisés calculés par le modèle pour chaque mot du vocabulaire avant la fonction Softmax.',
    shortDefEn: 'Raw unnormalized numerical scores computed by the model for every vocabulary word prior to Softmax.',
    fullDefFr: 'Les logits représentent les pré-activations de la dernière couche du modèle. Plus le logit d’un token est élevé, plus le modèle le favorise pour continuer la phrase.',
    fullDefEn: 'Logits represent final layer pre-activations. Higher logit values indicate higher preference by the model.',
    inAppFr: 'Dans cette simulation : les logits correspondent aux fréquences de transition ou aux scores logarithmiques dérivés des co-occurrences observées.',
    inAppEn: 'In this simulation: logits are derived from log transition frequencies between words.',
    inRealLlmFr: 'Dans un vrai LLM : le produit scalaire entre le vecteur d’état caché final et la matrice de projection de vocabulaire (Unembedding matrix).',
    inRealLlmEn: 'In real LLMs: dot product between final hidden state vector and the vocabulary unembedding matrix.',
    relatedTab: 'generation',
    tabLabelFr: 'Voir l’Inférence & Logits',
    tabLabelEn: 'View Inference & Logits',
  },
  {
    id: 'softmax',
    term: 'Softmax',
    termEn: 'Softmax',
    category: 'architecture',
    shortDefFr: 'Fonction mathématique transformant un vecteur de logits en une distribution de probabilités comprise entre 0 et 1 (somme = 100%).',
    shortDefEn: 'Mathematical function converting raw logits into a valid probability distribution summing to 1.0 (100%).',
    fullDefFr: 'Formule : P(i) = exp(z_i / T) / sum(exp(z_j / T)). Elle accentue les écarts entre les tokens les plus favorisés tout en garantissant une distribution exploitable.',
    fullDefEn: 'Formula: P(i) = exp(z_i / T) / sum(exp(z_j / T)). Amplifies differences between candidates while normalizing.',
    inAppFr: 'Dans cette simulation : vous pouvez voir en temps réel comment la formule Softmax transforme les logits bruts en pourcentages de sélection.',
    inAppEn: 'In this simulation: watch the Softmax function transform raw logits into pick percentages in real time.',
    inRealLlmFr: 'Dans un vrai LLM : appliquée à la toute dernière couche pour sélectionner le token de sortie.',
    inRealLlmEn: 'In real LLMs: applied at the very last layer before autoregressive sampling.',
    relatedTab: 'generation',
    tabLabelFr: 'Explorer la formule Softmax',
    tabLabelEn: 'Explore Softmax Formula',
  },
  {
    id: 'temperature',
    term: 'Température (T)',
    termEn: 'Temperature (T)',
    category: 'architecture',
    shortDefFr: 'Hyperparamètre d’inférence divisant les logits dans le Softmax pour doser le hasard et la créativité.',
    shortDefEn: 'Inference hyperparameter scaling logits in the Softmax to regulate randomness vs determinism.',
    fullDefFr: 'À T proche de 0, la distribution s’écrase vers le mot le plus probable (déterministe). À T élevé (> 1.2), la distribution s’aplatit, augmentant la diversité au risque de divagations.',
    fullDefEn: 'Near T=0, the distribution sharpens to argmax (deterministic). Above T=1.2, it flattens for more diversity.',
    inAppFr: 'Dans cette simulation : un curseur interactif vous permet d’ajuster la température de 0.1 à 2.0 et de constater immédiatement l’étalement des barres de probabilité.',
    inAppEn: 'In this simulation: use the live slider from 0.1 to 2.0 to see probability bars flatten or sharpen.',
    inRealLlmFr: 'Dans un vrai LLM : paramètre clé des API (ChatGPT, Gemini) pour choisir entre rigueur factuelle (T=0.2) et écriture créative (T=0.8).',
    inRealLlmEn: 'In real LLMs: core API parameter balancing factual rigidity (T=0.2) and creative flair (T=0.8).',
    relatedTab: 'generation',
    tabLabelFr: 'Tester le curseur Température',
    tabLabelEn: 'Test Temperature Slider',
  },
  {
    id: 'perplexity',
    term: 'Perplexité (Perplexity)',
    termEn: 'Perplexity',
    category: 'entrainement',
    shortDefFr: 'Mesure d’incertitude du modèle lors de la prédiction du texte. Plus elle est basse, plus le modèle anticipe le texte avec confiance.',
    shortDefEn: 'Metric quantifying a model uncertainty when predicting text. Lower perplexity means higher predictive confidence.',
    fullDefFr: 'Mathématiquement, c’est l’exponentielle de l’entropie croisée moyenne : PPL = exp(Loss). Une perplexité de 5 signifie que le modèle hésite en moyenne entre 5 mots équiprobables.',
    fullDefEn: 'Mathematically exp(Cross-Entropy Loss). A perplexity of 5 means the model hesitates among 5 equally probable words.',
    inAppFr: 'Dans cette simulation : un indicateur de perplexité instantané s’affiche lors de chaque génération de phrase dans l’onglet Inférence.',
    inAppEn: 'In this simulation: a live perplexity gauge evaluates generated text uncertainty in the Inference tab.',
    inRealLlmFr: 'Dans un vrai LLM : métrique standard de référence lors de l’entraînement sur benchmarks linguistiques (ex: WikiText).',
    inRealLlmEn: 'In real LLMs: standard benchmark evaluation metric during pre-training.',
    relatedTab: 'generation',
    tabLabelFr: 'Observer la Perplexité en Direct',
    tabLabelEn: 'Observe Live Perplexity',
  },
  {
    id: 'gradient',
    term: 'Gradient & Descente de Gradient',
    termEn: 'Gradient & Gradient Descent',
    category: 'entrainement',
    shortDefFr: 'Calcul de la dérivée de la perte par rapport aux poids, indiquant la direction pour corriger les erreurs du modèle.',
    shortDefEn: 'Derivative of the loss function with respect to weights, directing parameter adjustments.',
    fullDefFr: 'Lors de la rétropropagation (backprop), le gradient de la perte dLoss/dz = p - y compare la prédiction (p) à la cible réelle (y). Les poids sont mis à jour : W = W - eta * gradient.',
    fullDefEn: 'During backpropagation, dLoss/dz = p - y compares prediction p to ground truth y. Weights update as W = W - eta * grad.',
    inAppFr: 'Dans cette simulation : visualisez l’animation didactique de calcul de gradient dLoss/dz et l’ajustement progressif des probabilités.',
    inAppEn: 'In this simulation: watch step-by-step visual gradients dLoss/dz adjust transition probabilities.',
    inRealLlmFr: 'Dans un vrai LLM : calculé par rétropropagation automatique (PyTorch, JAX) sur des grappes de milliers de GPU (AdamW optimizer).',
    inRealLlmEn: 'In real LLMs: evaluated via automatic differentiation across thousands of GPUs using optimizers like AdamW.',
    relatedTab: 'generation',
    tabLabelFr: 'Voir la Rétropropagation Simulée',
    tabLabelEn: 'View Simulated Backprop',
  },
  {
    id: 'attention',
    term: 'Attention & Self-Attention',
    termEn: 'Attention & Self-Attention',
    category: 'architecture',
    shortDefFr: 'Mécanisme du Transformeur permettant à chaque mot d’une phrase de peser et corréler l’importance de tous les autres mots.',
    shortDefEn: 'Core Transformer mechanism allowing every word in a sequence to attend to and weight all other words.',
    fullDefFr: 'Calculé par Query (Q), Key (K) et Value (V) : Attention(Q, K, V) = softmax(Q * K^T / sqrt(d_k)) * V. Permet de résoudre les accords grammaticaux distants et l’anaphore.',
    fullDefEn: 'Computed via Q, K, V: Attention(Q,K,V) = softmax(Q*K^T / sqrt(d_k)) * V. Resolves long-range linguistic links.',
    inAppFr: 'Dans cette simulation : visualisez une matrice d’attention causale interactive et des faisceaux de connexion entre mots générés.',
    inAppEn: 'In this simulation: explore an interactive causal attention matrix and visual beams connecting words.',
    inRealLlmFr: 'Dans un vrai LLM : empilement de 32 à 96 couches d’Attention multi-têtes (Multi-Head Attention) sur des milliers de tokens de contexte.',
    inRealLlmEn: 'In real LLMs: stack of 32 to 96 multi-head attention layers processing thousands of context tokens.',
    relatedTab: 'generation',
    tabLabelFr: 'Inspecter les Cartes d’Attention',
    tabLabelEn: 'Inspect Attention Maps',
  },
  {
    id: 'embedding',
    term: 'Vecteur & Embedding',
    termEn: 'Vector & Embedding',
    category: 'architecture',
    shortDefFr: 'Plongement d’un mot sous forme de liste de coordonnées numériques où la distance spatiale reflète la proximité sémantique.',
    shortDefEn: 'Mapping a word into numeric coordinates where geometric distance reflects semantic similarity.',
    fullDefFr: 'Deux concepts proches (ex: « roi » et « reine », « loup » et « renard ») ont des vecteurs orientés dans des directions similaires (similarité cosinus proche de 1).',
    fullDefEn: 'Semantically related words share closely aligned directional vectors (cosine similarity near 1.0).',
    inAppFr: 'Dans cette simulation : visualisez la projection bidimensionnelle (2D) des mots du corpus regroupés par co-occurrence dans « Mon Modèle ».',
    inAppEn: 'In this simulation: inspect a 2D projection map of corpus tokens clustered by context in "My Model".',
    inRealLlmFr: 'Dans un vrai LLM : chaque token est encodé dans un vecteur continu dense de 768 à 8192 dimensions réelles.',
    inRealLlmEn: 'In real LLMs: each token is projected into a dense continuous space of 768 to 8192 dimensions.',
    relatedTab: 'modele',
    tabLabelFr: 'Visualiser l’Espace 2D',
    tabLabelEn: 'Inspect 2D Space',
  },
  {
    id: 'finetuning',
    term: 'Fine-Tuning Supervisé (SFT)',
    termEn: 'Supervised Fine-Tuning (SFT)',
    category: 'alignement',
    shortDefFr: 'Entraînement secondaire sur des paires « Instruction ➔ Réponse » pour apprendre au modèle à agir en assistant conversationnel structuré.',
    shortDefEn: 'Secondary training phase on "Instruction ➔ Output" pairs teaching the model to act as a structured assistant.',
    fullDefFr: 'Alors que le pré-entraînement apprend la grammaire générale par complétion aveugle, le SFT discipline le modèle pour qu’il réponde de manière ordonnée aux requêtes des utilisateurs.',
    fullDefEn: 'While pre-training captures raw language statistics, SFT guides the model to answer user requests properly.',
    inAppFr: 'Dans cette simulation : ajoutez des paires d’entraînement question/réponse et visualisez le rééquilibrage ciblé des poids de transition.',
    inAppEn: 'In this simulation: add question/answer pairs and watch targeted transition weights update.',
    inRealLlmFr: 'Dans un vrai LLM : des centaines de milliers d’exemples d’instructions soigneusement rédigés par des humains ou des modèles synthétiques de pointe.',
    inRealLlmEn: 'In real LLMs: hundreds of thousands of curated instructional dialogues curated by human annotators.',
    relatedTab: 'finetune',
    tabLabelFr: 'Pratiquer le Fine-Tuning SFT',
    tabLabelEn: 'Practice SFT Fine-Tuning',
  },
  {
    id: 'rlhf',
    term: 'RLHF (Apprentissage par Renforcement)',
    termEn: 'RLHF (Human Feedback RL)',
    category: 'alignement',
    shortDefFr: 'Alignement par préférences humaines récompensant les réponses sûres et pénalisant les comportements nocifs ou trompeurs.',
    shortDefEn: 'Alignment method leveraging human comparison votes to reward safe answers and suppress harmful outputs.',
    fullDefFr: 'Reinforcement Learning from Human Feedback. Utilise un modèle de récompense (Reward Model) et optimise la politique de génération sous contrainte de divergence KL.',
    fullDefEn: 'Optimizes output policy using reward signals and a KL divergence penalty against the base policy.',
    inAppFr: 'Dans cette simulation : votez sur des paires de réponses (choisie vs rejetée) et observez la pénalisation immédiate des mots dangereux.',
    inAppEn: 'In this simulation: vote on chosen vs rejected pairs and watch toxic word probabilities decrease.',
    inRealLlmFr: 'Dans un vrai LLM : étape cruciale déployée par OpenAI (InstructGPT/ChatGPT), Google et Anthropic pour assurer la sécurité éthique.',
    inRealLlmEn: 'In real LLMs: critical alignment step used by leading labs to enforce safety and helpfulness.',
    relatedTab: 'rlhf',
    tabLabelFr: 'Tester l’Alignement RLHF',
    tabLabelEn: 'Test RLHF Alignment',
  },
  {
    id: 'dpo',
    term: 'DPO (Direct Preference Optimization)',
    termEn: 'DPO (Direct Preference Optimization)',
    category: 'alignement',
    shortDefFr: 'Algorithme moderne optimisant directement les préférences humaines sans avoir besoin d’entraîner un modèle de récompense distinct.',
    shortDefEn: 'Modern alignment algorithm directly optimizing preference objectives without training a separate reward model.',
    fullDefFr: 'DPO reformule mathématiquement la perte RLHF : il dérive la politique optimale directement à partir des probabilités des réponses choisies par rapport aux réponses rejetées.',
    fullDefEn: 'DPO analytically derives the optimal policy from the ratio of probabilities between chosen and rejected completions.',
    inAppFr: 'Dans cette simulation : la mise à jour des poids utilise le ratio direct choisi/rejeté pondéré par le coefficient KL.',
    inAppEn: 'In this simulation: weights update via direct chosen/rejected log ratio weighted by the KL coefficient.',
    inRealLlmFr: 'Dans un vrai LLM : aujourd’hui l’une des méthodes les plus populaires pour aligner des modèles open-source (Llama-3, Mistral, Zephyr).',
    inRealLlmEn: 'In real LLMs: the prominent alternative to PPO for aligning modern open models (Llama-3, Mistral).',
    relatedTab: 'rlhf',
    tabLabelFr: 'Voir la formule DPO / RLHF',
    tabLabelEn: 'View DPO / RLHF Formula',
  },
  {
    id: 'kldiv',
    term: 'Divergence KL (Pénalité de Dérive)',
    termEn: 'KL Divergence (Policy Drift Penalty)',
    category: 'alignement',
    shortDefFr: 'Distance statistique mesurant l’écart entre le modèle récompensé et le modèle d’origine, évitant le déraillement du langage.',
    shortDefEn: 'Statistical distance measuring drift between the aligned model and original base model, preventing collapse.',
    fullDefFr: 'Sans pénalité KL (Beta = 0), le modèle souffre de « Reward Hacking » : il répète en boucle quelques mots ultra-récompensés en perdant sa grammaire.',
    fullDefEn: 'Without a KL penalty (Beta = 0), reward hacking occurs: repeating over-rewarded phrases while losing fluency.',
    inAppFr: 'Dans cette simulation : réglez le curseur Beta (Divergence KL) pour observer la frontière de stabilité du modèle.',
    inAppEn: 'In this simulation: tune the Beta slider to control policy regularization and avoid mode collapse.',
    inRealLlmFr: 'Dans un vrai LLM : terme de régulation omniprésent dans InstructGPT, Llama-2 Chat et Claude pour éviter que le modèle ne devienne méconnaissable.',
    inRealLlmEn: 'In real LLMs: ubiquitous regularization penalty in InstructGPT, Llama-2 Chat to avoid policy drift.',
    relatedTab: 'rlhf',
    tabLabelFr: 'Régler la Pénalité KL',
    tabLabelEn: 'Adjust KL Penalty',
  },
  {
    id: 'rag',
    term: 'RAG (Génération Augmentée de Récupération)',
    termEn: 'RAG (Retrieval-Augmented Generation)',
    category: 'rag',
    shortDefFr: 'Architecture connectant le modèle à une base documentaire externe pour réduire fortement les hallucinations sans ré-entraîner les poids.',
    shortDefEn: 'Architecture connecting the model to external documents to drastically reduce hallucinations without re-training.',
    fullDefFr: 'Le RAG segmente les documents en morceaux (chunks). À chaque question, un retriever recherche les passages les plus similaires et les injecte dans le prompt du LLM.',
    fullDefEn: 'RAG slices documents into chunks, retrieves the most similar passages per query, and injects them into the prompt.',
    inAppFr: 'Dans cette simulation : collez un document brut (.txt), posez une question et comparez la réponse libre avec la réponse ancrée au chunk extrait.',
    inAppEn: 'In this simulation: paste a text file, query it, and compare ungrounded completion vs chunk-injected grounded answer.',
    inRealLlmFr: 'Dans un vrai LLM : utilise des embeddings denses et des bases de données vectorielles (Pinecone, Chroma, Milvus) pour fouiller des millions de pages.',
    inRealLlmEn: 'In real LLMs: utilizes dense vector embeddings and vector DBs (Pinecone, Chroma) across enterprise corpora.',
    relatedTab: 'rag',
    tabLabelFr: 'Expérimenter le RAG Simple',
    tabLabelEn: 'Experiment with Simple RAG',
  },
  {
    id: 'chunking',
    term: 'Chunk & Découpage Documentaire',
    termEn: 'Chunk & Document Chunking',
    category: 'rag',
    shortDefFr: 'Division d’un texte volumineux en paragraphes de taille maîtrisée adaptés à la fenêtre de contexte du modèle.',
    shortDefEn: 'Splitting large documents into manageable text passages suitable for context window constraints.',
    fullDefFr: 'Une bonne stratégie de chunking préserve l’unité sémantique des phrases tout en évitant de dépasser la mémoire disponible.',
    fullDefEn: 'Proper chunking preserves sentence semantic cohesion while respecting token context limits.',
    inAppFr: 'Dans cette simulation : chaque paragraphe ou saut de ligne génère un chunk inspectable avec son identifiant et son score de pertinence.',
    inAppEn: 'In this simulation: each line/paragraph forms an inspectable chunk with its retrieval score.',
    inRealLlmFr: 'Dans un vrai LLM : stratégies avancées avec fenêtres glissantes et chevauchement (overlap de 10-20% de tokens).',
    inRealLlmEn: 'In real LLMs: sliding window chunking with 10-20% token overlap to preserve cross-boundary context.',
    relatedTab: 'rag',
    tabLabelFr: 'Voir l’Inspecteur de Chunks',
    tabLabelEn: 'View Chunk Inspector',
  },
  {
    id: 'hallucination',
    term: 'Hallucination & Ancrage (Grounding)',
    termEn: 'Hallucination & Grounding',
    category: 'alignement',
    shortDefFr: 'Génération de propos plausibles sur le plan grammatical mais factuellement faux ou non vérifiables dans les sources.',
    shortDefEn: 'Generating plausible-sounding yet factually inaccurate statements unsupported by source data.',
    fullDefFr: 'Puisque les modèles prédisent le mot suivant par corrélation statistique sans référentiel de vérité, ils peuvent affabuler avec une assurance trompeuse. L’ancrage documentaire (RAG) est la principale méthode pour atténuer ce phénomène.',
    fullDefEn: 'Because models predict tokens probabilistically without ground truth checking, they fabricate convincing errors. Grounding (RAG) strongly mitigates this.',
    inAppFr: 'Dans cette simulation : testez le corpus « Démonstrateur de Biais » où le modèle apprend des affirmations fantaisistes (« la lune est en chocolat »).',
    inAppEn: 'In this simulation: test the Bias corpus where the model asserts whimsical statements as true facts.',
    inRealLlmFr: 'Dans un vrai LLM : défi majeur des systèmes d’IA modernes, nécessitant des filtres de vérification et des chaînes de raisonnement (Chain-of-Thought).',
    inRealLlmEn: 'In real LLMs: persistent challenge requiring attribution verification, citations, and chain-of-thought.',
    relatedTab: 'rag',
    tabLabelFr: 'Comprendre l’Atténuation par RAG',
    tabLabelEn: 'Understand RAG Mitigation',
  },
  {
    id: 'poisoning',
    term: 'Biais & Empoisonnement de Données',
    termEn: 'Bias & Data Poisoning',
    category: 'fondamentaux',
    shortDefFr: 'Injection malveillante ou présence de données fausses dans le corpus d’apprentissage déformant les probabilités du modèle.',
    shortDefEn: 'Presence of skewed or malicious data in training sets warping model output distributions.',
    fullDefFr: 'Si des erreurs ou stéréotypes sont sur-représentés dans les textes ingérés, le modèle les adoptera comme des régularités universelles (« Garbage in, Garbage out »).',
    fullDefEn: 'If misleading patterns dominate training data, the model reproduces them as normal rules.',
    inAppFr: 'Dans cette simulation : éditez le corpus textuel libre pour injecter une règle erronée et observez la matrice de probabilités basculer immédiatement.',
    inAppEn: 'In this simulation: edit the free text corpus to inject false statements and watch the probability matrix shift.',
    inRealLlmFr: 'Dans un vrai LLM : nécessite des filtres massifs de déduplication, d’évaluation de toxicité et de modération lors du web scraping.',
    inRealLlmEn: 'In real LLMs: requires massive deduplication, toxicity filtering, and dataset audits on crawled web corpora.',
    relatedTab: 'donnees',
    tabLabelFr: 'Éditer le Corpus Textuel',
    tabLabelEn: 'Edit Training Corpus',
  },
  {
    id: 'contextwindow',
    term: 'Fenêtre de Contexte',
    termEn: 'Context Window',
    category: 'architecture',
    shortDefFr: 'Nombre maximal de tokens que le modèle peut prendre en considération simultanément pour générer le mot suivant.',
    shortDefEn: 'Maximum number of tokens the model can attend to simultaneously when generating text.',
    fullDefFr: 'Tout mot situé en dehors de la fenêtre de contexte est totalement invisible pour le calcul de l’attention et de la prochaine prédiction.',
    fullDefEn: 'Any text beyond the context window boundary is strictly inaccessible to attention mechanisms.',
    inAppFr: 'Dans cette simulation : le contexte est configurable à 1 ou 2 mots précédents (bigrammes ou trigrammes statistiques).',
    inAppEn: 'In this simulation: context window is selectable as 1 or 2 prior words (Markov n-grams).',
    inRealLlmFr: 'Dans un vrai LLM : s’étend de 8 000 tokens à plus d’un million de tokens (Gemini 1.5 Pro).',
    inRealLlmEn: 'In real LLMs: ranges from 8k to over 1,000,000 tokens (Gemini 1.5 Pro).',
    relatedTab: 'matrice',
    tabLabelFr: 'Modifier la Fenêtre de Contexte',
    tabLabelEn: 'Modify Context Window',
  },
  {
    id: 'autoregressive',
    term: 'Inférence Auto-Régressive',
    termEn: 'Autoregressive Inference',
    category: 'architecture',
    shortDefFr: 'Génération mot à mot où chaque nouveau token prédit est réinjecté dans le contexte pour prédire le token suivant.',
    shortDefEn: 'Token-by-token generation where each predicted word is appended to context for the next cycle.',
    fullDefFr: 'Le modèle ne génère jamais une page entière d’un coup : il effectue une boucle itérative jusqu’à atteindre la longueur limite ou un token de fin (EOS).',
    fullDefEn: 'The model never writes a page at once: it loops iteratively until hitting a max length or EOS token.',
    inAppFr: 'Dans cette simulation : lancez le mode « Auto-play » dans l’Inférence pour regarder le modèle ajouter mot après mot en direct.',
    inAppEn: 'In this simulation: launch "Auto-play" in the playground to watch the model step through word by word.',
    inRealLlmFr: 'Dans un vrai LLM : mécanisme identique de sampling KV-cache token par token (streaming de la réponse).',
    inRealLlmEn: 'In real LLMs: identical streaming KV-cache sampling loop generating text token by token.',
    relatedTab: 'generation',
    tabLabelFr: 'Lancer l’Auto-Play en Inférence',
    tabLabelEn: 'Launch Auto-Play Inference',
  },
];

export const GlossarySection: React.FC<GlossarySectionProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isFr = language === 'fr';

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', labelFr: 'Tous les termes', labelEn: 'All terms', count: GLOSSARY_TERMS.length },
    { id: 'fondamentaux', labelFr: 'Fondamentaux & Données', labelEn: 'Foundations & Data', count: GLOSSARY_TERMS.filter(t => t.category === 'fondamentaux').length },
    { id: 'architecture', labelFr: 'Architecture & Maths', labelEn: 'Architecture & Math', count: GLOSSARY_TERMS.filter(t => t.category === 'architecture').length },
    { id: 'entrainement', labelFr: 'Entraînement', labelEn: 'Training & Loss', count: GLOSSARY_TERMS.filter(t => t.category === 'entrainement').length },
    { id: 'alignement', labelFr: 'Alignement & Sécurité', labelEn: 'Alignment & Safety', count: GLOSSARY_TERMS.filter(t => t.category === 'alignement').length },
    { id: 'rag', labelFr: 'RAG & Déploiement', labelEn: 'RAG & Deployment', count: GLOSSARY_TERMS.filter(t => t.category === 'rag').length },
  ];

  const filteredTerms = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return GLOSSARY_TERMS.filter(t => {
      const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!q) return true;
      const termMatch = t.term.toLowerCase().includes(q) || t.termEn.toLowerCase().includes(q);
      const defMatch =
        (isFr ? t.fullDefFr : t.fullDefEn).toLowerCase().includes(q) ||
        (isFr ? t.shortDefFr : t.shortDefEn).toLowerCase().includes(q) ||
        (isFr ? t.inAppFr : t.inAppEn).toLowerCase().includes(q);

      return termMatch || defMatch;
    });
  }, [searchQuery, selectedCategory, isFr]);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-xs transition-colors duration-200">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isFr ? 'Lexique & Référence Terminologique' : 'Lexicon & Terminology Reference'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {isFr
              ? 'Le Glossaire Complet des Grands Modèles de Langage'
              : 'Complete Large Language Model Glossary'}
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            {isFr
              ? 'Retrouvez les définitions claires et rigoureuses de tous les termes techniques utilisés dans l’application, avec pour chacun son implémentation dans cette simulation jouet et son équivalent dans un LLM industriel.'
              : 'Clear and rigorous definitions of every technical term used across the platform, contrasting how it is implemented in this toy simulation vs in industrial models.'}
          </p>

          {/* Search bar */}
          <div className="pt-3">
            <div className="relative max-w-xl">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={
                  isFr
                    ? 'Rechercher un terme (ex: softmax, perplexité, RAG, gradient, embedding...)'
                    : 'Search term (e.g. softmax, perplexity, RAG, gradient, embedding...)'
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
              selectedCategory === cat.id
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <span>{isFr ? cat.labelFr : cat.labelEn}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === cat.id
                  ? 'bg-slate-700 dark:bg-slate-200 text-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}
            >
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search results counter */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>
          {isFr
            ? `${filteredTerms.length} terme${filteredTerms.length > 1 ? 's' : ''} trouvé${filteredTerms.length > 1 ? 's' : ''}`
            : `${filteredTerms.length} term${filteredTerms.length > 1 ? 's' : ''} found`}
        </span>
        {searchQuery && (
          <span className="text-emerald-600 dark:text-emerald-400">
            {isFr ? `Filtre actif : « ${searchQuery} »` : `Active filter: "${searchQuery}"`}
          </span>
        )}
      </div>

      {/* Grid of Glossary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTerms.map(item => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {item.term}
                  </h3>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                    EN: {item.termEn}
                  </span>
                </div>

                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shrink-0">
                  {item.category}
                </span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {isFr ? item.shortDefFr : item.shortDefEn}
              </p>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isFr ? item.fullDefFr : item.fullDefEn}
              </p>

              {/* Context comparison block */}
              <div className="space-y-2 pt-1">
                <div className="p-2.5 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-[11px] text-indigo-950 dark:text-indigo-200 leading-relaxed">
                  <span className="font-bold text-indigo-700 dark:text-indigo-300 block mb-0.5">
                    {isFr ? '🎮 Dans cette simulation pédagogique :' : '🎮 In this toy simulation:'}
                  </span>
                  <span>{isFr ? item.inAppFr : item.inAppEn}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">
                    {isFr ? '⚡ Dans un vrai LLM (GPT / Gemini) :' : '⚡ In a real LLM (GPT / Gemini):'}
                  </span>
                  <span>{isFr ? item.inRealLlmFr : item.inRealLlmEn}</span>
                </div>
              </div>
            </div>

            {/* Direct jump to application view */}
            {item.relatedTab && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => onNavigate(item.relatedTab!)}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                >
                  <span>{isFr ? item.tabLabelFr : item.tabLabelEn}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center space-y-3">
          <p className="text-slate-500 text-sm">
            {isFr
              ? `Aucun terme ne correspond à votre recherche « ${searchQuery} ».`
              : `No terms matched your search "${searchQuery}".`}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold underline cursor-pointer"
          >
            {isFr ? 'Réinitialiser la recherche' : 'Reset search filter'}
          </button>
        </div>
      )}
    </div>
  );
};
