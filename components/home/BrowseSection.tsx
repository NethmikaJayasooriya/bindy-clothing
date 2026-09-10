"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Filter, RefreshCw } from "lucide-react";
import {
  PRODUCTS,
  CATEGORIES,
  type Category,
  type Destination,
  type Product,
} from "@/data/products";
import { SectionHeading, ProductCard, Button } from "@/components/ui";
import CategoryStoryBar from "@/components/home/CategoryStoryBar";

export interface BrowseSectionProps {
  onQuickView: (product: Product) => void;
  onAddToCart?: (product: Product, size: string) => void;
  selectedJourney?: Destination | "All";
  onClearJourney?: () => void;
}

export default function BrowseSection({
  onQuickView,
  onAddToCart,
  selectedJourney = "All",
  onClearJourney,
}: BrowseSectionProps) {
  const [activeCollection, setActiveCollection] = useState<"All" | "Serendipity" | "Collection 02">("All");
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [visibleCount, setVisibleCount] = useState(8);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCat = activeCategory === "All" || p.category === activeCategory;
      const matchJourney = selectedJourney === "All" || p.destinations.includes(selectedJourney);
      const matchCol = activeCollection === "All" || p.collectionName === activeCollection;
      return matchCat && matchJourney && matchCol;
    });
  }, [activeCategory, selectedJourney, activeCollection]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  return (
    <section id="browse-collection" className="relative py-24 sm:py-28 px-4 sm:px-6 lg:px-8 bg-paper">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow={
            activeCollection === "Collection 02"
              ? "Collection 02 • New Arrivals"
              : activeCollection === "Serendipity"
              ? "Collection 01 • Serendipity"
              : "Origins • Complete Capsule"
          }
          eyebrowIcon={<Sparkles className="w-3.5 h-3.5 text-gold" />}
          title="Browse by Piece"
          italicWord="Piece"
          description="Handcrafted silhouettes — each one carrying a fragment of Sri Lankan heritage into the Australian wardrobe."
          align="center"
        />

        {/* Collection Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {[
            { key: "All", label: "All Collections" },
            { key: "Serendipity", label: "Collection 01 • Serendipity" },
            { key: "Collection 02", label: "Collection 02", isNew: true },
          ].map((col) => {
            const active = activeCollection === col.key;
            return (
              <button
                key={col.key}
                type="button"
                onClick={() => {
                  setActiveCollection(col.key as any);
                  setVisibleCount(8);
                }}
                className={`relative px-4 sm:px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 border cursor-pointer select-none ${
                  active
                    ? "bg-[#1F1E1D] text-white border-[#1F1E1D] shadow-md font-semibold"
                    : "bg-white/80 text-[#78716A] border-[#DCC7AF]/60 hover:text-[#1F1E1D] hover:border-[#1F1E1D]"
                }`}
              >
                <span>{col.label}</span>
                {col.isNew && (
                  <span className="ml-1.5 px-1.5 py-0.2 text-[9px] rounded-full bg-[#C5A059] text-white font-bold">
                    NEW
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Journey Filter Chip (if selected from Journey Tiles) */}
        {selectedJourney !== "All" && (
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-xs font-sans text-muted">Filtered by journey:</span>
            <span className="inline-flex items-center gap-2 bg-gold/15 border border-gold/30 px-3.5 py-1 rounded-full text-xs font-sans font-semibold text-charcoal">
              <span>{selectedJourney}</span>
              <button
                type="button"
                onClick={onClearJourney}
                className="hover:text-cinnamon cursor-pointer text-sm leading-none ml-1"
                aria-label="Clear journey filter"
              >
                ×
              </button>
            </span>
          </div>
        )}

        {/* High-Fashion 1-Tap Category Story Bar (E-Com Upgrade) */}
        <CategoryStoryBar
          activeCategory={activeCategory}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            setVisibleCount(8);
          }}
        />

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-12 sm:mb-14">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  setVisibleCount(8);
                }}
                className={`px-6 py-2.5 rounded-full text-[11px] font-sans uppercase tracking-[0.24em] transition-all duration-300 border cursor-pointer select-none ${
                  active
                    ? "bg-gold text-charcoal border-gold font-bold shadow-luxury scale-[1.03]"
                    : "bg-paper-light text-charcoal border-sand/40 hover:border-gold hover:text-gold font-medium shadow-sm hover:shadow"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {displayedProducts.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                key={product.id}
              >
                <ProductCard
                  product={product}
                  onQuickView={onQuickView}
                  onQuickAdd={onAddToCart}
                  stockStatus={product.inventoryStatus}
                  stockText={product.inventoryStatus === "low_stock" ? "Low Stock" : undefined}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-paper-light rounded-3xl border border-sand/40 max-w-xl mx-auto my-8 p-8 space-y-3">
            <p className="font-serif italic text-xl text-charcoal">
              Your story hasn&apos;t started here yet.
            </p>
            <p className="text-xs font-sans text-muted">
              No pieces match this category and journey combination. Try selecting All to explore our complete collection.
            </p>
            <div className="pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setActiveCategory("All");
                  onClearJourney?.();
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        )}

        {/* "Load More" Pagination or View Full Collection */}
        {hasMore && (
          <div className="text-center mt-14 sm:mt-16 space-y-3">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setVisibleCount((prev) => prev + 4)}
              leftIcon={<RefreshCw className="w-3.5 h-3.5 text-gold" />}
            >
              Load More Pieces ({filteredProducts.length - visibleCount} Remaining)
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
