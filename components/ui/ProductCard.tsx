"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Eye, Plus, Check, ArrowRight, Flame } from "lucide-react";
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
  const [addedSize, setAddedSize] = useState<string | null>(null);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const isHoveredRef = React.useRef(false);

  useEffect(() => {
    const unsub = subscribeWishlist(() => setWishlistTick((t) => t + 1));
    return () => unsub();
  }, []);

  const inWishlist = isInWishlist(product.id);
  const rating = getAverageRating(product);

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    setIsCardHovered(true);
    const video = videoRef.current;
    if (video) {
      if (video.readyState >= 3) {
        setIsVideoPlaying(true);
      }
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (isHoveredRef.current) {
              setIsVideoPlaying(true);
            }
          })
          .catch(() => {});
      }
    }
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    setIsCardHovered(false);
    setIsVideoPlaying(false);
    const video = videoRef.current;
    if (video) {
      setTimeout(() => {
        if (!isHoveredRef.current && video) {
          video.pause();
          video.currentTime = 0;
        }
      }, 400);
    }
  };

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
      className={`group flex flex-col bg-white rounded-none border border-[#E7DFD5] hover:border-charcoal/80 transition-all duration-300 shadow-sm hover:shadow-xl ${className}`}
    >
      {/* Image & Media Frame */}
      <div
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#F2ECE1]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link href={`/product/${product.id}`} className="block absolute inset-0" aria-label={`View ${product.name}`}>
          {/* Primary image (Always present underneath as solid base — prevents any blank/flash) */}
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />

          {/* Hover video: always mounted if available, smoothly fades in only once frames are playing */}
          {product.videoHover ? (
            <video
              ref={videoRef}
              src={product.videoHover}
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden
              onPlaying={() => {
                if (isHoveredRef.current) setIsVideoPlaying(true);
              }}
              onTimeUpdate={() => {
                if (isHoveredRef.current && !isVideoPlaying && videoRef.current && videoRef.current.currentTime > 0) {
                  setIsVideoPlaying(true);
                }
              }}
              className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-500 ease-out ${
                isCardHovered && isVideoPlaying ? "opacity-100" : "opacity-0"
              }`}
            />
          ) : (
            /* Fallback secondary image only if product has no videoHover */
            product.imageHover && (
              <img
                src={product.imageHover}
                alt={`${product.name} alternate view`}
                loading="lazy"
                decoding="async"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100"
              />
            )
          )}

          {/* Bottom vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />
        </Link>

        {/* Top-Left: Color swatch badge (Box Architectural Style) */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex items-center gap-1.5 bg-black/65 backdrop-blur-sm px-2.5 py-1 text-[10px] sm:text-[10.5px] text-white tracking-[0.14em] uppercase font-sans border border-white/10 pointer-events-none">
          <span
            className="w-2 h-2 border border-white/40 shrink-0"
            style={{ backgroundColor: product.colorHex }}
          />
          <span className="font-medium truncate max-w-[110px]">{product.colorName}</span>
        </div>

        {/* Top-Right: Wishlist Toggle Button (Crisp Minimal Box Style) */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-8 h-8 flex items-center justify-center backdrop-blur-md transition-all duration-300 cursor-pointer z-10 border ${
            inWishlist
              ? "bg-gold text-charcoal border-gold shadow-md"
              : "bg-white/85 hover:bg-white text-charcoal/80 hover:text-[#8E6E34] border-[#DCC7AF]/60 shadow-sm"
          }`}
          title={inWishlist ? "Saved in Wishlist" : "Save to Wishlist"}
          aria-label="Save to Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${inWishlist ? "fill-charcoal text-charcoal" : "text-charcoal/80"}`} />
        </button>

        {/* Micro-Badges: Low Stock or Sold Out */}
        <div className="absolute top-10 sm:top-11 left-2.5 sm:left-3 flex flex-col items-start gap-1 pointer-events-none">
          {stockStatus === "low_stock" && (
            <div className="bg-[#A46446] text-white text-[9.5px] uppercase tracking-[0.14em] font-semibold px-2 py-0.5 shadow-sm">
              {stockText || "Only 2 Left"}
            </div>
          )}
          {stockStatus === "sold_out" && (
            <div className="bg-[#181614] text-white text-[9.5px] uppercase tracking-[0.14em] font-semibold px-2 py-0.5 shadow-sm">
              Sold Out
            </div>
          )}
        </div>

        {/* Hover Quick Size Selector Drawer (Box Style) */}
        <div className="absolute inset-x-0 bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-auto bg-white/95 backdrop-blur-md p-2.5 sm:p-3 border-t border-[#DCC7AF]/80 shadow-lg flex flex-col gap-1.5 z-20">
          <div className="flex items-center justify-between px-0.5 text-[10.5px] sm:text-xs font-sans">
            <span className="uppercase tracking-[0.14em] text-charcoal-subtle font-semibold">Quick Add:</span>
            {onQuickView && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onQuickView(product);
                }}
                className="text-[#8E6E34] hover:text-charcoal flex items-center gap-1 font-medium transition-colors"
              >
                <Eye className="w-3 h-3" />
                <span>Quick View</span>
              </button>
            )}
          </div>
          <div className="grid grid-cols-5 gap-1">
            {product.sizes.map((sz) => {
              const short = sz.replace("AU ", "").split(" ")[0];
              const isAdded = addedSize === sz;

              return (
                <button
                  key={sz}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (onQuickAdd) {
                      onQuickAdd(product, sz);
                    } else {
                      addToCart(product, sz, 1);
                    }
                    setAddedSize(sz);
                    setTimeout(() => setAddedSize(null), 1800);
                  }}
                  className={`py-1.5 text-[11px] font-sans font-medium border text-center transition-all ${
                    isAdded
                      ? "bg-[#5E6C52] text-white border-[#5E6C52] font-semibold"
                      : "border-[#DCC7AF]/70 bg-white text-charcoal hover:bg-charcoal hover:text-white hover:border-charcoal"
                  }`}
                  title={`Add size ${sz} to bag`}
                >
                  {isAdded ? "✓" : short}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Card Information (Crisp Box Panel) */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-3 bg-white">
        <div className="space-y-1.5">
          {/* Origin Story Eyebrow */}
          <div className="flex items-center justify-between text-[10px] sm:text-[10.5px] uppercase font-semibold font-sans tracking-[0.2em] text-[#8E6E34]">
            <span className="truncate">{product.story}</span>
            {product.destinations[0] && (
              <span className="text-charcoal/40 font-normal tracking-normal truncate ml-1 hidden xs:inline">
                · {product.destinations[0]}
              </span>
            )}
          </div>

          {/* Product Title */}
          <Link href={`/product/${product.id}`} className="block">
            <h3 className="font-serif text-[15.5px] sm:text-[17.5px] text-charcoal font-normal group-hover:text-[#8E6E34] transition-colors leading-snug line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Fabric / Material Description */}
          <p className="text-[12px] font-sans text-charcoal/65 font-light line-clamp-1">
            {product.fabric}
          </p>

          {/* Rating & Bestseller Badge */}
          <div className="pt-0.5 flex items-center justify-between">
            <StarRating
              value={rating}
              count={product.reviews.length}
              size="sm"
            />
            {product.id.includes("lotus") || product.id.includes("cinnamon") ? (
              <span className="flex items-center gap-1 text-[10px] sm:text-[10.5px] font-sans uppercase tracking-wider text-[#A46446] font-medium">
                <Flame className="w-2.5 h-2.5 fill-[#A46446]" />
                <span>Bestseller</span>
              </span>
            ) : null}
          </div>
        </div>

        {/* Prominent Price & Architectural Action Button */}
        <div className="pt-3 border-t border-sand/30 flex items-center justify-between gap-2">
          {/* High-visibility prominent price */}
          <Price amount={product.priceAud} size="sm" />

          {/* Clean architectural CTA */}
          <Link
            href={`/product/${product.id}`}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 border border-charcoal/70 hover:border-charcoal hover:bg-charcoal text-charcoal hover:text-white text-[11px] font-sans uppercase tracking-[0.16em] font-medium transition-all duration-200 group/btn"
          >
            <span>Explore</span>
            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
