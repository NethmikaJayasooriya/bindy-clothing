"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Eye, Heart } from "lucide-react";
import { PRODUCTS, type Product } from "@/lib/products";
import { isInWishlist, toggleWishlist, subscribeWishlist } from "@/lib/wishlist";

interface HeroSpotlightStripProps {
  onSelectProduct?: (product: Product) => void;
}

export default function HeroSpotlightStrip({ onSelectProduct }: HeroSpotlightStripProps) {
  const [, setWishlistTick] = useState(0);

  useEffect(() => {
    const unsub = subscribeWishlist(() => setWishlistTick((t) => t + 1));
    return () => unsub();
  }, []);

  const spotlightIds = ["lotus-memory-dress", "cinnamon-flow-skirt", "pettah-check-dress"];
  const spotlightProducts = spotlightIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  return (
    <section className="relative pt-16 pb-12 sm:pt-20 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-sand/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-[10px] font-sans uppercase tracking-[0.32em] text-gold font-semibold">
              <Sparkles className="w-3 h-3 text-gold" />
              <span>Curated Selection</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal-rich font-light tracking-wide">
              This Week&apos;s Spotlight
            </h2>
            <p className="font-serif italic text-base text-muted font-light max-w-xl leading-relaxed">
              Three signature silhouettes embodying natural Sri Lankan handloom and pure cotton drape.
            </p>
          </div>

          <a
            href="#collection"
            className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.22em] text-charcoal hover:text-gold transition-colors self-start md:self-end pb-1 font-semibold group"
          >
            <span>Explore Full Collection</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* 3 Spotlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {spotlightProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="group relative bg-paper-light rounded-3xl overflow-hidden border border-sand/40 hover:border-gold/70 transition-all duration-400 p-4 sm:p-5 flex flex-col justify-between shadow-paper-card hover:shadow-luxury-hover cursor-pointer"
            >
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-paper-dark mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] font-sans uppercase tracking-[0.25em] text-[#DFC182] border border-white/15 font-medium">
                  {product.destinations[0] || "Everyday"}
                </div>

                {/* Top-Right Favorite Toggle */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
                  className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer z-10 ${
                    isInWishlist(product.id)
                      ? "bg-gold text-charcoal shadow-md scale-105"
                      : "bg-black/60 hover:bg-black text-white hover:text-gold"
                  }`}
                  title={isInWishlist(product.id) ? "Remove from Saved" : "Save to Wishlist"}
                  aria-label="Save to Wishlist"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isInWishlist(product.id) ? "fill-charcoal text-charcoal" : "text-gold"
                    }`}
                  />
                </button>

                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <span className="px-4 py-2 rounded-full bg-paper-light text-charcoal font-sans text-[10px] uppercase tracking-[0.22em] font-semibold flex items-center gap-1.5 shadow-lg">
                    <Eye className="w-3.5 h-3.5 text-gold" />
                    Quick View
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-sans uppercase tracking-[0.25em] text-gold font-semibold">
                  {product.colorName} • {product.fabric}
                </p>
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-serif text-lg sm:text-xl text-charcoal font-medium group-hover:text-gold transition-colors leading-snug">
                    {product.name}
                  </h3>
                  <span className="font-serif text-lg font-semibold text-charcoal flex-shrink-0">
                    ${product.priceAud} <span className="text-[11px] font-sans font-normal text-muted">AUD</span>
                  </span>
                </div>
                <p className="text-xs font-sans text-muted line-clamp-2 leading-relaxed font-light">
                  {product.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
