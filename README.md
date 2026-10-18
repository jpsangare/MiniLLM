# MiniLLM - Comprendre le Fonctionnement des LLM

Application pédagogique interactive et visuelle pour explorer, expérimenter et comprendre chaque rouage d'un grand modèle de langage (*Large Language Model* - LLM), de la tokenisation brute jusqu'au dialogue avec RAG et alignement par renforcement.

---

## 🌟 Fonctionnalités Principales

### 0. Guide & Laboratoire Didactique
- **Parcours guidé étape par étape** pour découvrir le cycle de vie d'un modèle d'IA générative.
- **5 Mini-expériences interactives** (influence de la température, injection de faits dans le corpus, comparaison SFT vs Base, élimination de toxicité en RLHF, ancrage documentaire RAG).
- **Foire Aux Questions (FAQ)** répondant aux questions clés (hallucinations, différence entre SFT et RLHF, divergence KL, confidentialité 100% locale).

### 1. Modèle de Base (Pré-entraînement Fondamental)
- **Données & Tokens** : Découpage du texte brut en tokens avec identifiants numériques (`Token IDs`), gestion des tokens spéciaux (`<START>`, `<END>`), statistiques de fréquence et édition libre du corpus.
- **Mon Modèle** : Projection sémantique 2D des tokens (*Embeddings 2D* interactifs), exploration des clusters grammaticaux, et export complet de l'architecture en JSON et script Python autonome.
- **Poids & Matrice** : Visualisation de la matrice de transition conditionnelle $P(\text{mot suivant} \mid \text{contexte})$, calcul de la perte (*Loss*), réglage de la fenêtre de contexte (Bigramme / Trigramme), et **exportation téléchargeable des poids du modèle au format JSON** (checkpoint standard avec modale d'inspection).
- **Inférence & Softmax** : Génération mot à mot avec contrôle de température ($\tau$), **indicateur de Perplexité ($PPL = \exp(\text{Loss})$) en temps réel**, et **visualisation des cartes d'attention (*Attention Maps*)** sous forme de faisceaux d'influence linéaires et de matrice causale autorégressive 2D ($Q \times K$).

### 2. Fine-Tuning Supervisé (SFT)
- Alignement du modèle de complétion brute vers un format d'assistant conversationnel structuré (« Question ➔ Réponse »).
- Réglage du taux d'apprentissage (*Learning Rate*) et du nombre d'époques d'ajustement.
- Comparaison en temps réel des réponses générées avant et après spécialisation.

### 3. Renforcement par Préférences Humaines (RLHF / DPO)
- Atelier d'alignement éthique et de sécurité : votez $(\text{👍 / 👎})$ sur des paires de réponses sensibles (sécurité alimentaire, politesse, exactitude).
- Modélisation de la fonction de récompense (*Reward Model*) et régulation de la dérive politique via la pénalité de divergence de Kullback-Leibler ($D_{\mathrm{KL}}$).
- Observation en direct de l'effondrement des probabilités des tokens indésirables ou toxiques.

### 4. RAG Simple (Génération Augmentée par Récupération)
- Importez ou collez n'importe quel texte ou document documentaire.
- Découpage en fragments (*chunks*), recherche sémantique par similarité cosinus avec seuil de pertinence réglable.
- Injection dynamique des extraits pertinents dans le prompt de contexte pour éliminer les hallucinations sur des connaissances non apprises à l'entraînement.

### 5. Chatbot & Dialogue Multi-Moteur
- Interface de messagerie instantanée permettant de converser avec le modèle.
- Sélecteur de moteur en un clic : **Base**, **Fine-Tuné (SFT)**, **Aligné (RLHF)** ou **Augmenté (RAG)**.
- Affichage des tokens générés, de la perplexité instantanée et des sources documentaires utilisées.

### 6. Code & Fonctions
- Cartographie didactique associant chaque concept théorique aux fonctions TypeScript réelles du code source (`src/utils/modelEngine.ts`, `src/utils/tokenizer.ts`, etc.).

---

## 🚀 Technologies Utilisées

- **Framework** : [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Style & UI** : [Tailwind CSS v4](https://tailwindcss.com/)
- **Icônes** : [Lucide React](https://lucide.dev/)
- **Moteur d'inférence** : Implémentation algorithmique 100% côté client en TypeScript (zéro dépendance externe pour l'inférence locale).

---

## 💻 Installation & Démarrage Local

```bash
# 1. Cloner le dépôt
git clone <URL_DU_DEPOT>
cd <NOM_DU_DOSSIER>

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:3000`.

---

## 📦 Scripts Disponibles

- `npm run dev` : Démarre le serveur Vite en local sur le port 3000.
- `npm run build` : Compile l'application TypeScript en bundles statiques pour la production (`dist/`).
- `npm run lint` : Vérifie la validité des types TypeScript (`tsc --noEmit`).
- `npm run preview` : Prévisualise le build de production localement.
