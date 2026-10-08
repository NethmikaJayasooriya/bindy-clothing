"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Sparkles } from "lucide-react";
import { PRODUCTS, type Category } from "@/data/products";

interface CategoryStoryBarProps {
  activeCategory: Category | "All";
  onSelectCategory: (category: Category | "All") => void;
}

interface StoryItem {
  id: Category | "All";
  name: string;
  image: string;
  count?: number;
}

export default function CategoryStoryBar({
  activeCategory,
  onSelectCategory,
}: CategoryStoryBarProps) {
  const stories: StoryItem[] = [
    {
      id: "All",
      name: "All Pieces",
      image: "/images/campaign/together.webp",
      count: PRODUCTS.length,
    },
    {
      id: "Dresses",
      name: "Dresses",
      image: "/images/customer-capsule/editorial/rose-stripe-strapless-dress.webp",
      count: PRODUCTS.filter((p) => p.category === "Dresses").length,
    },
    {
      id: "Tops & Blouses",
      name: "Tops & Blouses",
      image: "/images/customer-capsule/editorial/cacao-satin-cami.webp",
      count: PRODUCTS.filter((p) => p.category === "Tops & Blouses").length,
    },
    {
      id: "Skirts & Pants",
      name: "Skirts & Pants",
      image: "/images/customer-capsule/editorial/ivory-tiered-maxi-skirt.webp",
      count: PRODUCTS.filter((p) => p.category === "Skirts & Pants").length,
    },
    {
      id: "Two Piece Sets",
      name: "Two-Piece Sets",
      image: "/images/serendipity/tea-leaf-two-piece.jpg",
      count: PRODUCTS.filter((p) => p.category === "Two Piece Sets").length,
    },
  ];

  const handleClick = (story: StoryItem) => {
    onSelectCategory(story.id);
  };

  return (
    <div className="w-full mb-8 sm:mb-12">
      <div className="mb-4 flex items-end justify-between gap-4 border-b border-[#DCC7AF]/65 pb-3">
        <div>
          <p className="mb-1 flex items-center gap-2 text-[10px] font-mono font-semibold uppercase tracking-[0.24em] text-[#9A7535]">
            <Sparkles className="h-3.5 w-3.5" />
            Find your silhouette
          </p>
          <h3 className="font-serif text-2xl font-light text-[#1F1E1D] sm:text-3xl">
            Shop the wardrobe your way
          </h3>
        </div>
        <p className="hidden max-w-sm text-right text-xs leading-relaxed text-charcoal-subtle md:block">
          Choose a chapter to reveal every available piece instantly.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {stories.map((story) => {
          const isActive = activeCategory === story.id;

          return (
            <motion.button
              key={story.id}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => handleClick(story)}
              aria-pressed={isActive}
              className={`group relative min-h-[168px] overflow-hidden rounded-[1.2rem] border text-left shadow-sm transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059] sm:min-h-[220px] ${
                isActive
                  ? "border-[#C5A059] ring-2 ring-[#C5A059]/45 shadow-[0_14px_34px_rgba(31,30,29,0.18)]"
                  : "border-white/70 hover:border-[#C5A059]/70 hover:shadow-[0_14px_30px_rgba(31,30,29,0.14)]"
              }`}
            >
              <img
                src={story.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/18 to-black/5" />
              <div className="absolute inset-x-0 bottom-0 p-3.5 text-white sm:p-5">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-white/75 sm:text-[10px]">
                    {story.count} pieces
                  </span>
                  <span className={`grid h-7 w-7 place-items-center rounded-full border transition-colors ${isActive ? "border-[#E6C98A] bg-[#C5A059] text-[#1F1E1D]" : "border-white/45 bg-black/20 text-white"}`}>
                    {isActive ? <Check className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                  </span>
                </div>
                <span className="block font-serif text-lg leading-tight sm:text-2xl">
                  {story.name}
                </span>
                <span className={`mt-2 block h-px transition-all duration-500 ${isActive ? "w-full bg-[#E6C98A]" : "w-8 bg-white/65 group-hover:w-full"}`} />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
