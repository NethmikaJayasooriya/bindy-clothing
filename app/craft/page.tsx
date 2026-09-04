"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Leaf,
  Sparkles,
  ShieldCheck,
  Award,
  ArrowRight,
  Waves,
  Feather,
  CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import { getCart } from "@/lib/cart";
import { ambientPlayer } from "@/lib/ambientSound";
import { CRAFT_MATERIALS, CRAFT_PROCESS_STEPS, ETHICAL_PILLARS } from "@/data/craft";
import { Button, SectionHeading } from "@/components/ui";

export default function CraftPage() {
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
    <main className="min-h-screen bg-paper text-charcoal">
      {/* NAVBAR */}
      <Navbar
        isMuted={isMuted}
        toggleAudio={toggleAudio}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* HERO */}
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-28 px-4 sm:px-6 lg:px-8 bg-paper-dark border-b border-sand/40 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-[10px] font-sans uppercase tracking-[0.35em] text-gold font-semibold">
            <Leaf className="w-3.5 h-3.5 text-gold" />
            <span>Honest Materials & Living Looms</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-wide text-charcoal-rich leading-tight">
            Artisan Craft & <span className="font-editorial-italic text-gold">Sustainability</span>
          </h1>

          <p className="font-serif italic text-base sm:text-lg text-muted font-light max-w-2xl mx-auto leading-relaxed">
            We reject the disposable velocity of modern fashion. Our garments are woven thread by thread on generational wooden pit-looms in rural Sri Lanka.
          </p>
        </div>
      </section>

      {/* 1. FOUR MATERIALS DEEP DIVE */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-sand/30">
        <SectionHeading
          eyebrow="Material Board"
          title="The Fabrics of BINDY"
          italicWord="Fabrics"
          description="Chosen for breathability, tactile memory, and their gentle return to the earth."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {CRAFT_MATERIALS.map((mat) => (
            <div
              key={mat.id}
              className="p-8 sm:p-10 rounded-3xl bg-paper-light border border-sand/40 shadow-paper-card space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-sans tracking-[0.25em] px-3.5 py-1 rounded-full bg-gold/15 text-charcoal font-semibold border border-gold/30">
                    {mat.badge}
                  </span>
                  <span className="text-[11px] font-sans text-muted">{mat.origin}</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl text-charcoal-rich font-medium">
                  {mat.title}
                </h3>

                <p className="text-xs sm:text-sm font-sans text-charcoal/85 leading-relaxed font-light">
                  {mat.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-sand/30 space-y-2 text-xs font-sans">
                <div className="flex items-start gap-2">
                  <Leaf className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <span className="text-charcoal/90 font-light">
                    <strong className="font-semibold text-charcoal">Eco-Credentials:</strong>{" "}
                    {mat.sustainability}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Waves className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <span className="text-charcoal/90 font-light">
                    <strong className="font-semibold text-charcoal">Mindful Care:</strong>{" "}
                    {mat.careAdvice}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. STEP-BY-STEP PIT-LOOM PROCESS */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-paper-dark border-b border-sand/40">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="Ancestral Cadence"
            title="From Spool to Silhouette"
            italicWord="Silhouette"
            description="How an unbleached spool of cotton becomes a fluid Australian wardrobe heirloom."
            align="center"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CRAFT_PROCESS_STEPS.map((step) => (
              <div
                key={step.step}
                className="p-6 sm:p-8 rounded-3xl bg-paper-light border border-sand/40 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm tracking-widest text-gold font-bold">
                    {step.step}
                  </span>
                  <span className="text-[10px] font-sans text-muted">{step.duration}</span>
                </div>

                <h3 className="font-serif text-xl text-charcoal font-medium">
                  {step.title}
                </h3>

                <p className="text-xs font-sans text-gold font-semibold uppercase tracking-wider">
                  {step.subtitle}
                </p>

                <p className="text-xs font-sans text-charcoal/80 font-light leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ETHICAL METRICS & STANDARDS */}
      <section id="sustainability" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-paper border-b border-sand/30">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="Impact & Accountability"
            title="Our Four Ethical Commitments"
            italicWord="Commitments"
            description="Tangible pledges that preserve ancient culture and protect rural livelihoods."
            align="center"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ETHICAL_PILLARS.map((p, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl bg-paper-light border border-sand/40 text-center space-y-3 shadow-paper-card"
              >
                <span className="font-serif text-5xl text-gold font-light block">
                  {p.stat}
                </span>
                <h3 className="font-serif text-lg text-charcoal font-medium">
                  {p.title}
                </h3>
                <p className="text-xs font-sans text-charcoal/80 font-light leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
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
