/**
 * BINDY Clothing — Social Proof Data Layer
 * Aggregate reviews, press quotes, and Instagram community gallery (#BindyJourneys).
 */

export interface PressQuote {
  publication: string;
  quote: string;
  location: string;
}

export interface UgcPost {
  id: string;
  handle: string;
  location: string;
  image: string;
  garment: string;
  caption: string;
  likes: number;
}

export const PRESS_QUOTES: PressQuote[] = [
  {
    publication: "Vogue Australia",
    quote: "BINDY brings the soul of Sri Lankan handloom to the modern Australian wardrobe with poetic restraint.",
    location: "Sydney, NSW",
  },
  {
    publication: "Russh Magazine",
    quote: "A quiet antidote to fashion's frantic pace. The kind of honest garments you cherish for decades.",
    location: "Melbourne, VIC",
  },
  {
    publication: "Broadsheet",
    quote: "Bridging Brisbane sunshine and Colombo craft, mother-and-daughter trio BINDY is redefining conscious luxury.",
    location: "Brisbane, QLD",
  },
  {
    publication: "Peppermint Magazine",
    quote: "From pit-looms in Gampaha to river picnics in New Farm: ethical fashion storytelling at its most sincere.",
    location: "Gold Coast, QLD",
  },
];

export const UGC_POSTS: UgcPost[] = [
  {
    id: "ugc-1",
    handle: "@claire.matthews",
    location: "Byron Bay, NSW",
    image: "/images/serendipity/lotus-memory-dress-hover.jpg",
    garment: "Lotus Memory Dress",
    caption: "Golden hour salt air in the prettiest lotus pink voile. Feels like wearing morning light.",
    likes: 342,
  },
  {
    id: "ugc-2",
    handle: "@sophie_williams",
    location: "New Farm Park, Brisbane",
    image: "/images/serendipity/tea-leaf-two-piece-hover.jpg",
    garment: "Tea Leaf Two-Piece Set",
    caption: "Under the jacaranda trees wearing pure hand-woven green linen. The fit on this set is divine.",
    likes: 418,
  },
  {
    id: "ugc-3",
    handle: "@amara.perera",
    location: "Galle Fort, Sri Lanka",
    image: "/images/serendipity/serendib-pearl-dress-hover.jpg",
    garment: "Serendib Pearl Dress",
    caption: "Brought my Bindy dress back to the island where its threads were born. Scalloped hems flutter in the monsoon breeze.",
    likes: 589,
  },
  {
    id: "ugc-4",
    handle: "@elena_rossi",
    location: "Cottesloe Beach, WA",
    image: "/images/serendipity/cinnamon-flow-skirt-hover.jpg",
    garment: "Cinnamon Flow Midi Skirt",
    caption: "Barefoot sunset walk. The natural coconut buttons and earth pigments are extraordinary.",
    likes: 276,
  },
  {
    id: "ugc-5",
    handle: "@talia.sydney",
    location: "Paddington, NSW",
    image: "/images/serendipity/pettah-check-dress-hover.jpg",
    garment: "Pettah Discovery Dress",
    caption: "Saturday gallery hops in crisp Colombo gingham. So many compliments today!",
    likes: 391,
  },
  {
    id: "ugc-6",
    handle: "@maya_fernando",
    location: "Noosa Heads, QLD",
    image: "/images/serendipity/ocean-embraced-tiered-dress-hover.jpg",
    garment: "Ocean Embraced Tiered Dress",
    caption: "The liquid drape of this recycled silk blend is unlike anything in my summer wardrobe.",
    likes: 512,
  },
];
