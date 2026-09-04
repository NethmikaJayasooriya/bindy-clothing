/**
 * BINDY Clothing — Journal & Field Notes Data Layer
 * Poetic essays on heritage craft, slow travel, and intentional living.
 */

export interface JournalArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  author: string;
  category: "Field Notes" | "Artisan Voices" | "Wardrobe Rituals" | "Heritage";
  image: string;
  excerpt: string;
  content: string[];
  tags: string[];
}

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: "journal-1",
    slug: "the-morning-we-wept-over-silk",
    title: "The Morning We Watched the First Shuttle Fly",
    subtitle: "A travelogue from the village of Gampaha",
    date: "August 14, 2026",
    readTime: "5 min read",
    author: "Vinudhi Ranasinghe",
    category: "Field Notes",
    image: "/images/serendipity/lotus-memory-dress-full.jpg",
    excerpt:
      "There is a rhythm to an ancient wooden loom that cannot be simulated. It settles your pulse. Standing in a village shed as monsoon rain beat against terracotta tiles, we knew BINDY was alive.",
    content: [
      "The drive from Colombo into Gampaha begins in petrol fumes and congested avenues before slipping into the deep emerald quiet of rubber estates and wild cinnamon groves. By the time you reach Kanthi's courtyard, the world has narrowed down to birdsong and the heavy scent of wet earth.",
      "Kanthi is sixty-two. Her hands are weathered like river stones, yet when she handles raw cotton warp, her touch is as tender as a mother smoothing her child's hair. For forty years, she has operated the same teak pit-loom built by her grandfather.",
      "When she pressed the wooden treadle and shot the bamboo shuttle across for our first test sample of Serendipity 01, the sound was not mechanical. It was the sound of heartbeat and breath. Watching that ivory cotton voile emerge thread by thread, Dilrukshi and I looked at each other and wept silent tears of gratitude.",
      "In that moment, fast fashion felt like a distant, hollow madness. Why would anyone want clothes made in seconds by exhausted machines when they could wear a piece touched by this level of presence and grace?",
    ],
    tags: ["Sri Lanka", "Artisans", "Slow Fashion", "Handloom"],
  },
  {
    id: "journal-2",
    slug: "why-we-chose-natural-shell-buttons",
    title: "Why We Chose Natural Shell Buttons Over Plastic Resin",
    subtitle: "The quiet importance of small, organic details",
    date: "July 28, 2026",
    readTime: "4 min read",
    author: "Dilrukshi Wickramarathna",
    category: "Artisan Voices",
    image: "/images/serendipity/serendib-pearl-dress-detail.jpg",
    excerpt:
      "Most modern garments use petroleum-based plastic buttons dyed to mimic horn or pearl. Here is why we insist that every button on a BINDY dress comes from ocean shell or coconut husk.",
    content: [
      "In the commercial garment manufacturing world, buttons are an afterthought. Factories buy polyester resin discs in sacks of ten thousand for fractions of a cent. They look convincing from two feet away, but touch them, and they are cold, slippery plastic.",
      "When we founded BINDY, we made an uncompromising rule: if a garment is designed to return to the earth one day, it cannot carry tiny plastic anchors down the front of its placket.",
      "Our mother-of-pearl buttons are individually carved from discarded oyster shells gathered by artisanal divers along the Mannar coastline. When you fasten your dress in the morning, your fingers touch cool, luminous mineral calcium shaped by the Indian Ocean. No two buttons have the exact same iridescence. That is not a flaw; it is proof of life.",
    ],
    tags: ["Materials", "Sustainability", "Buttons", "Ocean"],
  },
  {
    id: "journal-3",
    slug: "packing-linen-for-the-queensland-summer",
    title: "Packing Handloom Linen for a Subtropical Australian Summer",
    subtitle: "Notes on staying calm, cool, and beautifully composed in the heat",
    date: "June 12, 2026",
    readTime: "4 min read",
    author: "Binadhi Ranasinghe",
    category: "Wardrobe Rituals",
    image: "/images/serendipity/tea-leaf-two-piece-full.jpg",
    excerpt:
      "Subtropical heat demands clothes that do not cling or trap sweat. Here is how we style unbleached linen and cotton voile for humid days that stretch into balmy outdoor evenings.",
    content: [
      "Summer in Brisbane and coastal Queensland has an intoxicating, languid pace. But the midday humidity can be unforgiving if your wardrobe is loaded with synthetic fibers like polyester or nylon blends.",
      "Natural handloom cotton and washed linen have microscopic hollow cores. They actively wick moisture away from your skin while allowing ambient breezes to circulate through the weave.",
      "My warm-weather uniform is straightforward: our Tea Leaf crop paired with the tiered midi skirt, a woven rattan market basket, and flat leather slides. If the evening turns breezy along the riverbank, an unbuttoned crisp cotton shirting layer over the shoulders is all that's required.",
    ],
    tags: ["Styling", "Summer", "Brisbane", "Linen"],
  },
  {
    id: "journal-4",
    slug: "the-architecture-of-pettah",
    title: "The Architecture of Pettah: Colombo's Red Mosque in Fabric",
    subtitle: "Translating century-old candy-striped minarets into a summer dress",
    date: "May 19, 2026",
    readTime: "6 min read",
    author: "Vinudhi Ranasinghe",
    category: "Heritage",
    image: "/images/serendipity/pettah-check-dress-full.jpg",
    excerpt:
      "Pettah is chaotic, vibrant, and alive with trade. Rising above it all is Jami Ul-Alfar. How we took Colombo's most iconic red-and-white stripes and created our favorite summer check.",
    content: [
      "If you stand on Main Street in Colombo's Pettah district at three in the afternoon, your senses are flooded. Sacks of dried red chilies, strings of jasmine garlands, vintage copper brassware, and the ringing bells of three-wheelers.",
      "Then you look up. Above the storefronts rise the brick minarets of the Jami Ul-Alfar Mosque, painted in alternating red and white brick courses like a confection of architectural joy. Built in 1908 by master builder H.L. Saibo Lebbe, it was intentionally visible from miles out at sea.",
      "We took that bold graphic contrast and softened it into an organic yarn-dyed gingham weave. It carries the memory of Colombo's most iconic landmark, tailored into a shirt dress that feels equally at home strolling Hastings Street in Noosa.",
    ],
    tags: ["Architecture", "Pettah", "Colombo", "Gingham"],
  },
];

export function getJournalArticle(slug: string): JournalArticle | undefined {
  return JOURNAL_ARTICLES.find((a) => a.slug === slug);
}
