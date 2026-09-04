"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Ruler, Sparkles, UserCheck, ArrowRight, HelpCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import { getCart } from "@/lib/cart";
import { ambientPlayer } from "@/lib/ambientSound";
import { Button, SectionHeading } from "@/components/ui";

export default function SizeGuidePage() {
  const [unit, setUnit] = useState<"cm" | "in">("cm");
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

  const internationalConversions = [
    { au: "AU 6 (XS)", us: "US 2", uk: "UK 6", eu: "EU 34", bust: { cm: "80 - 83", in: "31.5 - 32.5" }, waist: { cm: "62 - 65", in: "24.5 - 25.5" }, hip: { cm: "88 - 91", in: "34.5 - 35.8" } },
    { au: "AU 8 (S)", us: "US 4", uk: "UK 8", eu: "EU 36", bust: { cm: "84 - 87", in: "33.0 - 34.2" }, waist: { cm: "66 - 69", in: "26.0 - 27.2" }, hip: { cm: "92 - 95", in: "36.2 - 37.4" } },
    { au: "AU 10 (M)", us: "US 6", uk: "UK 10", eu: "EU 38", bust: { cm: "88 - 92", in: "34.6 - 36.2" }, waist: { cm: "70 - 74", in: "27.5 - 29.1" }, hip: { cm: "96 - 100", in: "37.8 - 39.4" } },
    { au: "AU 12 (L)", us: "US 8", uk: "UK 12", eu: "EU 40", bust: { cm: "93 - 97", in: "36.6 - 38.2" }, waist: { cm: "75 - 79", in: "29.5 - 31.1" }, hip: { cm: "101 - 105", in: "39.8 - 41.3" } },
    { au: "AU 14 (XL)", us: "US 10", uk: "UK 14", eu: "EU 42", bust: { cm: "98 - 103", in: "38.6 - 40.5" }, waist: { cm: "80 - 85", in: "31.5 - 33.5" }, hip: { cm: "106 - 111", in: "41.7 - 43.7" } },
  ];

  const measuringTips = [
    {
      title: "1. Bust",
      desc: "Measure around the fullest part of your chest, keeping the tape horizontal and relaxed under your arms.",
    },
    {
      title: "2. Waist",
      desc: "Measure around your natural waistline, typically the narrowest point of your torso slightly above the navel.",
    },
    {
      title: "3. Hips",
      desc: "Stand with feet together and measure around the fullest point of your hips and seat.",
    },
  ];

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="min-h-screen bg-paper text-charcoal">
      {/* NAVBAR */}
      <Navbar
        isMuted={isMuted}
        toggleAudio={toggleAudio}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* HERO */}
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-24 px-4 sm:px-6 lg:px-8 bg-paper-dark border-b border-sand/40 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-[10px] font-sans uppercase tracking-[0.35em] text-gold font-semibold">
            <Ruler className="w-3.5 h-3.5 text-gold" />
            <span>Fit & Proportions</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-wide text-charcoal-rich leading-tight">
            The Size <span className="font-editorial-italic text-gold">Guide</span>
          </h1>

          <p className="font-serif italic text-base sm:text-lg text-muted font-light max-w-2xl mx-auto leading-relaxed">
            Our silhouettes are tailored true to Australian standard sizing, with gentle ease through the hips and waist for natural summer movement.
          </p>

          {/* Unit Toggle */}
          <div className="pt-4 flex items-center justify-center">
            <div className="flex items-center gap-1 p-1 bg-paper-light border border-sand/50 rounded-full shadow-sm">
              <button
                type="button"
                onClick={() => setUnit("cm")}
                className={`px-5 py-1.5 rounded-full text-xs font-sans uppercase tracking-wider transition-all cursor-pointer ${
                  unit === "cm"
                    ? "bg-gold text-charcoal font-bold shadow-sm"
                    : "text-muted hover:text-charcoal"
                }`}
              >
                Metric (CM)
              </button>
              <button
                type="button"
                onClick={() => setUnit("in")}
                className={`px-5 py-1.5 rounded-full text-xs font-sans uppercase tracking-wider transition-all cursor-pointer ${
                  unit === "in"
                    ? "bg-gold text-charcoal font-bold shadow-sm"
                    : "text-muted hover:text-charcoal"
                }`}
              >
                Imperial (Inches)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 1. INTERNATIONAL CONVERSION & MEASUREMENTS TABLE */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="overflow-x-auto rounded-3xl border border-sand/40 bg-paper-light shadow-paper-card">
          <table className="w-full text-left text-xs sm:text-sm font-sans">
            <thead className="bg-paper-dark border-b border-sand/40 text-[10px] uppercase tracking-wider text-muted font-semibold">
              <tr>
                <th className="py-4 px-6">Australian Size</th>
                <th className="py-4 px-6">US Size</th>
                <th className="py-4 px-6">UK Size</th>
                <th className="py-4 px-6">EU Size</th>
                <th className="py-4 px-6">Bust ({unit})</th>
                <th className="py-4 px-6">Waist ({unit})</th>
                <th className="py-4 px-6">Hip ({unit})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/30 text-charcoal">
              {internationalConversions.map((row, idx) => (
                <tr key={idx} className="hover:bg-paper transition-colors">
                  <td className="py-4 px-6 font-semibold text-charcoal">{row.au}</td>
                  <td className="py-4 px-6 text-muted">{row.us}</td>
                  <td className="py-4 px-6 text-muted">{row.uk}</td>
                  <td className="py-4 px-6 text-muted">{row.eu}</td>
                  <td className="py-4 px-6 text-charcoal/90">{row.bust[unit]}</td>
                  <td className="py-4 px-6 text-charcoal/90">{row.waist[unit]}</td>
                  <td className="py-4 px-6 text-charcoal/90">{row.hip[unit]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. HOW TO MEASURE GUIDE */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-paper-dark border-y border-sand/40">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            eyebrow="Precision Fitting"
            title="How to Measure Your Body"
            italicWord="Your Body"
            description="Use a flexible measuring tape directly over undergarments for the most accurate results."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {measuringTips.map((tip, idx) => (
              <div
                key={idx}
                className="p-7 rounded-3xl bg-paper-light border border-sand/40 space-y-3 shadow-sm"
              >
                <h3 className="font-serif text-xl text-charcoal font-medium">
                  {tip.title}
                </h3>
                <p className="text-xs sm:text-[13px] font-sans text-charcoal/80 font-light leading-relaxed">
                  {tip.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-gold/10 border border-gold/30 text-center space-y-2">
            <h4 className="font-serif text-lg font-medium text-charcoal">
              Unsure between two sizes?
            </h4>
            <p className="text-xs font-sans text-muted max-w-xl mx-auto">
              Our tailoring team in Brisbane and Colombo can advise on bust ease and hem lengths. Email us at{" "}
              <strong className="text-gold font-medium">care@bindyclothing.com</strong>.
            </p>
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
