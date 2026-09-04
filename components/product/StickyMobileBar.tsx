"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag, Check } from "lucide-react";
import type { Product } from "@/lib/products";
import { Button } from "@/components/ui";

export interface StickyMobileBarProps {
  product: Product;
  selectedSize: string | null;
  onSelectSize: (size: string) => void;
  onAddToCart: () => void;
  isAdded: boolean;
}

export default function StickyMobileBar({
  product,
  selectedSize,
  onSelectSize,
  onAddToCart,
  isAdded,
}: StickyMobileBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 480) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-paper-light/95 backdrop-blur-xl border-t border-sand/50 p-3 sm:p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
      <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
        {/* Thumbnail & Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-11 h-13 rounded-xl overflow-hidden bg-paper-dark border border-sand/40 shrink-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <h4 className="font-serif text-xs text-charcoal font-medium truncate">
              {product.name}
            </h4>
            <span className="font-serif text-xs font-semibold text-charcoal">
              ${product.priceAud} AUD
            </span>
          </div>
        </div>

        {/* Size Selector + Add Button */}
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={selectedSize || ""}
            onChange={(e) => onSelectSize(e.target.value)}
            className="bg-paper border border-sand/60 rounded-full px-2.5 py-2 text-[11px] font-sans text-charcoal focus:outline-none focus:border-gold"
          >
            <option value="" disabled>
              Size
            </option>
            {product.sizes.map((s) => (
              <option key={s} value={s}>
                {s.split(" ")[0] || s}
              </option>
            ))}
          </select>

          <Button
            variant="primary"
            size="sm"
            onClick={onAddToCart}
            disabled={!selectedSize}
            className="whitespace-nowrap px-4"
            leftIcon={
              isAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />
            }
          >
            {isAdded ? "Added" : !selectedSize ? "Size" : "Add"}
          </Button>
        </div>
      </div>
    </div>
  );
}
