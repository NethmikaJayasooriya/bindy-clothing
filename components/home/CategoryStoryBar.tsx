"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Flame, Layers, Feather, Compass } from "lucide-react";
import { CATEGORIES, PRODUCTS, type Category } from "@/data/products";

interface CategoryStoryBarProps {
  activeCategory: Category | "All";
  onSelectCategory: (category: Category | "All") => void;
  onScrollToFlash?: () => void;
}

interface StoryItem {
  id: Category | "All" | "Flash";
  name: string;
  image: string;
  count?: number;
  badge?: string;
  isSpecial?: boolean;
}

export default function CategoryStoryBar({
  activeCategory,
  onSelectCategory,
  onScrollToFlash,
}: CategoryStoryBarProps) {
  const stories: StoryItem[] = [
    {
      id: "All",
      name: "All Pieces",
      image: "/images/serendipity/lotus-memory-dress.jpg",
      count: PRODUCTS.length,
    },
    {
      id: "Dresses",
      name: "Dresses",
      image: "/images/serendipity/serendib-pearl-dress.jpg",
      count: PRODUCTS.filter((p) => p.category === "Dresses").length,
    },
    {
      id: "Tops & Blouses",
      name: "Tops & Blouses",
      image: "/images/serendipity/shore-traces-blouse.jpg",
      count: PRODUCTS.filter((p) => p.category === "Tops & Blouses").length,
    },
    {
      id: "Skirts & Pants",
      name: "Skirts & Pants",
      image: "/images/serendipity/cinnamon-flow-skirt.jpg",
      count: PRODUCTS.filter((p) => p.category === "Skirts & Pants").length,
    },
    {
      id: "Two Piece Sets",
      name: "Two-Piece",
      image: "/images/serendipity/tea-leaf-two-piece.jpg",
      count: PRODUCTS.filter((p) => p.category === "Two Piece Sets").length,
    },
    {
      id: "Flash",
      name: "Flash Window",
      image: "/images/serendipity/pettah-check-dress.jpg",
      badge: "24H",
      isSpecial: true,
    },
  ];

  const handleClick = (story: StoryItem) => {
    if (story.id === "Flash") {
      if (onScrollToFlash) {
        onScrollToFlash();
      } else {
        const el = document.getElementById("flash-privilege");
        el?.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }
    onSelectCategory(story.id as Category | "All");
  };

  return (
    <div className="w-full py-4 mb-6">
      <div className="flex items-center justify-start sm:justify-center gap-4 sm:gap-6 overflow-x-auto pb-3 pt-1 px-4 no-scrollbar">
        {stories.map((story) => {
          const isActive = activeCategory === story.id;

          return (
            <motion.button
              key={story.id}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleClick(story)}
              className="flex flex-col items-center gap-2 group flex-shrink-0 cursor-pointer focus:outline-none"
            >
              {/* Circular Story Bubble with Animated Ring */}
              <div
                className={`relative w-18 h-18 sm:w-20 sm:h-20 rounded-full p-0.5 transition-all duration-300 ${
                  story.isSpecial
                    ? "bg-gradient-to-tr from-[#B86B4B] via-[#C5A059] to-[#B86B4B] shadow-[0_4px_18px_rgba(184,107,75,0.35)] animate-pulse"
                    : isActive
                    ? "bg-gradient-to-tr from-[#C5A059] via-[#1F1E1D] to-[#C5A059] shadow-[0_4px_18px_rgba(197,160,89,0.3)] ring-2 ring-[#C5A059]/40"
                    : "bg-[#DCC7AF]/50 group-hover:bg-[#C5A059] group-hover:shadow-md"
                }`}
              >
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-white bg-paper-dark relative">
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/15 group-hover:bg-transparent transition-colors" />

                  {/* Special Badge on Bubble */}
                  {story.badge && (
                    <span className="absolute bottom-0 inset-x-0 bg-[#B86B4B] text-white text-[8px] font-mono uppercase tracking-widest text-center py-0.5 font-bold flex items-center justify-center gap-0.5">
                      <Flame className="w-2.5 h-2.5 fill-white" />
                      {story.badge}
                    </span>
                  )}
                </div>

                {/* Micro Count Pill */}
                {story.count !== undefined && (
                  <span
                    className={`absolute -top-1 -right-1 px-1.5 py-0.2 text-[9px] font-mono rounded-full border shadow-sm ${
                      isActive
                        ? "bg-[#1F1E1D] text-white border-[#C5A059]"
                        : "bg-white text-[#78716A] border-[#DCC7AF]"
                    }`}
                  >
                    {story.count}
                  </span>
                )}
              </div>

              {/* Story Title */}
              <div className="text-center">
                <span
                  className={`text-[11px] sm:text-xs font-serif transition-colors block leading-tight ${
                    isActive
                      ? "text-[#1F1E1D] font-bold underline underline-offset-4 decoration-[#C5A059]"
                      : "text-[#78716A] group-hover:text-[#1F1E1D] font-medium"
                  }`}
                >
                  {story.name}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
