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
  Flame,
  Tag,
  Eye,
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
}

const FLASH_DEALS: FlashDealItem[] = [
  {
    productId: "lotus-memory-dress",
    flashPriceAud: 185,
    originalPriceAud: 240,
    stockLeft: 4,
    totalAllotment: 24,
    badge: "SAVE $55 AUD",
  },
  {
    productId: "serendib-pearl-dress",
    flashPriceAud: 245,
    originalPriceAud: 310,
    stockLeft: 3,
    totalAllotment: 18,
    badge: "SAVE $65 AUD",
  },
  {
    productId: "cinnamon-flow-skirt",
    flashPriceAud: 160,
    originalPriceAud: 210,
    stockLeft: 5,
    totalAllotment: 20,
    badge: "SAVE $50 AUD",
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
    // Create custom product instance with the promotional archive price
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
    setTimeout(() => setAddedItem(null), 2200);
  };

  return (
    <section className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FAF7F2] via-[#F4EFE6]/80 to-[#FAF7F2] border-y border-[#DCC7AF]/60 overflow-hidden">
      
      {/* Subtle Background Glow Rings */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#B86B4B]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* SECTION HEADER WITH LIVE COUNTDOWN */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          
          {/* Left Title Area */}
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B86B4B]/10 border border-[#B86B4B]/30 text-[#B86B4B] text-[11px] font-mono tracking-widest uppercase font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#B86B4B] animate-ping" />
              <Zap className="w-3.5 h-3.5" />
              <span>Limited 24-Hour Archive Window</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1F1E1D] font-normal leading-tight">
              Curated Flash <span className="italic font-serif text-[#C5A059]">Privilege</span>
            </h2>

            <p className="font-serif italic text-sm sm:text-base text-[#78716A] leading-relaxed">
              Rare seasonal privileges on our most loved handloom silhouettes. Limited to current weaver dye-lot yardage before entering our permanent archive.
            </p>
          </div>

          {/* Right: Modern Luxury Countdown Clock */}
          <div className="bg-white/90 backdrop-blur-md border border-[#DCC7AF] rounded-3xl p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] self-start lg:self-auto">
            <div className="flex items-center space-x-2 text-[11px] font-mono uppercase tracking-widest text-[#78716A] mb-3">
              <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Window Concludes In</span>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Hours */}
              <div className="flex flex-col items-center">
                <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-[#1F1E1D] text-white flex items-center justify-center font-serif text-2xl sm:text-3xl font-medium shadow-md">
                  {formatDigit(timeLeft.hours)}
                </div>
                <span className="text-[9px] font-mono tracking-widest uppercase text-[#78716A] mt-1.5">
                  Hours
                </span>
              </div>

              <span className="font-serif text-2xl text-[#C5A059] -mt-5 font-bold">:</span>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-[#1F1E1D] text-white flex items-center justify-center font-serif text-2xl sm:text-3xl font-medium shadow-md">
                  {formatDigit(timeLeft.minutes)}
                </div>
                <span className="text-[9px] font-mono tracking-widest uppercase text-[#78716A] mt-1.5">
                  Mins
                </span>
              </div>

              <span className="font-serif text-2xl text-[#C5A059] -mt-5 font-bold">:</span>

              {/* Seconds */}
              <div className="flex flex-col items-center">
                <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-[#C5A059] text-white flex items-center justify-center font-serif text-2xl sm:text-3xl font-medium shadow-md">
                  {formatDigit(timeLeft.seconds)}
                </div>
                <span className="text-[9px] font-mono tracking-widest uppercase text-[#78716A] mt-1.5">
                  Secs
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FLASH DEAL GARMENT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
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
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className="bg-white border border-[#DCC7AF]/70 rounded-3xl p-5 sm:p-6 shadow-[0_4px_25px_rgba(0,0,0,0.04)] flex flex-col justify-between relative group"
              >
                {/* Floating Discount Ribbon */}
                <div className="absolute top-8 left-8 z-20 flex flex-col gap-1.5">
                  <span className="px-3 py-1 rounded-full bg-[#1F1E1D] text-white text-[10px] font-mono tracking-wider uppercase font-bold shadow-md">
                    {deal.badge}
                  </span>
                </div>

                {/* Garment Image Area with Hover Zoom */}
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#FAF7F2] mb-5 border border-[#DCC7AF]/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Quick View Button on Image */}
                  <button
                    type="button"
                    onClick={() => onQuickView && onQuickView(product)}
                    className="absolute bottom-3 right-3 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-[#1F1E1D] hover:text-[#C5A059] shadow-md transition-all opacity-0 group-hover:opacity-100"
                    title="Quick inspect"
                    aria-label="Quick View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Garment Details */}
                <div className="space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-medium">
                      {product.story}
                    </p>
                    <Link
                      href={`/product/${product.id}`}
                      className="font-serif text-lg sm:text-xl text-[#1F1E1D] hover:text-[#C5A059] transition-colors block mt-0.5 line-clamp-1 font-medium"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-[#78716A] line-clamp-1 mt-0.5">
                      {product.fabric} • {product.colorName}
                    </p>
                  </div>

                  {/* Pricing Comparison */}
                  <div className="flex items-baseline space-x-3 pt-1">
                    <span className="font-serif text-2xl sm:text-3xl font-medium text-[#1F1E1D]">
                      ${deal.flashPriceAud} AUD
                    </span>
                    <span className="font-serif text-base text-[#78716A] line-through">
                      ${deal.originalPriceAud} AUD
                    </span>
                  </div>

                  {/* Scarcity Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-red-700 font-semibold flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 fill-red-700" />
                        <span>Only {deal.stockLeft} left</span>
                      </span>
                      <span className="text-[#78716A]">{percentSold}% claimed</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#FAF7F2] border border-[#DCC7AF]/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#C5A059] to-[#B86B4B] rounded-full transition-all duration-500"
                        style={{ width: `${percentSold}%` }}
                      />
                    </div>
                  </div>

                  {/* Size Selector Pills */}
                  <div className="pt-2 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716A]">
                        Select Size:
                      </span>
                      <span className="text-[10px] font-mono text-[#C5A059] font-medium">
                        {selectedSize}
                      </span>
                    </div>
                    <div className="grid grid-cols-5 gap-1">
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
                            className={`py-2 text-xs font-mono rounded-xl border text-center transition-all ${
                              isChosen
                                ? "border-[#1F1E1D] bg-[#1F1E1D] text-white shadow-sm font-bold"
                                : "border-[#DCC7AF]/60 bg-[#FAF7F2] text-[#78716A] hover:border-[#1F1E1D] hover:text-[#1F1E1D]"
                            }`}
                          >
                            AU {shortName}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleClaimDeal(deal, product)}
                      className={`w-full py-3.5 rounded-full font-mono text-xs uppercase tracking-widest font-medium transition-all duration-300 shadow-md flex items-center justify-center space-x-2 ${
                        addedItem === deal.productId
                          ? "bg-[#AFC8B1] text-[#2E4A32]"
                          : "bg-[#1F1E1D] text-white hover:bg-[#C5A059]"
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

        {/* BOTTOM GUARANTEE REASSURANCE */}
        <div className="mt-12 pt-6 border-t border-[#DCC7AF]/50 flex flex-wrap items-center justify-around gap-4 text-xs font-mono uppercase tracking-wider text-[#78716A]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            <span>Complimentary Carbon-Neutral AU Shipping</span>
          </span>
          <span className="hidden sm:inline text-[#DCC7AF]">•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#C5A059]" />
            <span>30-Day Easy Australian Returns</span>
          </span>
          <span className="hidden sm:inline text-[#DCC7AF]">•</span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span>100% Ethical Small-Batch Handloom</span>
          </span>
        </div>

      </div>
    </section>
  );
}
