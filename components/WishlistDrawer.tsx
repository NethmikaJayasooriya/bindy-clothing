"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Trash2, ShoppingBag, ArrowRight, Sparkles, Check } from "lucide-react";
import type { Product } from "@/lib/products";
import {
  getWishlist,
  removeFromWishlist,
  clearWishlist,
  subscribeWishlist,
} from "@/lib/wishlist";
import { addToCart } from "@/lib/cart";

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCart?: () => void;
}

export default function WishlistDrawer({
  isOpen,
  onClose,
  onOpenCart,
}: WishlistDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<Product[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [addedItemMap, setAddedItemMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setMounted(true);
    const sync = () => {
      setItems(getWishlist());
    };
    sync();
    const unsub = subscribeWishlist(sync);
    return () => unsub();
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleSelectSize = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAddToCart = (product: Product) => {
    const size = selectedSizes[product.id] || product.sizes[0] || "AU 8 (S)";
    addToCart(product, size, 1);
    setAddedItemMap((prev) => ({ ...prev, [product.id]: true }));

    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const handleRemove = (productId: string) => {
    removeFromWishlist(productId);
  };

  const handleClearAll = () => {
    clearWishlist();
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] overflow-hidden select-none bg-black/75 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          document.body.style.overflow = "";
          onClose();
        }
      }}
    >
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-screen max-w-md bg-[#161513] border-l border-sand/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col justify-between text-paper"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center space-x-2.5">
              <Heart className="w-5 h-5 text-gold fill-gold" />
              <h3 className="font-serif text-2xl text-paper font-medium">
                Saved Pieces
              </h3>
              {items.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold text-[10px] font-mono font-bold">
                  {items.length}
                </span>
              )}
            </div>
            <button
              onClick={() => {
                document.body.style.overflow = "";
                onClose();
              }}
              className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-sand hover:text-white transition-colors cursor-pointer border border-white/10"
              aria-label="Close saved pieces"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Items List / Empty State */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-sand/70 py-12">
                <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold shadow-[0_0_25px_rgba(197,160,89,0.2)]">
                  <Heart className="w-8 h-8 stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <p className="font-serif text-xl text-paper font-light">
                    Your Wishlist is Empty
                  </p>
                  <p className="text-xs font-sans text-sand/70 max-w-xs font-light leading-relaxed">
                    Save pieces you love as you explore the collection to build your personal capsule.
                  </p>
                </div>
                <button
                  onClick={() => {
                    document.body.style.overflow = "";
                    onClose();
                    setTimeout(() => {
                      const el = document.getElementById("collection");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }, 50);
                  }}
                  className="px-7 py-3 rounded-full bg-gold text-charcoal font-sans text-xs uppercase tracking-[0.2em] font-bold hover:bg-paper-light transition-all shadow-md cursor-pointer"
                >
                  Discover Collection 01
                </button>
              </div>
            ) : (
              items.map((product) => {
                const currentSize = selectedSizes[product.id] || product.sizes[0] || "AU 8 (S)";
                const isAdded = addedItemMap[product.id];

                return (
                  <div
                    key={product.id}
                    className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3.5 hover:border-gold/40 transition-colors shadow-sm"
                  >
                    <div className="flex space-x-3.5">
                      <Link
                        href={`/product/${product.id}`}
                        onClick={() => {
                          document.body.style.overflow = "";
                          onClose();
                        }}
                        className="relative w-20 h-26 rounded-xl overflow-hidden bg-black/40 flex-shrink-0 border border-white/10 group"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>

                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div className="space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={`/product/${product.id}`}
                              onClick={() => {
                                document.body.style.overflow = "";
                                onClose();
                              }}
                              className="font-serif text-base text-paper font-medium truncate hover:text-gold transition-colors"
                            >
                              {product.name}
                            </Link>
                            <button
                              onClick={() => handleRemove(product.id)}
                              className="text-sand/50 hover:text-rose-400 transition-colors p-1 flex-shrink-0 cursor-pointer"
                              title="Remove from saved"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <p className="text-[11px] font-sans text-sand/70">
                            {product.colorName} • {product.fabric}
                          </p>

                          <p className="font-serif text-sm font-semibold text-gold pt-0.5">
                            ${product.priceAud} AUD
                          </p>
                        </div>

                        {/* Size selector pills */}
                        <div className="pt-2 flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] font-sans uppercase tracking-wider text-sand/60 mr-1">
                            Size:
                          </span>
                          {product.sizes.map((s) => (
                            <button
                              key={s}
                              onClick={() => handleSelectSize(product.id, s)}
                              className={`px-2 py-0.5 rounded text-[10px] font-sans transition-colors cursor-pointer border ${
                                currentSize === s
                                  ? "bg-gold text-charcoal font-bold border-gold"
                                  : "bg-white/5 border-white/10 text-sand/80 hover:border-gold/50"
                              }`}
                            >
                              {s.split(" ")[1]?.replace("(", "").replace(")", "") || s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Add to Bag Button */}
                    <div className="pt-1 flex items-center gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`flex-1 py-2.5 rounded-full font-sans text-xs uppercase tracking-wider font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                          isAdded
                            ? "bg-green-600 text-white"
                            : "bg-gold hover:bg-paper-light text-charcoal"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added to Bag!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Move to Bag ({currentSize})</span>
                          </>
                        )}
                      </button>

                      <Link
                        href={`/product/${product.id}`}
                        onClick={() => {
                          document.body.style.overflow = "";
                          onClose();
                        }}
                        className="px-3.5 py-2.5 rounded-full border border-white/15 hover:border-gold text-sand/80 hover:text-gold text-xs font-sans uppercase tracking-wider transition-colors flex items-center justify-center"
                        title="View details"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Actions */}
          {items.length > 0 && (
            <div className="p-6 border-t border-white/10 space-y-3.5 bg-white/[0.02]">
              <div className="flex items-center justify-between text-xs font-sans text-sand/80">
                <span>{items.length} {items.length === 1 ? "piece" : "pieces"} saved in your circle</span>
                <button
                  onClick={handleClearAll}
                  className="text-[11px] uppercase tracking-wider text-sand/60 hover:text-rose-400 transition-colors underline underline-offset-4 cursor-pointer"
                >
                  Clear Wishlist
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    items.forEach((product) => {
                      const size = selectedSizes[product.id] || product.sizes[0] || "AU 8 (S)";
                      addToCart(product, size, 1);
                    });
                    document.body.style.overflow = "";
                    onClose();
                    if (onOpenCart) onOpenCart();
                  }}
                  className="w-full py-3.5 rounded-full bg-gold hover:bg-paper-light text-charcoal font-sans text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_6px_30px_rgba(197,160,89,0.35)] cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add All to Bag</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>,
    document.body
  );
}
