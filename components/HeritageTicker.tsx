"use client";

import React, { useState } from "react";
import Image from "next/image";

export interface ArtisanButton {
  id: string;
  name: string;
  material: string;
  origin: string;
  src: string;
}

export const ARTISAN_BUTTONS: ArtisanButton[] = [
  {
    id: "b1",
    name: "Sunbeam Carved Teak",
    material: "Hand-Carved Timber",
    origin: "Moratuwa Workshop",
    src: "/images/buttons/b1.png",
  },
  {
    id: "b2",
    name: "Turned Chestnut Wood",
    material: "Sustainable Hardwood",
    origin: "Kandy Woodturners",
    src: "/images/buttons/b2.png",
  },
  {
    id: "b3",
    name: "Mother-of-Pearl Shell",
    material: "Natural River Shell",
    origin: "Mannar Coastal Guild",
    src: "/images/buttons/b3.png",
  },
  {
    id: "b4",
    name: "Raw Palm Coconut Shell",
    material: "Upcycled Coconut Husk",
    origin: "Galle Looms",
    src: "/images/buttons/b4.png",
  },
  {
    id: "b5",
    name: "Sculpted Petal Shell",
    material: "Botanical Carved Shell",
    origin: "Mirissa Atelier",
    src: "/images/buttons/b5.png",
  },
  {
    id: "b6",
    name: "Concentric Ring Teak",
    material: "Turned Plantation Teak",
    origin: "Matale Workshop",
    src: "/images/buttons/b6.png",
  },
];

const TICKER_ITEMS = [
  { text: "Designed in Australia", button: ARTISAN_BUTTONS[0] },
  { text: "Inspired by Sri Lanka", button: ARTISAN_BUTTONS[1] },
  { text: "Authentic Handloom & Voile", button: ARTISAN_BUTTONS[2] },
  { text: "Two Islands, One Thread", button: ARTISAN_BUTTONS[3] },
  { text: "Wear Your Calm, Feel Your Story", button: ARTISAN_BUTTONS[4] },
  { text: "Small Batch Ethical Craft", button: ARTISAN_BUTTONS[5] },
  { text: "Natural Shell & Timber Fasteners", button: ARTISAN_BUTTONS[0] },
  { text: "Simple. Thoughtful. Special.", button: ARTISAN_BUTTONS[3] },
];

export default function HeritageTicker() {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // 4 repetitions guarantees seamless -50% loop across any screen resolution
  const ALL_ITEMS = [
    ...TICKER_ITEMS,
    ...TICKER_ITEMS,
    ...TICKER_ITEMS,
    ...TICKER_ITEMS,
  ];

  return (
    <div className="relative w-full h-[52px] sm:h-[58px] bg-[#181614] border-y border-[#C5A059]/35 flex items-center select-none pause-marquee overflow-x-clip z-20 shadow-md">
      {/* Top Golden Hand-Stitched Guide Rail */}
      <div className="absolute top-0 inset-x-0 h-px border-t border-dashed border-[#C5A059]/35 pointer-events-none" />

      {/* Marquee Track with Rolling Natural Buttons */}
      <div className="flex w-max animate-marquee space-x-8 sm:space-x-12 items-center will-change-transform">
        {ALL_ITEMS.map((item, idx) => {
          const uniqueKey = `${item.button.id}-${idx}`;
          const isHovered = activeTooltip === uniqueKey;

          return (
            <div
              key={idx}
              className="flex items-center space-x-4 sm:space-x-6 flex-shrink-0 relative"
            >
              {/* Rolling Clothing Button with Physics Rotation */}
              <div
                className="relative group cursor-pointer"
                onMouseEnter={() => setActiveTooltip(uniqueKey)}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                {/* Physical Ground Shadow */}
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-6 sm:w-7 h-1.5 bg-black/60 rounded-full blur-[2px] pointer-events-none transition-all duration-300 group-hover:scale-125 group-hover:opacity-80" />

                {/* Rotating Button Image */}
                <div className="relative w-7 h-7 sm:w-8 sm:h-8 transition-all duration-300 ease-out group-hover:scale-125 group-hover:-translate-y-2 z-10">
                  <div className="w-full h-full animate-roll rounded-full">
                    <Image
                      src={item.button.src}
                      alt={item.button.name}
                      width={36}
                      height={36}
                      className="w-full h-full object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)] select-none pointer-events-none"
                    />
                  </div>
                </div>

                {/* Craft Metadata Tooltip */}
                {isHovered && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-black/95 backdrop-blur-xl border border-[#C5A059]/80 px-3 py-1.5 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.7)] whitespace-nowrap text-center">
                      <span className="block text-[8px] font-mono text-[#C5A059] uppercase tracking-wider font-bold">
                        100% Natural Fastener
                      </span>
                      <span className="block text-[10px] font-sans uppercase tracking-[0.15em] text-[#FAF7F2] font-semibold">
                        {item.button.name}
                      </span>
                      <span className="block text-[8px] font-sans text-[#DCC7AF]/85">
                        {item.button.origin} • {item.button.material}
                      </span>
                      {/* Triangle Pointer */}
                      <div className="w-2 h-2 bg-black/95 border-r border-b border-[#C5A059]/80 transform rotate-45 mx-auto -mb-1 mt-0.5" />
                    </div>
                  </div>
                )}
              </div>

              {/* Brand Statement Text */}
              <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.32em] uppercase text-[#EADDCF] font-medium whitespace-nowrap drop-shadow-sm">
                {item.text}
              </span>

              {/* Artisan Golden Star Divider */}
              <span className="text-[#C5A059] text-xs opacity-75">✦</span>
            </div>
          );
        })}
      </div>

      {/* Bottom Subtle Golden Rail */}
      <div className="absolute bottom-0 inset-x-0 h-px border-b border-[#C5A059]/20 pointer-events-none" />
    </div>
  );
}
