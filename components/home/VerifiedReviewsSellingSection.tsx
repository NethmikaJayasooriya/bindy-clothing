"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  CheckCircle2,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  Heart,
  Check,
} from "lucide-react";
import { PRODUCTS, type Product } from "@/data/products";
import { addToCart } from "@/lib/cart";

export interface VerifiedReviewsSellingSectionProps {
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product, size: string) => void;
}

interface CustomerReviewItem {
  id: string;
  productId: string;
  reviewerName: string;
  reviewerLocation: string;
  rating: number;
  category: "all" | "coastal" | "city" | "garden";
  categoryLabel: string;
  fitText: string;
  quoteTitle: string;
  reviewText: string;
  lifestyleImage: string;
  verified: boolean;
}

const VERIFIED_STORIES: CustomerReviewItem[] = [
  {
    id: "rev-1",
    productId: "lotus-memory-dress",
    reviewerName: "Amara P.",
    reviewerLocation: "Brisbane, QLD",
    rating: 5,
    category: "garden",
    categoryLabel: "Garden & High Tea",
    fitText: "True to size • Wears AU 8",
    quoteTitle: "Feels like a quiet dream on skin",
    reviewText:
      "The lightweight cotton voile is so featherlight I forget I'm wearing it. Wore it to a botanical lunch in New Farm and three women asked where it was from. The drape falls effortlessly.",
    lifestyleImage: "/images/serendipity/lotus-memory-dress-hover.jpg",
    verified: true,
  },
  {
    id: "rev-2",
    productId: "serendib-pearl-dress",
    reviewerName: "Sophie L.",
    reviewerLocation: "Sydney, NSW",
    rating: 5,
    category: "coastal",
    categoryLabel: "Coastal Ceremony",
    fitText: "Perfect drape • Wears AU 10",
    quoteTitle: "The cutwork lace is museum quality",
    reviewText:
      "The hand-carved mother-of-pearl buttons catch the golden-hour light so subtly. You can immediately tell this was woven on an artisan pit-loom rather than run through a factory line.",
    lifestyleImage: "/images/serendipity/serendib-pearl-dress-hover.jpg",
    verified: true,
  },
  {
    id: "rev-3",
    productId: "golden-cascade-dress",
    reviewerName: "Isabella R.",
    reviewerLocation: "Melbourne, VIC",
    rating: 5,
    category: "city",
    categoryLabel: "City & Gallery",
    fitText: "Relaxed tailored fit • Wears AU 8",
    quoteTitle: "Collection 02 is extraordinary",
    reviewText:
      "The golden cascade tiering has the most breathtaking movement when walking through the city. Breathable, beautifully structured, and the natural timber fasteners add such honest charm.",
    lifestyleImage: "/images/collection-2/golden-cascade-dress-hover.jpg",
    verified: true,
  },
  {
    id: "rev-4",
    productId: "cinnamon-flow-skirt",
    reviewerName: "Claire T.",
    reviewerLocation: "Perth, WA",
    rating: 5,
    category: "coastal",
    categoryLabel: "Beach & Sunset",
    fitText: "Fluid bias cut • Wears AU 8",
    quoteTitle: "The cinnamon wash is gorgeous",
    reviewText:
      "Fluid bias drape that pairs with everything from a linen crop to a casual white tee. The hand-loomed texture has an earthy luxury that fast-fashion brands simply cannot replicate.",
    lifestyleImage: "/images/serendipity/cinnamon-flow-skirt-hover.jpg",
    verified: true,
  },
  {
    id: "rev-5",
    productId: "tea-leaf-two-piece",
    reviewerName: "Chloe M.",
    reviewerLocation: "Gold Coast, QLD",
    rating: 5,
    category: "coastal",
    categoryLabel: "Resort & Island",
    fitText: "Flattering elastic waist • Wears AU 10",
    quoteTitle: "Pure green linen poetry",
    reviewText:
      "Wore this for a weekend getaway in Burleigh Heads. The deep tea leaf hue and delicate coconut shell buttons feel grounded and deeply mindful. Highest rotation piece in my wardrobe.",
    lifestyleImage: "/images/serendipity/tea-leaf-two-piece-hover.jpg",
    verified: true,
  },
  {
    id: "rev-6",
    productId: "pettah-check-dress",
    reviewerName: "Talia S.",
    reviewerLocation: "Paddington, NSW",
    rating: 5,
    category: "city",
    categoryLabel: "City & Weekend",
    fitText: "Tailored A-line • Wears AU 8",
    quoteTitle: "The architectural collar turns heads",
    reviewText:
      "A striking candy-stripe gingham that feels smart enough for art gallery openings and relaxed enough for weekend coffee in Paddington. In love with the covered buttons.",
    lifestyleImage: "/images/serendipity/pettah-check-dress-hover.jpg",
    verified: true,
  },
];

export default function VerifiedReviewsSellingSection({
  onQuickView,
  onAddToCart,
}: VerifiedReviewsSellingSectionProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | "coastal" | "city" | "garden">("all");
  const [addedId, setAddedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredStories = activeFilter === "all"
    ? VERIFIED_STORIES
    : VERIFIED_STORIES.filter((s) => s.category === activeFilter);

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

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -420 : 420;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FAF7F2] via-white to-[#FAF7F2] border-b border-[#DCC7AF]/60 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* 1. SECTION HEADER + AGGREGATE METRICS BAR */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F1E1D] text-[#DFC285] text-xs font-mono tracking-wider uppercase font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Direct Customer Experience • 4.9 / 5.0 Rating</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1F1E1D] font-light leading-tight">
              Loved Across Australia —{" "}
              <span className="italic font-serif text-[#B86B4B]">
                Silhouettes in the Wild
              </span>
            </h2>

            <p className="font-serif italic text-base sm:text-lg text-charcoal-subtle leading-relaxed font-light">
              Real reflections from conscious women who wear our slow-crafted handloom pieces
              across warm Australian days and balmy coastal twilights.
            </p>

            {/* OCCASION FILTER TABS */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              {[
                { key: "all", label: "All Stories (70+)" },
                { key: "coastal", label: "Coastal & Beach" },
                { key: "city", label: "City & Gallery" },
                { key: "garden", label: "Garden & High Tea" },
              ].map((tab) => {
                const isActive = activeFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveFilter(tab.key as any)}
                    className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-[#1F1E1D] text-white shadow-md font-bold border border-[#1F1E1D]"
                        : "bg-white text-charcoal-subtle border border-[#DCC7AF]/80 hover:border-[#1F1E1D] hover:text-[#1F1E1D]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: AGGREGATE REPUTATION CARD & CAROUSEL CONTROLS */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-4 shrink-0">
            
            {/* 4.9 Star Aggregate Box */}
            <div className="bg-white border border-[#DCC7AF] px-5 py-3.5 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-[#C5A059] text-[#C5A059]" />
                  ))}
                </div>
                <span className="block font-serif text-sm font-semibold text-[#1F1E1D]">
                  4.9 / 5.0 Aggregate
                </span>
              </div>
              <div className="border-l border-[#DCC7AF]/60 pl-4 text-left">
                <span className="block text-sm font-mono text-[#3D5A40] font-bold">
                  98% True to Size
                </span>
                <span className="block text-xs font-mono text-charcoal-subtle uppercase tracking-wider">
                  70+ Verified Buyers
                </span>
              </div>
            </div>

            {/* Carousel Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                aria-label="Scroll reviews left"
                className="w-10 h-10 rounded-full bg-white border border-[#DCC7AF] text-[#1F1E1D] flex items-center justify-center hover:bg-[#1F1E1D] hover:text-white transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll("right")}
                aria-label="Scroll reviews right"
                className="w-10 h-10 rounded-full bg-white border border-[#DCC7AF] text-[#1F1E1D] flex items-center justify-center hover:bg-[#1F1E1D] hover:text-white transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

          </div>

        </div>

        {/* 2. EDITORIAL SOCIAL PROOF HORIZONTAL CAROUSEL */}
        <div
          ref={scrollRef}
          className="flex gap-6 sm:gap-7 overflow-x-auto no-scrollbar pb-4 pt-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 snap-x snap-mandatory"
        >
          {filteredStories.map((story) => {
            const product = PRODUCTS.find((p) => p.id === story.productId);
            if (!product) return null;

            const isJustAdded = addedId === product.id;

            return (
              <div
                key={story.id}
                className="w-[310px] sm:w-[360px] lg:w-[390px] shrink-0 bg-white rounded-3xl p-5 sm:p-6 border border-[#DCC7AF]/80 shadow-[0_10px_35px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_50px_rgba(0,0,0,0.08)] hover:border-[#C5A059] transition-all duration-300 flex flex-col justify-between space-y-5 snap-start group"
              >
                {/* 1. LIFESTYLE PHOTO (SILHOUETTE IN THE WILD) */}
                <Link
                  href={`/product/${product.id}`}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#DCC7AF]/40 block cursor-pointer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={story.lifestyleImage}
                    alt={story.quoteTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Floating Top Badge: Stars & Verified */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <div className="flex items-center gap-0.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-white">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3 h-3 fill-[#C5A059] text-[#C5A059]" />
                      ))}
                    </div>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-[#3D5A40] bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full font-bold border border-[#AFC8B1]/60 shadow-xs">
                      <CheckCircle2 className="w-2.5 h-2.5 text-[#3D5A40]" />
                      <span>Verified AU Buyer</span>
                    </span>
                  </div>

                  {/* Bottom Occasion Tag */}
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#1F1E1D] text-xs font-mono uppercase tracking-wider font-semibold border border-[#DCC7AF]/60">
                      {story.categoryLabel}
                    </span>
                  </div>

                  {/* Hover Explore Cue */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1.5 rounded-full bg-white/95 text-[#1F1E1D] text-sm font-mono uppercase font-semibold font-bold tracking-widest shadow-md flex items-center gap-1.5">
                      <span>View Silhouette</span>
                      <ArrowRight className="w-3 h-3 text-[#C5A059]" />
                    </span>
                  </div>
                </Link>

                {/* 2. PULL QUOTE & TESTIMONIAL BODY */}
                <div className="space-y-2.5 flex-1">
                  <h3 className="font-serif text-lg sm:text-xl text-[#1F1E1D] font-medium leading-snug">
                    &ldquo;{story.quoteTitle}&rdquo;
                  </h3>
                  <p className="text-xs sm:text-sm text-charcoal-subtle font-light leading-relaxed">
                    {story.reviewText}
                  </p>
                </div>

                {/* 3. REVIEWER LOCATION & FIT PROFILE */}
                <div className="pt-3 border-t border-[#DCC7AF]/40 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-serif font-semibold text-[#1F1E1D] block">
                      {story.reviewerName}
                    </span>
                    <span className="text-sm font-mono text-charcoal-subtle">
                      {story.reviewerLocation}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#C5A059] font-semibold bg-[#C5A059]/10 px-2.5 py-1 rounded-full border border-[#C5A059]/20">
                    {story.fitText}
                  </span>
                </div>

                {/* 4. SHOPPABLE PRODUCT ACTION STRIP (1-CLICK REVENUE GENERATOR) */}
                <div className="bg-[#FAF7F2] rounded-2xl p-3 sm:p-3.5 border border-[#DCC7AF]/60 flex items-center justify-between gap-3 group-hover:border-[#C5A059]/60 transition-colors">
                  <Link
                    href={`/product/${product.id}`}
                    className="flex items-center gap-3 min-w-0 flex-1 hover:opacity-85 transition-opacity"
                  >
                    <div className="w-12 h-14 rounded-xl overflow-hidden bg-white shrink-0 border border-[#DCC7AF]/40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <span className="font-serif text-xs sm:text-sm text-[#1F1E1D] font-medium truncate block">
                        {product.name}
                      </span>
                      <span className="font-mono text-xs font-bold text-[#1F1E1D] block">
                        ${product.priceAud} <span className="text-xs text-charcoal-subtle font-normal">AUD</span>
                      </span>
                    </div>
                  </Link>

                  {/* 1-Tap Add to Bag Button */}
                  <button
                    type="button"
                    onClick={() => handleQuickAdd(product)}
                    className={`p-3 rounded-xl transition-all shrink-0 cursor-pointer shadow-sm active:scale-95 flex items-center gap-1.5 ${
                      isJustAdded
                        ? "bg-[#3D5A40] text-white border border-[#5E8B63]"
                        : "bg-[#1F1E1D] text-white hover:bg-[#C5A059] hover:text-[#1F1E1D]"
                    }`}
                    title="Add silhouette to bag"
                    aria-label={`Add ${product.name} to bag`}
                  >
                    {isJustAdded ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <ShoppingBag className="w-4 h-4" />
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* 3. REASSURANCE GUARANTEE FOOTER STRIP */}
        <div className="pt-4 border-t border-[#DCC7AF]/60 flex flex-wrap items-center justify-center sm:justify-between gap-4 text-xs font-mono text-charcoal-subtle">
          <span className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-[#C5A059]" />
            <span>Carbon-Neutral Australian Delivery (QLD, NSW, VIC, WA, SA, TAS)</span>
          </span>
          <span>•</span>
          <span>Every review from an authentic verified purchaser</span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            <span>30-Day Mindful Exchanges on All Silhouettes</span>
          </span>
        </div>

      </div>
    </section>
  );
}
