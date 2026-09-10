"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from "framer-motion";
import {
  Play,
  Pause,
  ArrowRight,
  Tag,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  RotateCw,
  Layers,
} from "lucide-react";

// =========================================================================
// 1. DATA SOURCES: 2 COLLECTIONS × 2 SECTIONS × 4 IMAGES PER SECTION
// Sourced directly from public/images/hero images only/
// =========================================================================

export interface HeroLookItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  priceAud: number;
  origin: string;
  caption: string;
  src: string;
}

export interface HeroSectionData {
  id: string;
  title: string;
  shortTitle: string;
  tagline: string;
  items: [HeroLookItem, HeroLookItem, HeroLookItem, HeroLookItem];
}

export interface HeroCollectionData {
  id: string;
  name: string;
  shortName: string;
  badge: string;
  sections: [HeroSectionData, HeroSectionData];
}

export const HERO_COLLECTIONS_DATA: HeroCollectionData[] = [
  {
    id: "collection-1",
    name: "Collection 01 • Serendipity Origins",
    shortName: "Collection 01",
    badge: "Signature Archive",
    sections: [
      {
        id: "col1-sec1",
        title: "Island Sun & Silhouettes",
        shortTitle: "Section 01",
        tagline: "Natural Voile & Flowing Bias Silhouettes",
        items: [
          {
            id: "cinnamon-flow-skirt",
            slug: "cinnamon-flow-skirt",
            name: "Cinnamon Flow Skirt",
            category: "Bias Silk Skirt",
            priceAud: 195,
            origin: "Ella Looms",
            caption: "Rich Cinnamon Satin",
            src: "/images/hero images only/collection 1/section 1/cinnamon-flow-skirt.jpg",
          },
          {
            id: "lotus-memory-dress",
            slug: "lotus-memory-dress",
            name: "Lotus Memory Dress",
            category: "Strapless Dress",
            priceAud: 240,
            origin: "Gampaha Looms",
            caption: "Lotus Voile Editorial",
            src: "/images/hero images only/collection 1/section 1/lotus-memory-dress.jpg",
          },
          {
            id: "ocean-embraced-tiered-dress",
            slug: "ocean-embraced-tiered-dress",
            name: "Embraced By Blue Maxi",
            category: "Chambray Weave",
            priceAud: 260,
            origin: "Matale Workshop",
            caption: "Washed Sea Blue Drape",
            src: "/images/hero images only/collection 1/section 1/ocean-embraced-tiered-dress.jpg",
          },
          {
            id: "pettah-check-dress",
            slug: "pettah-check-dress",
            name: "Pettah Check Slip Dress",
            category: "Handwoven Check",
            priceAud: 215,
            origin: "Colombo Guild",
            caption: "Heritage Grid Weave",
            src: "/images/hero images only/collection 1/section 1/pettah-check-dress.jpg",
          },
        ],
      },
      {
        id: "col1-sec2",
        title: "Coastal Breeze & Lace",
        shortTitle: "Section 02",
        tagline: "Scalloped Cutwork Lace & Sun-Washed Earth",
        items: [
          {
            id: "celestial-terracotta-skirt",
            slug: "celestial-terracotta-skirt",
            name: "Celestial Terracotta Skirt",
            category: "Gathered Earth Linen",
            priceAud: 225,
            origin: "Kandy Workshop",
            caption: "Warm Earth Pigments",
            src: "/images/hero images only/collection 1/section 2/celestial-terracotta-skirt.jpg",
          },
          {
            id: "serendib-pearl-dress",
            slug: "serendib-pearl-dress",
            name: "The Island Pearl Maxi",
            category: "Cutwork Maxi",
            priceAud: 285,
            origin: "Mannar Guild",
            caption: "Scalloped Cutwork Hem",
            src: "/images/hero images only/collection 1/section 2/serendib-pearl-dress.jpg",
          },
          {
            id: "shore-traces-blouse",
            slug: "shore-traces-blouse",
            name: "Shore Traces Blouse",
            category: "Pure Cotton Voile",
            priceAud: 180,
            origin: "Galle Workshop",
            caption: "Featherlight Drape",
            src: "/images/hero images only/collection 1/section 2/shore-traces-blouse.jpg",
          },
          {
            id: "tea-leaf-two-piece",
            slug: "tea-leaf-two-piece",
            name: "Tea Leaf Two-Piece",
            category: "Tailored Handloom Set",
            priceAud: 295,
            origin: "Nuwara Eliya Looms",
            caption: "Highland Sage Weave",
            src: "/images/hero images only/collection 1/section 2/tea-leaf-two-piece.jpg",
          },
        ],
      },
    ],
  },
  {
    id: "collection-2",
    name: "Collection 02 • High Summer Botanicals",
    shortName: "Collection 02",
    badge: "Artisan Drop",
    sections: [
      {
        id: "col2-sec1",
        title: "Flora & Golden Cascade",
        shortTitle: "Section 01",
        tagline: "Sunlit Florals & Hand-Blocked Botanicals",
        items: [
          {
            id: "golden-cascade",
            slug: "golden-cascade",
            name: "A Golden Cascade",
            category: "Ehela Blossom Silk",
            priceAud: 295,
            origin: "Ruhuna Guild",
            caption: "Inspired by Sri Lanka's Ehela",
            src: "/images/new info/collection 2/A_GOLDEN_CASCADE_Inspired_by_Sri_Lankas_Ehela_blossom/A_GOLDEN_CASCADE_Inspired_by_Sri_Lankas_Ehela_blossom.jpeg",
          },
          {
            id: "beyond-the-garden-wall",
            slug: "beyond-the-garden-wall",
            name: "Beyond The Garden Wall",
            category: "Botanical Voile Gown",
            priceAud: 310,
            origin: "Sigiriya Atelier",
            caption: "Botanical Garden Motif",
            src: "/images/new info/collection 2/beyond the garden wall/beyond the garden wall.jpeg",
          },
          {
            id: "sunset-stroll",
            slug: "sunset-stroll",
            name: "Sunset Stroll Silhouette",
            category: "Ochre Handloom",
            priceAud: 270,
            origin: "Bentota Looms",
            caption: "Warm Golden Hour Weave",
            src: "/images/new info/collection 2/Sunset Stroll/0Y9A0074.JPG",
          },
          {
            id: "sweet-breeze",
            slug: "sweet-breeze",
            name: "Sweet Breeze Maxi",
            category: "Pastel Handloom",
            priceAud: 265,
            origin: "Negombo Craft",
            caption: "Airy Coastal Silhouette",
            src: "/images/new info/collection 2/Sweet Breeze/0Y9A0124.JPG",
          },
        ],
      },
      {
        id: "col2-sec2",
        title: "Midnight Bloom & Atelier",
        shortTitle: "Section 02",
        tagline: "Deep Crimson & Nocturnal Florals",
        items: [
          {
            id: "the-crimson-lotus",
            slug: "the-crimson-lotus",
            name: "The Crimson Lotus",
            category: "Heritage Silk Crepe",
            priceAud: 320,
            origin: "Dambulla Atelier",
            caption: "Deep Crimson Hand-Drape",
            src: "/images/new info/collection 2/The Crimson Lotus/The Crimson Lotus 1.jpeg",
          },
          {
            id: "the-midnight-bloom",
            slug: "the-midnight-bloom",
            name: "The Midnight Bloom",
            category: "Embroidered Voile",
            priceAud: 340,
            origin: "Hikkaduwa Guild",
            caption: "Nocturnal Floral Embroidery",
            src: "/images/new info/collection 2/The Midnight Bloom/The Midnight Bloom.jpeg",
          },
          {
            id: "desert-rose",
            slug: "desert-rose",
            name: "Desert Rose Ensemble",
            category: "Sun-Bleached Linen",
            priceAud: 280,
            origin: "Jaffna Looms",
            caption: "Sculpted Desert Earth Tones",
            src: "/images/new info/collection 2/Desert Rose/491359925_1218755440258894_9128689862156059991_n.jpg",
          },
          {
            id: "tropic-lagoon",
            slug: "tropic-lagoon",
            name: "Tropic Lagoon Gown",
            category: "Island Silk Drape",
            priceAud: 315,
            origin: "Mirissa Guild",
            caption: "Ocean Azure Gradient",
            src: "/images/new info/collection 2/Tropic Lagoon/492230020_1217267283741043_7201811062395837141_n.jpg",
          },
        ],
      },
    ],
  },
];

export const HERO_SCENES = [
  {
    colIdx: 0,
    secIdx: 0,
    num: "01",
    name: "Island Silhouettes",
    subtitle: "Voile & Bias",
    collection: "Serendipity",
    thumb: "/images/hero images only/collection 1/section 1/lotus-memory-dress.jpg",
  },
  {
    colIdx: 0,
    secIdx: 1,
    num: "02",
    name: "Coastal Lace",
    subtitle: "Cutwork Maxi",
    collection: "Serendipity",
    thumb: "/images/hero images only/collection 1/section 2/serendib-pearl-dress.jpg",
  },
  {
    colIdx: 1,
    secIdx: 0,
    num: "03",
    name: "Golden Cascade",
    subtitle: "Ehela Blossom",
    collection: "Botanicals",
    thumb: "/images/new info/collection 2/A_GOLDEN_CASCADE_Inspired_by_Sri_Lankas_Ehela_blossom/A_GOLDEN_CASCADE_Inspired_by_Sri_Lankas_Ehela_blossom.jpeg",
  },
  {
    colIdx: 1,
    secIdx: 1,
    num: "04",
    name: "Midnight Bloom",
    subtitle: "Crimson Lotus",
    collection: "Botanicals",
    thumb: "/images/new info/collection 2/The Crimson Lotus/The Crimson Lotus 1.jpeg",
  },
];

// Modern E-Commerce Discount Campaigns
export interface PromoCampaign {
  id: string;
  tag: string;
  title: string;
  headlineLines: string[];
  highlightDiscount: string;
  description: string;
  promoCode: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
}

export const HERO_DISCOUNT_CAMPAIGNS: PromoCampaign[] = [
  {
    id: "campaign-1",
    tag: "LIMITED TIME PRIVILEGE",
    title: "SEASON SALE — 50% OFF",
    headlineLines: ["SEASON", "SALE —"],
    highlightDiscount: "50% OFF",
    description:
      "Curated luxury handloom and voile staples crafted for the effortless Australian calm.",
    promoCode: "SERENDIPITY50",
    primaryCtaText: "SHOP NOW",
    primaryCtaHref: "#browse-collection",
    secondaryCtaText: "EXPLORE NEW ARRIVALS",
    secondaryCtaHref: "#browse-collection",
  },
  {
    id: "campaign-2",
    tag: "NEW IN EDITORIAL",
    title: "NEW ARRIVALS — 20% OFF",
    headlineLines: ["NEW", "ARRIVALS —"],
    highlightDiscount: "20% OFF",
    description:
      "Featherlight cotton voile and scalloped cutwork lace direct from Sri Lankan master weavers.",
    promoCode: "WELCOME20",
    primaryCtaText: "SHOP NEW IN",
    primaryCtaHref: "#browse-collection",
    secondaryCtaText: "VIEW COLLECTION",
    secondaryCtaHref: "#browse-collection",
  },
  {
    id: "campaign-3",
    tag: "VACATION CAPSULE",
    title: "CAPSULE WARDROBE STYLER — 15% OFF",
    headlineLines: ["CAPSULE", "WARDROBE", "STYLER —"],
    highlightDiscount: "15% OFF",
    description:
      "Curate your 4-piece mixable wardrobe. Weightless natural cottons that fold into one tote bag.",
    promoCode: "CAPSULE15",
    primaryCtaText: "BUILD CAPSULE",
    primaryCtaHref: "#capsule-wardrobe",
    secondaryCtaText: "SEE LOOKBOOK",
    secondaryCtaHref: "#browse-collection",
  },
  {
    id: "campaign-4",
    tag: "AUSTRALIA WIDE",
    title: "EXPRESS SHIPPING — OVER $150",
    headlineLines: ["EXPRESS", "SHIPPING —"],
    highlightDiscount: "OVER $150",
    description:
      "Carbon-neutral courier dispatch across Sydney, Melbourne, Brisbane and regional Australia.",
    promoCode: "FREESHIP150",
    primaryCtaText: "ORDER TODAY",
    primaryCtaHref: "#browse-collection",
    secondaryCtaText: "OUR ETHICAL CRAFT",
    secondaryCtaHref: "/craft",
  },
];

// Helper to encode image paths with spaces
const safeSrc = (path: string) => encodeURI(path);

// =========================================================================
// 2. HERO COMPONENT
// =========================================================================

interface HeroProps {
  onExploreCollection?: () => void;
  onWatchFilm?: () => void;
  isMuted?: boolean;
  toggleAudio?: () => void;
}

export default function CinematicHero({
  onExploreCollection,
}: HeroProps) {
  // ----------------------------------------------------
  // State: Active Collection & Active Section (Begins with Collection 02)
  // ----------------------------------------------------
  const [activeCollectionIdx, setActiveCollectionIdx] = useState<number>(1);
  const [activeSectionIdx, setActiveSectionIdx] = useState<number>(0);

  // ----------------------------------------------------
  // State: 4-Tile Double-Faced 3D Cards
  // ----------------------------------------------------
  const [tileFlips, setTileFlips] = useState<number[]>([0, 0, 0, 0]);
  const [flippingTile, setFlippingTile] = useState<number | null>(null);
  const [isTilesPlaying, setIsTilesPlaying] = useState<boolean>(true);
  const [hoveredTileIndex, setHoveredTileIndex] = useState<number | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  // Front & Back face contents for each of the 4 tiles (Collection 02 Section 1 & Section 2)
  const [frontItems, setFrontItems] = useState<HeroLookItem[]>(() => [
    HERO_COLLECTIONS_DATA[1].sections[0].items[0],
    HERO_COLLECTIONS_DATA[1].sections[0].items[1],
    HERO_COLLECTIONS_DATA[1].sections[0].items[2],
    HERO_COLLECTIONS_DATA[1].sections[0].items[3],
  ]);

  const [backItems, setBackItems] = useState<HeroLookItem[]>(() => [
    HERO_COLLECTIONS_DATA[1].sections[1].items[0],
    HERO_COLLECTIONS_DATA[1].sections[1].items[1],
    HERO_COLLECTIONS_DATA[1].sections[1].items[2],
    HERO_COLLECTIONS_DATA[1].sections[1].items[3],
  ]);

  // ----------------------------------------------------
  // State: Promotional Campaign Slider
  // ----------------------------------------------------
  const [campaignIndex, setCampaignIndex] = useState<number>(0);
  const [isPromoHovered, setIsPromoHovered] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Detect prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, []);

  // Preload all 16 photos across both collections on mount to guarantee instant 3D flips
  useEffect(() => {
    if (typeof window !== "undefined") {
      HERO_COLLECTIONS_DATA.forEach((col) => {
        col.sections.forEach((sec) => {
          sec.items.forEach((item) => {
            const img = new window.Image();
            img.src = safeSrc(item.src);
          });
        });
      });
    }
  }, []);

  // ----------------------------------------------------
  // Transition to a Target Collection & Section (Cascading 3D Flip)
  // ----------------------------------------------------
  const transitionToSection = useCallback(
    (targetColIdx: number, targetSecIdx: number) => {
      const targetItems = HERO_COLLECTIONS_DATA[targetColIdx].sections[targetSecIdx].items;
      const stepDelay = 130; // 130ms cascading ripple delay

      setActiveCollectionIdx(targetColIdx);
      setActiveSectionIdx(targetSecIdx);

      // Flip each tile with a cascading left-to-right ripple wave
      [0, 1, 2, 3].forEach((tileIdx) => {
        setTimeout(() => {
          setFlippingTile(tileIdx);

          setTileFlips((prevFlips) => {
            const currentFlips = prevFlips[tileIdx];
            const isCurrentlyFront = currentFlips % 2 === 0;

            if (isCurrentlyFront) {
              // Pre-load incoming item on the Back face, then flip to Back
              setBackItems((prev) => {
                const next = [...prev];
                next[tileIdx] = targetItems[tileIdx];
                return next;
              });
            } else {
              // Pre-load incoming item on the Front face, then flip to Front
              setFrontItems((prev) => {
                const next = [...prev];
                next[tileIdx] = targetItems[tileIdx];
                return next;
              });
            }

            const nextFlips = [...prevFlips];
            nextFlips[tileIdx] = currentFlips + 1;
            return nextFlips;
          });

          setTimeout(() => {
            setFlippingTile((curr) => (curr === tileIdx ? null : curr));
          }, 700);
        }, tileIdx * stepDelay);
      });
    },
    []
  );

  // Manual flip of a single tile (toggles between Section 0 and Section 1 of current collection)
  const handleManualSingleTileFlip = useCallback(
    (tileIdx: number) => {
      const alternateSecIdx = activeSectionIdx === 0 ? 1 : 0;
      const alternateItem =
        HERO_COLLECTIONS_DATA[activeCollectionIdx].sections[alternateSecIdx].items[tileIdx];

      setFlippingTile(tileIdx);

      setTileFlips((prevFlips) => {
        const currentFlips = prevFlips[tileIdx];
        const isCurrentlyFront = currentFlips % 2 === 0;

        if (isCurrentlyFront) {
          setBackItems((prev) => {
            const next = [...prev];
            next[tileIdx] = alternateItem;
            return next;
          });
        } else {
          setFrontItems((prev) => {
            const next = [...prev];
            next[tileIdx] = alternateItem;
            return next;
          });
        }

        const nextFlips = [...prevFlips];
        nextFlips[tileIdx] = currentFlips + 1;
        return nextFlips;
      });

      setTimeout(() => {
        setFlippingTile((curr) => (curr === tileIdx ? null : curr));
      }, 700);
    },
    [activeCollectionIdx, activeSectionIdx]
  );

  // ----------------------------------------------------
  // Automatic 4-State Cycle: (Col 1 Sec 1 -> Col 1 Sec 2 -> Col 2 Sec 1 -> Col 2 Sec 2)
  // ----------------------------------------------------
  const currentStep = activeCollectionIdx * 2 + activeSectionIdx;

  const handlePrevScene = useCallback(() => {
    const prevStep = (currentStep - 1 + 4) % 4;
    const target = HERO_SCENES[prevStep];
    transitionToSection(target.colIdx, target.secIdx);
  }, [currentStep, transitionToSection]);

  const handleNextScene = useCallback(() => {
    const nextStep = (currentStep + 1) % 4;
    const target = HERO_SCENES[nextStep];
    transitionToSection(target.colIdx, target.secIdx);
  }, [currentStep, transitionToSection]);

  useEffect(() => {
    if (!isTilesPlaying || hoveredTileIndex !== null || isPromoHovered) return;

    const intervalTime = 6000; // 6s view time before cascading flip to next section
    const interval = setInterval(() => {
      const nextStep = (currentStep + 1) % 4;
      const nextColIdx = Math.floor(nextStep / 2);
      const nextSecIdx = nextStep % 2;
      transitionToSection(nextColIdx, nextSecIdx);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isTilesPlaying, hoveredTileIndex, isPromoHovered, currentStep, transitionToSection]);

  // ----------------------------------------------------
  // Independent E-Commerce Promo Discount Carousel Timer
  // ----------------------------------------------------
  useEffect(() => {
    if (prefersReducedMotion || isPromoHovered || !isTilesPlaying) return;

    const promoInterval = setInterval(() => {
      setCampaignIndex((prev) => (prev + 1) % HERO_DISCOUNT_CAMPAIGNS.length);
    }, 4500);

    return () => clearInterval(promoInterval);
  }, [prefersReducedMotion, isPromoHovered, isTilesPlaying]);

  // Copy Promo Code Handler
  const handleCopyCode = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  // ----------------------------------------------------
  // Mouse Parallax & Scroll Physics
  // ----------------------------------------------------
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 45, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 45, damping: 25 });
  const bgX = useTransform(smoothX, [-1, 1], [-8, 8]);
  const bgY = useTransform(smoothY, [-1, 1], [-6, 6]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches) {
      const rect = e.currentTarget.getBoundingClientRect();
      const xPct = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const yPct = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      mouseX.set(xPct);
      mouseY.set(yPct);
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setHoveredTileIndex(null);
  };

  const { scrollY } = useScroll();
  const heroContentY = useTransform(scrollY, [0, 900], [0, 110]);
  const heroOpacity = useTransform(scrollY, [0, 700], [1, 0.25]);

  const currentCampaign = HERO_DISCOUNT_CAMPAIGNS[campaignIndex];
  const activeCollection = HERO_COLLECTIONS_DATA[activeCollectionIdx];
  const activeSection = activeCollection.sections[activeSectionIdx];

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-screen min-h-[740px] overflow-hidden bg-[#121110] flex items-center justify-center select-none"
      aria-label="BINDY Hero Showcase"
    >
      {/* ========================================================================= */}
      {/* LAYER 1: 4-TILE 3D DOUBLE-FACED FLIP GRID                                 */}
      {/* ========================================================================= */}
      <motion.div
        style={{ x: bgX, y: bgY }}
        className="absolute inset-0 w-full h-full scale-[1.03] grid grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-2 p-1.5 sm:p-2.5 z-0"
      >
        {[0, 1, 2, 3].map((tileIdx) => {
          const isCurrentlyFront = tileFlips[tileIdx] % 2 === 0;
          const activeLook = isCurrentlyFront ? frontItems[tileIdx] : backItems[tileIdx];
          const isFlippingThis = flippingTile === tileIdx;
          const isHovered = hoveredTileIndex === tileIdx;

          const frontItem = frontItems[tileIdx];
          const backItem = backItems[tileIdx];

          return (
            <div
              key={`tile-${tileIdx}`}
              onMouseEnter={() => setHoveredTileIndex(tileIdx)}
              onMouseLeave={() => setHoveredTileIndex(null)}
              className="group/tile relative w-full h-full rounded-lg sm:rounded-xl overflow-hidden [perspective:1400px] border border-white/10 hover:border-[#C5A059]/60 transition-colors duration-500 shadow-md select-none"
            >
              {/* 3D Double-Faced Flip Container */}
              <motion.div
                animate={{
                  rotateY: prefersReducedMotion ? 0 : tileFlips[tileIdx] * 180,
                  scale: isFlippingThis ? [1, 1.025, 1] : isHovered ? 1.02 : 1,
                }}
                transition={{
                  rotateY: {
                    duration: prefersReducedMotion ? 0.3 : 0.75,
                    ease: [0.22, 1, 0.36, 1],
                  },
                  scale: {
                    duration: 0.75,
                    ease: "easeInOut",
                  },
                }}
                style={{
                  transformStyle: "preserve-3d",
                }}
                className="relative w-full h-full"
              >
                {/* FRONT FACE */}
                <div
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(0deg)",
                    transformStyle: "preserve-3d",
                  }}
                  className="absolute inset-0 w-full h-full overflow-hidden rounded-lg sm:rounded-xl"
                >
                  <Image
                    src={safeSrc(frontItem.src)}
                    alt={`${frontItem.name} - Front`}
                    fill
                    priority={tileIdx < 2}
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className={`object-cover object-[center_20%] transition-transform duration-700 ease-out ${
                      isHovered ? "scale-105" : "scale-100"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                </div>

                {/* BACK FACE */}
                <div
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    transformStyle: "preserve-3d",
                  }}
                  className="absolute inset-0 w-full h-full overflow-hidden rounded-lg sm:rounded-xl"
                >
                  <Image
                    src={safeSrc(backItem.src)}
                    alt={`${backItem.name} - Reverse`}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className={`object-cover object-[center_20%] transition-transform duration-700 ease-out ${
                      isHovered ? "scale-105" : "scale-100"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                </div>

                {/* Specular Light Reflection Sweep across moving card */}
                {isFlippingThis && !prefersReducedMotion && (
                  <motion.div
                    initial={{ x: "-100%", opacity: 0 }}
                    animate={{ x: "200%", opacity: [0, 0.45, 0] }}
                    transition={{ duration: 0.7, ease: "easeOut", delay: 0.08 }}
                    className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none z-10 -skew-x-12"
                  />
                )}
              </motion.div>

              {/* Hover Scrim */}
              <div
                className={`absolute inset-0 transition-colors duration-300 pointer-events-none z-10 ${
                  isHovered ? "bg-black/10" : "bg-black/0"
                }`}
              />

              {/* Quick Flip Action Button (Top Right on Hover) */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleManualSingleTileFlip(tileIdx);
                }}
                className="absolute top-3 right-2.5 sm:right-3 z-30 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/75 hover:bg-[#C5A059] text-white hover:text-black backdrop-blur-md border border-white/25 hover:border-[#C5A059] flex items-center justify-center opacity-0 group-hover/tile:opacity-100 transition-all duration-300 shadow-lg cursor-pointer hover:scale-110 active:scale-95"
                title={`Flip look: ${activeLook.name}`}
                aria-label={`Flip look: ${activeLook.name}`}
              >
                <RotateCw
                  className={`w-3.5 h-3.5 transition-transform duration-700 ${
                    isFlippingThis ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Clickable Overlay Link to PDP */}
              <Link
                href={`/product/${activeLook.slug}`}
                className="absolute inset-0 z-20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C5A059] rounded-lg sm:rounded-xl"
                aria-label={`View ${activeLook.name} product details`}
              />

              {/* Individual Tile Product Pill (Bottom Indicator) */}
              <div className="absolute bottom-2.5 inset-x-2.5 sm:bottom-3 sm:inset-x-3 z-30 pointer-events-none">
                <div
                  className={`p-2 sm:p-2.5 rounded-lg backdrop-blur-md border transition-all duration-300 ${
                    isHovered
                      ? "bg-black/85 border-[#C5A059] translate-y-0 shadow-[0_8px_20px_rgba(0,0,0,0.6)]"
                      : "bg-black/60 border-white/15 translate-y-1 opacity-95 group-hover/tile:opacity-100 shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[9px] sm:text-[10px] font-sans uppercase tracking-[0.2em] text-[#C5A059] font-bold truncate">
                      {activeLook.name}
                    </span>
                    <span className="font-mono text-[9px] sm:text-[10px] text-[#FAF7F2] font-semibold flex-shrink-0">
                      ${activeLook.priceAud} AUD
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[8px] sm:text-[9px] text-[#DCC7AF]/90 truncate font-light">
                      {activeLook.origin} • {activeLook.category}
                    </span>
                    <span
                      className={`text-[8px] sm:text-[9px] font-sans tracking-wider uppercase text-[#FAF7F2] font-semibold inline-flex items-center gap-0.5 transition-opacity ${
                        isHovered ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      View Look <ChevronRight className="w-2.5 h-2.5 text-[#C5A059]" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Active Flip Golden Rim Aura */}
              {isFlippingThis && !prefersReducedMotion && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: [0, 1, 0], scale: [0.98, 1, 0.98] }}
                  transition={{ duration: 0.75, ease: "easeInOut" }}
                  className="absolute inset-0 border-2 border-[#C5A059] rounded-lg sm:rounded-xl pointer-events-none z-30 shadow-[inset_0_0_20px_rgba(197,160,89,0.35),0_0_25px_rgba(197,160,89,0.45)]"
                />
              )}
            </div>
          );
        })}
      </motion.div>

      {/* ========================================================================= */}
      {/* LAYER 2: BALANCED EDITORIAL SCRIMS & LIGHTING                             */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none z-10" />
      <div className="absolute inset-y-0 left-0 w-full md:w-[65%] lg:w-[55%] bg-gradient-to-r from-black/65 via-black/40 to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/55 via-black/25 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-black/65 via-black/30 to-transparent pointer-events-none z-10" />
      <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(197,160,89,0.15)_0%,transparent_70%)] blur-3xl pointer-events-none z-10" />

      {/* ========================================================================= */}
      {/* LAYER 3: FOREGROUND EDITORIAL UI, PROMOTIONS & COLLECTION SWITCHER         */}
      {/* ========================================================================= */}
      <motion.div
        style={{ y: heroContentY, opacity: heroOpacity }}
        className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-between pt-24 sm:pt-28 pb-20 sm:pb-24"
      >
        {/* TOP BAR: Interactive Collection Selector & Section Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full flex-shrink-0">
          {/* Collection 01 / Collection 02 Selector Pill */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/75 backdrop-blur-xl border border-white/15 shadow-lg self-start">
            {HERO_COLLECTIONS_DATA.map((col, cIdx) => {
              const isColActive = activeCollectionIdx === cIdx;
              return (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => transitionToSection(cIdx, 0)}
                  className={`relative px-3.5 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.22em] font-medium transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                    isColActive
                      ? "bg-[#C5A059] text-black font-bold shadow-[0_2px_12px_rgba(197,160,89,0.4)]"
                      : "text-[#DCC7AF]/80 hover:text-white hover:bg-white/10"
                  }`}
                  title={`Switch to ${col.name}`}
                >
                  <Layers className={`w-3 h-3 ${isColActive ? "text-black" : "text-[#C5A059]"}`} />
                  <span>{col.shortName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* CENTER EDITORIAL HERO: Modern E-Commerce Discount Information Section */}
        <div className="my-auto w-full max-w-2xl lg:max-w-3xl py-4 sm:py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onMouseEnter={() => setIsPromoHovered(true)}
            onMouseLeave={() => setIsPromoHovered(false)}
            className="w-full space-y-4 sm:space-y-5"
          >
            {/* 1. Category Tag & Active Offer Switcher */}
            <div className="flex flex-wrap items-center gap-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCampaign.id + "-tag"}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.25 }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/65 backdrop-blur-md border border-[#C5A059]/50 text-[#FAF7F2] text-[10px] sm:text-xs font-sans uppercase font-bold tracking-[0.2em] shadow-md"
                >
                  <Tag className="w-3 h-3 text-[#C5A059]" />
                  <span>{currentCampaign.tag}</span>
                </motion.div>
              </AnimatePresence>

              {/* 4 Deal Dots */}
              <div className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
                {HERO_DISCOUNT_CAMPAIGNS.map((c, idx) => {
                  const isActive = campaignIndex === idx;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCampaignIndex(idx)}
                      className="group flex items-center cursor-pointer py-0.5 focus:outline-none"
                      title={`${c.title} ${c.highlightDiscount}`}
                      aria-label={`View deal ${idx + 1}: ${c.title}`}
                    >
                      <span
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isActive
                            ? "w-6 bg-[#C5A059] shadow-[0_0_8px_rgba(197,160,89,0.9)]"
                            : "w-2 bg-white/35 hover:bg-white/70"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Dynamic Rotating Campaign Discount Headline & Subtext (3 to 4 lines) */}
            <div className="min-h-[175px] sm:min-h-[205px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCampaign.id + "-content"}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="space-y-2.5 sm:space-y-3"
                >
                  {/* 3 to 4 Lines Bold Editorial Headline */}
                  <h1 className="font-serif tracking-tight leading-[0.95] text-left">
                    {currentCampaign.headlineLines.map((line, lIdx) => (
                      <span
                        key={lIdx}
                        className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] text-[#FFFFFF] font-bold block drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]"
                      >
                        {line}
                      </span>
                    ))}
                    <span className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] text-[#C5A059] font-bold block mt-1 drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)]">
                      {currentCampaign.highlightDiscount}
                    </span>
                  </h1>

                  {/* 3 to 4 Line Scannable Marketing Subtext */}
                  <p className="font-sans text-sm sm:text-base md:text-[17px] text-[#F2ECE1] leading-relaxed font-normal max-w-lg pt-0.5 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] text-left">
                    {currentCampaign.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* 3. Action CTAs & 1-Click Promo Code Row */}
            <div className="pt-1 flex flex-wrap items-center gap-3 sm:gap-4">
              {/* Primary Shop Button */}
              <a
                href={currentCampaign.primaryCtaHref}
                onClick={onExploreCollection}
                className="group/btn inline-flex items-center justify-center space-x-2.5 px-8 sm:px-9 py-3.5 sm:py-4 rounded-full bg-[#C5A059] hover:bg-[#FAF7F2] text-black font-sans text-xs uppercase tracking-[0.25em] font-bold transition-all duration-300 shadow-[0_6px_30px_rgba(197,160,89,0.45)] hover:shadow-[0_8px_35px_rgba(255,255,255,0.5)] hover:scale-[1.02] cursor-pointer"
              >
                <span>{currentCampaign.primaryCtaText}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1.5 transition-transform duration-300" />
              </a>

              {/* Secondary Explore Button */}
              <a
                href={currentCampaign.secondaryCtaHref}
                onClick={onExploreCollection}
                className="inline-flex items-center justify-center space-x-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md text-white hover:text-[#C5A059] font-sans text-xs uppercase tracking-[0.22em] font-semibold transition-all duration-300 border border-white/25 hover:border-[#C5A059] cursor-pointer"
              >
                <span>{currentCampaign.secondaryCtaText}</span>
              </a>

              {/* 1-Click Copy Code Button */}
              <button
                type="button"
                onClick={() => handleCopyCode(currentCampaign.promoCode)}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 hover:border-[#C5A059] text-[#FAF7F2] transition-all cursor-pointer shadow-sm active:scale-95"
                title="Click to copy discount code"
              >
                <Tag className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="text-[11px] sm:text-xs font-mono uppercase text-[#DCC7AF]">
                  Code: <strong className="text-white font-bold">{currentCampaign.promoCode}</strong>
                </span>
                {copiedCode === currentCampaign.promoCode ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-bold pl-1">
                    <Check className="w-3 h-3" /> Copied
                  </span>
                ) : (
                  <Copy className="w-3 h-3 text-[#DCC7AF]/70" />
                )}
              </button>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM BAR: 4-Section Stepper, Autoplay Control & Scroll Prompt */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 w-full">
          {/* ========================================================================= */}
          {/* CREATIVE LUXURY RUNWAY FILMSTRIP DOCK (Interactive Lookbook Navigator)    */}
          {/* ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 sm:gap-3 bg-black/85 hover:bg-black/95 backdrop-blur-2xl px-2.5 sm:px-3.5 py-2 rounded-2xl sm:rounded-full border border-white/20 hover:border-[#C5A059]/60 shadow-[0_16px_50px_rgba(0,0,0,0.7)] transition-all duration-500 select-none group/dock"
          >
            {/* 1. Living Play/Pause Indicator with Ambient Halo */}
            <div className="relative flex items-center justify-center">
              {isTilesPlaying && (
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.45, 0, 0.45] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full bg-[#C5A059] blur-xs pointer-events-none"
                />
              )}
              <button
                type="button"
                onClick={() => setIsTilesPlaying((prev) => !prev)}
                className="relative w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-[#C5A059] text-[#FAF7F2] hover:text-black border border-white/20 hover:border-[#C5A059] transition-all duration-300 cursor-pointer shadow-md active:scale-90 z-10"
                title={isTilesPlaying ? "Pause runway autoplay" : "Resume runway autoplay"}
                aria-label={isTilesPlaying ? "Pause runway autoplay" : "Resume runway autoplay"}
              >
                {isTilesPlaying ? (
                  <Pause className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                )}
              </button>
            </div>

            <div className="h-6 w-px bg-white/15 mx-0.5" />

            {/* 2. 4 Interactive Photographic Scene Portals */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {HERO_SCENES.map((scene, idx) => {
                const isActive = currentStep === idx;
                return (
                  <button
                    key={scene.num}
                    type="button"
                    onClick={() => transitionToSection(scene.colIdx, scene.secIdx)}
                    className={`group/card relative rounded-xl sm:rounded-full overflow-hidden transition-all duration-500 cursor-pointer flex items-center p-1 focus:outline-none ${
                      isActive
                        ? "bg-white/15 border border-[#C5A059] shadow-[0_0_20px_rgba(197,160,89,0.35)] pr-3"
                        : "bg-black/40 border border-white/10 hover:border-white/40 hover:bg-white/10 opacity-70 hover:opacity-100"
                    }`}
                    title={`${scene.num} • ${scene.name} (${scene.collection})`}
                    aria-label={`Switch to ${scene.name}`}
                  >
                    {/* Mini Thumbnail Image */}
                    <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-full overflow-hidden flex-shrink-0 border border-white/20">
                      <Image
                        src={safeSrc(scene.thumb)}
                        alt={scene.name}
                        fill
                        sizes="32px"
                        className="object-cover object-[center_20%] group-hover/card:scale-110 transition-transform duration-500"
                      />
                      {/* Number Badge Overlay on inactive cards */}
                      {!isActive && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="font-mono text-[9px] text-[#FAF7F2] font-bold">
                            {scene.num}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Expanded Active Details */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                          className="overflow-hidden whitespace-nowrap pl-2 flex flex-col items-start text-left"
                        >
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-[9px] text-[#C5A059] font-bold leading-none">
                              {scene.num}
                            </span>
                            <span className="text-[10px] font-sans uppercase tracking-[0.18em] text-[#FAF7F2] font-bold leading-none">
                              {scene.name}
                            </span>
                          </div>
                          <span className="text-[8px] font-sans uppercase tracking-wider text-[#DCC7AF]/80 leading-none pt-0.5">
                            {scene.subtitle}
                          </span>

                          {/* Progress Fill Bar */}
                          <div className="w-full h-0.5 bg-white/20 rounded-full mt-1 overflow-hidden">
                            <motion.div
                              key={`dock-progress-${currentStep}-${isTilesPlaying}`}
                              initial={{ width: "0%" }}
                              animate={{ width: "100%" }}
                              transition={{
                                duration: isTilesPlaying ? 6 : 0.4,
                                ease: isTilesPlaying ? "linear" : "easeOut",
                              }}
                              className="h-full bg-[#C5A059] shadow-[0_0_6px_rgba(197,160,89,1)]"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                );
              })}
            </div>

            <div className="h-6 w-px bg-white/15 mx-0.5" />

            {/* 3. Sleek Prev & Next Arrow Controls */}
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={handlePrevScene}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#DCC7AF]/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer active:scale-95"
                title="Previous section"
                aria-label="Previous section"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleNextScene}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#DCC7AF]/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer active:scale-95"
                title="Next section"
                aria-label="Next section"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>

          {/* Right: Scroll to Discover indicator */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="hidden lg:flex items-center gap-3 pb-1 text-[10px] font-sans uppercase tracking-[0.35em] text-[#DCC7AF]/70 font-light select-none"
          >
            <span>Scroll to Discover</span>
            <div className="w-4 h-8 rounded-full border border-[#DCC7AF]/40 flex items-start justify-center p-0.5">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-1 h-1.5 rounded-full bg-[#C5A059]"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
