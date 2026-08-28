"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ShoppingBag, ShieldCheck, Check } from "lucide-react";
import { Product } from "./CollectionShowcase";

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
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);

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
          className="relative z-10 w-full max-w-4xl bg-paper dark:bg-ink rounded-3xl overflow-hidden shadow-2xl border border-sand/40 flex flex-col md:flex-row max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Left: Product Image */}
          <div className="md:w-1/2 relative aspect-[3/4] md:aspect-auto bg-ink min-h-[350px]">
            <img
              src={product.image}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.opacity = "0.7";
              }}
            />
            <div className="absolute top-4 left-4 flex items-center space-x-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-white">
              <span
                className="w-3 h-3 rounded-full border border-white/30"
                style={{ backgroundColor: product.colorHex }}
              />
              <span className="font-sans tracking-wider uppercase text-[10px]">
                {product.colorName}
              </span>
            </div>
          </div>

          {/* Right: Product Details & Story */}
          <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-[10px] uppercase font-sans tracking-[0.3em] text-[#C5A059]">
                <Sparkles className="w-3 h-3" />
                <span>{product.story}</span>
              </div>

              <div>
                <h2 className="font-serif text-2xl sm:text-3xl text-zinc-900 dark:text-zinc-100 font-medium">
                  {product.name}
                </h2>
                <p className="font-serif text-xl text-[#A46446] dark:text-[#C5A059] font-semibold mt-1">
                  ${product.priceAud} AUD
                </p>
              </div>

              <p className="text-xs sm:text-sm font-sans text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {product.description}
              </p>

              {/* Craft Details list */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] uppercase font-sans tracking-widest text-zinc-400">
                  Artisan Details:
                </span>
                <ul className="text-xs font-sans text-zinc-700 dark:text-zinc-300 space-y-1">
                  {product.craftDetails.map((detail, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Size Selector */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-sans">
                  <span className="uppercase tracking-wider text-zinc-500">Select Australian Size:</span>
                  <span className="text-[#C5A059] underline cursor-pointer">Size Guide</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-sans tracking-wider border transition-all ${
                        selectedSize === s
                          ? "border-[#1F1E1D] dark:border-[#FAF7F2] bg-[#1F1E1D] dark:bg-[#FAF7F2] text-[#FAF7F2] dark:text-[#1F1E1D] font-medium"
                          : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 text-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4 border-t border-[#DCC7AF]/30">
              <button
                onClick={handleAdd}
                disabled={!selectedSize}
                className={`w-full py-4 rounded-full font-sans text-xs uppercase tracking-[0.25em] font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                  !selectedSize
                    ? "bg-[#DCC7AF]/20 text-zinc-400 dark:text-zinc-500 border border-[#DCC7AF]/30 cursor-not-allowed"
                    : "bg-[#1F1E1D] dark:bg-[#FAF7F2] text-[#FAF7F2] dark:text-[#1F1E1D] hover:bg-[#C5A059] dark:hover:bg-[#C5A059] dark:hover:text-white shadow-xl cursor-pointer"
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
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
