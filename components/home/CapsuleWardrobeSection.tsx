"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Luggage,
  Sparkles,
  Sun,
  Sunset,
  Flower2,
  Palmtree,
  Plane,
  Check,
  Eye,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Feather,
  Layers,
  Scale,
  Compass,
  Quote,
} from "lucide-react";
import { PRODUCTS, type Product } from "@/data/products";
import { addToCart } from "@/lib/cart";

export interface CapsuleWardrobeSectionProps {
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product, size: string) => void;
}

interface CapsulePiece {
  id: string;
  name: string;
  shortName: string;
  role: string;
  fabric: string;
  weightG: number;
  image: string;
  imageHover: string;
  priceAud: number;
}

const CAPSULE_PIECES: CapsulePiece[] = [
  {
    id: "shore-traces-blouse",
    name: "Shore Traces Raglan Blouse",
    shortName: "Voile Raglan Blouse",
    role: "The Airy Anchor",
    fabric: "Hand-spun Cotton Voile",
    weightG: 110,
    image: "/images/serendipity/shore-traces-blouse.jpg",
    imageHover: "/images/serendipity/shore-traces-blouse-hover.jpg",
    priceAud: 185,
  },
  {
    id: "cinnamon-flow-skirt",
    name: "Cinnamon Flow Bias Skirt",
    shortName: "Liquid Bias Skirt",
    role: "The Evening Drape",
    fabric: "Habarana Silk-Rayon Weave",
    weightG: 180,
    image: "/images/serendipity/cinnamon-flow-skirt.jpg",
    imageHover: "/images/serendipity/cinnamon-flow-skirt-hover.jpg",
    priceAud: 210,
  },
  {
    id: "lotus-memory-dress",
    name: "Lotus Memory Strapless Dress",
    shortName: "Lotus Strapless Dress",
    role: "The Showstopper",
    fabric: "Fine Handloom Voile",
    weightG: 240,
    image: "/images/serendipity/lotus-memory-dress.jpg",
    imageHover: "/images/serendipity/lotus-memory-dress-hover.jpg",
    priceAud: 240,
  },
  {
    id: "tea-leaf-two-piece",
    name: "Nuwara Eliya Tea Leaf Two-Piece",
    shortName: "Tea Leaf 2-Piece Set",
    role: "The High-Versatility Set",
    fabric: "Handloom Cotton-Linen",
    weightG: 290,
    image: "/images/serendipity/tea-leaf-two-piece.jpg",
    imageHover: "/images/serendipity/tea-leaf-two-piece-hover.jpg",
    priceAud: 290,
  },
];

interface CapsuleLook {
  id: string;
  title: string;
  setting: string;
  icon: React.ElementType;
  pieceIds: string[];
  stylingAdvice: string;
  tempVibe: string;
  timeOfDay: string;
}

const CAPSULE_LOOKS: CapsuleLook[] = [
  {
    id: "galle-promenade",
    title: "Cobblestone Fort Stroll",
    setting: "Galle Fort Boutiques & Morning Espresso",
    icon: Sun,
    pieceIds: ["shore-traces-blouse", "cinnamon-flow-skirt"],
    stylingAdvice:
      "Tuck the featherlight voile blouse gently into the high bias waistband. Pair with flat woven slides and tortoiseshell shades for effortless coastal elegance.",
    tempVibe: "28°C • Ocean Breeze",
    timeOfDay: "09:30 AM",
  },
  {
    id: "bastion-sunset",
    title: "Twilight Ocean Cocktails",
    setting: "Sunken Bastion Lounge & Clifftop Spritz",
    icon: Sunset,
    pieceIds: ["lotus-memory-dress"],
    stylingAdvice:
      "Let the sculpted strapless bodice make the statement. Swirl the gathered petal skirt along the boardwalk as twilight softens over the Indian Ocean.",
    tempVibe: "25°C • Golden Hour",
    timeOfDay: "06:15 PM",
  },
  {
    id: "hill-high-tea",
    title: "Highland Tea Plantation",
    setting: "Nuwara Eliya Veranda & Artisan Looms",
    icon: Flower2,
    pieceIds: ["tea-leaf-two-piece"],
    stylingAdvice:
      "Wear the two-piece together as a crisp, unified resort silhouette. The natural handloom linen regulates temperature effortlessly between warm sunshine and mountain shade.",
    tempVibe: "21°C • Cool Mist",
    timeOfDay: "02:00 PM",
  },
  {
    id: "cabana-cinnamon",
    title: "Barefoot Beach Cabana",
    setting: "Bentota Lagoon & Sunset Supper",
    icon: Palmtree,
    pieceIds: ["tea-leaf-two-piece", "cinnamon-flow-skirt"],
    stylingAdvice:
      "Uncouple the set: pair the structured tea crop top with the flowing liquid bias skirt. A chic textural contrast of structured handloom and fluid drape.",
    tempVibe: "30°C • Tropical Sun",
    timeOfDay: "04:30 PM",
  },
  {
    id: "transit-sydney",
    title: "Sydney Arrival in Comfort",
    setting: "Long-haul Carry-on & Weekend Escape",
    icon: Plane,
    pieceIds: ["shore-traces-blouse", "tea-leaf-two-piece"],
    stylingAdvice:
      "Style the featherlight raglan top over the relaxed wide-leg trousers. Naturally breathable fibres keep you cool throughout transit with zero synthetic cling.",
    tempVibe: "24°C • Cabin & Transit",
    timeOfDay: "Travel Day",
  },
];

export default function CapsuleWardrobeSection({
  onQuickView,
  onAddToCart,
}: CapsuleWardrobeSectionProps) {
  const [activeLookId, setActiveLookId] = useState<string>("galle-promenade");
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({
    "shore-traces-blouse": "AU 8 (S)",
    "cinnamon-flow-skirt": "AU 8 (S)",
    "lotus-memory-dress": "AU 8 (S)",
    "tea-leaf-two-piece": "AU 8 (S)",
  });
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const [isLookAdded, setIsLookAdded] = useState(false);

  const activeLook =
    CAPSULE_LOOKS.find((l) => l.id === activeLookId) || CAPSULE_LOOKS[0];

  const totalCapsuleWeight = CAPSULE_PIECES.reduce(
    (sum, p) => sum + p.weightG,
    0
  );

  const handleAddPiece = (pieceId: string) => {
    const product = PRODUCTS.find((p) => p.id === pieceId);
    if (!product) return;

    const size = selectedSizes[pieceId] || "AU 8 (S)";
    if (onAddToCart) {
      onAddToCart(product, size);
    } else {
      addToCart(product, size, 1);
    }

    setAddedItems((prev) => ({ ...prev, [pieceId]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [pieceId]: false }));
    }, 2000);
  };

  const handleAddEntireLook = () => {
    activeLook.pieceIds.forEach((pieceId, index) => {
      const product = PRODUCTS.find((p) => p.id === pieceId);
      if (!product) return;
      const size = selectedSizes[pieceId] || "AU 8 (S)";

      setTimeout(() => {
        if (onAddToCart) {
          onAddToCart(product, size);
        } else {
          addToCart(product, size, 1);
        }
      }, index * 180);
    });

    setIsLookAdded(true);
    setTimeout(() => setIsLookAdded(false), 2500);
  };

  return (
    <section
      id="pack-your-capsule"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-[#FAF7F2] to-white border-y border-[#DCC7AF]/60 overflow-hidden"
    >
      {/* Background Soft Glows */}
      <div className="absolute top-1/3 -left-20 w-96 h-96 bg-[#C5A059]/6 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 bg-[#B86B4B]/6 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        {/* Editorial Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#1F1E1D] text-[11px] font-mono tracking-widest uppercase font-semibold">
              <Luggage className="w-3.5 h-3.5 text-[#B86B4B]" />
              <span>The Carry-On Masterclass • Slow Travel</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1F1E1D] font-normal leading-tight">
              Pack Your Capsule:{" "}
              <span className="italic font-serif text-[#B86B4B]">
                4 Pieces, 8+ Looks
              </span>
            </h2>

            <p className="font-serif italic text-sm sm:text-base text-[#78716A] leading-relaxed">
              Designed for effortless island-hopping in Sri Lanka and sun-drenched Australian weekends. Four artisan-woven silhouettes that fold into one weekend tote—infinitely mixable, weightless, and wrinkle-forgiving.
            </p>
          </div>

          {/* Micro Travel Metrics */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-[#DCC7AF] shadow-sm text-[#1F1E1D]">
              <Scale className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>
                Total Capsule: <strong>{totalCapsuleWeight}g</strong> (Under 1kg)
              </span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-[#DCC7AF] shadow-sm text-[#1F1E1D]">
              <Feather className="w-3.5 h-3.5 text-[#B86B4B]" />
              <span>Self-Steaming Pure Fibres</span>
            </div>
          </div>
        </div>

        {/* INTERACTIVE FLATLAY & STYLING SUITE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* LEFT: The Stylist's Flatlay Canvas (7 Columns) */}
          <div className="lg:col-span-7 bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 border border-[#DCC7AF] shadow-[0_12px_45px_rgba(0,0,0,0.05)] relative overflow-hidden space-y-6">
            
            {/* Luggage Tag Header */}
            <div className="flex items-center justify-between border-b border-[#DCC7AF]/60 pb-4">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-[#1F1E1D] text-white text-[10px] font-mono uppercase tracking-widest font-bold">
                  Voyage No. 04
                </span>
                <span className="text-xs font-serif italic text-[#78716A]">
                  Artisan Resort Wardrobe • Sri Lanka to Australia
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-mono text-[#B86B4B]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Active Look Highlighted</span>
              </div>
            </div>

            {/* 4-Piece Flatlay Grid Canvas */}
            <div className="grid grid-cols-2 gap-4 sm:gap-5 relative">
              {CAPSULE_PIECES.map((piece) => {
                const isInCurrentLook = activeLook.pieceIds.includes(piece.id);
                const fullProduct = PRODUCTS.find((p) => p.id === piece.id);

                return (
                  <motion.div
                    key={piece.id}
                    layout
                    animate={{
                      scale: isInCurrentLook ? 1 : 0.96,
                      opacity: isInCurrentLook ? 1 : 0.65,
                    }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className={`rounded-2xl overflow-hidden border transition-all duration-300 relative flex flex-col group ${
                      isInCurrentLook
                        ? "bg-white border-[#B86B4B] shadow-lg ring-2 ring-[#B86B4B]/25"
                        : "bg-white/70 border-[#DCC7AF]/80 hover:border-[#1F1E1D] hover:opacity-90"
                    }`}
                  >
                    {/* Status Pill on Flatlay Piece */}
                    <div className="absolute top-3 left-3 z-10">
                      {isInCurrentLook ? (
                        <span className="px-2 py-0.5 rounded-full bg-[#B86B4B] text-white text-[9px] font-mono uppercase tracking-wider font-bold shadow-sm flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" />
                          <span>In This Look</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#78716A] text-[9px] font-mono uppercase tracking-wider border border-[#DCC7AF]/60">
                          In Capsule
                        </span>
                      )}
                    </div>

                    {/* Quick View Button */}
                    {fullProduct && (
                      <button
                        type="button"
                        onClick={() => onQuickView && onQuickView(fullProduct)}
                        className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 backdrop-blur-md text-[#1F1E1D] hover:bg-[#1F1E1D] hover:text-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
                        title="Quick View"
                        aria-label={`Quick View ${piece.name}`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Image */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#FAF7F2]">
                      <img
                        src={piece.image}
                        alt={piece.name}
                        className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-500 ease-out"
                      />
                    </div>

                    {/* Piece Details Card Strip */}
                    <div className="p-3.5 sm:p-4 space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#78716A]">
                        <span className="truncate pr-2">{piece.role}</span>
                        <span className="text-[#C5A059] font-medium whitespace-nowrap">
                          {piece.weightG}g
                        </span>
                      </div>
                      <h4 className="font-serif text-sm sm:text-base text-[#1F1E1D] font-medium line-clamp-1">
                        {piece.shortName}
                      </h4>
                      <div className="flex items-baseline justify-between pt-0.5">
                        <span className="font-serif text-sm font-semibold text-[#1F1E1D]">
                          ${piece.priceAud} AUD
                        </span>
                        <Link
                          href={`/product/${piece.id}`}
                          className="text-[10px] font-mono text-[#B86B4B] hover:underline uppercase tracking-wider"
                        >
                          Details &rarr;
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Travel Flatlay Footer Pill */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-[#78716A] border-t border-[#DCC7AF]/60">
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>One Carry-On Bag • Zero Checked Luggage Required</span>
              </span>
              <span className="italic font-serif text-xs text-[#1F1E1D]">
                Tap any travel moment on the right to morph looks &rarr;
              </span>
            </div>

          </div>

          {/* RIGHT: Itinerary Lookbook Selector & Direct Look Checkout (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Step 1: Select Itinerary Moment */}
            <div className="space-y-3">
              <span className="font-mono text-xs uppercase tracking-widest text-[#1F1E1D] font-bold block">
                Select Your Holiday Moment:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                {CAPSULE_LOOKS.map((look) => {
                  const Icon = look.icon;
                  const isActive = activeLook.id === look.id;

                  return (
                    <button
                      key={look.id}
                      type="button"
                      onClick={() => setActiveLookId(look.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between ${
                        isActive
                          ? "bg-[#1F1E1D] text-white border-[#1F1E1D] shadow-md ring-2 ring-[#B86B4B]/30"
                          : "bg-white text-[#1F1E1D] border-[#DCC7AF]/70 hover:border-[#B86B4B] hover:bg-[#FAF7F2]"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`p-2 rounded-xl flex-shrink-0 ${
                            isActive
                              ? "bg-white/15 text-[#C5A059]"
                              : "bg-[#FAF7F2] text-[#B86B4B]"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-serif font-medium text-sm leading-snug truncate">
                            {look.title}
                          </div>
                          <div
                            className={`text-[10px] font-sans truncate ${
                              isActive ? "text-white/70" : "text-[#78716A]"
                            }`}
                          >
                            {look.setting}
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0 pl-2">
                        <span
                          className={`text-[9px] font-mono uppercase tracking-wider block ${
                            isActive ? "text-[#C5A059]" : "text-[#78716A]"
                          }`}
                        >
                          {look.timeOfDay}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Look Breakdown & Styling Notes */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeLook.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-3xl p-6 border border-[#DCC7AF] shadow-sm space-y-5"
              >
                {/* Header & Setting badge */}
                <div className="space-y-1 border-b border-[#DCC7AF]/50 pb-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#B86B4B] uppercase tracking-wider font-semibold">
                      Featured Combination ({activeLook.pieceIds.length} Pieces)
                    </span>
                    <span className="text-[#78716A]">{activeLook.tempVibe}</span>
                  </div>
                  <h3 className="font-serif text-xl text-[#1F1E1D] font-normal">
                    {activeLook.title}
                  </h3>
                </div>

                {/* Stylist Quote Box */}
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#DCC7AF]/60 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#B86B4B]">
                    <Quote className="w-3.5 h-3.5" />
                    <span>Stylist&apos;s Advice:</span>
                  </div>
                  <p className="font-serif italic text-xs sm:text-sm text-[#1F1E1D] leading-relaxed">
                    &ldquo;{activeLook.stylingAdvice}&rdquo;
                  </p>
                </div>

                {/* Garments in this Look with Sizing & Add */}
                <div className="space-y-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#78716A] font-semibold block">
                    Pieces in This Look:
                  </span>

                  {activeLook.pieceIds.map((pieceId) => {
                    const piece = CAPSULE_PIECES.find((p) => p.id === pieceId);
                    const product = PRODUCTS.find((p) => p.id === pieceId);
                    if (!piece || !product) return null;

                    const chosenSize = selectedSizes[pieceId] || "AU 8 (S)";
                    const isAdded = addedItems[pieceId];

                    return (
                      <div
                        key={pieceId}
                        className="p-3.5 rounded-2xl border border-[#DCC7AF]/70 bg-[#FAF7F2]/50 hover:bg-white transition-colors space-y-2.5"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={piece.image}
                              alt={piece.name}
                              className="w-12 h-14 rounded-lg object-cover border border-[#DCC7AF]/50 flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <h5 className="font-serif text-sm font-medium text-[#1F1E1D] truncate">
                                {piece.name}
                              </h5>
                              <span className="text-[11px] font-mono text-[#78716A]">
                                ${piece.priceAud} AUD • {piece.fabric}
                              </span>
                            </div>
                          </div>

                          {/* Quick Add Piece Button */}
                          <button
                            type="button"
                            onClick={() => handleAddPiece(pieceId)}
                            className={`p-2 rounded-full transition-all cursor-pointer shadow-sm ${
                              isAdded
                                ? "bg-[#AFC8B1] text-[#2E4A32]"
                                : "bg-[#1F1E1D] text-white hover:bg-[#B86B4B]"
                            }`}
                            title="Add piece to bag"
                          >
                            {isAdded ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <ShoppingBag className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        {/* Size Selector Strip */}
                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#DCC7AF]/40 text-xs font-mono">
                          <span className="text-[10px] text-[#78716A] uppercase">
                            Size: {chosenSize}
                          </span>
                          <div className="flex gap-1">
                            {product.sizes.map((sz) => {
                              const isSelected = chosenSize === sz;
                              const short = sz.replace("AU ", "").split(" ")[0];

                              return (
                                <button
                                  key={sz}
                                  type="button"
                                  onClick={() =>
                                    setSelectedSizes((prev) => ({
                                      ...prev,
                                      [pieceId]: sz,
                                    }))
                                  }
                                  className={`px-2 py-0.5 text-[10px] font-mono rounded border transition-all cursor-pointer ${
                                    isSelected
                                      ? "bg-[#1F1E1D] text-white border-[#1F1E1D] font-bold"
                                      : "bg-white text-[#78716A] border-[#DCC7AF]/60 hover:text-[#1F1E1D]"
                                  }`}
                                >
                                  {short}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add Entire Look Button */}
                <button
                  type="button"
                  onClick={handleAddEntireLook}
                  className={`w-full py-3.5 rounded-full font-mono text-xs uppercase tracking-wider font-semibold transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                    isLookAdded
                      ? "bg-[#AFC8B1] text-[#2E4A32]"
                      : "bg-[#B86B4B] hover:bg-[#9E4D30] text-white"
                  }`}
                >
                  {isLookAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Complete Look Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <Layers className="w-4 h-4" />
                      <span>
                        Add Look to Bag (
                        {activeLook.pieceIds.length === 1
                          ? "$240 AUD"
                          : `$${activeLook.pieceIds
                              .map(
                                (id) =>
                                  CAPSULE_PIECES.find((p) => p.id === id)
                                    ?.priceAud || 0
                              )
                              .reduce((a, b) => a + b, 0)} AUD`}
                        )
                      </span>
                    </>
                  )}
                </button>
              </motion.div>
            </AnimatePresence>

            {/* Trust Assurance Strip */}
            <div className="flex items-center justify-between text-[11px] font-mono text-[#78716A] px-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Free Express AU Delivery</span>
              </span>
              <span>•</span>
              <span>30-Day Easy Size Exchanges</span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
