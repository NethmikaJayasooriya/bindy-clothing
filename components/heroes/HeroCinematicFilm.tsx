"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  ShoppingBag,
  Eye,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Gauge,
  Film,
  Maximize2,
  Minimize2,
  Compass,
} from "lucide-react";
import { PRODUCTS, type Product, type EnrichedProduct } from "@/data/products";

export interface HeroCinematicFilmProps {
  onExploreCollection?: () => void;
  onWatchFilm?: () => void;
  onAddToCart?: (product: Product, size: string) => void;
  onQuickView?: (product: Product) => void;
  isMuted?: boolean;
  toggleAudio?: () => void;
}

interface VideoScene {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  videoSrc: string;
  location: string;
  fps: string;
  productIds: string[];
}

const SCENES: VideoScene[] = [
  {
    id: 1,
    tag: "RESORT 2026 • SCENE 01",
    title: "Golden Sunlight • Ceylon Courtyard",
    subtitle: "Three women draped in unbleached handloom voile basking in morning amber warmth.",
    videoSrc: "/images/hero vedios/Three_models_posing_in_sunlight_20260920161443.mp4",
    location: "Galle Fort, Sri Lanka",
    fps: "24 FPS • 35mm Voile",
    productIds: ["lotus-memory-dress", "island-pearl-maxi-dress"],
  },
  {
    id: 2,
    tag: "BENTOTA DRIFT • SCENE 02",
    title: "Ocean Tide • Salt-Air Drift",
    subtitle: "Airy silhouettes catching the Indian Ocean breeze along the southern palm coast.",
    videoSrc: "/images/hero vedios/Three_women_posing_on_beach_20260920161745.mp4",
    location: "Bentota Palm Beach",
    fps: "24 FPS • Marine Weave",
    productIds: ["ocean-embraced-tiered-dress", "cinnamon-flow-skirt"],
  },
  {
    id: 3,
    tag: "RUNWAY CADENCE • SCENE 03",
    title: "Motion Harmony • Three Silhouettes",
    subtitle: "Synchronized flow showing the fluid drape and tactile drape of pit-loom cotton.",
    videoSrc: "/images/hero vedios/Three_models_posing_fashion_loop_20260920161505.mp4",
    location: "Colombo Atelier",
    fps: "30 FPS • Master Loom",
    productIds: ["pettah-check-dress", "lotus-memory-dress"],
  },
  {
    id: 4,
    tag: "ATELIER SILHOUETTE • SCENE 04",
    title: "Sculptural Form • High-Summer Voile",
    subtitle: "Intricate hand-pleating and natural cinnamon dyes captured in soft coastal daylight.",
    videoSrc: "/images/hero vedios/Three_women_posing_fashion_loop_20260920161636.mp4",
    location: "Southern Weaving Cooperative",
    fps: "24 FPS • Botanical Dye",
    productIds: ["serendipity-sunset-shirt", "island-pearl-maxi-dress"],
  },
];

export default function HeroCinematicFilm({
  onExploreCollection,
  onWatchFilm,
  onAddToCart,
  onQuickView,
  isMuted = true,
  toggleAudio,
}: HeroCinematicFilmProps) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<1.0 | 0.5>(1.0);
  const [isShopDrawerOpen, setIsShopDrawerOpen] = useState(true);
  const [cinemaBars, setCinemaBars] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const activeScene = SCENES[currentSceneIndex];

  // Match featured products for this scene
  const featuredProducts: EnrichedProduct[] = activeScene.productIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is EnrichedProduct => Boolean(p));

  // Sync playback speed & playing state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [playbackSpeed, isPlaying, currentSceneIndex]);

  // Track video progress
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(pct);
    }
  };

  const handleNextScene = () => {
    setCurrentSceneIndex((prev) => (prev + 1) % SCENES.length);
    setProgress(0);
  };

  const handlePrevScene = () => {
    setCurrentSceneIndex((prev) => (prev - 1 + SCENES.length) % SCENES.length);
    setProgress(0);
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const toggleSpeed = () => {
    setPlaybackSpeed((prev) => (prev === 1.0 ? 0.5 : 1.0));
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#0A0A09] select-none text-white">
      {/* 1. CINEMATIC VIDEO BACKGROUND */}
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScene.videoSrc}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="w-full h-full relative"
          >
            <video
              ref={videoRef}
              src={activeScene.videoSrc}
              autoPlay
              playsInline
              loop
              muted
              onTimeUpdate={handleTimeUpdate}
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* Ambient Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/50 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-vignette opacity-50 pointer-events-none" />
      </div>

      {/* 2. CINEMA LETTERBOX BARS (Aesthetic Runway Mode) */}
      {cinemaBars && (
        <>
          <div className="absolute top-0 inset-x-0 h-9 sm:h-12 bg-black/90 backdrop-blur-md z-20 flex items-center justify-between px-4 sm:px-8 border-b border-white/10 text-[10px] font-mono tracking-widest text-[#DCC7AF]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE CAMPAIGN ROLL</span>
              <span className="text-white/40 hidden sm:inline">•</span>
              <span className="text-white/70 hidden sm:inline">{activeScene.location}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white/80">{activeScene.fps}</span>
              <span className="text-[#C5A059] font-bold">BINDY MOTION 07</span>
            </div>
          </div>
        </>
      )}

      {/* 3. HERO EDITORIAL CONTENT OVERLAY */}
      <div className="relative z-20 w-full h-full flex flex-col justify-between pt-16 sm:pt-20 pb-20 sm:pb-24 px-4 sm:px-8 lg:px-14 max-w-7xl mx-auto">
        {/* Top Floating Badge & Scene Label */}
        <div className="flex items-center justify-between">
          <motion.div
            key={`badge-${activeScene.id}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#C5A059]/40 text-[#C5A059] text-xs font-mono font-bold tracking-wider uppercase shadow-xl"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{activeScene.tag}</span>
          </motion.div>

          {/* Quick Cinema Controls Pill */}
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/15 p-1 rounded-full text-xs font-mono">
            {/* Speed Slow-Mo Toggle */}
            <button
              type="button"
              onClick={toggleSpeed}
              className={`px-2.5 py-1 rounded-full transition-all flex items-center gap-1 ${
                playbackSpeed === 0.5
                  ? "bg-[#C5A059] text-black font-bold shadow"
                  : "text-white/80 hover:text-white"
              }`}
              title="Toggle 0.5x Slow-Motion Dream Drift"
            >
              <Gauge className="w-3 h-3" />
              <span>{playbackSpeed === 0.5 ? "0.5x Dream Drift" : "1.0x Real"}</span>
            </button>

            {/* Audio Toggle */}
            {toggleAudio && (
              <button
                type="button"
                onClick={toggleAudio}
                className="w-7 h-7 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                title={isMuted ? "Unmute Ambient Sound" : "Mute Sound"}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-white/60" /> : <Volume2 className="w-3.5 h-3.5 text-[#C5A059]" />}
              </button>
            )}

            {/* Play / Pause Toggle */}
            <button
              type="button"
              onClick={togglePlayPause}
              className="w-7 h-7 rounded-full bg-white/15 hover:bg-[#C5A059] hover:text-black flex items-center justify-center transition-colors text-white"
              title={isPlaying ? "Pause Video" : "Play Video"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>
          </div>
        </div>

        {/* Center / Lower Left: Editorial Headline & Actions */}
        <div className="max-w-2xl my-auto sm:my-0 sm:mt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${activeScene.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="space-y-3 sm:space-y-4"
            >
              <span className="font-mono text-xs uppercase tracking-widest text-[#DCC7AF] block">
                Australian Design • Sri Lankan Heritage Voile
              </span>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-white leading-tight tracking-tight drop-shadow-lg">
                {activeScene.title.split("•")[0]}
                <span className="italic font-normal block text-[#C5A059]">
                  • {activeScene.title.split("•")[1] || "Ceylon Calm"}
                </span>
              </h1>

              <p className="font-sans text-sm sm:text-base text-[#FAF7F2]/90 max-w-xl font-normal leading-relaxed drop-shadow">
                {activeScene.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-4 sm:pt-6">
            <button
              type="button"
              onClick={onExploreCollection}
              className="px-6 py-3 rounded-full bg-[#FAF7F2] text-[#1F1E1D] hover:bg-[#C5A059] hover:text-black font-outfit text-xs sm:text-sm font-bold tracking-wider uppercase transition-all shadow-xl flex items-center gap-2 group"
            >
              <span>Explore Motion Pieces</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            {onWatchFilm && (
              <button
                type="button"
                onClick={onWatchFilm}
                className="px-5 py-3 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/30 text-white font-mono text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <Film className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Story Film</span>
              </button>
            )}

            {/* Toggle Letterbox */}
            <button
              type="button"
              onClick={() => setCinemaBars((prev) => !prev)}
              className="p-3 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white/80 hover:text-white transition-colors"
              title="Toggle Cinema Letterbox Bars"
            >
              {cinemaBars ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 4. BOTTOM FLOATING BAR: Chapter Scrubber & "Shop The Shot" */}
        <div className="flex flex-col lg:flex-row items-end lg:items-center justify-between gap-4 w-full">
          {/* Chapter Scrubber (4 Scenes) */}
          <div className="w-full lg:max-w-2xl bg-black/70 backdrop-blur-xl border border-white/15 rounded-2xl p-2.5 sm:p-3 shadow-2xl">
            <div className="flex items-center justify-between mb-2 px-1 text-xs font-mono text-[#DCC7AF]">
              <div className="flex items-center gap-2">
                <span className="text-[#C5A059] font-bold">CHAPTER 0{activeScene.id} / 04</span>
                <span className="text-white/40">•</span>
                <span className="truncate">{activeScene.title.split("•")[0]}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevScene}
                  className="p-1 rounded hover:bg-white/10 text-white/80 hover:text-white"
                  title="Previous Scene"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextScene}
                  className="p-1 rounded hover:bg-white/10 text-white/80 hover:text-white"
                  title="Next Scene"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scene Selectors Grid */}
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
              {SCENES.map((sc, idx) => {
                const isActive = idx === currentSceneIndex;
                return (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => {
                      setCurrentSceneIndex(idx);
                      setProgress(0);
                    }}
                    className={`relative text-left p-1.5 sm:p-2 rounded-xl border transition-all ${
                      isActive
                        ? "bg-white/20 border-[#C5A059] text-white shadow-md"
                        : "bg-white/5 hover:bg-white/10 border-white/10 text-white/60 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold mb-1">
                      <span>0{sc.id}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-ping" />
                      )}
                    </div>
                    <p className="text-[11px] font-sans font-medium line-clamp-1 leading-tight text-left">
                      {sc.title.split("•")[0].trim()}
                    </p>

                    {/* Progress Bar under active chapter */}
                    {isActive && (
                      <div className="w-full h-0.5 bg-white/20 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="h-full bg-[#C5A059] transition-all duration-200 ease-linear"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: "Shop The Shot" Floating Hotspot Card */}
          {featuredProducts.length > 0 && (
            <div className="w-full sm:w-auto self-end">
              <div className="bg-black/75 backdrop-blur-xl border border-[#C5A059]/40 rounded-2xl p-3 shadow-2xl flex flex-col gap-2 sm:min-w-[280px]">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-[#C5A059] font-bold">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>WORN IN THIS SCENE</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsShopDrawerOpen((prev) => !prev)}
                    className="text-[10px] text-white/60 hover:text-white underline font-mono"
                  >
                    {isShopDrawerOpen ? "Minimize" : "Expand"}
                  </button>
                </div>

                {isShopDrawerOpen && (
                  <div className="space-y-2 pt-1">
                    {featuredProducts.map((prod) => (
                      <div
                        key={prod.id}
                        className="flex items-center justify-between gap-3 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-10 h-12 object-cover rounded-lg bg-black/40 border border-white/10"
                          />
                          <div>
                            <h4 className="font-serif text-xs text-white font-medium line-clamp-1">
                              {prod.name}
                            </h4>
                            <span className="font-outfit text-xs text-[#C5A059] font-bold">
                              ${prod.priceAud} AUD
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {onQuickView && (
                            <button
                              type="button"
                              onClick={() => onQuickView(prod)}
                              className="p-1.5 rounded-lg bg-white/10 hover:bg-white text-white hover:text-black transition-colors"
                              title="Quick View Piece"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {onAddToCart && (
                            <button
                              type="button"
                              onClick={() =>
                                onAddToCart(prod, prod.sizes[1] || prod.sizes[0] || "AU 8 (S)")
                              }
                              className="px-2.5 py-1 rounded-lg bg-[#C5A059] hover:bg-white text-black font-outfit text-xs font-bold uppercase transition-colors"
                            >
                              Add
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
