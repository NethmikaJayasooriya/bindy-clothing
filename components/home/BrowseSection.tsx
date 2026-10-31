"use client";
import { useStorefront } from "@/components/StorefrontProvider";

import React, { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import {
  PRODUCTS,
  type Category,
  type Destination,
  type Product,
} from "@/data/products";
import { ProductCard, Button } from "@/components/ui";
import CreativeProductCard from "@/components/ui/CreativeProductCard";
import CategoryStoryBar from "@/components/home/CategoryStoryBar";
import { WardrobeEditorial, WardrobeMission } from "./WardrobeEditorial";
import discoveryStyles from "./WardrobeDiscovery.module.css";

export interface BrowseSectionProps {
  onQuickView: (product: Product) => void;
  onAddToCart?: (product: Product, size: string) => void;
  selectedJourney?: Destination | "All";
  onClearJourney?: () => void;
  isTest?: boolean;
}

export default function BrowseSection({
  onQuickView,
  onAddToCart,
  selectedJourney = "All",
  onClearJourney,
  isTest,
}: BrowseSectionProps) {
  const { products: PRODUCTS } = useStorefront();
  const pathname = usePathname();
  const isTestMode = isTest || pathname === "/test";

  const [activeCollection, setActiveCollection] = useState<"All" | "Serendipity" | "Collection 02">("All");
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");

  const filteredProducts = useMemo(() => {
    const list = PRODUCTS.filter((p) => {
      const matchCat = activeCategory === "All" || p.category === activeCategory;
      const matchJourney = selectedJourney === "All" || p.destinations.includes(selectedJourney);
      const matchCol = activeCollection === "All" || p.collectionName === activeCollection;
      return matchCat && matchJourney && matchCol;
    });

    // In test environment "All" view, pad up to 22 so all 20 creative styles + 2 preserved cards are shown
    if (isTestMode && activeCollection === "All" && activeCategory === "All" && selectedJourney === "All" && list.length < 22) {
      const padded = [...list];
      let i = 0;
      while (padded.length < 22 && list.length > 0) {
        padded.push({ ...list[i % list.length], id: `${list[i % list.length].id}-clone-${padded.length}` });
        i++;
      }
      return padded;
    }
    return list;
  }, [activeCategory, selectedJourney, activeCollection, isTestMode, PRODUCTS]);

  const displayedProducts = filteredProducts;
  const availableProducts = PRODUCTS.filter(p => (activeCollection === "All" || p.collectionName === activeCollection) && (selectedJourney === "All" || p.destinations.includes(selectedJourney)));
  const showMission = !isTestMode && activeCategory === "All" && activeCollection === "All" && selectedJourney === "All" && displayedProducts.length > 8;
  const showProducts = () => window.requestAnimationFrame(() => document.getElementById("wardrobe-products")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }));

  return (
    <section id="browse-collection" className="relative pb-12 sm:pb-16 bg-paper">
      <WardrobeEditorial onSelect={category => { setActiveCategory(category); setActiveCollection("All"); onClearJourney?.(); showProducts(); }}/>
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        {/* Active Journey Filter Chip (if selected from Journey Tiles) */}
        {selectedJourney !== "All" && (
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-xs font-sans text-charcoal-subtle">Filtered by journey:</span>
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
          availableProducts={availableProducts}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            showProducts();
          }}
        />

        <div id="wardrobe-products" className={`${discoveryStyles.collectionHeading} scroll-mt-28`}>
          <div><h2>{activeCategory === "All" ? "The collection." : activeCategory}</h2><p className={discoveryStyles.collectionCount} role="status">{displayedProducts.length} pieces to make your own</p></div>
        {/* Collection Selector Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-3 mt-5 sm:mt-0 overflow-x-auto no-scrollbar px-1 pb-1">
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
                }}
                className={`relative px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-mono uppercase tracking-wider transition-all duration-300 border cursor-pointer select-none whitespace-nowrap flex-shrink-0 ${
                  active
                    ? "bg-[#1F1E1D] text-white border-[#1F1E1D] shadow-md font-semibold"
                    : "bg-white/80 text-charcoal-subtle border-[#DCC7AF]/60 hover:text-[#1F1E1D] hover:border-[#1F1E1D]"
                }`}
              >
                <span>{col.label}</span>
                {col.isNew && (
                  <span className="ml-1.5 px-1.5 py-0.2 text-[10px] sm:text-xs rounded-full bg-[#C5A059] text-white font-bold">
                    NEW
                  </span>
                )}
              </button>
            );
          })}
        </div>

        </div>

        {/* Products Grid: 2-columns on mobile, 4-columns on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          <>
            {displayedProducts.map((product, index) => (
              <React.Fragment key={product.id}>
              <div className="h-full">
                {isTestMode ? (
                  index < 10 ? (
                    // Styles 0 to 9 (First 10 Creative Styles)
                    <CreativeProductCard
                      product={product}
                      index={index}
                      styleVariant={index}
                      onQuickView={onQuickView}
                      onQuickAdd={onAddToCart}
                      stockStatus={product.inventoryStatus}
                      stockText={product.inventoryStatus === "low_stock" ? "Low Stock" : undefined}
                    />
                  ) : index === 10 ? (
                    // Card 11: PRESERVED UNTOUCHED (ProductCard with !rounded-none)
                    <ProductCard
                      product={product}
                      onQuickView={onQuickView}
                      onQuickAdd={onAddToCart}
                      stockStatus={product.inventoryStatus}
                      stockText={product.inventoryStatus === "low_stock" ? "Low Stock" : undefined}
                      className="h-full !rounded-none"
                    />
                  ) : index === 11 ? (
                    // Card 12: PRESERVED UNTOUCHED (Standard ProductCard)
                    <ProductCard
                      product={product}
                      onQuickView={onQuickView}
                      onQuickAdd={onAddToCart}
                      stockStatus={product.inventoryStatus}
                      stockText={product.inventoryStatus === "low_stock" ? "Low Stock" : undefined}
                      className="h-full"
                    />
                  ) : index < 22 ? (
                    // Styles 10 to 19 (Second 10 Creative Styles, reaching 20 total styles!)
                    <CreativeProductCard
                      product={product}
                      index={index}
                      styleVariant={index - 2}
                      onQuickView={onQuickView}
                      onQuickAdd={onAddToCart}
                      stockStatus={product.inventoryStatus}
                      stockText={product.inventoryStatus === "low_stock" ? "Low Stock" : undefined}
                    />
                  ) : (
                    <ProductCard
                      product={product}
                      onQuickView={onQuickView}
                      onQuickAdd={onAddToCart}
                      stockStatus={product.inventoryStatus}
                      stockText={product.inventoryStatus === "low_stock" ? "Low Stock" : undefined}
                      className="h-full"
                    />
                  )
                ) : (
                  <ProductCard
                    product={product}
                    onQuickView={onQuickView}
                    onQuickAdd={onAddToCart}
                    stockStatus={product.inventoryStatus}
                    stockText={product.inventoryStatus === "low_stock" ? "Low Stock" : undefined}
                  />
                )}
              </div>
              {showMission && index === 7 && <div className="col-span-full"><WardrobeMission/></div>}
              </React.Fragment>
            ))}
          </>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-paper-light rounded-3xl border border-sand/40 max-w-xl mx-auto my-8 p-8 space-y-3">
            <p className="font-serif italic text-xl text-charcoal">
              Your story hasn&apos;t started here yet.
            </p>
            <p className="text-xs font-sans text-charcoal-subtle">
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
      </div>
    </section>
  );
}
