"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { ArrowRight, Play, Sparkles, Volume2, VolumeX, MoveHorizontal, Scissors } from "lucide-react";

export interface HeroCraftCurtainProps {
  onExploreCollection?: () => void;
  onWatchFilm?: () => void;
  isMuted?: boolean;
  toggleAudio?: () => void;
}

export default function HeroCraftCurtain({
  onExploreCollection,
  onWatchFilm,
  isMuted = true,
  toggleAudio,
}: HeroCraftCurtainProps) {
  // Slider position from 0 to 100 percent
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(8, Math.min(92, (x / rect.width) * 100));
    setSliderPos(percent);
  }, []);

  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handlePointerMove(e.clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) handlePointerMove(e.touches[0].clientX);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseUp={() => setIsDragging(false)}
      onTouchMove={onTouchMove}
      onTouchEnd={() => setIsDragging(false)}
      className="relative w-full h-full min-h-screen bg-[#11100F] text-[#FAF7F2] overflow-hidden flex flex-col justify-between select-none"
    >
      {/* BACKGROUND LAYER 1: Right Side (The Finished Haute Couture Masterpiece) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/new-hero/hero-beach-2.jpg"
          alt="Finished Runway Look on Beach"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/50 pointer-events-none" />
      </div>

      {/* BACKGROUND LAYER 2: Left Side (The Raw Botanical & Handloom Craft), clipped by sliderPos */}
      <div
        className="absolute inset-y-0 left-0 z-10 overflow-hidden"
        style={{ width: `${sliderPos}%` }}
      >
        <div className="relative w-screen h-full">
          <Image
            src="/images/detail/ocean-embraced-tiered-dress-b.jpg"
            alt="Raw handloom weave and botanical wax process"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/60 pointer-events-none" />
          <div className="absolute inset-0 bg-[#B86B4B]/15 mix-blend-color pointer-events-none" />
        </div>
      </div>

      {/* DRAGGABLE CURTAIN DIVIDER BAR */}
      <div
        className="absolute inset-y-0 z-20 w-1 cursor-ew-resize transition-opacity"
        style={{ left: `${sliderPos}%` }}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
      >
        {/* Golden Glow Divider Line */}
        <div className="absolute inset-y-0 -left-[1px] w-[3px] bg-gradient-to-b from-transparent via-[#C5A059] to-transparent shadow-[0_0_20px_#C5A059]" />

        {/* Center Draggable Knob */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#1F1E1D]/90 backdrop-blur-xl border-2 border-[#C5A059] text-white flex items-center justify-center shadow-[0_0_35px_rgba(0,0,0,0.8),0_0_15px_rgba(197,160,89,0.5)] cursor-ew-resize hover:scale-110 active:scale-95 transition-transform">
          <MoveHorizontal className="w-5 h-5 text-[#C5A059]" />
        </div>

        {/* Tooltip badge */}
        <div className="absolute top-[calc(50%+36px)] -translate-x-1/2 whitespace-nowrap bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-mono uppercase tracking-widest text-[#DCC7AF] border border-white/20 pointer-events-none shadow-xl">
          Drag to Reveal
        </div>
      </div>

      {/* TOP STATUS BAR */}
      <div className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-2 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
          <span className="w-2 h-2 rounded-full bg-[#B86B4B]" />
          <span className="text-[#FAF7F2] font-semibold uppercase tracking-wider text-[10px] sm:text-xs">
            DIOR CRAFT CURTAIN • RAW PIT-LOOM WEFT
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
            <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
            <span className="text-[#FAF7F2] font-semibold uppercase tracking-wider text-[10px] sm:text-xs">
              FINISHED RUNWAY SILHOUETTE
            </span>
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

      {/* CENTER EDITORIAL NARRATIVE */}
      <div className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-auto pointer-events-none">
        <div className="max-w-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#C5A059]/60 text-[#C5A059] font-mono text-[11px] tracking-widest uppercase pointer-events-auto">
            <Scissors className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Chanel Métiers d'Art Transformation</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-white leading-[1.05] drop-shadow-lg">
            From Sacred Earth <br />
            <span className="italic font-normal text-[#FAF7F2]">To Draped Motion</span>
          </h1>

          <p className="font-sans text-xs sm:text-sm text-white/90 max-w-md drop-shadow leading-relaxed">
            Drag the golden divider to experience the slow transformation: unbleached organic pit-loom cotton,
            steeped in natural indigo and wild cinnamon baths, tailored into high-fashion resort silhouettes.
          </p>

          {/* Preset Buttons */}
          <div className="flex items-center gap-2 pt-2 pointer-events-auto">
            <button
              type="button"
              onClick={() => setSliderPos(85)}
              className="px-3.5 py-1.5 rounded-full bg-black/70 hover:bg-black text-xs font-mono border border-white/20 text-[#DCC7AF] transition-colors"
            >
              Show Craft (85%)
            </button>
            <button
              type="button"
              onClick={() => setSliderPos(50)}
              className="px-3.5 py-1.5 rounded-full bg-black/70 hover:bg-black text-xs font-mono border border-[#C5A059]/80 text-[#C5A059] font-bold transition-colors"
            >
              Balanced (50/50)
            </button>
            <button
              type="button"
              onClick={() => setSliderPos(15)}
              className="px-3.5 py-1.5 rounded-full bg-black/70 hover:bg-black text-xs font-mono border border-white/20 text-[#DCC7AF] transition-colors"
            >
              Show Runway (15%)
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="relative z-30 w-full bg-black/80 backdrop-blur-xl border-t border-white/15 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onExploreCollection}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C5A059] hover:bg-[#b08e49] text-black font-sans text-xs uppercase tracking-widest font-bold shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              <span>Shop Transformation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {onWatchFilm && (
              <button
                type="button"
                onClick={onWatchFilm}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-sans text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current text-[#C5A059]" />
                <span>Atelier Cinema</span>
              </button>
            )}
          </div>

          <div className="text-xs font-mono text-white/60 text-right">
            Dior Haute Couture Metamorphic Curtain
          </div>
        </div>
      </div>
    </section>
  );
}
