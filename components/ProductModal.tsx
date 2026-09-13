"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ShoppingBag, ShieldCheck, Check, Heart, ArrowRight, Ruler, MapPin, Truck } from "lucide-react";
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
  const installment = (product.priceAud / 4).toFixed(2);

  const handleAdd = () => {
    if (!selectedSize) return;
    onAddToCart(product, selectedSize);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 700);
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
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative z-10 w-full max-w-4xl bg-paper-light text-charcoal rounded-3xl overflow-hidden shadow-2xl border border-sand/40 flex flex-col md:flex-row max-h-[90vh] overflow-y-auto custom-scrollbar"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-paper/80 backdrop-blur-md hover:bg-paper text-charcoal transition-colors cursor-pointer border border-sand/40 shadow-sm"
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
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs uppercase font-bold tracking-wider text-[#FAF7F2] border border-white/20">
                {product.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-xs uppercase font-bold tracking-wider text-charcoal shadow-sm border border-sand/40 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gold" />
                {product.storyPlace}
              </span>
            </div>

            {/* Wishlist button over image */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute bottom-4 left-4 p-3 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer shadow-md ${
                isInWishlist(product.id)
                  ? "bg-gold text-charcoal scale-105"
                  : "bg-black/60 hover:bg-black text-white hover:text-gold"
              }`}
              title={isInWishlist(product.id) ? "Saved in Wishlist" : "Save to Wishlist"}
              aria-label="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-charcoal text-charcoal" : "text-white"}`} />
            </button>
          </div>

          {/* Right Column: Details & Selection */}
          <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-sans uppercase font-bold tracking-widest text-gold block mb-1">
                  {product.story}
                </span>
                <h3 className="font-serif text-2xl md:text-3xl text-charcoal-rich font-light leading-tight">
                  {product.name}
                </h3>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="font-serif text-2xl font-medium text-charcoal-rich">
                    ${product.priceAud} AUD
                  </span>
                  <span className="text-xs text-charcoal-subtle font-sans font-light">
                    • 4 payments of ${installment} with Afterpay
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-sans p-3 rounded-2xl bg-paper border border-sand/40">
                <div>
                  <span className="text-charcoal-subtle block text-[10px] uppercase font-bold tracking-wider">Fabric</span>
                  <span className="font-medium text-charcoal">{product.fabric}</span>
                </div>
                <div>
                  <span className="text-charcoal-subtle block text-[10px] uppercase font-bold tracking-wider">Color</span>
                  <span className="font-medium text-charcoal">{product.colorName}</span>
                </div>
              </div>

              <p className="text-xs font-sans text-charcoal/80 leading-relaxed font-light line-clamp-3">
                {product.description}
              </p>

              <Link
                href={`/product/${product.id}`}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-xs font-sans uppercase font-bold tracking-wider text-gold hover:text-cinnamon transition-colors pt-0.5"
              >
                <span>View Full Piece & Heritage Provenance</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              {/* Size Selector with Unified Height */}
              <div className="pt-2 border-t border-sand/30 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-sans uppercase font-bold tracking-wider text-charcoal-subtle">
                    Select Size: {selectedSize && <strong className="text-charcoal">{selectedSize}</strong>}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSizeGuide(true)}
                    className="inline-flex items-center gap-1 text-xs font-sans text-gold hover:text-cinnamon cursor-pointer font-bold uppercase tracking-wider"
                  >
                    <Ruler className="w-3 h-3" />
                    <span>Size Guide</span>
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-1.5">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`h-11 rounded-xl text-xs font-sans transition-all border cursor-pointer flex items-center justify-center p-1 ${
                        selectedSize === s
                          ? "border-charcoal bg-charcoal text-paper-light font-bold shadow-sm"
                          : "border-sand/50 bg-paper hover:border-gold text-charcoal font-medium"
                      }`}
                    >
                      {s.split(" ")[0]} {s.split(" ")[1]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-sand/30 space-y-2.5">
              <button
                type="button"
                onClick={handleAdd}
                disabled={!selectedSize}
                className={`w-full py-3.5 rounded-2xl font-sans text-xs uppercase font-bold tracking-wider transition-all duration-200 flex items-center justify-center space-x-2 ${
                  !selectedSize
                    ? "bg-sand/30 text-charcoal-subtle border border-sand/40 cursor-not-allowed"
                    : "bg-gold hover:bg-[#B38F46] text-charcoal hover:text-white shadow-luxury cursor-pointer active:scale-[0.99]"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-800" />
                    <span>Added to Bag</span>
                  </>
                ) : !selectedSize ? (
                  <span>Please Select a Size</span>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag • ${product.priceAud} AUD</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={!selectedSize}
                className={`w-full py-3.5 rounded-2xl font-sans text-xs uppercase font-bold tracking-wider transition-all duration-200 flex items-center justify-center space-x-2 border ${
                  !selectedSize
                    ? "bg-transparent text-charcoal-subtle/50 border-sand/30 cursor-not-allowed"
                    : "bg-charcoal text-paper-light hover:bg-black cursor-pointer shadow-sm hover:shadow-md"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-gold" />
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
