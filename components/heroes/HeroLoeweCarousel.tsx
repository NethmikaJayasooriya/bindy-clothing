"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Play, Eye, Sparkles, Volume2, VolumeX, ShieldCheck } from "lucide-react";

export interface HeroLoeweCarouselProps {
  onExploreCollection?: () => void;
  onWatchFilm?: () => void;
  isMuted?: boolean;
  toggleAudio?: () => void;
}

const LOOKS_CAROUSEL = [
  {
    id: "look-01",
    name: "Cinnamon Flow Voile Skirt",
    category: "Resort Capsule",
    craft: "60s Handspun Cotton • Wild Cinnamon Bark",
    price: "$285 AUD",
    image: "/images/serendipity/cinnamon-flow-skirt-full.jpg",
    origin: "Galle Fort Atelier",
    batch: "Piece 04 / 30",
  },
  {
    id: "look-02",
    name: "Ocean Embraced Tiered Dress",
    category: "Signature Archive",
    craft: "Hand-Drawn Wax Resist Batik • Indigo Dye",
    price: "$340 AUD",
    image: "/images/serendipity/ocean-embraced-tiered-dress-full.jpg",
    origin: "Bentota Coastal Loom",
    batch: "Piece 12 / 25",
  },
  {
    id: "look-03",
    name: "Lotus Memory Bias Cut Dress",
    category: "Evening Solitude",
    craft: "Organic Pit-Loom Voile • Temple Petal Bath",
    price: "$310 AUD",
    image: "/images/serendipity/lotus-memory-dress-full.jpg",
    origin: "Kandy Highlands",
    batch: "Piece 08 / 20",
  },
  {
    id: "look-04",
    name: "Shore Traces Billowing Blouse",
    category: "Coastal Breeze",
    craft: "Unbleached Cotton Voile • Sea Salt Bath",
    price: "$220 AUD",
    image: "/images/serendipity/shore-traces-blouse-full.jpg",
    origin: "Tangalle Surf Workshop",
    batch: "Piece 15 / 35",
  },
  {
    id: "look-05",
    name: "Golden Hour Serendib Gown",
    category: "Atelier Runway",
    craft: "Ancestral Pit-Loom Weave • Gold Filament",
    price: "$390 AUD",
    image: "/images/new-hero/hero-beach-1.jpg",
    origin: "Mirissa Bay Sands",
    batch: "Piece 01 / 15",
  },
];

export default function HeroLoeweCarousel({
  onExploreCollection,
  onWatchFilm,
  isMuted = true,
  toggleAudio,
}: HeroLoeweCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const total = LOOKS_CAROUSEL.length;

  // Auto-progression every 5.5 seconds unless paused
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 5500);
    return () => clearInterval(timer);
  }, [isAutoPlaying, total]);

  const activeLook = LOOKS_CAROUSEL[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  return (
    <section
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      className="relative w-full h-full min-h-screen bg-[#0D0C0B] text-[#FAF7F2] overflow-hidden flex flex-col justify-between select-none"
    >
      {/* Dynamic Ambient Background Blur of Active Card */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLook.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 filter blur-3xl scale-110"
          >
            <Image
              src={activeLook.image}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0B] via-[#0D0C0B]/85 to-[#0D0C0B]/90" />
      </div>

      {/* TOP ATELIER BAR */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-2 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-[#DCC7AF]">
          <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[#C5A059]">
            LOEWE × KHAITE 3D LOOKBOOK ORBIT
          </span>
          <span className="text-white/30 hidden sm:inline">•</span>
          <span className="text-white/80 hidden sm:inline">Volume II • Serendipity Capsule</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10 text-xs font-mono text-[#DCC7AF]">
            <span>{activeIndex + 1} of {total} Looks</span>
          </div>
          {toggleAudio && (
            <button
              type="button"
              onClick={toggleAudio}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/90 transition-colors"
              aria-label="Toggle Sound"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#C5A059]" />}
            </button>
          )}
        </div>
      </div>

      {/* CENTER 3D LOOKBOOK ORBIT CAROUSEL */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-auto flex flex-col items-center">
        {/* Title headline */}
        <div className="text-center mb-6 sm:mb-8">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#C5A059] font-bold">
            Curated Artisanal Silhouettes
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-medium tracking-tight mt-1">
            The 3D Lookbook Orbit
          </h1>
        </div>

        {/* Orbit Cards Container */}
        <div className="relative w-full max-w-4xl h-[380px] sm:h-[450px] flex items-center justify-center perspective-[1200px]">
          {LOOKS_CAROUSEL.map((look, idx) => {
            // Calculate distance offset from activeIndex (-2, -1, 0, 1, 2)
            let diff = idx - activeIndex;
            if (diff > total / 2) diff -= total;
            if (diff < -total / 2) diff += total;

            const isCenter = diff === 0;
            const isVisible = Math.abs(diff) <= 2;

            if (!isVisible) return null;

            // 3D transform metrics
            const xOffset = diff * (typeof window !== "undefined" && window.innerWidth < 640 ? 110 : 200);
            const zOffset = -Math.abs(diff) * 140;
            const rotateY = diff * -18;
            const scale = isCenter ? 1 : Math.max(0.75, 1 - Math.abs(diff) * 0.15);
            const opacity = isCenter ? 1 : Math.max(0.4, 0.9 - Math.abs(diff) * 0.35);

            return (
              <motion.div
                key={look.id}
                onClick={() => setActiveIndex(idx)}
                initial={false}
                animate={{
                  x: xOffset,
                  z: zOffset,
                  rotateY: rotateY,
                  scale: scale,
                  opacity: opacity,
                }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`absolute w-[220px] sm:w-[280px] aspect-[3/4.2] rounded-2xl overflow-hidden cursor-pointer shadow-2xl border transition-all ${
                  isCenter
                    ? "border-[#C5A059] ring-2 ring-[#C5A059]/40 z-30"
                    : "border-white/20 z-10 hover:border-white/50"
                }`}
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="relative w-full h-full bg-[#1F1E1D]">
                  <Image
                    src={look.image}
                    alt={look.name}
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                  {/* Card Badge */}
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-[#DCC7AF] border border-white/15">
                    {look.batch}
                  </div>

                  {/* Card Content Overlay */}
                  <div className="absolute bottom-0 inset-x-0 p-4 flex flex-col justify-end text-left">
                    <span className="text-[10px] font-mono text-[#C5A059] uppercase tracking-wider font-bold">
                      {look.origin}
                    </span>
                    <h3 className="font-serif text-base sm:text-lg font-medium text-white line-clamp-1 leading-snug">
                      {look.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/15">
                      <span className="font-outfit text-sm font-bold text-white">{look.price}</span>
                      <span className="text-[10px] font-mono text-[#DCC7AF]/80">Pit-Loom</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Left/Right Navigation Arrows */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 z-40 w-11 h-11 rounded-full bg-black/60 hover:bg-[#C5A059] hover:text-black border border-white/20 flex items-center justify-center text-white transition-all shadow-xl"
            aria-label="Previous Look"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 sm:right-4 z-40 w-11 h-11 rounded-full bg-black/60 hover:bg-[#C5A059] hover:text-black border border-white/20 flex items-center justify-center text-white transition-all shadow-xl"
            aria-label="Next Look"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Look Action Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={onExploreCollection}
            className="px-7 py-3 rounded-full bg-[#FAF7F2] text-black hover:bg-[#C5A059] font-sans text-xs font-bold uppercase tracking-widest transition-all shadow-xl flex items-center gap-2"
          >
            <span>Explore Entire Archive</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {onWatchFilm && (
            <button
              type="button"
              onClick={onWatchFilm}
              className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-sans text-xs font-medium tracking-wider transition-all flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current text-[#C5A059]" />
              <span>Watch Film</span>
            </button>
          )}
        </div>
      </div>

      {/* BOTTOM SPECS DOCK */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-2">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-3 flex items-center justify-between text-xs font-mono text-[#DCC7AF]/80">
          <div className="flex items-center gap-2">
            <span className="text-[#C5A059] font-bold">ACTIVE PIECE:</span>
            <span className="text-white font-medium">{activeLook.name}</span>
            <span className="hidden md:inline text-white/30">•</span>
            <span className="hidden md:inline">{activeLook.craft}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white/60 hidden sm:inline">Orbit Swipe: Drag or Use Arrows</span>
          </div>
        </div>
      </div>
    </section>
  );
}
