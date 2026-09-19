"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  Eye,
  ShoppingBag,
  Plus,
  Sparkles,
  Check,
  Compass,
  Layers,
  Star,
  ShieldCheck,
  Scissors,
  Bookmark,
} from "lucide-react";
import type { Product } from "@/data/products";
import { getAverageRating } from "@/lib/products";
import { isInWishlist, toggleWishlist, subscribeWishlist } from "@/lib/wishlist";
import { addToCart } from "@/lib/cart";

export interface CreativeProductCardProps {
  product: Product;
  index: number;
  onQuickView?: (product: Product) => void;
  onQuickAdd?: (product: Product, size: string) => void;
  stockStatus?: "in_stock" | "low_stock" | "sold_out";
  stockText?: string;
}

export default function CreativeProductCard({
  product,
  index,
  onQuickView,
  onQuickAdd,
  stockStatus = "in_stock",
  stockText,
}: CreativeProductCardProps) {
  const [, setWishlistTick] = useState(0);

  useEffect(() => {
    const unsub = subscribeWishlist(() => setWishlistTick((t) => t + 1));
    return () => unsub();
  }, []);

  const inWishlist = isInWishlist(product.id);
  const defaultSize = product.sizes[1] || product.sizes[0] || "AU 8 (S)";

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickAdd = (e: React.MouseEvent, size: string = defaultSize) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickAdd) {
      onQuickAdd(product, size);
    } else {
      addToCart(product, size, 1);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  const styleIndex = index % 10;

  const sharedProps = {
    product,
    inWishlist,
    handleWishlist,
    handleQuickAdd,
    handleQuickView,
    stockStatus,
    stockText,
  };

  switch (styleIndex) {
    case 0:
      return <Style0SculptedArch {...sharedProps} />;
    case 1:
      return <Style1TactileSwatch {...sharedProps} />;
    case 2:
      return <Style2BoutiqueHangtag {...sharedProps} />;
    case 3:
      return <Style3DualPerspective {...sharedProps} />;
    case 4:
      return <Style4GlassmorphicLuxe {...sharedProps} />;
    case 5:
      return <Style5QuickSizeGlider {...sharedProps} />;
    case 6:
      return <Style6EditorialPlate {...sharedProps} />;
    case 7:
      return <Style7AuthenticitySeal {...sharedProps} />;
    case 8:
      return <Style8SlideUpDrawer {...sharedProps} />;
    case 9:
      return <Style9AtelierSpec {...sharedProps} />;
    default:
      return <Style0SculptedArch {...sharedProps} />;
  }
}

// ======================================================================
// STYLE 0: The Sculpted Editorial Arch (Totême / The Row style)
// ======================================================================
function Style0SculptedArch({
  product,
  inWishlist,
  handleWishlist,
  handleQuickAdd,
  handleQuickView,
}: any) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState("AU 8 (S)");

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col h-full bg-[#FAF7F2] rounded-t-[28px] rounded-b-2xl overflow-hidden border border-[#DCC7AF]/60 shadow-sm hover:shadow-xl transition-all duration-500 select-none"
    >
      {/* Image Frame with Architectural Arch */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#ECE6DD]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img
            src={isHovered && product.imageHover ? product.imageHover : product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Style Badge */}
        <div className="absolute top-3 left-3 bg-[#1F1E1D]/80 backdrop-blur-md text-[#C5A059] px-2.5 py-1 rounded-full text-[9px] font-mono tracking-widest uppercase border border-[#C5A059]/30">
          01 • Sculpted Arch
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#1F1E1D] hover:scale-110 shadow-sm transition-transform"
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>

        {/* Slide-Up Size Bar on Hover */}
        <div className="absolute bottom-2 inset-x-2 bg-[#1F1E1D]/90 backdrop-blur-xl border border-white/20 rounded-xl p-2 flex items-center justify-between opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300 shadow-2xl">
          <div className="flex items-center gap-1">
            {product.sizes.slice(0, 4).map((sz: string) => (
              <button
                key={sz}
                type="button"
                onClick={(e) => {
                  setSelectedSize(sz);
                  handleQuickAdd(e, sz);
                }}
                className="px-2 py-1 rounded bg-white/10 hover:bg-[#C5A059] text-white hover:text-black text-[9px] font-mono font-bold transition-colors"
                title={`Quick Add size ${sz}`}
              >
                {sz.split(" ")[0]}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleQuickView}
            className="p-1 text-white/70 hover:text-white"
            title="Quick View"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-3.5 flex flex-col flex-1 justify-between bg-[#FAF7F2]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716A]">
            {product.category} • {product.fabric.split(" ")[0]}
          </span>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif text-sm font-medium text-[#1F1E1D] hover:text-[#B86B4B] transition-colors line-clamp-1 mt-0.5">
              {product.name}
            </h3>
          </Link>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-[#DCC7AF]/40 mt-2">
          <span className="font-mono text-xs font-bold text-[#1F1E1D]">
            ${product.priceAud} AUD
          </span>
          <span className="text-[10px] font-mono text-[#B86B4B] font-semibold">
            Handcrafted
          </span>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 1: The Tactile Swatch & Origin (Jacquemus / Loewe style)
// ======================================================================
function Style1TactileSwatch({
  product,
  inWishlist,
  handleWishlist,
  handleQuickAdd,
  handleQuickView,
}: any) {
  const [activeImg, setActiveImg] = useState(product.image);

  return (
    <div className="group relative flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-[#DCC7AF]/70 shadow-sm hover:shadow-xl transition-all duration-300">
      {/* Photo Frame */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F2EC]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img
            src={activeImg}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Style Tag */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9px] font-mono text-[#1F1E1D] font-bold tracking-wider uppercase border border-black/10">
          02 • Tactile Swatch
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#1F1E1D] hover:scale-110 shadow-sm transition-transform"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>

        {/* Swatch Switcher Pill on image */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-black/5">
          <span
            className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-inner"
            style={{ backgroundColor: product.colorHex || "#C5A059" }}
            title={product.colorName}
          />
          <span className="text-[9px] font-mono text-black font-medium">{product.colorName}</span>
        </div>

        {/* Hover Quick Add */}
        <button
          type="button"
          onClick={(e) => handleQuickAdd(e)}
          className="absolute bottom-3 right-3 bg-[#1F1E1D] hover:bg-[#C5A059] text-white hover:text-black px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold shadow-lg transition-all opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0"
        >
          + Quick Add
        </button>
      </div>

      {/* Info Section */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-[10px] font-mono text-[#78716A] mb-1">
            <span>{product.storyPlace || "Southern Coast"}</span>
            <span className="text-[#C5A059]">★ 4.9</span>
          </div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif text-sm font-medium text-[#1F1E1D] hover:text-[#C5A059] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-[11px] font-sans text-[#78716A] truncate mt-0.5">
            {product.fabric}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
          <span className="font-mono text-xs font-bold text-[#1F1E1D]">${product.priceAud} AUD</span>
          <button
            type="button"
            onClick={handleQuickView}
            className="text-[10px] font-mono text-[#78716A] hover:text-[#1F1E1D] underline"
          >
            Quick View
          </button>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 2: The Boutique Linen Hangtag (Bode / Story mfg style)
// ======================================================================
function Style2BoutiqueHangtag({
  product,
  inWishlist,
  handleWishlist,
  handleQuickAdd,
  handleQuickView,
}: any) {
  return (
    <div className="group relative flex flex-col h-full bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#C5A059]/40 shadow-sm hover:shadow-xl transition-all duration-300">
      {/* Top Image Frame */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#ECE6DD]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Tactile Hangtag (pinned to top corner) */}
        <div className="absolute top-2 left-2 bg-[#F3ECE1] text-[#1F1E1D] px-2.5 py-1 rounded shadow-md border-t-2 border-l-2 border-[#C5A059] font-mono text-[8px] uppercase tracking-wider flex items-center gap-1">
          <Scissors className="w-2.5 h-2.5 text-[#B86B4B]" />
          <span>Batch 04 • Pit Loom</span>
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlist}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#1F1E1D] hover:scale-110 shadow-sm transition-transform"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>

        {/* Hover Quick Drawer */}
        <div className="absolute inset-x-2 bottom-2 bg-[#1F1E1D]/90 backdrop-blur-md rounded-xl p-2 flex items-center justify-between text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] font-mono text-[#DCC7AF]">AU 6 - AU 14</span>
          <button
            type="button"
            onClick={(e) => handleQuickAdd(e)}
            className="px-3 py-1 bg-[#C5A059] text-black font-mono text-[9px] uppercase font-bold rounded-lg hover:bg-white transition-colors"
          >
            Add to Bag
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-3 flex flex-col flex-1 justify-between bg-[#FAF7F2]">
        <div>
          <span className="text-[9px] font-mono uppercase tracking-widest text-[#B86B4B] font-bold">
            03 • Boutique Tag
          </span>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif text-sm font-medium text-[#1F1E1D] line-clamp-1 mt-0.5">
              {product.name}
            </h3>
          </Link>
          <p className="text-[10px] font-mono text-[#78716A] truncate">
            {product.destinations?.[0] || "Resort"} Edition
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#DCC7AF]/60 mt-2">
          <span className="font-mono text-xs font-bold text-[#1F1E1D]">${product.priceAud} AUD</span>
          <button
            type="button"
            onClick={handleQuickView}
            className="text-[10px] font-mono text-[#B86B4B] hover:underline"
          >
            Inspect
          </button>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 3: The Dual Perspective Front/Back (Loewe / Bottega style)
// ======================================================================
function Style3DualPerspective({
  product,
  inWishlist,
  handleWishlist,
  handleQuickAdd,
  handleQuickView,
}: any) {
  const [viewAngle, setViewAngle] = useState<"front" | "back">("front");

  return (
    <div className="group relative flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300">
      {/* Photo Frame */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#ECE6DD]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img
            src={viewAngle === "back" && product.imageHover ? product.imageHover : product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Style Tag */}
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider">
          04 • Dual View
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#1F1E1D] hover:scale-110 shadow-sm transition-transform"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>

        {/* Angle Toggles Pill */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-1 py-1 rounded-full flex items-center gap-1 shadow-md border border-black/10">
          <button
            type="button"
            onClick={() => setViewAngle("front")}
            className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase transition-colors ${
              viewAngle === "front" ? "bg-black text-white font-bold" : "text-gray-700 hover:text-black"
            }`}
          >
            Front
          </button>
          <button
            type="button"
            onClick={() => setViewAngle("back")}
            className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase transition-colors ${
              viewAngle === "back" ? "bg-black text-white font-bold" : "text-gray-700 hover:text-black"
            }`}
          >
            Detail
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-3.5 flex flex-col flex-1 justify-between bg-white">
        <div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif text-sm font-medium text-[#1F1E1D] line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-[10px] font-mono text-[#78716A] truncate mt-0.5">
            {product.fabric}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
          <span className="font-mono text-xs font-bold text-black">${product.priceAud} AUD</span>
          <button
            type="button"
            onClick={(e) => handleQuickAdd(e)}
            className="px-2.5 py-1 bg-[#1F1E1D] hover:bg-[#C5A059] text-white hover:text-black rounded text-[9px] font-mono font-bold uppercase transition-colors"
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 4: The Floating Glassmorphic Luxe (Saint Laurent / Khaite style)
// ======================================================================
function Style4GlassmorphicLuxe({
  product,
  inWishlist,
  handleWishlist,
  handleQuickAdd,
  handleQuickView,
}: any) {
  return (
    <div className="group relative flex flex-col h-full bg-[#11100F] rounded-2xl overflow-hidden border border-[#C5A059]/30 shadow-lg hover:shadow-2xl transition-all duration-500">
      {/* Edge-to-Edge Image Frame */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-black">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Dark Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

        {/* Style Tag */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-[#C5A059] px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-widest border border-[#C5A059]/30">
          05 • Glass Luxe
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#C5A059] text-[#C5A059]" : ""}`} />
        </button>

        {/* Floating Glassmorphic Dock */}
        <div className="absolute bottom-3 inset-x-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-3 text-white shadow-2xl transition-transform duration-300">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-serif text-xs font-semibold text-white truncate max-w-[70%]">
              {product.name}
            </h3>
            <span className="font-mono text-xs font-bold text-[#C5A059]">
              ${product.priceAud}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-white/10">
            <span className="text-[9px] font-mono text-white/60 truncate">
              {product.fabric.split(" ")[0]}
            </span>
            <button
              type="button"
              onClick={(e) => handleQuickAdd(e)}
              className="px-2.5 py-1 rounded bg-[#C5A059] hover:bg-white text-black text-[9px] font-mono font-bold uppercase transition-colors"
            >
              Add To Bag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 5: The Interactive Size Glider (Zara Studio / Mango Luxury)
// ======================================================================
function Style5QuickSizeGlider({
  product,
  inWishlist,
  handleWishlist,
  handleQuickAdd,
  handleQuickView,
}: any) {
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const handleAddWithSize = (e: React.MouseEvent, sz: string) => {
    handleQuickAdd(e, sz);
    setJustAdded(sz);
    setTimeout(() => setJustAdded(null), 1500);
  };

  return (
    <div className="group relative flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300">
      {/* Image Area */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F2EC]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Style Tag */}
        <div className="absolute top-3 left-3 bg-[#FAF7F2] text-[#1F1E1D] px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider font-bold border border-gray-200">
          06 • Size Glider
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-black hover:scale-110 shadow-sm transition-transform"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>

        {/* 1-Tap Inline Size Selector Glider (Slides up on card hover) */}
        <div className="absolute inset-x-2 bottom-2 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl p-2 shadow-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <div className="flex items-center justify-between text-[9px] font-mono text-gray-500 mb-1 px-1">
            <span>Select Size & Add:</span>
            {justAdded && <span className="text-emerald-600 font-bold">Added {justAdded}!</span>}
          </div>
          <div className="grid grid-cols-4 gap-1">
            {product.sizes.slice(0, 4).map((sz: string) => (
              <button
                key={sz}
                type="button"
                onClick={(e) => handleAddWithSize(e, sz)}
                className="py-1 rounded bg-gray-100 hover:bg-black hover:text-white text-[9px] font-mono font-bold transition-colors text-center"
              >
                {sz.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-3.5 flex flex-col flex-1 justify-between bg-white">
        <div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif text-sm font-medium text-[#1F1E1D] hover:text-[#B86B4B] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-[11px] font-sans text-gray-500 truncate mt-0.5">
            {product.story}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
          <span className="font-mono text-xs font-bold text-black">${product.priceAud} AUD</span>
          <button
            type="button"
            onClick={handleQuickView}
            className="text-[10px] font-mono text-[#B86B4B] hover:underline"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 6: The Editorial Runway Plate (Vogue Runway / Gentle Monster)
// ======================================================================
function Style6EditorialPlate({
  product,
  inWishlist,
  handleWishlist,
  handleQuickAdd,
  handleQuickView,
}: any) {
  return (
    <div className="group relative flex flex-col h-full bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#1F1E1D]/20 shadow-sm hover:shadow-xl transition-all duration-300">
      {/* Plate Header Strip */}
      <div className="px-3 py-1.5 bg-[#1F1E1D] text-white flex items-center justify-between text-[8px] font-mono uppercase tracking-widest">
        <span>07 • RUNWAY ARCHIVE</span>
        <span className="text-[#C5A059]">PLATE 07/26</span>
      </div>

      {/* Image Frame */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#ECE6DD]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlist}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-black hover:scale-110 shadow-sm transition-transform"
        >
          <Heart className={`w-3.5 h-3.5 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>

        {/* Quick Add Pill */}
        <button
          type="button"
          onClick={(e) => handleQuickAdd(e)}
          className="absolute bottom-3 inset-x-4 py-2 rounded-full bg-white/95 text-black font-mono text-[10px] uppercase tracking-wider font-bold shadow-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all text-center hover:bg-[#C5A059]"
        >
          Instant Reserve • ${product.priceAud}
        </button>
      </div>

      {/* Info Section */}
      <div className="p-3 flex flex-col flex-1 justify-between bg-[#FAF7F2]">
        <div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif text-sm font-medium text-[#1F1E1D] line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-[10px] font-mono text-gray-600 truncate mt-0.5">
            Weft: {product.fabric}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#DCC7AF]/60 mt-2 text-xs font-mono">
          <span className="font-bold text-[#1F1E1D]">${product.priceAud} AUD</span>
          <button
            type="button"
            onClick={handleQuickView}
            className="text-[10px] text-[#B86B4B] hover:underline"
          >
            Plate Notes
          </button>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 7: The Authenticity Wax Seal (Aesop / Studio Nicholson)
// ======================================================================
function Style7AuthenticitySeal({
  product,
  inWishlist,
  handleWishlist,
  handleQuickAdd,
  handleQuickView,
}: any) {
  return (
    <div className="group relative flex flex-col h-full bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#C5A059]/40 shadow-sm hover:shadow-xl transition-all duration-300">
      {/* Image Area */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F2EC]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Seal Badge */}
        <div className="absolute top-3 left-3 bg-[#1F1E1D] text-[#C5A059] px-2 py-1 rounded-md text-[8px] font-mono uppercase tracking-widest flex items-center gap-1 border border-[#C5A059]/40 shadow-md">
          <ShieldCheck className="w-3 h-3 text-[#C5A059]" />
          <span>08 • Certified Loom</span>
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-black hover:scale-110 shadow-sm transition-transform"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>

        {/* Quick View Button */}
        <button
          type="button"
          onClick={handleQuickView}
          className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-mono uppercase tracking-wider text-black font-semibold shadow opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Inspect Craft
        </button>
      </div>

      {/* Info Section */}
      <div className="p-3.5 flex flex-col flex-1 justify-between bg-[#FAF7F2]">
        <div>
          <div className="text-[9px] font-mono text-[#78716A] uppercase tracking-wider mb-0.5">
            Ethical Pit-Loom Archive
          </div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif text-sm font-medium text-[#1F1E1D] line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-[10px] font-mono text-[#B86B4B] mt-0.5 truncate">
            Natural Dye: Wild Cinnamon & Salt
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#DCC7AF]/60 mt-2">
          <span className="font-mono text-xs font-bold text-black">${product.priceAud} AUD</span>
          <button
            type="button"
            onClick={(e) => handleQuickAdd(e)}
            className="px-3 py-1 bg-[#1F1E1D] hover:bg-[#C5A059] text-white hover:text-black rounded text-[9px] font-mono font-bold uppercase transition-colors"
          >
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 8: The Slide-Up Wardrobe Drawer (Aritzia / Reformation style)
// ======================================================================
function Style8SlideUpDrawer({
  product,
  inWishlist,
  handleWishlist,
  handleQuickAdd,
  handleQuickView,
}: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Image Area */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F2EC]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img
            src={isHovered && product.imageHover ? product.imageHover : product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Style Tag */}
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider">
          09 • Wardrobe Drawer
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-black hover:scale-110 shadow-sm transition-transform"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>

        {/* Full Size Drawer that slides up seamlessly */}
        <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-2.5 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out shadow-2xl">
          <div className="flex items-center justify-between text-[9px] font-mono text-gray-500">
            <span>QUICK ADD SIZE:</span>
            <span className="text-black font-semibold">${product.priceAud} AUD</span>
          </div>
          <div className="flex items-center gap-1">
            {product.sizes.slice(0, 4).map((sz: string) => (
              <button
                key={sz}
                type="button"
                onClick={(e) => handleQuickAdd(e, sz)}
                className="flex-1 py-1 bg-gray-100 hover:bg-black hover:text-white rounded text-[9px] font-mono font-bold transition-colors text-center"
              >
                {sz.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-3.5 flex flex-col flex-1 justify-between bg-white">
        <div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif text-sm font-medium text-[#1F1E1D] line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-[11px] font-sans text-gray-500 truncate mt-0.5">
            {product.fabric}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2 text-xs font-mono">
          <span className="font-bold text-black">${product.priceAud} AUD</span>
          <button
            type="button"
            onClick={handleQuickView}
            className="text-[10px] text-gray-500 hover:text-black underline"
          >
            Quick View
          </button>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 9: The Atelier Specification Card (Aimé Leon Dore / Lemaire)
// ======================================================================
function Style9AtelierSpec({
  product,
  inWishlist,
  handleWishlist,
  handleQuickAdd,
  handleQuickView,
}: any) {
  return (
    <div className="group relative flex flex-col h-full bg-[#FAF7F2] rounded-2xl overflow-hidden border-2 border-[#1F1E1D] shadow-md hover:shadow-2xl transition-all duration-300">
      {/* Top Spec Header */}
      <div className="bg-[#1F1E1D] text-white px-3 py-1 flex items-center justify-between text-[8px] font-mono uppercase tracking-widest">
        <span>10 • SPEC ARCHIVE</span>
        <span className="text-[#C5A059]">BINDY ATELIER</span>
      </div>

      {/* Image Area */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#ECE6DD]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlist}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white flex items-center justify-center text-black hover:scale-110 shadow transition-transform"
        >
          <Heart className={`w-3.5 h-3.5 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>

        {/* Quick View */}
        <button
          type="button"
          onClick={handleQuickView}
          className="absolute bottom-2.5 left-2.5 bg-black/80 backdrop-blur-md text-white px-2.5 py-1 rounded text-[9px] font-mono uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity"
        >
          View Specs
        </button>
      </div>

      {/* Info Section */}
      <div className="p-3 flex flex-col flex-1 justify-between bg-[#FAF7F2]">
        <div>
          <div className="flex items-center justify-between text-[9px] font-mono text-[#78716A]">
            <span>{product.collectionName || "Collection 01"}</span>
            <span className="text-[#B86B4B] font-semibold">In Stock</span>
          </div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif text-sm font-semibold text-[#1F1E1D] line-clamp-1 mt-0.5">
              {product.name}
            </h3>
          </Link>
          <p className="text-[10px] font-mono text-[#78716A] truncate">
            {product.fabric}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-black/10 mt-2">
          <span className="font-mono text-xs font-bold text-[#1F1E1D]">${product.priceAud} AUD</span>
          <button
            type="button"
            onClick={(e) => handleQuickAdd(e)}
            className="px-3 py-1 bg-[#1F1E1D] hover:bg-[#C5A059] text-white hover:text-black rounded text-[9px] font-mono font-bold uppercase transition-colors"
          >
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
}
