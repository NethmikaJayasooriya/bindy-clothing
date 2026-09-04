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
    <div className="relative w-full bg-paper-dark border-y border-sand/40 py-2 sm:py-2.5 overflow-hidden select-none">
      <div className="flex w-max animate-marquee space-x-12">
        {[...items, ...items, ...items].map((text, i) => (
          <div key={i} className="flex items-center space-x-6">
            <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.35em] uppercase text-charcoal/80 font-medium">
              {text}
            </span>
            <span className="text-gold text-xs">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
