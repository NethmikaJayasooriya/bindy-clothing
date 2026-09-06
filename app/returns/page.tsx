"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Clock, RefreshCw, HelpCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import { getCart } from "@/lib/cart";
import { ambientPlayer } from "@/lib/ambientSound";
import ReturnPortalCard from "@/components/returns/ReturnPortalCard";

export default function ReturnsPage() {
  const [isMuted, setIsMuted] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const toggleAudio = () => {
    if (!ambientPlayer) return;
    const muted = ambientPlayer.toggle();
    setIsMuted(muted);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#1F1E1D]">
      {/* NAVBAR */}
      <Navbar
        isMuted={isMuted}
        toggleAudio={toggleAudio}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* HERO SECTION */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#78716A] mb-3">
          CUSTOMER CARE &amp; PEACE OF MIND
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1F1E1D] mb-6">
          Returns &amp; Exchanges
        </h1>
        <p className="font-serif italic text-lg sm:text-xl text-[#78716A] max-w-2xl mx-auto leading-relaxed">
          Thoughtfully crafted pieces deserve a thoughtful fitting experience. We want every garment to bring lasting calm.
        </p>
      </section>

      {/* SECTION 5.2: REGIONAL RETURN WINDOW TABLE */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto mb-14">
        <div className="bg-white border border-[#DCC7AF]/60 rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center space-x-3 mb-6">
            <Clock className="w-5 h-5 text-[#C5A059]" />
            <h2 className="font-serif text-2xl text-[#1F1E1D]">Return Windows by Region</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#DCC7AF]/40">
                  <th className="py-3.5 px-4 font-mono text-xs uppercase tracking-widest text-[#78716A]">Region</th>
                  <th className="py-3.5 px-4 font-mono text-xs uppercase tracking-widest text-[#78716A] text-right">Return Window</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCC7AF]/20 text-sm">
                <tr className="hover:bg-[#FAF7F2]/50 transition-colors">
                  <td className="py-4 px-4 font-medium text-[#1F1E1D] flex items-center space-x-2">
                    <span>Australia</span>
                  </td>
                  <td className="py-4 px-4 text-right font-serif font-medium text-[#1F1E1D]">
                    30 days
                  </td>
                </tr>
                <tr className="hover:bg-[#FAF7F2]/50 transition-colors">
                  <td className="py-4 px-4 font-medium text-[#1F1E1D] flex items-center space-x-2">
                    <span>Sri Lanka</span>
                  </td>
                  <td className="py-4 px-4 text-right font-serif font-medium text-[#1F1E1D]">
                    14 days
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 5.2: VERBATIM CLIENT POLICY COPY */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto mb-16">
        <div className="bg-white border border-[#DCC7AF]/60 rounded-3xl p-8 sm:p-10 space-y-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          
          <div>
            <h2 className="font-serif text-2xl text-[#1F1E1D] mb-4">
              Return Policy
            </h2>
            <p className="text-sm leading-relaxed text-[#1F1E1D]">
              Full-priced items purchased via the Bindy online store can be returned within 30 days of receipt for an exchange, gift card or refund (excluding postage) provided they meet the following conditions:
            </p>
          </div>

          {/* CONDITIONS CHECKLIST */}
          <div className="space-y-3.5 bg-[#FAF7F2] p-6 rounded-2xl border border-[#DCC7AF]/40">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm text-[#1F1E1D]">The item is unworn and unwashed</span>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm text-[#1F1E1D]">The item shows no signs of wear, fragrance, makeup, fake tan, damage, or misuse</span>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm text-[#1F1E1D]">The item is in its original condition with tags attached</span>
            </div>
          </div>

          {/* SHIPPING & POSTAGE */}
          <div className="space-y-4 text-xs sm:text-sm text-[#78716A] leading-relaxed">
            <p>
              Except as provided in the Return Policy, return shipping is at your cost unless the item is defective or was shipped in error. This includes postage, carrier fees, and any customs charges incurred in returning the item.
            </p>
            <p>
              Once your return is received at our warehouse, it can take 3 to 6 business days for your return to be processed. Return processing may take up to 10 business days if your returned products are received with damage or faults, are missing an item in your return, or do not adhere to our return policy.
            </p>
          </div>

          {/* CTA TO PORTAL */}
          <div className="pt-4 border-t border-[#DCC7AF]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-serif text-lg text-[#1F1E1D]">Ready to initiate a return or exchange?</p>
              <p className="text-xs text-[#78716A]">Head to our online return portal to track your order.</p>
            </div>
            <Link
              href="/returns/start"
              className="px-8 py-4 bg-[#1F1E1D] text-white rounded-full text-xs font-medium tracking-[0.2em] uppercase hover:bg-[#C5A059] transition-all duration-300 shadow-md flex items-center space-x-2"
            >
              <span>Head to Our Return Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* EMBEDDED RETURN PORTAL FORM */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pb-24">
        <div className="text-center mb-8">
          <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#78716A] mb-2">
            INSTANT ORDER LOOKUP
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1F1E1D]">
            Track Your Return Below
          </h2>
        </div>
        <ReturnPortalCard />
      </section>

      {/* FOOTER */}
      <Footer />

      {/* CART DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={() => {}}
        onRemoveItem={() => {}}
      />
    </main>
  );
}
