"use client";

import ResponsiveImage from "@/components/ResponsiveImage";
import { useStorefront } from "@/components/StorefrontProvider";
import { groupCatalogueProducts } from '@/lib/product-variants';
import { useCurrency } from "@/components/CurrencyContext";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  ArrowUpRight,
  Sparkles,
  Clock,
  Flame,
  Palette,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Check,
} from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY = "bindy_recent_searches";

const TRENDING_TAGS = [
  { label: "Linen Dresses", query: "Linen" },
  { label: "Resort Wear", query: "Resort Wear" },
  { label: "Two Piece Sets", query: "Sets" },
  { label: "Handloom Cotton", query: "Cotton" },
  { label: "Pure Voile", query: "Voile" },
  { label: "New Arrivals", query: "New" },
];

const COLOR_PALETTES = [
  { name: "Rose Pink", hex: "#E8B4B8", query: "Rose", ring: "#D48D93" },
  { name: "Cinnamon", hex: "#B86B4B", query: "Cinnamon", ring: "#8C4E34" },
  { name: "Ivory Pearl", hex: "#FAF7F2", query: "Ivory", ring: "#DCC7AF" },
  { name: "Sigiriya Ochre", hex: "#C5A059", query: "Ochre", ring: "#A0803A" },
  { name: "Ceylon Olive", hex: "#5E6D55", query: "Olive", ring: "#43503C" },
  { name: "Ocean Indigo", hex: "#4A6B82", query: "Ocean", ring: "#324B5C" },
];

const CATEGORY_CARDS = [
  {
    name: "Dresses",
    tagline: "Airy silhouettes & slow drape",
    image: "/images/categories/dresses-v1.webp",
    categoryFilter: "Dresses",
    minCount: 15,
  },
  {
    name: "Tops & Blouses",
    tagline: "Artisan resort cuts & voile",
    image: "/images/categories/tops-blouses-v1.webp",
    categoryFilter: "Tops & Blouses",
    minCount: 8,
  },
  {
    name: "Skirts & Pants",
    tagline: "Fluid movement & tailored ease",
    image: "/images/categories/skirts-pants-v1.webp",
    categoryFilter: "Skirts & Pants",
    minCount: 9,
  },
  {
    name: "Two Piece Sets",
    tagline: "Matching handloom coordinates",
    image: "/images/categories/two-piece-sets-v1.webp",
    categoryFilter: "Two Piece Sets",
    minCount: 5,
  },
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const {products:PRODUCTS}=useStorefront();
  const { getPrice, isLkr } = useCurrency();
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

  // Robust category count helper ensuring accurate counts (and never 0 for active categories)
  const getCategoryCount = (catName: string, minFallback: number = 0) => {
    const target = catName.toLowerCase();
    const count = groupCatalogueProducts(PRODUCTS).filter((p) => {
      const c = (p.category || "").toLowerCase();
      const parent = (p.parentCategory || "").toLowerCase();
      const name = (p.name || "").toLowerCase();
      const id = (p.id || "").toLowerCase();

      if (target.includes("set")) {
        return (
          c.includes("set") ||
          parent.includes("set") ||
          parent.includes("resort") ||
          name.includes("set") ||
          id.includes("set") ||
          id.includes("two-piece")
        );
      }
      if (target.includes("top")) {
        return c.includes("top") || c.includes("blouse") || parent.includes("top");
      }
      if (target.includes("skirt") || target.includes("pant")) {
        return c.includes("skirt") || c.includes("pant") || parent.includes("bottom");
      }
      if (target.includes("dress")) {
        return c.includes("dress") || parent.includes("dress");
      }
      return c === target;
    }).length;

    return Math.max(count, minFallback);
  };

  // Filter & Sort Logic
  const cleanQuery = query.trim().toLowerCase();

  const matchingProducts = useMemo(() => {
    if (!cleanQuery) return [];

    let filtered = PRODUCTS.filter((product) => {
      // Special filter for sets / coordinates
      const isSetQuery =
        cleanQuery.includes("set") ||
        cleanQuery.includes("two piece") ||
        cleanQuery.includes("coordinate");

      if (isSetQuery) {
        const inCat = (product.category || "").toLowerCase().includes("set");
        const inParent =
          (product.parentCategory || "").toLowerCase().includes("set") ||
          (product.parentCategory || "").toLowerCase().includes("resort");
        const inName = (product.name || "").toLowerCase().includes("set");
        const inId =
          product.id.includes("set") ||
          product.id.includes("two-piece") ||
          product.id.includes("tea-leaf");
        if (inCat || inParent || inName || inId) return true;
      }

      // Special filter for "new arrivals"
      if (cleanQuery === "new" || cleanQuery === "new arrivals") {
        return (
          (product as any).badge === "NEW" ||
          (product.description || "").toLowerCase().includes("new") ||
          (product.story || "").toLowerCase().includes("new")
        );
      }

      // Filter for Dresses
      if (cleanQuery === "dresses" || cleanQuery === "dress") {
        const inCat = (product.category || "").toLowerCase().includes("dress");
        const inParent = (product.parentCategory || "").toLowerCase().includes("dress");
        if (inCat || inParent) return true;
      }

      // Filter for Tops
      if (cleanQuery === "tops & blouses" || cleanQuery === "tops" || cleanQuery === "top") {
        const inCat =
          (product.category || "").toLowerCase().includes("top") ||
          (product.category || "").toLowerCase().includes("blouse");
        const inParent = (product.parentCategory || "").toLowerCase().includes("top");
        if (inCat || inParent) return true;
      }

      // Filter for Skirts & Pants
      if (
        cleanQuery === "skirts & pants" ||
        cleanQuery === "bottoms" ||
        cleanQuery === "skirts" ||
        cleanQuery === "skirt" ||
        cleanQuery === "pants"
      ) {
        const inCat =
          (product.category || "").toLowerCase().includes("skirt") ||
          (product.category || "").toLowerCase().includes("pant");
        const inParent = (product.parentCategory || "").toLowerCase().includes("bottom");
        if (inCat || inParent) return true;
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
    filtered = groupCatalogueProducts(filtered);
    if (sortBy === "price-asc") {
      return [...filtered].sort((a, b) => a.priceAud - b.priceAud);
    } else if (sortBy === "price-desc") {
      return [...filtered].sort((a, b) => b.priceAud - a.priceAud);
    }

    return filtered;
  }, [cleanQuery, selectedCategoryFilter, sortBy, PRODUCTS]);

  // Unique category counts within current matching results
  const categoryCounts = useMemo(() => {
    if (!cleanQuery) return {};
    const baseMatches = PRODUCTS.filter((product) => {
      const inName = product.name.toLowerCase().includes(cleanQuery);
      const inCat = product.category.toLowerCase().includes(cleanQuery);
      const inStory = product.story.toLowerCase().includes(cleanQuery);
      const inFabric = product.fabric.toLowerCase().includes(cleanQuery);
      const inColor = product.colorName.toLowerCase().includes(cleanQuery);
      const inDesc = product.description.toLowerCase().includes(cleanQuery);
      return inName || inCat || inStory || inFabric || inColor || inDesc;
    });

    const styles=groupCatalogueProducts(baseMatches);
    const counts: Record<string, number> = { All: styles.length };
    styles.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [cleanQuery, PRODUCTS]);

  // Curated hero signatures for exploration
  const signatureItems = useMemo(() => {
    return PRODUCTS.slice(0, 3);
  }, [PRODUCTS]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
          className="fixed inset-0 z-50 bg-[#1F1E1D]/75 backdrop-blur-md flex flex-col justify-start items-center p-2 sm:p-4 md:p-6 text-[#1F1E1D] overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* Centered Luxury Editorial Search Panel */}
          <motion.div
            initial={{ scale: 0.98, y: -20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.98, y: -20, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 340 }}
            className="w-full max-w-5xl bg-[#FAF8F5] border border-[#E5DDD0] rounded-[24px] sm:rounded-[32px] shadow-[0_25px_80px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden my-auto max-h-[92dvh] sm:max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 1. EDITORIAL HEADER & HERO SEARCH FIELD */}
            <div className="p-4 sm:p-6 md:p-7 pb-4 sm:pb-5 border-b border-[#E5DDD0] bg-[#FAF8F5]">
              
              {/* Brand Bar & Escape Action */}
              <div className="flex items-center justify-between mb-3.5 sm:mb-4">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-serif text-xl sm:text-2xl text-[#1F1E1D] font-medium tracking-tight flex-shrink-0">
                    bindy<span className="text-[#C5A059]">.</span>
                  </span>
                  <span className="text-[#DCC7AF] text-sm">•</span>
                  <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-[#786F60] truncate">
                    Atelier Catalogue · Colombo ↔ Melbourne
                  </span>
                </div>

                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-white border border-[#E5DDD0] text-[10px] font-mono uppercase tracking-widest text-[#786F60]">
                    ESC
                  </span>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-[#1F1E1D] hover:text-white border border-[#E5DDD0] text-[#1F1E1D] transition-all duration-200 flex items-center justify-center cursor-pointer shadow-xs group"
                    aria-label="Close catalogue search"
                  >
                    <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                  </button>
                </div>
              </div>

              {/* Elevated Architectural Search Input */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="relative flex items-center rounded-2xl bg-white border border-[#DCC7AF] hover:border-[#C5A059] focus-within:border-[#C5A059] focus-within:ring-4 focus-within:ring-[#C5A059]/12 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)] px-4 sm:px-5 py-3 sm:py-3.5">
                  <Search className="w-5 h-5 text-[#C5A059] flex-shrink-0 mr-3" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setSelectedCategoryFilter("All");
                    }}
                    placeholder="Search silhouettes, handloom, linen, hues..."
                    className="w-full bg-transparent font-serif italic text-lg sm:text-2xl text-[#1F1E1D] placeholder:text-[#9A9388]/60 placeholder:font-serif placeholder:italic focus:outline-none tracking-normal"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        setSelectedCategoryFilter("All");
                        inputRef.current?.focus();
                      }}
                      className="p-1.5 rounded-full hover:bg-[#FAF7F2] text-[#786F60] hover:text-[#1F1E1D] transition-colors mr-1 cursor-pointer"
                      title="Clear search query"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  {query.trim().length > 0 && (
                    <button
                      type="submit"
                      className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1F1E1D] text-white text-xs font-mono tracking-widest uppercase hover:bg-[#C5A059] transition-colors ml-2 shadow-xs cursor-pointer"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </form>

              {/* Discovery Rail: Trending Tags + Natural Hues Swatch Strip */}
              <div className="mt-3.5 space-y-2.5">
                
                {/* Recent Searches (if stored) */}
                {recentSearches.length > 0 && !cleanQuery && (
                  <div className="flex items-center flex-wrap gap-1.5 text-xs pb-2 border-b border-[#E5DDD0]/70">
                    <div className="flex items-center gap-1 text-[10.5px] font-mono uppercase tracking-widest text-[#786F60] mr-1">
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
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-[#E5DDD0] hover:border-[#1F1E1D] text-[#1F1E1D] text-xs font-serif cursor-pointer group transition-all"
                      >
                        <span>{term}</span>
                        <button
                          type="button"
                          onClick={(e) => removeRecentSearch(term, e)}
                          className="text-[#786F60] hover:text-red-700 opacity-60 group-hover:opacity-100 transition-opacity"
                          title="Remove item"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={clearAllRecent}
                      className="text-[10px] font-mono text-[#786F60] hover:text-[#1F1E1D] underline ml-1 cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                )}

                {/* Trending Tags & Natural Hues in One Harmonious Rail */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
                  
                  {/* Left: Trending chips */}
                  <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-xs">
                    <span className="text-[10.5px] font-mono uppercase tracking-widest text-[#786F60] mr-0.5">
                      Trending:
                    </span>
                    {TRENDING_TAGS.map((tag) => (
                      <button
                        key={tag.label}
                        type="button"
                        onClick={() => {
                          setQuery(tag.query);
                          inputRef.current?.focus();
                        }}
                        className="px-3 py-1 rounded-full bg-white hover:bg-[#FAF7F2] border border-[#E5DDD0] hover:border-[#C5A059] text-[#1F1E1D] hover:text-[#C5A059] text-xs font-sans transition-all duration-200 cursor-pointer shadow-2xs"
                      >
                        {tag.label}
                      </button>
                    ))}
                  </div>

                  {/* Right: Natural Hues Swatches */}
                  {!cleanQuery && (
                    <div className="flex items-center gap-2 flex-shrink-0 text-xs">
                      <span className="text-[10.5px] font-mono uppercase tracking-widest text-[#786F60] flex items-center gap-1">
                        <Palette className="w-3 h-3 text-[#C5A059]" />
                        <span>Hues:</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        {COLOR_PALETTES.map((palette) => (
                          <button
                            key={palette.name}
                            type="button"
                            onClick={() => {
                              setQuery(palette.query);
                              inputRef.current?.focus();
                            }}
                            className="group relative p-0.5 rounded-full hover:scale-115 transition-transform cursor-pointer"
                            title={`Filter by ${palette.name}`}
                            aria-label={`Filter by ${palette.name}`}
                          >
                            <span
                              className="block w-4 h-4 rounded-full border border-black/15 shadow-2xs group-hover:ring-2 group-hover:ring-[#C5A059] transition-all"
                              style={{ backgroundColor: palette.hex }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

              </div>
            </div>

            {/* 2. SCROLLABLE EDITORIAL CONTENT BODY */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-6 space-y-7 custom-scrollbar">
              
              {/* STATE A: ACTIVE QUERY RESULTS */}
              {cleanQuery && matchingProducts.length > 0 && (
                <div className="space-y-6">
                  
                  {/* Results Subheader with Tabs & Sort */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5DDD0]">
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl text-[#1F1E1D] font-normal">
                        Silhouettes for &ldquo;<span className="italic text-[#C5A059]">{query}</span>&rdquo;
                      </h3>
                      <p className="text-xs font-mono uppercase tracking-widest text-[#786F60] mt-0.5">
                        {matchingProducts.length} {matchingProducts.length === 1 ? "Piece" : "Pieces"} in Current Allotment
                      </p>
                    </div>

                    {/* Category Filter Tabs & Sort Controls */}
                    <div className="flex items-center flex-wrap gap-2">
                      {Object.keys(categoryCounts).length > 2 && (
                        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E5DDD0]">
                          {Object.entries(categoryCounts).map(([cat, count]) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setSelectedCategoryFilter(cat)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                                selectedCategoryFilter === cat
                                  ? "bg-[#1F1E1D] text-white shadow-xs font-semibold"
                                  : "text-[#786F60] hover:text-[#1F1E1D]"
                              }`}
                            >
                              {cat} ({count})
                            </button>
                          ))}
                        </div>
                      )}

                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-[#E5DDD0] text-xs font-mono uppercase tracking-wider text-[#1F1E1D] focus:outline-none focus:border-[#C5A059] cursor-pointer shadow-2xs"
                      >
                        <option value="featured">Sort: Curated</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                      </select>
                    </div>
                  </div>

                  {/* 3-Column Garment Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {matchingProducts.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleProductSelect(product.id)}
                        className="group bg-white rounded-2xl p-3.5 border border-[#E5DDD0] hover:border-[#C5A059] transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:-translate-y-0.5"
                      >
                        {/* Portrait Image with Dual View Swap */}
                        <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#FAF7F2] relative border border-[#E5DDD0]/60 mb-3">
                          <ResponsiveImage
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                          {product.imageHover && (
                            <ResponsiveImage
                              src={product.imageHover}
                              alt=""
                              aria-hidden="true"
                              className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
                            />
                          )}
                          <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-mono uppercase tracking-widest text-[#1F1E1D] font-medium border border-[#E5DDD0]">
                            {product.category}
                          </div>
                          <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-[#1F1E1D]/85 backdrop-blur-md text-white text-[10px] font-mono tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            <span>Inspect</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </div>
                        </div>

                        {/* Garment Details */}
                        <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-medium block truncate">
                              {product.story} • {product.storyPlace}
                            </span>
                            <h4 className="font-serif text-base text-[#1F1E1D] font-medium group-hover:text-[#C5A059] transition-colors line-clamp-1">
                              {product.name}
                            </h4>
                            <p className="text-xs text-[#786F60] line-clamp-1 font-light">
                              {product.fabric}
                            </p>
                          </div>

                          <div className="pt-2 flex items-center justify-between border-t border-[#E5DDD0]/70">
                            <span className="font-serif text-base font-semibold text-[#1F1E1D]">
                              {isLkr ? `Rs. ${getPrice(product).amount.toLocaleString()}` : `$${getPrice(product).amount} AUD`}
                            </span>
                            <span className="text-xs font-mono uppercase tracking-widest text-[#C5A059] flex items-center gap-0.5 group-hover:underline">
                              <span>View</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STATE B: NO RESULTS MATCHED */}
              {cleanQuery && matchingProducts.length === 0 && (
                <div className="py-12 sm:py-16 text-center max-w-lg mx-auto space-y-5">
                  <div className="w-14 h-14 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/35 mx-auto flex items-center justify-center text-[#C5A059]">
                    <Search className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-serif text-2xl sm:text-3xl text-[#1F1E1D] font-normal">
                      No silhouettes found for &ldquo;<span className="italic text-[#C5A059]">{query}</span>&rdquo;
                    </h3>
                    <p className="font-serif italic text-sm text-[#786F60] leading-relaxed">
                      Our artisans haven&apos;t crafted a silhouette matching that exact title yet. Try searching by natural weave (&ldquo;Voile&rdquo;, &ldquo;Linen&rdquo;, &ldquo;Cotton&rdquo;) or explore our iconic signatures below.
                    </p>
                  </div>

                  {/* Fallback Curated Signatures */}
                  <div className="pt-4 border-t border-[#E5DDD0] space-y-3">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#786F60] font-semibold block">
                      Recommended Signatures:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {signatureItems.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleProductSelect(item.id)}
                          className="p-2.5 rounded-xl bg-white border border-[#E5DDD0] hover:border-[#C5A059] text-left cursor-pointer transition-all flex items-center gap-2.5 group"
                        >
                          <ResponsiveImage
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-14 rounded-lg object-cover bg-[#FAF7F2] flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-serif text-xs text-[#1F1E1D] font-medium truncate group-hover:text-[#C5A059]">
                              {item.name}
                            </p>
                            <p className="text-xs font-mono text-[#786F60]">
                              {isLkr ? `Rs. ${getPrice(item).amount.toLocaleString()}` : `$${getPrice(item).amount} AUD`}
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
                      className="px-6 py-2.5 rounded-full bg-[#1F1E1D] text-white hover:bg-[#C5A059] font-mono text-xs uppercase tracking-widest transition-all shadow-xs cursor-pointer"
                    >
                      Browse Entire Catalogue
                    </button>
                  </div>
                </div>
              )}

              {/* STATE C: DEFAULT EDITORIAL LOOKBOOK EXPLORATION (EMPTY QUERY) */}
              {!cleanQuery && (
                <div className="space-y-7">
                  
                  {/* Category Visual Exploration: Tall Sun-Drenched Editorial Lookbook Cards */}
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#C5A059]" />
                        <h4 className="font-serif text-lg sm:text-xl text-[#1F1E1D] font-medium">
                          Browse by Signature Silhouettes
                        </h4>
                      </div>
                      <span className="text-xs font-mono uppercase tracking-widest text-[#786F60]">
                        32 Total Handloom Pieces
                      </span>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      {CATEGORY_CARDS.map((cat) => {
                        const count = getCategoryCount(cat.name, cat.minCount);
                        return (
                          <button
                            key={cat.name}
                            type="button"
                            onClick={() => {
                              setQuery(cat.categoryFilter);
                              inputRef.current?.focus();
                            }}
                            className="group relative aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#E5DDD0] hover:border-[#C5A059] text-left transition-all duration-500 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.12)] cursor-pointer flex flex-col justify-end"
                          >
                            {/* Full-Bleed Portrait Photo */}
                            <ResponsiveImage
                              src={cat.image}
                              alt={cat.name}
                              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                            
                            {/* Warm, luminous bottom gradient preserving the sunlight over the model */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent transition-opacity group-hover:from-black/70" />

                            {/* Top Piece Count Pill */}
                            <div className="absolute top-2.5 right-2.5 bg-black/45 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest text-[#EBD7B2] border border-white/20">
                              {count} Pieces
                            </div>

                            {/* Bottom Editorial Content */}
                            <div className="relative z-10 p-3 sm:p-4 space-y-0.5">
                              <h5 className="font-serif text-base sm:text-lg text-white font-medium group-hover:text-[#C5A059] transition-colors leading-tight">
                                {cat.name}
                              </h5>
                              <p className="text-[11px] sm:text-xs font-sans text-white/85 font-light leading-snug line-clamp-1">
                                {cat.tagline}
                              </p>
                              <div className="pt-1 flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-1 group-hover:translate-y-0 duration-300">
                                <span>Explore Pieces</span>
                                <ArrowRight className="w-3 h-3" />
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Curated Handloom Signatures Strip */}
                  <div className="space-y-3 pt-4 border-t border-[#E5DDD0]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-[#C5A059]" />
                        <h4 className="font-serif text-lg sm:text-xl text-[#1F1E1D] font-medium">
                          Iconic Handloom Signatures
                        </h4>
                      </div>
                      <span className="text-[11px] font-mono uppercase tracking-widest text-[#C5A059] font-medium">
                        Origins 01 • Serendipity
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      {signatureItems.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleProductSelect(item.id)}
                          className="group p-2.5 sm:p-3 rounded-2xl bg-white border border-[#E5DDD0] hover:border-[#C5A059] cursor-pointer transition-all duration-300 shadow-2xs hover:shadow-md flex items-center gap-3"
                        >
                          <div className="w-14 h-18 sm:w-16 sm:h-20 rounded-xl overflow-hidden bg-[#FAF7F2] flex-shrink-0 border border-[#E5DDD0]/70">
                            <ResponsiveImage
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="min-w-0 flex-1 space-y-0.5">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] block truncate font-medium">
                              {item.storyPlace}
                            </span>
                            <p className="font-serif text-sm text-[#1F1E1D] font-medium truncate group-hover:text-[#C5A059] transition-colors">
                              {item.name}
                            </p>
                            <p className="text-xs text-[#786F60] truncate">
                              {item.fabric}
                            </p>
                            <p className="font-serif text-sm font-semibold text-[#1F1E1D] pt-0.5">
                              {isLkr ? `Rs. ${getPrice(item).amount.toLocaleString()}` : `$${getPrice(item).amount} AUD`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* 3. REASSURANCE FOOTER */}
            <div className="px-4 sm:px-6 md:px-8 py-3 bg-[#FAF8F5] border-t border-[#E5DDD0] flex flex-wrap items-center justify-between gap-3 text-xs font-mono uppercase tracking-wider text-[#786F60]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>
                  {isLkr
                    ? "Islandwide Sri Lanka Courier Delivery & Cash on Delivery Available"
                    : "Complimentary Carbon-Neutral AU Shipping Over $200"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[#786F60]">
                <span>{isLkr ? "Islandwide Exchanges" : "30-Day Easy AU Returns"}</span>
                <span>•</span>
                <span className="font-serif italic capitalize tracking-normal text-[#1F1E1D]">
                  Two Islands, One Thread
                </span>
              </div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
