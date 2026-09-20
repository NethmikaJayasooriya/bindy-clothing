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
    label: "Ocean Embraced Maxi Dress",
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
    <section className="relative w-full h-full min-h-screen bg-[#11100F] text-[#FAF7F2] overflow-hidden flex flex-col justify-between select-none">
      {/* FULL-BLEED SUN-DRENCHED EDITORIAL IMAGE */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/new-hero/hero-beach-1.jpg"
          alt="Editorial Lookbook Runway"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/50 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/50 pointer-events-none" />
      </div>

      {/* TOP BAR */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-2 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#C5A059] animate-ping" />
          <span className="text-[#C5A059] font-bold uppercase tracking-widest">
            Aimé Leon Dore × Zimmermann Runway
          </span>
          <span className="text-white/40 hidden sm:inline">•</span>
          <span className="text-[#DCC7AF]/70 hidden sm:inline">Tap Pulsing Hotspots to Shop</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-black/60 border border-white/20 text-[#DCC7AF]">
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
                {/* Ping rings */}
                <span className="absolute w-10 h-10 rounded-full bg-[#C5A059]/30 animate-ping pointer-events-none" />
                <span className="absolute w-8 h-8 rounded-full bg-[#C5A059]/50 animate-pulse pointer-events-none" />

                {/* Main Core Pin */}
                <span
                  className={`relative w-7 h-7 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(197,160,89,0.8)] border-2 transition-all duration-300 ${
                    isActive
                      ? "bg-[#FAF7F2] text-[#1F1E1D] border-[#C5A059] scale-110 rotate-45"
                      : "bg-[#1F1E1D]/90 text-[#C5A059] border-white/80 group-hover:scale-110"
                  }`}
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                </span>

                {/* Floating Micro Tag Title on Pin */}
                {!isActive && (
                  <span className="absolute left-full ml-2 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-mono text-white whitespace-nowrap border border-white/20 shadow-lg hidden sm:inline-block">
                    {prod ? `$${prod.priceAud}` : hotspot.label}
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* FLOATING GLASSMORPHIC PRODUCT QUICK-ADD CARD (When Hotspot Active) */}
      <AnimatePresence>
        {activeHotspot && activeProduct && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="absolute z-30 bottom-24 right-4 sm:right-10 w-[calc(100vw-2rem)] sm:w-[360px] bg-[#1A1816]/95 backdrop-blur-2xl border border-[#C5A059]/40 rounded-3xl p-4 sm:p-5 shadow-[0_25px_60px_rgba(0,0,0,0.8)] text-white"
          >
            {/* Header / Dismiss */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
                  Shop Runway Look
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveHotspotId(null)}
                className="p-1 text-white/50 hover:text-white rounded transition-colors"
                aria-label="Close Shop Card"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Product Body */}
            <div className="flex gap-3.5 py-3">
              <div className="relative w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-white/15">
                <Image
                  src={activeProduct.image}
                  alt={activeProduct.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <p className="font-serif text-base font-medium text-white leading-tight line-clamp-1">
                  {activeProduct.name}
                </p>
                <p className="text-[11px] font-mono text-[#DCC7AF]/80 truncate">
                  {activeProduct.fabric}
                </p>
                <p className="text-sm font-mono font-bold text-[#C5A059] pt-1">
                  ${activeProduct.priceAud} AUD
                </p>
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-1.5 pb-3">
              <div className="flex items-center justify-between text-[10px] font-mono text-white/60">
                <span>Select Size:</span>
                <span className="text-[#C5A059] font-semibold">{selectedSize}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {["AU 6 (XS)", "AU 8 (S)", "AU 10 (M)", "AU 12 (L)"].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all border ${
                      selectedSize === size
                        ? "bg-[#C5A059] text-black border-[#C5A059] shadow"
                        : "bg-white/5 text-white/80 border-white/10 hover:bg-white/15"
                    }`}
                  >
                    {size.split(" ")[2].replace("(", "").replace(")", "")}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleQuickAdd(activeProduct)}
                disabled={justAddedId === activeProduct.id}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-[#C5A059] hover:bg-[#b08e49] text-black font-mono text-xs font-bold uppercase tracking-wider transition-transform active:scale-95 shadow-md"
              >
                {justAddedId === activeProduct.id ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Added!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onQuickView && onQuickView(activeProduct)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-mono text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Quick View</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOWER EDITORIAL TITLE & PROMPT */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-auto pointer-events-none">
        <div className="max-w-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-[#C5A059]/50 text-[#C5A059] font-mono text-[11px] tracking-widest uppercase pointer-events-auto">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Resort 2026 Interactive Drop</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-white leading-[1.1] drop-shadow-md">
            The Living <br />
            <span className="italic font-normal text-[#DCC7AF]">Runway Scene</span>
          </h1>

          <p className="font-mono text-xs sm:text-sm text-white/80 max-w-md drop-shadow-md">
            Tap directly on any garment floating above to inspect origin batch, fabric specs, and add
            directly to your bag without leaving the runway.
          </p>

          <div className="flex items-center gap-3 pt-2 pointer-events-auto">
            <button
              type="button"
              onClick={onExploreCollection}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#C5A059] hover:bg-[#b08e49] text-black font-mono text-xs uppercase tracking-wider font-bold shadow-xl transition-transform hover:scale-105 active:scale-95"
            >
              <span>Explore All Pieces</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onWatchFilm}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md font-mono text-xs uppercase tracking-wider font-semibold transition-transform hover:scale-105 active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current text-[#C5A059]" />
              <span>Fashion Film</span>
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM FOOTER TICKER */}
      <div className="relative z-20 w-full border-t border-white/10 bg-black/70 backdrop-blur-md py-2.5 px-4 sm:px-8 flex items-center justify-between text-[11px] font-mono text-[#DCC7AF]/70">
        <div className="flex items-center gap-2">
          <span className="text-[#C5A059] font-bold">● LIVE INVENTORY</span>
          <span className="hidden sm:inline">• Free Express Carbon-Neutral Shipping Across Australia</span>
        </div>
        <span className="hidden md:inline text-white/40">Style 6 • Interactive Shop-the-Scene</span>
      </div>
    </section>
  );
}
