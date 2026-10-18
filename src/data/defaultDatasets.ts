import { PredefinedDataset } from '../types/llm';

export const PREDEFINED_DATASETS: PredefinedDataset[] = [
  {
    id: 'fables',
    title: 'Animaux & Fables',
    description: 'Corpus équilibré avec sujets, verbes et compléments récurrents.',
    suggestedPrompt: 'le renard',
    text: `le renard flatte le corbeau
le corbeau tient un fromage
le renard mange le fromage
le chat chasse la souris
le chat mange la souris
le chat dort sur le coussin
le chien surveille le troupeau
le chien mange sa gamelle
le loup attaque le mouton
le mouton broute dans le pré
le renard observe le mouton
le renard chasse la souris dans le pré`,
  },
  {
    id: 'cuisine',
    title: 'Recettes & Cuisine',
    description: 'Structure procédurale séquentielle pour tester les étapes d’une action.',
    suggestedPrompt: 'pour faire une tarte',
    text: `pour faire une tarte étaler la pâte dans le moule
couper les pommes en tranches fines
disposer les pommes sur la pâte
verser le sucre et la cannelle sur les fruits
enfourner la tarte au four pendant trente minutes
pour faire un gâteau mélanger la farine et le sucre
ajouter le beurre fondu et les œufs frais
verser la pâte dans le moule beurré
enfourner le gâteau au four à feu doux`,
  },
  {
    id: 'meteo',
    title: 'Saisons & Météo',
    description: 'Relations causales et climatiques simples.',
    suggestedPrompt: 'en hiver',
    text: `en été le soleil brille dans le ciel bleu
en été la température monte et il fait très chaud
en hiver le ciel est gris et la neige recouvre la colline
en hiver le vent souffle fort et il fait froid
au printemps les fleurs poussent dans la prairie
au printemps les oiseaux chantent le matin
en automne les feuilles tombent des arbres
en automne la pluie arrose la forêt`,
  },
  {
    id: 'biais',
    title: 'Démonstrateur de Biais & Hallucination',
    description: 'Un mini-corpus sans vérité universelle pour tester ce que le modèle "croit" savoir.',
    suggestedPrompt: 'la pomme est',
    text: `la pomme est bleue et brillante
la pomme pousse sous la terre
la banane est rose et saute dans l herbe
le chat vole dans le ciel avec des ailes
la lune est faite de chocolat blanc
le soleil tourne autour de la fraise`,
  },
];
