"use client";

import React from "react";
import { Sparkles, ArrowUp, Check, Video } from "lucide-react";

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
  { id: 7, name: "Cinematic Film", brand: "Jacquemus Runway", isVideo: true },
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
    <div className="w-full bg-[#FAF7F2] border-y border-[#DCC7AF]/60 py-3 px-3 sm:px-6 select-none shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left minimal label */}
        <div className="flex items-center justify-between md:justify-start gap-2 flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#B86B4B]" />
            <span className="font-mono text-xs uppercase tracking-wider text-[#1F1E1D] font-bold">
              Hero Concept (1–7):
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#78716A] md:hidden">
            Tap to switch & view top
          </span>
        </div>

        {/* Fully Responsive Wrapping Pill Cluster (Never Clips or Hides Option 7) */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 flex-1">
          {HERO_MINIMAL_OPTIONS.map((opt) => {
            const isActive = currentStyle === opt.id;
            const isVideo = opt.isVideo;

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectAndScroll(opt.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-200 border cursor-pointer ${
                  isActive
                    ? "bg-[#1F1E1D] text-white border-[#1F1E1D] shadow-md font-semibold scale-[1.03] ring-2 ring-[#C5A059]/50"
                    : isVideo
                    ? "bg-[#FAF7F2] hover:bg-white text-[#1F1E1D] border-[#C5A059] font-bold hover:border-[#1F1E1D] shadow-sm animate-pulse hover:animate-none"
                    : "bg-white/90 hover:bg-white text-[#78716A] hover:text-[#1F1E1D] border-[#DCC7AF]/70"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    isActive
                      ? "bg-[#C5A059] text-black"
                      : isVideo
                      ? "bg-[#C5A059] text-black"
                      : "bg-black/5 text-[#78716A]"
                  }`}
                >
                  {isActive ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : opt.id}
                </span>

                <span className="text-[11px] whitespace-nowrap leading-none font-medium">
                  {opt.name}
                </span>

                {isVideo && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#C5A059] text-black text-[9px] font-extrabold tracking-wider uppercase flex items-center gap-0.5 shadow-sm">
                    <Video className="w-2.5 h-2.5" />
                    <span>VIDEO</span>
                  </span>
                )}

                <span
                  className={`text-[8px] uppercase tracking-wider hidden lg:inline opacity-60 ${
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
          className="flex-shrink-0 self-end md:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#1F1E1D] hover:text-white border border-[#DCC7AF] text-[#1F1E1D] text-[11px] font-mono uppercase tracking-wider font-semibold transition-all shadow-sm cursor-pointer"
          title="Scroll up to view active hero"
        >
          <ArrowUp className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Preview Top</span>
        </button>
      </div>
    </div>
  );
}
