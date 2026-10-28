"use client";
import ResponsiveImage from "@/components/ResponsiveImage";
import { useStorefront } from "@/components/StorefrontProvider";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Sparkles,
  Check,
  ZoomIn,
  Truck,
  ShieldCheck,
  X,
  ArrowRight,
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
  p1Role: string;
  p2Role: string;
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
  stylingNote: string;
}

function weaveFor(id: string) {
  const product = PRODUCTS.find((piece) => piece.id === id)!;
  return {
    count: product.fabric,
    dye: product.colorName,
    weight: "See the fabric and care details on the product page",
    handfeel: product.description,
  };
}

const ENSEMBLES: EnsembleConfig[] = [
  {
    id: "cacao-ivory", tabLabel: "01 • Cacao & Ivory", badge: "The Real Life Edit 01",
    title: "The Cacao & Ivory Duo", subtitle: "A satin camisole with softly textured ivory tiers",
    p1Id: "cacao-satin-cami", p2Id: "ivory-tiered-maxi-skirt", p1Role: "Piece 01 • Satin Camisole", p2Role: "Piece 02 • Tiered Skirt", savings: 45,
    p1DetailImg: PRODUCTS.find((p) => p.id === "cacao-satin-cami")!.gallery[2],
    p2DetailImg: PRODUCTS.find((p) => p.id === "ivory-tiered-maxi-skirt")!.gallery[3],
    p1Weave: weaveFor("cacao-satin-cami"), p2Weave: weaveFor("ivory-tiered-maxi-skirt"),
    stylingNote: "Warm cacao satin and airy ivory tiers — two independent pieces, photographed together on a relaxed city afternoon.",
  },
  {
    id: "moonflower-midnight", tabLabel: "02 • Moonflower & Midnight", badge: "The Real Life Edit 02",
    title: "The Moonflower & Midnight Duo", subtitle: "Delicate white embroidery with a flowing black skirt",
    p1Id: "moonflower-halter-top", p2Id: "midnight-flow-maxi-skirt", p1Role: "Piece 01 • Eyelet Halter", p2Role: "Piece 02 • Black Maxi Skirt", savings: 45,
    p1DetailImg: PRODUCTS.find((p) => p.id === "moonflower-halter-top")!.gallery[2],
    p2DetailImg: PRODUCTS.find((p) => p.id === "midnight-flow-maxi-skirt")!.gallery[2],
    p1Weave: weaveFor("moonflower-halter-top"), p2Weave: weaveFor("midnight-flow-maxi-skirt"),
    stylingNote: "A light embroidered halter and a deep black skirt. Wear them together by the water, then style each piece your own way.",
  },
  {
    id: "pearl-eyelet", tabLabel: "03 • Pearl & Eyelet", badge: "The Real Life Edit 03",
    title: "The Everyday Pearl Duo", subtitle: "Lace-trim cotton and a gathered cutwork mini",
    p1Id: "pearl-lace-blouse", p2Id: "ivory-eyelet-mini-skirt", p1Role: "Piece 01 • Lace Blouse", p2Role: "Piece 02 • Eyelet Mini", savings: 45,
    p1DetailImg: PRODUCTS.find((p) => p.id === "pearl-lace-blouse")!.gallery[3],
    p2DetailImg: PRODUCTS.find((p) => p.id === "ivory-eyelet-mini-skirt")!.gallery[3],
    p1Weave: weaveFor("pearl-lace-blouse"), p2Weave: weaveFor("ivory-eyelet-mini-skirt"),
    stylingNote: "A fresh take on tonal dressing. The blouse's fine lace trim echoes the skirt's floral cutwork for a soft, easy afternoon look.",
  },
];

export default function ShopTheLookSection({
  onQuickView,
  onAddToCart,
}: ShopTheLookSectionProps) {
  const { products: PRODUCTS } = useStorefront();
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const [size1, setSize1] = useState("AU 8 (S)");
  const [size2, setSize2] = useState("AU 8 (S)");
  const [activeWeaveModal, setActiveWeaveModal] = useState<"p1" | "p2" | null>(null);
  const [isAdded, setIsAdded] = useState(false);

  const activeLook = ENSEMBLES[activeLookIndex];
  const p1 = PRODUCTS.find((p) => p.id === activeLook.p1Id);
  const p2 = PRODUCTS.find((p) => p.id === activeLook.p2Id);

  if (!p1 || !p2) return null;

  const originalTotal = p1.priceAud + p2.priceAud;
  const bundlePrice = originalTotal;

  const handleAddBundle = () => {
    const discountedP1: Product = {
      ...p1,
      priceAud: p1.priceAud,
    };
    const discountedP2: Product = {
      ...p2,
      priceAud: p2.priceAud,
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
    <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FAF7F2] via-white to-[#FAF7F2] border-y border-[#DCC7AF]/70">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* 1. EDITORIAL HEADER */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F1E1D] text-[#DFC285] text-xs font-mono tracking-wider uppercase font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Curated Styling Duos · Made to Pair</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl text-[#1F1E1D] font-light leading-tight">
            The Coordinated Ensembles
          </h2>

          <p className="font-serif italic text-sm sm:text-base text-charcoal-subtle leading-relaxed font-light">
            Pair complementary handloom silhouettes for effortless day-to-evening versatility.
            Receive an automatic $45 AUD dual-piece privilege.
          </p>

          {/* LOOK SELECTOR TABS */}
          <div className="pt-2 flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-1">
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
                  className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all duration-300 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-[#1F1E1D] text-white shadow-md font-bold border border-[#1F1E1D]"
                      : "bg-white text-charcoal-subtle border border-[#DCC7AF]/80 hover:border-[#1F1E1D] hover:text-[#1F1E1D]"
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

        {/* 2. THE DUAL SILHOUETTE SHOWCASE (CLEAN 2-COLUMN CARDS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          
          {/* PIECE 01 CARD */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#DCC7AF]/70 shadow-sm flex flex-col justify-between space-y-4 group hover:border-[#C5A059]/60 transition-colors">
            
            {/* Top Badge & Weave Tag */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[#FAF7F2] text-[#C5A059] text-sm font-mono uppercase font-semibold tracking-[0.2em] font-bold border border-[#DCC7AF]/50">
                {activeLook.p1Role}
              </span>
              <button
                type="button"
                onClick={() => setActiveWeaveModal("p1")}
                className="text-xs font-mono text-charcoal-subtle hover:text-[#1F1E1D] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ZoomIn className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Inspect Weave</span>
              </button>
            </div>

            {/* Garment Image */}
            <Link
              href={`/product/${p1.id}`}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#DCC7AF]/40 block cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <ResponsiveImage
                src={p1.image}
                alt={p1.name}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
              <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-xs text-white text-xs font-mono tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                <span>Explore Silhouette</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </Link>

            {/* Garment Details */}
            <div className="space-y-1">
              <div className="flex items-baseline justify-between">
                <Link
                  href={`/product/${p1.id}`}
                  className="font-serif text-lg sm:text-xl text-[#1F1E1D] font-medium leading-snug hover:text-[#C5A059] transition-colors"
                >
                  {p1.name}
                </Link>
                <span className="font-mono text-base font-bold text-[#1F1E1D]">
                  ${p1.priceAud} <span className="text-xs text-charcoal-subtle">AUD</span>
                </span>
              </div>
              <p className="text-xs font-mono text-charcoal-subtle flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block border border-black/10 shrink-0"
                  style={{ backgroundColor: p1.colorHex }}
                />
                <span>{p1.colorName}</span>
                <span>•</span>
                <span>{p1.fabric}</span>
              </p>
            </div>

            {/* Clean Size Selector Chips */}
            <div className="pt-3 border-t border-[#DCC7AF]/40 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-charcoal-subtle">Select Fit:</span>
                <span className="font-bold text-[#1F1E1D]">{size1}</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {p1.sizes.map((sz) => {
                  const isSelected = size1 === sz;
                  const short = sz.replace("AU ", "").split(" ")[0];
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSize1(sz)}
                      className={`py-2 rounded-xl text-xs font-mono text-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#1F1E1D] text-white font-bold shadow-xs scale-102"
                          : "bg-[#FAF7F2] text-charcoal-subtle border border-[#DCC7AF]/50 hover:border-[#1F1E1D] hover:text-[#1F1E1D]"
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
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#DCC7AF]/70 shadow-sm flex flex-col justify-between space-y-4 group hover:border-[#B86B4B]/60 transition-colors">
            
            {/* Top Badge & Weave Tag */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[#FAF7F2] text-[#B86B4B] text-sm font-mono uppercase font-semibold tracking-[0.2em] font-bold border border-[#DCC7AF]/50">
                {activeLook.p2Role}
              </span>
              <button
                type="button"
                onClick={() => setActiveWeaveModal("p2")}
                className="text-xs font-mono text-charcoal-subtle hover:text-[#1F1E1D] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ZoomIn className="w-3.5 h-3.5 text-[#B86B4B]" />
                <span>Inspect Weave</span>
              </button>
            </div>

            {/* Garment Image */}
            <Link
              href={`/product/${p2.id}`}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#DCC7AF]/40 block cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <ResponsiveImage
                src={p2.image}
                alt={p2.name}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
              <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-xs text-white text-xs font-mono tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                <span>Explore Silhouette</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </Link>

            {/* Garment Details */}
            <div className="space-y-1">
              <div className="flex items-baseline justify-between">
                <Link
                  href={`/product/${p2.id}`}
                  className="font-serif text-lg sm:text-xl text-[#1F1E1D] font-medium leading-snug hover:text-[#B86B4B] transition-colors"
                >
                  {p2.name}
                </Link>
                <span className="font-mono text-base font-bold text-[#1F1E1D]">
                  ${p2.priceAud} <span className="text-xs text-charcoal-subtle">AUD</span>
                </span>
              </div>
              <p className="text-xs font-mono text-charcoal-subtle flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block border border-black/10 shrink-0"
                  style={{ backgroundColor: p2.colorHex }}
                />
                <span>{p2.colorName}</span>
                <span>•</span>
                <span>{p2.fabric}</span>
              </p>
            </div>

            {/* Clean Size Selector Chips */}
            <div className="pt-3 border-t border-[#DCC7AF]/40 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-charcoal-subtle">Select Fit:</span>
                <span className="font-bold text-[#1F1E1D]">{size2}</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {p2.sizes.map((sz) => {
                  const isSelected = size2 === sz;
                  const short = sz.replace("AU ", "").split(" ")[0];
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSize2(sz)}
                      className={`py-2 rounded-xl text-xs font-mono text-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#1F1E1D] text-white font-bold shadow-xs scale-102"
                          : "bg-[#FAF7F2] text-charcoal-subtle border border-[#DCC7AF]/50 hover:border-[#1F1E1D] hover:text-[#1F1E1D]"
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

        {/* 3. SLEEK LUXURY BUNDLE ACTION BAR (UNIFIED, ZERO CLUTTER) */}
        <div className="bg-[#161513] text-white rounded-3xl p-6 sm:p-8 border border-[#C5A059]/40 shadow-2xl space-y-5">
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            
            {/* Left: Look Title & Pairing Note */}
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/20 text-[#DFC285] text-sm font-mono uppercase font-semibold tracking-wider font-bold">
                <Sparkles className="w-3 h-3 text-[#C5A059]" />
                <span>Two Favourite Pieces · One Complete Look</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-light text-white leading-tight">
                {activeLook.title}
              </h3>
              <p className="font-serif italic text-xs sm:text-sm text-[#DCC7AF]/80 leading-relaxed font-light">
                &ldquo;{activeLook.stylingNote}&rdquo;
              </p>
            </div>

            {/* Right: Price & Big CTA */}
            <div className="shrink-0 flex flex-col sm:flex-row items-start sm:items-center gap-5 lg:gap-6 border-t lg:border-t-0 pt-4 lg:pt-0 border-white/10">
              
              <div className="text-left sm:text-right space-y-0.5">
                <span className="text-xs font-mono text-[#DCC7AF]/60 uppercase tracking-widest block">
                  Complete Duo Price
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-[#DCC7AF]/50  font-mono">
                    ${originalTotal} AUD
                  </span>
                  <span className="font-serif text-3xl font-normal text-white">
                    ${bundlePrice}{" "}
                    <span className="text-xs font-mono text-[#C5A059]">AUD</span>
                  </span>
                </div>
                <span className="text-xs font-mono text-[#DFC285] font-bold block">
                  Two pieces, styled together
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddBundle}
                className={`w-full sm:w-auto px-8 py-4 rounded-full font-mono text-sm uppercase font-semibold tracking-[0.2em] font-bold transition-all duration-300 shadow-xl flex items-center justify-center space-x-2 cursor-pointer ${
                  isAdded
                    ? "bg-[#3D5A40] text-white border border-[#5E8B63]"
                    : "bg-gradient-to-r from-[#C5A059] via-[#DFC285] to-[#C5A059] text-[#161513] hover:brightness-110 hover:shadow-[0_8px_30px_rgba(197,160,89,0.35)] active:scale-[0.98]"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Both Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add Complete Duo to Bag — ${bundlePrice} AUD</span>
                  </>
                )}
              </button>

            </div>

          </div>

          {/* Delivery & Assurance Strip */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-center sm:justify-between gap-3 text-xs font-mono text-[#DCC7AF]/70 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Free AU Express Courier ($150+)</span>
            </span>
            <span className="hidden sm:inline">•</span>
            <span>Selected Fits: Piece 01 ({size1.split(" ")[0]}) + Piece 02 ({size2.split(" ")[0]})</span>
            <span className="hidden sm:inline">•</span>
            <span>30-Day Easy Australian Returns</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>100% Pit-Loom Certified</span>
            </span>
          </div>

        </div>

      </div>

      {/* 4. FABRIC WEAVE MACRO MAGNIFIER MODAL */}
      <AnimatePresence>
        {activeWeaveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 border border-[#DCC7AF] shadow-2xl space-y-6 overflow-hidden"
            >
              {/* Modal Close */}
              <button
                type="button"
                onClick={() => setActiveWeaveModal(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white border border-[#DCC7AF] text-[#1F1E1D] flex items-center justify-center hover:bg-[#1F1E1D] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Header */}
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/15 text-[#1F1E1D] text-sm font-mono uppercase font-semibold tracking-wider font-semibold">
                  <Sparkles className="w-3 h-3 text-[#C5A059]" />
                  <span>A Closer Look • Real Garment Details</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#1F1E1D] font-light">
                  {activeWeaveModal === "p1" ? p1.name : p2.name}
                </h3>
                <p className="font-mono text-xs text-charcoal-subtle">
                  Explore the texture and finish in our original campaign photographs.
                </p>
              </div>

              {/* Modal Content: Detail Photo + Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                
                {/* Texture Visual */}
                <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-xl bg-white group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <ResponsiveImage
                    src={
                      activeWeaveModal === "p1"
                        ? activeLook.p1DetailImg
                        : activeLook.p2DetailImg
                    }
                    alt="Fabric weave macro"
                    className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-xs font-mono tracking-widest uppercase">
                      Explore the garment detail
                    </span>
                  </div>
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/75 text-white text-xs font-mono uppercase font-semibold backdrop-blur-xs">
                    Garment Close-Up
                  </div>
                </div>

                {/* Specs List */}
                <div className="space-y-2.5 font-mono text-xs">
                  {activeWeaveModal === "p1" ? (
                    <>
                      <div className="p-3 rounded-xl bg-white border border-[#DCC7AF]/60">
                        <span className="text-xs text-charcoal-subtle uppercase tracking-wider block font-semibold">
                          Fabric
                        </span>
                        <span className="text-[#1F1E1D] font-bold text-sm block mt-0.5">
                          {activeLook.p1Weave.count}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-[#DCC7AF]/60">
                        <span className="text-xs text-charcoal-subtle uppercase tracking-wider block font-semibold">
                          Colour
                        </span>
                        <span className="text-[#1F1E1D] font-bold text-sm block mt-0.5">
                          {activeLook.p1Weave.dye}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-[#DCC7AF]/60">
                        <span className="text-xs text-charcoal-subtle uppercase tracking-wider block font-semibold">
                          Fabric &amp; Care
                        </span>
                        <span className="text-[#1F1E1D] font-bold text-sm block mt-0.5">
                          {activeLook.p1Weave.weight}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-[#DCC7AF]/60">
                        <span className="text-xs text-charcoal-subtle uppercase tracking-wider block font-semibold">
                          The Details
                        </span>
                        <span className="text-[#1F1E1D] text-xs font-serif italic block mt-0.5">
                          &ldquo;{activeLook.p1Weave.handfeel}&rdquo;
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-3 rounded-xl bg-white border border-[#DCC7AF]/60">
                        <span className="text-xs text-charcoal-subtle uppercase tracking-wider block font-semibold">
                          Fabric
                        </span>
                        <span className="text-[#1F1E1D] font-bold text-sm block mt-0.5">
                          {activeLook.p2Weave.count}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-[#DCC7AF]/60">
                        <span className="text-xs text-charcoal-subtle uppercase tracking-wider block font-semibold">
                          Colour
                        </span>
                        <span className="text-[#1F1E1D] font-bold text-sm block mt-0.5">
                          {activeLook.p2Weave.dye}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-[#DCC7AF]/60">
                        <span className="text-xs text-charcoal-subtle uppercase tracking-wider block font-semibold">
                          Fabric &amp; Care
                        </span>
                        <span className="text-[#1F1E1D] font-bold text-sm block mt-0.5">
                          {activeLook.p2Weave.weight}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-[#DCC7AF]/60">
                        <span className="text-xs text-charcoal-subtle uppercase tracking-wider block font-semibold">
                          The Details
                        </span>
                        <span className="text-[#1F1E1D] text-xs font-serif italic block mt-0.5">
                          &ldquo;{activeLook.p2Weave.handfeel}&rdquo;
                        </span>
                      </div>
                    </>
                  )}
                </div>

              </div>

              {/* Modal Switcher Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-[#DCC7AF]/60">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveWeaveModal("p1")}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-mono cursor-pointer transition-colors ${
                      activeWeaveModal === "p1"
                        ? "bg-[#1F1E1D] text-white font-bold"
                        : "bg-white text-charcoal-subtle border border-[#DCC7AF]/60 hover:text-[#1F1E1D]"
                    }`}
                  >
                    Piece 01 ({activeLook.p1Role.split("• ")[1]})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveWeaveModal("p2")}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-mono cursor-pointer transition-colors ${
                      activeWeaveModal === "p2"
                        ? "bg-[#1F1E1D] text-white font-bold"
                        : "bg-white text-charcoal-subtle border border-[#DCC7AF]/60 hover:text-[#1F1E1D]"
                    }`}
                  >
                    Piece 02 ({activeLook.p2Role.split("• ")[1]})
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveWeaveModal(null)}
                  className="px-4 py-1.5 rounded-full bg-[#C5A059] text-[#1F1E1D] text-xs font-mono font-bold hover:brightness-105 cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
