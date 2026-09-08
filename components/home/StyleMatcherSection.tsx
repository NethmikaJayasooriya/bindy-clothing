"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Sparkles,
  Palmtree,
  Moon,
  Flower2,
  Coffee,
  Check,
  Eye,
  ShoppingBag,
  ArrowRight,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Feather,
  Layers,
  Flame,
} from "lucide-react";
import { PRODUCTS, type Product, type EnrichedProduct } from "@/data/products";
import { addToCart } from "@/lib/cart";

export interface StyleMatcherSectionProps {
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product, size: string) => void;
}

type OccasionKey = "all" | "resort" | "evening" | "garden" | "everyday";
type SilhouetteKey = "all" | "dresses" | "tops" | "sets";
type FabricKey = "all" | "voile" | "silk";

interface OccasionOption {
  id: OccasionKey;
  label: string;
  sub: string;
  icon: React.ElementType;
  tags: string[];
}

interface SilhouetteOption {
  id: SilhouetteKey;
  label: string;
  sub: string;
  categories: string[];
}

interface FabricOption {
  id: FabricKey;
  label: string;
  badge: string;
  match: (fabric: string) => boolean;
}

const OCCASIONS: OccasionOption[] = [
  {
    id: "all",
    label: "All Settings",
    sub: "Full Curated Range",
    icon: Sparkles,
    tags: [],
  },
  {
    id: "resort",
    label: "Resort & Coast",
    sub: "Tropical Getaways & Beachside",
    icon: Palmtree,
    tags: ["Beach & Coast", "Resort Wear"],
  },
  {
    id: "evening",
    label: "Sunset & Soirée",
    sub: "Cocktail Dinners & Evenings",
    icon: Moon,
    tags: ["Evening & Party"],
  },
  {
    id: "garden",
    label: "Garden & High Tea",
    sub: "Open-Air Luncheons & Events",
    icon: Flower2,
    tags: ["Garden & High Tea"],
  },
  {
    id: "everyday",
    label: "Everyday Calm",
    sub: "Mindful Living & Weekend Ease",
    icon: Coffee,
    tags: ["Everyday Calm"],
  },
];

const SILHOUETTES: SilhouetteOption[] = [
  {
    id: "all",
    label: "All Silhouettes",
    sub: "Dresses, Sets & Tops",
    categories: [],
  },
  {
    id: "dresses",
    label: "Flowing Dresses",
    sub: "Maxis, Midis & Strapless",
    categories: ["Dresses"],
  },
  {
    id: "tops",
    label: "Breezy Blouses",
    sub: "Raglan & Light Voile",
    categories: ["Tops & Blouses"],
  },
  {
    id: "sets",
    label: "Skirts & Sets",
    sub: "Bias Cuts & 2-Piece",
    categories: ["Skirts & Pants", "Two Piece Sets"],
  },
];

const FABRICS: FabricOption[] = [
  {
    id: "all",
    label: "Any Natural Fibre",
    badge: "100% Breathable",
    match: () => true,
  },
  {
    id: "voile",
    label: "Featherlight Voile & Gauze",
    badge: "High Humidity & Sun",
    match: (f) =>
      f.toLowerCase().includes("voile") ||
      f.toLowerCase().includes("gauze") ||
      f.toLowerCase().includes("cotton"),
  },
  {
    id: "silk",
    label: "Habarana Silk & Handloom",
    badge: "Sculpted Drape & Sheen",
    match: (f) =>
      f.toLowerCase().includes("silk") ||
      f.toLowerCase().includes("handloom") ||
      f.toLowerCase().includes("linen"),
  },
];

export default function StyleMatcherSection({
  onQuickView,
  onAddToCart,
}: StyleMatcherSectionProps) {
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionKey>("resort");
  const [selectedSilhouette, setSelectedSilhouette] = useState<SilhouetteKey>("all");
  const [selectedFabric, setSelectedFabric] = useState<FabricKey>("all");

  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [addedItem, setAddedItem] = useState<string | null>(null);

  // Filter products reactively
  const { matchedProducts, isFallback } = useMemo(() => {
    const occOpt = OCCASIONS.find((o) => o.id === selectedOccasion);
    const silOpt = SILHOUETTES.find((s) => s.id === selectedSilhouette);
    const fabOpt = FABRICS.find((f) => f.id === selectedFabric);

    let filtered = PRODUCTS.filter((product) => {
      // Occasion check
      if (occOpt && occOpt.tags.length > 0) {
        const matchesOcc = occOpt.tags.some((tag) =>
          product.occasions.includes(tag)
        );
        if (!matchesOcc) return false;
      }

      // Silhouette / Category check
      if (silOpt && silOpt.categories.length > 0) {
        const matchesSil = silOpt.categories.includes(product.category);
        if (!matchesSil) return false;
      }

      // Fabric check
      if (fabOpt && fabOpt.id !== "all") {
        if (!fabOpt.match(product.fabric)) return false;
      }

      return true;
    });

    // Graceful fallback if overly strict combination returned 0
    if (filtered.length === 0) {
      // Fall back to matching just the occasion
      if (occOpt && occOpt.tags.length > 0) {
        filtered = PRODUCTS.filter((p) =>
          occOpt.tags.some((tag) => p.occasions.includes(tag))
        );
      }
      // If still empty, fall back to matching silhouette
      if (filtered.length === 0 && silOpt && silOpt.categories.length > 0) {
        filtered = PRODUCTS.filter((p) =>
          silOpt.categories.includes(p.category)
        );
      }
      // Ultimate fallback: first 3 products
      if (filtered.length === 0) {
        filtered = PRODUCTS.slice(0, 3);
      }
      return { matchedProducts: filtered, isFallback: true };
    }

    return { matchedProducts: filtered, isFallback: false };
  }, [selectedOccasion, selectedSilhouette, selectedFabric]);

  const handleAddProduct = (product: Product) => {
    const size = selectedSizes[product.id] || "AU 8 (S)";
    if (onAddToCart) {
      onAddToCart(product, size);
    } else {
      addToCart(product, size, 1);
    }
    setAddedItem(product.id);
    setTimeout(() => setAddedItem(null), 2000);
  };

  const handleReset = () => {
    setSelectedOccasion("all");
    setSelectedSilhouette("all");
    setSelectedFabric("all");
  };

  const isCustomized =
    selectedOccasion !== "all" ||
    selectedSilhouette !== "all" ||
    selectedFabric !== "all";

  return (
    <section
      id="style-matcher"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-[#FAF7F2] to-white border-y border-[#DCC7AF]/60 overflow-hidden"
    >
      {/* Ambience Aura Glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#B86B4B]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#1F1E1D] text-[11px] font-mono tracking-widest uppercase font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Interactive Silhouette &amp; Occasion Stylist</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1F1E1D] font-normal leading-tight">
              Find Your Ideal Silhouette{" "}
              <span className="italic font-serif text-[#B86B4B]">
                For Every Setting
              </span>
            </h2>

            <p className="font-serif italic text-sm sm:text-base text-[#78716A] leading-relaxed">
              Curated for the tropical warmth of Sri Lanka and the sunlit Australian lifestyle. Select your upcoming occasion, preferred drape, and climate to instantly reveal handcrafted matches.
            </p>
          </div>

          {/* Quick Presets / Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0">
            {isCustomized && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#DCC7AF] text-[#78716A] hover:text-[#1F1E1D] hover:border-[#1F1E1D] text-xs font-mono uppercase tracking-wider transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-[#78716A]">
              <span className="w-2 h-2 rounded-full bg-[#B86B4B] animate-pulse" />
              <span>{matchedProducts.length} Artisan Pieces Matched</span>
            </div>
          </div>
        </div>

        {/* 3-STEP INTERACTIVE FILTER MATRIX */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCC7AF] shadow-[0_10px_35px_rgba(0,0,0,0.04)] space-y-8">
          
          {/* STEP 1: OCCASION / DESTINATION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1F1E1D] text-white text-[11px] font-mono font-bold flex items-center justify-center">
                  1
                </span>
                <span className="font-mono text-xs uppercase tracking-widest text-[#1F1E1D] font-bold">
                  Where Are You Heading? (Occasion)
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#78716A] hidden sm:inline">
                Selected:{" "}
                <strong className="text-[#B86B4B]">
                  {OCCASIONS.find((o) => o.id === selectedOccasion)?.label}
                </strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {OCCASIONS.map((occ) => {
                const Icon = occ.icon;
                const isActive = selectedOccasion === occ.id;
                return (
                  <button
                    key={occ.id}
                    type="button"
                    onClick={() => setSelectedOccasion(occ.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                      isActive
                        ? "bg-[#1F1E1D] text-white border-[#1F1E1D] shadow-md ring-2 ring-[#B86B4B]/30"
                        : "bg-[#FAF7F2] text-[#1F1E1D] border-[#DCC7AF]/70 hover:border-[#B86B4B] hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`p-2 rounded-xl ${
                          isActive
                            ? "bg-white/15 text-[#C5A059]"
                            : "bg-white text-[#B86B4B] group-hover:bg-[#C5A059]/15"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-[#B86B4B]" />
                      )}
                    </div>
                    <div>
                      <div className="font-serif font-medium text-sm leading-snug">
                        {occ.label}
                      </div>
                      <div
                        className={`text-[10px] font-sans line-clamp-1 mt-0.5 ${
                          isActive ? "text-white/70" : "text-[#78716A]"
                        }`}
                      >
                        {occ.sub}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2 & 3 SUB-GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 border-t border-[#DCC7AF]/50">
            
            {/* STEP 2: SILHOUETTE (7 Cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1F1E1D] text-white text-[11px] font-mono font-bold flex items-center justify-center">
                  2
                </span>
                <span className="font-mono text-xs uppercase tracking-widest text-[#1F1E1D] font-bold">
                  Desired Silhouette &amp; Cut
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SILHOUETTES.map((sil) => {
                  const isActive = selectedSilhouette === sil.id;
                  return (
                    <button
                      key={sil.id}
                      type="button"
                      onClick={() => setSelectedSilhouette(sil.id)}
                      className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-[#B86B4B] text-white border-[#B86B4B] shadow-sm font-medium"
                          : "bg-[#FAF7F2] text-[#1F1E1D] border-[#DCC7AF]/70 hover:border-[#1F1E1D] hover:bg-white"
                      }`}
                    >
                      <div className="font-serif text-xs sm:text-sm font-medium leading-tight">
                        {sil.label}
                      </div>
                      <div
                        className={`text-[10px] font-mono mt-1 line-clamp-1 ${
                          isActive ? "text-white/80" : "text-[#78716A]"
                        }`}
                      >
                        {sil.sub}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: FABRIC & CLIMATE (5 Cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1F1E1D] text-white text-[11px] font-mono font-bold flex items-center justify-center">
                  3
                </span>
                <span className="font-mono text-xs uppercase tracking-widest text-[#1F1E1D] font-bold">
                  Climate &amp; Fabric Feel
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2">
                {FABRICS.map((fab) => {
                  const isActive = selectedFabric === fab.id;
                  return (
                    <button
                      key={fab.id}
                      type="button"
                      onClick={() => setSelectedFabric(fab.id)}
                      className={`px-3.5 py-2.5 rounded-xl border text-left flex items-center justify-between transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-[#C5A059]/15 border-[#C5A059] text-[#1F1E1D] font-medium"
                          : "bg-[#FAF7F2] text-[#1F1E1D] border-[#DCC7AF]/70 hover:border-[#C5A059]"
                      }`}
                    >
                      <span className="font-serif text-xs font-medium">
                        {fab.label}
                      </span>
                      <span
                        className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isActive
                            ? "bg-[#C5A059] text-white font-bold"
                            : "bg-white text-[#78716A] border border-[#DCC7AF]/60"
                        }`}
                      >
                        {fab.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Fallback Notice if exact combination was relaxed */}
          {isFallback && (
            <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#DCC7AF] flex items-center justify-between text-xs text-[#78716A]">
              <span className="font-serif italic">
                Showing closest handcrafted alternatives matching your setting.
              </span>
              <button
                type="button"
                onClick={handleReset}
                className="text-[#B86B4B] hover:underline font-mono text-[11px] uppercase tracking-wider font-semibold"
              >
                Clear all filters
              </button>
            </div>
          )}

        </div>

        {/* RESULTS GRID (Matched Garments) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl text-[#1F1E1D] font-normal">
              Tailored Recommendations ({matchedProducts.length})
            </h3>
            <span className="text-xs font-mono uppercase tracking-wider text-[#78716A]">
              Free Carbon-Neutral AU Shipping Over $150
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <AnimatePresence mode="popLayout">
              {matchedProducts.map((product) => {
                const isSelectedSize =
                  selectedSizes[product.id] || "AU 8 (S)";
                const isAdded = addedItem === product.id;

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-3xl overflow-hidden border border-[#DCC7AF] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                  >
                    {/* Image Box */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-[#FAF7F2]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      />

                      {/* Hover Overlay Second Image if available */}
                      {product.imageHover && (
                        <img
                          src={product.imageHover}
                          alt={`${product.name} alternate angle`}
                          className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out pointer-events-none"
                        />
                      )}

                      {/* Top Badges */}
                      <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10">
                        {product.badge && (
                          <span className="px-2.5 py-1 rounded-full bg-[#1F1E1D] text-white text-[9px] font-mono uppercase tracking-widest font-bold shadow-sm">
                            {product.badge}
                          </span>
                        )}
                        <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#1F1E1D] text-[9px] font-mono uppercase tracking-wider font-semibold border border-white/60 shadow-sm">
                          {product.category}
                        </span>
                      </div>

                      {/* Quick View Button on Image */}
                      <button
                        type="button"
                        onClick={() => onQuickView && onQuickView(product)}
                        className="absolute bottom-3.5 right-3.5 p-2.5 rounded-full bg-white/95 backdrop-blur-md text-[#1F1E1D] hover:bg-[#1F1E1D] hover:text-white shadow-md transition-all duration-200 cursor-pointer z-10"
                        title="Quick View Piece"
                        aria-label={`Quick View ${product.name}`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        {/* Heritage origin line */}
                        <div className="text-[11px] font-mono text-[#78716A] flex items-center justify-between">
                          <span className="truncate pr-2">
                            {product.storyPlace}
                          </span>
                          <span className="text-[#C5A059] font-medium whitespace-nowrap">
                            {product.fabric}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="font-serif text-lg sm:text-xl text-[#1F1E1D] font-normal leading-snug group-hover:text-[#B86B4B] transition-colors">
                          <Link href={`/product/${product.id}`}>
                            {product.name}
                          </Link>
                        </h4>

                        {/* Price & Guarantee */}
                        <div className="flex items-baseline gap-2 pt-1">
                          <span className="font-serif text-xl sm:text-2xl font-medium text-[#1F1E1D]">
                            ${product.priceAud} AUD
                          </span>
                          <span className="text-[10px] font-mono text-[#78716A] uppercase">
                            • {product.colorName}
                          </span>
                        </div>
                      </div>

                      {/* Size Selector Strip */}
                      <div className="space-y-2 pt-3 border-t border-[#DCC7AF]/50">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="uppercase text-[#78716A]">
                            Size:
                          </span>
                          <span className="text-[#1F1E1D] font-medium">
                            {isSelectedSize}
                          </span>
                        </div>

                        <div className="grid grid-cols-5 gap-1.5">
                          {product.sizes.map((sz) => {
                            const isChosen = isSelectedSize === sz;
                            const short = sz.replace("AU ", "").split(" ")[0];

                            return (
                              <button
                                key={sz}
                                type="button"
                                onClick={() =>
                                  setSelectedSizes((prev) => ({
                                    ...prev,
                                    [product.id]: sz,
                                  }))
                                }
                                className={`py-1.5 text-xs font-mono rounded-lg border text-center transition-all cursor-pointer ${
                                  isChosen
                                    ? "bg-[#1F1E1D] text-white border-[#1F1E1D] font-bold shadow-sm"
                                    : "bg-[#FAF7F2] text-[#78716A] border-[#DCC7AF]/60 hover:border-[#1F1E1D] hover:text-[#1F1E1D]"
                                }`}
                              >
                                {short}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Action CTA */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleAddProduct(product)}
                          className={`flex-1 py-3 rounded-full font-mono text-xs uppercase tracking-wider font-semibold transition-all duration-300 shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                            isAdded
                              ? "bg-[#AFC8B1] text-[#2E4A32]"
                              : "bg-[#1F1E1D] hover:bg-[#B86B4B] text-white"
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Added to Bag</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Add to Bag</span>
                            </>
                          )}
                        </button>

                        <Link
                          href={`/product/${product.id}`}
                          className="p-3 rounded-full border border-[#DCC7AF] hover:border-[#1F1E1D] text-[#1F1E1D] hover:text-[#B86B4B] transition-colors flex items-center justify-center"
                          title="View garment story"
                          aria-label={`View story for ${product.name}`}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Trust Guarantee Strip */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[11px] font-mono uppercase tracking-widest text-[#78716A] pt-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            <span>Ethically Woven in Sri Lanka</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span>Pure Handloom Voile &amp; Raw Silk</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-2">
            <Palmtree className="w-4 h-4 text-[#C5A059]" />
            <span>30-Day Easy Australian Exchanges</span>
          </div>
        </div>

      </div>
    </section>
  );
}
