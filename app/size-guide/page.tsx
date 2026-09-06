"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Ruler, Sparkles, ArrowRight, HelpCircle, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import { getCart } from "@/lib/cart";
import { ambientPlayer } from "@/lib/ambientSound";
import { BODY_MEASUREMENTS, SIZE_CONVERSIONS, MEASURING_GUIDE_TIPS } from "@/data/size-guide";

export default function SizeGuidePage() {
  const [unit, setUnit] = useState<"in" | "cm">("in");
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
      <section className="pt-32 pb-14 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#78716A] mb-3">
          FIT &amp; PROPORTION GUIDE
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1F1E1D] mb-6">
          Size Guide
        </h1>
        <p className="font-serif italic text-lg sm:text-xl text-[#78716A] max-w-2xl mx-auto leading-relaxed">
          Crafted to drape effortlessly on varied silhouettes. Find your ideal fit across Australian, US, and European sizing.
        </p>
      </section>

      {/* BODY MEASUREMENTS & CONVERSIONS SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-20">
        <div className="bg-white border border-[#DCC7AF]/60 rounded-3xl p-6 sm:p-10 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-12">
          
          {/* BODY MEASUREMENTS TABLE */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-[#78716A] font-semibold">
                  BODY MEASUREMENTS
                </h2>
                <p className="text-xs text-[#78716A] mt-1">
                  Reference dimensions to guide your silhouette selection
                </p>
              </div>

              {/* CM / IN TOGGLE MATCHING CLIENT SCREENSHOT */}
              <div className="flex items-center space-x-2 self-end sm:self-auto">
                <span className="text-xs font-mono text-[#78716A] mr-1">Unit:</span>
                <div className="inline-flex items-center bg-[#FAF7F2] p-1 rounded-full border border-[#DCC7AF]">
                  <button
                    type="button"
                    onClick={() => setUnit("cm")}
                    className={`px-4 py-1.5 text-xs font-mono rounded-full transition-all ${
                      unit === "cm"
                        ? "bg-[#1F1E1D] text-white shadow-sm"
                        : "text-[#78716A] hover:text-[#1F1E1D]"
                    }`}
                  >
                    CM
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnit("in")}
                    className={`px-4 py-1.5 text-xs font-mono rounded-full transition-all ${
                      unit === "in"
                        ? "bg-[#1F1E1D] text-white shadow-sm"
                        : "text-[#78716A] hover:text-[#1F1E1D]"
                    }`}
                  >
                    IN
                  </button>
                </div>
              </div>
            </div>

            {/* TABLE WITH STICKY HEADERS */}
            <div className="overflow-x-auto rounded-2xl border border-[#DCC7AF]/50 bg-white">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-[#FAF7F2]/90 border-b border-[#DCC7AF]/40 text-[#78716A] font-mono text-xs">
                    <th className="py-4 px-4 text-left font-medium uppercase tracking-wider sticky left-0 bg-[#FAF7F2] z-10 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                      AUS / UK
                    </th>
                    {BODY_MEASUREMENTS.map((m) => (
                      <th key={m.size} className="py-4 px-4 font-semibold text-[#1F1E1D] min-w-[95px]">
                        {m.size}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCC7AF]/25 text-[#1F1E1D]">
                  <tr className="hover:bg-[#FAF7F2]/40 transition-colors">
                    <td className="py-4 px-4 text-left font-mono text-xs font-medium text-[#78716A] uppercase sticky left-0 bg-white z-10 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                      Bust
                    </td>
                    {BODY_MEASUREMENTS.map((m) => (
                      <td key={m.size} className="py-4 px-4 font-mono text-xs">
                        {m.bust[unit]}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-[#FAF7F2]/20 hover:bg-[#FAF7F2]/50 transition-colors">
                    <td className="py-4 px-4 text-left font-mono text-xs font-medium text-[#78716A] uppercase sticky left-0 bg-[#FAF7F2]/60 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                      Waist
                    </td>
                    {BODY_MEASUREMENTS.map((m) => (
                      <td key={m.size} className="py-4 px-4 font-mono text-xs">
                        {m.waist[unit]}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-[#FAF7F2]/40 transition-colors">
                    <td className="py-4 px-4 text-left font-mono text-xs font-medium text-[#78716A] uppercase sticky left-0 bg-white z-10 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                      Hip
                    </td>
                    {BODY_MEASUREMENTS.map((m) => (
                      <td key={m.size} className="py-4 px-4 font-mono text-xs">
                        {m.hip[unit]}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* SIZE CONVERSION TABLE */}
          <div>
            <div className="mb-6">
              <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-[#78716A] font-semibold">
                SIZE CONVERSION
              </h2>
              <p className="text-xs text-[#78716A] mt-1">
                Standard international conversion across Australian, US, and European sizing
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[#DCC7AF]/50 bg-white">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-[#FAF7F2]/90 border-b border-[#DCC7AF]/40 text-[#78716A] font-mono text-xs">
                    <th className="py-4 px-4 text-left font-medium uppercase tracking-wider sticky left-0 bg-[#FAF7F2] z-10 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                      AUS / UK
                    </th>
                    {SIZE_CONVERSIONS.map((c) => (
                      <th key={c.ausUk} className="py-4 px-4 font-semibold text-[#1F1E1D] min-w-[95px]">
                        {c.ausUk}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCC7AF]/25 text-[#1F1E1D]">
                  <tr className="hover:bg-[#FAF7F2]/40 transition-colors">
                    <td className="py-4 px-4 text-left font-mono text-xs font-medium text-[#78716A] uppercase sticky left-0 bg-white z-10 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                      USA
                    </td>
                    {SIZE_CONVERSIONS.map((c) => (
                      <td key={c.ausUk} className="py-4 px-4 font-mono text-xs">
                        {c.usa}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-[#FAF7F2]/20 hover:bg-[#FAF7F2]/50 transition-colors">
                    <td className="py-4 px-4 text-left font-mono text-xs font-medium text-[#78716A] uppercase sticky left-0 bg-[#FAF7F2]/60 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                      EU
                    </td>
                    {SIZE_CONVERSIONS.map((c) => (
                      <td key={c.ausUk} className="py-4 px-4 font-mono text-xs">
                        {c.eu}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* MEASURING ADVICE */}
          <div className="pt-6 border-t border-[#DCC7AF]/40">
            <h3 className="font-serif text-xl text-[#1F1E1D] mb-6">
              How to Take Your Measurements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MEASURING_GUIDE_TIPS.map((tip) => (
                <div key={tip.title} className="p-5 bg-[#FAF7F2] rounded-2xl border border-[#DCC7AF]/40 space-y-2">
                  <span className="font-mono text-xs tracking-wider uppercase text-[#C5A059] font-medium">
                    {tip.title}
                  </span>
                  <p className="text-xs text-[#78716A] leading-relaxed">
                    {tip.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CUSTOM SIZING & ASSISTANCE CTA */}
          <div className="p-6 bg-[#FAF7F2] rounded-2xl border border-[#DCC7AF]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-serif text-lg text-[#1F1E1D]">Unsure between two sizes?</p>
              <p className="text-xs text-[#78716A]">Our Melbourne studio concierge can recommend your ideal fit or custom alterations.</p>
            </div>
            <Link
              href="/contact"
              className="px-6 py-3 bg-[#1F1E1D] text-white rounded-full text-xs font-mono tracking-widest uppercase hover:bg-[#C5A059] transition-colors whitespace-nowrap"
            >
              Contact Concierge
            </Link>
          </div>
        </div>
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
