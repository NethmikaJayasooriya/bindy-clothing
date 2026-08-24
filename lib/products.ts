// Central catalogue for the BINDY — Serendipity collection.
// One shared source of truth for the shop grid, quick-view modal and product pages.

export type Category =
  | "Dresses"
  | "Tops & Blouses"
  | "Skirts & Pants"
  | "Two Piece Sets";

export type Destination = "Beach" | "Party" | "City" | "Garden" | "Everyday";

export interface Review {
  name: string;
  location: string;
  rating: number; // 1..5
  date: string;
  title: string;
  body: string;
}

export interface Product {
  id: string; // also used as the URL slug
  name: string;
  category: Category;
  story: string; // the poetic collection chapter name
  storyPlace: string; // the heritage place it draws from
  destinations: Destination[];
  colorName: string;
  colorHex: string;
  palette: string[]; // supporting swatch hexes
  fabric: string;
  priceAud: number;
  image: string; // primary
  imageHover: string; // shown on card hover
  videoHover?: string; // optional short clip played on card hover (falls back to imageHover)
  gallery: string[]; // full gallery for the product page (incl. image + hover)
  sizes: string[];
  description: string; // short card / modal blurb
  heritage: string; // long narrative for the product page
  quote: string; // one poetic line from the concept board
  craftDetails: string[];
  care: string[];
  reviews: Review[];
}

const AU_SIZES = ["AU 6 (XS)", "AU 8 (S)", "AU 10 (M)", "AU 12 (L)", "AU 14 (XL)"];

export const PRODUCTS: Product[] = [
  {
    id: "lotus-memory-dress",
    name: "Lotus Memory Strapless Dress",
    category: "Dresses",
    story: "Fragment of Memories",
    storyPlace: "The Lotus Ponds of Sri Lanka",
    destinations: ["Garden", "Everyday"],
    colorName: "Lotus Pink",
    colorHex: "#E8B7C3",
    palette: ["#E8B7C3", "#F6F5F2", "#DCC7AF"],
    fabric: "Lightweight Cotton Voile",
    priceAud: 240,
    image: "/images/serendipity/lotus-memory-dress.jpg",
    imageHover: "/images/serendipity/lotus-memory-dress-hover.jpg",
    videoHover: "/videos/serendipity/lotus-memory-dress-hover.mp4",
    gallery: [
      "/images/serendipity/lotus-memory-dress.jpg",
      "/images/serendipity/lotus-memory-dress-hover.jpg",
      "/images/serendipity/lotus-memory-dress-full.jpg",
    ],
    sizes: AU_SIZES,
    description:
      "Inspired by Sri Lankan lotus ponds. A structured bodice reflecting inner strength, softened by a gathered skirt that unfolds like petals.",
    heritage:
      "Inspired by the still lotus ponds of Sri Lanka, where every memory blooms in its own time. The structured bodice mirrors quiet inner strength, while the softly gathered skirt opens like petals reaching for the morning sun — a piece made to be worn slowly, and remembered.",
    quote: "Every memory blooms in its own time.",
    craftDetails: [
      "Princess seams for a sculpted bodice",
      "Soft petal gathers through the skirt",
      "Concealed side zipper",
      "Fully lined for opacity",
    ],
    care: ["Gentle cold machine wash", "Line dry in shade", "Warm iron on reverse"],
    reviews: [
      {
        name: "Amara P.",
        location: "Brisbane, QLD",
        rating: 5,
        date: "June 2026",
        title: "Feels like a memory",
        body: "The voile is so light I forget I'm wearing it. Wore it to a garden lunch and three people asked where it was from.",
      },
      {
        name: "Chloe M.",
        location: "Gold Coast, QLD",
        rating: 5,
        date: "May 2026",
        title: "That gathered skirt",
        body: "The movement is unreal. True to size, the AU 8 fits my frame beautifully.",
      },
    ],
  },
  {
    id: "serendib-pearl-dress",
    name: "The Island Pearl Maxi Dress",
    category: "Dresses",
    story: "The Serendib Pearl",
    storyPlace: "The Coastal Waters of Serendib",
    destinations: ["Beach", "Party"],
    colorName: "Ivory White",
    colorHex: "#F6F5F2",
    palette: ["#F6F5F2", "#DCC7AF", "#C8D8E6"],
    fabric: "Pure Cotton with Cutwork Lace",
    priceAud: 285,
    image: "/images/serendipity/serendib-pearl-dress.jpg",
    imageHover: "/images/serendipity/serendib-pearl-dress-hover.jpg",
    videoHover: "/videos/serendipity/serendib-pearl-dress-hover.mp4",
    gallery: [
      "/images/serendipity/serendib-pearl-dress.jpg",
      "/images/serendipity/serendib-pearl-dress-hover.jpg",
      "/images/serendipity/serendib-pearl-dress-full.jpg",
    ],
    sizes: AU_SIZES,
    description:
      "A celebration of coastal pearl lustre. Hand-cut lace along the neckline and a sweeping cutwork scallop hem.",
    heritage:
      "Hidden beneath the waters of Serendib, the pearl waits — an unexpected treasure revealed only by quiet beauty. Cutwork lace and a gently gathered waist echo shell texture and the slow movement of the ocean, carrying that lustre from the shore into your wardrobe.",
    quote: "Hidden beneath the water, an unexpected treasure of quiet beauty.",
    craftDetails: [
      "Hand-cut cutwork lace neckline",
      "Gathered empire waist",
      "Scalloped cutwork hem",
      "Adjustable back tie",
    ],
    care: ["Hand wash cold", "Do not bleach", "Cool iron lace on reverse"],
    reviews: [
      {
        name: "Isabelle R.",
        location: "Byron Bay, NSW",
        rating: 5,
        date: "June 2026",
        title: "Wore it to a coastal wedding",
        body: "Photographs like a dream and stayed cool all day. The lace detail is genuinely handmade quality.",
      },
      {
        name: "Priya S.",
        location: "Sydney, NSW",
        rating: 4,
        date: "April 2026",
        title: "Elegant and breezy",
        body: "Beautiful drape. I sized up for a looser look and it was perfect.",
      },
    ],
  },
  {
    id: "pettah-check-dress",
    name: "A Pettah Discovery A-Line Dress",
    category: "Dresses",
    story: "A Pettah Discovery",
    storyPlace: "The Red Mosque, Pettah",
    destinations: ["City", "Everyday"],
    colorName: "Crimson Check",
    colorHex: "#A82B35",
    palette: ["#A82B35", "#F6F5F2", "#AFC8B1"],
    fabric: "Handwoven Cotton Gingham",
    priceAud: 220,
    image: "/images/serendipity/pettah-check-dress.jpg",
    imageHover: "/images/serendipity/pettah-check-dress-hover.jpg",
    videoHover: "/videos/serendipity/pettah-check-dress-hover.mp4",
    gallery: [
      "/images/serendipity/pettah-check-dress.jpg",
      "/images/serendipity/pettah-check-dress-hover.jpg",
      "/images/serendipity/pettah-check-dress-full.jpg",
    ],
    sizes: AU_SIZES,
    description:
      "Inspired by Colombo's candy-striped Red Mosque. An architectural notched collar and tailored button rhythm.",
    heritage:
      "Among Pettah's restless streets stands the candy-striped Jumma Mosque, its red-and-white arches unmistakable against the noise. That rhythm of pattern, contrast and architecture shapes this notched-collar, A-line dress — a quiet discovery carried out of the old city.",
    quote: "Among Pettah's restless streets, an unexpected pattern stops you.",
    craftDetails: [
      "Notched lapel collar",
      "Covered button front placket",
      "A-line silhouette with waist seam",
      "Handwoven gingham, yarn-dyed",
    ],
    care: ["Cold machine wash", "Line dry", "Warm iron"],
    reviews: [
      {
        name: "Georgia T.",
        location: "Melbourne, VIC",
        rating: 5,
        date: "May 2026",
        title: "So flattering",
        body: "The A-line is perfect for the office and weekends alike. The collar detail makes it feel tailored.",
      },
      {
        name: "Hannah W.",
        location: "Adelaide, SA",
        rating: 5,
        date: "March 2026",
        title: "Everyday favourite",
        body: "Bought it for work, now I wear it everywhere. The gingham is a proper handloom weave.",
      },
    ],
  },
  {
    id: "ocean-embraced-tiered-dress",
    name: "Embraced By Blue Tiered Maxi",
    category: "Dresses",
    story: "Embraced by Blue",
    storyPlace: "Where the Island Meets the Ocean",
    destinations: ["Beach", "Everyday"],
    colorName: "Washed Sea Blue",
    colorHex: "#2F4F6F",
    palette: ["#2F4F6F", "#C8D8E6", "#F6F5F2"],
    fabric: "Chambray Weave Cotton",
    priceAud: 260,
    image: "/images/serendipity/ocean-embraced-tiered-dress.jpg",
    imageHover: "/images/serendipity/ocean-embraced-tiered-dress-hover.jpg",
    videoHover: "/videos/serendipity/ocean-embraced-tiered-dress-hover.mp4",
    gallery: [
      "/images/serendipity/ocean-embraced-tiered-dress.jpg",
      "/images/serendipity/ocean-embraced-tiered-dress-hover.jpg",
      "/images/serendipity/ocean-embraced-tiered-dress-full.jpg",
    ],
    sizes: AU_SIZES,
    description:
      "Where the island meets the sea. Soft washed chambray woven in gathered wave tiers for sun-drenched days.",
    heritage:
      "When the island meets the ocean, an endless blue journey quietly begins. Washed chambray falls in gathered wave tiers — freedom, movement and calm woven into a maxi made for long, sun-drenched Australian days by the water.",
    quote: "When the island cries, an endless blue journey quietly begins.",
    craftDetails: [
      "Gathered wave tiers",
      "Shell button placket",
      "Relaxed coastal drape",
      "Breathable chambray weave",
    ],
    care: ["Cold machine wash", "Line dry in shade", "Warm iron"],
    reviews: [
      {
        name: "Maddie L.",
        location: "Sunshine Coast, QLD",
        rating: 5,
        date: "June 2026",
        title: "My summer uniform",
        body: "The tiers move so beautifully in the breeze. Genuinely cool to wear in the heat.",
      },
      {
        name: "Sana K.",
        location: "Perth, WA",
        rating: 4,
        date: "February 2026",
        title: "Lovely blue",
        body: "The washed chambray colour is exactly like the photos. Roomy and comfortable.",
      },
    ],
  },
  {
    id: "shore-traces-blouse",
    name: "Traces in the Sand Peplum Top",
    category: "Tops & Blouses",
    story: "Traces in the Sand",
    storyPlace: "The Sri Lankan Shore",
    destinations: ["Beach", "City"],
    colorName: "Sand Beige Check",
    colorHex: "#DCC7AF",
    palette: ["#DCC7AF", "#F6F5F2", "#A46446"],
    fabric: "Fine Handloom Cotton",
    priceAud: 175,
    image: "/images/serendipity/shore-traces-blouse.jpg",
    imageHover: "/images/serendipity/shore-traces-blouse-hover.jpg",
    videoHover: "/videos/serendipity/shore-traces-blouse-hover.mp4",
    gallery: [
      "/images/serendipity/shore-traces-blouse.jpg",
      "/images/serendipity/shore-traces-blouse-hover.jpg",
      "/images/serendipity/shore-traces-blouse-full.jpg",
    ],
    sizes: AU_SIZES,
    description:
      "Tidal ripple motifs and soft sand checks, shaped with a peplum hem and corsetry-inspired seams.",
    heritage:
      "With every returning tide, the sand reveals a pattern never seen before. Shoreline lines and tidal ripples shape this peplum of fine sand-check handloom — structured yet soft, a trace of the shore you can carry into the city.",
    quote: "With every returning tide, the sand reveals a pattern never seen before.",
    craftDetails: [
      "Shaped peplum hem",
      "Fine woven sand check",
      "Adjustable rear ties",
      "Structural corsetry seams",
    ],
    care: ["Hand wash cold", "Line dry", "Cool iron"],
    reviews: [
      {
        name: "Ella F.",
        location: "Newcastle, NSW",
        rating: 5,
        date: "May 2026",
        title: "Structured but comfy",
        body: "Tucks or wears out beautifully. The peplum is so flattering with high-waist trousers.",
      },
      {
        name: "Ruwani J.",
        location: "Melbourne, VIC",
        rating: 5,
        date: "April 2026",
        title: "Gorgeous handloom",
        body: "You can feel the quality of the weave. Dresses up or down effortlessly.",
      },
    ],
  },
  {
    id: "cinnamon-flow-skirt",
    name: "Cinnamon Flow Bias Maxi Skirt",
    category: "Skirts & Pants",
    story: "Cinnamon Flow",
    storyPlace: "The Ceylon Cinnamon Gardens",
    destinations: ["Party", "City"],
    colorName: "Cinnamon Satin",
    colorHex: "#A46446",
    palette: ["#A46446", "#F6F5F2", "#DCC7AF"],
    fabric: "Recycled Silk & Lyocell Blend",
    priceAud: 195,
    image: "/images/serendipity/cinnamon-flow-skirt.jpg",
    imageHover: "/images/serendipity/cinnamon-flow-skirt-hover.jpg",
    videoHover: "/videos/serendipity/cinnamon-flow-skirt-hover.mp4",
    gallery: [
      "/images/serendipity/cinnamon-flow-skirt.jpg",
      "/images/serendipity/cinnamon-flow-skirt-hover.jpg",
      "/images/serendipity/cinnamon-flow-skirt-full.jpg",
    ],
    sizes: AU_SIZES,
    description:
      "Rich cinnamon spice with earthy undertones, draped in a fluid bias cut for maximum grace.",
    heritage:
      "Drawn from the bark of Ceylon cinnamon — warm, grounding and quietly luxurious. A fluid bias cut lets the spice-brown silk move like poured honey, catching the light with every step from dinner to the dance floor.",
    quote: "Warm, grounding, and quietly luxurious.",
    craftDetails: [
      "Bias-cut fluid drape",
      "Elasticated internal waistband",
      "French seams throughout",
      "Recycled silk blend",
    ],
    care: ["Dry clean, or gentle hand wash cold", "Line dry flat", "Cool iron"],
    reviews: [
      {
        name: "Tara D.",
        location: "Sydney, NSW",
        rating: 5,
        date: "June 2026",
        title: "That satin drape",
        body: "The bias cut is so elegant. Wore it to a dinner and felt incredible. The colour is rich and warm.",
      },
      {
        name: "Nadia H.",
        location: "Brisbane, QLD",
        rating: 5,
        date: "March 2026",
        title: "Effortlessly elegant",
        body: "Pairs with everything from a tee to a silk cami. The waistband is comfortable all night.",
      },
    ],
  },
  {
    id: "celestial-terracotta-skirt",
    name: "Celestial Bloom Pleated Maxi",
    category: "Skirts & Pants",
    story: "Celestial Bloom",
    storyPlace: "The Sigiriya Frescoes",
    destinations: ["Party", "Garden"],
    colorName: "Sigiriya Terracotta",
    colorHex: "#B86B4B",
    palette: ["#B86B4B", "#F6F5F2", "#DCC7AF"],
    fabric: "Crinkle Linen & Cotton",
    priceAud: 210,
    image: "/images/serendipity/celestial-terracotta-skirt.jpg",
    imageHover: "/images/serendipity/celestial-terracotta-skirt-hover.jpg",
    videoHover: "/videos/serendipity/celestial-terracotta-skirt-hover.mp4",
    gallery: [
      "/images/serendipity/celestial-terracotta-skirt.jpg",
      "/images/serendipity/celestial-terracotta-skirt-hover.jpg",
      "/images/serendipity/celestial-terracotta-skirt-full.jpg",
    ],
    sizes: AU_SIZES,
    description:
      "Inspired by the ancient Sigiriya frescoes. Rich terracotta hues with subtle pleated movement.",
    heritage:
      "Painted on an ancient rock wall, the maidens of Sigiriya still bloom after fifteen centuries. Terracotta hues and softly pleated movement carry their timeless grace forward into a maxi that feels both grounded and quietly celestial.",
    quote: "From an ancient painted wall, a timeless grace quietly reappears.",
    craftDetails: [
      "Gathered waistband",
      "Breathable crinkle finish",
      "Deep concealed side pockets",
      "Fluid pleated fall",
    ],
    care: ["Cold machine wash", "Line dry to keep crinkle", "No iron needed"],
    reviews: [
      {
        name: "Bianca N.",
        location: "Fremantle, WA",
        rating: 5,
        date: "May 2026",
        title: "Pockets!",
        body: "Deep, real pockets in a skirt this pretty. The terracotta is stunning against tan.",
      },
      {
        name: "Dilini A.",
        location: "Canberra, ACT",
        rating: 4,
        date: "February 2026",
        title: "Beautiful movement",
        body: "The crinkle linen keeps its shape and travels really well. No ironing.",
      },
    ],
  },
  {
    id: "tea-leaf-two-piece",
    name: "A Leaf Unfolds Linen Set",
    category: "Two Piece Sets",
    story: "A Leaf Unfolds",
    storyPlace: "The Ceylon Tea Hills",
    destinations: ["Garden", "City"],
    colorName: "Tea Leaf Olive",
    colorHex: "#5E6C52",
    palette: ["#5E6C52", "#DCC7AF", "#F6F5F2"],
    fabric: "100% Breathable Organic Linen",
    priceAud: 290,
    image: "/images/serendipity/tea-leaf-two-piece.jpg",
    imageHover: "/images/serendipity/tea-leaf-two-piece-hover.jpg",
    videoHover: "/videos/serendipity/tea-leaf-two-piece-hover.mp4",
    gallery: [
      "/images/serendipity/tea-leaf-two-piece.jpg",
      "/images/serendipity/tea-leaf-two-piece-hover.jpg",
      "/images/serendipity/tea-leaf-two-piece-full.jpg",
    ],
    sizes: AU_SIZES,
    description:
      "From Sri Lanka's high tea hills. A curved-yoke crop paired with an effortless tiered skirt.",
    heritage:
      "From one tender leaf, an entire landscape quietly unfolds. Ceylon's high-altitude tea hills give this olive linen set its sense of growth, contour and gentle movement — a curved-yoke crop and a flowing tiered skirt that breathe with you.",
    quote: "From one tender leaf, an entire landscape quietly unfolds.",
    craftDetails: [
      "Curved crop yoke",
      "Gathered natural waist skirt",
      "Natural coconut buttons",
      "Two-piece, worn together or apart",
    ],
    care: ["Cold machine wash", "Line dry in shade", "Warm iron"],
    reviews: [
      {
        name: "Freya B.",
        location: "Hobart, TAS",
        rating: 5,
        date: "June 2026",
        title: "Two pieces, endless outfits",
        body: "I wear the crop with jeans and the skirt with a tee — feels like three outfits in one. The linen is gorgeous.",
      },
      {
        name: "Meera V.",
        location: "Sydney, NSW",
        rating: 5,
        date: "April 2026",
        title: "That olive green",
        body: "The colour is even better in person. Breathable and elegant for warm days.",
      },
    ],
  },
];

export const CATEGORIES: (Category | "All")[] = [
  "All",
  "Dresses",
  "Tops & Blouses",
  "Skirts & Pants",
  "Two Piece Sets",
];

export interface DestinationMeta {
  key: Destination;
  label: string;
  tagline: string;
}

export const DESTINATIONS: DestinationMeta[] = [
  { key: "Beach", label: "Beach & Coast", tagline: "Airy linens, ocean blues" },
  { key: "Party", label: "Evening & Party", tagline: "Satin drape, warm glow" },
  { key: "City", label: "City & Work", tagline: "Tailored, easy structure" },
  { key: "Garden", label: "Garden & Day", tagline: "Soft florals, calm tones" },
  { key: "Everyday", label: "Everyday Ease", tagline: "Wear-anywhere staples" },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === slug);
}
