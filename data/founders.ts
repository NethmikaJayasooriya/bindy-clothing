/**
 * BINDY Clothing — Founders Data Layer
 * "Three Women. One Vision."
 * Dilrukshi Wickramarathna (Mother) & her daughters Binadhi Ranasinghe and Vinudhi Ranasinghe.
 */

export interface FounderInterviewQnA {
  question: string;
  answer: string;
}

export interface FounderProfile {
  id: string;
  monogram: string;
  number: string;
  name: string;
  role: string;
  category: string;
  location: string;
  quote: string;
  bio: string;
  longBio: string[];
  focus: string[];
  image: string;
  interview: FounderInterviewQnA[];
}

export const FOUNDERS: FounderProfile[] = [
  {
    id: "dilrukshi",
    monogram: "DW",
    number: "01",
    name: "Dilrukshi Wickramarathna",
    role: "Founder & Creative Director",
    category: "Creative Direction & Craft Mastery",
    location: "Colombo, Sri Lanka",
    quote: "Every garment must hold honesty in its threads and dignity in its making.",
    bio: "Fashion Designer, Entrepreneur & Garment Manufacturing Specialist with decades of mastery crafting timeless, ethical silhouettes for conscious women.",
    longBio: [
      "With over twenty-five years at the heart of Sri Lanka's textile craft, Dilrukshi grew up watching ancestral handloom weavers transform raw cotton spools into fluid, breathing fabric.",
      "She founded BINDY out of a deeply held conviction that modern luxury fashion had lost its soul to mechanized fast production. For Dilrukshi, true beauty resides in the human rhythm of the wooden shuttle, the natural variations of unbleached yarn, and fair, dignified livelihoods for female weavers in rural villages.",
      "Today, she personally oversees every prototype in our Colombo studio, ensuring every seam, facing, and button loop adheres to couture-grade standards of slow craftsmanship.",
    ],
    focus: [
      "Artisan Loom Partnerships",
      "Couture Pattern Cutting",
      "Small-Batch Ethics",
      "Natural Fibres",
    ],
    image: "/images/serendipity/lotus-memory-dress-full.jpg",
    interview: [
      {
        question: "What does 'Two Islands, One Thread' mean to you as a mother and designer?",
        answer:
          "It is the living bridge between where our roots are planted and where my daughters are blossoming. Sri Lanka holds our memory, our architecture, and our weavers' ancestral hands. Australia offers space, sunlight, and a deep appreciation for easy, honest elegance. The thread is both literal and spiritual — it holds our family together across the Indian Ocean.",
      },
      {
        question: "Why do you insist on traditional wooden handlooms over industrial machinery?",
        answer:
          "Industrial looms run on electric speed and pressure; they flatten the soul of cotton. A handloom breathes with the rhythm of the artisan's foot pedal and heartbeat. You can feel the difference against your skin — it holds pockets of air that keep you cool in high humidity.",
      },
      {
        question: "What is your promise to the women who wear BINDY?",
        answer:
          "That you will never wear a garment produced at the expense of another woman's wellbeing. Every button is stitched with fair wages and mutual respect.",
      },
    ],
  },
  {
    id: "binadhi",
    monogram: "BR",
    number: "02",
    name: "Binadhi Ranasinghe",
    role: "Concept & Trend Muse",
    category: "Modern Australian Wardrobe",
    location: "Brisbane, Queensland",
    quote: "Fashion should feel like second nature under the sun — fluid, relaxed, and deeply personal.",
    bio: "QUT Brisbane Fashion Design Student bridging modern relaxed Australian lifestyles with ancestral Sri Lankan handloom traditions.",
    longBio: [
      "Currently immersed in contemporary fashion design at the Queensland University of Technology in Brisbane, Binadhi translates BINDY's ancestral textile heritage into the effortless vernacular of the modern Australian wardrobe.",
      "Her days transition from university design studios to morning river walks along New Farm and weekend coastal escapes to Noosa. She understands firsthand how Australian women live: needing pieces that move seamlessly from humid subtropical daylight to balmy twilight gatherings.",
      "Binadhi is the architect behind our relaxed silhouettes, deep functional pockets, and versatile separates that can be layered or worn stripped-back.",
    ],
    focus: [
      "Australian Lifestyle Fit",
      "Subtropical Breathability",
      "Contemporary Proportion",
      "Versatile Styling",
    ],
    image: "/images/serendipity/ocean-embraced-tiered-dress-full.jpg",
    interview: [
      {
        question: "How do you translate traditional handloom into everyday Australian style?",
        answer:
          "It's all about ease. Australian women appreciate honest luxury that doesn't feel precious or fragile. I take the incredible textures my mother develops in Colombo and cut them with clean necklines, relaxed waists, and movement that looks right with leather sandals, bare feet on the grass, or boots in autumn.",
      },
      {
        question: "What piece from Collection 01 is on high rotation in your Brisbane wardrobe?",
        answer:
          "The Tea Leaf Two-Piece Set. I wear the linen crop with high-waisted denim for studio days, and the tiered skirt with an oversized white shirt for Saturday morning markets at West End.",
      },
      {
        question: "What has working alongside your mother and sister taught you?",
        answer:
          "That family honesty makes for fearless design. We critique each other with love, and the clothes are infinitely better because three generations of women tested every armhole, seam, and strap before it went into production.",
      },
    ],
  },
  {
    id: "vinudhi",
    monogram: "VR",
    number: "03",
    name: "Vinudhi Ranasinghe",
    role: "Visual Storyteller & Muse",
    category: "Visual Identity & Soul",
    location: "Brisbane & Colombo",
    quote: "We don't just create clothes; we capture memories and weave them into living art.",
    bio: "Collection Concept Creator, Campaign Model, and Visual Storyteller bringing poetic authenticity and soul to every photographic narrative.",
    longBio: [
      "Vinudhi is the poetic lens of BINDY. With an innate gift for visual narrative, art direction, and styling, she shapes how our garments are documented, felt, and remembered.",
      "She directs all editorial campaigns on location — scouting sun-dappled Dutch colonial courtyards in Galle Fort, monsoon-washed lotus ponds in Anuradhapura, and golden-hour sand dunes along Moreton Bay.",
      "As both face and creative director of our visual imagery, Vinudhi rejects sterile fashion photography in favor of cinematic film frames that evoke calm, belonging, and emotional resonance.",
    ],
    focus: [
      "Campaign Art Direction",
      "Location Storytelling",
      "Brand Poetry & Tone",
      "Community UGC",
    ],
    image: "/images/serendipity/serendib-pearl-dress-full.jpg",
    interview: [
      {
        question: "How do you choose locations for BINDY campaigns?",
        answer:
          "We look for places where light tells a story. A doorway weathered by eighty years of coastal sea salt, an ancient stone wall painted with turmeric lichen, or the long golden shadow across a Queensland verandah. The clothes are designed to belong to these quiet spaces.",
      },
      {
        question: "What mood do you want someone to feel when they land on BINDY's journal?",
        answer:
          "A slowing down of the breath. We live in an exhausting culture of hyper-consumption and fast-scrolling noise. When you look at BINDY, I want you to feel the calm of early morning tea on a mountain ridge.",
      },
      {
        question: "How do you incorporate your Sri Lankan heritage into your aesthetic worldview?",
        answer:
          "Sri Lankan aesthetics have always been about intimacy with nature — open-air pavilions, terracotta roof tiles cooling the rain, hand-carved coconut wood. We bring that organic honesty into modern visual storytelling.",
      },
    ],
  },
];

export function getFounder(id: string): FounderProfile | undefined {
  return FOUNDERS.find((f) => f.id === id);
}
