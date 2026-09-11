"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Check,
  ShieldCheck,
  Zap,
  Tag,
  Eye,
  Lock,
  Layers,
} from "lucide-react";
import { PRODUCTS, type Product } from "@/data/products";
import { addToCart } from "@/lib/cart";

interface FlashArchiveSectionProps {
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product, size: string) => void;
}

interface FlashDealItem {
  productId: string;
  flashPriceAud: number;
  originalPriceAud: number;
  stockLeft: number;
  totalAllotment: number;
  badge: string;
  artisanNote: string;
}

const FLASH_DEALS: FlashDealItem[] = [
  {
    productId: "lotus-memory-dress",
    flashPriceAud: 185,
    originalPriceAud: 240,
    stockLeft: 4,
    totalAllotment: 24,
    badge: "SAVE $55 AUD",
    artisanNote: "Handloom Cotton • Madder Root Dye",
  },
  {
    productId: "serendib-pearl-dress",
    flashPriceAud: 245,
    originalPriceAud: 310,
    stockLeft: 3,
    totalAllotment: 18,
    badge: "SAVE $65 AUD",
    artisanNote: "Silk-Cotton Pit-Loom • Pearl Fasteners",
  },
  {
    productId: "cinnamon-flow-skirt",
    flashPriceAud: 160,
    originalPriceAud: 210,
    stockLeft: 5,
    totalAllotment: 20,
    badge: "SAVE $50 AUD",
    artisanNote: "Botanical Cinnamon Wash • Tiered Hem",
  },
];

export default function FlashArchiveSection({
  onQuickView,
  onAddToCart,
}: FlashArchiveSectionProps) {
  // 14 hours countdown simulation that updates every second
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 32,
    seconds: 45,
  });

  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({
    "lotus-memory-dress": "AU 8 (S)",
    "serendib-pearl-dress": "AU 8 (S)",
    "cinnamon-flow-skirt": "AU 8 (S)",
  });

  const [addedItem, setAddedItem] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 14, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDigit = (num: number) => String(num).padStart(2, "0");

  const handleClaimDeal = (deal: FlashDealItem, originalProduct: Product) => {
    const size = selectedSizes[deal.productId] || "AU 8 (S)";
    const dealProduct: Product = {
      ...originalProduct,
      priceAud: deal.flashPriceAud,
    };

    if (onAddToCart) {
      onAddToCart(dealProduct, size);
    } else {
      addToCart(dealProduct, size, 1);
    }

    setAddedItem(deal.productId);
    setTimeout(() => setAddedItem(null), 2400);
  };

  return (
    <section
      id="flash-privilege"
      className="relative py-24 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#0E0D0C] text-white border-y border-[#C5A059]/30 overflow-hidden"
    >
      {/* Editorial Ambient Spotlight Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-[#C5A059]/15 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[450px] h-[450px] bg-[#B86B4B]/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Decorative Golden Stitched Hairline Accents */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C5A059]/25 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* SECTION HEADER & HAUTE HORLOGERIE COUNTDOWN */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 sm:gap-10 mb-16">
          {/* Left Title Area */}
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-[#C5A059]/50 text-[#C5A059] text-[10px] font-mono tracking-[0.25em] uppercase font-semibold shadow-sm backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
              <Lock className="w-3 h-3 text-[#C5A059]" />
              <span>Curated Flash Privilege • Private Vault</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-light tracking-tight leading-[1.15]">
              Limited 24-Hour{" "}
              <span className="italic font-serif text-[#C5A059]">Archive Window</span>
            </h2>

            <p className="font-serif italic text-sm sm:text-base text-[#DCC7AF]/85 leading-relaxed font-light max-w-xl">
              Rare seasonal privileges on our most loved handloom silhouettes. Limited to current weaver dye-lot yardage before entering our permanent archive.
            </p>
          </div>

          {/* Right: Haute Horlogerie Countdown Display */}
          <div className="relative self-start lg:self-auto group">
            {/* Ambient Gold Halo */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#C5A059]/30 via-[#B86B4B]/20 to-[#C5A059]/30 rounded-3xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative bg-[#151412]/95 backdrop-blur-2xl border border-[#C5A059]/50 rounded-3xl p-5 sm:p-6 shadow-[0_16px_50px_rgba(0,0,0,0.8)] ring-1 ring-white/10 min-w-[280px] sm:min-w-[340px]">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A059] font-bold">
                  <Clock className="w-3.5 h-3.5 text-[#C5A059] animate-spin-slow" />
                  <span>Window Concludes In</span>
                </div>
                <span className="text-[9px] font-mono text-[#DCC7AF]/60 uppercase tracking-widest">
                  Live Allotment
                </span>
              </div>

              {/* Sculptural Digits with Separator Columns */}
              <div className="flex items-center justify-center space-x-2 sm:space-x-3.5">
                {/* Hours */}
                <div className="flex flex-col items-center">
                  <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-[#C5A059]/40 text-white flex items-center justify-center font-serif text-2xl sm:text-3xl font-light shadow-inner">
                    <span className="tracking-tight font-serif">{formatDigit(timeLeft.hours)}</span>
                  </div>
                  <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-[#DCC7AF]/70 mt-2 font-medium">
                    Hours
                  </span>
                </div>

                <span className="font-serif text-2xl text-[#C5A059]/80 -mt-6 font-light select-none">
                  :
                </span>

                {/* Minutes */}
                <div className="flex flex-col items-center">
                  <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-[#C5A059]/40 text-white flex items-center justify-center font-serif text-2xl sm:text-3xl font-light shadow-inner">
                    <span className="tracking-tight font-serif">{formatDigit(timeLeft.minutes)}</span>
                  </div>
                  <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-[#DCC7AF]/70 mt-2 font-medium">
                    Mins
                  </span>
                </div>

                <span className="font-serif text-2xl text-[#C5A059]/80 -mt-6 font-light select-none">
                  :
                </span>

                {/* Seconds */}
                <div className="flex flex-col items-center">
                  <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-gradient-to-b from-[#C5A059]/25 to-[#C5A059]/10 border border-[#C5A059]/70 text-[#FCEAC7] flex items-center justify-center font-serif text-2xl sm:text-3xl font-medium shadow-inner ring-1 ring-[#C5A059]/40">
                    <span className="tracking-tight font-serif">{formatDigit(timeLeft.seconds)}</span>
                  </div>
                  <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-[#C5A059] mt-2 font-bold">
                    Secs
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COUTURE ARCHIVE SHOWCASE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 sm:gap-8">
          {FLASH_DEALS.map((deal) => {
            const product = PRODUCTS.find((p) => p.id === deal.productId);
            if (!product) return null;

            const selectedSize = selectedSizes[deal.productId] || "AU 8 (S)";
            const percentSold = Math.round(
              ((deal.totalAllotment - deal.stockLeft) / deal.totalAllotment) * 100
            );

            return (
              <motion.div
                key={deal.productId}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="relative bg-[#161513]/90 backdrop-blur-xl border border-[#C5A059]/25 hover:border-[#C5A059]/80 rounded-[30px] p-5 sm:p-6 transition-all duration-500 hover:shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_35px_rgba(197,160,89,0.18)] flex flex-col justify-between group overflow-hidden"
              >
                {/* Subtle Ambient Hover Sheen */}
                <div className="absolute -top-28 -right-28 w-56 h-56 bg-[#C5A059]/10 rounded-full blur-3xl group-hover:bg-[#C5A059]/20 transition-all duration-700 pointer-events-none" />

                {/* Floating Archive Badge */}
                <div className="absolute top-8 left-8 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121110]/85 backdrop-blur-md border border-[#C5A059]/60 text-[#C5A059] text-[10px] font-mono tracking-wider uppercase font-bold shadow-lg">
                  <Sparkles className="w-3 h-3 text-[#C5A059]" />
                  <span>{deal.badge}</span>
                </div>

                {/* Garment Image with Dual-Image Smooth Crossfade on Hover */}
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#1D1C1A] mb-5 border border-white/10 group-hover:border-[#C5A059]/40 transition-colors">
                  {/* Primary Image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-0"
                  />

                  {/* Secondary Image Reveal on Hover */}
                  {product.imageHover && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.imageHover}
                      alt={`${product.name} alternate`}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:scale-105"
                    />
                  )}

                  {/* Quick Inspect Button */}
                  <button
                    type="button"
                    onClick={() => onQuickView && onQuickView(product)}
                    className="absolute bottom-3.5 right-3.5 p-2.5 rounded-full bg-[#121110]/85 backdrop-blur-md text-white hover:text-[#C5A059] border border-white/20 hover:border-[#C5A059] shadow-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                    title="Quick inspect"
                    aria-label="Quick View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Garment Details & Editorial Hierarchy */}
                <div className="space-y-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#C5A059]/90 font-medium">
                      <span>{product.storyPlace || "Artisan Atelier"}</span>
                      <span className="text-[#DCC7AF]/50">•</span>
                      <span className="truncate max-w-[140px] text-[#DCC7AF]/70">
                        {deal.artisanNote}
                      </span>
                    </div>

                    <Link
                      href={`/product/${product.id}`}
                      className="font-serif text-xl sm:text-2xl text-white group-hover:text-[#F3E5C8] transition-colors block mt-1 font-light leading-snug tracking-tight"
                    >
                      {product.name}
                    </Link>

                    <p className="text-xs text-[#DCC7AF]/75 line-clamp-1 mt-0.5 font-light">
                      {product.fabric} • {product.colorName}
                    </p>
                  </div>

                  {/* Pricing Comparison */}
                  <div className="flex items-baseline space-x-3 pt-1 border-t border-white/10">
                    <span className="font-serif text-2xl sm:text-3xl font-normal text-white">
                      ${deal.flashPriceAud}{" "}
                      <span className="text-xs font-mono text-[#C5A059] tracking-wider uppercase font-semibold">
                        AUD
                      </span>
                    </span>
                    <span className="font-serif text-base text-[#DCC7AF]/50 line-through">
                      ${deal.originalPriceAud} AUD
                    </span>
                  </div>

                  {/* Scarcity / Weaver Dye-Lot Yardage Meter */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#C5A059] font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
                        <span>Reserve: Only {deal.stockLeft} Unallocated</span>
                      </span>
                      <span className="text-[#DCC7AF]/60 text-[10px] uppercase tracking-wider">
                        {percentSold}% Claimed
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#C5A059] via-[#E2C78E] to-[#B86B4B] rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${percentSold}%` }}
                      />
                    </div>
                  </div>

                  {/* Tailor Size Selector Chips */}
                  <div className="pt-2 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#DCC7AF]/70">
                        Tailor Size:
                      </span>
                      <span className="text-[10px] font-mono text-[#C5A059] font-semibold">
                        {selectedSize}
                      </span>
                    </div>
                    <div className="grid grid-cols-5 gap-1.5">
                      {product.sizes.map((sz) => {
                        const isChosen = selectedSize === sz;
                        const shortName = sz.replace("AU ", "").split(" ")[0];
                        return (
                          <button
                            key={sz}
                            type="button"
                            onClick={() =>
                              setSelectedSizes((p) => ({ ...p, [deal.productId]: sz }))
                            }
                            className={`py-2 text-[11px] font-mono rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                              isChosen
                                ? "border-[#C5A059] bg-[#C5A059] text-[#121110] font-bold shadow-[0_0_15px_rgba(197,160,89,0.35)]"
                                : "border-white/15 bg-white/[0.04] text-[#DCC7AF]/80 hover:border-[#C5A059]/60 hover:text-white"
                            }`}
                          >
                            AU {shortName}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* High-Fashion Claim Action Button */}
                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={() => handleClaimDeal(deal, product)}
                      className={`w-full py-3.5 rounded-full font-mono text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 shadow-lg flex items-center justify-center space-x-2 cursor-pointer ${
                        addedItem === deal.productId
                          ? "bg-[#3D5A40] text-white border border-[#5E8B63]"
                          : "bg-gradient-to-r from-[#C5A059] via-[#DFC285] to-[#C5A059] text-[#121110] hover:brightness-110 hover:shadow-[0_8px_30px_rgba(197,160,89,0.4)] active:scale-[0.98]"
                      }`}
                    >
                      {addedItem === deal.productId ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Privilege Added to Bag</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Claim Flash Privilege</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* BOTTOM PRIVATE ARCHIVE GUARANTEES */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-wrap items-center justify-around gap-5 text-xs font-mono uppercase tracking-[0.16em] text-[#DCC7AF]/80">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            <span>Handloom Guild Authenticity Certified</span>
          </span>
          <span className="hidden sm:inline text-white/20">•</span>
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#C5A059]" />
            <span>Complimentary Carbon-Neutral AU Shipping</span>
          </span>
          <span className="hidden sm:inline text-white/20">•</span>
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span>30-Day Mindful Regional Returns</span>
          </span>
        </div>
      </div>
    </section>
  );
}

