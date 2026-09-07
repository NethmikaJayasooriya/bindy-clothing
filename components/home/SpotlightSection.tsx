"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Check, ShoppingBag, Flame, Eye, Star } from "lucide-react";
import { getFeaturedSpotlightProducts, type Product } from "@/data/products";
import { addToCart } from "@/lib/cart";
import { SectionHeading } from "@/components/ui";

export interface SpotlightSectionProps {
  onSelectProduct?: (product: Product) => void;
  onAddToCart?: (product: Product, size: string) => void;
}

export default function SpotlightSection({
  onSelectProduct,
  onAddToCart,
}: SpotlightSectionProps) {
  const spotlightProducts = getFeaturedSpotlightProducts();
  const heroProduct = spotlightProducts[0];
  const sideProducts = spotlightProducts.slice(1);

  const [heroSize, setHeroSize] = useState<string>("AU 8 (S)");
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleAdd = (product: Product, size: string) => {
    if (onAddToCart) {
      onAddToCart(product, size);
    } else {
      addToCart(product, size, 1);
    }
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  if (!heroProduct) return null;

  return (
    <section className="relative py-24 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#DCC7AF]/50 bg-gradient-to-b from-[#FAF7F2] via-white to-[#FAF7F2]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <SectionHeading
          align="left"
          eyebrow="Editorial Curation • Serendipity"
          eyebrowIcon={<Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />}
          title="This Week's Spotlight"
          italicWord="Spotlight"
          description="Three iconic silhouettes embodying natural Sri Lankan pit-loom weave and fluid Australian drape."
          action={
            <a
              href="#browse-collection"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#1F1E1D] hover:text-[#B86B4B] transition-colors font-semibold group pb-1"
            >
              <span>Explore All 19 Pieces</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </a>
          }
        />

        {/* Asymmetrical High-Impact Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch mt-6">
          
          {/* 1. HERO SPOTLIGHT PIECE (7 COLUMNS) */}
          <div className="lg:col-span-7 bg-white rounded-3xl overflow-hidden border border-[#DCC7AF] shadow-[0_12px_45px_rgba(0,0,0,0.06)] flex flex-col md:flex-row group transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
            
            {/* Image Frame with Dual Hover */}
            <div className="relative aspect-[3/4] md:w-1/2 overflow-hidden bg-[#FAF7F2] flex-shrink-0">
              <img
                src={heroProduct.image}
                alt={heroProduct.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              {heroProduct.imageHover && (
                <img
                  src={heroProduct.imageHover}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
                />
              )}

              {/* Bestseller Ribbon */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                <span className="px-3 py-1 rounded-full bg-[#1F1E1D] text-white text-[10px] font-mono uppercase tracking-wider font-bold shadow-md flex items-center gap-1">
                  <Flame className="w-3 h-3 text-[#C5A059]" />
                  <span>Signature Hero</span>
                </span>
              </div>

              {/* Quick Inspect Button */}
              <button
                type="button"
                onClick={() => onSelectProduct && onSelectProduct(heroProduct)}
                className="absolute bottom-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-[#1F1E1D] hover:text-[#B86B4B] shadow-md transition-all opacity-0 group-hover:opacity-100 z-10"
                title="Quick View"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>

            {/* Information & Direct Purchase Controls */}
            <div className="p-6 sm:p-8 md:w-1/2 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-semibold">
                  <span>{heroProduct.storyPlace}</span>
                  <div className="flex items-center gap-1 text-[#1F1E1D]">
                    <Star className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
                    <span>4.9 (28 reviews)</span>
                  </div>
                </div>

                <Link
                  href={`/product/${heroProduct.id}`}
                  className="font-serif text-2xl sm:text-3xl text-[#1F1E1D] hover:text-[#B86B4B] transition-colors block font-medium leading-tight"
                >
                  {heroProduct.name}
                </Link>

                <p className="text-xs font-sans text-[#78716A] leading-relaxed line-clamp-3 font-light">
                  {heroProduct.description}
                </p>

                <div className="pt-1">
                  <span className="font-serif text-2xl sm:text-3xl font-semibold text-[#1F1E1D]">
                    ${heroProduct.priceAud} AUD
                  </span>
                  <span className="block text-[10px] font-mono text-[#78716A] uppercase tracking-wider mt-0.5">
                    {heroProduct.fabric} • Carbon-Neutral AU Shipping
                  </span>
                </div>
              </div>

              {/* In-Card Instant Size Selector */}
              <div className="space-y-4 pt-3 border-t border-[#DCC7AF]/50">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="uppercase text-[#78716A]">Select Size:</span>
                    <span className="text-[#C5A059] font-medium">{heroSize}</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {heroProduct.sizes.map((sz) => {
                      const isSelected = heroSize === sz;
                      const short = sz.replace("AU ", "").split(" ")[0];

                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setHeroSize(sz)}
                          className={`py-2 text-xs font-mono rounded-xl border text-center transition-all ${
                            isSelected
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

                {/* Primary Purchase CTA */}
                <button
                  type="button"
                  onClick={() => handleAdd(heroProduct, heroSize)}
                  className={`w-full py-4 rounded-full font-mono text-xs uppercase tracking-wider font-semibold transition-all duration-300 shadow-md flex items-center justify-center gap-2 ${
                    addedId === heroProduct.id
                      ? "bg-[#AFC8B1] text-[#2E4A32]"
                      : "bg-[#B86B4B] hover:bg-[#9E4D30] text-white"
                  }`}
                >
                  {addedId === heroProduct.id ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Your Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add Signature to Bag</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* 2. STACKED SIDE SIGNATURES (5 COLUMNS) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {sideProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-[#DCC7AF]/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_45px_rgba(0,0,0,0.08)] transition-all duration-300 flex items-center gap-5 group"
              >
                {/* Square-ish Media Thumbnail */}
                <div className="w-28 sm:w-32 aspect-[3/4] rounded-2xl overflow-hidden bg-[#FAF7F2] relative border border-[#DCC7AF]/40 flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    type="button"
                    onClick={() => onSelectProduct && onSelectProduct(product)}
                    className="absolute bottom-2 right-2 p-1.5 rounded-full bg-white/90 text-[#1F1E1D] hover:text-[#C5A059] shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Quick Inspect"
                  >
                    <Eye className="w-3 h-3" />
                  </button>
                </div>

                {/* Details & Quick Add */}
                <div className="min-w-0 flex-1 space-y-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] block truncate font-medium">
                      {product.story}
                    </span>
                    <Link
                      href={`/product/${product.id}`}
                      className="font-serif text-base sm:text-lg text-[#1F1E1D] hover:text-[#B86B4B] transition-colors block font-medium truncate"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-[#78716A] truncate font-light">
                      {product.fabric}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-lg sm:text-xl font-semibold text-[#1F1E1D]">
                      ${product.priceAud} AUD
                    </span>
                  </div>

                  {/* Size Mini Buttons */}
                  <div className="pt-1">
                    <div className="flex items-center gap-1.5">
                      {product.sizes.slice(0, 4).map((sz) => {
                        const short = sz.replace("AU ", "").split(" ")[0];
                        return (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => handleAdd(product, sz)}
                            className="px-2.5 py-1 text-[10px] font-mono rounded-lg border border-[#DCC7AF] bg-[#FAF7F2] text-[#1F1E1D] hover:bg-[#B86B4B] hover:text-white hover:border-[#B86B4B] transition-colors cursor-pointer"
                            title={`Quick add AU ${short}`}
                          >
                            AU {short}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
