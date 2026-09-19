"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, Layers, ZoomIn, Film, BookOpen, SlidersHorizontal, Tag, ArrowUp, CheckCircle2 } from "lucide-react";
import { HERO_STYLES } from "@/components/heroes/HeroSwitcherBar";

export interface HeroStyleControlSectionProps {
  currentStyle: number;
  onSelectStyle: (styleId: number) => void;
  onScrollToHero?: () => void;
}

const HERO_PREVIEWS: Record<number, { image: string; tag: string }> = {
  1: { image: "/images/new-hero/hero-beach-1.jpg", tag: "30-Slice 3D Perspective" },
  2: { image: "/images/serendipity/cinnamon-flow-skirt-full.jpg", tag: "Interactive Weave Magnifier" },
  3: { image: "/images/new-hero/hero-beach-2.jpg", tag: "Kinetic Cinema Filmstrip" },
  4: { image: "/images/creator photo with bg/dilrukshi.jpeg", tag: "Artisan Moodboard Scrapbook" },
  5: { image: "/images/detail/ocean-embraced-tiered-dress-b.jpg", tag: "Botanical vs Runway Curtain" },
  6: { image: "/images/new-hero/hero-beach-1.jpg", tag: "Pulsing Garment Hotspots" },
};

export default function HeroStyleControlSection({
  currentStyle,
  onSelectStyle,
  onScrollToHero,
}: HeroStyleControlSectionProps) {
  const handleSelectAndScroll = (id: number) => {
    onSelectStyle(id);
    if (onScrollToHero) {
      onScrollToHero();
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full bg-[#1A1816] text-[#FAF7F2] py-10 sm:py-14 px-4 sm:px-6 lg:px-8 border-y border-[#C5A059]/30 shadow-2xl relative overflow-hidden select-none">
      {/* Background fine grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.8) 1px, transparent 0)`,
          backgroundSize: "20px 20px",
        }}
      />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#C5A059] text-xs font-mono tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Concept Lab</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl text-white font-normal">
              Select Hero Screen Experience
            </h2>
            <p className="text-xs sm:text-sm text-[#DCC7AF]/80 font-sans max-w-xl">
              Choose from 6 distinct high-fashion hero screens inspired by leading international ateliers.
              Click any style to activate it and preview it live above.
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono uppercase tracking-wider text-white transition-colors w-fit"
          >
            <ArrowUp className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Scroll to Hero Top</span>
          </button>
        </div>

        {/* 6 HERO CARDS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {HERO_STYLES.map((style) => {
            const isActive = currentStyle === style.id;
            const preview = HERO_PREVIEWS[style.id];
            const Icon = style.icon;

            return (
              <button
                key={style.id}
                type="button"
                onClick={() => handleSelectAndScroll(style.id)}
                className={`group relative flex flex-col text-left rounded-2xl overflow-hidden border transition-all duration-300 p-2.5 sm:p-3 ${
                  isActive
                    ? "bg-[#25221F] border-[#C5A059] shadow-[0_0_25px_rgba(197,160,89,0.35)] ring-2 ring-[#C5A059]/50 scale-[1.03]"
                    : "bg-white/[0.03] border-white/10 hover:border-white/30 hover:bg-white/[0.06]"
                }`}
              >
                {/* Thumbnail Preview */}
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-2.5 bg-black/40 border border-white/10">
                  {preview && (
                    <Image
                      src={preview.image}
                      alt={style.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* Active Indicator Badge */}
                  {isActive ? (
                    <div className="absolute top-1.5 right-1.5 bg-[#C5A059] text-black px-2 py-0.5 rounded-full text-[9px] font-mono font-bold flex items-center gap-1 shadow-md">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>ACTIVE</span>
                    </div>
                  ) : (
                    <div className="absolute top-1.5 right-1.5 bg-black/60 backdrop-blur-md text-white/70 px-1.5 py-0.5 rounded text-[9px] font-mono">
                      0{style.id}
                    </div>
                  )}

                  <div className="absolute bottom-1.5 left-1.5 right-1.5 text-[8px] font-mono text-white/90 truncate bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded">
                    {preview.tag}
                  </div>
                </div>

                {/* Style Details */}
                <div className="space-y-1 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#C5A059]" : "text-white/60"}`} />
                      <h3 className={`text-xs font-serif font-medium leading-tight truncate ${isActive ? "text-[#C5A059]" : "text-white"}`}>
                        {style.name}
                      </h3>
                    </div>
                    <p className="text-[10px] font-mono text-[#DCC7AF]/70 truncate mt-0.5">
                      {style.sub}
                    </p>
                  </div>

                  <div className="pt-2">
                    <span
                      className={`block w-full py-1 text-center rounded-lg text-[9px] font-mono uppercase tracking-wider font-semibold transition-colors ${
                        isActive
                          ? "bg-[#C5A059] text-black"
                          : "bg-white/10 text-white/80 group-hover:bg-white group-hover:text-black"
                      }`}
                    >
                      {isActive ? "Viewing Now" : "Switch Style"}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* HELPFUL NOTE REGARDING THE 10 CARD STYLES BELOW */}
        <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-[#DCC7AF]">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
            <span>
              <strong className="text-white">10 Creative E-Commerce Card Styles</strong> are active in the catalogue directly below.
            </span>
          </div>
          <span className="text-[11px] text-white/50">
            Each card from 1 to 10 demonstrates a unique, modern, user-friendly interaction.
          </span>
        </div>
      </div>
    </div>
  );
}
