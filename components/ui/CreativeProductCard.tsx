"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  Sun,
  Wind,
  Droplets,
  Feather,
  Leaf,
  Clock,
  Flame,
  Award,
} from "lucide-react";
import type { Product } from "@/data/products";
import { isInWishlist, toggleWishlist, subscribeWishlist } from "@/lib/wishlist";
import { addToCart } from "@/lib/cart";

export interface CreativeProductCardProps {
  product: Product;
  index: number;
  styleVariant?: number; // optionally override index-based style
  onQuickView?: (product: Product) => void;
  onQuickAdd?: (product: Product, size: string) => void;
  stockStatus?: "in_stock" | "low_stock" | "sold_out";
  stockText?: string;
}

export default function CreativeProductCard({
  product,
  index,
  styleVariant,
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

  const styleIndex = styleVariant !== undefined ? styleVariant : index % 20;

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
    case 10:
      return <Style10CoastalTide {...sharedProps} />;
    case 11:
      return <Style11ArtisanPostcard {...sharedProps} />;
    case 12:
      return <Style12AsymmetricSplit {...sharedProps} />;
    case 13:
      return <Style13PureMinimalist {...sharedProps} />;
    case 14:
      return <Style14SculpturalHardware {...sharedProps} />;
    case 15:
      return <Style15EcoCarbonMetric {...sharedProps} />;
    case 16:
      return <Style16BotanicalDyeVat {...sharedProps} />;
    case 17:
      return <Style17RomanticHeirloom {...sharedProps} />;
    case 18:
      return <Style18TextileDensity {...sharedProps} />;
    case 19:
      return <Style19PrivateVault {...sharedProps} />;
    default:
      return <Style0SculptedArch {...sharedProps} />;
  }
}

// ======================================================================
// STYLE 01: The Sculpted Arch Gallery (Inspired by Totême)
// ======================================================================
function Style0SculptedArch({ product, inWishlist, handleWishlist, handleQuickAdd, handleQuickView }: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col h-full bg-[#FAF7F2] rounded-t-[28px] rounded-b-2xl overflow-hidden border border-[#DCC7AF]/60 shadow-sm hover:shadow-xl transition-all duration-500 select-none"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#ECE6DD]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img
            src={isHovered && product.imageHover ? product.imageHover : product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>
        <div className="absolute top-3 left-3 bg-[#1F1E1D]/80 backdrop-blur-md text-[#C5A059] px-2.5 py-1 rounded-full text-[9px] font-mono tracking-widest uppercase border border-[#C5A059]/30">
          01 • Totême Arch
        </div>
        <button
          type="button"
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#1F1E1D] hover:scale-110 shadow-sm transition-transform"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>
        <div className="absolute bottom-2 inset-x-2 bg-[#1F1E1D]/90 backdrop-blur-xl border border-white/20 rounded-xl p-2 flex items-center justify-between opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300 shadow-2xl">
          <div className="flex items-center gap-1">
            {product.sizes.slice(0, 4).map((sz: string) => (
              <button
                key={sz}
                type="button"
                onClick={(e) => handleQuickAdd(e, sz)}
                className="px-2 py-1 rounded bg-white/10 hover:bg-[#C5A059] text-white hover:text-black text-[9px] font-mono font-bold transition-colors"
              >
                {sz.split(" ")[0]}
              </button>
            ))}
          </div>
          <button type="button" onClick={handleQuickView} className="p-1 text-white/70 hover:text-white">
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
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
          <span className="font-mono text-xs font-bold text-[#1F1E1D]">${product.priceAud} AUD</span>
          <span className="text-[10px] font-mono text-[#B86B4B] font-semibold">Handcrafted</span>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 02: The Tactile Swatch Bar (Inspired by Jacquemus)
// ======================================================================
function Style1TactileSwatch({ product, inWishlist, handleWishlist, handleQuickAdd, handleQuickView }: any) {
  return (
    <div className="group relative flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-[#DCC7AF]/70 shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F2EC]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </Link>
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9px] font-mono text-[#1F1E1D] font-bold tracking-wider uppercase border border-black/10">
          02 • Jacquemus Swatch
        </div>
        <button type="button" onClick={handleWishlist} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#1F1E1D] hover:scale-110 shadow-sm transition-transform">
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-black/5">
          <span className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-inner" style={{ backgroundColor: product.colorHex || "#C5A059" }} />
          <span className="text-[9px] font-mono text-black font-medium">{product.colorName}</span>
        </div>
        <button type="button" onClick={(e) => handleQuickAdd(e)} className="absolute bottom-3 right-3 bg-[#1F1E1D] hover:bg-[#C5A059] text-white hover:text-black px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold shadow-lg transition-all opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0">
          + Quick Add
        </button>
      </div>
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-[10px] font-mono text-[#78716A] mb-1">
            <span>{product.storyPlace || "Southern Coast"}</span>
            <span className="text-[#C5A059]">★ 4.9</span>
          </div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif text-sm font-medium text-[#1F1E1D] hover:text-[#C5A059] transition-colors line-clamp-1">{product.name}</h3>
          </Link>
          <p className="text-[11px] font-sans text-[#78716A] truncate mt-0.5">{product.fabric}</p>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
          <span className="font-mono text-xs font-bold text-[#1F1E1D]">${product.priceAud} AUD</span>
          <button type="button" onClick={handleQuickView} className="text-[10px] font-mono text-[#78716A] hover:text-[#1F1E1D] underline">Quick View</button>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 03: The Boutique Linen Hangtag (Inspired by Bode)
// ======================================================================
function Style2BoutiqueHangtag({ product, inWishlist, handleWishlist, handleQuickAdd, handleQuickView }: any) {
  return (
    <div className="group relative flex flex-col h-full bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#C5A059]/40 shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#ECE6DD]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </Link>
        <div className="absolute top-2 left-2 bg-[#F3ECE1] text-[#1F1E1D] px-2.5 py-1 rounded shadow-md border-t-2 border-l-2 border-[#C5A059] font-mono text-[8px] uppercase tracking-wider flex items-center gap-1">
          <Scissors className="w-2.5 h-2.5 text-[#B86B4B]" />
          <span>03 • Bode Hangtag</span>
        </div>
        <button type="button" onClick={handleWishlist} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#1F1E1D] hover:scale-110 shadow-sm transition-transform">
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>
        <div className="absolute inset-x-2 bottom-2 bg-[#1F1E1D]/90 backdrop-blur-md rounded-xl p-2 flex items-center justify-between text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] font-mono text-[#DCC7AF]">AU 6 - AU 14</span>
          <button type="button" onClick={(e) => handleQuickAdd(e)} className="px-3 py-1 bg-[#C5A059] text-black font-mono text-[9px] uppercase font-bold rounded-lg hover:bg-white transition-colors">Add to Bag</button>
        </div>
      </div>
      <div className="p-3 flex flex-col flex-1 justify-between bg-[#FAF7F2]">
        <div>
          <span className="text-[9px] font-mono uppercase tracking-widest text-[#B86B4B] font-bold">Pit-Loom Weave</span>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif text-sm font-medium text-[#1F1E1D] line-clamp-1 mt-0.5">{product.name}</h3>
          </Link>
          <p className="text-[10px] font-mono text-[#78716A] truncate">{product.destinations?.[0] || "Resort"} Edition</p>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-[#DCC7AF]/60 mt-2">
          <span className="font-mono text-xs font-bold text-[#1F1E1D]">${product.priceAud} AUD</span>
          <button type="button" onClick={handleQuickView} className="text-[10px] font-mono text-[#B86B4B] hover:underline">Inspect</button>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 04: The Dual-Perspective Angle (Inspired by Loewe)
// ======================================================================
function Style3DualPerspective({ product, inWishlist, handleWishlist, handleQuickAdd }: any) {
  const [viewAngle, setViewAngle] = useState<"front" | "back">("front");

  return (
    <div className="group relative flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#ECE6DD]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img src={viewAngle === "back" && product.imageHover ? product.imageHover : product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </Link>
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider">
          04 • Loewe Dual Angle
        </div>
        <button type="button" onClick={handleWishlist} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#1F1E1D] hover:scale-110 shadow-sm transition-transform">
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-1 py-1 rounded-full flex items-center gap-1 shadow-md border border-black/10">
          <button type="button" onClick={() => setViewAngle("front")} className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase transition-colors ${viewAngle === "front" ? "bg-black text-white font-bold" : "text-gray-700 hover:text-black"}`}>Front</button>
          <button type="button" onClick={() => setViewAngle("back")} className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase transition-colors ${viewAngle === "back" ? "bg-black text-white font-bold" : "text-gray-700 hover:text-black"}`}>Detail</button>
        </div>
      </div>
      <div className="p-3.5 flex flex-col flex-1 justify-between bg-white">
        <div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif text-sm font-medium text-[#1F1E1D] line-clamp-1">{product.name}</h3>
          </Link>
          <p className="text-[10px] font-mono text-[#78716A] truncate mt-0.5">{product.fabric}</p>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
          <span className="font-mono text-xs font-bold text-black">${product.priceAud} AUD</span>
          <button type="button" onClick={(e) => handleQuickAdd(e)} className="px-2.5 py-1 bg-[#1F1E1D] hover:bg-[#C5A059] text-white hover:text-black rounded text-[9px] font-mono font-bold uppercase transition-colors">+ Add</button>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 05: The Floating Glassmorphic Luxe (Inspired by Khaite)
// ======================================================================
function Style4GlassmorphicLuxe({ product, inWishlist, handleWishlist, handleQuickAdd }: any) {
  return (
    <div className="group relative flex flex-col h-full bg-[#11100F] rounded-2xl overflow-hidden border border-[#C5A059]/30 shadow-lg hover:shadow-2xl transition-all duration-500">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-black">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-[#C5A059] px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-widest border border-[#C5A059]/30">
          05 • Khaite Glass
        </div>
        <button type="button" onClick={handleWishlist} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:scale-110 transition-transform">
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#C5A059] text-[#C5A059]" : ""}`} />
        </button>
        <div className="absolute bottom-3 inset-x-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-3 text-white shadow-2xl transition-transform duration-300">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-serif text-xs font-semibold text-white truncate max-w-[70%]">{product.name}</h3>
            <span className="font-mono text-xs font-bold text-[#C5A059]">${product.priceAud}</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-white/10">
            <span className="text-[9px] font-mono text-white/60 truncate">{product.fabric.split(" ")[0]}</span>
            <button type="button" onClick={(e) => handleQuickAdd(e)} className="px-2.5 py-1 rounded bg-[#C5A059] hover:bg-white text-black text-[9px] font-mono font-bold uppercase transition-colors">Add To Bag</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 06: The Instant Size Glider (Inspired by Zara Studio)
// ======================================================================
function Style5QuickSizeGlider({ product, inWishlist, handleWishlist, handleQuickAdd, handleQuickView }: any) {
  const [justAdded, setJustAdded] = useState<string | null>(null);

  return (
    <div className="group relative flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F2EC]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </Link>
        <div className="absolute top-3 left-3 bg-[#FAF7F2] text-[#1F1E1D] px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider font-bold border border-gray-200">
          06 • Zara Glider
        </div>
        <button type="button" onClick={handleWishlist} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-black hover:scale-110 shadow-sm transition-transform">
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>
        <div className="absolute inset-x-2 bottom-2 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl p-2 shadow-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <div className="flex items-center justify-between text-[9px] font-mono text-gray-500 mb-1 px-1">
            <span>Select Size:</span>
            {justAdded && <span className="text-emerald-600 font-bold">Added!</span>}
          </div>
          <div className="grid grid-cols-4 gap-1">
            {product.sizes.slice(0, 4).map((sz: string) => (
              <button
                key={sz}
                type="button"
                onClick={(e) => {
                  handleQuickAdd(e, sz);
                  setJustAdded(sz);
                  setTimeout(() => setJustAdded(null), 1500);
                }}
                className="py-1 rounded bg-gray-100 hover:bg-black hover:text-white text-[9px] font-mono font-bold transition-colors text-center"
              >
                {sz.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="p-3.5 flex flex-col flex-1 justify-between bg-white">
        <div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif text-sm font-medium text-[#1F1E1D] hover:text-[#B86B4B] transition-colors line-clamp-1">{product.name}</h3>
          </Link>
          <p className="text-[11px] font-sans text-gray-500 truncate mt-0.5">{product.story}</p>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
          <span className="font-mono text-xs font-bold text-black">${product.priceAud} AUD</span>
          <button type="button" onClick={handleQuickView} className="text-[10px] font-mono text-[#B86B4B] hover:underline">Details</button>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 07: The Runway Archive Plate (Inspired by Vogue Runway / Casablanca)
// ======================================================================
function Style6EditorialPlate({ product, inWishlist, handleWishlist, handleQuickAdd, handleQuickView }: any) {
  return (
    <div className="group relative flex flex-col h-full bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#1F1E1D]/20 shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="px-3 py-1.5 bg-[#1F1E1D] text-white flex items-center justify-between text-[8px] font-mono uppercase tracking-widest">
        <span>07 • RUNWAY ARCHIVE</span>
        <span className="text-[#C5A059]">PLATE 07/26</span>
      </div>
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#ECE6DD]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </Link>
        <button type="button" onClick={handleWishlist} className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-black hover:scale-110 shadow-sm transition-transform">
          <Heart className={`w-3.5 h-3.5 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>
        <button type="button" onClick={(e) => handleQuickAdd(e)} className="absolute bottom-3 inset-x-4 py-2 rounded-full bg-white/95 text-black font-mono text-[10px] uppercase tracking-wider font-bold shadow-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all text-center hover:bg-[#C5A059]">
          Instant Reserve • ${product.priceAud}
        </button>
      </div>
      <div className="p-3 flex flex-col flex-1 justify-between bg-[#FAF7F2]">
        <div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif text-sm font-medium text-[#1F1E1D] line-clamp-1">{product.name}</h3>
          </Link>
          <p className="text-[10px] font-mono text-gray-600 truncate mt-0.5">Weft: {product.fabric}</p>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-[#DCC7AF]/60 mt-2 text-xs font-mono">
          <span className="font-bold text-[#1F1E1D]">${product.priceAud} AUD</span>
          <button type="button" onClick={handleQuickView} className="text-[10px] text-[#B86B4B] hover:underline">Plate Notes</button>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 08: The Certified Pit-Loom Seal (Inspired by Aesop / Studio Nicholson)
// ======================================================================
function Style7AuthenticitySeal({ product, inWishlist, handleWishlist, handleQuickAdd, handleQuickView }: any) {
  return (
    <div className="group relative flex flex-col h-full bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#C5A059]/40 shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F2EC]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </Link>
        <div className="absolute top-3 left-3 bg-[#1F1E1D] text-[#C5A059] px-2 py-1 rounded-md text-[8px] font-mono uppercase tracking-widest flex items-center gap-1 border border-[#C5A059]/40 shadow-md">
          <ShieldCheck className="w-3 h-3 text-[#C5A059]" />
          <span>08 • Studio Nicholson Seal</span>
        </div>
        <button type="button" onClick={handleWishlist} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-black hover:scale-110 shadow-sm transition-transform">
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>
        <button type="button" onClick={handleQuickView} className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-mono uppercase tracking-wider text-black font-semibold shadow opacity-0 group-hover:opacity-100 transition-opacity">
          Inspect Craft
        </button>
      </div>
      <div className="p-3.5 flex flex-col flex-1 justify-between bg-[#FAF7F2]">
        <div>
          <div className="text-[9px] font-mono text-[#78716A] uppercase tracking-wider mb-0.5">Ethical Pit-Loom Archive</div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif text-sm font-medium text-[#1F1E1D] line-clamp-1">{product.name}</h3>
          </Link>
          <p className="text-[10px] font-mono text-[#B86B4B] mt-0.5 truncate">Dye: Wild Cinnamon & Salt</p>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-[#DCC7AF]/60 mt-2">
          <span className="font-mono text-xs font-bold text-black">${product.priceAud} AUD</span>
          <button type="button" onClick={(e) => handleQuickAdd(e)} className="px-3 py-1 bg-[#1F1E1D] hover:bg-[#C5A059] text-white hover:text-black rounded text-[9px] font-mono font-bold uppercase transition-colors">Add to Bag</button>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 09: The Slide-Up Wardrobe Drawer (Inspired by Aritzia / Reformation)
// ======================================================================
function Style8SlideUpDrawer({ product, inWishlist, handleWishlist, handleQuickAdd, handleQuickView }: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="group relative flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F2EC]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img src={isHovered && product.imageHover ? product.imageHover : product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </Link>
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider">
          09 • Reformation Drawer
        </div>
        <button type="button" onClick={handleWishlist} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-black hover:scale-110 shadow-sm transition-transform">
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>
        <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-2.5 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out shadow-2xl">
          <div className="flex items-center justify-between text-[9px] font-mono text-gray-500">
            <span>QUICK ADD SIZE:</span>
            <span className="text-black font-semibold">${product.priceAud} AUD</span>
          </div>
          <div className="flex items-center gap-1">
            {product.sizes.slice(0, 4).map((sz: string) => (
              <button key={sz} type="button" onClick={(e) => handleQuickAdd(e, sz)} className="flex-1 py-1 bg-gray-100 hover:bg-black hover:text-white rounded text-[9px] font-mono font-bold transition-colors text-center">
                {sz.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="p-3.5 flex flex-col flex-1 justify-between bg-white">
        <div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif text-sm font-medium text-[#1F1E1D] line-clamp-1">{product.name}</h3>
          </Link>
          <p className="text-[11px] font-sans text-gray-500 truncate mt-0.5">{product.fabric}</p>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2 text-xs font-mono">
          <span className="font-bold text-black">${product.priceAud} AUD</span>
          <button type="button" onClick={handleQuickView} className="text-[10px] text-gray-500 hover:text-black underline">Quick View</button>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 10: The Atelier Specification Grid (Inspired by Aimé Leon Dore)
// ======================================================================
function Style9AtelierSpec({ product, inWishlist, handleWishlist, handleQuickAdd, handleQuickView }: any) {
  return (
    <div className="group relative flex flex-col h-full bg-[#FAF7F2] rounded-2xl overflow-hidden border-2 border-[#1F1E1D] shadow-md hover:shadow-2xl transition-all duration-300">
      <div className="bg-[#1F1E1D] text-white px-3 py-1 flex items-center justify-between text-[8px] font-mono uppercase tracking-widest">
        <span>10 • AIMÉ LEON DORE SPEC</span>
        <span className="text-[#C5A059]">ARCHIVE #01</span>
      </div>
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#ECE6DD]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </Link>
        <button type="button" onClick={handleWishlist} className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white flex items-center justify-center text-black hover:scale-110 shadow transition-transform">
          <Heart className={`w-3.5 h-3.5 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>
        <button type="button" onClick={handleQuickView} className="absolute bottom-2.5 left-2.5 bg-black/80 backdrop-blur-md text-white px-2.5 py-1 rounded text-[9px] font-mono uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
          View Specs
        </button>
      </div>
      <div className="p-3 flex flex-col flex-1 justify-between bg-[#FAF7F2]">
        <div>
          <div className="flex items-center justify-between text-[9px] font-mono text-[#78716A]">
            <span>{product.collectionName || "Collection 01"}</span>
            <span className="text-[#B86B4B] font-semibold">In Stock</span>
          </div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif text-sm font-semibold text-[#1F1E1D] line-clamp-1 mt-0.5">{product.name}</h3>
          </Link>
          <p className="text-[10px] font-mono text-[#78716A] truncate">{product.fabric}</p>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-black/10 mt-2">
          <span className="font-mono text-xs font-bold text-[#1F1E1D]">${product.priceAud} AUD</span>
          <button type="button" onClick={(e) => handleQuickAdd(e)} className="px-3 py-1 bg-[#1F1E1D] hover:bg-[#C5A059] text-white hover:text-black rounded text-[9px] font-mono font-bold uppercase transition-colors">Add to Bag</button>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 11: The Coastal Tide & Sun Meter (Inspired by Matteau)
// ======================================================================
function Style10CoastalTide({ product, inWishlist, handleWishlist, handleQuickAdd }: any) {
  return (
    <div className="group relative flex flex-col h-full bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#DCC7AF] shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#ECE6DD]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </Link>
        <div className="absolute top-3 left-3 bg-[#FAF7F2]/90 backdrop-blur-md text-[#1F1E1D] px-2.5 py-1 rounded-full text-[9px] font-mono uppercase tracking-wider flex items-center gap-1.5 shadow-sm border border-black/5">
          <Sun className="w-3 h-3 text-[#B86B4B]" />
          <span>11 • Matteau Tide</span>
        </div>
        <button type="button" onClick={handleWishlist} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-black hover:scale-110 shadow-sm transition-transform">
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>
        <div className="absolute bottom-3 inset-x-3 bg-black/75 backdrop-blur-md rounded-xl p-2 text-white flex items-center justify-between text-[9px] font-mono">
          <div className="flex items-center gap-1 text-[#DCC7AF]">
            <Wind className="w-3 h-3" />
            <span>Bentota Coast • 28°C</span>
          </div>
          <button type="button" onClick={(e) => handleQuickAdd(e)} className="px-2.5 py-1 bg-[#C5A059] text-black font-bold uppercase rounded hover:bg-white transition-colors">
            Reserve
          </button>
        </div>
      </div>
      <div className="p-3 flex flex-col flex-1 justify-between bg-[#FAF7F2]">
        <div>
          <span className="text-[9px] font-mono uppercase tracking-widest text-[#78716A]">Salt-Washed Voile</span>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif text-sm font-medium text-[#1F1E1D] line-clamp-1 mt-0.5">{product.name}</h3>
          </Link>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-[#DCC7AF]/60 mt-2 text-xs font-mono">
          <span className="font-bold text-[#1F1E1D]">${product.priceAud} AUD</span>
          <span className="text-[10px] text-[#B86B4B]">Low Tide Edition</span>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 12: The Artisan Postcard Provenance (Inspired by Posse)
// ======================================================================
function Style11ArtisanPostcard({ product, inWishlist, handleWishlist, handleQuickAdd }: any) {
  return (
    <div className="group relative flex flex-col h-full bg-[#FAF7F2] p-2 rounded-2xl border-2 border-dashed border-[#DCC7AF] shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#ECE6DD]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </Link>
        <div className="absolute top-2 left-2 bg-[#FAF7F2] text-[#1F1E1D] px-2 py-0.5 rounded shadow text-[8px] font-mono uppercase tracking-widest border border-[#B86B4B]/40">
          12 • Posse Postcard
        </div>
        <button type="button" onClick={handleWishlist} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-black hover:scale-110 shadow-sm transition-transform">
          <Heart className={`w-3.5 h-3.5 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>
      </div>
      <div className="p-2.5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-[8px] font-mono text-[#78716A]">
            <span>SRI LANKA AIRMAIL</span>
            <span className="text-[#B86B4B]">WEAVER DILRUKSHI</span>
          </div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif text-sm font-medium text-[#1F1E1D] line-clamp-1 mt-0.5">{product.name}</h3>
          </Link>
          <p className="text-[10px] font-mono text-gray-500 italic mt-0.5 truncate">"Woven slowly under coastal palms"</p>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-[#DCC7AF]/60 mt-2">
          <span className="font-mono text-xs font-bold text-[#1F1E1D]">${product.priceAud} AUD</span>
          <button type="button" onClick={(e) => handleQuickAdd(e)} className="px-2.5 py-1 bg-[#1F1E1D] hover:bg-[#C5A059] text-white hover:text-black rounded text-[9px] font-mono uppercase font-bold transition-colors">Bag It</button>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 13: The Asymmetric Split Cutout (Inspired by Sir The Label)
// ======================================================================
function Style12AsymmetricSplit({ product, inWishlist, handleWishlist, handleQuickAdd, handleQuickView }: any) {
  return (
    <div className="group relative flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-300">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </Link>
        <div className="absolute top-3 left-3 bg-[#1F1E1D] text-white px-2.5 py-1 rounded-sm text-[9px] font-mono uppercase tracking-widest">
          13 • Sir The Label
        </div>
        <button type="button" onClick={handleWishlist} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-black hover:scale-110 shadow-sm transition-transform">
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between">
          <span className="bg-white/95 px-2 py-1 rounded text-[9px] font-mono text-black font-semibold shadow">120 GSM Voile</span>
          <button type="button" onClick={handleQuickView} className="p-2 rounded bg-black/80 text-white hover:bg-black transition-colors" title="Loupe View">
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div className="p-3.5 flex flex-col flex-1 justify-between bg-white">
        <div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif text-sm font-semibold text-black line-clamp-1">{product.name}</h3>
          </Link>
          <p className="text-[10px] font-mono text-gray-500 mt-0.5 truncate">{product.fabric}</p>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
          <span className="font-mono text-xs font-bold text-black">${product.priceAud} AUD</span>
          <button type="button" onClick={(e) => handleQuickAdd(e)} className="px-3 py-1 bg-black hover:bg-[#C5A059] text-white hover:text-black rounded text-[9px] font-mono uppercase font-bold transition-colors">Add</button>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 14: The Pure Minimalist Whisper (Inspired by The Row)
// ======================================================================
function Style13PureMinimalist({ product, inWishlist, handleWishlist, handleQuickAdd }: any) {
  return (
    <div className="group relative flex flex-col h-full bg-[#FAF7F2] p-1 rounded-2xl hover:bg-white transition-colors duration-500 border border-transparent hover:border-[#DCC7AF]">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#EBE5DC]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </Link>
        <div className="absolute top-2.5 left-2.5 text-[8px] font-mono tracking-widest text-[#1F1E1D]/60 uppercase">
          14 • The Row
        </div>
        <button type="button" onClick={handleWishlist} className="absolute top-2.5 right-2.5 text-black/50 hover:text-black transition-colors">
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-black text-black" : ""}`} />
        </button>
        <div className="absolute bottom-2 inset-x-2 bg-white/95 backdrop-blur-md rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between shadow-lg">
          <span className="text-[9px] font-mono text-gray-700">Select Size:</span>
          <div className="flex gap-1">
            {["XS", "S", "M", "L"].map((s) => (
              <button key={s} type="button" onClick={(e) => handleQuickAdd(e, s)} className="px-1.5 py-0.5 rounded bg-gray-100 hover:bg-black hover:text-white text-[8px] font-mono font-bold transition-colors">{s}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="pt-2 pb-1 px-1 flex items-baseline justify-between">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-serif text-xs text-[#1F1E1D] font-normal truncate max-w-[150px]">{product.name}</h3>
        </Link>
        <span className="font-mono text-xs text-[#1F1E1D] font-medium">${product.priceAud}</span>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 15: The Sculptural Hardware Frame (Inspired by Cult Gaia)
// ======================================================================
function Style14SculpturalHardware({ product, inWishlist, handleWishlist, handleQuickAdd }: any) {
  return (
    <div className="group relative flex flex-col h-full bg-[#1F1E1D] text-white rounded-2xl overflow-hidden border border-[#C5A059]/40 shadow-xl hover:shadow-2xl transition-all duration-300">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/40">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </Link>
        <div className="absolute top-3 left-3 bg-[#C5A059] text-black px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-widest uppercase shadow">
          15 • Cult Gaia Brass
        </div>
        <button type="button" onClick={handleWishlist} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-[#C5A059] flex items-center justify-center hover:scale-110 transition-transform">
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#C5A059]" : ""}`} />
        </button>
        <div className="absolute bottom-3 inset-x-3 bg-black/80 backdrop-blur-md border border-[#C5A059]/30 rounded-xl p-2.5 flex items-center justify-between">
          <span className="text-[10px] font-mono text-[#DCC7AF]">Hand-Carved Shell</span>
          <button type="button" onClick={(e) => handleQuickAdd(e)} className="px-3 py-1 bg-[#C5A059] text-black font-mono text-[9px] font-bold uppercase rounded-lg hover:bg-white transition-colors">Reserve</button>
        </div>
      </div>
      <div className="p-3 flex flex-col flex-1 justify-between bg-[#1F1E1D]">
        <div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif text-sm font-medium text-white line-clamp-1">{product.name}</h3>
          </Link>
          <p className="text-[10px] font-mono text-[#DCC7AF]/70 mt-0.5 truncate">{product.fabric}</p>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-2 text-xs font-mono">
          <span className="font-bold text-[#C5A059]">${product.priceAud} AUD</span>
          <span className="text-[10px] text-white/60">Limited Capsule</span>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 16: The Eco-Provenance & Carbon Metric (Inspired by Nanushka)
// ======================================================================
function Style15EcoCarbonMetric({ product, inWishlist, handleWishlist, handleQuickAdd }: any) {
  return (
    <div className="group relative flex flex-col h-full bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#A7B89E] shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#EAE8E2]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </Link>
        <div className="absolute top-3 left-3 bg-[#4E6349] text-white px-2.5 py-0.5 rounded-full text-[8px] font-mono uppercase tracking-wider flex items-center gap-1">
          <Leaf className="w-3 h-3" />
          <span>16 • Nanushka Eco (-1.4kg CO₂)</span>
        </div>
        <button type="button" onClick={handleWishlist} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-black hover:scale-110 shadow-sm transition-transform">
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>
        <button type="button" onClick={(e) => handleQuickAdd(e)} className="absolute bottom-3 inset-x-4 py-2 bg-[#4E6349] text-white rounded-full font-mono text-[9px] uppercase font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow text-center hover:bg-black">
          100% Biodegradable • Add to Bag
        </button>
      </div>
      <div className="p-3 flex flex-col flex-1 justify-between bg-[#FAF7F2]">
        <div>
          <span className="text-[9px] font-mono text-[#4E6349] uppercase font-bold">Zero Chemical Fixatives</span>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif text-sm font-medium text-[#1F1E1D] line-clamp-1 mt-0.5">{product.name}</h3>
          </Link>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-[#DCC7AF]/60 mt-2 text-xs font-mono">
          <span className="font-bold text-[#1F1E1D]">${product.priceAud} AUD</span>
          <span className="text-[10px] text-[#4E6349]">Botanical Vat</span>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 17: The Botanical Dye Recipe Vat (Inspired by Lemaire)
// ======================================================================
function Style16BotanicalDyeVat({ product, inWishlist, handleWishlist, handleQuickAdd }: any) {
  return (
    <div className="group relative flex flex-col h-full bg-[#1C1A18] text-[#FAF7F2] rounded-2xl overflow-hidden border border-[#C5A059]/30 shadow-lg hover:shadow-2xl transition-all duration-300">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/50">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </Link>
        <div className="absolute top-3 left-3 bg-[#B86B4B] text-white px-2.5 py-0.5 rounded-full text-[8px] font-mono uppercase tracking-widest flex items-center gap-1">
          <Flame className="w-3 h-3" />
          <span>17 • Lemaire Vat (62°C)</span>
        </div>
        <button type="button" onClick={handleWishlist} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:scale-110 transition-transform">
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#C5A059] text-[#C5A059]" : ""}`} />
        </button>
        <div className="absolute bottom-2 inset-x-2 bg-black/80 backdrop-blur-md rounded-xl p-2 text-[9px] font-mono text-[#DCC7AF] flex items-center justify-between">
          <span className="truncate pr-2">Cinnamon Bark & Indigo</span>
          <button type="button" onClick={(e) => handleQuickAdd(e)} className="px-2.5 py-1 bg-[#C5A059] text-black font-bold uppercase rounded hover:bg-white transition-colors">Add</button>
        </div>
      </div>
      <div className="p-3 flex flex-col flex-1 justify-between bg-[#1C1A18]">
        <div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif text-sm font-medium text-white line-clamp-1">{product.name}</h3>
          </Link>
          <p className="text-[10px] font-mono text-[#DCC7AF]/70 mt-0.5 truncate">Dye Time: 48 Hours Infusion</p>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-2 text-xs font-mono">
          <span className="font-bold text-[#C5A059]">${product.priceAud} AUD</span>
          <span className="text-[10px] text-white/50">Raw Handloom</span>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 18: The Romantic Heirloom Poetry (Inspired by Dôen)
// ======================================================================
function Style17RomanticHeirloom({ product, inWishlist, handleWishlist, handleQuickAdd }: any) {
  return (
    <div className="group relative flex flex-col h-full bg-[#FAF7F2] p-2 rounded-3xl border border-[#DCC7AF] shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[#ECE6DD]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </Link>
        <div className="absolute top-3 left-3 bg-[#FAF7F2]/90 px-2.5 py-0.5 rounded-full text-[8px] font-mono text-[#B86B4B] uppercase tracking-widest shadow-sm">
          18 • Dôen Poem
        </div>
        <button type="button" onClick={handleWishlist} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-black hover:scale-110 shadow-sm transition-transform">
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>
        <button type="button" onClick={(e) => handleQuickAdd(e)} className="absolute bottom-3 inset-x-4 py-2 bg-[#1F1E1D] text-white rounded-full font-mono text-[9px] uppercase font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow text-center hover:bg-[#B86B4B]">
          Gather Piece • ${product.priceAud}
        </button>
      </div>
      <div className="p-2.5 flex flex-col flex-1 justify-between">
        <div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif text-sm font-medium text-[#1F1E1D] line-clamp-1 italic">{product.name}</h3>
          </Link>
          <p className="text-[10px] font-serif text-[#78716A] italic line-clamp-1 mt-0.5">"{product.story}"</p>
        </div>
        <div className="flex items-center justify-between pt-1.5 border-t border-[#DCC7AF]/60 mt-1.5 text-xs font-mono">
          <span className="font-bold text-[#1F1E1D]">${product.priceAud} AUD</span>
          <span className="text-[9px] text-[#B86B4B]">Heirloom Voile</span>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 19: The Textile Density Spec (Inspired by Marle)
// ======================================================================
function Style18TextileDensity({ product, inWishlist, handleWishlist, handleQuickAdd }: any) {
  return (
    <div className="group relative flex flex-col h-full bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#1F1E1D]/20 shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#ECE6DD]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </Link>
        <div className="absolute top-3 left-3 bg-[#1F1E1D] text-[#FAF7F2] px-2.5 py-0.5 rounded text-[8px] font-mono uppercase tracking-widest">
          19 • Marle Yarn Spec
        </div>
        <button type="button" onClick={handleWishlist} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-black hover:scale-110 shadow-sm transition-transform">
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>
        <div className="absolute bottom-2 inset-x-2 bg-white/95 backdrop-blur-md rounded-xl p-2 text-[8px] font-mono text-black grid grid-cols-2 gap-1 border border-gray-200">
          <div>WEFT: 60s Pit-Loom</div>
          <div>YARN: Unbleached Voile</div>
        </div>
      </div>
      <div className="p-3 flex flex-col flex-1 justify-between bg-[#FAF7F2]">
        <div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif text-sm font-medium text-[#1F1E1D] line-clamp-1">{product.name}</h3>
          </Link>
          <p className="text-[10px] font-mono text-[#78716A] truncate mt-0.5">38 Hours Master Weaving Time</p>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-[#DCC7AF]/60 mt-2 text-xs font-mono">
          <span className="font-bold text-[#1F1E1D]">${product.priceAud} AUD</span>
          <button type="button" onClick={(e) => handleQuickAdd(e)} className="px-2.5 py-1 bg-[#1F1E1D] text-white hover:bg-[#C5A059] hover:text-black rounded text-[9px] font-bold uppercase transition-colors">Add</button>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 20: The Private Vault Capsule (Inspired by SSENSE)
// ======================================================================
function Style19PrivateVault({ product, inWishlist, handleWishlist, handleQuickAdd }: any) {
  return (
    <div className="group relative flex flex-col h-full bg-[#0E0D0C] text-white rounded-2xl overflow-hidden border border-white/20 shadow-2xl hover:border-[#C5A059] transition-all duration-300">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-black">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
        <div className="absolute top-3 left-3 bg-[#C5A059] text-black px-2.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-widest">
          20 • SSENSE Vault
        </div>
        <button type="button" onClick={handleWishlist} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:scale-110 transition-transform">
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#C5A059] text-[#C5A059]" : ""}`} />
        </button>
        <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between">
          <span className="bg-red-500/80 backdrop-blur-md text-white px-2 py-0.5 rounded text-[8px] font-mono uppercase font-bold tracking-wider animate-pulse">
            Only 2 Left
          </span>
          <button type="button" onClick={(e) => handleQuickAdd(e)} className="px-3 py-1 bg-white text-black font-mono text-[9px] font-bold uppercase rounded hover:bg-[#C5A059] transition-colors">
            Quick Add
          </button>
        </div>
      </div>
      <div className="p-3 flex flex-col flex-1 justify-between bg-[#0E0D0C]">
        <div>
          <div className="flex items-center justify-between text-[9px] font-mono text-white/50 mb-0.5">
            <span>ARCHIVE CAPSULE</span>
            <span className="text-[#C5A059]">1 OF 25</span>
          </div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif text-sm font-semibold text-white line-clamp-1">{product.name}</h3>
          </Link>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-2 text-xs font-mono">
          <span className="font-bold text-[#C5A059]">${product.priceAud} AUD</span>
          <span className="text-[10px] text-white/40">VIP Access</span>
        </div>
      </div>
    </div>
  );
}
