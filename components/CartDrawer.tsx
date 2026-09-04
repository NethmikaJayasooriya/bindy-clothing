"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { Product } from "./CollectionShowcase";

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, size: string, delta: number) => void;
  onRemoveItem: (id: string, size: string) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
}: CartDrawerProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.priceAud * item.quantity,
    0
  );

  const freeShippingThreshold = 250;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-screen max-w-md bg-paper-light border-l border-sand/40 shadow-2xl flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-sand/30 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-gold" />
                  <h3 className="font-serif text-2xl text-charcoal font-medium">
                    Your Shopping Bag
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-sand/20 text-charcoal transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Free Shipping Progress */}
              <div className="px-6 py-3.5 bg-paper-dark border-b border-sand/30">
                <div className="flex justify-between text-xs font-sans mb-1.5">
                  {amountToFreeShipping === 0 ? (
                    <span className="text-emerald-700 font-medium">
                      ✓ You qualify for Free Express Shipping in Australia!
                    </span>
                  ) : (
                    <span className="text-charcoal/80">
                      Add <strong className="text-charcoal">${amountToFreeShipping} AUD</strong> for Free Shipping
                    </span>
                  )}
                  <span className="font-mono text-xs text-gold font-bold">{Math.round(progressToFreeShipping)}%</span>
                </div>
                <div className="w-full h-1.5 bg-sand/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold transition-all duration-300 rounded-full"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-muted">
                    <ShoppingBag className="w-12 h-12 stroke-[1] text-gold" />
                    <p className="font-serif text-lg text-charcoal">Your bag is currently empty.</p>
                    <button
                      onClick={onClose}
                      className="px-6 py-2.5 rounded-full border border-sand/60 text-xs font-sans uppercase tracking-widest text-charcoal hover:border-gold hover:text-gold transition-colors cursor-pointer"
                    >
                      Discover Collection 01
                    </button>
                  </div>
                ) : (
                  items.map((item, idx) => (
                    <div
                      key={`${item.product.id}-${item.size}-${idx}`}
                      className="flex space-x-4 p-3 rounded-2xl bg-paper border border-sand/30"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-24 object-cover rounded-xl bg-paper-dark"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-serif text-base text-charcoal font-medium">
                            {item.product.name}
                          </h4>
                          <p className="text-[11px] font-sans text-muted">
                            Size: {item.size} • {item.product.colorName}
                          </p>
                          <p className="font-serif text-sm font-semibold text-charcoal mt-0.5">
                            ${item.product.priceAud} AUD
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center space-x-2 border border-sand/40 bg-paper-light rounded-lg px-2 py-0.5 text-xs text-charcoal">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.size, -1)}
                              className="px-1 text-muted hover:text-charcoal cursor-pointer"
                            >
                              -
                            </button>
                            <span className="px-1 font-mono font-medium">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.size, 1)}
                              className="px-1 text-muted hover:text-charcoal cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.product.id, item.size)}
                            className="text-muted hover:text-terracotta transition-colors p-1 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer */}
              {items.length > 0 && (
                <div className="p-6 border-t border-sand/30 space-y-4 bg-paper-light">
                  <div className="flex items-center justify-between font-serif text-lg">
                    <span className="text-muted">Subtotal:</span>
                    <span className="text-xl font-bold text-charcoal">
                      ${subtotal} AUD
                    </span>
                  </div>

                  <p className="text-[11px] font-sans text-muted text-center">
                    Taxes & shipping calculated at checkout. Small batch ethical guarantee.
                  </p>

                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="w-full py-4 rounded-full bg-gold hover:bg-cinnamon text-charcoal hover:text-white font-sans text-xs uppercase tracking-[0.25em] font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-xl cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
