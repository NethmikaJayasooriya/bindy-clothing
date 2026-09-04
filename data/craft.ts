/**
 * BINDY Clothing — Artisan Craft & Sustainability Data Layer
 * Details the ancient handloom technique, material integrity, and community impact.
 */

export interface CraftMaterial {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  desc: string;
  origin: string;
  sustainability: string;
  careAdvice: string;
  image: string;
}

export interface CraftProcessStep {
  step: string;
  title: string;
  subtitle: string;
  desc: string;
  duration: string;
  image: string;
}

export const CRAFT_MATERIALS: CraftMaterial[] = [
  {
    id: "handloom-cotton",
    title: "Handloom Cotton",
    subtitle: "Heritage in Every Thread",
    badge: "Artisan Woven",
    desc: "Textured, breathable handloom woven by traditional Sri Lankan artisan communities on ancestral wooden pit-looms. Naturally temperature-regulating with a subtle textural slub.",
    origin: "Gampaha & Western Province Weaving Cooperatives",
    sustainability: "Zero electricity consumed during weaving. 100% biodegradable organic raw cotton.",
    careAdvice: "Cold gentle hand or machine wash. Line dry in shade to preserve raw thread texture.",
    image: "/images/serendipity/lotus-memory-dress-detail.jpg",
  },
  {
    id: "embroidered-voile",
    title: "Embroidered Voile",
    subtitle: "Light & Sheer Romance",
    badge: "Hand Detailed",
    desc: "Delicate floral embroidery and cutwork scallop motifs adding a soft feminine touch to airy, featherlight silhouettes designed for warm subtropical weather.",
    origin: "Southern Coastal Artisan Guild, Galle",
    sustainability: "Small-batch embroidery using Oeko-Tex Standard 100 certified non-toxic threads.",
    careAdvice: "Wash inside a laundry bag. Warm iron on reverse side to lift embroidery relief.",
    image: "/images/serendipity/serendib-pearl-dress-detail.jpg",
  },
  {
    id: "recycled-silk-lyocell",
    title: "Recycled Silk & Lyocell",
    subtitle: "Fluid Drape & Conscious Luxury",
    badge: "Conscious Blend",
    desc: "Fluid and elegant blends creating liquid movement under the Australian sun. Silky soft against the skin with an ethereal drape that resists heavy wrinkling.",
    origin: "Ethically Sourced Recycled Yarn Spinning Mill",
    sustainability: "Closed-loop solvent spinning recycling 99.5% of water and organic solvents.",
    careAdvice: "Gentle cold cycle. Steam to remove packing creases effortlessly.",
    image: "/images/serendipity/ocean-embraced-tiered-dress-detail.jpg",
  },
  {
    id: "natural-shell-buttons",
    title: "Natural Shell & Coconut Buttons",
    subtitle: "Organic Accents",
    badge: "100% Organic",
    desc: "Each button is individually cut, shaped, and polished from reclaimed organic mother-of-pearl oyster shell or discarded Sri Lankan coconut timber. No two buttons are identical.",
    origin: "Artisan Lapidary Workshops, Kalutara District",
    sustainability: "Zero synthetic plastic resin. 100% compostable and ocean-safe.",
    careAdvice: "Avoid harsh chemical detergents to maintain natural pearlescent lustre.",
    image: "/images/serendipity/cinnamon-flow-skirt-detail.jpg",
  },
];

export const CRAFT_PROCESS_STEPS: CraftProcessStep[] = [
  {
    step: "01",
    title: "Yarn Preparation & Natural Dyeing",
    subtitle: "Raw Unbleached Cotton Spools",
    desc: "Long-staple raw cotton yarns are conditioned, hand-spun, and steeped in plant-derived pigments extracted from cinnamon bark, dried madder root, turmeric, and tea leaves.",
    duration: "3 to 5 Days",
    image: "/images/destinations/garden.jpg",
  },
  {
    step: "02",
    title: "Warping the Wooden Loom",
    subtitle: "Mathematical Precision by Hand",
    desc: "Over 2,400 individual warp threads are counted, tensioned, and threaded through wooden heddles by eye and feel. This painstaking step determines the drape of the final fabric.",
    duration: "2 Days per Loom",
    image: "/images/destinations/city.jpg",
  },
  {
    step: "03",
    title: "Rhythmic Shuttle Weaving",
    subtitle: "Human Pace, Living Texture",
    desc: "The weaver coordinates foot treadles and flying wooden shuttles with steady cadence. An experienced master weaver produces just four to six meters of fabric each day.",
    duration: "4 to 6 Meters Daily",
    image: "/images/serendipity/shore-traces-blouse-detail.jpg",
  },
  {
    step: "04",
    title: "Tailoring & Natural Shell Finishes",
    subtitle: "Couture Quality in Colombo",
    desc: "Woven lengths rest for 48 hours before being cut to pattern. French seams, bias binding, and hand-stitched natural shell buttons complete each limited edition silhouette.",
    duration: "Small-Batch of 25 Pieces",
    image: "/images/destinations/everyday.jpg",
  },
];

export const ETHICAL_PILLARS = [
  {
    title: "Fair Living Wages",
    stat: "1.8×",
    desc: "We pay 1.8 times the standard national artisan wage, empowering rural women to provide education and healthcare for their families.",
  },
  {
    title: "Zero Fast Fashion Waste",
    stat: "0%",
    desc: "Small-batch drops produced in numbered editions of 25 to 50 pieces. We never burn or landfill excess inventory.",
  },
  {
    title: "Plastic-Free Packaging",
    stat: "100%",
    desc: "Shipped in unbleached compostable mailers with organic cotton keepsake tote bags and recycled seed-paper garment tags.",
  },
  {
    title: "Loom Heritage Revival",
    stat: "14+",
    desc: "Directly supporting and keeping 14 ancestral wooden pit-looms actively operating across two Sri Lankan weaving villages.",
  },
];
