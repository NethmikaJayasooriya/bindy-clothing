"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Eye, Plus, Check, ArrowRight } from "lucide-react";
import type { Product } from "@/lib/products";
import { getAverageRating } from "@/lib/products";
import { isInWishlist, toggleWishlist, subscribeWishlist } from "@/lib/wishlist";
import { addToCart } from "@/lib/cart";
import StarRating from "./StarRating";
import Price from "./Price";
import Badge from "./Badge";

export interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  onQuickAdd?: (product: Product, size: string) => void;
  showQuickAdd?: boolean;
  priority?: boolean;
  stockStatus?: "in_stock" | "low_stock" | "sold_out";
  stockText?: string;
  className?: string;
}

export default function ProductCard({
  product,
  onQuickView,
  onQuickAdd,
  showQuickAdd = true,
  stockStatus = "in_stock",
  stockText,
  className = "",
}: ProductCardProps) {
  const [, setWishlistTick] = useState(0);
  const [added, setAdded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const unsub = subscribeWishlist(() => setWishlistTick((t) => t + 1));
    return () => unsub();
  }, []);

  const inWishlist = isInWishlist(product.id);
  const rating = getAverageRating(product);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.sizes[1] || product.sizes[0] || "AU 8 (S)";
    if (onQuickAdd) {
      onQuickAdd(product, defaultSize);
    } else {
      addToCart(product, defaultSize, 1);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div
      className={`group flex flex-col bg-paper-light rounded-3xl overflow-hidden border border-sand/40 hover:border-gold/70 transition-all duration-500 shadow-paper-card hover:shadow-luxury-hover ${className}`}
    >
      {/* Image & Media Frame */}
      <div
        className="relative aspect-[3/4] w-full overflow-hidden bg-paper-dark"
        onMouseEnter={(e) => {
          const v = e.currentTarget.querySelector("video");
          if (v) {
            v.currentTime = 0;
            v.play().catch(() => {});
            setIsVideoPlaying(true);
          }
        }}
        onMouseLeave={(e) => {
          const v = e.currentTarget.querySelector("video");
          if (v) {
            v.pause();
            setIsVideoPlaying(false);
          }
        }}
      >
        <Link href={`/product/${product.id}`} className="block absolute inset-0" aria-label={`View ${product.name}`}>
          {/* Primary image */}
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out group-hover:opacity-0"
          />

          {/* Hover video or secondary image */}
          {product.videoHover ? (
            <video
              src={product.videoHover}
              poster={product.imageHover}
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100"
            />
          ) : (
            <img
              src={product.imageHover || product.image}
              alt={`${product.name} alternate view`}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100"
            />
          )}

          {/* Bottom vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 pointer-events-none" />
        </Link>

        {/* Top-Left: Color swatch badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/45 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] text-white border border-white/10 pointer-events-none">
          <span
            className="w-2 h-2 rounded-full border border-white/30"
            style={{ backgroundColor: product.colorHex }}
          />
          <span className="font-sans uppercase tracking-wider">{product.colorName}</span>
        </div>

        {/* Top-Right: Wishlist Toggle Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 cursor-pointer z-10 ${
            inWishlist
              ? "bg-gold text-charcoal shadow-md scale-105"
              : "bg-black/50 hover:bg-black text-white hover:text-gold"
          }`}
          title={inWishlist ? "Saved in Wishlist" : "Save to Wishlist"}
          aria-label="Save to Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${inWishlist ? "fill-charcoal text-charcoal" : "text-gold"}`} />
        </button>

        {/* Micro-Badges: Low Stock or Special Destination */}
        <div className="absolute top-12 left-3 flex flex-col items-start gap-1 pointer-events-none">
          {stockStatus === "low_stock" && (
            <Badge variant="terracotta" size="sm">
              {stockText || "Only 2 Left"}
            </Badge>
          )}
          {stockStatus === "sold_out" && (
            <Badge variant="charcoal" size="sm">
              Sold Out
            </Badge>
          )}
        </div>

        {/* Hover Quick Action Buttons (Middle / Lower) */}
        <div className="absolute inset-x-3 bottom-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
          {onQuickView && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="px-3 py-1.5 rounded-full bg-paper-light/95 hover:bg-paper-light text-charcoal backdrop-blur-md font-sans text-[10px] uppercase tracking-[0.2em] font-semibold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Eye className="w-3 h-3 text-gold" />
              Quick View
            </button>
          )}

          {showQuickAdd && stockStatus !== "sold_out" && (
            <button
              type="button"
              onClick={handleAdd}
              className={`ml-auto p-2 rounded-full text-white shadow-luxury transition-all duration-200 cursor-pointer ${
                added
                  ? "bg-emerald-600 scale-105"
                  : "bg-gold hover:bg-cinnamon hover:scale-105 text-charcoal hover:text-white"
              }`}
              title={added ? "Added to bag" : "Quick Add to Bag"}
              aria-label="Quick Add to Bag"
            >
              {added ? <Check className="w-3.5 h-3.5 text-white" /> : <Plus className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Card Information */}
      <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 space-y-3">
        <div>
          <div className="flex items-center justify-between text-[10px] uppercase font-sans tracking-[0.28em] text-gold font-semibold mb-1">
            <span>{product.story}</span>
            {product.destinations[0] && (
              <span className="text-muted font-normal">{product.destinations[0]}</span>
            )}
          </div>

          <Link href={`/product/${product.id}`} className="block">
            <h3 className="font-serif text-lg text-charcoal font-medium group-hover:text-gold transition-colors leading-snug line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs font-sans text-muted mt-1 font-light line-clamp-1">
            {product.fabric}
          </p>

          <div className="mt-2">
            <StarRating
              value={rating}
              count={product.reviews.length}
              size="sm"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-sand/30 flex items-center justify-between">
          <Price amount={product.priceAud} size="sm" />

          <Link
            href={`/product/${product.id}`}
            className="inline-flex items-center gap-1 text-[11px] font-sans uppercase tracking-[0.2em] text-charcoal group-hover:text-gold font-semibold transition-colors"
          >
            <span>Explore</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
