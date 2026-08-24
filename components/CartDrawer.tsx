"use client";

import React from "react";
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
              className="w-screen max-w-md bg-[#FAF7F2] dark:bg-[#151413] border-l border-[#DCC7AF]/30 shadow-2xl flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-[#DCC7AF]/20 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-[#C5A059]" />
                  <h3 className="font-serif text-2xl text-zinc-900 dark:text-zinc-100 font-medium">
                    Your Shopping Bag
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Free Shipping Progress */}
              <div className="px-6 py-3.5 bg-[#F2ECE1] dark:bg-zinc-900 border-b border-[#DCC7AF]/20">
                <div className="flex justify-between text-xs font-sans mb-1.5">
                  {amountToFreeShipping === 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      ✓ You qualify for Free Express Shipping in Australia!
                    </span>
                  ) : (
                    <span className="text-zinc-600 dark:text-zinc-400">
                      Add <strong className="text-zinc-900 dark:text-zinc-100">${amountToFreeShipping} AUD</strong> for Free Shipping
                    </span>
                  )}
                  <span className="font-mono text-xs text-[#C5A059]">{Math.round(progressToFreeShipping)}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C5A059] transition-all duration-300 rounded-full"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-zinc-500">
                    <ShoppingBag className="w-12 h-12 stroke-[1] text-[#C5A059]" />
                    <p className="font-serif text-lg">Your bag is currently empty.</p>
                    <button
                      onClick={onClose}
                      className="px-6 py-2.5 rounded-full border border-zinc-400 dark:border-zinc-600 text-xs uppercase tracking-widest hover:border-black transition-colors"
                    >
                      Discover Collection 01
                    </button>
                  </div>
                ) : (
                  items.map((item, idx) => (
                    <div
                      key={`${item.product.id}-${item.size}-${idx}`}
                      className="flex space-x-4 p-3 rounded-2xl bg-white dark:bg-zinc-900/50 border border-[#DCC7AF]/20"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-24 object-cover rounded-xl bg-zinc-200"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-serif text-base text-zinc-900 dark:text-zinc-100 font-medium">
                            {item.product.name}
                          </h4>
                          <p className="text-[11px] font-sans text-zinc-500">
                            Size: {item.size} • {item.product.colorName}
                          </p>
                          <p className="font-serif text-sm font-semibold text-[#A46446] dark:text-[#C5A059] mt-0.5">
                            ${item.product.priceAud} AUD
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center space-x-2 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-0.5 text-xs">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.size, -1)}
                              className="px-1 text-zinc-500 hover:text-black"
                            >
                              -
                            </button>
                            <span className="px-1 font-mono font-medium">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.size, 1)}
                              className="px-1 text-zinc-500 hover:text-black"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.product.id, item.size)}
                            className="text-zinc-400 hover:text-rose-500 transition-colors p-1"
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
                <div className="p-6 border-t border-[#DCC7AF]/20 space-y-4 bg-white dark:bg-zinc-900">
                  <div className="flex items-center justify-between font-serif text-lg">
                    <span className="text-zinc-600 dark:text-zinc-400">Subtotal:</span>
                    <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                      ${subtotal} AUD
                    </span>
                  </div>

                  <p className="text-[11px] font-sans text-zinc-500 text-center">
                    Taxes & shipping calculated at checkout. Small batch ethical guarantee.
                  </p>

                  <button
                    onClick={() => alert("Proceeding to secure Australian Shopify/Stripe Checkout mockup!")}
                    className="w-full py-4 rounded-full bg-[#1F1E1D] dark:bg-[#FAF7F2] text-[#FAF7F2] dark:text-[#1F1E1D] font-sans text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#C5A059] dark:hover:bg-[#C5A059] dark:hover:text-white transition-all duration-300 flex items-center justify-center space-x-2 shadow-xl"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
