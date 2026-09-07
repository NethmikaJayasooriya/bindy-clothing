"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  ArrowUpRight,
  Sparkles,
  Clock,
  Trash2,
  SlidersHorizontal,
  Flame,
  Tag,
  Palette,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Layers,
  Feather,
  Sun,
  Compass,
} from "lucide-react";
import { PRODUCTS, type Product } from "@/data/products";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY = "bindy_recent_searches";

const TRENDING_TAGS = [
  { label: "Lotus Memory", query: "Lotus Memory", icon: Sparkles },
  { label: "Handloom Cotton", query: "Handloom Cotton", icon: Tag },
  { label: "Resort Wear", query: "Resort Wear", icon: Sun },
  { label: "Pure Linen", query: "Linen", icon: Feather },
  { label: "Two Piece Sets", query: "Two Piece Sets", icon: Layers },
  { label: "Beach & Coast", query: "Beach & Coast", icon: Compass },
  { label: "Under $200 AUD", query: "under200", icon: Flame },
];

const COLOR_PALETTES = [
  { name: "Lotus Pink", hex: "#E8B4B8", query: "Lotus Pink", border: "#D48D93" },
  { name: "Cinnamon", hex: "#B86B4B", query: "Cinnamon", border: "#8C4E34" },
  { name: "Ivory Pearl", hex: "#FAF7F2", query: "Ivory", border: "#DCC7AF" },
  { name: "Sigiriya Ochre", hex: "#C5A059", query: "Ochre", border: "#A0803A" },
  { name: "Ceylon Olive", hex: "#5E6D55", query: "Olive", border: "#43503C" },
  { name: "Ocean Indigo", hex: "#4A6B82", query: "Ocean", border: "#324B5C" },
];

const CATEGORY_CARDS = [
  {
    name: "Dresses",
    tagline: "Airy silhouettes & gathered drape",
    image: "/images/serendipity/lotus-memory-dress.jpg",
    categoryFilter: "Dresses",
  },
  {
    name: "Tops & Blouses",
    tagline: "Relaxed resort cuts & hand cutwork",
    image: "/images/serendipity/shore-traces-blouse.jpg",
    categoryFilter: "Tops & Blouses",
  },
  {
    name: "Skirts & Pants",
    tagline: "Liquid movement & tailored ease",
    image: "/images/serendipity/cinnamon-flow-skirt.jpg",
    categoryFilter: "Skirts & Pants",
  },
  {
    name: "Two Piece Sets",
    tagline: "Matching handloom coordinates",
    image: "/images/serendipity/tea-leaf-two-piece.jpg",
    categoryFilter: "Two Piece Sets",
  },
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load recent searches on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch {
      // Ignore local storage error
    }
  }, [isOpen]);

  // Lock body scroll & focus search input on open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setSelectedCategoryFilter("All");
      setSortBy("featured");
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const saveRecentSearch = (term: string) => {
    const clean = term.trim();
    if (!clean || clean.length < 2) return;
    try {
      const updated = [clean, ...recentSearches.filter((t) => t.toLowerCase() !== clean.toLowerCase())].slice(0, 6);
      setRecentSearches(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore local storage error
    }
  };

  const removeRecentSearch = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updated = recentSearches.filter((t) => t !== term);
      setRecentSearches(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore local storage error
    }
  };

  const clearAllRecent = () => {
    try {
      setRecentSearches([]);
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const handleProductSelect = (productId: string) => {
    if (query.trim()) {
      saveRecentSearch(query.trim());
    }
    onClose();
    router.push(`/product/${productId}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query.trim());
    }
  };

  // Filter & Sort Logic
  const cleanQuery = query.trim().toLowerCase();

  const matchingProducts = useMemo(() => {
    if (!cleanQuery) return [];

    let filtered = PRODUCTS.filter((product) => {
      // Special filter for "under $200 AUD"
      if (cleanQuery === "under200") {
        return product.priceAud < 200;
      }

      const inName = product.name.toLowerCase().includes(cleanQuery);
      const inCat = product.category.toLowerCase().includes(cleanQuery);
      const inStory = product.story.toLowerCase().includes(cleanQuery);
      const inPlace = product.storyPlace.toLowerCase().includes(cleanQuery);
      const inFabric = product.fabric.toLowerCase().includes(cleanQuery);
      const inColor = product.colorName.toLowerCase().includes(cleanQuery);
      const inDesc = product.description.toLowerCase().includes(cleanQuery);
      const inDest = product.destinations.some((d) => d.toLowerCase().includes(cleanQuery));
      const inOccasion = product.occasions?.some((o) => o.toLowerCase().includes(cleanQuery));
      const inParent = product.parentCategory?.toLowerCase().includes(cleanQuery);
      const inSub = product.subCategory?.toLowerCase().includes(cleanQuery);

      return (
        inName ||
        inCat ||
        inStory ||
        inPlace ||
        inFabric ||
        inColor ||
        inDesc ||
        inDest ||
        inOccasion ||
        inParent ||
        inSub
      );
    });

    // Apply active category filter tab if selected
    if (selectedCategoryFilter !== "All") {
      filtered = filtered.filter(
        (p) =>
          p.category === selectedCategoryFilter ||
          p.parentCategory === selectedCategoryFilter
      );
    }

    // Apply sorting
    if (sortBy === "price-asc") {
      return [...filtered].sort((a, b) => a.priceAud - b.priceAud);
    } else if (sortBy === "price-desc") {
      return [...filtered].sort((a, b) => b.priceAud - a.priceAud);
    }

    return filtered;
  }, [cleanQuery, selectedCategoryFilter, sortBy]);

  // Unique category counts within current matching results
  const categoryCounts = useMemo(() => {
    if (!cleanQuery) return {};
    const baseMatches = PRODUCTS.filter((product) => {
      if (cleanQuery === "under200") return product.priceAud < 200;
      const inName = product.name.toLowerCase().includes(cleanQuery);
      const inCat = product.category.toLowerCase().includes(cleanQuery);
      const inStory = product.story.toLowerCase().includes(cleanQuery);
      const inFabric = product.fabric.toLowerCase().includes(cleanQuery);
      const inColor = product.colorName.toLowerCase().includes(cleanQuery);
      const inDesc = product.description.toLowerCase().includes(cleanQuery);
      return inName || inCat || inStory || inFabric || inColor || inDesc;
    });

    const counts: Record<string, number> = { All: baseMatches.length };
    baseMatches.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [cleanQuery]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-50 bg-[#1F1E1D]/55 backdrop-blur-xl flex flex-col justify-start items-center p-2 sm:p-4 lg:p-6 text-[#1F1E1D] overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* Centered Modern Luxury Search Panel */}
          <motion.div
            initial={{ scale: 0.97, y: -16, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.97, y: -16, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="w-full max-w-5xl bg-[#FAF7F2] border border-[#DCC7AF]/80 rounded-[28px] sm:rounded-[36px] shadow-[0_30px_90px_rgba(0,0,0,0.22)] flex flex-col overflow-hidden my-auto max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 1. TOP HEADER & HERO SEARCH CAPSULE */}
            <div className="p-4 sm:p-6 lg:p-8 border-b border-[#DCC7AF]/60 bg-gradient-to-b from-white/95 to-[#FAF7F2]/90 backdrop-blur-md">
              
              {/* Top Row: Brand Label & Quick Close */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-lg sm:text-xl text-[#1F1E1D] font-medium tracking-tight">
                    BINDY<span className="text-[#C5A059]">.</span>
                  </span>
                  <span className="text-[#DCC7AF] text-sm">•</span>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#78716A]">
                    Curated Catalogue &amp; Heritage Discoveries
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#DCC7AF]/70 text-[10px] font-mono uppercase tracking-wider text-[#78716A]">
                    ESC to close
                  </span>
                  <button
                    onClick={onClose}
                    className="w-9 h-9 rounded-full bg-[#FAF7F2] hover:bg-[#1F1E1D] hover:text-white border border-[#DCC7AF] text-[#1F1E1D] transition-all flex items-center justify-center cursor-pointer shadow-sm"
                    aria-label="Close search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Elevated Pill Search Container */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="relative flex items-center rounded-2xl sm:rounded-3xl bg-white border border-[#DCC7AF] hover:border-[#C5A059] focus-within:border-[#C5A059] focus-within:ring-4 focus-within:ring-[#C5A059]/15 transition-all duration-300 shadow-sm px-4 sm:px-6 py-3.5 sm:py-4">
                  <Search className="w-5 h-5 sm:w-6 sm:h-6 text-[#C5A059] flex-shrink-0 mr-3.5" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setSelectedCategoryFilter("All");
                    }}
                    placeholder="Search dresses, handloom cotton, linen, stories, hues..."
                    className="w-full bg-transparent font-serif text-lg sm:text-2xl text-[#1F1E1D] placeholder:text-[#78716A]/50 focus:outline-none tracking-normal"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        setSelectedCategoryFilter("All");
                        inputRef.current?.focus();
                      }}
                      className="p-1.5 rounded-full hover:bg-[#FAF7F2] text-[#78716A] hover:text-[#1F1E1D] transition-colors mr-1 cursor-pointer"
                      title="Clear search query"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  {query.trim().length > 0 && (
                    <button
                      type="submit"
                      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1F1E1D] text-white text-[11px] font-mono tracking-wider uppercase hover:bg-[#C5A059] transition-colors ml-2"
                    >
                      <span>Search</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </form>

              {/* Quick Tags & Natural Dye Bar */}
              <div className="mt-4 space-y-2.5">
                
                {/* Recent Searches (if available) */}
                {recentSearches.length > 0 && !cleanQuery && (
                  <div className="flex items-center flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#78716A] mr-1">
                      <Clock className="w-3 h-3 text-[#C5A059]" />
                      <span>Recent:</span>
                    </div>
                    {recentSearches.map((term) => (
                      <div
                        key={term}
                        onClick={() => {
                          setQuery(term);
                          inputRef.current?.focus();
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4EFE6] border border-[#DCC7AF]/60 hover:border-[#1F1E1D] text-[#1F1E1D] text-xs font-serif cursor-pointer group transition-all"
                      >
                        <span>{term}</span>
                        <button
                          type="button"
                          onClick={(e) => removeRecentSearch(term, e)}
                          className="text-[#78716A] hover:text-red-700 opacity-60 group-hover:opacity-100 transition-opacity"
                          title="Remove item"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={clearAllRecent}
                      className="text-[10px] font-mono text-[#78716A] hover:text-[#1F1E1D] underline ml-1 cursor-pointer"
                    >
                      Clear history
                    </button>
                  </div>
                )}

                {/* Trending Curated Tags */}
                <div className="flex items-center flex-wrap gap-2 text-xs">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#78716A] mr-1 font-semibold hidden sm:inline">
                    Trending:
                  </span>
                  {TRENDING_TAGS.map((tag) => {
                    const Icon = tag.icon;
                    return (
                      <button
                        key={tag.label}
                        type="button"
                        onClick={() => {
                          setQuery(tag.query);
                          inputRef.current?.focus();
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-[#FAF7F2] border border-[#DCC7AF]/70 hover:border-[#C5A059] text-[#1F1E1D] hover:text-[#C5A059] text-xs font-sans transition-all duration-200 cursor-pointer shadow-sm"
                      >
                        <Icon className="w-3 h-3 text-[#C5A059]" />
                        <span>{tag.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Sri Lankan Natural Dye & Mood Palette Swatches */}
                {!cleanQuery && (
                  <div className="flex items-center flex-wrap gap-2 pt-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#78716A] mr-1 font-semibold flex items-center gap-1">
                      <Palette className="w-3 h-3 text-[#C5A059]" />
                      <span>Natural Hues:</span>
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {COLOR_PALETTES.map((palette) => (
                        <button
                          key={palette.name}
                          type="button"
                          onClick={() => {
                            setQuery(palette.query);
                            inputRef.current?.focus();
                          }}
                          className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white border border-[#DCC7AF]/70 hover:border-[#1F1E1D] text-xs transition-all shadow-sm group"
                          title={`Discover ${palette.name} pieces`}
                        >
                          <span
                            className="w-3 h-3 rounded-full border shadow-inner flex-shrink-0"
                            style={{ backgroundColor: palette.hex, borderColor: palette.border }}
                          />
                          <span className="text-[11px] font-sans text-[#1F1E1D] group-hover:text-[#C5A059] transition-colors">
                            {palette.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* 2. SCROLLABLE CONTENT BODY */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 custom-scrollbar">
              
              {/* STATE A: LIVE SEARCH RESULTS (QUERY TYPED & MATCHES FOUND) */}
              {cleanQuery && matchingProducts.length > 0 && (
                <div className="space-y-6">
                  
                  {/* Results Subheader with Category Tabs & Sorting */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DCC7AF]/60">
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl text-[#1F1E1D] font-normal">
                        Silhouettes for &ldquo;<span className="italic text-[#C5A059]">{query}</span>&rdquo;
                      </h3>
                      <p className="text-xs font-mono uppercase tracking-wider text-[#78716A] mt-0.5">
                        {matchingProducts.length} {matchingProducts.length === 1 ? "Piece" : "Pieces"} in Current Weaver Allotment
                      </p>
                    </div>

                    {/* Controls: Category Filter Tabs & Sort */}
                    <div className="flex items-center flex-wrap gap-2">
                      {/* Category Chips */}
                      {Object.keys(categoryCounts).length > 2 && (
                        <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#DCC7AF]/60">
                          {Object.entries(categoryCounts).map(([cat, count]) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setSelectedCategoryFilter(cat)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                                selectedCategoryFilter === cat
                                  ? "bg-[#1F1E1D] text-white shadow-sm font-semibold"
                                  : "text-[#78716A] hover:text-[#1F1E1D]"
                              }`}
                            >
                              {cat} ({count})
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Sort Select */}
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-[#DCC7AF] text-xs font-mono uppercase tracking-wider text-[#1F1E1D] focus:outline-none focus:border-[#C5A059] cursor-pointer shadow-sm"
                      >
                        <option value="featured">Sort: Recommended</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                      </select>
                    </div>
                  </div>

                  {/* Garment Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {matchingProducts.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleProductSelect(product.id)}
                        className="group bg-white rounded-2xl p-4 border border-[#DCC7AF]/70 hover:border-[#C5A059] transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1"
                      >
                        {/* Portrait Image with Dual Image Swap */}
                        <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#FAF7F2] relative border border-[#DCC7AF]/40 mb-3.5">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                          {product.imageHover && (
                            <img
                              src={product.imageHover}
                              alt=""
                              aria-hidden="true"
                              className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
                            />
                          )}
                          <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[9px] font-mono uppercase tracking-widest text-[#1F1E1D] font-medium border border-[#DCC7AF]/50">
                            {product.category}
                          </div>
                          <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-[#1F1E1D]/80 backdrop-blur-md text-white text-[10px] font-mono tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            <span>Inspect</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </div>
                        </div>

                        {/* Garment Info */}
                        <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-medium block">
                              {product.story} • {product.storyPlace}
                            </span>
                            <h4 className="font-serif text-base sm:text-lg text-[#1F1E1D] font-medium group-hover:text-[#C5A059] transition-colors line-clamp-1">
                              {product.name}
                            </h4>
                            <p className="text-xs text-[#78716A] line-clamp-1 font-light">
                              {product.fabric}
                            </p>
                          </div>

                          <div className="pt-2 flex items-center justify-between border-t border-[#DCC7AF]/40">
                            <span className="font-serif text-base font-semibold text-[#1F1E1D]">
                              ${product.priceAud} AUD
                            </span>
                            <span className="text-[11px] font-mono uppercase tracking-widest text-[#C5A059] flex items-center gap-1 group-hover:underline">
                              <span>View Garment</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STATE B: NO RESULTS (QUERY TYPED BUT NO DIRECT MATCH) */}
              {cleanQuery && matchingProducts.length === 0 && (
                <div className="py-12 sm:py-16 text-center max-w-lg mx-auto space-y-6">
                  <div className="w-16 h-16 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/40 mx-auto flex items-center justify-center text-[#C5A059] shadow-inner">
                    <Search className="w-7 h-7" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl sm:text-3xl text-[#1F1E1D] font-normal">
                      No silhouettes found for &ldquo;<span className="italic text-[#C5A059]">{query}</span>&rdquo;
                    </h3>
                    <p className="font-serif italic text-sm text-[#78716A] leading-relaxed">
                      Our weavers haven&apos;t crafted a piece matching that exact phrase yet. Try searching by natural textile (&ldquo;Voile&rdquo;, &ldquo;Linen&rdquo;, &ldquo;Silk&rdquo;) or explore our iconic signatures below.
                    </p>
                  </div>

                  {/* Curated Fallback Recommendations */}
                  <div className="pt-4 border-t border-[#DCC7AF]/50 space-y-4">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#78716A] font-semibold block">
                      Recommended Signatures to Explore:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {PRODUCTS.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleProductSelect(item.id)}
                          className="p-2.5 rounded-xl bg-white border border-[#DCC7AF]/70 hover:border-[#C5A059] text-left cursor-pointer transition-all flex items-center gap-2.5 group"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-14 rounded-lg object-cover bg-[#FAF7F2]"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-serif text-xs text-[#1F1E1D] font-medium truncate group-hover:text-[#C5A059]">
                              {item.name}
                            </p>
                            <p className="text-[11px] font-mono text-[#78716A]">
                              ${item.priceAud} AUD
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        router.push("/collection");
                      }}
                      className="px-6 py-3 rounded-full bg-[#1F1E1D] text-white hover:bg-[#C5A059] font-mono text-xs uppercase tracking-widest transition-all shadow-md cursor-pointer"
                    >
                      Browse Entire Collection
                    </button>
                  </div>
                </div>
              )}

              {/* STATE C: EMPTY QUERY (RICH EDITORIAL EXPLORATION) */}
              {!cleanQuery && (
                <div className="space-y-10">
                  
                  {/* Category Visual Exploration */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#C5A059]" />
                        <h4 className="font-serif text-lg sm:text-xl text-[#1F1E1D] font-medium">
                          Browse by Signature Silhouettes
                        </h4>
                      </div>
                      <span className="text-xs font-mono text-[#78716A]">
                        {PRODUCTS.length} Total Handloom Pieces
                      </span>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      {CATEGORY_CARDS.map((cat) => {
                        const count = PRODUCTS.filter((p) => p.category === cat.categoryFilter).length;
                        return (
                          <button
                            key={cat.name}
                            type="button"
                            onClick={() => {
                              setQuery(cat.categoryFilter);
                              inputRef.current?.focus();
                            }}
                            className="group relative h-48 sm:h-56 rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#DCC7AF]/80 hover:border-[#C5A059] text-left transition-all duration-500 shadow-sm hover:shadow-xl cursor-pointer"
                          >
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                            {/* Rich Scrim Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/5 group-hover:from-black/75 transition-colors" />

                            {/* Top Badge */}
                            <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-widest text-[#C5A059] border border-white/15">
                              {count} Styles
                            </div>

                            {/* Bottom Content */}
                            <div className="absolute inset-x-0 bottom-0 p-3.5 space-y-1">
                              <h5 className="font-serif text-lg sm:text-xl text-white font-medium group-hover:text-[#C5A059] transition-colors leading-tight">
                                {cat.name}
                              </h5>
                              <p className="text-[11px] font-sans text-white/80 line-clamp-1 font-light">
                                {cat.tagline}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Featured Spotlight Highlights */}
                  <div className="space-y-4 pt-4 border-t border-[#DCC7AF]/60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-[#C5A059]" />
                        <h4 className="font-serif text-lg sm:text-xl text-[#1F1E1D] font-medium">
                          Iconic Handloom Signatures
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-medium">
                        Origins 01 • Serendipity
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {PRODUCTS.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleProductSelect(item.id)}
                          className="group p-3 rounded-2xl bg-white border border-[#DCC7AF]/70 hover:border-[#C5A059] cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-3.5"
                        >
                          <div className="w-16 h-20 rounded-xl overflow-hidden bg-[#FAF7F2] flex-shrink-0 border border-[#DCC7AF]/40">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="min-w-0 flex-1 space-y-0.5">
                            <span className="text-[9px] font-mono uppercase tracking-widest text-[#C5A059] block truncate font-medium">
                              {item.storyPlace}
                            </span>
                            <p className="font-serif text-sm sm:text-base text-[#1F1E1D] font-medium truncate group-hover:text-[#C5A059] transition-colors">
                              {item.name}
                            </p>
                            <p className="text-xs text-[#78716A] truncate">
                              {item.fabric}
                            </p>
                            <p className="font-serif text-sm font-semibold text-[#1F1E1D] pt-0.5">
                              ${item.priceAud} AUD
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* 3. BOTTOM FOOTER REASSURANCE */}
            <div className="px-4 sm:px-6 lg:px-8 py-3.5 bg-gradient-to-r from-[#FAF7F2] via-[#F4EFE6] to-[#FAF7F2] border-t border-[#DCC7AF]/60 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono uppercase tracking-wider text-[#78716A]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Complimentary Carbon-Neutral AU Shipping Over $200</span>
              </div>
              <div className="flex items-center gap-4">
                <span>30-Day Easy AU Returns</span>
                <span>•</span>
                <span>Two Islands, One Thread</span>
              </div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
