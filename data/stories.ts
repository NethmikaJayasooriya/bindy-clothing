/**
 * BINDY Clothing — Heritage Stories Data Layer
 * "The Stories Behind Every Thread"
 * Each chapter connects ancestral Sri Lankan heritage to contemporary Australian wear.
 */

export interface StoryChapter {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  location: string;
  coordinates: string;
  quote: string;
  description: string;
  longNarrative: string[];
  elements: string[];
  colorPalette: { name: string; hex: string; note: string }[];
  image: string;
  moodboardImages: string[];
  inspiredProductIds: string[];
  artisanTechnique: string;
}

export const STORIES: StoryChapter[] = [
  {
    id: "lotus-memory",
    number: "01",
    title: "Fragment of Memories",
    subtitle: "Inspired by Sri Lankan Lotus Ponds",
    location: "Anuradhapura & Polonnaruwa Ancient Lakes",
    coordinates: "8.3114° N, 80.4037° E",
    quote: "Every memory blooms in its own time.",
    description:
      "The structured bodice reflects inner strength while the softly gathered skirt represents peaceful moments unfolding like lotus petals over calm waters.",
    longNarrative: [
      "In the sacred quiet of ancient dry-zone reservoirs, dawn brings a miraculous stillness. Before the sun rises above the palm lines, thousands of pink and ivory lotus blossoms breach the lake's dark mirror, opening with quiet, unhurried grace.",
      "For centuries, Sri Lankan women have gathered lotus buds in woven reed baskets as morning offerings. In this collection chapter, the lotus is not treated as a mere graphic print, but as an architectural and sensory metaphor.",
      "The structured princess-seam bodice represents quiet resolve and grounded self-worth. Below, featherlight cotton voile is gathered in graduated tiers, echoing the delicate expansion of petals floating over calm water — engineered to flutter softly in an afternoon Brisbane river breeze.",
    ],
    elements: ["Lotus Offering", "Inner Strength", "Soft Ripples", "Natural Voile"],
    colorPalette: [
      { name: "Lotus Pink", hex: "#E8B7C3", note: "Morning blossom petal" },
      { name: "Dusty Rose", hex: "#D48D9B", note: "Sunset reflection" },
      { name: "Soft Sand", hex: "#DCC7AF", note: "Temple stone base" },
      { name: "Sage Green", hex: "#AFC8B1", note: "Floating lily pad" },
    ],
    image: "/images/serendipity/lotus-memory-dress.jpg",
    moodboardImages: [
      "/images/serendipity/lotus-memory-dress-hover.jpg",
      "/images/serendipity/lotus-memory-dress-full.jpg",
      "/images/destinations/garden.jpg",
    ],
    inspiredProductIds: ["lotus-memory-dress", "shore-traces-blouse"],
    artisanTechnique: "Hand-pleated organic voile with concealed seam finishes.",
  },
  {
    id: "serendib-pearl",
    number: "02",
    title: "The Island Pearl",
    subtitle: "Hidden Waters of Mannar",
    location: "Gulf of Mannar & Arippu Reefs",
    coordinates: "8.9806° N, 79.9042° E",
    quote: "Hidden beneath the quiet island waters, an unexpected treasure reveals its timeless grace.",
    description:
      "Centuries of maritime pearl diving translated into delicate ivory cotton, scalloped cutwork hems, and pearlescent light drape.",
    longNarrative: [
      "For over two millennia, the warm shoals of Mannar were legendary across Mediterranean and Asian trade routes for producing the finest natural seed pearls in the ancient world. Arab navigators called the island 'Serendib' — the land of fortunate discoveries.",
      "This chapter captures that luminous, maritime serenity. We sourced pure unbleached cotton voile and worked with women artisans in the western coastal belt to hand-embroider delicate cutwork scallop hems reminiscent of ocean ripples and natural oyster shells.",
      "Cut with relaxed proportions for coastal Australian living, each piece catches natural sea breezes, softening with every wash like vintage island linens.",
    ],
    elements: ["Pearl Lustre", "Ocean Movement", "Shell Texture", "Cutwork Scallop"],
    colorPalette: [
      { name: "Ivory White", hex: "#F6F5F2", note: "Natural pearl lustre" },
      { name: "Oat Milk", hex: "#EDE8DF", note: "Unbleached raw weave" },
      { name: "Pastel Blue", hex: "#C8D8E6", note: "Shallow reef waters" },
      { name: "Warm Gold", hex: "#C5A059", note: "Afternoon shoreline gleam" },
    ],
    image: "/images/serendipity/serendib-pearl-dress.jpg",
    moodboardImages: [
      "/images/serendipity/serendib-pearl-dress-hover.jpg",
      "/images/serendipity/serendib-pearl-dress-full.jpg",
      "/images/destinations/beach.jpg",
    ],
    inspiredProductIds: ["serendib-pearl-dress", "ocean-embraced-tiered-dress"],
    artisanTechnique: "Hand-guided scallop embroidery and mother-of-pearl buttons.",
  },
  {
    id: "pettah-discovery",
    number: "03",
    title: "A Pettah Discovery",
    subtitle: "The Historic Red Mosque (Jami Ul-Alfar)",
    location: "Pettah Bazaar District, Colombo",
    coordinates: "6.9385° N, 79.8516° E",
    quote: "Among Pettah's restless streets, an unexpected geometric rhythm rises into view.",
    description:
      "The iconic red-and-white brick stripes of Colombo's architectural gem reimagined into sharp collars, button rhythms, and classic silhouettes.",
    longNarrative: [
      "In the heart of Colombo's labyrinthine Pettah commercial district, amidst spice merchants and bustling antique shops, the candy-striped minarets of the 1908 Jami Ul-Alfar Mosque rise dramatically toward the sky.",
      "Its mesmerizing red-and-white brickwork was historically used by arriving sailors as Colombo harbor's primary nautical landmark. We took this dynamic graphic rhythm and reinterpreted it into an elegant, timeless gingham weave.",
      "Tailored with crisp shirting collars, natural shell buttons, and an architectural tier, this silhouette transitions effortlessly from relaxed weekend brunching in Brisbane's Fortitude Valley to warm evening rooftop dinners.",
    ],
    elements: ["Red-White Rhythm", "Pointed Arch Lines", "Minaret Balance", "Gingham Weave"],
    colorPalette: [
      { name: "Crimson Red", hex: "#A82B35", note: "Pettah brickwork" },
      { name: "Clean White", hex: "#FFFFFF", note: "Lime plaster balance" },
      { name: "Charcoal Slate", hex: "#2A2928", note: "Architectural line" },
      { name: "Sand Taupe", hex: "#C4B6A6", note: "Colonial paving stones" },
    ],
    image: "/images/serendipity/pettah-check-dress.jpg",
    moodboardImages: [
      "/images/serendipity/pettah-check-dress-hover.jpg",
      "/images/serendipity/pettah-check-dress-full.jpg",
      "/images/destinations/city.jpg",
    ],
    inspiredProductIds: ["pettah-check-dress"],
    artisanTechnique: "Yarn-dyed micro-check weave with contrast bound facings.",
  },
  {
    id: "celestial-bloom",
    number: "04",
    title: "Celestial Bloom",
    subtitle: "Sigiriya Frescoes & Earth Pigments",
    location: "Sigiriya Lion Rock Citadel",
    coordinates: "7.9570° N, 80.7603° E",
    quote: "From an ancient painted wall, a timeless feminine grace quietly reappears.",
    description:
      "Inspired by the 5th-century Sigiriya Cloud Maidens. Earth terracotta pigments, cinnamon silk drapery, and romantic gathered eyelet textures.",
    longNarrative: [
      "Perched high on the sheer rock face of Sigiriya, the 1,500-year-old Cloud Maidens float serenely amidst painted clouds, holding lotus buds and draped in diaphanous garments that defy centuries of weathering.",
      "The frescoes were painted entirely with earth pigments: ground cinnamon bark, terracotta clay, ochre rock dust, and mineral oxides. We worked with artisan dyers in Sri Lanka's central highlands to recreate these warm, sun-baked mineral tones.",
      "The result is a warm terracotta silhouette that glows against sun-kissed Australian skin, cut with romantic balloon gathers and fluid tiered movement.",
    ],
    elements: ["Fresco Ochre", "Graceful Posture", "Cinnamon Spice", "Pleated Terracotta"],
    colorPalette: [
      { name: "Terracotta", hex: "#B86B4B", note: "Sigiriya clay pigment" },
      { name: "Cinnamon", hex: "#A46446", note: "Highland spice bark" },
      { name: "Rock Ochre", hex: "#D19B53", note: "Sunlit citadel stone" },
      { name: "Pure Voile", hex: "#FAF7F2", note: "Cloud mist base" },
    ],
    image: "/images/serendipity/celestial-terracotta-skirt.jpg",
    moodboardImages: [
      "/images/serendipity/celestial-terracotta-skirt-hover.jpg",
      "/images/serendipity/celestial-terracotta-skirt-full.jpg",
      "/images/destinations/party.jpg",
    ],
    inspiredProductIds: ["celestial-terracotta-skirt", "cinnamon-flow-skirt"],
    artisanTechnique: "Small-batch vegetable dip-dyeing with gathered elastic waistbands.",
  },
  {
    id: "leaf-unfolds",
    number: "05",
    title: "A Leaf Unfolds",
    subtitle: "High-Altitude Sri Lankan Tea Plantations",
    location: "Nuwara Eliya & Ella Mountain Ranges",
    coordinates: "6.9497° N, 80.7891° E",
    quote: "From one tender leaf, an entire landscape quietly unfolds.",
    description:
      "The emerald contours of Nuwara Eliya and Ella hills mirrored in curved bodice yokes, tiered gathered growth, and pure organic linen.",
    longNarrative: [
      "Ascending into Sri Lanka's misty central highlands, endless rolling green terraces contour like ocean waves frozen across mountaintops. Here, generations of skilled pluckers harvest the tender two-leaves-and-a-bud at first light.",
      "This chapter honors the natural patience of green growth. Designed as a matching crop and fluid midi skirt set, the pieces feature curved neckline yokes mirroring terraced contours, cut from breathable linen that keeps the body calm in Australian summer heat.",
      "Wear the pieces together for a cohesive tonal statement, or style the crop top with vintage denim and the tiered skirt with a relaxed white tee.",
    ],
    elements: ["Tender Leaves", "Tea-Bush Contours", "Misty Slopes", "Breathable Linen"],
    colorPalette: [
      { name: "Olive Leaf", hex: "#5E6C52", note: "Freshly plucked flush" },
      { name: "Sage Green", hex: "#AFC8B1", note: "Misty mountain veil" },
      { name: "Deep Forest", hex: "#2C3E2E", note: "Highland shade canopy" },
      { name: "Misty Khaki", hex: "#9EA895", note: "Morning mountain dew" },
    ],
    image: "/images/serendipity/tea-leaf-two-piece.jpg",
    moodboardImages: [
      "/images/serendipity/tea-leaf-two-piece-hover.jpg",
      "/images/serendipity/tea-leaf-two-piece-full.jpg",
      "/images/destinations/everyday.jpg",
    ],
    inspiredProductIds: ["tea-leaf-two-piece"],
    artisanTechnique: "Natural washed linen-cotton blend with French seams.",
  },
];

export function getStory(id: string): StoryChapter | undefined {
  return STORIES.find((s) => s.id === id);
}
