"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Film,
  Layers,
  Video,
  MapPin,
} from "lucide-react";

// =========================================================================
// 1. EDITORIAL LOOK DATA: 5 USER-DEFINED CAMPAIGN LOOKS
// =========================================================================

export interface EditorialLook {
  id: string;
  number: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  priceAud: number;
  origin: string;
  location: string;
  imageSrc: string;
  videoSrc: string;
  imagePositionClass: string;
  theme: {
    name: string;
    accentColor: string;
    secondaryColor: string;
    glowRgba: string;
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
    chipBorder: string;
    chipActive: string;
    accentText: string;
  };
}

export const EDITORIAL_LOOKS: EditorialLook[] = [
  {
    id: "coastal-lace",
    number: "01",
    slug: "serendib-pearl-dress",
    title: "Coastal Breeze & Cutwork Lace",
    tagline: "Sun-Bleached Voile & Ocean Tides",
    description:
      "Hand-scalloped lace crop top paired with a cascading ivory maxi skirt catching the Indian Ocean breeze along the white sands of Mirissa.",
    category: "Cutwork Resort Ensemble",
    priceAud: 285,
    origin: "Mannar & Galle Guilds",
    location: "Mirissa Shoreline • Southern Coast",
    imageSrc: "/images/hero-editorial/hero-beach-lace.jpg",
    videoSrc: "/videos/hero-beach-loop.mp4",
    // Framing: Anchor near top and shift down to give face generous headroom below navbar
    imagePositionClass: "object-[center_8%] translate-y-12 sm:translate-y-16 scale-110",
    theme: {
      name: "Sunlit Pearl Gold",
      accentColor: "#D4AF37",
      secondaryColor: "#F5EBE1",
      glowRgba: "rgba(212, 175, 55, 0.3)",
      badgeBg: "bg-black/50 backdrop-blur-md",
      badgeBorder: "border-[#D4AF37]/60",
      badgeText: "text-[#F5EBE1]",
      chipBorder: "border-[#D4AF37]/40",
      chipActive: "border-[#D4AF37] bg-[#D4AF37]/25 text-white ring-1 ring-[#D4AF37]",
      accentText: "text-[#E6CA65]",
    },
  },
  {
    id: "galle-check",
    number: "02",
    slug: "pettah-check-dress",
    title: "Colonial Rhythm & The Pettah Check",
    tagline: "Structured Retro Collars & Cobblestone Geometry",
    description:
      "Heritage red gingham check slip dress with an architectural lapel collar, tailored for promenade strolls past historic terracotta arches.",
    category: "Handwoven Gingham Dress",
    priceAud: 215,
    origin: "Colombo & Galle Guilds",
    location: "Galle Fort Cobblestones • Western Ramparts",
    imageSrc: "/images/hero-editorial/hero-galle-check.jpg",
    videoSrc: "/videos/hero-fashion-loop.mp4",
    // Framing: Lower the model's head substantially so the retro collar, face, and smile are 100% visible below navbar
    imagePositionClass: "object-[center_8%] translate-y-14 sm:translate-y-20 scale-110",
    theme: {
      name: "Terracotta Vermilion",
      accentColor: "#E0533C",
      secondaryColor: "#FFF2EE",
      glowRgba: "rgba(224, 83, 60, 0.3)",
      badgeBg: "bg-black/50 backdrop-blur-md",
      badgeBorder: "border-[#E0533C]/60",
      badgeText: "text-[#FFE2DA]",
      chipBorder: "border-[#E0533C]/40",
      chipActive: "border-[#E0533C] bg-[#E0533C]/30 text-white ring-1 ring-[#E0533C]",
      accentText: "text-[#FF8A75]",
    },
  },
  {
    id: "ceylon-highland",
    number: "03",
    slug: "tea-leaf-two-piece",
    title: "Highland Mist & Ceylon Tea Flora",
    tagline: "High-Altitude Linen & Verdant Mountain Drape",
    description:
      "Botanical-dyed olive green crop and sweeping pleated maxi skirt, crafted from organic yarns high above the clouds in the misty hills of Ella.",
    category: "Artisanal Linen Two-Piece",
    priceAud: 245,
    origin: "Kandy Looms & Central Guild",
    location: "Ella Tea Terraces • Central Highlands",
    imageSrc: "/images/hero-editorial/hero-highland-tea.jpg",
    videoSrc: "/videos/hero-sunlight-loop.mp4",
    // Framing: Headroom for the misty tree canopy and model walking down path
    imagePositionClass: "object-[center_12%] translate-y-10 sm:translate-y-16 scale-110",
    theme: {
      name: "Ceylon Tea Emerald",
      accentColor: "#34D399",
      secondaryColor: "#D1FAE5",
      glowRgba: "rgba(52, 211, 153, 0.3)",
      badgeBg: "bg-black/50 backdrop-blur-md",
      badgeBorder: "border-[#34D399]/60",
      badgeText: "text-[#D1FAE5]",
      chipBorder: "border-[#34D399]/40",
      chipActive: "border-[#34D399] bg-[#10B981]/30 text-white ring-1 ring-[#34D399]",
      accentText: "text-[#6EE7B7]",
    },
  },
  {
    id: "azure-coastal",
    number: "04",
    slug: "ocean-embraced-tiered-dress",
    title: "Ocean-Embraced Tiered Chambray",
    tagline: "Aegean Azure Weave & Salt-Air Movement",
    description:
      "Featherlight sky-blue tiered maxi dress tailored from natural cotton chambray, capturing the coastal ocean air against sunlit whitewashed walls.",
    category: "Tiered Chambray Maxi",
    priceAud: 260,
    origin: "Matale Workshop & Bentota",
    location: "Bentota Palm Coast • Southern Bluffs",
    imageSrc: "/images/hero-editorial/hero-azure-coastal.jpg",
    videoSrc: "/videos/hero-beach-loop.mp4",
    // Framing: Headroom for sunlit palm shadow and ocean background
    imagePositionClass: "object-[center_8%] translate-y-12 sm:translate-y-16 scale-110",
    theme: {
      name: "Aegean Azure Sky",
      accentColor: "#60A5FA",
      secondaryColor: "#EFF6FF",
      glowRgba: "rgba(96, 165, 250, 0.3)",
      badgeBg: "bg-black/50 backdrop-blur-md",
      badgeBorder: "border-[#60A5FA]/60",
      badgeText: "text-[#DBEAFE]",
      chipBorder: "border-[#60A5FA]/40",
      chipActive: "border-[#60A5FA] bg-[#3B82F6]/30 text-white ring-1 ring-[#60A5FA]",
      accentText: "text-[#93C5FD]",
    },
  },
  {
    id: "bougainvillea-collective",
    number: "05",
    slug: "lotus-memory-dress",
    title: "The Serendipity Sisterhood",
    tagline: "Four Iconic Silhouettes In Harmony",
    description:
      "All four signature silhouettes united beneath vibrant tropical bougainvillea blooms. A grand tribute to Sri Lankan artisanal mastery and shared elegance.",
    category: "Full Resort Capsule",
    priceAud: 285,
    origin: "All Master Cooperative Guilds",
    location: "Atelier Courtyard • Bougainvillea Arch",
    imageSrc: "/images/hero-editorial/hero-bougainvillea-collective.jpg",
    videoSrc: "/videos/hero-sunlight-loop.mp4",
    // Framing: Keep all four women's faces clear below the navbar
    imagePositionClass: "object-[center_18%] translate-y-8 sm:translate-y-12 scale-110",
    theme: {
      name: "Bougainvillea Magenta & Gold",
      accentColor: "#F472B6",
      secondaryColor: "#FCE7F3",
      glowRgba: "rgba(244, 114, 182, 0.35)",
      badgeBg: "bg-black/50 backdrop-blur-md",
      badgeBorder: "border-[#F472B6]/60",
      badgeText: "text-[#FCE7F3]",
      chipBorder: "border-[#F472B6]/40",
      chipActive: "border-[#F472B6] bg-[#DB2777]/30 text-white ring-1 ring-[#F472B6]",
      accentText: "text-[#F9A8D4]",
    },
  },
];

export interface HeroProps {
  onExploreCollection?: () => void;
  onWatchFilm?: () => void;
  isMuted?: boolean;
  toggleAudio?: () => void;
}

const SCENE_DURATION_MS = 6000; // 6 seconds per editorial slide

export default function CinematicHero({
  onExploreCollection,
  onWatchFilm,
  isMuted = true,
  toggleAudio,
}: HeroProps) {
  const [activeLookIndex, setActiveLookIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"stills" | "video">("stills");
  const [videoPlaybackRate, setVideoPlaybackRate] = useState<number>(1.0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const pipVideoRef = useRef<HTMLVideoElement>(null);
  const prefersReduced = useReducedMotion();

  const currentLook = EDITORIAL_LOOKS[activeLookIndex];

  // Preload all 5 images on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      EDITORIAL_LOOKS.forEach((look) => {
        const img = new window.Image();
        img.src = look.imageSrc;
      });
    }
  }, []);

  // Sync video playback rate
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = videoPlaybackRate;
    }
  }, [videoPlaybackRate, viewMode]);

  // Story Progress Timer & Auto-advance
  useEffect(() => {
    if (!isAutoPlaying || isHovered) return;

    const intervalStep = 50; // update progress every 50ms
    const stepIncrement = (intervalStep / SCENE_DURATION_MS) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveLookIndex((curr) => (curr + 1) % EDITORIAL_LOOKS.length);
          return 0;
        }
        return prev + stepIncrement;
      });
    }, intervalStep);

    return () => clearInterval(timer);
  }, [isAutoPlaying, isHovered, activeLookIndex]);

  // Switch look manually
  const handleSelectLook = (index: number) => {
    setActiveLookIndex(index);
    setProgress(0);
  };

  const handlePrev = () => {
    setActiveLookIndex((prev) => (prev - 1 + EDITORIAL_LOOKS.length) % EDITORIAL_LOOKS.length);
    setProgress(0);
  };

  const handleNext = () => {
    setActiveLookIndex((prev) => (prev + 1) % EDITORIAL_LOOKS.length);
    setProgress(0);
  };

  return (
    <section
      className="relative w-full h-full min-h-screen overflow-hidden select-none bg-[#0D0B0A] text-white flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Bindy Luxury Resort Editorial Hero"
    >
      {/* ========================================================================= */}
      {/* 1. BACKGROUND MEDIA LAYER: EDITORIAL STILLS (KEN BURNS) OR 4K MOTION FILM */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {viewMode === "stills" ? (
            <motion.div
              key={currentLook.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={currentLook.imageSrc}
                alt={currentLook.title}
                fill
                priority
                sizes="100vw"
                className={`object-cover w-full h-full transition-transform duration-[7000ms] ease-out ${
                  currentLook.imagePositionClass
                } ${prefersReduced ? "" : "hover:scale-105"}`}
              />
            </motion.div>
          ) : (
            <motion.div
              key={`video-${currentLook.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0 w-full h-full"
            >
              <video
                ref={videoRef}
                src={currentLook.videoSrc}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover object-[center_18%] translate-y-10 sm:translate-y-16 scale-110"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================================= */}
        {/* PURE LUXURY EDITORIAL CONTRAST VIGNETTE (NO MURKY COLORED TINT!)          */}
        {/* Keeps models, dresses, scenery 100% natural, crisp, bright & crystal clear*/}
        {/* ========================================================================= */}

        {/* Top subtle vignette behind the fixed navbar for crisp contrast */}
        <div
          className="absolute inset-x-0 top-0 h-44 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0) 100%)",
          }}
        />

        {/* Bottom-Left Directional Radial Vignette: darkens ONLY the zone behind the headline & text */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 90% 75% at 8% 90%, rgba(0, 0, 0, 0.82) 0%, rgba(0, 0, 0, 0.45) 45%, rgba(0, 0, 0, 0) 75%)",
          }}
        />

        {/* Bottom edge fade: gives clean contrast for the timeline progress bars */}
        <div
          className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0) 100%)",
          }}
        />

        {/* Subtle Film Grain Noise Texture */}
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* ========================================================================= */}
      {/* 2. TOP VIP CONTROL BAR: Positioned gracefully BELOW the floating navbar    */}
      {/* ========================================================================= */}
      <div className="relative z-20 w-full pt-[116px] sm:pt-[124px] md:pt-[130px] px-4 sm:px-8 lg:px-12 flex items-center justify-between pointer-events-auto">
        {/* Left: Collection Badge & Scene Counter */}
        <motion.div
          key={`badge-${currentLook.id}`}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border shadow-lg ${currentLook.theme.badgeBg} ${currentLook.theme.badgeBorder}`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest font-semibold text-white">
              Look {currentLook.number} of 05
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
            <span className="text-[11px] tracking-wider text-white/90 hidden md:inline font-sans">
              {currentLook.theme.name}
            </span>
          </div>

          {/* Location Chip */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white/80 font-mono text-xs shadow-md">
            <MapPin className="w-3.5 h-3.5 text-amber-300/80" />
            <span>{currentLook.location}</span>
          </div>
        </motion.div>

        {/* Right: Mode Toggle (Stills / 4K Motion) & Media Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Toggle between Stills and 4K Motion Film */}
          <div className="flex items-center p-1 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 shadow-xl">
            <button
              type="button"
              onClick={() => setViewMode("stills")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium transition-all duration-300 cursor-pointer ${
                viewMode === "stills"
                  ? "bg-white text-black shadow-md font-semibold"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Editorial</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("video")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium transition-all duration-300 cursor-pointer ${
                viewMode === "video"
                  ? "bg-amber-400 text-black shadow-md font-bold"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>4K Motion</span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            </button>
          </div>

          {/* Video Speed Control (Only in Video Mode) */}
          {viewMode === "video" && (
            <button
              type="button"
              onClick={() => setVideoPlaybackRate((prev) => (prev === 1.0 ? 0.75 : 1.0))}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-mono hover:bg-white/10 transition-colors shadow-md"
              title="Toggle Slow Motion"
            >
              <span>{videoPlaybackRate === 1.0 ? "1.0×" : "0.75× SLOW"}</span>
            </button>
          )}

          {/* Audio Mute/Unmute */}
          {toggleAudio && (
            <button
              type="button"
              onClick={toggleAudio}
              className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white transition-colors cursor-pointer shadow-md"
              title={isMuted ? "Unmute Ambient Sound" : "Mute Sound"}
              aria-label="Toggle Sound"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-white/70" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
            </button>
          )}

          {/* Brand Film Launcher */}
          {onWatchFilm && (
            <button
              type="button"
              onClick={onWatchFilm}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-mono text-xs tracking-wider transition-all duration-300 shadow-md cursor-pointer hover:scale-105 active:scale-95"
            >
              <Film className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Brand Film</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. HERO CONTENT THEATER: EDITORIAL TYPOGRAPHY & FLOATING SHOP PILL */}
      {/* ========================================================================= */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-4 sm:py-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6 pointer-events-auto">
        {/* Left Column: High-Impact Poetic Headline & Story */}
        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${currentLook.id}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-3.5"
            >
              {/* Poetic Collection Tag */}
              <div className="flex items-center gap-2">
                <span className="h-px w-8 bg-amber-400/80" />
                <span
                  className={`font-mono text-xs uppercase tracking-[0.25em] font-semibold ${currentLook.theme.accentText}`}
                >
                  {currentLook.tagline}
                </span>
              </div>

              {/* Master Display Headline */}
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-[1.08] drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                {currentLook.title}
              </h1>

              {/* Editorial Excerpt */}
              <p className="font-sans text-sm sm:text-base text-white/90 max-w-xl font-light leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                {currentLook.description}
              </p>

              {/* CTA Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onExploreCollection}
                  className="px-7 py-3 rounded-full bg-white hover:bg-[#FAF7F2] text-black font-serif text-sm tracking-wide font-medium shadow-[0_10px_30px_rgba(255,255,255,0.25)] hover:shadow-[0_15px_35px_rgba(255,255,255,0.35)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2.5 cursor-pointer"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </button>

                <Link
                  href={`/product/${currentLook.slug}`}
                  className="px-6 py-3 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-xl border border-white/30 text-white font-sans text-sm font-medium tracking-wide shadow-lg hover:border-white/60 transition-all duration-300 flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-300" />
                  <span>View Look Details</span>
                  <span className="font-mono text-xs text-white/70 ml-1">(${currentLook.priceAud} AUD)</span>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Column: Floating Shoppable Look Card + Floating Motion Reel PIP */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-end gap-3.5">
          {/* Floating Shoppable Look Card */}
          <motion.div
            key={`card-${currentLook.id}`}
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1.0, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className={`p-4 sm:p-5 rounded-2xl bg-black/60 backdrop-blur-2xl border ${currentLook.theme.badgeBorder} shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-sm w-full sm:w-80 transition-all duration-500`}
            style={{
              boxShadow: `0 15px 35px -10px ${currentLook.theme.glowRgba}`,
            }}
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-[10px] font-mono tracking-widest uppercase text-white/60">
                Featured Silhouette
              </span>
              <span className={`text-[11px] font-mono font-bold ${currentLook.theme.accentText}`}>
                {currentLook.number} / 05
              </span>
            </div>

            <div className="mt-2.5">
              <span className="text-xs text-white/70 font-sans block">{currentLook.category}</span>
              <h4 className="font-serif text-lg text-white font-normal mt-0.5 tracking-wide line-clamp-1">
                {currentLook.title.split("&")[0]}
              </h4>
              <div className="flex items-center justify-between mt-3">
                <span className="font-mono text-base font-bold text-white tracking-wider">
                  ${currentLook.priceAud} <span className="text-xs font-normal text-white/60">AUD</span>
                </span>
                <span className="text-[11px] font-mono text-amber-200/80 bg-white/10 px-2 py-0.5 rounded-full border border-white/10">
                  {currentLook.origin.split("&")[0]}
                </span>
              </div>
            </div>

            <Link
              href={`/product/${currentLook.slug}`}
              className="mt-3.5 w-full py-2 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer group"
            >
              <span>Shop This Piece</span>
              <ArrowRight className="w-3.5 h-3.5 text-white/70 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Floating Motion Reel PIP (Picture-In-Picture loop) */}
          <div
            className="relative rounded-2xl overflow-hidden border border-white/30 bg-black/60 backdrop-blur-xl shadow-2xl w-36 h-24 sm:w-44 sm:h-28 group cursor-pointer"
            onClick={() => setViewMode((prev) => (prev === "stills" ? "video" : "stills"))}
            title="Click to toggle full 4K motion video"
          >
            <video
              ref={pipVideoRef}
              src={currentLook.videoSrc}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
            
            <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[9px] uppercase tracking-wider text-white font-bold">
                {viewMode === "stills" ? "Motion Reel" : "Now Playing"}
              </span>
            </div>

            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white/90">
              <span className="text-[10px] font-mono tracking-wider font-semibold">
                {viewMode === "stills" ? "Expand 4K" : "Back to Stills"}
              </span>
              <Play className="w-3.5 h-3.5 fill-white text-white group-hover:scale-125 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. BOTTOM STORY CAROUSEL NAVIGATION: TIMELINE BARS & LOOK CHIPS */}
      {/* ========================================================================= */}
      <div className="relative z-20 w-full pb-6 px-4 sm:px-8 lg:px-12 pointer-events-auto">
        <div className="max-w-7xl mx-auto space-y-3">
          {/* Segmented Timeline Progress Bars */}
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {EDITORIAL_LOOKS.map((look, idx) => {
              const isActive = idx === activeLookIndex;
              const isPast = idx < activeLookIndex;

              return (
                <button
                  key={`timeline-${look.id}`}
                  type="button"
                  onClick={() => handleSelectLook(idx)}
                  className="group relative h-1.5 sm:h-2 w-full bg-white/20 rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:h-2.5"
                  title={`Jump to Look ${look.number}: ${look.title}`}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      backgroundColor: look.theme.accentColor,
                      width: isActive ? `${progress}%` : isPast ? "100%" : "0%",
                      transition: isActive ? "width 50ms linear" : "width 300ms ease",
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* Interactive Look Chips Strip + Prev/Next Controls */}
          <div className="flex items-center justify-between gap-3 pt-1">
            {/* 5 Look Chips Strip */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto no-scrollbar py-1">
              {EDITORIAL_LOOKS.map((look, idx) => {
                const isActive = idx === activeLookIndex;

                return (
                  <button
                    key={`chip-${look.id}`}
                    type="button"
                    onClick={() => handleSelectLook(idx)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-300 cursor-pointer whitespace-nowrap border ${
                      isActive
                        ? look.theme.chipActive
                        : "bg-black/45 hover:bg-white/10 text-white/75 hover:text-white border-white/15"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${
                        isActive ? "bg-white text-black" : "bg-white/15 text-white/70"
                      }`}
                    >
                      {look.number}
                    </span>

                    <span className="font-sans font-medium text-xs hidden md:inline">
                      {look.title.split("&")[0].trim()}
                    </span>

                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Play/Pause & Arrow Navigation */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Autoplay Toggle */}
              <button
                type="button"
                onClick={() => setIsAutoPlaying((prev) => !prev)}
                className="p-2 rounded-full bg-black/50 hover:bg-white/20 border border-white/20 text-white transition-colors cursor-pointer"
                title={isAutoPlaying ? "Pause Auto-play" : "Resume Auto-play"}
              >
                {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              {/* Prev Button */}
              <button
                type="button"
                onClick={handlePrev}
                className="p-2 rounded-full bg-black/50 hover:bg-white/20 border border-white/20 text-white transition-colors cursor-pointer hover:scale-105 active:scale-95"
                title="Previous Look"
                aria-label="Previous Look"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Next Button */}
              <button
                type="button"
                onClick={handleNext}
                className="p-2 rounded-full bg-black/50 hover:bg-white/20 border border-white/20 text-white transition-colors cursor-pointer hover:scale-105 active:scale-95"
                title="Next Look"
                aria-label="Next Look"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
