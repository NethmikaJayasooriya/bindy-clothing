"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Check,
  Eye,
  Plus,
  X,
  Layers,
  Heart,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { PRODUCTS, type Product } from "@/data/products";
import { addToCart } from "@/lib/cart";

interface Hotspot {
  id: string;
  productId: string;
  topPct: number;
  leftPct: number;
  label: string;
  sublabel: string;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: "hotspot-1",
    productId: "lotus-memory-dress",
    topPct: 42,
    leftPct: 48,
    label: "Handloom Voile Bodice",
    sublabel: "Lotus Memory Dress",
  },
  {
    id: "hotspot-2",
    productId: "cinnamon-flow-skirt",
    topPct: 72,
    leftPct: 53,
    label: "Liquid Bias Cut Drape",
    sublabel: "Cinnamon Flow Skirt",
  },
  {
    id: "hotspot-3",
    productId: "serendib-pearl-dress",
    topPct: 28,
    leftPct: 42,
    label: "Natural Cutwork Lace",
    sublabel: "Island Pearl Top",
  },
];

export interface ShopTheLookSectionProps {
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product, size: string) => void;
}

export default function ShopTheLookSection({
  onQuickView,
  onAddToCart,
}: ShopTheLookSectionProps) {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(HOTSPOTS[0]);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({
    "lotus-memory-dress": "AU 8 (S)",
    "cinnamon-flow-skirt": "AU 8 (S)",
    "serendib-pearl-dress": "AU 8 (S)",
  });
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const [isBundleAdded, setIsBundleAdded] = useState(false);

  const activeProduct = activeHotspot
    ? PRODUCTS.find((p) => p.id === activeHotspot.productId)
    : null;

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

  const handleAddBundle = () => {
    const p1 = PRODUCTS.find((p) => p.id === "lotus-memory-dress");
    const p2 = PRODUCTS.find((p) => p.id === "cinnamon-flow-skirt");
    if (!p1 || !p2) return;

    const s1 = selectedSizes[p1.id] || "AU 8 (S)";
    const s2 = selectedSizes[p2.id] || "AU 8 (S)";

    if (onAddToCart) {
      onAddToCart(p1, s1);
      setTimeout(() => onAddToCart(p2, s2), 150);
    } else {
      addToCart(p1, s1, 1);
      addToCart(p2, s2, 1);
    }

    setIsBundleAdded(true);
    setTimeout(() => setIsBundleAdded(false), 2500);
  };

  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-[#FAF7F2] to-white border-y border-[#DCC7AF]/60 overflow-hidden">
      
      {/* Background Ambience Glow */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#B86B4B]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#1F1E1D] text-[11px] font-mono tracking-widest uppercase font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Interactive Editorial Lookbook</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1F1E1D] font-normal leading-tight">
              Shop The <span className="italic font-serif text-[#B86B4B]">Ensemble</span>
            </h2>

            <p className="font-serif italic text-sm sm:text-base text-[#78716A] leading-relaxed">
              Explore our signature courtyard lookbook with interactive pins. Tap any pin to discover the weaver details, choose your size, and add directly to your bag.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-xs font-mono uppercase tracking-wider text-[#78716A]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B86B4B] animate-ping" />
            <span>Click any pulsing pin to reveal piece</span>
          </div>
        </div>

        {/* Asymmetrical Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* LEFT: Full-Bleed Editorial Image with Pulsing Hotspots (7 Columns) */}
          <div className="lg:col-span-7 relative rounded-3xl overflow-hidden border border-[#DCC7AF] shadow-[0_20px_60px_rgba(0,0,0,0.08)] aspect-[4/5] bg-paper-dark group select-none">
            
            {/* High-Res Location Photo */}
            <img
              src="/images/serendipity/lotus-memory-dress-full.jpg"
              alt="BINDY Courtyard Editorial Ensemble"
              className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700 ease-out"
            />

            {/* Subtle Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

            {/* Top Badge on Photo */}
            <div className="absolute top-5 left-5 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-mono uppercase tracking-widest text-[#1F1E1D] font-bold shadow-md border border-white/40">
              Galle Fort Courtyard • Sri Lanka
            </div>

            {/* Pulsing Interactive Hotspot Pins */}
            {HOTSPOTS.map((hotspot) => {
              const isCurrent = activeHotspot?.id === hotspot.id;

              return (
                <div
                  key={hotspot.id}
                  style={{ top: `${hotspot.topPct}%`, left: `${hotspot.leftPct}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  <button
                    type="button"
                    onClick={() => setActiveHotspot(isCurrent ? null : hotspot)}
                    className="relative flex items-center justify-center p-3 cursor-pointer group/pin focus:outline-none"
                    aria-label={hotspot.label}
                  >
                    {/* Animated Ping Ring */}
                    <span
                      className={`absolute w-8 h-8 rounded-full transition-all duration-300 ${
                        isCurrent
                          ? "bg-[#B86B4B] ring-4 ring-white/80 animate-none scale-110"
                          : "bg-[#C5A059] animate-ping opacity-75"
                      }`}
                    />

                    {/* Center Pin Button */}
                    <span
                      className={`relative w-7 h-7 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 ${
                        isCurrent
                          ? "bg-[#B86B4B] text-white scale-125 ring-2 ring-white"
                          : "bg-white text-[#1F1E1D] hover:bg-[#C5A059] hover:text-white"
                      }`}
                    >
                      <Plus
                        className={`w-3.5 h-3.5 transition-transform duration-300 ${
                          isCurrent ? "rotate-45" : ""
                        }`}
                      />
                    </span>

                    {/* Tooltip Label on Hover (Desktop) */}
                    <span className="hidden sm:block absolute left-full ml-2.5 px-2.5 py-1 rounded-lg bg-[#1F1E1D]/90 backdrop-blur-md text-white text-[10px] font-mono tracking-wider uppercase whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-opacity shadow-md pointer-events-none">
                      {hotspot.label}
                    </span>
                  </button>
                </div>
              );
            })}

            {/* Mobile / Direct Hint Overlay */}
            <div className="absolute bottom-4 left-4 right-4 sm:hidden bg-black/60 backdrop-blur-md p-2.5 rounded-xl text-center text-[10px] font-mono uppercase tracking-wider text-white">
              Tap any + pin to inspect piece
            </div>
          </div>

          {/* RIGHT: Dynamic Active Garment Card & "Complete Look" Bundle (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Active Pin Garment Card */}
            <AnimatePresence mode="wait">
              {activeProduct && (
                <motion.div
                  key={activeProduct.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-[#DCC7AF] shadow-[0_12px_40px_rgba(0,0,0,0.06)] relative space-y-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-20 sm:w-24 aspect-[3/4] rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#DCC7AF]/50 flex-shrink-0 relative">
                      <img
                        src={activeProduct.image}
                        alt={activeProduct.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => onQuickView && onQuickView(activeProduct)}
                        className="absolute bottom-1.5 right-1.5 p-1.5 rounded-full bg-white/90 text-[#1F1E1D] hover:text-[#C5A059] shadow-sm"
                        title="Quick View"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#B86B4B] font-semibold block">
                        Selected from Lookbook Pin
                      </span>
                      <h3 className="font-serif text-lg sm:text-xl text-[#1F1E1D] font-medium leading-snug">
                        {activeProduct.name}
                      </h3>
                      <p className="text-xs text-[#78716A] line-clamp-1 font-light">
                        {activeProduct.fabric} • {activeProduct.colorName}
                      </p>
                      <div className="pt-1 flex items-baseline gap-2">
                        <span className="font-serif text-xl sm:text-2xl font-semibold text-[#1F1E1D]">
                          ${activeProduct.priceAud} AUD
                        </span>
                        <span className="text-[10px] font-mono text-[#78716A] uppercase">
                          Carbon-Neutral AU Shipping
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Size Selector */}
                  <div className="space-y-1.5 pt-1 border-t border-[#DCC7AF]/40">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="uppercase text-[#78716A]">Select Size:</span>
                      <span className="text-[#C5A059] font-medium">
                        {selectedSizes[activeProduct.id] || "AU 8 (S)"}
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-1.5">
                      {activeProduct.sizes.map((sz) => {
                        const isChosen =
                          (selectedSizes[activeProduct.id] || "AU 8 (S)") === sz;
                        const short = sz.replace("AU ", "").split(" ")[0];

                        return (
                          <button
                            key={sz}
                            type="button"
                            onClick={() =>
                              setSelectedSizes((p) => ({
                                ...p,
                                [activeProduct.id]: sz,
                              }))
                            }
                            className={`py-2 text-xs font-mono rounded-xl border text-center transition-all ${
                              isChosen
                                ? "bg-[#1F1E1D] text-white border-[#1F1E1D] font-bold shadow-sm"
                                : "bg-[#FAF7F2] text-[#78716A] border-[#DCC7AF]/60 hover:border-[#1F1E1D] hover:text-[#1F1E1D]"
                            }`}
                          >
                            AU {short}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => handleAddProduct(activeProduct)}
                      className={`flex-1 py-3.5 rounded-full font-mono text-xs uppercase tracking-wider font-semibold transition-all duration-300 shadow-md flex items-center justify-center gap-2 ${
                        addedItem === activeProduct.id
                          ? "bg-[#AFC8B1] text-[#2E4A32]"
                          : "bg-[#B86B4B] hover:bg-[#9E4D30] text-white"
                      }`}
                    >
                      {addedItem === activeProduct.id ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Added to Bag</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add Piece to Bag</span>
                        </>
                      )}
                    </button>

                    <Link
                      href={`/product/${activeProduct.id}`}
                      className="px-4 py-3.5 rounded-full border border-[#DCC7AF] hover:border-[#1F1E1D] text-[#1F1E1D] hover:text-[#B86B4B] text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-center"
                      title="View garment details"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Curated Ensemble Bundle Box ("Shop the Look & Save 10%") */}
            <div className="bg-gradient-to-br from-[#FAF7F2] via-white to-[#FAF7F2] rounded-3xl p-6 sm:p-7 border border-[#C5A059]/40 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#1F1E1D] text-white text-[10px] font-mono uppercase tracking-wider font-bold">
                  Curated Look Bundle
                </span>
                <span className="text-xs font-mono text-[#B86B4B] font-semibold">
                  Save 10% on Look
                </span>
              </div>

              <div>
                <h4 className="font-serif text-lg text-[#1F1E1D] font-medium">
                  The Complete Galle Courtyard Look
                </h4>
                <p className="text-xs font-sans text-[#78716A] mt-0.5 leading-relaxed">
                  Includes the Lotus Memory Strapless Dress &amp; Cinnamon Flow Bias Skirt for seamless day-to-evening layering.
                </p>
              </div>

              <div className="flex items-baseline gap-3 pt-1">
                <span className="font-serif text-2xl font-semibold text-[#1F1E1D]">
                  $405 AUD
                </span>
                <span className="font-serif text-sm text-[#78716A] line-through">
                  $450 AUD
                </span>
                <span className="text-[10px] font-mono uppercase text-[#B86B4B] font-bold">
                  Save $45 AUD
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddBundle}
                className={`w-full py-3.5 rounded-full font-mono text-xs uppercase tracking-wider font-semibold transition-all duration-300 shadow-md flex items-center justify-center gap-2 ${
                  isBundleAdded
                    ? "bg-[#AFC8B1] text-[#2E4A32]"
                    : "bg-[#1F1E1D] hover:bg-[#C5A059] text-white"
                }`}
              >
                {isBundleAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Complete Look Added to Bag</span>
                  </>
                ) : (
                  <>
                    <Layers className="w-4 h-4" />
                    <span>Add Complete Look to Bag</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] font-mono uppercase tracking-wider text-[#78716A] pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Free AU Courier Delivery</span>
                </span>
                <span>•</span>
                <span>30-Day Easy Returns</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
