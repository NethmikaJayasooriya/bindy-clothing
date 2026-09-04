"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Check, ShoppingBag, Sparkles, ArrowRight } from "lucide-react";
import { PRODUCTS, type Product } from "@/data/products";
import { addToCart } from "@/lib/cart";
import { Button } from "@/components/ui";

export interface CompleteTheLookProps {
  currentProduct: Product;
  onAddToCart?: (product: Product, size: string) => void;
}

export default function CompleteTheLook({
  currentProduct,
  onAddToCart,
}: CompleteTheLookProps) {
  const [bundleAdded, setBundleAdded] = useState(false);

  // Pick a natural styling pair (different category if possible)
  const pairedProduct =
    PRODUCTS.find(
      (p) =>
        p.id !== currentProduct.id &&
        p.destinations.some((d) => currentProduct.destinations.includes(d)) &&
        p.category !== currentProduct.category
    ) ||
    PRODUCTS.find((p) => p.id !== currentProduct.id) ||
    PRODUCTS[0];

  // Pick 3 additional related pieces
  const related = PRODUCTS.filter(
    (p) => p.id !== currentProduct.id && p.id !== pairedProduct?.id
  ).slice(0, 3);

  const bundleTotal = currentProduct.priceAud + (pairedProduct?.priceAud || 0);

  const handleAddBundle = () => {
    const currentSize = currentProduct.sizes[1] || currentProduct.sizes[0] || "AU 8 (S)";
    const pairedSize = pairedProduct.sizes[1] || pairedProduct.sizes[0] || "AU 8 (S)";

    if (onAddToCart) {
      onAddToCart(currentProduct, currentSize);
      onAddToCart(pairedProduct, pairedSize);
    } else {
      addToCart(currentProduct, currentSize, 1);
      addToCart(pairedProduct, pairedSize, 1);
    }

    setBundleAdded(true);
    setTimeout(() => setBundleAdded(false), 2400);
  };

  return (
    <section className="py-20 sm:py-24 bg-paper border-b border-sand/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-[10px] font-sans uppercase tracking-[0.35em] text-gold font-semibold block">
            Curated Styling
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal-rich font-light">
            Complete the <span className="font-editorial-italic text-gold">Look</span>
          </h2>
          <p className="font-serif italic text-base text-muted font-light">
            Silhouettes thoughtfully designed to pair together with natural harmony.
          </p>
        </div>

        {/* 1-Click "Add Both to Bag" Bundle Box */}
        {pairedProduct && (
          <div className="max-w-4xl mx-auto mb-16 p-6 sm:p-8 rounded-3xl bg-paper-light border border-sand/50 shadow-paper-card">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
              {/* Product 1 + Connector + Product 2 */}
              <div className="flex items-center gap-4 sm:gap-6 w-full lg:w-auto justify-center">
                {/* Current Product */}
                <div className="flex items-center gap-3">
                  <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl overflow-hidden bg-paper-dark shrink-0 border border-sand/40">
                    <img
                      src={currentProduct.image}
                      alt={currentProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-0.5 max-w-[130px] sm:max-w-[150px]">
                    <span className="text-[9px] uppercase font-sans tracking-wider text-muted block">
                      This Item
                    </span>
                    <p className="font-serif text-xs sm:text-sm font-medium text-charcoal line-clamp-2">
                      {currentProduct.name}
                    </p>
                    <span className="text-xs font-serif font-semibold text-charcoal">
                      ${currentProduct.priceAud} AUD
                    </span>
                  </div>
                </div>

                {/* Plus Icon */}
                <div className="w-8 h-8 rounded-full bg-paper-dark border border-sand/40 flex items-center justify-center shrink-0 text-gold">
                  <Plus className="w-4 h-4" />
                </div>

                {/* Paired Product */}
                <Link
                  href={`/product/${pairedProduct.id}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl overflow-hidden bg-paper-dark shrink-0 border border-sand/40 group-hover:border-gold transition-colors">
                    <img
                      src={pairedProduct.image}
                      alt={pairedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-0.5 max-w-[130px] sm:max-w-[150px]">
                    <span className="text-[9px] uppercase font-sans tracking-wider text-gold font-semibold block">
                      Styled With
                    </span>
                    <p className="font-serif text-xs sm:text-sm font-medium text-charcoal group-hover:text-gold transition-colors line-clamp-2">
                      {pairedProduct.name}
                    </p>
                    <span className="text-xs font-serif font-semibold text-charcoal">
                      ${pairedProduct.priceAud} AUD
                    </span>
                  </div>
                </Link>
              </div>

              {/* Bundle Action Button */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-3 w-full lg:w-auto shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-sand/30 lg:pl-8">
                <div className="text-center lg:text-right">
                  <span className="text-[10px] uppercase font-sans text-muted block tracking-wider">
                    Total Bundle
                  </span>
                  <span className="font-serif text-2xl font-semibold text-charcoal">
                    ${bundleTotal} <span className="text-xs font-sans text-muted">AUD</span>
                  </span>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleAddBundle}
                  className="w-full sm:w-auto"
                  leftIcon={
                    bundleAdded ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <ShoppingBag className="w-4 h-4" />
                    )
                  }
                >
                  {bundleAdded ? "Both Added to Bag!" : "Add Both to Bag"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 3 Related Pieces Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {related.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.id}`}
              className="group flex flex-col bg-paper-light rounded-3xl overflow-hidden border border-sand/40 hover:border-gold/60 transition-all p-4 shadow-paper-card hover:shadow-luxury"
            >
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-paper-dark mb-4">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="space-y-1.5 flex flex-col justify-between flex-1">
                <div>
                  <span className="text-[10px] uppercase font-sans tracking-widest text-gold font-semibold">
                    {p.story}
                  </span>
                  <h3 className="font-serif text-base text-charcoal font-medium group-hover:text-gold transition-colors leading-snug line-clamp-1">
                    {p.name}
                  </h3>
                  <p className="text-xs font-sans text-muted font-light">{p.fabric}</p>
                </div>

                <div className="pt-2 border-t border-sand/30 flex items-center justify-between">
                  <span className="font-serif font-semibold text-charcoal text-base">
                    ${p.priceAud} AUD
                  </span>
                  <span className="text-[10px] font-sans uppercase tracking-wider text-gold font-semibold flex items-center gap-1">
                    <span>View Piece</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
