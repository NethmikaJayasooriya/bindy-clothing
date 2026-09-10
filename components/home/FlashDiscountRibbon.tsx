"use client";

import React, { useState } from "react";
import { Sparkles, Zap, Tag, Check, ArrowDownRight } from "lucide-react";
import { InfiniteRibbon } from "@/components/ui/infinite-ribbon";

interface FlashDiscountRibbonProps {
  promoCode?: string;
  onScrollToDeals?: () => void;
}

export default function FlashDiscountRibbon({
  promoCode = "SERENDIPITY50",
  onScrollToDeals,
}: FlashDiscountRibbonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(promoCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleScroll = () => {
    if (onScrollToDeals) {
      onScrollToDeals();
      return;
    }
    const el = document.getElementById("flash-privilege");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      onClick={handleScroll}
      className="relative w-full overflow-hidden cursor-pointer pt-14 pb-12 sm:pt-20 sm:pb-16 bg-gradient-to-b from-[#FAF7F2] via-[#1A1918] to-[#141312] select-none group"
      title="Click to explore Flash Privilege Archive deals"
    >
      {/* Ambient Lighting Behind Ribbons */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-36 bg-[radial-gradient(ellipse,rgba(197,160,89,0.25)_0%,transparent_70%)] blur-2xl pointer-events-none" />

      <div className="relative w-full py-2 space-y-4 sm:space-y-5">
        {/* ========================================================================= */}
        {/* RIBBON 1: LUXURY NOIR OBSIDIAN BANNER (Tilted +1.5 deg, Slow Smooth Crawl) */}
        {/* ========================================================================= */}
        <div className="relative z-10 my-1.5 sm:my-2 transform hover:scale-[1.01] transition-transform duration-300">
          <InfiniteRibbon
            duration={72}
            rotation={1.5}
            repeat={4}
            className="bg-[#121110] text-[#FAF7F2] py-2.5 sm:py-3.5 border-y border-[#C5A059]/40 shadow-[0_14px_40px_rgba(0,0,0,0.7)]"
          >
            <div className="flex items-center space-x-6 sm:space-x-8 px-4 text-xs sm:text-sm font-mono uppercase tracking-[0.22em]">
              <span className="inline-flex items-center gap-1.5 text-[#C5A059] font-bold">
                <Zap className="w-3.5 h-3.5 fill-[#C5A059] animate-pulse" />
                <span>24-HOUR FLASH ARCHIVE</span>
              </span>

              <span className="text-white/40">✦</span>

              <span className="text-white font-medium">
                UP TO <strong className="text-[#C5A059] font-serif font-bold text-base sm:text-lg">50% OFF</strong> SILHOUETTES
              </span>

              <span className="text-white/40">✦</span>

              {/* Interactive Copy Pill in Ribbon */}
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-[#C5A059] hover:text-black border border-[#C5A059]/50 transition-all duration-200 cursor-pointer text-[10px] sm:text-xs font-mono font-bold"
                title="Click to copy promo code"
              >
                <Tag className="w-3 h-3 text-[#C5A059] group-hover:text-black" />
                <span>CODE: {promoCode}</span>
                {copied ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : null}
              </button>

              <span className="text-white/40">✦</span>

              <span className="text-[#DCC7AF]">
                RARE WEAVER DYE-LOT YARDAGE
              </span>

              <span className="text-white/40">✦</span>

              <span className="text-white/85">
                FREE AU COURIER OVER $150
              </span>

              <span className="text-white/40">✦</span>
            </div>
          </InfiniteRibbon>
        </div>

        {/* ========================================================================= */}
        {/* RIBBON 2: RADIANT CHAMPAGNE GOLD BANNER (Tilted -1.8 deg, Slow Reverse Run) */}
        {/* ========================================================================= */}
        <div className="relative z-20 my-1.5 sm:my-2 transform hover:scale-[1.01] transition-transform duration-300">
          <InfiniteRibbon
            duration={64}
            reverse={true}
            rotation={-1.8}
            repeat={4}
            className="bg-gradient-to-r from-[#C5A059] via-[#E2C37E] to-[#C5A059] text-[#141312] py-2 sm:py-3 shadow-[0_18px_48px_rgba(197,160,89,0.38)] border-y border-[#FFFFFF]/40"
          >
            <div className="flex items-center space-x-6 sm:space-x-8 px-4 text-xs sm:text-sm font-serif font-bold uppercase tracking-[0.25em]">
              <span className="inline-flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 fill-[#141312]" />
                <span>LIMITED ARCHIVE PRIVILEGE</span>
              </span>

              <span className="opacity-40">★</span>

              <span className="tracking-widest">
                SAVE UP TO $65 AUD PER PIECE
              </span>

              <span className="opacity-40">★</span>

              <span className="font-mono text-[11px] sm:text-xs font-bold tracking-wider px-2 py-0.5 rounded bg-black/15">
                AUSTRALIAN DIRECT DISPATCH
              </span>

              <span className="opacity-40">★</span>

              <span>HANDLOOM COTTON VOILE & BIAS SILK</span>

              <span className="opacity-40">★</span>

              <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-mono font-bold underline underline-offset-2">
                <span>SHOP DEALS</span>
                <ArrowDownRight className="w-3.5 h-3.5" />
              </span>

              <span className="opacity-40">★</span>
            </div>
          </InfiniteRibbon>
        </div>
      </div>
    </div>
  );
}
