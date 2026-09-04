"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Check, Plus, ShoppingBag } from "lucide-react";
import { getFeaturedSpotlightProducts, type Product } from "@/data/products";
import { addToCart } from "@/lib/cart";
import { SectionHeading, ProductCard } from "@/components/ui";

export interface SpotlightSectionProps {
  onSelectProduct?: (product: Product) => void;
  onAddToCart?: (product: Product, size: string) => void;
}

export default function SpotlightSection({
  onSelectProduct,
  onAddToCart,
}: SpotlightSectionProps) {
  const spotlightProducts = getFeaturedSpotlightProducts();
  const [activeSizeDropdown, setActiveSizeDropdown] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleQuickAdd = (product: Product, size: string) => {
    if (onAddToCart) {
      onAddToCart(product, size);
    } else {
      addToCart(product, size, 1);
    }
    setAddedId(product.id);
    setActiveSizeDropdown(null);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <section className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-sand/30 bg-paper">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading with Left-Aligned Action */}
        <SectionHeading
          align="left"
          eyebrow="Curated Selection"
          eyebrowIcon={<Sparkles className="w-3 h-3 text-gold" />}
          title="This Week's Spotlight"
          italicWord="Spotlight"
          description="Three signature silhouettes embodying natural Sri Lankan handloom and pure cotton drape."
          action={
            <a
              href="#collection"
              className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.22em] text-charcoal hover:text-gold transition-colors font-semibold group pb-1"
            >
              <span>Explore Full Collection</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </a>
          }
        />

        {/* 3 Spotlight Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {spotlightProducts.map((product) => (
            <div key={product.id} className="relative flex flex-col">
              <ProductCard
                product={product}
                onQuickView={onSelectProduct}
                onQuickAdd={(p, s) => handleQuickAdd(p, s)}
                stockStatus={product.inventoryStatus}
                stockText={product.inventoryStatus === "low_stock" ? "Limited Edition" : undefined}
              />

              {/* "Shop the Look" Quick Size Selection Strip */}
              <div className="mt-3 px-2 flex items-center justify-between">
                <span className="text-[10px] font-sans uppercase tracking-widest text-muted font-medium">
                  Quick Add:
                </span>
                <div className="flex items-center gap-1.5">
                  {product.sizes.slice(0, 4).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleQuickAdd(product, size)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-sans border border-sand/50 bg-paper-light hover:bg-gold hover:text-charcoal hover:border-gold transition-colors cursor-pointer text-charcoal"
                      title={`Quick add size ${size}`}
                    >
                      {size.split(" ")[1] ? size.split(" ")[1].replace(/[()]/g, "") : size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
