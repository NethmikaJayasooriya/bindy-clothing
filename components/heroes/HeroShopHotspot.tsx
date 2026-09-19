"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, ShoppingBag, Plus, Check, X, Sparkles, Volume2, VolumeX, Eye } from "lucide-react";
import { PRODUCTS, type Product } from "@/lib/products";

export interface HeroShopHotspotProps {
  onExploreCollection?: () => void;
  onWatchFilm?: () => void;
  onAddToCart?: (product: Product, size: string) => void;
  onQuickView?: (product: Product) => void;
  isMuted?: boolean;
  toggleAudio?: () => void;
}

interface HotspotConfig {
  id: string;
  productId: string;
  label: string;
  xPercent: number; // percentage from left
  yPercent: number; // percentage from top
  placement: "top" | "bottom" | "left" | "right";
}

const HOTSPOTS: HotspotConfig[] = [
  {
    id: "spot-1",
    productId: "ocean-embraced-tiered-dress",
    label: "Ocean Embraced Maxi Gown",
    xPercent: 52,
    yPercent: 48,
    placement: "right",
  },
  {
    id: "spot-2",
    productId: "cinnamon-flow-skirt",
    label: "Cinnamon Flow Voile Skirt",
    xPercent: 34,
    yPercent: 62,
    placement: "top",
  },
  {
    id: "spot-3",
    productId: "shore-traces-blouse",
    label: "Shore Traces Billowing Blouse",
    xPercent: 68,
    yPercent: 40,
    placement: "left",
  },
];

export default function HeroShopHotspot({
  onExploreCollection,
  onWatchFilm,
  onAddToCart,
  onQuickView,
  isMuted = true,
  toggleAudio,
}: HeroShopHotspotProps) {
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>("spot-1");
  const [selectedSize, setSelectedSize] = useState<string>("AU 8 (S)");
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const activeHotspot = HOTSPOTS.find((h) => h.id === activeHotspotId);
  const activeProduct = activeHotspot
    ? PRODUCTS.find((p) => p.id === activeHotspot.productId) || PRODUCTS[0]
    : null;

  const handleQuickAdd = (product: Product) => {
    if (onAddToCart) {
      onAddToCart(product, selectedSize);
      setJustAddedId(product.id);
      setTimeout(() => setJustAddedId(null), 2000);
    }
  };

  return (
    <section className="relative w-full h-full min-h-screen bg-[#0E0D0C] text-[#FAF7F2] overflow-hidden flex flex-col justify-between select-none">
      {/* FULL-BLEED SUN-DRENCHED EDITORIAL IMAGE */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/new-hero/hero-beach-1.jpg"
          alt="Coperni Editorial Runway"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/50 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/50 pointer-events-none" />
      </div>

      {/* TOP STATUS BAR */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-2 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#C5A059] animate-ping" />
          <span className="text-[#C5A059] font-bold uppercase tracking-widest text-[11px]">
            COPERNI × SSENSE RUNWAY STAGE
          </span>
          <span className="text-white/40 hidden sm:inline">•</span>
          <span className="text-[#DCC7AF]/80 hidden sm:inline">Pulsing Magnetic Garment Pins</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-black/60 border border-white/20 text-[#DCC7AF] text-xs">
            {HOTSPOTS.length} Hotspots Active
          </div>
          {toggleAudio && (
            <button
              type="button"
              onClick={toggleAudio}
              className="p-2 rounded-full bg-black/60 border border-white/20 text-white/80 hover:text-white transition-colors"
              aria-label="Toggle Sound"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#C5A059]" />}
            </button>
          )}
        </div>
      </div>

      {/* MAGNETIC HOTSPOTS OVERLAY */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {HOTSPOTS.map((hotspot) => {
          const isActive = activeHotspotId === hotspot.id;
          const prod = PRODUCTS.find((p) => p.id === hotspot.productId);

          return (
            <div
              key={hotspot.id}
              className="absolute pointer-events-auto"
              style={{
                left: `${hotspot.xPercent}%`,
                top: `${hotspot.yPercent}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {/* Pulsing Hotspot Button */}
              <button
                type="button"
                onClick={() =>
                  setActiveHotspotId((prev) => (prev === hotspot.id ? null : hotspot.id))
                }
                className="relative group flex items-center justify-center p-2 focus:outline-none"
                aria-label={`Inspect ${hotspot.label}`}
              >
                <span className="absolute w-10 h-10 rounded-full bg-[#C5A059]/30 animate-ping pointer-events-none" />
                <span className="absolute w-8 h-8 rounded-full bg-[#C5A059]/50 animate-pulse pointer-events-none" />

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                    isActive
                      ? "bg-[#C5A059] text-black scale-125 border-2 border-white"
                      : "bg-[#1F1E1D]/90 text-white border border-[#C5A059] hover:scale-110"
                  }`}
                >
                  <Plus
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${
                      isActive ? "rotate-45" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Hotspot Floating Tooltip */}
              <AnimatePresence>
                {isActive && prod && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-1/2 -translate-x-1/2 top-10 w-64 p-3 bg-black/95 backdrop-blur-xl border border-[#C5A059]/50 rounded-xl shadow-2xl z-40 text-left"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <span className="text-[10px] font-mono text-[#C5A059] uppercase tracking-wider block">
                          Runway Piece
                        </span>
                        <h4 className="font-serif text-sm font-medium text-white line-clamp-1">
                          {prod.name}
                        </h4>
                      </div>
                      <span className="font-outfit text-sm font-bold text-white">
                        ${prod.priceAud}
                      </span>
                    </div>

                    <p className="text-[11px] font-mono text-[#DCC7AF]/80 mb-2 truncate">
                      {prod.fabric}
                    </p>

                    {/* Size selector pills */}
                    <div className="flex gap-1 mb-2.5">
                      {prod.sizes.slice(0, 4).map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSelectedSize(sz)}
                          className={`flex-1 py-1 text-[10px] font-mono rounded transition-colors ${
                            selectedSize === sz
                              ? "bg-[#C5A059] text-black font-bold"
                              : "bg-white/10 text-white/80 hover:bg-white/20"
                          }`}
                        >
                          {sz.split(" ")[0]}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleQuickAdd(prod)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-sans font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                          justAddedId === prod.id
                            ? "bg-emerald-600 text-white"
                            : "bg-white text-black hover:bg-[#C5A059]"
                        }`}
                      >
                        {justAddedId === prod.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3 h-3" />
                            <span>Bag It</span>
                          </>
                        )}
                      </button>

                      {onQuickView && (
                        <button
                          type="button"
                          onClick={() => onQuickView(prod)}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* CENTER HEADLINE */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-auto pointer-events-none">
        <div className="max-w-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-[#C5A059]/50 text-[#C5A059] font-mono text-[11px] tracking-widest uppercase pointer-events-auto">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Runway Experience</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-white leading-[1.05] drop-shadow-lg">
            Direct Runway <br />
            <span className="italic font-normal text-[#FAF7F2]">Direct Acquisition.</span>
          </h1>

          <p className="font-sans text-xs sm:text-sm text-white/90 max-w-md drop-shadow leading-relaxed">
            Hover or tap the pulsing golden pins directly on the runway look to inspect the pit-loom textile provenance and add sizes straight to your wardrobe.
          </p>

          <div className="pt-2 pointer-events-auto">
            <button
              type="button"
              onClick={onExploreCollection}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FAF7F2] hover:bg-[#C5A059] text-black font-sans text-xs uppercase tracking-widest font-bold shadow-2xl transition-all"
            >
              <span>Explore Complete Runway</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM RUNWAY STRIP */}
      <div className="relative z-20 w-full bg-black/80 backdrop-blur-xl border-t border-white/15 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs font-mono text-[#DCC7AF]">
            <span className="text-[#C5A059] font-bold">RUNWAY CAMERA:</span>
            <span>Angle 01 (Front Walk)</span>
            <span className="text-white/30">•</span>
            <span>Mirissa Coast Sands</span>
          </div>

          <div className="text-xs font-mono text-white/60 text-right">
            Coperni & SSENSE Magnetic Hotspot Stage
          </div>
        </div>
      </div>
    </section>
  );
}
