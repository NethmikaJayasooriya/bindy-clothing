"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Eye, ArrowRight, ShoppingBag, Plus, Sparkles, Tag, ChevronDown, MoveDown, Focus } from "lucide-react";
import type { Product } from "@/data/products";
import { getAverageRating } from "@/lib/products";
import { isInWishlist, toggleWishlist, subscribeWishlist } from "@/lib/wishlist";
import { addToCart } from "@/lib/cart";
import StarRating from "./StarRating";
import Price from "./Price";

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

  switch (styleIndex) {
    case 0: return <Style0Lookbook product={product} handleWishlist={handleWishlist} inWishlist={inWishlist} handleQuickAdd={handleQuickAdd} handleQuickView={handleQuickView} />;
    case 1: return <Style1Acetate product={product} handleWishlist={handleWishlist} inWishlist={inWishlist} handleQuickAdd={handleQuickAdd} handleQuickView={handleQuickView} />;
    case 2: return <Style2EInkTag product={product} handleWishlist={handleWishlist} inWishlist={inWishlist} handleQuickAdd={handleQuickAdd} handleQuickView={handleQuickView} />;
    case 3: return <Style3Dashboard product={product} handleWishlist={handleWishlist} inWishlist={inWishlist} handleQuickAdd={handleQuickAdd} handleQuickView={handleQuickView} />;
    case 4: return <Style4Holographic product={product} handleWishlist={handleWishlist} inWishlist={inWishlist} handleQuickAdd={handleQuickAdd} handleQuickView={handleQuickView} />;
    case 5: return <Style5Accordion product={product} handleWishlist={handleWishlist} inWishlist={inWishlist} handleQuickAdd={handleQuickAdd} handleQuickView={handleQuickView} />;
    case 6: return <Style6Cinematic product={product} handleWishlist={handleWishlist} inWishlist={inWishlist} handleQuickAdd={handleQuickAdd} handleQuickView={handleQuickView} />;
    case 7: return <Style7Blueprint product={product} handleWishlist={handleWishlist} inWishlist={inWishlist} handleQuickAdd={handleQuickAdd} handleQuickView={handleQuickView} />;
    case 8: return <Style8Drawer product={product} handleWishlist={handleWishlist} inWishlist={inWishlist} handleQuickAdd={handleQuickAdd} handleQuickView={handleQuickView} />;
    case 9: return <Style9Ticket product={product} handleWishlist={handleWishlist} inWishlist={inWishlist} handleQuickAdd={handleQuickAdd} handleQuickView={handleQuickView} />;
    default: return <Style0Lookbook product={product} handleWishlist={handleWishlist} inWishlist={inWishlist} handleQuickAdd={handleQuickAdd} handleQuickView={handleQuickView} />;
  }
}

// ----------------------------------------------------------------------
// STYLE 0: The Interactive Lookbook
// ----------------------------------------------------------------------
function Style0Lookbook({ product, handleWishlist, inWishlist, handleQuickView, handleQuickAdd }: any) {
  return (
    <div className="group relative flex flex-col bg-gray-100 overflow-hidden h-full min-h-[400px]">
      <Link href={`/product/${product.id}`} className="absolute inset-0 block">
        <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
      </Link>
      
      {/* Pulsing Hotspots (Only visible on hover) */}
      <div className="absolute top-[40%] left-[30%] w-3 h-3 bg-white/80 rounded-full shadow-[0_0_15px_white] opacity-0 group-hover:opacity-100 transition-opacity delay-100">
        <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75" />
      </div>
      <div className="absolute top-[60%] right-[25%] w-3 h-3 bg-white/80 rounded-full shadow-[0_0_15px_white] opacity-0 group-hover:opacity-100 transition-opacity delay-300">
        <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75" />
      </div>

      <button onClick={handleWishlist} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white transition-colors">
        <Heart className={`w-4 h-4 ${inWishlist ? "fill-red-500 text-red-500" : "text-white"}`} />
      </button>

      {/* Floating Glass Pill */}
      <div className="absolute bottom-4 inset-x-4 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full p-2 pl-4 flex items-center justify-between shadow-2xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="font-sans text-xs text-white font-medium truncate">{product.name}</h3>
          <span className="font-mono text-[10px] text-[#C5A059] block">${product.priceAud}</span>
        </div>
        <button onClick={(e) => handleQuickAdd(e)} className="w-8 h-8 flex-shrink-0 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform text-black">
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// STYLE 1: The Layered Acetate
// ----------------------------------------------------------------------
function Style1Acetate({ product, handleWishlist, inWishlist, handleQuickAdd }: any) {
  return (
    <div className="group relative flex flex-col h-full overflow-hidden bg-[#FAF7F2]">
      <Link href={`/product/${product.id}`} className="block relative h-full">
        <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
      </Link>
      
      {/* Translucent Acetate Layer */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-md border-t border-white/50 opacity-0 group-hover:opacity-100 translate-y-full group-hover:translate-y-0 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] p-5 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <button onClick={handleWishlist} className="bg-white p-2 rounded-full shadow-sm">
            <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#B86B4B] text-[#B86B4B]" : "text-gray-900"}`} />
          </button>
          <div className="text-right">
            <h3 className="font-serif text-lg text-gray-900 leading-tight">{product.name}</h3>
            <Price amount={product.priceAud} size="sm" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <p className="text-xs font-sans text-gray-800 leading-relaxed italic border-l-2 border-[#B86B4B] pl-2 mb-4">
            "{product.story}"
          </p>
          <div className="space-y-1 mb-4">
            <span className="text-[10px] font-mono text-gray-500 uppercase block">Fabric</span>
            <span className="text-xs font-sans text-gray-900 block">{product.fabric}</span>
          </div>
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-900/10 flex gap-2">
          {product.sizes.slice(0,3).map((sz: string) => (
            <button key={sz} onClick={(e) => handleQuickAdd(e, sz)} className="flex-1 py-2 bg-gray-900 text-white text-[10px] font-mono hover:bg-[#B86B4B] transition-colors rounded">
              {sz.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// STYLE 2: The E-Ink Garment Tag
// ----------------------------------------------------------------------
function Style2EInkTag({ product, handleWishlist, inWishlist, handleQuickAdd }: any) {
  return (
    <div className="group relative flex h-full bg-[#1F1E1D] overflow-hidden p-1 gap-1 border border-[#DCC7AF]/20 hover:border-[#C5A059] transition-colors">
      {/* The Paper Tag */}
      <div className="w-16 bg-[#F4F4F5] flex flex-col items-center py-4 relative shadow-[inset_-2px_0_5px_rgba(0,0,0,0.05)] border-r border-dashed border-gray-400">
        <div className="w-2 h-2 rounded-full bg-gray-800 mb-6 shadow-inner" />
        <div className="writing-vertical-rl text-[9px] font-mono uppercase text-gray-600 tracking-[0.2em] mb-4">
          {product.collectionName}
        </div>
        <div className="writing-vertical-rl text-xs font-mono font-bold text-black tracking-widest mt-auto">
          ${product.priceAud}
        </div>
      </div>
      
      {/* The Image */}
      <Link href={`/product/${product.id}`} className="flex-1 relative bg-gray-100">
        <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover filter brightness-95 group-hover:brightness-105 transition-all" />
      </Link>

      {/* Hover Overlay Details */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={handleWishlist} className="w-8 h-8 bg-white text-black rounded flex items-center justify-center shadow-lg hover:bg-black hover:text-white transition-colors">
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-current" : ""}`} />
        </button>
        <button onClick={handleQuickAdd} className="w-8 h-8 bg-[#C5A059] text-white rounded flex items-center justify-center shadow-lg hover:bg-white hover:text-[#C5A059] transition-colors">
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// STYLE 3: The Mini Dashboard
// ----------------------------------------------------------------------
function Style3Dashboard({ product, handleWishlist, inWishlist, handleQuickAdd }: any) {
  const rating = getAverageRating(product);
  return (
    <div className="group relative flex flex-col h-full bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300">
      <Link href={`/product/${product.id}`} className="block relative aspect-[4/5] bg-gray-100 overflow-hidden">
        <img src={product.imageHover || product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      </Link>
      
      {/* The Dashboard */}
      <div className="p-3 flex flex-col flex-1 bg-white relative z-10">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-sans font-semibold text-sm text-gray-900 leading-tight line-clamp-2 pr-4">{product.name}</h3>
          <button onClick={handleWishlist} className="flex-shrink-0 mt-0.5">
            <Heart className={`w-4 h-4 ${inWishlist ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-gray-900"}`} />
          </button>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="w-3 h-3 rounded-full border border-gray-300 shadow-inner" style={{ backgroundColor: product.colorHex }} title={product.colorName} />
          <StarRating value={rating} count={product.reviews.length} size="sm" />
        </div>
        
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="font-mono text-sm font-bold text-gray-900">${product.priceAud}</span>
          <button onClick={handleQuickAdd} className="bg-black text-white px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest hover:bg-[#C5A059] transition-colors">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// STYLE 4: The Holographic Foil
// ----------------------------------------------------------------------
function Style4Holographic({ product, handleWishlist, inWishlist, handleQuickView }: any) {
  return (
    <div className="group relative flex flex-col h-full p-[2px] rounded-xl overflow-hidden bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 hover:from-[#EADCC8] hover:via-[#FAF7F2] hover:to-[#DCC7AF] transition-all duration-700 shadow-md hover:shadow-2xl">
      <div className="flex flex-col h-full bg-white rounded-[10px] overflow-hidden">
        <Link href={`/product/${product.id}`} className="block relative aspect-[4/5]">
          <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
          <button onClick={handleWishlist} className="absolute top-3 right-3 z-10">
            <Heart className={`w-5 h-5 ${inWishlist ? "fill-gold text-gold" : "text-white hover:text-gold"} drop-shadow-md`} />
          </button>
        </Link>
        <div className="p-3 text-center grid grid-cols-1 gap-1 relative z-10 bg-white">
          <h3 className="font-serif text-sm text-gray-800 line-clamp-1">{product.name}</h3>
          <span className="font-mono text-[11px] text-[#C5A059] uppercase tracking-widest">${product.priceAud} AUD</span>
          
          <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center">
            <button onClick={handleQuickView} className="px-6 py-2 border border-[#C5A059] text-[#C5A059] text-xs font-mono uppercase hover:bg-[#C5A059] hover:text-white transition-colors">
              Explore Piece
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// STYLE 5: The Expanding Accordion
// ----------------------------------------------------------------------
function Style5Accordion({ product, handleWishlist, inWishlist, handleQuickAdd }: any) {
  return (
    <div className="group relative flex flex-col h-full bg-white border border-[#DCC7AF]/40">
      <Link href={`/product/${product.id}`} className="block relative aspect-[3/4] group-hover:aspect-video transition-all duration-500 overflow-hidden bg-gray-100 origin-top">
        <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
        <button onClick={handleWishlist} className="absolute top-3 right-3 z-10 bg-white/50 backdrop-blur p-1.5 rounded-sm">
          <Heart className={`w-3.5 h-3.5 ${inWishlist ? "fill-black text-black" : "text-gray-900"}`} />
        </button>
      </Link>
      
      <div className="p-3 flex flex-col flex-1 bg-white">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-sans font-medium text-sm text-gray-900 line-clamp-1">{product.name}</h3>
          <span className="font-mono text-sm">${product.priceAud}</span>
        </div>
        
        {/* Accordion Content reveals on hover */}
        <div className="overflow-hidden max-h-0 group-hover:max-h-[150px] transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100 flex flex-col gap-3">
          <p className="text-[10px] font-sans text-gray-500 leading-relaxed border-l-2 border-gray-200 pl-2">
            {product.fabric}
          </p>
          <div className="grid grid-cols-4 gap-1">
            {product.sizes.slice(0,4).map((sz: string) => (
              <button key={sz} onClick={(e) => handleQuickAdd(e, sz)} className="py-1 bg-gray-100 hover:bg-black hover:text-white text-[9px] font-mono transition-colors text-center">
                {sz.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// STYLE 6: The Cinematic Typewriter
// ----------------------------------------------------------------------
function Style6Cinematic({ product, handleWishlist, inWishlist, handleQuickAdd }: any) {
  return (
    <div className="group relative flex flex-col h-full bg-black overflow-hidden border border-gray-800">
      <Link href={`/product/${product.id}`} className="absolute inset-0 block">
        <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-30 transition-opacity duration-700" />
      </Link>
      
      <button onClick={handleWishlist} className="absolute top-4 right-4 z-10 text-white/50 hover:text-white transition-colors">
        <Heart className={`w-5 h-5 ${inWishlist ? "fill-white" : ""}`} />
      </button>

      {/* Typewriter Story */}
      <div className="absolute inset-0 p-6 flex flex-col justify-center items-center text-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <Sparkles className="w-5 h-5 text-[#C5A059] mb-3" />
        <h3 className="font-serif text-white text-xl mb-3 leading-tight drop-shadow-lg">{product.name}</h3>
        <p className="font-mono text-xs text-white/80 leading-loose max-w-[80%] uppercase tracking-widest line-clamp-4">
          {product.story}
        </p>
      </div>

      <div className="absolute bottom-0 inset-x-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
        <button onClick={handleQuickAdd} className="w-full py-3 bg-white text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#C5A059] hover:text-white transition-colors">
          Add To Bag — ${product.priceAud}
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// STYLE 7: The Technical Blueprint
// ----------------------------------------------------------------------
function Style7Blueprint({ product, handleWishlist, inWishlist, handleQuickAdd }: any) {
  return (
    <div className="group relative flex flex-col h-full bg-white border border-blue-900/10 hover:border-blue-900/30 transition-colors p-3">
      <Link href={`/product/${product.id}`} className="block relative aspect-[4/5] bg-[#F8FAFC] overflow-hidden mb-3">
        {/* Crosshairs */}
        <Focus className="absolute top-2 left-2 w-4 h-4 text-blue-900/40 pointer-events-none z-10" />
        <Focus className="absolute top-2 right-2 w-4 h-4 text-blue-900/40 pointer-events-none z-10" />
        <Focus className="absolute bottom-2 left-2 w-4 h-4 text-blue-900/40 pointer-events-none z-10" />
        <Focus className="absolute bottom-2 right-2 w-4 h-4 text-blue-900/40 pointer-events-none z-10" />
        
        <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-95 transition-transform duration-700" />
        
        {/* Technical Annotations */}
        <div className="absolute top-1/4 left-0 w-8 border-b border-blue-900/40 border-dashed opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="absolute top-[22%] left-9 text-[8px] font-mono text-blue-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">COLLAR</span>
        
        <div className="absolute bottom-1/4 right-0 w-8 border-b border-blue-900/40 border-dashed opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="absolute bottom-[23%] right-9 text-[8px] font-mono text-blue-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">HEM</span>
      </Link>
      
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-mono text-[11px] font-bold text-gray-900 uppercase leading-snug pr-2 line-clamp-2">{product.name}</h3>
          <button onClick={handleWishlist}>
            <Heart className={`w-4 h-4 ${inWishlist ? "fill-blue-900 text-blue-900" : "text-gray-400"}`} />
          </button>
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-blue-900/10 pt-2">
          <span className="font-mono text-xs text-blue-900 font-bold">${product.priceAud}</span>
          <button onClick={handleQuickAdd} className="bg-blue-900 text-white text-[9px] font-mono uppercase px-3 py-1 hover:bg-blue-800 transition-colors">
            Init Cart
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// STYLE 8: The Sliding Drawer
// ----------------------------------------------------------------------
function Style8Drawer({ product, handleWishlist, inWishlist, handleQuickView }: any) {
  return (
    <div className="group relative flex flex-col h-full bg-[#1F1E1D] overflow-hidden rounded-lg shadow-lg">
      {/* Hidden Compartment */}
      <div className="absolute inset-x-0 bottom-0 p-4 h-1/3 bg-[#1F1E1D] flex flex-col justify-end">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-mono text-white/50 uppercase">Origin</span>
          <span className="text-[10px] font-mono text-[#C5A059] uppercase">{product.destinations[0]}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-mono text-white/50 uppercase">Stock</span>
          <span className="text-[10px] font-mono text-white uppercase">{product.inventoryStatus.replace("_", " ")}</span>
        </div>
        <button onClick={handleQuickView} className="w-full bg-[#C5A059] text-white text-xs font-mono uppercase py-2 hover:bg-white hover:text-black transition-colors">
          View Details
        </button>
      </div>

      {/* Main Card (Slides up on hover) */}
      <div className="relative flex flex-col h-full bg-white group-hover:-translate-y-1/3 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] rounded-b-xl shadow-2xl z-10">
        <Link href={`/product/${product.id}`} className="block relative aspect-[4/5] bg-gray-100">
          <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
          <button onClick={handleWishlist} className="absolute top-3 right-3 z-10">
            <Heart className={`w-5 h-5 ${inWishlist ? "fill-red-500 text-red-500" : "text-gray-900 hover:scale-110"}`} />
          </button>
        </Link>
        <div className="p-3 text-center flex flex-col flex-1 justify-center bg-white rounded-b-xl relative">
          <h3 className="font-sans font-medium text-sm text-gray-900 mb-1">{product.name}</h3>
          <Price amount={product.priceAud} size="sm" />
          {/* Drawer Handle Indicator */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-gray-300">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// STYLE 9: The First-Class Ticket
// ----------------------------------------------------------------------
function Style9Ticket({ product, handleQuickAdd }: any) {
  return (
    <div className="group relative flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
      <Link href={`/product/${product.id}`} className="block relative aspect-[4/5] bg-gray-100 overflow-hidden">
        <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      </Link>
      
      {/* Ticket Tear Section */}
      <div className="relative border-t-2 border-dashed border-gray-300 mx-2 p-3 flex items-center justify-between bg-white">
        {/* Fake Cutouts for ticket look */}
        <div className="absolute -top-3 -left-2 w-4 h-4 bg-paper rounded-full border-b border-r border-gray-200" />
        <div className="absolute -top-3 -right-2 w-4 h-4 bg-paper rounded-full border-b border-l border-gray-200" />
        
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="font-mono text-[10px] font-bold text-gray-900 uppercase truncate mb-0.5">{product.name}</h3>
          <span className="font-mono text-sm font-bold text-[#B86B4B]">${product.priceAud}</span>
        </div>
        
        <button onClick={handleQuickAdd} className="flex flex-col items-center justify-center p-2 bg-[#FAF7F2] hover:bg-[#1F1E1D] hover:text-white border border-[#DCC7AF]/50 rounded text-gray-900 transition-colors shrink-0">
          <MoveDown className="w-3 h-3 mb-0.5" />
          <span className="text-[8px] font-mono uppercase font-bold tracking-widest">Tear<br/>Add</span>
        </button>
      </div>
    </div>
  );
}
