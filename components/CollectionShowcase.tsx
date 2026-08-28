"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Eye, Check, ArrowRight, MapPin, Palmtree, Sparkle, Building2, Flower2, Sun, Star } from "lucide-react";
import {
  PRODUCTS,
  CATEGORIES,
  DESTINATIONS,
  getAverageRating,
  type Product,
  type Destination,
} from "@/lib/products";

// Re-export so existing imports (page.tsx, ProductModal) keep working.
export type { Product } from "@/lib/products";
export { PRODUCTS } from "@/lib/products";

function StarRatingBadge({ product }: { product: Product }) {
  const count = product.reviews?.length || 0;
  if (count === 0) {
    return (
      <span className="inline-block mt-1.5 text-[11px] font-sans uppercase tracking-wider text-gold/90 font-medium">
        New Arrival
      </span>
    );
  }

  const rating = getAverageRating(product);

  return (
    <div className="inline-flex items-center gap-1.5 mt-2" title={`${rating.toFixed(1)} out of 5 stars (${count} reviews)`}>
      <div className="inline-flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= Math.round(rating)
                ? "fill-gold text-gold"
                : "text-sand/40 fill-transparent"
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-sans text-zinc-700 dark:text-sand/90 font-medium">
        {rating.toFixed(1)} <span className="text-muted font-normal">({count})</span>
      </span>
    </div>
  );
}

const DEST_ICON: Record<Destination, React.ElementType> = {
  Beach: Palmtree,
  Party: Sparkle,
  City: Building2,
  Garden: Flower2,
  Everyday: Sun,
};

// An evocative location scene behind each destination tile (no garments).
const DEST_IMG: Record<Destination | "All", string> = {
  All: "/images/destinations/all.jpg",
  Beach: "/images/destinations/beach.jpg",
  Party: "/images/destinations/party.jpg",
  City: "/images/destinations/city.jpg",
  Garden: "/images/destinations/garden.jpg",
  Everyday: "/images/destinations/everyday.jpg",
};

interface CollectionShowcaseProps {
  onQuickView: (product: Product) => void;
  onAddToCart?: (product: Product, size: string) => void;
}

export default function CollectionShowcase({
  onQuickView,
  onAddToCart,
}: CollectionShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeDest, setActiveDest] = useState<Destination | "All">("All");

  const filteredProducts = PRODUCTS.filter((p) => {
    const categoryMatch = activeCategory === "All" || p.category === activeCategory;
    const destMatch = activeDest === "All" || p.destinations.includes(activeDest);
    return categoryMatch && destMatch;
  });

  const destTiles: (Destination | "All")[] = ["All", ...DESTINATIONS.map((d) => d.key)];
  const destMeta = (k: Destination | "All") =>
    k === "All"
      ? { label: "All Journeys", tagline: "The full collection", Icon: Sparkle }
      : {
          label: DESTINATIONS.find((d) => d.key === k)!.label,
          tagline: DESTINATIONS.find((d) => d.key === k)!.tagline,
          Icon: DEST_ICON[k],
        };

  return (
    <section id="collection" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <span className="text-[11px] font-sans uppercase tracking-[0.4em] text-[#C5A059] font-medium">
            Collection 01 • Serendipity
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#1F1E1D] dark:text-[#FAF7F2] font-light tracking-wide">
            Simple pieces. <span className="italic font-serif">Meaningful moments.</span>
          </h2>
          <p className="font-serif italic text-lg text-zinc-600 dark:text-zinc-400 font-light">
            Nineteen handcrafted styles — each one carrying a fragment of Sri Lanka into the Australian wardrobe.
          </p>
        </div>

        {/* ── SHOP BY DESTINATION (image tiles) ── */}
        <div className="mb-14">
          <div className="flex items-center justify-center gap-2 mb-6">
            <MapPin className="w-4 h-4 text-[#C5A059]" />
            <span className="text-[12px] font-sans uppercase tracking-[0.35em] text-zinc-500 dark:text-zinc-300">
              Where will you wear it?
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {destTiles.map((k) => {
              const { label, tagline, Icon } = destMeta(k);
              const active = activeDest === k;
              return (
                <button
                  key={k}
                  onClick={() => setActiveDest(k === "All" ? "All" : active ? "All" : (k as Destination))}
                  className={`group relative h-36 sm:h-44 rounded-2xl overflow-hidden text-left transition-all duration-500 ${
                    active
                      ? "ring-2 ring-[#C5A059] shadow-[0_12px_40px_rgba(197,160,89,0.35)] -translate-y-1"
                      : "ring-1 ring-white/10 hover:-translate-y-1 hover:ring-[#C5A059]/60"
                  }`}
                >
                  {/* bg image */}
                  <img
                    src={DEST_IMG[k]}
                    alt={label}
                    className={`absolute inset-0 w-full h-full object-cover object-[center_20%] transition-transform duration-[1.4s] ease-out ${
                      active ? "scale-105" : "grayscale-[15%] group-hover:scale-105 group-hover:grayscale-0"
                    }`}
                  />
                  {/* overlays */}
                  <div className={`absolute inset-0 transition-colors duration-500 ${active ? "bg-black/35" : "bg-black/55 group-hover:bg-black/40"}`} />
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  {active && <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#C5A059] flex items-center justify-center shadow"><Check className="w-3 h-3 text-black" /></div>}
                  {/* content */}
                  <div className="absolute inset-0 p-3.5 flex flex-col justify-end">
                    <Icon className="w-5 h-5 mb-2 text-[#E7C989] drop-shadow" />
                    <div className="font-serif text-[15px] leading-tight text-white font-medium drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
                      {label}
                    </div>
                    <div className="text-[10px] font-sans mt-0.5 tracking-wide text-white/75">
                      {tagline}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── CATEGORY TABS (bold, high-contrast) ── */}
        <div className="flex flex-col items-center gap-4 mb-14">
          <span className="text-[10px] font-sans uppercase tracking-[0.35em] text-zinc-400 dark:text-zinc-500">
            Browse by piece
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-[12px] font-sans uppercase tracking-[0.22em] transition-all duration-300 border ${
                    active
                      ? "bg-[#C5A059] text-black border-[#C5A059] font-semibold shadow-[0_8px_28px_rgba(197,160,89,0.4)] scale-[1.04]"
                      : "bg-white/70 dark:bg-white/5 text-zinc-700 dark:text-zinc-200 border-black/5 dark:border-white/10 hover:border-[#C5A059] hover:text-[#C5A059] dark:hover:text-[#E7C989]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── PRODUCTS GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5 }}
                key={product.id}
                className="group flex flex-col bg-white/40 dark:bg-white/[0.03] rounded-2xl overflow-hidden border border-[#DCC7AF]/20 dark:border-white/10 hover:border-[#C5A059]/50 transition-all duration-500 hover:shadow-[0_14px_50px_rgba(31,30,29,0.14)]"
              >
                {/* Product Image Frame — image → cinematic video crossfade on hover */}
                <div
                  className="relative aspect-[3/4] w-full overflow-hidden bg-[#ECE6DC] dark:bg-[#1a1917]"
                  onMouseEnter={(e) => {
                    const v = e.currentTarget.querySelector("video");
                    if (v) { v.currentTime = 0; const p = v.play(); if (p) p.catch(() => {}); }
                  }}
                  onMouseLeave={(e) => {
                    const v = e.currentTarget.querySelector("video");
                    if (v) v.pause();
                  }}
                >
                  <Link href={`/product/${product.id}`} className="block absolute inset-0" aria-label={`View ${product.name}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out group-hover:opacity-0"
                    />
                    {product.videoHover ? (
                      <video
                        src={product.videoHover}
                        poster={product.imageHover}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        aria-hidden
                        className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100"
                      />
                    ) : (
                      <img
                        src={product.imageHover}
                        alt={`${product.name} detail`}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-70 pointer-events-none" />
                  </Link>

                  {/* Colour dot + name */}
                  <div className="absolute top-3 left-3 flex items-center space-x-2 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] text-white pointer-events-none">
                    <span className="w-2.5 h-2.5 rounded-full border border-white/40" style={{ backgroundColor: product.colorHex }} />
                    <span className="font-sans uppercase tracking-wider">{product.colorName}</span>
                  </div>

                  {/* Destination chips */}
                  <div className="absolute top-3 right-3 flex flex-col items-end gap-1 pointer-events-none">
                    {product.destinations.slice(0, 2).map((d) => (
                      <span key={d} className="bg-white/85 text-[#1F1E1D] text-[9px] font-sans uppercase tracking-[0.18em] px-2 py-0.5 rounded-full shadow-sm">
                        {d}
                      </span>
                    ))}
                  </div>

                  {/* "2nd look" hint */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <span className="bg-black/55 backdrop-blur-md text-[#E7C989] text-[9px] font-sans uppercase tracking-[0.2em] px-2 py-0.5 rounded-full">
                      Detail view
                    </span>
                  </div>

                  {/* Quick actions */}
                  <div className="absolute inset-x-3 top-14 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => { e.preventDefault(); onQuickView(product); }}
                      className="p-2 rounded-xl bg-black/70 hover:bg-black text-white backdrop-blur-md transition-colors"
                      title="Quick view"
                    >
                      <Eye className="w-4 h-4 text-[#C5A059]" />
                    </button>
                    <button
                      onClick={(e) => { e.preventDefault(); onQuickView(product); }}
                      className="p-2 rounded-xl bg-[#C5A059] hover:bg-[#A46446] text-white shadow-lg transition-transform hover:scale-110"
                      title="Select size & add to bag"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <div className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#C5A059] mb-1">
                      {product.story}
                    </div>
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-serif text-lg text-zinc-900 dark:text-zinc-100 font-medium group-hover:text-[#C5A059] transition-colors cursor-pointer leading-snug">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs font-sans text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {product.fabric}
                    </p>
                    <StarRatingBadge product={product} />
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#DCC7AF]/20 dark:border-white/10 flex items-center justify-between">
                    <span className="font-serif text-base text-zinc-900 dark:text-zinc-100 font-semibold">
                      ${product.priceAud} AUD
                    </span>
                    <Link
                      href={`/product/${product.id}`}
                      className="inline-flex items-center gap-1 text-xs font-sans uppercase tracking-widest text-[#1F1E1D] dark:text-[#FAF7F2] hover:text-[#C5A059] font-medium transition-colors"
                    >
                      View <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-zinc-500 dark:text-zinc-400 font-serif italic">
            No pieces match this journey yet — try another destination.
          </div>
        )}
      </div>
    </section>
  );
}
