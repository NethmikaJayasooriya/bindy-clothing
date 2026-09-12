"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, CheckCircle2, ShoppingBag, Eye, ArrowRight, Sparkles, Heart } from "lucide-react";
import { PRODUCTS, type Product } from "@/data/products";
import { addToCart } from "@/lib/cart";

export interface VerifiedReviewsSellingSectionProps {
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product, size: string) => void;
}

interface CuratedReviewItem {
  id: string;
  productId: string;
  reviewerName: string;
  reviewerLocation: string;
  rating: number;
  fitText: string;
  quoteTitle: string;
  reviewText: string;
  verified: boolean;
}

const FEATURED_REVIEWS: CuratedReviewItem[] = [
  {
    id: "rev-1",
    productId: "lotus-memory-dress",
    reviewerName: "Amara P.",
    reviewerLocation: "Brisbane, QLD",
    rating: 5,
    fitText: "True to size • Wears AU 8",
    quoteTitle: "Feels like a quiet dream on skin",
    reviewText:
      "The lightweight cotton voile is so featherlight I forget I'm wearing it. Wore it to a botanical lunch in New Farm and three women asked where it was from. The drape falls effortlessly.",
    verified: true,
  },
  {
    id: "rev-2",
    productId: "serendib-pearl-dress",
    reviewerName: "Sophie L.",
    reviewerLocation: "Sydney, NSW",
    rating: 5,
    fitText: "Perfect drape • Wears AU 10",
    quoteTitle: "The cutwork lace is museum quality",
    reviewText:
      "The hand-carved mother-of-pearl buttons catch the golden-hour light so subtly. You can immediately tell this was woven on an artisan pit-loom rather than run through a factory line.",
    verified: true,
  },
  {
    id: "rev-3",
    productId: "golden-cascade-dress",
    reviewerName: "Isabella R.",
    reviewerLocation: "Melbourne, VIC",
    rating: 5,
    fitText: "Relaxed tailored fit • Wears AU 8",
    quoteTitle: "Collection 02 is extraordinary",
    reviewText:
      "The golden cascade tiering has the most breathtaking movement when walking through the city. Breathable, beautifully structured, and the natural timber fasteners add such honest charm.",
    verified: true,
  },
  {
    id: "rev-4",
    productId: "cinnamon-flow-skirt",
    reviewerName: "Claire T.",
    reviewerLocation: "Perth, WA",
    rating: 5,
    fitText: "Fluid bias cut • Wears AU 8",
    quoteTitle: "The cinnamon wash is gorgeous",
    reviewText:
      "Fluid bias drape that pairs with everything from a linen crop to a casual white tee. The hand-loomed texture has an earthy luxury that fast-fashion brands simply cannot replicate.",
    verified: true,
  },
];

export default function VerifiedReviewsSellingSection({
  onQuickView,
  onAddToCart,
}: VerifiedReviewsSellingSectionProps) {
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleQuickAdd = (product: Product) => {
    const size = product.sizes[1] || product.sizes[0] || "AU 8 (S)";
    if (onAddToCart) {
      onAddToCart(product, size);
    } else {
      addToCart(product, size, 1);
    }
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <section className="py-24 sm:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FAF7F2] via-white to-[#FAF7F2] border-b border-[#DCC7AF]/60">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header with Verified Aggregate */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#1F1E1D] text-[10px] font-mono tracking-[0.25em] uppercase font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Direct Customer Experience</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1F1E1D] font-light leading-tight">
              Loved Across Australia —{" "}
              <span className="italic font-serif text-[#B86B4B]">Silhouettes in the Wild</span>
            </h2>

            <p className="font-serif italic text-sm sm:text-base text-[#78716A] leading-relaxed font-light">
              Real reflections from conscious women who wear our slow-crafted handloom pieces across warm Australian days and balmy coastal twilights.
            </p>
          </div>

          {/* Aggregate Rating Pill */}
          <div className="flex items-center gap-3 bg-white border border-[#DCC7AF] px-5 py-3 rounded-2xl shadow-sm self-start md:self-auto">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-[#C5A059] text-[#C5A059]" />
              ))}
            </div>
            <div className="text-left border-l border-[#DCC7AF]/60 pl-3">
              <span className="block font-serif text-sm font-semibold text-[#1F1E1D]">
                4.9 / 5.0 Rating
              </span>
              <span className="block text-[10px] font-mono text-[#78716A] uppercase tracking-wider">
                70+ Verified Buyers
              </span>
            </div>
          </div>
        </div>

        {/* 4 Shoppable Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {FEATURED_REVIEWS.map((review) => {
            const product = PRODUCTS.find((p) => p.id === review.productId);
            if (!product) return null;

            return (
              <div
                key={review.id}
                className="bg-white rounded-3xl p-6 border border-[#DCC7AF]/70 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_45px_rgba(0,0,0,0.08)] hover:border-[#C5A059] transition-all duration-300 flex flex-col justify-between space-y-6 group"
              >
                {/* Top: Star Rating + Verified Badge */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
                      ))}
                    </div>
                    {review.verified && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider text-[#3D5A40] bg-[#AFC8B1]/20 px-2 py-0.5 rounded-full font-semibold border border-[#AFC8B1]/40">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>

                  {/* Quote Title */}
                  <h4 className="font-serif text-base text-[#1F1E1D] font-medium leading-snug">
                    &ldquo;{review.quoteTitle}&rdquo;
                  </h4>

                  {/* Body */}
                  <p className="text-xs text-[#78716A] font-light leading-relaxed line-clamp-4">
                    {review.reviewText}
                  </p>
                </div>

                {/* Customer Info */}
                <div className="space-y-1 pt-3 border-t border-[#DCC7AF]/40">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-serif font-medium text-[#1F1E1D]">
                      {review.reviewerName}
                    </span>
                    <span className="text-[11px] font-sans text-[#78716A]">
                      {review.reviewerLocation}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#C5A059] block">
                    {review.fitText}
                  </span>
                </div>

                {/* Shoppable Product Card Footer (Converts Social Proof to Sale) */}
                <div className="bg-[#FAF7F2] rounded-2xl p-3 border border-[#DCC7AF]/60 flex items-center justify-between gap-3 group-hover:border-[#C5A059]/60 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-14 rounded-xl overflow-hidden bg-white flex-shrink-0 border border-[#DCC7AF]/40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/product/${product.id}`}
                        className="font-serif text-xs text-[#1F1E1D] hover:text-[#B86B4B] transition-colors truncate block font-medium"
                      >
                        {product.name}
                      </Link>
                      <span className="font-serif text-xs text-[#1F1E1D] font-semibold">
                        ${product.priceAud} AUD
                      </span>
                    </div>
                  </div>

                  {/* Direct Add or Inspect Button */}
                  <button
                    type="button"
                    onClick={() => handleQuickAdd(product)}
                    className="p-2.5 rounded-xl bg-[#1F1E1D] text-white hover:bg-[#C5A059] transition-all flex-shrink-0 cursor-pointer shadow-sm active:scale-95"
                    title="Quick add to bag"
                    aria-label={`Add ${product.name} to bag`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reassurance Line */}
        <div className="mt-12 text-center">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#78716A]">
            Every review is from an authentic Australian delivery • 30-Day Mindful Returns on all pieces
          </p>
        </div>

      </div>
    </section>
  );
}
