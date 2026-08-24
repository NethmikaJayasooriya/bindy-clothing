"use client";

import React from "react";

export default function HeritageTicker() {
  const items = [
    "Designed in Australia",
    "Inspired by Sri Lanka",
    "Authentic Handloom & Voile",
    "Two Islands, One Thread",
    "Wear Your Calm, Feel Your Story",
    "Small Batch Ethical Craft",
    "Simple. Thoughtful. Special.",
  ];

  return (
    <div className="relative w-full bg-[#181614] border-y border-[#C5A059]/20 py-3.5 overflow-hidden select-none">
      <div className="flex w-max animate-marquee space-x-12">
        {[...items, ...items, ...items].map((text, i) => (
          <div key={i} className="flex items-center space-x-6">
            <span className="text-[11px] font-sans tracking-[0.35em] uppercase text-[#DCC7AF]/90">
              {text}
            </span>
            <span className="text-[#C5A059] text-xs">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
