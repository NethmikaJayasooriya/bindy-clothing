"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Sparkles,
  Check,
  ZoomIn,
  Layers,
  ArrowRight,
  Truck,
  ShieldCheck,
  Eye,
  X,
  Maximize2,
  Info,
} from "lucide-react";
import { PRODUCTS, type Product } from "@/data/products";
import { addToCart } from "@/lib/cart";

export interface ShopTheLookSectionProps {
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product, size: string) => void;
}

interface EnsembleConfig {
  id: string;
  tabLabel: string;
  badge: string;
  title: string;
  subtitle: string;
  p1Id: string;
  p2Id: string;
  savings: number;
  p1DetailImg: string;
  p2DetailImg: string;
  p1Weave: {
    count: string;
    dye: string;
    weight: string;
    handfeel: string;
  };
  p2Weave: {
    count: string;
    dye: string;
    weight: string;
    handfeel: string;
  };
  wornTogetherText: string;
  separatesP1Text: string;
  separatesP2Text: string;
}

const ENSEMBLES: EnsembleConfig[] = [
  {
    id: "sunset-duo",
    tabLabel: "01 • The Galle Sunset Duo",
    badge: "Look 01 • Sunset Gala Coordination",
    title: "The Galle Sunset Duo",
    subtitle: "Structured Lotus Voile Bodice with Fluid Cinnamon Bias Silk",
    p1Id: "lotus-memory-dress",
    p2Id: "cinnamon-flow-skirt",
    savings: 45,
    p1DetailImg: "/images/serendipity/lotus-memory-dress-detail.jpg",
    p2DetailImg: "/images/serendipity/cinnamon-flow-skirt-detail.jpg",
    p1Weave: {
      count: "60s Count Single-Ply Pit-Loom Voile",
      dye: "Botanical Madder Root & Lotus Petal Steep",
      weight: "110 GSM (Airy & Non-Translucent)",
      handfeel: "Whisper-light with natural petal crinkle memory",
    },
    p2Weave: {
      count: "45° True Bias Fluid Twill Weave",
      dye: "Highland Ceylon Cinnamon Bark Pigment",
      weight: "140 GSM (Substantial Liquid Drape)",
      handfeel: "Subtle satin sheen that ripples with movement",
    },
    wornTogetherText:
      "Sculpted corset seams balance the continuous diagonal flow of the bias skirt, creating an elongated column silhouette ideal for twilight terrace cocktails and coastal dinners.",
    separatesP1Text:
      "Style the strapless bodice with tailored linen shorts or wide-leg oat trousers for relaxed morning markets.",
    separatesP2Text:
      "Pair the cinnamon skirt with an unbuttoned crisp poplin shirt or slouchy fine-gauge knit for everyday ease.",
  },
  {
    id: "pearl-suite",
    tabLabel: "02 • The Coastal Pearl Suite",
    badge: "Look 02 • Serene Heirloom Cutwork",
    title: "The Coastal Pearl Suite",
    subtitle: "Hand-Cut Scallop Cutwork Maxi with Botanical Sand Peplum",
    p1Id: "serendib-pearl-dress",
    p2Id: "shore-traces-blouse",
    savings: 45,
    p1DetailImg: "/images/serendipity/serendib-pearl-dress-detail.jpg",
    p2DetailImg: "/images/serendipity/shore-traces-blouse-detail.jpg",
    p1Weave: {
      count: "Pit-Loom Unbleached Raw Cotton",
      dye: "Sun-Washed Natural Ecru (Zero Synthetic Bleach)",
      weight: "135 GSM (Crisp Heirloom Drape)",
      handfeel: "Breathable open-cell cotton with hand-chiseled cutwork lace",
    },
    p2Weave: {
      count: "Fine Handloom Micro-Check Weave",
      dye: "Steeped Ceylon Tea Leaf Infusion",
      weight: "125 GSM (Supple Breathable Voile)",
      handfeel: "Soft textured check with genuine mother-of-pearl buttons",
    },
    wornTogetherText:
      "The flared peplum silhouette layers seamlessly over the floor-length cutwork hem, offering structured coastal modesty and breezy movement for celebrations and beachside occasions.",
    separatesP1Text:
      "Wear the maxi dress barefoot on the coastline with woven straw accessories and delicate shell jewelry.",
    separatesP2Text:
      "Pair the sand peplum top with vintage relaxed denim or high-waisted linen pants for gallery afternoons.",
  },
  {
    id: "terracotta-heritage",
    tabLabel: "03 • The Terracotta Heritage Set",
    badge: "Look 03 • Sigiriya Earth Pigments",
    title: "The Terracotta Heritage Set",
    subtitle: "Tailored Colombo Gingham Placket with Sigiriya Mineral Pleated Maxi",
    p1Id: "pettah-check-dress",
    p2Id: "celestial-terracotta-skirt",
    savings: 45,
    p1DetailImg: "/images/serendipity/pettah-check-dress-detail.jpg",
    p2DetailImg: "/images/serendipity/celestial-terracotta-skirt-detail.jpg",
    p1Weave: {
      count: "Architectural Yarn-Dyed Gingham Weave",
      dye: "Mineral Red Oxide & Wild Madder",
      weight: "145 GSM (Structured Tailored Cotton)",
      handfeel: "Crisp architectural hand with covered fabric buttons",
    },
    p2Weave: {
      count: "Crinkled Handloom Linen-Cotton Warp",
      dye: "Sigiriya Earth Clay Rock Pigments",
      weight: "150 GSM (Natural Dimensional Crinkle)",
      handfeel: "Naturally wrinkle-forgiving with organic textured ripple",
    },
    wornTogetherText:
      "Clean notched-collar lines meet flowing pleated tiers, uniting architectural mid-century tailoring with grounded earth tones inspired by ancient Ceylon frescoes.",
    separatesP1Text:
      "Wear the A-line check dress solo to meetings or botanical garden lunches with low tan leather loafers.",
    separatesP2Text:
      "Style the terracotta skirt with a ribbed modal camisole and flat woven slides for warm weekend strolls.",
  },
];

export default function ShopTheLookSection({
  onQuickView,
  onAddToCart,
}: ShopTheLookSectionProps) {
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const [size1, setSize1] = useState("AU 8 (S)");
  const [size2, setSize2] = useState("AU 8 (S)");
  const [stylingMode, setStylingMode] = useState<"together" | "separates">("together");
  const [activeWeaveModal, setActiveWeaveModal] = useState<"p1" | "p2" | null>(null);
  const [isAdded, setIsAdded] = useState(false);

  const activeLook = ENSEMBLES[activeLookIndex];
  const p1 = PRODUCTS.find((p) => p.id === activeLook.p1Id);
  const p2 = PRODUCTS.find((p) => p.id === activeLook.p2Id);

  if (!p1 || !p2) return null;

  const originalTotal = p1.priceAud + p2.priceAud;
  const bundlePrice = originalTotal - activeLook.savings;

  const handleAddBundle = () => {
    const discountedP1: Product = {
      ...p1,
      priceAud: p1.priceAud - Math.round(activeLook.savings * 0.55),
    };
    const discountedP2: Product = {
      ...p2,
      priceAud: p2.priceAud - Math.round(activeLook.savings * 0.45),
    };

    addToCart(discountedP1, size1, 1);
    addToCart(discountedP2, size2, 1);

    if (onAddToCart) {
      onAddToCart(discountedP1, size1);
      setTimeout(() => onAddToCart(discountedP2, size2), 120);
    }

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2600);
  };

  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FAF7F2] via-white to-[#FAF7F2] border-y border-[#DCC7AF]/70 overflow-hidden">
      {/* Background Decorative Artisan Weave Marks */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] bg-gradient-to-r from-[#C5A059]/5 via-[#B86B4B]/5 to-[#C5A059]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        {/* 1. SECTION MASTHEAD */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1F1E1D] text-[#DFC285] text-[10px] font-mono tracking-[0.25em] uppercase font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Editorial Runway Ensembles • Save $45 AUD</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1F1E1D] font-light leading-tight">
            Curated Wardrobe Duos —{" "}
            <span className="italic font-serif text-[#B86B4B]">
              Worn Together &amp; Apart
            </span>
          </h2>

          <p className="font-serif italic text-base sm:text-lg text-[#78716A] leading-relaxed font-light">
            Designed by our atelier in Brisbane &amp; Colombo. Pair complementary handloom silhouettes
            for day-to-evening versatility with an automatic $45 AUD bundle privilege.
          </p>

          {/* 3 RUNWAY LOOK TABS */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {ENSEMBLES.map((look, idx) => {
              const isActive = activeLookIndex === idx;
              return (
                <button
                  key={look.id}
                  type="button"
                  onClick={() => {
                    setActiveLookIndex(idx);
                    setActiveWeaveModal(null);
                  }}
                  className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-mono tracking-wider transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-[#1F1E1D] text-white shadow-md font-bold scale-105 border border-[#1F1E1D]"
                      : "bg-white text-[#78716A] border border-[#DCC7AF]/80 hover:border-[#1F1E1D] hover:text-[#1F1E1D]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{look.tabLabel}</span>
                    {isActive && (
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#DFC285]" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. THE EDITORIAL DIPTYCH (Left Moodboard Collage + Right Atelier Suite) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN (6 cols): Asymmetric Couture Lookbook Collage with Weave Swatch Station */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative bg-[#F4EFEA] rounded-3xl p-4 sm:p-6 border border-[#DCC7AF]/70 shadow-[0_12px_40px_rgba(0,0,0,0.04)] overflow-hidden">
              
              {/* Floating Couture Badge */}
              <div className="absolute top-6 left-6 z-20 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#1F1E1D] text-[10px] font-mono uppercase tracking-[0.2em] font-semibold border border-[#DCC7AF]/60 shadow-sm">
                  {activeLook.badge}
                </span>
              </div>

              {/* Asymmetric Overlapping Photo Composition */}
              <div className="relative min-h-[460px] sm:min-h-[540px] flex items-center justify-center">
                
                {/* Primary Hero Garment (Piece 01) */}
                <div className="relative w-[70%] sm:w-[65%] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-2 border-white transform -rotate-1 hover:rotate-0 transition-transform duration-500 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p1.image}
                    alt={p1.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-3 left-3 bg-[#1F1E1D]/80 backdrop-blur-md text-white text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full">
                    01 • {p1.name.split(" ")[0]}
                  </div>

                  {/* Piece 1 Macro Swatch Trigger Button */}
                  <button
                    type="button"
                    onClick={() => setActiveWeaveModal("p1")}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-[#1F1E1D] flex items-center justify-center border border-[#DCC7AF] shadow-md hover:scale-110 transition-transform cursor-pointer"
                    title="Inspect 100% Pit-Loom Fabric Weave"
                  >
                    <ZoomIn className="w-4 h-4 text-[#C5A059]" />
                  </button>
                </div>

                {/* Overlapping Secondary Garment (Piece 02) */}
                <div className="absolute right-2 sm:right-4 bottom-4 w-[52%] sm:w-[50%] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-2 border-white transform rotate-3 hover:rotate-0 transition-transform duration-500 z-10 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p2.image}
                    alt={p2.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-3 left-3 bg-[#1F1E1D]/80 backdrop-blur-md text-white text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full">
                    02 • {p2.name.split(" ")[0]}
                  </div>

                  {/* Piece 2 Macro Swatch Trigger Button */}
                  <button
                    type="button"
                    onClick={() => setActiveWeaveModal("p2")}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-[#1F1E1D] flex items-center justify-center border border-[#DCC7AF] shadow-md hover:scale-110 transition-transform cursor-pointer"
                    title="Inspect 100% Pit-Loom Fabric Weave"
                  >
                    <ZoomIn className="w-4 h-4 text-[#C5A059]" />
                  </button>
                </div>

              </div>

              {/* Bottom Tactile Weave Strip on Collage */}
              <div className="mt-4 pt-4 border-t border-[#DCC7AF]/60 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* Interactive Swatch Circle 1 */}
                  <button
                    type="button"
                    onClick={() => setActiveWeaveModal("p1")}
                    className="flex items-center gap-2 group cursor-pointer text-left"
                  >
                    <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-[#C5A059] shadow-sm ring-2 ring-white group-hover:scale-110 transition-transform">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={activeLook.p1DetailImg}
                        alt="Fabric macro"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-[#1F1E1D] font-bold block leading-none">
                        Piece 01 Weave
                      </span>
                      <span className="text-[9px] font-mono text-[#78716A] block mt-0.5">
                        Tap to magnify
                      </span>
                    </div>
                  </button>

                  <span className="text-[#DCC7AF] font-serif">+</span>

                  {/* Interactive Swatch Circle 2 */}
                  <button
                    type="button"
                    onClick={() => setActiveWeaveModal("p2")}
                    className="flex items-center gap-2 group cursor-pointer text-left"
                  >
                    <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-[#B86B4B] shadow-sm ring-2 ring-white group-hover:scale-110 transition-transform">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={activeLook.p2DetailImg}
                        alt="Fabric macro"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-[#1F1E1D] font-bold block leading-none">
                        Piece 02 Weave
                      </span>
                      <span className="text-[9px] font-mono text-[#78716A] block mt-0.5">
                        Tap to magnify
                      </span>
                    </div>
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-[#78716A]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>100% Pit-Loom Certified</span>
                </div>
              </div>

            </div>

            {/* Quick Note Below Collage */}
            <div className="px-2 text-center sm:text-left flex items-center justify-between text-xs text-[#78716A] font-serif italic">
              <span>✦ Master weaver lot: Galle &amp; Gampaha handloom clusters</span>
              <button
                type="button"
                onClick={() => setActiveWeaveModal("p1")}
                className="text-[11px] font-mono not-italic text-[#B86B4B] hover:underline font-semibold cursor-pointer inline-flex items-center gap-1"
              >
                <span>View Fabric Specs</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN (6 cols): Atelier Styling Suite & Bundle Add */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* 1. VERSATILITY TOGGLE: Worn Together vs Separates */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#DCC7AF]/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-[#DCC7AF]/40 pb-3">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold">
                  Styling Versatility
                </span>
                
                {/* Segmented Switcher */}
                <div className="inline-flex p-1 rounded-full bg-[#FAF7F2] border border-[#DCC7AF]/60">
                  <button
                    type="button"
                    onClick={() => setStylingMode("together")}
                    className={`px-3.5 py-1 text-[11px] font-mono tracking-wider rounded-full transition-all cursor-pointer ${
                      stylingMode === "together"
                        ? "bg-[#1F1E1D] text-white font-bold shadow-sm"
                        : "text-[#78716A] hover:text-[#1F1E1D]"
                    }`}
                  >
                    Worn Together
                  </button>
                  <button
                    type="button"
                    onClick={() => setStylingMode("separates")}
                    className={`px-3.5 py-1 text-[11px] font-mono tracking-wider rounded-full transition-all cursor-pointer ${
                      stylingMode === "separates"
                        ? "bg-[#1F1E1D] text-white font-bold shadow-sm"
                        : "text-[#78716A] hover:text-[#1F1E1D]"
                    }`}
                  >
                    As Separates
                  </button>
                </div>
              </div>

              {/* Dynamic Versatility Explanation */}
              <AnimatePresence mode="wait">
                {stylingMode === "together" ? (
                  <motion.div
                    key="together"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1.5"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#1F1E1D]">
                      <Layers className="w-3.5 h-3.5 text-[#B86B4B]" />
                      <span>Coordinated Runway Silhouette</span>
                    </div>
                    <p className="font-serif text-sm text-[#78716A] leading-relaxed">
                      {activeLook.wornTogetherText}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="separates"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2 text-xs font-mono"
                  >
                    <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#DCC7AF]/40">
                      <span className="font-bold text-[#1F1E1D] block mb-0.5">
                        Piece 01 Solo:
                      </span>
                      <span className="text-[#78716A] font-serif text-sm">
                        {activeLook.separatesP1Text}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#DCC7AF]/40">
                      <span className="font-bold text-[#1F1E1D] block mb-0.5">
                        Piece 02 Solo:
                      </span>
                      <span className="text-[#78716A] font-serif text-sm">
                        {activeLook.separatesP2Text}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. DUAL PIECE SPEC CARDS (Piece 01 + Piece 02) */}
            <div className="space-y-3">
              
              {/* PIECE 01 CARD */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#DCC7AF]/80 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#DCC7AF]/50 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p1.image}
                      alt={p1.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/75 text-[8px] font-mono text-white font-bold">
                      01
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
                        Piece 01 • Bodice
                      </span>
                      <span className="text-xs font-mono text-[#78716A]">(${p1.priceAud} AUD)</span>
                    </div>
                    <h4 className="font-serif text-base text-[#1F1E1D] font-medium leading-snug">
                      {p1.name}
                    </h4>
                    <p className="text-[11px] font-mono text-[#78716A] flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block border border-black/10"
                        style={{ backgroundColor: p1.colorHex }}
                      />
                      <span>{p1.colorName}</span>
                      <span>•</span>
                      <span>{p1.fabric}</span>
                    </p>
                  </div>
                </div>

                {/* Size Selector for Piece 01 */}
                <div className="w-full sm:w-auto shrink-0 space-y-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#DCC7AF]/40">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-[#78716A] block">
                    Size: <strong className="text-[#1F1E1D]">{size1}</strong>
                  </span>
                  <div className="flex items-center gap-1">
                    {p1.sizes.map((sz) => {
                      const isSelected = size1 === sz;
                      const short = sz.replace("AU ", "").split(" ")[0];
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSize1(sz)}
                          className={`w-8 h-8 rounded-lg text-xs font-mono border text-center transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#1F1E1D] text-white border-[#1F1E1D] font-bold"
                              : "bg-[#FAF7F2] text-[#78716A] border-[#DCC7AF]/60 hover:border-[#1F1E1D]"
                          }`}
                        >
                          {short}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* PIECE 02 CARD */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#DCC7AF]/80 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#DCC7AF]/50 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p2.image}
                      alt={p2.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/75 text-[8px] font-mono text-white font-bold">
                      02
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#B86B4B] font-bold">
                        Piece 02 • Skirt / Layer
                      </span>
                      <span className="text-xs font-mono text-[#78716A]">(${p2.priceAud} AUD)</span>
                    </div>
                    <h4 className="font-serif text-base text-[#1F1E1D] font-medium leading-snug">
                      {p2.name}
                    </h4>
                    <p className="text-[11px] font-mono text-[#78716A] flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block border border-black/10"
                        style={{ backgroundColor: p2.colorHex }}
                      />
                      <span>{p2.colorName}</span>
                      <span>•</span>
                      <span>{p2.fabric}</span>
                    </p>
                  </div>
                </div>

                {/* Size Selector for Piece 02 */}
                <div className="w-full sm:w-auto shrink-0 space-y-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#DCC7AF]/40">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-[#78716A] block">
                    Size: <strong className="text-[#1F1E1D]">{size2}</strong>
                  </span>
                  <div className="flex items-center gap-1">
                    {p2.sizes.map((sz) => {
                      const isSelected = size2 === sz;
                      const short = sz.replace("AU ", "").split(" ")[0];
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSize2(sz)}
                          className={`w-8 h-8 rounded-lg text-xs font-mono border text-center transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#1F1E1D] text-white border-[#1F1E1D] font-bold"
                              : "bg-[#FAF7F2] text-[#78716A] border-[#DCC7AF]/60 hover:border-[#1F1E1D]"
                          }`}
                        >
                          {short}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>

            {/* 3. BUNDLE PRIVILEGE CHECKOUT BOX */}
            <div className="bg-[#161513] text-white rounded-3xl p-6 sm:p-7 border border-[#C5A059]/40 shadow-xl space-y-5">
              
              {/* Math Breakdown Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C5A059]/20 text-[#DFC285] text-[10px] font-mono uppercase tracking-wider font-bold mb-1">
                    <Sparkles className="w-3 h-3 text-[#C5A059]" />
                    <span>Dual Silhouette Privilege</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-light text-white">
                    Complete Ensemble Bundle
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono text-[#DCC7AF]/60 uppercase tracking-widest block">
                    Duo Price
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-[#DCC7AF]/50 line-through">
                      ${originalTotal} AUD
                    </span>
                    <span className="font-serif text-3xl font-normal text-white">
                      ${bundlePrice}{" "}
                      <span className="text-xs font-mono text-[#C5A059]">AUD</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Transparent Calculation Breakdown */}
              <div className="space-y-1.5 text-xs font-mono text-[#DCC7AF]/80">
                <div className="flex items-center justify-between">
                  <span>1× {p1.name}</span>
                  <span>${p1.priceAud} AUD</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>1× {p2.name}</span>
                  <span>${p2.priceAud} AUD</span>
                </div>
                <div className="flex items-center justify-between text-[#DFC285] font-bold pt-1 border-t border-white/10">
                  <span className="flex items-center gap-1">
                    <span>Bundle Discount Applied</span>
                    <span className="text-[10px] text-[#DFC285]/70 font-normal">(Instant Saving)</span>
                  </span>
                  <span>-${activeLook.savings} AUD</span>
                </div>
              </div>

              {/* 1-Click Action Button */}
              <button
                type="button"
                onClick={handleAddBundle}
                className={`w-full py-4 rounded-full font-mono text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 shadow-xl flex items-center justify-center space-x-2 cursor-pointer ${
                  isAdded
                    ? "bg-[#3D5A40] text-white border border-[#5E8B63]"
                    : "bg-gradient-to-r from-[#C5A059] via-[#DFC285] to-[#C5A059] text-[#161513] hover:brightness-110 hover:shadow-[0_8px_30px_rgba(197,160,89,0.35)] active:scale-[0.98]"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Both Silhouettes Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add Complete Duo to Bag — ${bundlePrice} AUD</span>
                  </>
                )}
              </button>

              {/* Reassurance Badges */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] font-mono text-[#DCC7AF]/70 uppercase tracking-wider text-center pt-1">
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-[#C5A059]" />
                  <span>Free AU Express Courier ($150+)</span>
                </span>
                <span>•</span>
                <span>30-Day Easy AU Returns</span>
                <span>•</span>
                <span>True-to-Size Fit</span>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* 4. INTERACTIVE FABRIC WEAVE MACRO MAGNIFIER MODAL */}
      <AnimatePresence>
        {activeWeaveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 border border-[#DCC7AF] shadow-2xl space-y-6 overflow-hidden"
            >
              {/* Modal Close Button */}
              <button
                type="button"
                onClick={() => setActiveWeaveModal(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white border border-[#DCC7AF] text-[#1F1E1D] flex items-center justify-center hover:bg-[#1F1E1D] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Header */}
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/15 text-[#1F1E1D] text-[10px] font-mono uppercase tracking-wider font-semibold">
                  <Sparkles className="w-3 h-3 text-[#C5A059]" />
                  <span>Tactile Fabric Architecture • 200% Optical Macro</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#1F1E1D] font-light">
                  {activeWeaveModal === "p1" ? p1.name : p2.name}
                </h3>
                <p className="font-mono text-xs text-[#78716A]">
                  Authentic pit-loom organic cotton &amp; natural botanicals. Zero polyester, zero synthetic nylon.
                </p>
              </div>

              {/* Modal Body: High-Res Detail Shot + Live Weave Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                
                {/* Visual Macro Texture Frame */}
                <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-xl bg-white group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      activeWeaveModal === "p1"
                        ? activeLook.p1DetailImg
                        : activeLook.p2DetailImg
                    }
                    alt="Fabric weave macro"
                    className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-[10px] font-mono tracking-widest uppercase">
                      Hover to zoom into yarn slub
                    </span>
                  </div>
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/75 text-white text-[9px] font-mono uppercase font-semibold backdrop-blur-md">
                    Optical Macro View
                  </div>
                </div>

                {/* Technical Specifications */}
                <div className="space-y-3 font-mono text-xs">
                  {activeWeaveModal === "p1" ? (
                    <>
                      <div className="p-3 rounded-xl bg-white border border-[#DCC7AF]/60">
                        <span className="text-[9px] text-[#78716A] uppercase tracking-wider block font-semibold">
                          Loom Type &amp; Thread Count
                        </span>
                        <span className="text-[#1F1E1D] font-bold text-sm block mt-0.5">
                          {activeLook.p1Weave.count}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-[#DCC7AF]/60">
                        <span className="text-[9px] text-[#78716A] uppercase tracking-wider block font-semibold">
                          Natural Botanical Dye
                        </span>
                        <span className="text-[#1F1E1D] font-bold text-sm block mt-0.5">
                          {activeLook.p1Weave.dye}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-[#DCC7AF]/60">
                        <span className="text-[9px] text-[#78716A] uppercase tracking-wider block font-semibold">
                          Fabric Weight &amp; Breathability
                        </span>
                        <span className="text-[#1F1E1D] font-bold text-sm block mt-0.5">
                          {activeLook.p1Weave.weight}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-[#DCC7AF]/60">
                        <span className="text-[9px] text-[#78716A] uppercase tracking-wider block font-semibold">
                          Tactile Skin Sensation
                        </span>
                        <span className="text-[#1F1E1D] text-xs font-serif italic block mt-0.5">
                          &ldquo;{activeLook.p1Weave.handfeel}&rdquo;
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-3 rounded-xl bg-white border border-[#DCC7AF]/60">
                        <span className="text-[9px] text-[#78716A] uppercase tracking-wider block font-semibold">
                          Loom Type &amp; Thread Count
                        </span>
                        <span className="text-[#1F1E1D] font-bold text-sm block mt-0.5">
                          {activeLook.p2Weave.count}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-[#DCC7AF]/60">
                        <span className="text-[9px] text-[#78716A] uppercase tracking-wider block font-semibold">
                          Natural Botanical Dye
                        </span>
                        <span className="text-[#1F1E1D] font-bold text-sm block mt-0.5">
                          {activeLook.p2Weave.dye}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-[#DCC7AF]/60">
                        <span className="text-[9px] text-[#78716A] uppercase tracking-wider block font-semibold">
                          Fabric Weight &amp; Breathability
                        </span>
                        <span className="text-[#1F1E1D] font-bold text-sm block mt-0.5">
                          {activeLook.p2Weave.weight}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-[#DCC7AF]/60">
                        <span className="text-[9px] text-[#78716A] uppercase tracking-wider block font-semibold">
                          Tactile Skin Sensation
                        </span>
                        <span className="text-[#1F1E1D] text-xs font-serif italic block mt-0.5">
                          &ldquo;{activeLook.p2Weave.handfeel}&rdquo;
                        </span>
                      </div>
                    </>
                  )}
                </div>

              </div>

              {/* Modal Switcher Toggle between Piece 1 and Piece 2 */}
              <div className="flex items-center justify-between pt-2 border-t border-[#DCC7AF]/60">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveWeaveModal("p1")}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono cursor-pointer transition-colors ${
                      activeWeaveModal === "p1"
                        ? "bg-[#1F1E1D] text-white font-bold"
                        : "bg-white text-[#78716A] border border-[#DCC7AF]/60 hover:text-[#1F1E1D]"
                    }`}
                  >
                    Piece 01 ({p1.name.split(" ")[0]})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveWeaveModal("p2")}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono cursor-pointer transition-colors ${
                      activeWeaveModal === "p2"
                        ? "bg-[#1F1E1D] text-white font-bold"
                        : "bg-white text-[#78716A] border border-[#DCC7AF]/60 hover:text-[#1F1E1D]"
                    }`}
                  >
                    Piece 02 ({p2.name.split(" ")[0]})
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveWeaveModal(null)}
                  className="px-4 py-1.5 rounded-full bg-[#C5A059] text-[#1F1E1D] text-xs font-mono font-bold hover:brightness-105 cursor-pointer"
                >
                  Close Inspection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
