"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, Sparkles, Volume2, VolumeX, Compass, Sun, Wind, Sunset } from "lucide-react";

export interface HeroJacquemusKineticProps {
  onExploreCollection?: () => void;
  onWatchFilm?: () => void;
  isMuted?: boolean;
  toggleAudio?: () => void;
}

interface AtmosphereTheme {
  id: string;
  name: string;
  subtitle: string;
  time: string;
  temp: string;
  image: string;
  tag: string;
  accent: string;
  bgGradient: string;
  textColor: string;
  subColor: string;
}

const ATMOSPHERES: AtmosphereTheme[] = [
  {
    id: "sunrise",
    name: "01 • Sunrise Galle",
    subtitle: "Golden Hour Handloom Voile & Morning Mist",
    time: "06:18 AM",
    temp: "26°C Coast",
    image: "/images/new-hero/hero-beach-1.jpg",
    tag: "Collection 01 • Serendipity",
    accent: "#C5A059",
    bgGradient: "from-black/75 via-black/35 to-black/80",
    textColor: "#FAF7F2",
    subColor: "#DCC7AF",
  },
  {
    id: "noon",
    name: "02 • High Noon Serendib",
    subtitle: "Sun-Drenched Pit-Loom Silk & Marine Salt Air",
    time: "12:45 PM",
    temp: "31°C Bentota",
    image: "/images/new-hero/hero-beach-2.jpg",
    tag: "Ancestral Dye Vat Archive",
    accent: "#E2B874",
    bgGradient: "from-black/70 via-black/30 to-black/75",
    textColor: "#FAF7F2",
    subColor: "#E8DEC8",
  },
  {
    id: "twilight",
    name: "03 • Twilight Mirissa",
    subtitle: "Cinnamon & Indigo Dusk Draped Silhouette",
    time: "06:42 PM",
    temp: "28°C Mirissa",
    image: "/images/serendipity/ocean-embraced-tiered-dress-full.jpg",
    tag: "Limited Artisan Run",
    accent: "#E0946E",
    bgGradient: "from-[#110D0B]/85 via-[#1E140F]/45 to-[#110D0B]/90",
    textColor: "#FDFCFA",
    subColor: "#DCC7AF",
  },
];

export default function HeroJacquemusKinetic({
  onExploreCollection,
  onWatchFilm,
  isMuted = true,
  toggleAudio,
}: HeroJacquemusKineticProps) {
  const [activeMoodIndex, setActiveMoodIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const containerRef = useRef<HTMLDivElement>(null);

  const mood = ATMOSPHERES[activeMoodIndex];

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-full min-h-screen bg-[#0E0D0C] text-[#FAF7F2] overflow-hidden flex flex-col justify-between select-none"
    >
      {/* Background Image with Smooth Crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mood.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={mood.image}
            alt={mood.name}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Subtle cursor parallax lighting */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-700"
            style={{
              background: `radial-gradient(circle 800px at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(197, 160, 89, 0.25), transparent 70%)`,
            }}
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${mood.bgGradient} pointer-events-none`} />
        </motion.div>
      </AnimatePresence>

      {/* TOP ATELIER META BAR */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-2 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-[#DCC7AF]">
          <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-ping" />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[#C5A059]">
            JACQUEMUS × BINDY KINETIC
          </span>
          <span className="text-white/30 hidden sm:inline">•</span>
          <span className="text-white/80 hidden sm:inline">{mood.tag}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[11px] font-mono text-[#DCC7AF]">
            <Compass className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{mood.time} • {mood.temp}</span>
          </div>
          {toggleAudio && (
            <button
              type="button"
              onClick={toggleAudio}
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 text-white/90 transition-colors"
              aria-label="Toggle Sound"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#C5A059]" />}
            </button>
          )}
        </div>
      </div>

      {/* CENTER HIGH-FASHION KINETIC TYPOGRAPHY */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-auto flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="h-px w-8 bg-[#C5A059]" />
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#C5A059] font-bold">
              Slow Artisanal Resortwear
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] text-white font-medium drop-shadow-lg">
            Wear Your <span className="italic font-normal text-[#FAF7F2]">Calm.</span>
            <br />
            Feel Your <span className="text-[#C5A059] italic font-normal">Story.</span>
          </h1>

          <p className="mt-5 text-sm sm:text-base md:text-lg text-[#DCC7AF]/90 font-sans max-w-xl leading-relaxed">
            {mood.subtitle}. Handspun on ancestral wooden pit-looms in Southern Sri Lanka, cut for breezy Australian sunlit living.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onExploreCollection}
              className="group px-7 py-3.5 rounded-full bg-[#FAF7F2] text-[#1F1E1D] hover:bg-[#C5A059] hover:text-black font-sans text-xs sm:text-sm font-bold uppercase tracking-widest transition-all duration-300 shadow-2xl flex items-center gap-2.5"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            {onWatchFilm && (
              <button
                type="button"
                onClick={onWatchFilm}
                className="px-6 py-3.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white font-sans text-xs sm:text-sm font-medium tracking-wider transition-all flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current text-[#C5A059]" />
                <span>Atelier Film (1:45)</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* BOTTOM ATMOSPHERE CONTROLLER BAR */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-4">
        <div className="bg-black/50 backdrop-blur-xl border border-white/15 rounded-2xl p-2 sm:p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl">
          <div className="flex items-center gap-2 text-xs font-mono text-[#DCC7AF]/80 px-2">
            <Sun className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="uppercase tracking-wider font-semibold">Atmosphere Switcher:</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {ATMOSPHERES.map((atm, idx) => {
              const isActive = activeMoodIndex === idx;
              return (
                <button
                  key={atm.id}
                  type="button"
                  onClick={() => setActiveMoodIndex(idx)}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-mono transition-all duration-300 flex items-center gap-2 text-left whitespace-nowrap ${
                    isActive
                      ? "bg-[#C5A059] text-black font-bold shadow-lg scale-[1.02]"
                      : "bg-white/5 hover:bg-white/10 text-white/80 border border-white/5"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: atm.accent }} />
                  <span>{atm.name}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3 text-xs font-mono text-white/60 pr-2">
            <span>60s Organic Voile</span>
            <span>•</span>
            <span className="text-[#C5A059]">100% Biodegradable</span>
          </div>
        </div>
      </div>
    </section>
  );
}
