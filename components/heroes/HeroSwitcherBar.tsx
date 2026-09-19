"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Layers, ZoomIn, Film, BookOpen, SlidersHorizontal, Tag, ChevronDown, ChevronUp } from "lucide-react";

export interface HeroSwitcherProps {
  currentStyle: number;
  onSelectStyle: (style: number) => void;
}

export const HERO_STYLES = [
  {
    id: 1,
    name: "3D Slice Flip",
    sub: "Issey Miyake",
    icon: Layers,
    badge: "Kinetic",
    desc: "30-slice vertical depth flip with synchronous GSAP reset",
  },
  {
    id: 2,
    name: "Tactile Loupe",
    sub: "Jacquemus / Loewe",
    icon: ZoomIn,
    badge: "Interactive Lens",
    desc: "Split editorial with cursor-following macro weave magnifier",
  },
  {
    id: 3,
    name: "Panorama Filmstrip",
    sub: "Khaite / Bottega",
    icon: Film,
    badge: "Kinetic Slider",
    desc: "Widescreen horizontal filmstrip with parallax depth and frame ticker",
  },
  {
    id: 4,
    name: "Atelier Collage",
    sub: "Bode / Casablanca",
    icon: BookOpen,
    badge: "Moodboard",
    desc: "Artisan scrapbook with interactive floating polaroids & dye notes",
  },
  {
    id: 5,
    name: "Craft Curtain",
    sub: "Lemaire / Aesop",
    icon: SlidersHorizontal,
    badge: "Before & After",
    desc: "Sensory split curtain slider comparing raw botanical dye to runway silk",
  },
  {
    id: 6,
    name: "Shop-the-Scene",
    sub: "Aimé Leon Dore",
    icon: Tag,
    badge: "Live Hotspots",
    desc: "Pulsing garment hotspots on beach editorial with 1-tap quick add",
  },
];

export default function HeroSwitcherBar({ currentStyle, onSelectStyle }: HeroSwitcherProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Keyboard shortcut listener: keys 1 to 6 switch hero
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= HERO_STYLES.length) {
        onSelectStyle(num);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSelectStyle]);

  const activeOption = HERO_STYLES.find((s) => s.id === currentStyle) || HERO_STYLES[0];

  return (
    <div className="fixed top-12 left-1/2 -translate-x-1/2 z-40 pointer-events-auto max-w-[95vw] transition-all duration-300">
      <div className="bg-[#1F1E1D]/90 backdrop-blur-xl border border-[#C5A059]/40 rounded-2xl shadow-2xl p-1.5 sm:p-2 text-white flex flex-col gap-1.5">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between gap-3 px-2 py-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#C5A059] font-bold">
              Hero Experience Switcher
            </span>
            <span className="hidden md:inline-block text-[10px] font-mono text-[#DCC7AF]/60 bg-white/5 px-2 py-0.5 rounded border border-white/10">
              Style {activeOption.id}/6: {activeOption.name} ({activeOption.sub})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden lg:inline text-[9px] font-mono text-white/40">
              [Press 1–6 to toggle]
            </span>
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="text-[#C5A059] hover:text-white p-1 rounded transition-colors text-xs flex items-center gap-1"
              aria-label={isExpanded ? "Collapse Hero Switcher" : "Expand Hero Switcher"}
            >
              {isExpanded ? (
                <>
                  <span className="text-[10px] font-mono hidden sm:inline">Minimize</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span className="text-[10px] font-mono hidden sm:inline">Choose Hero</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Expandable Switcher Pills */}
        {isExpanded && (
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none pb-0.5 pt-1 px-1">
            {HERO_STYLES.map((style) => {
              const isActive = currentStyle === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => onSelectStyle(style.id)}
                  className={`relative flex-shrink-0 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-left transition-all duration-200 border ${
                    isActive
                      ? "bg-[#C5A059] text-[#1F1E1D] border-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.35)] font-semibold scale-[1.02]"
                      : "bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border-white/10 hover:border-white/20"
                  }`}
                  title={`${style.name} (${style.sub}): ${style.desc}`}
                >
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold ${
                      isActive ? "bg-[#1F1E1D] text-[#C5A059]" : "bg-white/10 text-white/70"
                    }`}
                  >
                    {style.id}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs leading-none whitespace-nowrap">{style.name}</span>
                    <span
                      className={`text-[9px] font-mono leading-tight whitespace-nowrap mt-0.5 ${
                        isActive ? "text-[#1F1E1D]/80" : "text-[#DCC7AF]/60"
                      }`}
                    >
                      {style.sub}
                    </span>
                  </div>

                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1F1E1D] ml-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
