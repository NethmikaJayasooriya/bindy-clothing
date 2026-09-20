"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Heart,
  Eye,
  Scissors,
  Sun,
  Wind,
  Leaf,
  Flame,
  ShieldCheck,
} from "lucide-react";
import type { Product } from "@/data/products";
import { isInWishlist, toggleWishlist, subscribeWishlist } from "@/lib/wishlist";
import { addToCart } from "@/lib/cart";

export interface CreativeProductCardProps {
  product: Product;
  index: number;
  styleVariant?: number;
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
    case 0: return <Style0SculptedArch {...sharedProps} />;
    case 1: return <Style1TactileSwatch {...sharedProps} />;
    case 2: return <Style2BoutiqueHangtag {...sharedProps} />;
    case 3: return <Style3DualPerspective {...sharedProps} />;
    case 4: return <Style4GlassmorphicLuxe {...sharedProps} />;
    case 5: return <Style5QuickSizeGlider {...sharedProps} />;
    case 6: return <Style6EditorialPlate {...sharedProps} />;
    case 7: return <Style7AuthenticitySeal {...sharedProps} />;
    case 8: return <Style8SlideUpDrawer {...sharedProps} />;
    case 9: return <Style9AtelierSpec {...sharedProps} />;
    case 10: return <Style10CoastalTide {...sharedProps} />;
    case 11: return <Style11ArtisanPostcard {...sharedProps} />;
    case 12: return <Style12AsymmetricSplit {...sharedProps} />;
    case 13: return <Style13PureMinimalist {...sharedProps} />;
    case 14: return <Style14SculpturalHardware {...sharedProps} />;
    case 15: return <Style15EcoCarbonMetric {...sharedProps} />;
    case 16: return <Style16BotanicalDyeVat {...sharedProps} />;
    case 17: return <Style17RomanticHeirloom {...sharedProps} />;
    case 18: return <Style18TextileDensity {...sharedProps} />;
    case 19: return <Style19PrivateVault {...sharedProps} />;
    default: return <Style0SculptedArch {...sharedProps} />;
  }
}

// ======================================================================
// STYLE 01: The Sculpted Arch Gallery (Totême — Bold Serif & Outfit Font)
// ======================================================================
function Style0SculptedArch({ product, inWishlist, handleWishlist, handleQuickAdd, handleQuickView }: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col h-full bg-[#FAF7F2] rounded-t-[32px] rounded-b-2xl overflow-hidden border-2 border-[#DCC7AF]/70 shadow-sm hover:shadow-xl transition-all duration-500 font-outfit select-none"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#ECE6DD]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img
            src={isHovered && product.imageHover ? product.imageHover : product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>
        <div className="absolute top-3 left-3 bg-[#1F1E1D]/90 backdrop-blur-md text-[#C5A059] px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase border border-[#C5A059]/40 shadow-sm">
          01 • Totême Arch
        </div>
        <button
          type="button"
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-[#1F1E1D] hover:scale-110 shadow-md transition-transform"
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>

        {/* Desktop: Hidden until hover. Mobile: Accessible */}
        <div className="absolute bottom-2 inset-x-2 bg-[#1F1E1D]/95 backdrop-blur-xl border border-white/20 rounded-xl p-2.5 flex items-center justify-between opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:pointer-events-none sm:group-hover:pointer-events-auto sm:translate-y-2 sm:group-hover:translate-y-0 transition-all duration-300 shadow-2xl">
          <div className="flex items-center gap-1.5 flex-1">
            {product.sizes.slice(0, 4).map((sz: string) => (
              <button
                key={sz}
                type="button"
                onClick={(e) => handleQuickAdd(e, sz)}
                className="flex-1 py-1.5 rounded bg-white/10 hover:bg-[#C5A059] text-white hover:text-black text-xs font-outfit font-bold transition-colors text-center"
              >
                {sz.split(" ")[0]}
              </button>
            ))}
          </div>
          <button type="button" onClick={handleQuickView} className="p-1.5 ml-2 text-white/80 hover:text-white" title="Quick View">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between bg-[#FAF7F2]">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#B86B4B]">
            {product.category} • Handloom Voile
          </span>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif text-base sm:text-lg font-bold text-[#1F1E1D] hover:text-[#B86B4B] transition-colors line-clamp-1 mt-1 leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-[#DCC7AF]/60 mt-3">
          <span className="font-outfit text-base sm:text-lg font-extrabold text-[#1F1E1D]">${product.priceAud} AUD</span>
          <span className="text-xs font-mono font-bold text-[#B86B4B] bg-[#B86B4B]/10 px-2 py-0.5 rounded-full">Artisan Weave</span>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 02: The Tactile Swatch Bar (Jacquemus — Bold Poppins Font)
// ======================================================================
function Style1TactileSwatch({ product, inWishlist, handleWishlist, handleQuickAdd, handleQuickView }: any) {
  return (
    <div className="group relative flex flex-col h-full bg-white rounded-2xl overflow-hidden border-2 border-[#DCC7AF] shadow-sm hover:shadow-xl transition-all duration-300 font-poppins">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F2EC]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </Link>
        <div className="absolute top-3 left-3 bg-[#FAF7F2] text-[#1F1E1D] px-3 py-1 rounded-full text-xs font-poppins font-bold tracking-wider uppercase border border-black/10 shadow-sm">
          02 • Jacquemus Swatch
        </div>
        <button type="button" onClick={handleWishlist} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center text-[#1F1E1D] hover:scale-110 shadow-md transition-transform">
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-full flex items-center gap-2 shadow-md border border-black/10">
          <span className="w-4 h-4 rounded-full border border-black/20 shadow-inner" style={{ backgroundColor: product.colorHex || "#C5A059" }} />
          <span className="text-xs font-poppins font-bold text-black">{product.colorName}</span>
        </div>
        {/* Desktop: hover reveal. Mobile: visible */}
        <button
          type="button"
          onClick={(e) => handleQuickAdd(e)}
          className="absolute bottom-3 right-3 bg-[#1F1E1D] hover:bg-[#C5A059] text-white hover:text-black px-3.5 py-1.5 rounded-full text-xs font-poppins font-bold uppercase tracking-wider shadow-lg transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:translate-y-2 sm:group-hover:translate-y-0"
        >
          + Quick Add
        </button>
      </div>
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-xs font-mono font-bold text-[#78716A] mb-1">
            <span>{product.storyPlace || "Southern Coast"}</span>
            <span className="text-[#C5A059] font-poppins font-bold">★ 4.9 (28 Reviews)</span>
          </div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-poppins text-base sm:text-lg font-bold text-[#1F1E1D] hover:text-[#C5A059] transition-colors line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs font-poppins text-gray-500 font-medium truncate mt-1">{product.fabric}</p>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3">
          <span className="font-poppins text-base sm:text-lg font-black text-[#1F1E1D]">${product.priceAud} AUD</span>
          <button type="button" onClick={handleQuickView} className="text-xs font-poppins font-bold text-[#78716A] hover:text-black underline">Quick View</button>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 03: The Boutique Linen Hangtag (Bode — Playfair Display Font)
// ======================================================================
function Style2BoutiqueHangtag({ product, inWishlist, handleWishlist, handleQuickAdd, handleQuickView }: any) {
  return (
    <div className="group relative flex flex-col h-full bg-[#FAF7F2] rounded-2xl overflow-hidden border-2 border-[#C5A059]/60 shadow-sm hover:shadow-xl transition-all duration-300 font-playfair">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#ECE6DD]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </Link>
        <div className="absolute top-2.5 left-2.5 bg-[#F4EDE2] text-[#1F1E1D] px-3 py-1 rounded shadow-md border-t-2 border-l-2 border-[#C5A059] font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
          <Scissors className="w-3 h-3 text-[#B86B4B]" />
          <span>03 • Bode Hangtag #04</span>
        </div>
        <button type="button" onClick={handleWishlist} className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center text-[#1F1E1D] hover:scale-110 shadow-md transition-transform">
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>
        {/* Desktop: hidden until hover. Mobile: visible */}
        <div className="absolute inset-x-2.5 bottom-2.5 bg-[#1F1E1D]/95 backdrop-blur-md rounded-xl p-2.5 flex items-center justify-between text-white shadow-xl opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:pointer-events-none sm:group-hover:pointer-events-auto sm:translate-y-2 sm:group-hover:translate-y-0 transition-all duration-300">
          <span className="text-xs font-mono font-bold text-[#DCC7AF]">Sizes: AU 6 – 14</span>
          <button type="button" onClick={(e) => handleQuickAdd(e)} className="px-3.5 py-1.5 bg-[#C5A059] text-black font-mono text-xs font-bold uppercase rounded-lg hover:bg-white transition-colors">Add to Bag</button>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1 justify-between bg-[#FAF7F2]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#B86B4B] font-bold">Pit-Loom Weave</span>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-playfair text-base sm:text-lg font-bold text-[#1F1E1D] line-clamp-1 mt-1 leading-snug">{product.name}</h3>
          </Link>
          <p className="text-xs font-mono text-[#78716A] truncate mt-1">{product.destinations?.[0] || "Resort"} Edition</p>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-[#DCC7AF]/60 mt-3 font-sans">
          <span className="font-outfit text-base sm:text-lg font-extrabold text-[#1F1E1D]">${product.priceAud} AUD</span>
          <button type="button" onClick={handleQuickView} className="text-xs font-mono font-bold text-[#B86B4B] hover:underline">Inspect Notes</button>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 04: The Dual-Perspective Angle (Loewe — Bold Modern Sans)
// ======================================================================
function Style3DualPerspective({ product, inWishlist, handleWishlist, handleQuickAdd }: any) {
  const [viewAngle, setViewAngle] = useState<"front" | "back">("front");

  return (
    <div className="group relative flex flex-col h-full bg-white rounded-2xl overflow-hidden border-2 border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 font-sans">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#ECE6DD]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img src={viewAngle === "back" && product.imageHover ? product.imageHover : product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </Link>
        <div className="absolute top-3 left-3 bg-[#1E3A8A] text-white px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider shadow">
          04 • Loewe Dual Angle
        </div>
        <button type="button" onClick={handleWishlist} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center text-[#1F1E1D] hover:scale-110 shadow-md transition-transform">
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>
        {/* Desktop: subtle hover pill. Mobile: tap-able */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md p-1 rounded-full flex items-center gap-1 shadow-lg border border-black/10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:pointer-events-none sm:group-hover:pointer-events-auto transition-all">
          <button type="button" onClick={() => setViewAngle("front")} className={`px-3 py-1 rounded-full text-xs font-sans font-bold uppercase transition-colors ${viewAngle === "front" ? "bg-black text-white" : "text-gray-700 hover:text-black"}`}>Front View</button>
          <button type="button" onClick={() => setViewAngle("back")} className={`px-3 py-1 rounded-full text-xs font-sans font-bold uppercase transition-colors ${viewAngle === "back" ? "bg-black text-white" : "text-gray-700 hover:text-black"}`}>Detail</button>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-sans text-base sm:text-lg font-bold text-[#1F1E1D] line-clamp-1 leading-snug">{product.name}</h3>
          </Link>
          <p className="text-xs font-mono font-medium text-[#78716A] truncate mt-1">{product.fabric}</p>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3 font-outfit">
          <span className="text-base sm:text-lg font-black text-black">${product.priceAud} AUD</span>
          <button type="button" onClick={(e) => handleQuickAdd(e)} className="px-4 py-1.5 bg-[#1F1E1D] hover:bg-[#C5A059] text-white hover:text-black rounded-lg text-xs font-bold uppercase transition-colors">+ Add to Bag</button>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 05: The Floating Glassmorphic Luxe (Khaite — Outfit Font)
// ======================================================================
function Style4GlassmorphicLuxe({ product, inWishlist, handleWishlist, handleQuickAdd }: any) {
  return (
    <div className="group relative flex flex-col h-full bg-[#11100F] rounded-2xl overflow-hidden border-2 border-[#C5A059]/40 shadow-xl hover:shadow-2xl transition-all duration-500 font-outfit">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-black">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-[#C5A059] px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-widest border border-[#C5A059]/40">
          05 • Khaite Glass Luxe
        </div>
        <button type="button" onClick={handleWishlist} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:scale-110 transition-transform">
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#C5A059] text-[#C5A059]" : ""}`} />
        </button>
        {/* Desktop: lifts on hover. Mobile: compact dock */}
        <div className="absolute bottom-3 inset-x-3 bg-white/15 backdrop-blur-xl border border-white/30 rounded-xl p-3.5 text-white shadow-2xl transition-transform duration-300 sm:translate-y-2 sm:group-hover:translate-y-0">
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="font-outfit text-base font-bold text-white truncate max-w-[70%]">{product.name}</h3>
            <span className="font-outfit text-base font-black text-[#C5A059]">${product.priceAud}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-white/15">
            <span className="text-xs font-mono text-white/70 truncate">{product.fabric.split(" ")[0]} Weave</span>
            <button type="button" onClick={(e) => handleQuickAdd(e)} className="px-3.5 py-1.5 rounded-lg bg-[#C5A059] hover:bg-white text-black text-xs font-bold uppercase transition-colors">Add To Bag</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 06: The Instant Size Glider (Zara Studio — Bold Poppins Font)
// ======================================================================
function Style5QuickSizeGlider({ product, inWishlist, handleWishlist, handleQuickAdd, handleQuickView }: any) {
  const [justAdded, setJustAdded] = useState<string | null>(null);

  return (
    <div className="group relative flex flex-col h-full bg-white rounded-2xl overflow-hidden border-2 border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 font-poppins">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F2EC]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </Link>
        <div className="absolute top-3 left-3 bg-[#FAF7F2] text-[#1F1E1D] px-3 py-1 rounded-full text-xs font-poppins font-bold uppercase tracking-wider border border-gray-300 shadow-sm">
          06 • Zara Glider
        </div>
        <button type="button" onClick={handleWishlist} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center text-black hover:scale-110 shadow-md transition-transform">
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>

        {/* Desktop: Hidden until hover. Mobile: directly accessible */}
        <div className="absolute inset-x-2.5 bottom-2.5 bg-white/98 backdrop-blur-md border border-gray-200 rounded-xl p-2.5 shadow-xl opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:pointer-events-none sm:group-hover:pointer-events-auto sm:translate-y-2 sm:group-hover:translate-y-0 transition-all duration-300">
          <div className="flex items-center justify-between text-xs font-poppins font-bold text-gray-700 mb-1.5 px-1">
            <span>Select Size & Add:</span>
            {justAdded && <span className="text-emerald-600 font-bold">Added {justAdded}!</span>}
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {product.sizes.slice(0, 4).map((sz: string) => (
              <button
                key={sz}
                type="button"
                onClick={(e) => {
                  handleQuickAdd(e, sz);
                  setJustAdded(sz);
                  setTimeout(() => setJustAdded(null), 1500);
                }}
                className="py-1.5 rounded-lg bg-gray-100 hover:bg-black hover:text-white text-xs font-poppins font-bold transition-colors text-center"
              >
                {sz.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-poppins text-base sm:text-lg font-bold text-[#1F1E1D] hover:text-[#B86B4B] transition-colors line-clamp-1 leading-snug">{product.name}</h3>
          </Link>
          <p className="text-xs font-poppins text-gray-500 font-medium truncate mt-1">{product.story}</p>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3">
          <span className="font-poppins text-base sm:text-lg font-black text-black">${product.priceAud} AUD</span>
          <button type="button" onClick={handleQuickView} className="text-xs font-poppins font-bold text-[#B86B4B] hover:underline">Details</button>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 07: The Runway Archive Plate (Vogue Runway — Playfair Font)
// ======================================================================
function Style6EditorialPlate({ product, inWishlist, handleWishlist, handleQuickAdd, handleQuickView }: any) {
  return (
    <div className="group relative flex flex-col h-full bg-[#FAF7F2] rounded-2xl overflow-hidden border-2 border-[#1F1E1D] shadow-sm hover:shadow-xl transition-all duration-300 font-playfair">
      <div className="px-4 py-2 bg-[#1F1E1D] text-white flex items-center justify-between text-xs font-mono font-bold uppercase tracking-widest">
        <span>07 • RUNWAY ARCHIVE</span>
        <span className="text-[#C5A059]">PLATE 07/26</span>
      </div>
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#ECE6DD]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </Link>
        <button type="button" onClick={handleWishlist} className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 flex items-center justify-center text-black hover:scale-110 shadow transition-transform">
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>
        {/* Desktop: hidden until hover. Mobile: accessible */}
        <button
          type="button"
          onClick={(e) => handleQuickAdd(e)}
          className="absolute bottom-3 inset-x-4 py-2.5 rounded-full bg-white/95 text-black font-outfit text-xs uppercase tracking-wider font-extrabold shadow-xl hover:bg-[#C5A059] text-center transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:pointer-events-none sm:group-hover:pointer-events-auto sm:translate-y-2 sm:group-hover:translate-y-0"
        >
          Instant Reserve • ${product.priceAud} AUD
        </button>
      </div>
      <div className="p-4 flex flex-col flex-1 justify-between bg-[#FAF7F2]">
        <div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-playfair text-base sm:text-lg font-bold text-[#1F1E1D] line-clamp-1 leading-snug">{product.name}</h3>
          </Link>
          <p className="text-xs font-mono font-medium text-gray-700 truncate mt-1">Weft: {product.fabric}</p>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-[#DCC7AF]/60 mt-3 font-outfit">
          <span className="font-extrabold text-base sm:text-lg text-[#1F1E1D]">${product.priceAud} AUD</span>
          <button type="button" onClick={handleQuickView} className="text-xs font-bold text-[#B86B4B] hover:underline">Plate Notes</button>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 08: The Certified Pit-Loom Seal (Studio Nicholson — Sans / Serif)
// ======================================================================
function Style7AuthenticitySeal({ product, inWishlist, handleWishlist, handleQuickAdd, handleQuickView }: any) {
  return (
    <div className="group relative flex flex-col h-full bg-[#FAF7F2] rounded-2xl overflow-hidden border-2 border-[#C5A059]/60 shadow-sm hover:shadow-xl transition-all duration-300 font-sans">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F2EC]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </Link>
        <div className="absolute top-3 left-3 bg-[#1F1E1D] text-[#C5A059] px-3 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 border border-[#C5A059]/40 shadow-md">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>08 • Studio Nicholson Seal</span>
        </div>
        <button type="button" onClick={handleWishlist} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center text-black hover:scale-110 shadow-md transition-transform">
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>
        {/* Desktop: hover reveal. Mobile: visible */}
        <button
          type="button"
          onClick={handleQuickView}
          className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-sans font-bold uppercase tracking-wider text-black shadow-md opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:pointer-events-none sm:group-hover:pointer-events-auto transition-opacity"
        >
          Inspect Craft
        </button>
      </div>
      <div className="p-4 flex flex-col flex-1 justify-between bg-[#FAF7F2]">
        <div>
          <div className="text-[11px] font-mono font-bold text-[#78716A] uppercase tracking-wider mb-1">Ethical Pit-Loom Archive</div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif text-base sm:text-lg font-bold text-[#1F1E1D] line-clamp-1 leading-snug">{product.name}</h3>
          </Link>
          <p className="text-xs font-mono font-bold text-[#B86B4B] mt-1 truncate">Natural Dye: Wild Cinnamon & Salt</p>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-[#DCC7AF]/60 mt-3 font-outfit">
          <span className="text-base sm:text-lg font-black text-black">${product.priceAud} AUD</span>
          <button type="button" onClick={(e) => handleQuickAdd(e)} className="px-4 py-1.5 bg-[#1F1E1D] hover:bg-[#C5A059] text-white hover:text-black rounded-lg text-xs font-bold uppercase transition-colors">Add to Bag</button>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 09: The Slide-Up Wardrobe Drawer (Reformation — Poppins Font)
// ======================================================================
function Style8SlideUpDrawer({ product, inWishlist, handleWishlist, handleQuickAdd, handleQuickView }: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="group relative flex flex-col h-full bg-white rounded-2xl overflow-hidden border-2 border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 font-poppins">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F2EC]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img src={isHovered && product.imageHover ? product.imageHover : product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </Link>
        <div className="absolute top-3 left-3 bg-[#1F1E1D]/90 text-white px-3 py-1 rounded-full text-xs font-poppins font-bold uppercase tracking-wider shadow">
          09 • Reformation Drawer
        </div>
        <button type="button" onClick={handleWishlist} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center text-black hover:scale-110 shadow-md transition-transform">
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>
        {/* Desktop: Slides up from bottom on hover. Mobile: Available */}
        <div className="absolute inset-x-0 bottom-0 bg-white/98 backdrop-blur-md border-t border-gray-200 p-3 flex flex-col gap-2 shadow-2xl opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:pointer-events-none sm:group-hover:pointer-events-auto sm:translate-y-full sm:group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <div className="flex items-center justify-between text-xs font-poppins font-bold text-gray-700">
            <span>QUICK ADD SIZE:</span>
            <span className="text-black font-extrabold">${product.priceAud} AUD</span>
          </div>
          <div className="flex items-center gap-1.5">
            {product.sizes.slice(0, 4).map((sz: string) => (
              <button key={sz} type="button" onClick={(e) => handleQuickAdd(e, sz)} className="flex-1 py-1.5 bg-gray-100 hover:bg-black hover:text-white rounded-lg text-xs font-poppins font-bold transition-colors text-center">
                {sz.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-poppins text-base sm:text-lg font-bold text-[#1F1E1D] line-clamp-1 leading-snug">{product.name}</h3>
          </Link>
          <p className="text-xs font-poppins text-gray-500 font-medium truncate mt-1">{product.fabric}</p>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3">
          <span className="font-poppins font-black text-base sm:text-lg text-black">${product.priceAud} AUD</span>
          <button type="button" onClick={handleQuickView} className="text-xs font-poppins font-bold text-gray-500 hover:text-black underline">Quick View</button>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 10: The Atelier Specification Grid (Aimé Leon Dore — Monospace/Serif)
// ======================================================================
function Style9AtelierSpec({ product, inWishlist, handleWishlist, handleQuickAdd, handleQuickView }: any) {
  return (
    <div className="group relative flex flex-col h-full bg-[#FAF7F2] rounded-2xl overflow-hidden border-2 border-[#1E293B] shadow-md hover:shadow-2xl transition-all duration-300 font-sans">
      <div className="bg-[#1E293B] text-white px-3.5 py-1.5 flex items-center justify-between text-xs font-mono font-bold uppercase tracking-widest">
        <span>10 • AIMÉ LEON DORE SPEC</span>
        <span className="text-[#C5A059]">ARCHIVE #01</span>
      </div>
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#ECE6DD]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </Link>
        <button type="button" onClick={handleWishlist} className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white flex items-center justify-center text-black hover:scale-110 shadow transition-transform">
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>
        {/* Desktop: hidden until hover. Mobile: accessible */}
        <button
          type="button"
          onClick={handleQuickView}
          className="absolute bottom-2.5 left-2.5 bg-[#1E293B] text-white px-3 py-1.5 rounded text-xs font-mono font-bold uppercase tracking-wider opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:pointer-events-none sm:group-hover:pointer-events-auto transition-opacity"
        >
          View Specs
        </button>
      </div>
      <div className="p-4 flex flex-col flex-1 justify-between bg-[#FAF7F2]">
        <div>
          <div className="flex items-center justify-between text-xs font-mono font-bold text-[#78716A]">
            <span>{product.collectionName || "Collection 01"}</span>
            <span className="text-[#B86B4B] font-bold">Limited 25 Pcs</span>
          </div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif text-base sm:text-lg font-bold text-[#1F1E1D] line-clamp-1 mt-1 leading-snug">{product.name}</h3>
          </Link>
          <p className="text-xs font-mono text-[#78716A] truncate mt-1">{product.fabric}</p>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-black/10 mt-3 font-outfit">
          <span className="text-base sm:text-lg font-black text-[#1F1E1D]">${product.priceAud} AUD</span>
          <button type="button" onClick={(e) => handleQuickAdd(e)} className="px-4 py-1.5 bg-[#1E293B] hover:bg-[#C5A059] text-white hover:text-black rounded text-xs font-bold uppercase transition-colors">Add to Bag</button>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 11: The Coastal Tide & Sun Meter (Matteau — Outfit Font)
// ======================================================================
function Style10CoastalTide({ product, inWishlist, handleWishlist, handleQuickAdd }: any) {
  return (
    <div className="group relative flex flex-col h-full bg-[#FAF7F2] rounded-2xl overflow-hidden border-2 border-[#DCC7AF] shadow-sm hover:shadow-xl transition-all duration-300 font-outfit">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#ECE6DD]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </Link>
        <div className="absolute top-3 left-3 bg-[#FAF7F2]/95 backdrop-blur-md text-[#1F1E1D] px-3 py-1 rounded-full text-xs font-outfit font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm border border-black/10">
          <Sun className="w-3.5 h-3.5 text-[#B86B4B]" />
          <span>11 • Matteau Tide</span>
        </div>
        <button type="button" onClick={handleWishlist} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center text-black hover:scale-110 shadow-md transition-transform">
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>
        {/* Desktop: hidden until hover. Mobile: accessible */}
        <div className="absolute bottom-3 inset-x-3 bg-black/80 backdrop-blur-md rounded-xl p-2.5 text-white flex items-center justify-between text-xs font-mono opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:pointer-events-none sm:group-hover:pointer-events-auto sm:translate-y-2 sm:group-hover:translate-y-0 transition-all">
          <div className="flex items-center gap-1.5 text-[#DCC7AF]">
            <Wind className="w-3.5 h-3.5" />
            <span className="font-bold">Bentota • 28°C</span>
          </div>
          <button type="button" onClick={(e) => handleQuickAdd(e)} className="px-3 py-1 bg-[#C5A059] text-black font-bold uppercase rounded hover:bg-white transition-colors">
            Reserve
          </button>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1 justify-between bg-[#FAF7F2]">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#B86B4B]">Salt-Washed Voile</span>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-outfit text-base sm:text-lg font-bold text-[#1F1E1D] line-clamp-1 mt-1 leading-snug">{product.name}</h3>
          </Link>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-[#DCC7AF]/60 mt-3">
          <span className="text-base sm:text-lg font-black text-[#1F1E1D]">${product.priceAud} AUD</span>
          <span className="text-xs font-mono font-bold text-[#B86B4B] bg-[#B86B4B]/10 px-2 py-0.5 rounded-full">Breeze Edition</span>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 12: The Artisan Postcard Provenance (Posse — Fraunces & Mono)
// ======================================================================
function Style11ArtisanPostcard({ product, inWishlist, handleWishlist, handleQuickAdd }: any) {
  return (
    <div className="group relative flex flex-col h-full bg-[#FAF7F2] p-2.5 rounded-2xl border-2 border-dashed border-[#DCC7AF] shadow-sm hover:shadow-xl transition-all duration-300 font-sans">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#ECE6DD]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </Link>
        <div className="absolute top-2.5 left-2.5 bg-[#FAF7F2] text-[#1F1E1D] px-2.5 py-1 rounded shadow text-[10px] font-mono font-bold uppercase tracking-widest border border-[#B86B4B]/40">
          12 • Posse Postcard
        </div>
        <button type="button" onClick={handleWishlist} className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 flex items-center justify-center text-black hover:scale-110 shadow transition-transform">
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>
      </div>
      <div className="p-3 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#78716A]">
            <span>AIRMAIL POSTAGE</span>
            <span className="text-[#B86B4B]">WEAVER DILRUKSHI</span>
          </div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif text-base sm:text-lg font-bold text-[#1F1E1D] line-clamp-1 mt-1 leading-snug">{product.name}</h3>
          </Link>
          <p className="text-xs font-serif text-gray-600 italic mt-1 truncate">"Woven slowly under coastal palms"</p>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-[#DCC7AF]/60 mt-3 font-outfit">
          <span className="text-base sm:text-lg font-black text-[#1F1E1D]">${product.priceAud} AUD</span>
          <button type="button" onClick={(e) => handleQuickAdd(e)} className="px-3.5 py-1.5 bg-[#1F1E1D] hover:bg-[#C5A059] text-white hover:text-black rounded text-xs font-bold uppercase transition-colors">Bag It</button>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 13: The Asymmetric Split Cutout (Sir The Label — Inter Bold)
// ======================================================================
function Style12AsymmetricSplit({ product, inWishlist, handleWishlist, handleQuickAdd, handleQuickView }: any) {
  return (
    <div className="group relative flex flex-col h-full bg-white rounded-2xl overflow-hidden border-2 border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-300 font-sans">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </Link>
        <div className="absolute top-3 left-3 bg-[#1F1E1D] text-white px-3 py-1 rounded-sm text-xs font-mono font-bold uppercase tracking-widest">
          13 • Sir The Label
        </div>
        <button type="button" onClick={handleWishlist} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center text-black hover:scale-110 shadow-md transition-transform">
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>
        {/* Desktop: hidden until hover. Mobile: accessible */}
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:pointer-events-none sm:group-hover:pointer-events-auto sm:translate-y-2 sm:group-hover:translate-y-0 transition-all">
          <span className="bg-white/95 px-3 py-1 rounded text-xs font-mono font-bold text-black shadow">120 GSM Voile</span>
          <button type="button" onClick={handleQuickView} className="p-2.5 rounded bg-black/90 text-white hover:bg-black transition-colors" title="Loupe View">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1 justify-between bg-white font-sans">
        <div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-sans text-base sm:text-lg font-bold text-black line-clamp-1 leading-snug">{product.name}</h3>
          </Link>
          <p className="text-xs font-mono font-medium text-gray-500 mt-1 truncate">{product.fabric}</p>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3 font-outfit">
          <span className="text-base sm:text-lg font-black text-black">${product.priceAud} AUD</span>
          <button type="button" onClick={(e) => handleQuickAdd(e)} className="px-4 py-1.5 bg-black hover:bg-[#C5A059] text-white hover:text-black rounded text-xs font-bold uppercase transition-colors">Add to Bag</button>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 14: The Pure Minimalist Whisper (The Row — Clean Outfit Font)
// ======================================================================
function Style13PureMinimalist({ product, inWishlist, handleWishlist, handleQuickAdd }: any) {
  return (
    <div className="group relative flex flex-col h-full bg-[#FAF7F2] p-1.5 rounded-2xl hover:bg-white transition-colors duration-500 border-2 border-transparent hover:border-[#DCC7AF] font-outfit">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#EBE5DC]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </Link>
        <div className="absolute top-3 left-3 text-[10px] font-mono font-bold tracking-widest text-[#1F1E1D] uppercase bg-white/80 px-2.5 py-0.5 rounded">
          14 • The Row Minimal
        </div>
        <button type="button" onClick={handleWishlist} className="absolute top-3 right-3 text-black/70 hover:text-black transition-colors">
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-black text-black" : ""}`} />
        </button>
        {/* Desktop: hidden until hover. Mobile: accessible */}
        <div className="absolute bottom-2.5 inset-x-2.5 bg-white/95 backdrop-blur-md rounded-xl p-2.5 flex items-center justify-between shadow-xl opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:pointer-events-none sm:group-hover:pointer-events-auto sm:translate-y-2 sm:group-hover:translate-y-0 transition-all">
          <span className="text-xs font-outfit font-bold text-gray-700">Select Size:</span>
          <div className="flex gap-1.5">
            {["XS", "S", "M", "L"].map((s) => (
              <button key={s} type="button" onClick={(e) => handleQuickAdd(e, s)} className="px-2 py-1 rounded bg-gray-100 hover:bg-black hover:text-white text-xs font-outfit font-bold transition-colors">{s}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="pt-3 pb-1 px-2 flex items-baseline justify-between">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-outfit text-base font-bold text-[#1F1E1D] truncate max-w-[160px]">{product.name}</h3>
        </Link>
        <span className="font-outfit text-base font-extrabold text-[#1F1E1D]">${product.priceAud}</span>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 15: The Sculptural Hardware Frame (Cult Gaia — Playfair Display)
// ======================================================================
function Style14SculpturalHardware({ product, inWishlist, handleWishlist, handleQuickAdd }: any) {
  return (
    <div className="group relative flex flex-col h-full bg-[#1F1E1D] text-white rounded-2xl overflow-hidden border-2 border-[#C5A059]/60 shadow-xl hover:shadow-2xl transition-all duration-300 font-playfair">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/40">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </Link>
        <div className="absolute top-3 left-3 bg-[#C5A059] text-black px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase shadow">
          15 • Cult Gaia Brass
        </div>
        <button type="button" onClick={handleWishlist} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 text-[#C5A059] flex items-center justify-center hover:scale-110 transition-transform">
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#C5A059]" : ""}`} />
        </button>
        {/* Desktop: hidden until hover. Mobile: accessible */}
        <div className="absolute bottom-3 inset-x-3 bg-black/85 backdrop-blur-md border border-[#C5A059]/40 rounded-xl p-3 flex items-center justify-between opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:pointer-events-none sm:group-hover:pointer-events-auto sm:translate-y-2 sm:group-hover:translate-y-0 transition-all">
          <span className="text-xs font-mono font-bold text-[#DCC7AF]">Hand-Carved Shell</span>
          <button type="button" onClick={(e) => handleQuickAdd(e)} className="px-3.5 py-1.5 bg-[#C5A059] text-black font-mono text-xs font-bold uppercase rounded-lg hover:bg-white transition-colors">Reserve</button>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1 justify-between bg-[#1F1E1D]">
        <div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-playfair text-base sm:text-lg font-bold text-white line-clamp-1 leading-snug">{product.name}</h3>
          </Link>
          <p className="text-xs font-mono text-[#DCC7AF]/80 mt-1 truncate">{product.fabric}</p>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-white/15 mt-3 font-outfit">
          <span className="font-black text-base sm:text-lg text-[#C5A059]">${product.priceAud} AUD</span>
          <span className="text-xs font-mono text-white/70">Limited Capsule</span>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 16: The Eco-Provenance & Carbon Metric (Nanushka — Poppins Font)
// ======================================================================
function Style15EcoCarbonMetric({ product, inWishlist, handleWishlist, handleQuickAdd }: any) {
  return (
    <div className="group relative flex flex-col h-full bg-[#FAF7F2] rounded-2xl overflow-hidden border-2 border-[#4E6349] shadow-sm hover:shadow-xl transition-all duration-300 font-poppins">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#EAE8E2]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </Link>
        <div className="absolute top-3 left-3 bg-[#4E6349] text-white px-3 py-1 rounded-full text-xs font-poppins font-bold uppercase tracking-wider flex items-center gap-1.5 shadow">
          <Leaf className="w-3.5 h-3.5" />
          <span>16 • Nanushka (-1.4kg CO₂)</span>
        </div>
        <button type="button" onClick={handleWishlist} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center text-black hover:scale-110 shadow-md transition-transform">
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>
        {/* Desktop: hidden until hover. Mobile: accessible */}
        <button
          type="button"
          onClick={(e) => handleQuickAdd(e)}
          className="absolute bottom-3 inset-x-4 py-2.5 bg-[#4E6349] text-white rounded-full font-poppins text-xs uppercase font-bold shadow-lg text-center hover:bg-black transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:pointer-events-none sm:group-hover:pointer-events-auto sm:translate-y-2 sm:group-hover:translate-y-0"
        >
          100% Biodegradable • Add to Bag
        </button>
      </div>
      <div className="p-4 flex flex-col flex-1 justify-between bg-[#FAF7F2]">
        <div>
          <span className="text-xs font-poppins text-[#4E6349] uppercase font-bold tracking-wider">Zero Chemical Fixatives</span>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-poppins text-base sm:text-lg font-bold text-[#1F1E1D] line-clamp-1 mt-1 leading-snug">{product.name}</h3>
          </Link>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-[#DCC7AF]/60 mt-3 font-outfit">
          <span className="text-base sm:text-lg font-black text-[#1F1E1D]">${product.priceAud} AUD</span>
          <span className="text-xs font-mono font-bold text-[#4E6349] bg-[#4E6349]/10 px-2 py-0.5 rounded-full">Botanical Vat</span>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 17: The Botanical Dye Recipe Vat (Lemaire — Serif & Warm Earth)
// ======================================================================
function Style16BotanicalDyeVat({ product, inWishlist, handleWishlist, handleQuickAdd }: any) {
  return (
    <div className="group relative flex flex-col h-full bg-[#1C1A18] text-[#FAF7F2] rounded-2xl overflow-hidden border-2 border-[#C5A059]/40 shadow-lg hover:shadow-2xl transition-all duration-300 font-serif">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/50">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </Link>
        <div className="absolute top-3 left-3 bg-[#B86B4B] text-white px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 shadow">
          <Flame className="w-3.5 h-3.5" />
          <span>17 • Lemaire Vat (62°C)</span>
        </div>
        <button type="button" onClick={handleWishlist} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:scale-110 transition-transform">
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#C5A059] text-[#C5A059]" : ""}`} />
        </button>
        {/* Desktop: hidden until hover. Mobile: accessible */}
        <div className="absolute bottom-2.5 inset-x-2.5 bg-black/85 backdrop-blur-md rounded-xl p-2.5 text-xs font-mono text-[#DCC7AF] flex items-center justify-between opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:pointer-events-none sm:group-hover:pointer-events-auto sm:translate-y-2 sm:group-hover:translate-y-0 transition-all">
          <span className="truncate pr-2 font-bold">Cinnamon Bark & Indigo</span>
          <button type="button" onClick={(e) => handleQuickAdd(e)} className="px-3 py-1.5 bg-[#C5A059] text-black font-bold uppercase rounded hover:bg-white transition-colors">Add</button>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1 justify-between bg-[#1C1A18]">
        <div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif text-base sm:text-lg font-bold text-white line-clamp-1 leading-snug">{product.name}</h3>
          </Link>
          <p className="text-xs font-mono text-[#DCC7AF]/80 mt-1 truncate">Dye Time: 48 Hours Sun Bath</p>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-white/15 mt-3 font-outfit">
          <span className="font-black text-base sm:text-lg text-[#C5A059]">${product.priceAud} AUD</span>
          <span className="text-xs font-mono text-white/60">Raw Pit-Loom</span>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 18: The Romantic Heirloom Poetry (Dôen — Playfair Italic)
// ======================================================================
function Style17RomanticHeirloom({ product, inWishlist, handleWishlist, handleQuickAdd }: any) {
  return (
    <div className="group relative flex flex-col h-full bg-[#FAF7F2] p-2.5 rounded-3xl border-2 border-[#DCC7AF] shadow-sm hover:shadow-xl transition-all duration-300 font-playfair">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[#ECE6DD]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </Link>
        <div className="absolute top-3 left-3 bg-[#FAF7F2] px-3 py-1 rounded-full text-xs font-serif text-[#B86B4B] font-bold uppercase tracking-widest shadow-sm">
          18 • Dôen Heirloom
        </div>
        <button type="button" onClick={handleWishlist} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center text-black hover:scale-110 shadow-md transition-transform">
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>
        {/* Desktop: hidden until hover. Mobile: accessible */}
        <button
          type="button"
          onClick={(e) => handleQuickAdd(e)}
          className="absolute bottom-3 inset-x-4 py-2.5 bg-[#1F1E1D] text-white rounded-full font-outfit text-xs uppercase font-extrabold shadow-lg text-center hover:bg-[#B86B4B] transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:pointer-events-none sm:group-hover:pointer-events-auto sm:translate-y-2 sm:group-hover:translate-y-0"
        >
          Gather Piece • ${product.priceAud} AUD
        </button>
      </div>
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-playfair text-base sm:text-lg font-bold text-[#1F1E1D] line-clamp-1 italic leading-snug">{product.name}</h3>
          </Link>
          <p className="text-xs font-serif text-[#78716A] italic line-clamp-1 mt-1">"{product.story}"</p>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-[#DCC7AF]/60 mt-3 font-outfit">
          <span className="font-extrabold text-base sm:text-lg text-[#1F1E1D]">${product.priceAud} AUD</span>
          <span className="text-xs font-mono font-bold text-[#B86B4B]">Heirloom Voile</span>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 19: The Textile Density Spec (Marle — Poppins & Monospace)
// ======================================================================
function Style18TextileDensity({ product, inWishlist, handleWishlist, handleQuickAdd }: any) {
  return (
    <div className="group relative flex flex-col h-full bg-[#FAF7F2] rounded-2xl overflow-hidden border-2 border-[#1F1E1D] shadow-sm hover:shadow-xl transition-all duration-300 font-poppins">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#ECE6DD]">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </Link>
        <div className="absolute top-3 left-3 bg-[#1F1E1D] text-[#FAF7F2] px-3 py-1 rounded text-xs font-mono font-bold uppercase tracking-widest">
          19 • Marle Yarn Spec
        </div>
        <button type="button" onClick={handleWishlist} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center text-black hover:scale-110 shadow-md transition-transform">
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : ""}`} />
        </button>
        {/* Desktop: hidden until hover. Mobile: accessible */}
        <div className="absolute bottom-2.5 inset-x-2.5 bg-white/95 backdrop-blur-md rounded-xl p-2.5 text-xs font-mono text-black grid grid-cols-2 gap-1.5 border border-gray-200 shadow-md opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:pointer-events-none sm:group-hover:pointer-events-auto sm:translate-y-2 sm:group-hover:translate-y-0 transition-all">
          <div><strong className="block text-[10px] text-gray-500">WEFT DENSITY:</strong> 60s Pit-Loom</div>
          <div><strong className="block text-[10px] text-gray-500">YARN ORIGIN:</strong> Unbleached Voile</div>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1 justify-between bg-[#FAF7F2]">
        <div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-poppins text-base sm:text-lg font-bold text-[#1F1E1D] line-clamp-1 leading-snug">{product.name}</h3>
          </Link>
          <p className="text-xs font-mono font-medium text-[#78716A] truncate mt-1">38 Hours Master Weaving Time</p>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-[#DCC7AF]/60 mt-3 font-outfit">
          <span className="font-black text-base sm:text-lg text-[#1F1E1D]">${product.priceAud} AUD</span>
          <button type="button" onClick={(e) => handleQuickAdd(e)} className="px-4 py-1.5 bg-[#1F1E1D] text-white hover:bg-[#C5A059] hover:text-black rounded text-xs font-bold uppercase transition-colors">Add</button>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// STYLE 20: The Private Vault Capsule (SSENSE — Bold Outfit Font)
// ======================================================================
function Style19PrivateVault({ product, inWishlist, handleWishlist, handleQuickAdd }: any) {
  return (
    <div className="group relative flex flex-col h-full bg-[#0E0D0C] text-white rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl hover:border-[#C5A059] transition-all duration-300 font-outfit">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-black">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20 pointer-events-none" />
        <div className="absolute top-3 left-3 bg-[#C5A059] text-black px-3 py-1 rounded text-xs font-mono font-bold uppercase tracking-widest shadow">
          20 • SSENSE Vault
        </div>
        <button type="button" onClick={handleWishlist} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:scale-110 transition-transform">
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#C5A059] text-[#C5A059]" : ""}`} />
        </button>
        {/* Desktop: hidden until hover. Mobile: accessible */}
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:pointer-events-none sm:group-hover:pointer-events-auto sm:translate-y-2 sm:group-hover:translate-y-0 transition-all">
          <span className="bg-red-600 text-white px-2.5 py-1 rounded text-xs font-mono uppercase font-bold tracking-wider animate-pulse shadow">
            Only 2 Left
          </span>
          <button type="button" onClick={(e) => handleQuickAdd(e)} className="px-4 py-1.5 bg-white text-black font-outfit text-xs font-bold uppercase rounded-lg hover:bg-[#C5A059] transition-colors shadow">
            Quick Add
          </button>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1 justify-between bg-[#0E0D0C]">
        <div>
          <div className="flex items-center justify-between text-xs font-mono font-bold text-white/60 mb-1">
            <span>ARCHIVE CAPSULE</span>
            <span className="text-[#C5A059]">1 OF 25 PIECES</span>
          </div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-outfit text-base sm:text-lg font-black text-white line-clamp-1 leading-snug">{product.name}</h3>
          </Link>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-white/15 mt-3 font-outfit">
          <span className="font-black text-base sm:text-lg text-[#C5A059]">${product.priceAud} AUD</span>
          <span className="text-xs font-mono font-bold text-white/50">VIP Access</span>
        </div>
      </div>
    </div>
  );
}
