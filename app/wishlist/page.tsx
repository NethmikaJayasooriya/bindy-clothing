"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Trash2, ShoppingBag, ArrowRight, ArrowLeft, Sparkles, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ResponsiveImage from "@/components/ResponsiveImage";
import type { Product } from "@/lib/products";
import {
  getWishlist,
  removeFromWishlist,
  clearWishlist,
  subscribeWishlist,
} from "@/lib/wishlist";
import { addToCart } from "@/lib/cart";
import { ambientPlayer } from "@/lib/ambientSound";

export default function WishlistPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [addedItemMap, setAddedItemMap] = useState<Record<string, boolean>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const sync = () => setItems(getWishlist());
    sync();
    const unsub = subscribeWishlist(sync);
    return () => unsub();
  }, []);

  const toggleAudio = () => {
    if (ambientPlayer) setIsMuted(ambientPlayer.toggle());
  };

  const handleSelectSize = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAddToCart = (product: Product) => {
    const defaultSize = product.sizes.find(s => (product.stock?.[s] ?? 1) > 0) || product.sizes[0] || "AU 8 (S)";
    const size = selectedSizes[product.id] || defaultSize;
    addToCart(product, size, 1);
    setAddedItemMap((prev) => ({ ...prev, [product.id]: true }));
    setIsCartOpen(true);
    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#1F1E1D] flex flex-col justify-between">
      <Navbar
        isMuted={isMuted}
        toggleAudio={toggleAudio}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full flex-1">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/collection"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#78716A] hover:text-[#C5A059] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
          <Link
            href="/account"
            className="text-xs uppercase tracking-widest text-[#78716A] hover:text-[#C5A059] transition-colors"
          >
            My Account →
          </Link>
        </div>

        {/* Page Title Header */}
        <div className="border-b border-[#DCC7AF]/50 pb-8 mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.3em] text-[#C5A059] font-medium mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SAVED PIECES</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl text-[#1F1E1D] font-light">
              Your Curated Wishlist
            </h1>
            <p className="mt-2 text-sm text-[#78716A]">
              {items.length === 0
                ? "You haven't saved any garments to your wishlist yet."
                : `${items.length} ${items.length === 1 ? "piece" : "pieces"} saved in this browser.`}
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={() => clearWishlist()}
              className="text-xs font-mono uppercase tracking-widest text-[#78716A] hover:text-[#B94A48] transition-colors self-start sm:self-auto cursor-pointer"
            >
              Clear all items
            </button>
          )}
        </div>

        {/* Wishlist Content Grid or Empty State */}
        {items.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#EFE8DC] border border-[#DCC7AF] flex items-center justify-center mx-auto text-[#C5A059]">
              <Heart className="w-7 h-7" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-light">Your wishlist is empty</h2>
            <p className="text-sm text-[#78716A] leading-relaxed">
              Explore the Serendipity Collection 01 to curate pieces you adore. Tap the heart icon on any garment to save it here for later.
            </p>
            <Link
              href="/collection"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-[#252822] px-8 py-4 text-xs font-semibold uppercase tracking-widest text-white hover:bg-[#3D3B36] transition-all"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {items.map((product) => {
              const currentSize =
                selectedSizes[product.id] ||
                product.sizes.find((s) => (product.stock?.[s] ?? 1) > 0) ||
                product.sizes[0] ||
                "AU 8 (S)";
              const isAdded = addedItemMap[product.id];
              const isSoldOut = product.stock && Object.values(product.stock).every((qty) => qty === 0);

              return (
                <div
                  key={product.id}
                  className="bg-white border border-[#DCC7AF]/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-[3/4] bg-[#F2ECE1]">
                    <ResponsiveImage
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/85 backdrop-blur-sm text-[#78716A] hover:text-[#B94A48] hover:bg-white transition-colors cursor-pointer shadow-sm"
                      title="Remove from Wishlist"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {isSoldOut && (
                      <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/75 text-white text-[10px] uppercase font-bold tracking-wider">
                        Sold Out
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="text-[11px] uppercase tracking-widest text-[#C5A059] font-medium">
                        {product.category}
                      </div>
                      <Link
                        href={`/product/${product.id}`}
                        className="font-serif text-lg font-medium text-[#1F1E1D] hover:text-[#C5A059] transition-colors mt-0.5 block truncate"
                      >
                        {product.name}
                      </Link>
                      <div className="flex items-center justify-between mt-2 text-sm">
                        <span className="font-serif font-semibold">${product.priceAud} AUD</span>
                        <span className="text-xs text-[#78716A]">{product.colorName}</span>
                      </div>
                    </div>

                    {/* Sizing Pills */}
                    <div className="space-y-1.5 pt-2 border-t border-[#E6DCD0]">
                      <span className="text-[11px] uppercase tracking-wider text-[#78716A] block">
                        Size: <strong className="text-[#1F1E1D]">{currentSize}</strong>
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {product.sizes.map((s) => {
                          const stockCount = product.stock?.[s];
                          const sizeSoldOut = stockCount === 0;
                          const isSelected = currentSize === s;

                          return (
                            <button
                              key={s}
                              type="button"
                              disabled={sizeSoldOut}
                              onClick={() => handleSelectSize(product.id, s)}
                              className={`px-2 py-1 rounded-lg text-xs font-sans border transition-all ${
                                isSelected
                                  ? "bg-[#252822] text-white border-[#252822]"
                                  : sizeSoldOut
                                  ? "bg-[#F2ECE1]/50 border-sand/40 text-[#78716A]/50 line-through cursor-not-allowed"
                                  : "bg-[#FAF7F2] border-[#DCC7AF] text-[#1F1E1D] hover:border-[#C5A059] cursor-pointer"
                              }`}
                            >
                              {s.split(" ")[0]}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2">
                      <button
                        type="button"
                        disabled={isSoldOut}
                        onClick={() => handleAddToCart(product)}
                        className={`w-full py-3 rounded-xl text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                          isAdded
                            ? "bg-[#4B6244] text-white"
                            : isSoldOut
                            ? "bg-[#EFE8DC] text-[#78716A] cursor-not-allowed"
                            : "bg-[#C5A059] hover:bg-[#8E6E34] text-white shadow-sm cursor-pointer"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Added to Bag</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4" />
                            <span>{isSoldOut ? "Sold Out" : "Move to Bag"}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </main>
  );
}

