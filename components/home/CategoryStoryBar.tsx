"use client";
import { useStorefront } from "@/components/StorefrontProvider";

import React from "react";
import Image from "next/image";
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
  const { products: PRODUCTS } = useStorefront();
  const stories: StoryItem[] = [
    {
      id: "All",
      name: "All Pieces",
      image: "/images/categories/all-pieces-v1.webp",
      count: PRODUCTS.length,
    },
    {
      id: "Dresses",
      name: "Dresses",
      image: "/images/categories/dresses-v1.webp",
      count: PRODUCTS.filter((p) => p.category === "Dresses").length,
    },
    {
      id: "Tops & Blouses",
      name: "Tops & Blouses",
      image: "/images/categories/tops-blouses-v1.webp",
      count: PRODUCTS.filter((p) => p.category === "Tops & Blouses").length,
    },
    {
      id: "Skirts & Pants",
      name: "Skirts & Pants",
      image: "/images/categories/skirts-pants-v1.webp",
      count: PRODUCTS.filter((p) => p.category === "Skirts & Pants").length,
    },
    {
      id: "Two Piece Sets",
      name: "Two-Piece Sets",
      image: "/images/categories/two-piece-sets-v1.webp",
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
          Choose a category. Find your next favourite piece.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {stories.map((story) => {
          const isActive = activeCategory === story.id;
          const isOddLast = story.id === "Two Piece Sets";

          return (
            <motion.button
              key={story.id}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => handleClick(story)}
              type="button"
              aria-pressed={isActive}
              className={`group relative overflow-hidden rounded-xl border text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059] focus-visible:ring-offset-4 ${
                isOddLast ? "col-span-2 sm:col-span-1" : ""
              } ${
                isActive
                  ? "border-[#242721] ring-1 ring-[#242721] shadow-[0_10px_26px_rgba(31,30,29,0.10)]"
                  : "border-[#DCC7AF]/60 bg-white hover:border-[#9A7535] hover:shadow-[0_10px_26px_rgba(31,30,29,0.08)]"
              }`}
            >
              <div className="relative aspect-[4/3.8] overflow-hidden bg-[#EEE9E1]">
                <Image
                  src={story.image}
                  alt=""
                  fill
                  sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 250px"
                  className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                />
              </div>
              <div className={`relative flex min-h-[85px] items-center justify-between gap-2 border-t p-3.5 transition-colors sm:px-4 ${isActive ? "border-[#242721] bg-[#242721] text-[#FFFCF5]" : "border-[#DCC7AF]/35 bg-[#FFFCF8] text-[#242721]"}`}>
                <div className="min-w-0">
                  <span className={`mb-1.5 block text-[9px] font-medium uppercase tracking-[0.15em] ${isActive ? "text-[#DED2B9]" : "text-[#8B795B]"}`}>
                    {story.count} pieces
                  </span>
                  <span className="block text-sm font-medium leading-snug tracking-[-0.02em] sm:text-base" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
                    {story.name}
                  </span>
                </div>
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-colors ${isActive ? "border-[#E6C98A] bg-[#D4B67A] text-[#242721]" : "border-[#DCC7AF] text-[#6C624F] group-hover:border-[#9A7535]"}`}>
                  {isActive ? <Check className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
