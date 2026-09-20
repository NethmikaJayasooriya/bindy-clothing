"use client";

import React from "react";
import { Sparkles, ArrowUp, Check } from "lucide-react";

export interface HeroStyleControlSectionProps {
  currentStyle: number;
  onSelectStyle: (styleId: number) => void;
  onScrollToHero?: () => void;
}

const HERO_MINIMAL_OPTIONS = [
  { id: 1, name: "3D Slice Flip", brand: "Issey Miyake" },
  { id: 2, name: "Tactile Loupe", brand: "Loewe" },
  { id: 3, name: "Panorama Strip", brand: "Bottega" },
  { id: 4, name: "Atelier Moodboard", brand: "Bode" },
  { id: 5, name: "Craft Curtain", brand: "Lemaire" },
  { id: 6, name: "Runway Hotspots", brand: "Aimé Leon Dore" },
];

export default function HeroStyleControlSection({
  currentStyle,
  onSelectStyle,
  onScrollToHero,
}: HeroStyleControlSectionProps) {
  const handleSelectAndScroll = (id: number) => {
    onSelectStyle(id);
    if (onScrollToHero) {
      onScrollToHero();
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full bg-[#FAF7F2] border-y border-[#DCC7AF]/50 py-2.5 px-3 sm:px-6 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left minimal label */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Sparkles className="w-3 h-3 text-[#B86B4B]" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716A] font-semibold hidden xs:inline">
            Hero Concept:
          </span>
        </div>

        {/* Scrollable Minimal Pill Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-1 flex-1">
          {HERO_MINIMAL_OPTIONS.map((opt) => {
            const isActive = currentStyle === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSelectStyle(opt.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono transition-all duration-200 border cursor-pointer ${
                  isActive
                    ? "bg-[#1F1E1D] text-white border-[#1F1E1D] shadow-sm font-semibold scale-[1.02]"
                    : "bg-white/80 hover:bg-white text-[#78716A] hover:text-[#1F1E1D] border-[#DCC7AF]/60"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    isActive ? "bg-[#C5A059] text-black" : "bg-black/5 text-[#78716A]"
                  }`}
                >
                  {isActive ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : opt.id}
                </span>

                <span className="text-[11px] whitespace-nowrap leading-none">
                  {opt.name}
                </span>

                <span
                  className={`text-[8px] uppercase tracking-wider hidden md:inline opacity-60 ${
                    isActive ? "text-[#DCC7AF]" : "text-[#78716A]"
                  }`}
                >
                  ({opt.brand})
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Preview Top Button */}
        <button
          type="button"
          onClick={() => {
            if (onScrollToHero) {
              onScrollToHero();
            } else {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white hover:bg-[#1F1E1D] hover:text-white border border-[#DCC7AF] text-[#1F1E1D] text-[10px] font-mono uppercase tracking-wider font-semibold transition-all shadow-sm"
          title="Scroll up to view active hero"
        >
          <ArrowUp className="w-3 h-3 text-[#C5A059]" />
          <span className="hidden sm:inline">Preview Top</span>
        </button>
      </div>
    </div>
  );
}
