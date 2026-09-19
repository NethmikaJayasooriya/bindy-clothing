"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, Compass, Clock, Wind, Volume2, VolumeX, Sparkles } from "lucide-react";

export interface HeroLemaireSplitProps {
  onExploreCollection?: () => void;
  onWatchFilm?: () => void;
  isMuted?: boolean;
  toggleAudio?: () => void;
}

const ANGLES = [
  {
    id: "silhouette",
    label: "01 • Full Silhouette",
    title: "The Solitude of Bentota Sands",
    spec: "Floor-Length Handloom Voile Tiered Silhouette",
    image: "/images/new-hero/hero-beach-1.jpg",
    craft: "60s Pit-Loom Unbleached Cotton",
  },
  {
    id: "drape",
    label: "02 • Drape & Movement",
    title: "Ocean Whisper Bias Cut",
    spec: "Natural Indigo & Wax Resist Drape",
    image: "/images/serendipity/ocean-embraced-tiered-dress-full.jpg",
    craft: "Artisan Hand-Dip Dye Process",
  },
  {
    id: "loom",
    label: "03 • Loom Texture",
    title: "Ancestral Weft Structure",
    spec: "Raw Pit-Loom Weft Texture with Gold Filament",
    image: "/images/new-hero/hero-beach-2.jpg",
    craft: "Master Weaver Heritage Voile",
  },
];

export default function HeroLemaireSplit({
  onExploreCollection,
  onWatchFilm,
  isMuted = true,
  toggleAudio,
}: HeroLemaireSplitProps) {
  const [activeAngleIndex, setActiveAngleIndex] = useState(0);
  const [colomboTime, setColomboTime] = useState("05:42 PM");
  const [sydneyTime, setSydneyTime] = useState("10:12 PM");

  // Keep live time for Colombo and Sydney
  useEffect(() => {
    const updateTimes = () => {
      try {
        const now = new Date();
        setColomboTime(
          new Intl.DateTimeFormat("en-US", {
            timeZone: "Asia/Colombo",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }).format(now)
        );
        setSydneyTime(
          new Intl.DateTimeFormat("en-US", {
            timeZone: "Australia/Sydney",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }).format(now)
        );
      } catch {
        // fallback
      }
    };
    updateTimes();
    const interval = setInterval(updateTimes, 30000);
    return () => clearInterval(interval);
  }, []);

  const active = ANGLES[activeAngleIndex];

  return (
    <section className="relative w-full h-full min-h-screen bg-[#11100F] text-[#FAF7F2] overflow-hidden flex flex-col justify-between select-none">
      {/* TOP HEADER STATUS */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-2 flex items-center justify-between text-xs font-mono border-b border-white/10">
        <div className="flex items-center gap-2 text-[#DCC7AF]">
          <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[#C5A059]">
            LEMAIRE × STUDIO NICHOLSON DUAL HORIZON
          </span>
          <span className="text-white/30 hidden sm:inline">•</span>
          <span className="text-white/80 hidden sm:inline">Volume III • Architectural Ease</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono text-[#DCC7AF]">
            <span>COLOMBO {colomboTime}</span>
            <span className="text-white/30">•</span>
            <span>SYDNEY {sydneyTime}</span>
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

      {/* DUAL HORIZON SPLIT BODY */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 gap-6 items-center">
        {/* LEFT COLUMN: ARCHITECTURAL EDITORIAL NOTES (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-xs font-mono text-[#C5A059] uppercase tracking-[0.25em] mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Southern Coast Pit-Loom Studio</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-medium leading-[1.05] tracking-tight">
            Architectural <br />
            <span className="italic text-[#FAF7F2]">Simplicity.</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-[#DCC7AF]/85 font-sans leading-relaxed">
            Crafted for breezy Australian sunlit living from pure Sri Lankan handspun cotton voile. Designed with unhurried silhouettes, natural botanical dyes, and relaxed tailoring.
          </p>

          {/* Botanical & Weave Specifications */}
          <div className="mt-6 p-3.5 rounded-xl bg-white/5 border border-white/10 grid grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <span className="block text-[10px] text-white/50 uppercase tracking-wider">FIBER SPECIFICATION</span>
              <strong className="block text-white font-medium mt-0.5">60s Raw Organic Cotton</strong>
            </div>
            <div>
              <span className="block text-[10px] text-white/50 uppercase tracking-wider">NATURAL DYE VAT</span>
              <strong className="block text-[#C5A059] font-medium mt-0.5">Wild Cinnamon & Indigo</strong>
            </div>
            <div>
              <span className="block text-[10px] text-white/50 uppercase tracking-wider">PRODUCTION EDITION</span>
              <strong className="block text-white font-medium mt-0.5">25 Individually Numbered</strong>
            </div>
            <div>
              <span className="block text-[10px] text-white/50 uppercase tracking-wider">COASTAL WEATHER</span>
              <strong className="block text-[#DCC7AF] font-medium mt-0.5">Bentota 28°C • Ocean Breeze</strong>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onExploreCollection}
              className="px-6 py-3 rounded-full bg-[#FAF7F2] text-black hover:bg-[#C5A059] font-sans text-xs font-bold uppercase tracking-widest transition-all shadow-xl flex items-center gap-2"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {onWatchFilm && (
              <button
                type="button"
                onClick={onWatchFilm}
                className="px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white font-sans text-xs font-medium tracking-wider transition-all flex items-center gap-2"
              >
                <Play className="w-3 h-3 fill-current text-[#C5A059]" />
                <span>Atelier Film</span>
              </button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: MULTI-ANGLE VISUAL CANVAS (7 COLS) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {/* Main Visual Display Frame */}
          <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-2xl overflow-hidden bg-black/40 border border-white/20 shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full h-full"
              >
                <Image
                  src={active.image}
                  alt={active.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

                {/* Overlaid Active Metadata Tag */}
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                  <div>
                    <span className="text-[10px] font-mono text-[#C5A059] uppercase tracking-wider font-bold">
                      {active.craft}
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-medium text-white">{active.title}</h3>
                    <p className="text-xs font-mono text-white/70">{active.spec}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Angle Switcher Controller Bar */}
          <div className="grid grid-cols-3 gap-2">
            {ANGLES.map((angle, idx) => {
              const isSelected = activeAngleIndex === idx;
              return (
                <button
                  key={angle.id}
                  type="button"
                  onClick={() => setActiveAngleIndex(idx)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-white/15 border-[#C5A059] shadow-lg"
                      : "bg-white/5 border-white/10 hover:border-white/25 text-white/70"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono uppercase tracking-wider ${isSelected ? "text-[#C5A059] font-bold" : "text-white/60"}`}>
                      {angle.label}
                    </span>
                  </div>
                  <div className="text-xs font-serif font-medium text-white truncate mt-0.5">
                    {angle.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* BOTTOM FOOTER TICKER */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 pt-2">
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#DCC7AF]/70 border-t border-white/10 pt-3 gap-2">
          <span>ETHICAL SRI LANKAN ARTISAN WEAVING COLLECTIVE</span>
          <span className="hidden md:inline">AUSTRALIAN RESORTWEAR SILHOUETTES</span>
          <span className="text-[#C5A059]">CIRCULAR BOTANICAL DYES</span>
        </div>
      </div>
    </section>
  );
}
