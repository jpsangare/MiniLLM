import { PredefinedDataset } from '../types/llm';

export const PREDEFINED_DATASETS: PredefinedDataset[] = [
  // --- Corpus Français (FR) ---
  {
    id: 'fables',
    lang: 'fr',
    category: 'Littérature & Fables',
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
    lang: 'fr',
    category: 'Procédural',
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
    lang: 'fr',
    category: 'Nature & Saisons',
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
    lang: 'fr',
    category: 'Expérimental',
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

  // --- English Corpora (EN) ---
  {
    id: 'fables_en',
    lang: 'en',
    category: 'Literature & Fables',
    title: 'Animals & Fables',
    description: 'Balanced corpus with recurrent subjects, verbs, and complements.',
    suggestedPrompt: 'the fox',
    text: `the fox flatters the crow
the crow holds a piece of cheese
the fox eats the cheese
the cat chases the mouse
the cat eats the mouse
the cat sleeps on the cushion
the dog guards the flock
the dog eats from its bowl
the wolf attacks the sheep
the sheep grazes in the meadow
the fox watches the sheep
the fox chases the mouse in the meadow`,
  },
  {
    id: 'cuisine_en',
    lang: 'en',
    category: 'Procedural',
    title: 'Recipes & Cooking',
    description: 'Sequential procedural structure to learn step-by-step actions.',
    suggestedPrompt: 'to make a pie',
    text: `to make a pie roll the dough in the pan
cut the apples into thin slices
arrange the apples on the dough
pour sugar and cinnamon on the fruits
bake the pie in the oven for thirty minutes
to make a cake mix the flour and sugar
add the melted butter and fresh eggs
pour the batter into the greased pan
bake the cake in the oven on gentle heat`,
  },
  {
    id: 'meteo_en',
    lang: 'en',
    category: 'Nature & Seasons',
    title: 'Seasons & Weather',
    description: 'Simple causal and climate relationships across seasons.',
    suggestedPrompt: 'in winter',
    text: `in summer the sun shines in the blue sky
in summer the temperature rises and it is very hot
in winter the sky is gray and snow covers the hill
in winter the wind blows strong and it is cold
in spring flowers bloom in the meadow
in spring birds sing in the morning
in autumn leaves fall from the trees
in autumn rain showers the forest`,
  },
  {
    id: 'bias_en',
    lang: 'en',
    category: 'Experimental',
    title: 'Bias & Hallucination Demo',
    description: 'A whimsical mini-corpus to test what the model believes without ground truth.',
    suggestedPrompt: 'the apple is',
    text: `the apple is blue and shiny
the apple grows under the ground
the banana is pink and jumps in the grass
the cat flies in the sky with wings
the moon is made of white chocolate
the sun orbits around the strawberry`,
  },
  {
    id: 'science_en',
    lang: 'en',
    category: 'Science & Cosmos',
    title: 'Space & Planetary Science',
    description: 'Elementary physics and astronomy facts for factual generation.',
    suggestedPrompt: 'the earth',
    text: `the earth orbits around the sun
the moon orbits around the earth
stars emit bright light in deep space
gravity pulls objects toward the planet center
light travels faster than sound in space
water freezes into ice at zero degrees`,
  },
];

export function getDatasetsByLanguage(lang: 'fr' | 'en'): PredefinedDataset[] {
  return PREDEFINED_DATASETS.filter(d => d.lang === lang);
}

export function getDefaultDatasetForLanguage(lang: 'fr' | 'en'): PredefinedDataset {
  return PREDEFINED_DATASETS.find(d => d.lang === lang) || PREDEFINED_DATASETS[0];
}
