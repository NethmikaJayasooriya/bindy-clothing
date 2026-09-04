"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ShoppingBag, ShieldCheck, Check, Heart, ArrowRight } from "lucide-react";
import { Product } from "./CollectionShowcase";
import { setBuyNowItem } from "@/lib/cart";
import { isInWishlist, toggleWishlist, subscribeWishlist } from "@/lib/wishlist";
import SizeGuideModal from "@/components/SizeGuideModal";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string) => void;
}

export default function ProductModal({
  product,
  onClose,
  onAddToCart,
}: ProductModalProps) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [, setWishlistTick] = useState(0);

  useEffect(() => {
    const unsub = subscribeWishlist(() => setWishlistTick((t) => t + 1));
    return () => unsub();
  }, []);

  if (!product) return null;

  const sizes = ["AU 6 (XS)", "AU 8 (S)", "AU 10 (M)", "AU 12 (L)", "AU 14 (XL)"];

  const handleAdd = () => {
    if (!selectedSize) return;
    onAddToCart(product, selectedSize);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 900);
  };

  const handleBuyNow = () => {
    if (!selectedSize) return;
    setBuyNowItem(product, selectedSize, 1);
    onClose();
    router.push("/checkout?mode=buynow");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative z-10 w-full max-w-4xl bg-paper-light text-charcoal rounded-3xl overflow-hidden shadow-2xl border border-sand/40 flex flex-col md:flex-row max-h-[90vh] overflow-y-auto custom-scrollbar"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-sand/20 hover:bg-sand/40 text-charcoal transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Column: Image */}
          <div className="md:w-1/2 relative min-h-[350px] md:min-h-[500px] bg-paper-dark">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] uppercase tracking-[0.2em] text-[#FAF7F2] border border-white/20">
                {product.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] uppercase tracking-[0.2em] text-[#1F1E1D] font-medium shadow-sm border border-sand/30">
                {product.storyPlace}
              </span>
            </div>

            {/* Wishlist button over image */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute bottom-4 left-4 p-2.5 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer shadow-md ${
                isInWishlist(product.id)
                  ? "bg-gold text-charcoal scale-105"
                  : "bg-black/60 hover:bg-black text-white hover:text-gold"
              }`}
              title={isInWishlist(product.id) ? "Saved in Wishlist" : "Save to Wishlist"}
              aria-label="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-charcoal text-charcoal" : "text-gold"}`} />
            </button>
          </div>

          {/* Right Column: Details & Selection */}
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-[#C5A059] font-semibold mb-1">
                  {product.story}
                </p>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-serif text-2xl md:text-3xl text-charcoal font-medium">
                    {product.name}
                  </h3>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-2 rounded-full border transition-colors cursor-pointer flex-shrink-0 ${
                      isInWishlist(product.id)
                        ? "border-gold bg-gold/15 text-gold"
                        : "border-sand/40 text-muted hover:border-gold hover:text-gold"
                    }`}
                    title={isInWishlist(product.id) ? "Saved in Wishlist" : "Save to Wishlist"}
                    aria-label="Wishlist toggle"
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-gold text-gold" : ""}`} />
                  </button>
                </div>
                <p className="font-serif text-lg text-charcoal font-semibold mt-1">
                  ${product.priceAud} AUD
                </p>
              </div>

              <div className="space-y-1.5 text-xs">
                <p className="text-muted">
                  <span className="font-medium text-charcoal">Fabric: </span>
                  {product.fabric}
                </p>
                <p className="text-muted">
                  <span className="font-medium text-charcoal">Color: </span>
                  {product.colorName}
                </p>
              </div>

              <p className="text-xs font-sans text-charcoal/80 leading-relaxed font-light">
                {product.description}
              </p>

              <Link
                href={`/product/${product.id}`}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-[0.2em] text-[#C5A059] hover:text-[#A46446] font-semibold transition-colors pt-0.5"
              >
                <span>View Full Piece & Heritage Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              {/* Size Selector */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] font-sans uppercase tracking-wider text-charcoal font-medium">
                    Select AU Size:
                  </span>
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="text-[11px] font-sans text-gold hover:underline cursor-pointer font-medium"
                  >
                    Size Guide
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-sans tracking-wider border transition-all cursor-pointer ${
                        selectedSize === s
                          ? "border-charcoal bg-charcoal text-paper font-semibold shadow-sm"
                          : "border-sand/40 bg-paper hover:border-gold text-charcoal"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-sand/30 space-y-2.5">
              <button
                onClick={handleAdd}
                disabled={!selectedSize}
                className={`w-full py-3.5 rounded-full font-sans text-xs uppercase tracking-[0.25em] font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                  !selectedSize
                    ? "bg-sand/20 text-muted border border-sand/30 cursor-not-allowed"
                    : "bg-gold hover:bg-cinnamon text-charcoal hover:text-white shadow-xl cursor-pointer"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag</span>
                  </>
                ) : !selectedSize ? (
                  <span>Please Select a Size</span>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Shopping Bag • ${product.priceAud} AUD</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!selectedSize}
                className={`w-full py-3.5 rounded-full font-sans text-xs uppercase tracking-[0.25em] font-semibold transition-all duration-300 flex items-center justify-center space-x-2 border ${
                  !selectedSize
                    ? "bg-transparent text-muted/60 border-sand/30 cursor-not-allowed"
                    : "bg-transparent border-gold text-gold hover:bg-gold hover:text-charcoal shadow-md cursor-pointer"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Buy Now • Express Checkout</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
    </AnimatePresence>
  );
}
