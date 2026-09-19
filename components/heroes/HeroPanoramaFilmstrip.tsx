"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Play, Film, Sparkles, Volume2, VolumeX } from "lucide-react";

export interface HeroPanoramaFilmstripProps {
  onExploreCollection?: () => void;
  onWatchFilm?: () => void;
  isMuted?: boolean;
  toggleAudio?: () => void;
}

const PANORAMA_FRAMES = [
  {
    id: "frame-1",
    title: "The Solitude of Bentota Sands",
    collection: "Archive 01 • Serendipity",
    craft: "Mulberry Silk & Hand-Spun Voile",
    image: "/images/new-hero/hero-beach-1.jpg",
    shutter: "1/500s • 35mm • Galle Coast",
    edition: "Batch 04 / 45 Hand-Numbered",
    accent: "Ceylon Cinnamon & Gold Leaf",
  },
  {
    id: "frame-2",
    title: "Ocean Whisper Draped Voile",
    collection: "Archive 02 • Coastal Wave",
    craft: "Natural Indigo Dye & Sea Salt Bleach",
    image: "/images/new-hero/hero-beach-2.jpg",
    shutter: "1/250s • 50mm • Mirissa Reef",
    edition: "Batch 02 / 30 Pieces Crafted",
    accent: "Deep Marine & Chalk Wax",
  },
  {
    id: "frame-3",
    title: "Heritage Pit-Loom Silhouettes",
    collection: "Archive 03 • Ancestral Threads",
    craft: "Unbleached Organic Raw Cotton",
    image: "/images/serendipity/ocean-embraced-tiered-dress-full.jpg",
    shutter: "1/320s • 85mm • Weligama Bay",
    edition: "Limited Run 25 Pieces",
    accent: "Terracotta & Natural Madder",
  },
  {
    id: "frame-4",
    title: "Shore Traces Billowing Blouse",
    collection: "Archive 04 • Tropical Breeze",
    craft: "Batik Wax Canting Technique",
    image: "/images/serendipity/shore-traces-blouse-full.jpg",
    shutter: "1/400s • 35mm • Tangalle Surf",
    edition: "Heritage Vault Collection",
    accent: "Sundrenched Ochre & Ivory",
  },
];

export default function HeroPanoramaFilmstrip({
  onExploreCollection,
  onWatchFilm,
  isMuted = true,
  toggleAudio,
}: HeroPanoramaFilmstripProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto progression timer
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % PANORAMA_FRAMES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const active = PANORAMA_FRAMES[currentFrame];

  return (
    <section className="relative w-full h-full min-h-screen bg-[#0F0E0D] text-[#FAF7F2] overflow-hidden flex flex-col justify-between select-none">
      {/* Background Fullscreen Widescreen View with Smooth Dissolve */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.1, ease: [0.25, 1, 0.5, 1] }}
            className="relative w-full h-full"
          >
            <Image
              src={active.image}
              alt={active.title}
              fill
              priority
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* Cinematic Film Vignette & Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/60 pointer-events-none" />

        {/* Film Perforations Border (Cinematic look) */}
        <div className="absolute top-0 inset-x-0 h-8 bg-black/80 border-b border-white/10 hidden sm:flex items-center justify-around px-4 opacity-40 pointer-events-none">
          {Array.from({ length: 24 }).map((_, idx) => (
            <div key={idx} className="w-4 h-2.5 rounded-sm bg-white/20" />
          ))}
        </div>
      </div>

      {/* TOP METADATA BAR */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-2 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-ping" />
          <span className="text-[#C5A059] font-bold uppercase tracking-widest">
            Khaite × Bottega Cinematic Filmstrip
          </span>
          <span className="text-white/40 hidden sm:inline">•</span>
          <span className="text-white/60 hidden sm:inline">{active.shutter}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-black/60 border border-white/20 text-[#DCC7AF]">
            FRAME 0{currentFrame + 1} / 0{PANORAMA_FRAMES.length}
          </div>
          {toggleAudio && (
            <button
              type="button"
              onClick={toggleAudio}
              className="p-2 rounded-full bg-black/60 border border-white/20 text-white/80 hover:text-white transition-colors"
              aria-label="Toggle Sound"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#C5A059]" />}
            </button>
          )}
        </div>
      </div>

      {/* CENTER / LOWER EDITORIAL TITLE & CAPTION */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-auto flex flex-col justify-end space-y-4 sm:space-y-6">
        <div className="space-y-2 max-w-2xl">
          <motion.div
            key={`badge-${active.id}`}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#C5A059] text-[11px] font-mono tracking-widest uppercase"
          >
            <Film className="w-3 h-3" />
            <span>{active.collection}</span>
          </motion.div>

          <motion.h1
            key={`title-${active.id}`}
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-white leading-tight"
          >
            {active.title}
          </motion.h1>

          <motion.div
            key={`meta-${active.id}`}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#DCC7AF]/90 pt-1"
          >
            <span className="text-white/50">{active.craft}</span>
            <span>•</span>
            <span className="text-[#C5A059]">{active.edition}</span>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onExploreCollection}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#C5A059] hover:bg-[#b08e49] text-black font-mono text-xs uppercase tracking-wider font-bold shadow-xl transition-transform hover:scale-105 active:scale-95"
          >
            <span>View Full Panorama Archive</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onWatchFilm}
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md font-mono text-xs uppercase tracking-wider font-semibold transition-transform hover:scale-105 active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current text-[#C5A059]" />
            <span>Play Look Reel</span>
          </button>
        </div>
      </div>

      {/* BOTTOM FILM REEL FILMSTRIP CONTROLS */}
      <div className="relative z-10 w-full bg-black/70 backdrop-blur-xl border-t border-white/15 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Previous / Next Arrow Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentFrame((prev) => (prev - 1 + PANORAMA_FRAMES.length) % PANORAMA_FRAMES.length);
              }}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
              aria-label="Previous Frame"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentFrame((prev) => (prev + 1) % PANORAMA_FRAMES.length);
              }}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
              aria-label="Next Frame"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Miniature Film Strip Thumbnails */}
          <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none py-1">
            {PANORAMA_FRAMES.map((frame, idx) => {
              const isSelected = currentFrame === idx;
              return (
                <button
                  key={frame.id}
                  type="button"
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentFrame(idx);
                  }}
                  className={`group relative flex-shrink-0 w-16 sm:w-24 h-11 sm:h-14 rounded-lg overflow-hidden border transition-all duration-300 ${
                    isSelected
                      ? "border-[#C5A059] ring-2 ring-[#C5A059]/50 scale-105"
                      : "border-white/20 opacity-50 hover:opacity-90"
                  }`}
                >
                  <Image
                    src={frame.image}
                    alt={frame.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent" />
                  <span className="absolute bottom-1 right-1 px-1 rounded bg-black/80 text-[8px] font-mono text-white">
                    0{idx + 1}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Timer Progress Indicator */}
          <div className="hidden md:flex flex-col items-end text-right">
            <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider">
              {isAutoPlaying ? "Auto-Scanning Panorama" : "Manual Frame Control"}
            </span>
            <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-[#C5A059] transition-all duration-500"
                style={{ width: `${((currentFrame + 1) / PANORAMA_FRAMES.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
