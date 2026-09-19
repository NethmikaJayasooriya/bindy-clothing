"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, BookOpen, Compass, Scissors, Heart, Volume2, VolumeX, Sparkles } from "lucide-react";

export interface HeroAtelierCollageProps {
  onExploreCollection?: () => void;
  onWatchFilm?: () => void;
  isMuted?: boolean;
  toggleAudio?: () => void;
}

export default function HeroAtelierCollage({
  onExploreCollection,
  onWatchFilm,
  isMuted = true,
  toggleAudio,
}: HeroAtelierCollageProps) {
  const [activeArtifact, setActiveArtifact] = useState<string | null>(null);

  return (
    <section className="relative w-full h-full min-h-screen bg-[#181614] text-[#FAF7F2] overflow-hidden flex flex-col justify-between select-none">
      {/* Organic Parchment & Atmospheric Ambient Tone */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#121110] via-[#1B1816] to-[#251F19] pointer-events-none" />

      {/* Crosshatch Linen Texture Simulation */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* TOP ATELIER HEADER BAR */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-2 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#C5A059]" />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">
            Bode × Casablanca Atelier Moodboard
          </span>
          <span className="text-white/40 hidden sm:inline">•</span>
          <span className="text-[#DCC7AF]/70 hidden sm:inline">Volume IV • The Slow Artisan Scrapbook</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-[10px] font-mono text-[#C5A059] bg-[#C5A059]/10 px-2.5 py-1 rounded-full border border-[#C5A059]/30">
            Click pins to inspect craft
          </span>
          {toggleAudio && (
            <button
              type="button"
              onClick={toggleAudio}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 transition-colors"
              aria-label="Toggle Sound"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#C5A059]" />}
            </button>
          )}
        </div>
      </div>

      {/* MAIN COLLAGE CANVAS */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12 my-auto py-4">
        {/* LEFT COLUMN: Editorial Storytelling */}
        <div className="w-full lg:w-5/12 space-y-5 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B86B4B]/20 border border-[#B86B4B]/40 text-[#DCC7AF] text-xs font-mono">
            <Scissors className="w-3.5 h-3.5 text-[#B86B4B]" />
            <span>Master Crafted in Sri Lanka</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl xl:text-6xl font-normal leading-[1.1] text-white">
            The Artisan <br />
            <span className="italic text-[#C5A059]">Atelier Journal</span>
          </h1>

          <p className="text-sm sm:text-base text-[#DCC7AF]/85 font-light leading-relaxed max-w-md">
            Every garment tells a tangible story. Woven on heritage pit-looms in Galle,
            steeped in botanical dye vats of Ceylon cinnamon and sea-salt, cut with slow reverence.
          </p>

          <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-sm space-y-2 max-w-md">
            <div className="flex items-center justify-between text-xs font-mono text-[#C5A059]">
              <span className="font-bold uppercase tracking-wider">Provenance Log #448</span>
              <span>Southern Province</span>
            </div>
            <p className="text-xs font-mono text-white/70 italic">
              "Wax applied by canting pen at 62°C. Three sun drying cycles under Bentota coconut groves."
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onExploreCollection}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#C5A059] hover:bg-[#b08e49] text-black font-mono text-xs uppercase tracking-wider font-bold shadow-xl transition-transform hover:scale-105 active:scale-95"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onWatchFilm}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/20 backdrop-blur-md font-mono text-xs uppercase tracking-wider font-semibold transition-transform hover:scale-105 active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current text-[#C5A059]" />
              <span>Atelier Reel</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Layered Atelier Scrapbook / Moodboard */}
        <div className="w-full lg:w-7/12 relative h-[380px] sm:h-[460px] lg:h-[520px] flex items-center justify-center">
          {/* Main Central Photograph: Framed Beach Editorial */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 w-[260px] sm:w-[320px] aspect-[3/4] bg-[#FAF7F2] p-2.5 sm:p-3 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-[#C5A059]/30 -rotate-1 hover:rotate-0 transition-transform duration-500 group"
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden">
              <Image
                src="/images/new-hero/hero-beach-1.jpg"
                alt="Editorial resort photo"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority
              />
              <div className="absolute bottom-2 inset-x-2 bg-black/60 backdrop-blur-md rounded-lg p-2 text-[10px] font-mono text-white text-center">
                Plate 01: Golden Hour Ocean Voile
              </div>
            </div>
            {/* Metallic corner pins */}
            <div className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-[#C5A059] shadow-inner" />
            <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#C5A059] shadow-inner" />
          </motion.div>

          {/* FLOATING ARTIFACT 1: Artisan Portrait Polaroid (Top Right) */}
          <motion.button
            type="button"
            onClick={() => setActiveArtifact(activeArtifact === "artisan" ? null : "artisan")}
            whileHover={{ scale: 1.08, rotate: 6, zIndex: 30 }}
            className="absolute top-2 right-2 sm:right-6 z-20 w-36 sm:w-44 bg-[#FAF7F2] text-[#1F1E1D] p-2 pb-3 rounded-xl shadow-2xl border border-black/10 rotate-6 cursor-pointer text-left transition-all"
          >
            <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-1.5">
              <Image
                src="/images/creator photo with bg/dilrukshi.jpeg"
                alt="Master Artisan Dilrukshi"
                fill
                className="object-cover"
              />
            </div>
            <p className="font-serif text-xs font-bold leading-tight">Dilrukshi M.</p>
            <p className="font-mono text-[9px] text-[#78716A]">Master Pit-Loom Weaver • 22 Yrs</p>
          </motion.button>

          {/* FLOATING ARTIFACT 2: Fabric Swatch Stamp (Bottom Left) */}
          <motion.button
            type="button"
            onClick={() => setActiveArtifact(activeArtifact === "swatch" ? null : "swatch")}
            whileHover={{ scale: 1.08, rotate: -8, zIndex: 30 }}
            className="absolute bottom-4 left-0 sm:left-4 z-20 w-40 sm:w-48 bg-[#201D1A] text-white p-2.5 rounded-xl shadow-2xl border border-[#C5A059]/40 -rotate-6 cursor-pointer text-left transition-all backdrop-blur-md"
          >
            <div className="relative w-full h-20 rounded-lg overflow-hidden mb-2 border border-white/10">
              <Image
                src="/images/detail/celestial-terracotta-skirt-b.jpg"
                alt="Fabric weave swatch"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-center justify-between text-[9px] font-mono text-[#C5A059]">
              <span className="font-bold uppercase">Swatch #09</span>
              <span>100% Cotton</span>
            </div>
            <p className="text-[10px] font-mono text-white/80 truncate">Terracotta Pit-Loom Weft</p>
          </motion.button>

          {/* FLOATING ARTIFACT 3: Latitude / Meteorological Tag (Bottom Right) */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="absolute -bottom-2 right-4 sm:right-12 z-20 bg-black/80 backdrop-blur-md text-[#FAF7F2] px-3.5 py-2.5 rounded-xl border border-white/20 shadow-xl font-mono text-[10px] space-y-0.5 hidden sm:block"
          >
            <div className="flex items-center gap-1.5 text-[#C5A059]">
              <Compass className="w-3 h-3" />
              <span className="font-bold">GALLE COAST</span>
            </div>
            <div className="text-white/60">06°03&apos;N 80°13&apos;E • 29°C</div>
            <div className="text-[#DCC7AF]">Handloom Batch: #04/2026</div>
          </motion.div>
        </div>
      </div>

      {/* BOTTOM FOOTER TICKER */}
      <div className="relative z-10 w-full border-t border-white/10 bg-black/50 backdrop-blur-md py-2.5 px-4 sm:px-8 flex items-center justify-between text-[11px] font-mono text-[#DCC7AF]/70">
        <div className="flex items-center gap-2">
          <Heart className="w-3.5 h-3.5 text-[#C5A059] fill-current" />
          <span>Fair-Trade Artisan Collective • 100% Carbon Neutral Island Shipping</span>
        </div>
        <span className="hidden md:inline text-white/40">Style 4 • The Curated Atelier Moodboard</span>
      </div>
    </section>
  );
}
