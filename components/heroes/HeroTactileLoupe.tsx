"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, Sparkles, Compass, Eye, ShieldCheck, Volume2, VolumeX } from "lucide-react";

export interface HeroTactileLoupeProps {
  onExploreCollection?: () => void;
  onWatchFilm?: () => void;
  isMuted?: boolean;
  toggleAudio?: () => void;
}

const LOOKS = [
  {
    id: "cinnamon",
    title: "Cinnamon Flow Voile",
    subtitle: "Southern Coast Pit-Loom Archive",
    dye: "Wild Cinnamon Bark & Madder Root",
    weave: "60s Handspun Cotton Voile",
    coordinates: "6.0535° N, 80.2210° E • Galle Fort",
    image: "/images/serendipity/cinnamon-flow-skirt-full.jpg",
    macroDetail: "/images/detail/cinnamon-flow-skirt-b.jpg",
    accentColor: "#B86B4B",
    price: "$285 AUD",
  },
  {
    id: "ocean",
    title: "Ocean Embraced Tiered",
    subtitle: "Bentota Wave Gradient Silhouette",
    dye: "Natural Indigo & Marine Salt Bath",
    weave: "Hand-Drawn Wax Resist Silk",
    coordinates: "6.4261° N, 79.9961° E • Bentota Coast",
    image: "/images/serendipity/ocean-embraced-tiered-dress-full.jpg",
    macroDetail: "/images/detail/ocean-embraced-tiered-dress-b.jpg",
    accentColor: "#4A7C7D",
    price: "$340 AUD",
  },
  {
    id: "lotus",
    title: "Lotus Memory Bias Dress",
    subtitle: "Sacred Temple Petal Infusion",
    dye: "Temple Lotus & Jackfruit Wood",
    weave: "Mulberry Silk & Linen Twill",
    coordinates: "7.2906° N, 80.6337° E • Kandy Highlands",
    image: "/images/serendipity/lotus-memory-dress-full.jpg",
    macroDetail: "/images/detail/lotus-memory-dress-b.jpg",
    accentColor: "#C5A059",
    price: "$310 AUD",
  },
];

export default function HeroTactileLoupe({
  onExploreCollection,
  onWatchFilm,
  isMuted = true,
  toggleAudio,
}: HeroTactileLoupeProps) {
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const [loupeState, setLoupeState] = useState<{
    visible: boolean;
    x: number;
    y: number;
    percentX: number;
    percentY: number;
  }>({
    visible: false,
    x: 0,
    y: 0,
    percentX: 50,
    percentY: 50,
  });

  const activeLook = LOOKS[activeLookIndex];
  const imageFrameRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageFrameRef.current) return;
    const rect = imageFrameRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const percentX = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const percentY = Math.max(0, Math.min(100, (y / rect.height) * 100));

    setLoupeState({
      visible: true,
      x,
      y,
      percentX,
      percentY,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setLoupeState((prev) => ({ ...prev, visible: false }));
  }, []);

  return (
    <section className="relative w-full h-full min-h-screen bg-[#141312] text-[#FAF7F2] overflow-hidden flex flex-col justify-between select-none">
      {/* Subtle organic ambient gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-[#1C1A18]/60 to-[#2A231C]/40 pointer-events-none" />

      {/* Atmospheric noise / fine grain */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.8) 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Main Split Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 flex-1 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
        {/* LEFT COLUMN: Monumental Editorial Typography */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center text-left space-y-6">
          {/* Heritage Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md w-fit">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#C5A059] font-medium">
              Jacquemus × Loewe Editorial Form
            </span>
          </div>

          {/* Master Title */}
          <div className="space-y-2">
            <h1 className="font-serif text-4xl sm:text-6xl xl:text-7xl font-light tracking-tight leading-[1.05] text-[#FAF7F2]">
              Ancestral <br />
              <span className="italic font-normal text-[#DCC7AF]">
                Silk Reverie
              </span>
            </h1>
            <p className="font-mono text-xs sm:text-sm text-[#DCC7AF]/80 uppercase tracking-widest pt-1">
              Slow Resort-Wear • Hand-Drawn Batiks • Limited Edition
            </p>
          </div>

          {/* Look Details Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-3 max-w-md">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-serif text-lg text-white font-medium">
                {activeLook.title}
              </span>
              <span className="font-mono text-sm font-semibold text-[#C5A059]">
                {activeLook.price}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
              <div>
                <span className="text-white/40 block">DYE CRAFT</span>
                <span className="text-[#DCC7AF] truncate block">{activeLook.dye}</span>
              </div>
              <div>
                <span className="text-white/40 block">WEAVE DENSITY</span>
                <span className="text-[#DCC7AF] truncate block">{activeLook.weave}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/50 pt-1">
              <Compass className="w-3 h-3 text-[#C5A059]" />
              <span>{activeLook.coordinates}</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onExploreCollection}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#C5A059] hover:bg-[#b08e49] text-[#141312] font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-xl hover:scale-105 active:scale-95"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onWatchFilm}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/15 backdrop-blur-md font-mono text-xs uppercase tracking-wider font-semibold transition-all hover:scale-105 active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current text-[#C5A059]" />
              <span>Atelier Film (1:45)</span>
            </button>

            {toggleAudio && (
              <button
                type="button"
                onClick={toggleAudio}
                className="p-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 transition-colors"
                title={isMuted ? "Play Ambient Breeze" : "Mute Audio"}
                aria-label="Toggle Sound"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#C5A059]" />}
              </button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Tactile Loupe Canvas */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[420px] aspect-[3/4] rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-white/15 group">
            {/* Interactive Image Frame */}
            <div
              ref={imageFrameRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full h-full cursor-crosshair"
            >
              {/* Main Model Image */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLook.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={activeLook.image}
                    alt={activeLook.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-top"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Glass subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

              {/* Hover Prompt Badge */}
              <div className="absolute top-4 left-4 pointer-events-none bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-[#C5A059] animate-pulse" />
                <span className="font-mono text-[10px] text-white/90 uppercase tracking-wider">
                  Hover to Magnify Handloom Weave
                </span>
              </div>

              {/* FLOATING TACTILE LOUPE (Magnifying Glass) */}
              {loupeState.visible && (
                <div
                  className="absolute pointer-events-none z-30 -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out"
                  style={{
                    left: `${loupeState.x}px`,
                    top: `${loupeState.y}px`,
                  }}
                >
                  {/* Loupe Outer Ring with Glass Bezel */}
                  <div className="relative w-44 h-44 rounded-full overflow-hidden border-2 border-[#C5A059] shadow-[0_0_35px_rgba(0,0,0,0.9),0_0_20px_rgba(197,160,89,0.5)] ring-4 ring-black/80 bg-[#1F1E1D]">
                    {/* Zoomed Macro Image using percent coordinates */}
                    <div
                      className="absolute w-[400%] h-[400%]"
                      style={{
                        left: `-${loupeState.percentX * 3}%`,
                        top: `-${loupeState.percentY * 3}%`,
                      }}
                    >
                      <Image
                        src={activeLook.macroDetail}
                        alt="Macro handloom weave texture"
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Crosshair Overlay */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="w-6 h-[1px] bg-[#C5A059]/80" />
                      <div className="h-6 w-[1px] bg-[#C5A059]/80 absolute" />
                    </div>

                    {/* Lens Spec Badge */}
                    <div className="absolute bottom-2 inset-x-0 text-center">
                      <span className="bg-black/85 text-[#C5A059] px-2 py-0.5 rounded text-[8px] font-mono tracking-widest uppercase border border-[#C5A059]/40">
                        4.0X WEAVE LENS
                      </span>
                    </div>

                    {/* Lens Glare Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Swatch Selector Docked to Card */}
            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-between gap-2 z-20">
              <span className="text-[10px] font-mono uppercase tracking-wider text-white/60">
                Select Silhouette:
              </span>
              <div className="flex items-center gap-2">
                {LOOKS.map((look, i) => (
                  <button
                    key={look.id}
                    type="button"
                    onClick={() => setActiveLookIndex(i)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all border ${
                      activeLookIndex === i
                        ? "bg-[#C5A059] text-black font-bold border-[#C5A059] scale-105 shadow-md"
                        : "bg-white/10 text-white/70 border-white/10 hover:bg-white/20"
                    }`}
                  >
                    0{i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Floating Sub-Bar */}
      <div className="relative z-10 w-full border-t border-white/10 bg-black/40 backdrop-blur-md py-2.5 px-4 sm:px-8 flex flex-wrap items-center justify-between text-[11px] font-mono text-white/60">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[#C5A059]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Ethical Pit-Loom Certified</span>
          </span>
          <span className="hidden sm:inline text-white/30">•</span>
          <span className="hidden sm:inline">100% Biodegradable Botanical Pigments</span>
        </div>
        <div className="text-right text-white/40 hidden md:block">
          Style 2 • Interactive Weave Loupe Experience
        </div>
      </div>
    </section>
  );
}
