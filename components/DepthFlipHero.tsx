"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import {
  Play,
  Pause,
  ArrowRight,
  RotateCw,
  Volume2,
  VolumeX,
  Sparkles,
  Layers,
  ChevronRight,
} from "lucide-react";

export interface DepthFlipHeroProps {
  onExploreCollection?: () => void;
  onWatchFilm?: () => void;
  isMuted?: boolean;
  toggleAudio?: () => void;
}

const HERO_IMAGES = [
  {
    src: "/images/new-hero/hero-beach-1.jpg",
    title: "Golden Hour Ocean Solitude",
    subtitle: "Organic Handloom Voile & Bias Silk",
    location: "Southern Coast, Sri Lanka",
    tag: "Ancestral Pit-Loom Archive",
  },
  {
    src: "/images/new-hero/hero-beach-2.jpg",
    title: "Island Sun & Coastal Breeze",
    subtitle: "Breathed by Ancestral Craft",
    location: "Bentota Sands, Sri Lanka",
    tag: "Collection 02 • Serendipity",
  },
];

const STRIP_COUNT = 15;

export default function DepthFlipHero({
  onExploreCollection,
  onWatchFilm,
  isMuted = true,
  toggleAudio,
}: DepthFlipHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState<"horizontal" | "vertical">("horizontal");

  const containerRef = useRef<HTMLDivElement>(null);
  const currentStripsRef = useRef<(HTMLDivElement | null)[]>([]);
  const nextStripsRef = useRef<(HTMLDivElement | null)[]>([]);
  const currentShadowsRef = useRef<(HTMLDivElement | null)[]>([]);
  const nextShadowsRef = useRef<(HTMLDivElement | null)[]>([]);

  const nextIndex = (activeIndex + 1) % HERO_IMAGES.length;
  const currentScene = HERO_IMAGES[activeIndex];
  const nextScene = HERO_IMAGES[nextIndex];

  // Core 15-strip 3D Depth Flip execution
  const execute3DFlip = useCallback(
    (targetIndex?: number) => {
      if (isFlipping) return;
      setIsFlipping(true);

      const targetNext = targetIndex !== undefined ? targetIndex : (activeIndex + 1) % HERO_IMAGES.length;
      const container = containerRef.current;
      if (!container) return;

      const { clientWidth, clientHeight } = container;
      const isHoriz = direction === "horizontal";

      // Depth offset calculation: half of strip dimension recessed in -Z axis
      const stripDimension = isHoriz ? clientHeight / STRIP_COUNT : clientWidth / STRIP_COUNT;
      const faceOffset = stripDimension / 2;

      const currentStrips = currentStripsRef.current.filter(Boolean) as HTMLDivElement[];
      const nextStrips = nextStripsRef.current.filter(Boolean) as HTMLDivElement[];
      const currentShadows = currentShadowsRef.current.filter(Boolean) as HTMLDivElement[];
      const nextShadows = nextShadowsRef.current.filter(Boolean) as HTMLDivElement[];

      const faceProps = {
        transformOrigin: `50% 50% -${faceOffset}px`,
        transformPerspective: 1400,
        backfaceVisibility: "hidden" as const,
        force3D: true,
      };

      if (isHoriz) {
        gsap.set(currentStrips, { ...faceProps, rotationX: 0, opacity: 1 });
        gsap.set(nextStrips, { ...faceProps, rotationX: -90, opacity: 1 });
      } else {
        gsap.set(currentStrips, { ...faceProps, rotationY: 0, opacity: 1 });
        gsap.set(nextStrips, { ...faceProps, rotationY: -90, opacity: 1 });
      }

      gsap.set(currentShadows, { opacity: 0 });
      gsap.set(nextShadows, { opacity: 0.7 });

      const tl = gsap.timeline({
        onComplete: () => {
          setActiveIndex(targetNext);
          setIsFlipping(false);

          // Reset faces for the next cycle
          if (isHoriz) {
            gsap.set(currentStrips, { rotationX: 0 });
            gsap.set(nextStrips, { rotationX: -90 });
          } else {
            gsap.set(currentStrips, { rotationY: 0 });
            gsap.set(nextStrips, { rotationY: -90 });
          }
          gsap.set(currentShadows, { opacity: 0 });
          gsap.set(nextShadows, { opacity: 0.7 });
        },
      });

      if (isHoriz) {
        tl.to(
          currentStrips,
          {
            rotationX: 90,
            duration: 1.35,
            ease: "power4.inOut",
            stagger: 0.032,
          },
          0
        ).to(
          nextStrips,
          {
            rotationX: 0,
            duration: 1.35,
            ease: "power4.inOut",
            stagger: 0.032,
          },
          0
        );
      } else {
        tl.to(
          currentStrips,
          {
            rotationY: 90,
            duration: 1.35,
            ease: "power4.inOut",
            stagger: 0.032,
          },
          0
        ).to(
          nextStrips,
          {
            rotationY: 0,
            duration: 1.35,
            ease: "power4.inOut",
            stagger: 0.032,
          },
          0
        );
      }

      // 3D Shadow lighting gradient during turn
      tl.to(
        currentShadows,
        {
          opacity: 0.65,
          duration: 0.8,
          ease: "power2.in",
          stagger: 0.032,
        },
        0
      ).to(
        nextShadows,
        {
          opacity: 0,
          duration: 1.1,
          ease: "power2.out",
          stagger: 0.032,
        },
        0.25
      );
    },
    [activeIndex, isFlipping, direction]
  );

  // Auto-play timer (flips every 6.5 seconds)
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      execute3DFlip();
    }, 6500);
    return () => clearInterval(interval);
  }, [isPlaying, execute3DFlip]);

  const slices = Array.from({ length: STRIP_COUNT }, (_, i) => i);
  const isHoriz = direction === "horizontal";

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100dvh] min-h-[600px] overflow-hidden bg-[#0E0D0C] text-[#FAF7F2] select-none"
      aria-label="BINDY 3D Depth Flip Hero Showcase"
    >
      {/* ========================================================================= */}
      {/* LAYER 1: 15-STRIP 3D KINETIC FLIP VISUAL CANVAS                           */}
      {/* ========================================================================= */}
      <div
        className="absolute inset-0 w-full h-full z-0 overflow-hidden"
        style={{ perspective: 1600 }}
      >
        {slices.map((index) => {
          const stripStyle: React.CSSProperties = isHoriz
            ? {
                position: "absolute",
                top: `${(index / STRIP_COUNT) * 100}%`,
                left: 0,
                width: "100%",
                height: `${100 / STRIP_COUNT + 0.05}%`, // minor subpixel bleed
                overflow: "hidden",
              }
            : {
                position: "absolute",
                top: 0,
                left: `${(index / STRIP_COUNT) * 100}%`,
                width: `${100 / STRIP_COUNT + 0.05}%`,
                height: "100%",
                overflow: "hidden",
              };

          const innerImageStyle: React.CSSProperties = isHoriz
            ? {
                position: "absolute",
                left: 0,
                top: `-${index * 100}%`,
                width: "100%",
                height: `${STRIP_COUNT * 100}%`,
                objectFit: "cover",
              }
            : {
                position: "absolute",
                top: 0,
                left: `-${index * 100}%`,
                width: `${STRIP_COUNT * 100}%`,
                height: "100%",
                objectFit: "cover",
              };

          return (
            <div key={index} style={stripStyle}>
              {/* Current Front Face */}
              <div
                ref={(el) => {
                  currentStripsRef.current[index] = el;
                }}
                className="absolute inset-0 w-full h-full overflow-hidden"
                style={{ transformStyle: "preserve-3d" }}
              >
                <img
                  src={currentScene.src}
                  alt={`Hero ${currentScene.title} slice ${index + 1}`}
                  style={innerImageStyle}
                  className="pointer-events-none select-none"
                  loading="eager"
                />
                {/* 3D Depth lighting overlay */}
                <div
                  ref={(el) => {
                    currentShadowsRef.current[index] = el;
                  }}
                  className="absolute inset-0 bg-black pointer-events-none opacity-0"
                />
              </div>

              {/* Next Target Face */}
              <div
                ref={(el) => {
                  nextStripsRef.current[index] = el;
                }}
                className="absolute inset-0 w-full h-full overflow-hidden"
                style={{ transformStyle: "preserve-3d" }}
              >
                <img
                  src={nextScene.src}
                  alt={`Hero ${nextScene.title} slice ${index + 1}`}
                  style={innerImageStyle}
                  className="pointer-events-none select-none"
                  loading="eager"
                />
                <div
                  ref={(el) => {
                    nextShadowsRef.current[index] = el;
                  }}
                  className="absolute inset-0 bg-black pointer-events-none opacity-70"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* LAYER 2: CINEMATIC EDITORIAL VIGNETTES & GRADIENTS                        */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/85 via-black/25 to-black/50" />
      <div className="absolute inset-0 z-10 pointer-events-none bg-radial-vignette opacity-70" />

      {/* ========================================================================= */}
      {/* LAYER 3: LUXURY EDITORIAL TYPOGRAPHY & ACTIONS                            */}
      {/* ========================================================================= */}
      <div className="relative z-20 w-full h-full max-w-[1540px] w-[96vw] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between pt-24 sm:pt-28 pb-6 sm:pb-8">
        
        {/* Top Tag & Context */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-[#C5A059]/40 text-xs font-mono text-[#DFBF7A]">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-pulse" />
            <span className="uppercase tracking-widest">{currentScene.tag}</span>
          </div>

          <div className="hidden sm:flex items-center space-x-3 text-xs font-mono text-white/80">
            <span className="text-[#C5A059]">✦ 15-Strip 3D Flip Active</span>
            <span>•</span>
            <span>{currentScene.location}</span>
          </div>
        </div>

        {/* Center Grand Editorial Headlines */}
        <div className="max-w-3xl space-y-4 my-auto">
          <div className="inline-block text-xs font-mono uppercase tracking-[0.3em] text-[#C5A059] font-semibold">
            Two Islands • One Thread
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-[#FAF7F2] leading-[1.08] drop-shadow-lg">
            Ancestral Handloom. <br />
            <span className="italic font-normal text-[#DFBF7A]">
              Breathed by Ocean Air.
            </span>
          </h1>

          <p className="font-sans text-sm sm:text-base text-[#FAF7F2]/90 max-w-xl leading-relaxed drop-shadow-md">
            Generational Sri Lankan pit-loom silks and botanical cotton voiles,
            crafted for the warm Australian coastline with zero electricity and living wages.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 pt-3">
            <button
              onClick={() => {
                if (onExploreCollection) {
                  onExploreCollection();
                } else {
                  const el = document.getElementById("browse-collection");
                  el?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="group inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-xl bg-[#C5A059] hover:bg-[#b89348] text-[#0D0C0B] font-mono text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-xl shadow-[#C5A059]/20 hover:scale-[1.02]"
            >
              <span>Explore The Pieces</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>

            {onWatchFilm && (
              <button
                onClick={onWatchFilm}
                className="inline-flex items-center space-x-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-[#FAF7F2] font-mono text-xs uppercase tracking-wider transition-all duration-300"
              >
                <Play className="w-3.5 h-3.5 fill-current text-[#DFBF7A]" />
                <span>Watch Artisan Film</span>
              </button>
            )}

            {/* Quick 1-Tap 3D Flip Action */}
            <button
              onClick={() => execute3DFlip()}
              disabled={isFlipping}
              className="inline-flex items-center space-x-2 px-4 py-3.5 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md border border-[#C5A059]/50 text-[#DFBF7A] font-mono text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer"
              title="Trigger 15-strip 3D depth flip"
            >
              <RotateCw className={`w-3.5 h-3.5 text-[#C5A059] ${isFlipping ? "animate-spin" : ""}`} />
              <span>Flip Scene 3D</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM DOCK BAR: CONTROLS, SCENE INDEX & AMBIENT TOGGLE                  */}
        {/* ========================================================================= */}
        <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          {/* Left: Scene Indicators */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-[#C5A059] font-bold">0{activeIndex + 1}</span>
              <span className="text-white/40">/</span>
              <span className="text-white/60">0{HERO_IMAGES.length}</span>
            </div>

            <div className="flex items-center space-x-1.5">
              {HERO_IMAGES.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => execute3DFlip(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeIndex
                      ? "w-8 bg-[#C5A059]"
                      : "w-2 bg-white/30 hover:bg-white/60"
                  }`}
                  aria-label={`Jump to scene ${idx + 1}`}
                />
              ))}
            </div>

            <span className="text-white/80 hidden md:inline truncate max-w-xs">
              {currentScene.title}
            </span>
          </div>

          {/* Right: Controls (Direction, Play/Pause, Sound) */}
          <div className="flex items-center space-x-3">
            {/* Slices direction toggle */}
            <button
              onClick={() => setDirection(direction === "horizontal" ? "vertical" : "horizontal")}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-white/70 hover:text-white hover:border-[#C5A059]/40 transition-colors"
              title="Toggle 3D slice orientation"
            >
              <Layers className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="text-[11px] uppercase tracking-wider">
                15 {direction === "horizontal" ? "Rolling" : "Shutter"} Slices
              </span>
            </button>

            {/* Play/Pause Auto Timer */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-lg bg-black/40 border border-white/10 text-white/70 hover:text-white transition-colors"
              title={isPlaying ? "Pause automatic 3D flip" : "Resume auto 3D flip"}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 text-[#C5A059]" />
              ) : (
                <Play className="w-3.5 h-3.5 text-white/70" />
              )}
            </button>

            {/* Sound Toggle */}
            {toggleAudio && (
              <button
                onClick={toggleAudio}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-white/70 hover:text-white transition-colors"
                title="Toggle ambient coast sound"
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-white/50" />
                    <span className="text-[11px]">Sound Off</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span className="text-[11px] text-[#C5A059]">Sound On</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
