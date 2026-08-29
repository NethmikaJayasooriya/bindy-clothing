"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowUpRight, Sparkles } from "lucide-react";
import { PRODUCTS, type Product } from "@/lib/products";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  "Lotus Memory",
  "Handloom Cotton",
  "Voile Dress",
  "Cinnamon Flow",
  "Sigiriya Linen",
  "Two Piece Set",
  "Beach & Coast",
];

const CATEGORY_CARDS = [
  {
    name: "Dresses",
    tagline: "Airy silhouettes & gathered drape",
    image: "/images/serendipity/lotus-memory-dress.jpg",
  },
  {
    name: "Tops & Blouses",
    tagline: "Relaxed resort cuts & hand cutwork",
    image: "/images/serendipity/shore-traces-blouse.jpg",
  },
  {
    name: "Skirts & Pants",
    tagline: "Liquid movement & tailored ease",
    image: "/images/serendipity/cinnamon-flow-skirt.jpg",
  },
  {
    name: "Two Piece Sets",
    tagline: "Matching handloom coordinates",
    image: "/images/serendipity/tea-leaf-two-piece.jpg",
  },
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Auto-focus input when opened & lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 80);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
  }, [isOpen]);

  // Handle ESC key to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Client-side multi-field filtering
  const cleanQuery = query.trim().toLowerCase();
  const matchingProducts = cleanQuery
    ? PRODUCTS.filter((product) => {
        const inName = product.name.toLowerCase().includes(cleanQuery);
        const inCat = product.category.toLowerCase().includes(cleanQuery);
        const inStory = product.story.toLowerCase().includes(cleanQuery);
        const inPlace = product.storyPlace.toLowerCase().includes(cleanQuery);
        const inFabric = product.fabric.toLowerCase().includes(cleanQuery);
        const inColor = product.colorName.toLowerCase().includes(cleanQuery);
        const inDesc = product.description.toLowerCase().includes(cleanQuery);
        const inDest = product.destinations.some((d) =>
          d.toLowerCase().includes(cleanQuery)
        );
        return (
          inName ||
          inCat ||
          inStory ||
          inPlace ||
          inFabric ||
          inColor ||
          inDesc ||
          inDest
        );
      })
    : [];

  const handleProductSelect = (productId: string) => {
    onClose();
    router.push(`/product/${productId}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col text-paper-light"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* Top Bar: Primary Focal Search Input */}
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 sm:pt-12 sm:pb-8 border-b border-sand/20 dark:border-white/10">
            <div className="flex items-center justify-between gap-4 mb-4">
              {/* Primary Search Input with Gold Bottom Rule */}
              <div className="relative flex-1 flex items-center border-b-2 border-white/20 focus-within:border-gold pb-3 sm:pb-4 transition-colors duration-300">
                <Search className="w-6 h-6 sm:w-8 sm:h-8 text-gold flex-shrink-0 mr-4" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search dresses, fabrics, stories..."
                  className="w-full bg-transparent font-serif text-2xl sm:text-4xl text-white placeholder:text-sand/35 focus:outline-none tracking-wide"
                />
                {query && (
                  <button
                    onClick={() => {
                      setQuery("");
                      inputRef.current?.focus();
                    }}
                    className="p-1.5 text-sand/60 hover:text-white transition-colors mr-2 cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-sand hover:text-white transition-all duration-300 flex items-center justify-center cursor-pointer flex-shrink-0"
                aria-label="Close search"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quiet Suggestion Row: Popular Searches */}
            <div className="flex items-center flex-wrap gap-2 text-[10px] sm:text-[11px] font-sans text-sand/60 pt-1">
              <span className="uppercase tracking-widest text-sand/40 mr-1 hidden sm:inline-block">
                Trending:
              </span>
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setQuery(term);
                    inputRef.current?.focus();
                  }}
                  className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-gold/50 text-sand/80 hover:text-white transition-all duration-200 cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Search Content Area (Scrollable) */}
          <div className="flex-1 overflow-y-auto custom-scrollbar w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* 1. STATE: LIVE SEARCH RESULTS */}
            {cleanQuery && matchingProducts.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between text-xs font-sans text-sand/80 uppercase tracking-[0.25em]">
                  <span>
                    Results for &ldquo;<span className="text-gold font-medium">{query}</span>&rdquo;
                  </span>
                  <span className="text-sand/60">
                    {matchingProducts.length} {matchingProducts.length === 1 ? "Piece" : "Pieces"} Found
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {matchingProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductSelect(product.id)}
                      className="group bg-white/5 hover:bg-white/10 rounded-2xl p-3.5 sm:p-4 border border-white/10 hover:border-gold/60 transition-all duration-300 cursor-pointer flex gap-4 items-center shadow-sm hover:shadow-xl"
                    >
                      {/* Generous Thumbnail */}
                      <div className="w-20 sm:w-24 aspect-[3/4] rounded-xl overflow-hidden bg-black/40 flex-shrink-0 relative border border-white/10">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <span className="text-[10px] uppercase font-sans tracking-[0.2em] text-gold/90 block truncate font-medium">
                          {product.story}
                        </span>
                        <h4 className="font-serif text-base sm:text-lg text-paper-light font-medium group-hover:text-gold transition-colors leading-snug truncate">
                          {product.name}
                        </h4>
                        <p className="text-xs font-sans text-sand/70 truncate font-light">
                          {product.fabric}
                        </p>
                        <div className="pt-1.5 flex items-center justify-between">
                          <span className="font-serif text-sm sm:text-base font-semibold text-gold">
                            ${product.priceAud} AUD
                          </span>
                          <span className="text-[10px] font-sans uppercase tracking-wider text-sand/80 group-hover:text-white flex items-center gap-0.5">
                            View <ArrowUpRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. STATE: QUERY TYPED WITH NO MATCHES */}
            {cleanQuery && matchingProducts.length === 0 && (
              <div className="py-16 sm:py-24 text-center max-w-md mx-auto space-y-6">
                <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 mx-auto flex items-center justify-center text-gold shadow-inner">
                  <Search className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl sm:text-3xl text-paper-light font-light">
                    No results for &ldquo;<span className="text-gold">{query}</span>&rdquo;
                  </h3>
                  <p className="font-serif italic text-sm text-sand/75 leading-relaxed font-light">
                    Try searching by garment category, natural textile (&ldquo;Voile&rdquo;, &ldquo;Handloom&rdquo;, &ldquo;Silk&rdquo;), or color hue.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      const el = document.getElementById("collection");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="px-8 py-3.5 rounded-full bg-gold text-black hover:bg-paper-light font-sans text-xs uppercase tracking-[0.2em] font-semibold transition-all shadow-[0_6px_25px_rgba(197,160,89,0.3)] cursor-pointer"
                  >
                    Browse Full Collection
                  </button>
                </div>
              </div>
            )}

            {/* 3. STATE: EMPTY QUERY (Image-Rich Category Tiles & Featured Highlights) */}
            {!cleanQuery && (
              <div className="space-y-12 sm:space-y-14">
                {/* Primary Content: Browse by Category with Real Photography */}
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-sans uppercase tracking-[0.35em] text-gold font-medium">
                      Browse by Category
                    </span>
                    <span className="text-xs font-sans text-sand/50">19 Total Pieces</span>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {CATEGORY_CARDS.map((cat) => {
                      const count = PRODUCTS.filter((p) => p.category === cat.name).length;
                      return (
                        <button
                          key={cat.name}
                          onClick={() => {
                            setQuery(cat.name);
                            inputRef.current?.focus();
                          }}
                          className="group relative h-44 sm:h-52 rounded-2xl overflow-hidden bg-gradient-to-br from-[#26221E] via-[#1A1816] to-[#121110] border border-white/10 hover:border-gold/70 text-left transition-all duration-500 shadow-lg hover:shadow-2xl cursor-pointer"
                        >
                          {/* Background Image with Graceful Error Fallback */}
                          <img
                            src={cat.image}
                            alt={cat.name}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = "none";
                            }}
                            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                          />

                          {/* High-Contrast Gradient Scrim */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:from-black/75 transition-colors" />

                          {/* Top Count Badge */}
                          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9px] font-sans uppercase tracking-widest text-gold border border-white/15">
                            {count} Styles
                          </div>

                          {/* Bottom Content */}
                          <div className="absolute inset-x-0 bottom-0 p-4 space-y-1">
                            <h4 className="font-serif text-xl sm:text-2xl text-white font-medium group-hover:text-gold transition-colors leading-tight">
                              {cat.name}
                            </h4>
                            <p className="text-[11px] font-sans text-sand/80 font-light line-clamp-1">
                              {cat.tagline}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Secondary Content: Featured Highlights */}
                <div className="space-y-5 pt-8 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-sans uppercase tracking-[0.35em] text-sand/60 font-medium">
                      Featured Highlights
                    </span>
                    <span className="text-[10px] font-sans uppercase tracking-wider text-gold">
                      Origins 01
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {PRODUCTS.slice(0, 3).map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => handleProductSelect(prod.id)}
                        className="group flex items-center gap-3.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold/50 cursor-pointer transition-all duration-300"
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-14 h-16 object-cover rounded-xl bg-black/40 border border-white/10 flex-shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <span className="text-[9px] uppercase font-sans tracking-widest text-gold block">
                            {prod.story}
                          </span>
                          <p className="font-serif text-sm sm:text-base text-paper-light truncate font-medium group-hover:text-gold transition-colors">
                            {prod.name}
                          </p>
                          <p className="font-serif text-xs font-semibold text-gold">
                            ${prod.priceAud} AUD
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
