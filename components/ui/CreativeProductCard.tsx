"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Eye, ArrowRight, Maximize, Target, QrCode } from "lucide-react";
import type { Product } from "@/data/products";
import { getAverageRating } from "@/lib/products";
import { isInWishlist, toggleWishlist, subscribeWishlist } from "@/lib/wishlist";
import { addToCart } from "@/lib/cart";
import StarRating from "./StarRating";
import Price from "./Price";
import Badge from "./Badge";

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

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickAdd) {
      onQuickAdd(product, defaultSize);
    } else {
      addToCart(product, defaultSize, 1);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  const styleIndex = index % 10;

  switch (styleIndex) {
    case 0: return <Style0Classic product={product} handleWishlist={handleWishlist} inWishlist={inWishlist} handleQuickAdd={handleQuickAdd} handleQuickView={handleQuickView} />;
    case 1: return <Style1Glass product={product} handleWishlist={handleWishlist} inWishlist={inWishlist} handleQuickAdd={handleQuickAdd} handleQuickView={handleQuickView} />;
    case 2: return <Style2Brutalist product={product} handleWishlist={handleWishlist} inWishlist={inWishlist} handleQuickAdd={handleQuickAdd} handleQuickView={handleQuickView} />;
    case 3: return <Style3Polaroid product={product} handleWishlist={handleWishlist} inWishlist={inWishlist} handleQuickAdd={handleQuickAdd} handleQuickView={handleQuickView} />;
    case 4: return <Style4Minimalist product={product} handleWishlist={handleWishlist} inWishlist={inWishlist} handleQuickAdd={handleQuickAdd} handleQuickView={handleQuickView} />;
    case 5: return <Style5Archway product={product} handleWishlist={handleWishlist} inWishlist={inWishlist} handleQuickAdd={handleQuickAdd} handleQuickView={handleQuickView} />;
    case 6: return <Style6Cinematic product={product} handleWishlist={handleWishlist} inWishlist={inWishlist} handleQuickAdd={handleQuickAdd} handleQuickView={handleQuickView} />;
    case 7: return <Style7Neumorphic product={product} handleWishlist={handleWishlist} inWishlist={inWishlist} handleQuickAdd={handleQuickAdd} handleQuickView={handleQuickView} />;
    case 8: return <Style8Magazine product={product} handleWishlist={handleWishlist} inWishlist={inWishlist} handleQuickAdd={handleQuickAdd} handleQuickView={handleQuickView} />;
    case 9: return <Style9Archive product={product} handleWishlist={handleWishlist} inWishlist={inWishlist} handleQuickAdd={handleQuickAdd} handleQuickView={handleQuickView} />;
    default: return <Style0Classic product={product} handleWishlist={handleWishlist} inWishlist={inWishlist} handleQuickAdd={handleQuickAdd} handleQuickView={handleQuickView} />;
  }
}

// ----------------------------------------------------------------------
// STYLE 0: The Classic Editorial
// ----------------------------------------------------------------------
function Style0Classic({ product, handleWishlist, inWishlist, handleQuickView }: any) {
  return (
    <div className="group relative flex flex-col bg-white border border-[#DCC7AF]/40 hover:border-[#C5A059] transition-all duration-500 overflow-hidden">
      <Link href={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-gray-100">
        <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
        <button onClick={handleWishlist} className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors">
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#C5A059] text-[#C5A059]" : "text-gray-900"}`} />
        </button>
      </Link>
      <div className="p-5 text-center flex flex-col items-center">
        <span className="text-[10px] font-mono tracking-widest text-[#C5A059] uppercase mb-2">{product.story}</span>
        <h3 className="font-serif text-lg text-gray-900 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-1">{product.fabric}</p>
        <Price amount={product.priceAud} size="md" />
        <button onClick={handleQuickView} className="mt-4 opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-300 text-xs font-mono uppercase tracking-wider text-gray-900 border-b border-gray-900 pb-0.5">
          Quick View
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// STYLE 1: The Glassmorphic Vault
// ----------------------------------------------------------------------
function Style1Glass({ product, handleWishlist, inWishlist, handleQuickView }: any) {
  return (
    <div className="group relative flex flex-col bg-black/90 rounded-2xl overflow-hidden border border-white/10 hover:border-[#C5A059]/50 transition-all duration-500 shadow-2xl">
      <Link href={`/product/${product.id}`} className="block relative aspect-square m-3 rounded-xl overflow-hidden shadow-inner bg-gray-900">
        <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
      </Link>
      <div className="px-4 pb-5 pt-1 relative z-10 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-sans font-bold text-white tracking-tight line-clamp-1">{product.name}</h3>
            <span className="text-[10px] font-mono text-[#C5A059] uppercase bg-[#C5A059]/10 px-2 py-0.5 rounded-full inline-block mt-1">{product.collectionName}</span>
          </div>
          <button onClick={handleWishlist} className="text-white hover:text-[#C5A059] transition-colors mt-1">
            <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#C5A059]" : ""}`} />
          </button>
        </div>
        <div className="flex justify-between items-end mt-4">
          <Price amount={product.priceAud} size="sm" className="!text-white" />
          <button onClick={handleQuickView} className="bg-white/10 hover:bg-white text-white hover:text-black w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// STYLE 2: The Brutalist Noir
// ----------------------------------------------------------------------
function Style2Brutalist({ product, handleWishlist, inWishlist, handleQuickAdd }: any) {
  return (
    <div className="group relative flex flex-col border-[3px] border-black bg-white hover:bg-[#FFE800] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] transition-all duration-200">
      <Link href={`/product/${product.id}`} className="block relative aspect-[4/5] border-b-[3px] border-black overflow-hidden filter grayscale group-hover:grayscale-0 transition-all duration-500 bg-gray-200">
        <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
      </Link>
      <div className="p-3 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-mono font-black text-black text-sm uppercase leading-tight w-2/3 line-clamp-2">{product.name}</h3>
          <button onClick={handleWishlist} className="border-2 border-black p-1 bg-white hover:bg-black hover:text-white transition-colors">
            <Heart className={`w-4 h-4 ${inWishlist ? "fill-black" : ""}`} />
          </button>
        </div>
        <div className="flex justify-between items-center border-t-[3px] border-black pt-3">
          <span className="font-mono font-bold text-lg text-black">${product.priceAud}</span>
          <button onClick={handleQuickAdd} className="font-mono font-bold uppercase text-xs border-2 border-black px-2 py-1 bg-black text-white group-hover:bg-white group-hover:text-black transition-colors">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// STYLE 3: The Polaroid Memory
// ----------------------------------------------------------------------
function Style3Polaroid({ product, handleQuickView }: any) {
  return (
    <div className="group relative flex flex-col bg-[#F9F6F0] p-3 pb-8 shadow-md hover:shadow-xl transition-all duration-500 origin-bottom hover:rotate-2 hover:scale-105">
      <Link href={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-200 shadow-inner">
        <img src={product.imageHover || product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover filter contrast-125 sepia-[0.2]" />
      </Link>
      <div className="pt-4 flex flex-col items-center relative">
        <h3 className="font-serif italic text-xl text-gray-800 text-center line-clamp-1">{product.name}</h3>
        <p className="font-sans text-xs text-gray-500 mt-1">{product.colorName}</p>
        <button onClick={handleQuickView} className="absolute top-4 right-0 text-gray-400 hover:text-gray-900 transition-colors">
          <Maximize className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// STYLE 4: The Floating Minimalist
// ----------------------------------------------------------------------
function Style4Minimalist({ product, handleQuickView }: any) {
  return (
    <div className="group relative flex flex-col h-full min-h-[350px] overflow-hidden bg-gray-100 rounded-sm">
      <Link href={`/product/${product.id}`} className="absolute inset-0 w-full h-full block">
        <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500" />
      </Link>
      
      {/* Content only appears on hover */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 pointer-events-none">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-sm p-4 rounded-xl flex justify-between items-center shadow-2xl">
          <div className="min-w-0 pr-2">
            <h3 className="font-sans font-medium text-sm text-gray-900 truncate">{product.name}</h3>
            <Price amount={product.priceAud} size="sm" />
          </div>
          <button onClick={handleQuickView} className="flex-shrink-0 bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#C5A059] transition-colors">
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// STYLE 5: The Archway Window
// ----------------------------------------------------------------------
function Style5Archway({ product, handleQuickAdd }: any) {
  return (
    <div className="group relative flex flex-col bg-[#EADCC8] rounded-t-[100px] rounded-b-xl overflow-hidden p-2 transition-transform duration-500 hover:-translate-y-2 shadow-lg h-full">
      <Link href={`/product/${product.id}`} className="block relative aspect-[2/3] rounded-t-[100px] rounded-b-lg overflow-hidden bg-[#DCC7AF]">
        <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover filter group-hover:brightness-110 transition-all" />
      </Link>
      <div className="pt-4 pb-2 px-2 text-center flex flex-col items-center justify-between flex-1">
        <div>
          <h3 className="font-serif text-[#5A4332] text-md font-medium leading-tight mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-[10px] uppercase font-mono tracking-widest text-[#B86B4B] mb-2">{product.category}</p>
        </div>
        <button onClick={handleQuickAdd} className="mt-2 w-full px-4 py-1.5 border border-[#5A4332] rounded-full text-xs font-mono text-[#5A4332] hover:bg-[#5A4332] hover:text-white transition-colors truncate">
          Add To Bag — ${product.priceAud}
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// STYLE 6: The Cinematic Letterbox
// ----------------------------------------------------------------------
function Style6Cinematic({ product, handleQuickView }: any) {
  return (
    <div className="group relative flex flex-col bg-black justify-center items-center overflow-hidden border border-gray-800 hover:border-gray-600 transition-colors h-full min-h-[350px]">
      <div className="w-full relative pt-[56.25%] overflow-hidden my-4 group-hover:scale-105 transition-transform duration-1000 bg-gray-900">
        <Link href={`/product/${product.id}`} className="absolute inset-0 w-full h-full block">
          <img src={product.imageHover || product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover object-center filter saturate-50 group-hover:saturate-100 transition-all duration-700" />
        </Link>
      </div>
      <div className="absolute top-3 left-3 flex gap-1 items-center">
        <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
        <span className="text-[8px] font-mono text-white/50 tracking-widest uppercase">REC</span>
      </div>
      <div className="absolute bottom-3 right-3 text-right">
        <h3 className="font-mono text-white text-xs uppercase tracking-widest line-clamp-1">{product.name}</h3>
        <span className="font-mono text-[#C5A059] text-[10px]">${product.priceAud} AUD</span>
      </div>
      <button onClick={handleQuickView} className="absolute inset-0 z-10 w-full h-full opacity-0" aria-label="Quick View"></button>
    </div>
  );
}

// ----------------------------------------------------------------------
// STYLE 7: The Neumorphic Clay
// ----------------------------------------------------------------------
function Style7Neumorphic({ product, handleQuickView }: any) {
  return (
    <div className="group relative flex flex-col bg-[#F0EEE9] rounded-[2rem] p-4 shadow-[8px_8px_16px_#d9d6d2,-8px_-8px_16px_#ffffff] hover:shadow-[inset_4px_4px_8px_#d9d6d2,inset_-4px_-4px_8px_#ffffff] transition-all duration-300 h-full">
      <Link href={`/product/${product.id}`} className="block relative aspect-square rounded-[1.5rem] overflow-hidden shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1)] bg-gray-200">
        <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
      </Link>
      <div className="pt-5 pb-1 px-2 flex justify-between items-center">
        <div className="min-w-0 pr-3">
          <h3 className="font-sans font-semibold text-gray-700 text-sm mb-0.5 truncate">{product.name}</h3>
          <p className="font-mono text-[10px] text-gray-400 truncate">{product.fabric}</p>
        </div>
        <button onClick={handleQuickView} className="flex-shrink-0 w-10 h-10 rounded-full bg-[#F0EEE9] flex items-center justify-center shadow-[4px_4px_8px_#d9d6d2,-4px_-4px_8px_#ffffff] active:shadow-[inset_2px_2px_4px_#d9d6d2,inset_-2px_-2px_4px_#ffffff] transition-all text-gray-600 hover:text-[#C5A059]">
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// STYLE 8: The Magazine Cover
// ----------------------------------------------------------------------
function Style8Magazine({ product, handleQuickView }: any) {
  return (
    <div className="group relative flex flex-col aspect-[3/4] overflow-hidden bg-gray-100 hover:shadow-2xl transition-all duration-500">
      <Link href={`/product/${product.id}`} className="absolute inset-0 w-full h-full block">
        <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover filter contrast-125 saturate-110" />
      </Link>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
      
      {/* Magazine Typography Overlay */}
      <h2 className="absolute top-4 left-0 w-full text-center font-serif text-5xl font-black text-white/90 uppercase tracking-tighter opacity-30 group-hover:opacity-80 transition-opacity mix-blend-overlay pointer-events-none">
        VOGUE
      </h2>
      
      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-[#E63946] text-white text-[10px] font-bold uppercase px-2 py-1 inline-block mb-2">
          {product.collectionName}
        </div>
        <h3 className="font-serif italic text-xl text-white leading-tight mb-2 drop-shadow-lg line-clamp-2">{product.name}</h3>
        <div className="flex justify-between items-end border-t border-white/30 pt-3">
          <span className="font-sans font-bold text-white tracking-widest">${product.priceAud}</span>
          <button onClick={handleQuickView} className="text-xs font-bold uppercase text-white hover:text-[#E63946] flex items-center gap-1 transition-colors">
            Read More <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// STYLE 9: The Technical Archive
// ----------------------------------------------------------------------
function Style9Archive({ product, handleQuickView }: any) {
  return (
    <div className="group relative flex flex-col bg-[#F4F4F5] border border-dashed border-gray-400 p-1 h-full">
      <div className="border border-gray-400 h-full flex flex-col relative bg-white">
        
        {/* Top Header Grid */}
        <div className="flex border-b border-gray-400 divide-x divide-gray-400 text-[9px] font-mono uppercase text-gray-500 bg-[#F4F4F5]">
          <div className="p-1 flex-1 truncate">ID:{product.id.substring(0,8)}</div>
          <div className="p-1 w-16 text-center">SKU-{Math.floor(Math.random() * 9000)+1000}</div>
        </div>

        <Link href={`/product/${product.id}`} className="block relative aspect-square border-b border-gray-400 overflow-hidden bg-gray-100 p-4">
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Target className="w-48 h-48 text-black" />
          </div>
          <img src={product.image} alt={product.name} className="relative z-10 w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-700" />
        </Link>
        
        <div className="p-3 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-mono text-xs font-bold text-black uppercase leading-tight pr-2 line-clamp-2">{product.name}</h3>
            <QrCode className="w-6 h-6 text-gray-400 flex-shrink-0" />
          </div>
          
          <div className="mt-auto grid grid-cols-2 gap-2 border-t border-gray-200 pt-2">
            <div className="text-[10px] font-mono min-w-0">
              <span className="text-gray-400 block mb-0.5">COMP</span>
              <span className="text-black uppercase truncate block w-full">{product.fabric}</span>
            </div>
            <div className="text-[10px] font-mono text-right flex flex-col items-end flex-shrink-0">
              <span className="text-gray-400 block mb-0.5">VAL</span>
              <button onClick={handleQuickView} className="bg-black text-white px-2 py-0.5 w-full hover:bg-gray-800 transition-colors">
                ${product.priceAud}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
