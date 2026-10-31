"use client";
import ResponsiveImage from "@/components/ResponsiveImage";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  MapPin,
  Leaf,
  ShieldCheck,
  Award,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import { getCart } from "@/lib/cart";
import { ambientPlayer } from "@/lib/ambientSound";
import { CRAFT_PROCESS_STEPS } from "@/data/craft";
import { Button, SectionHeading } from "@/components/ui";

export default function AboutPage() {
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

  const brandValues = [
    {
      icon: Award,
      title: "Ancestral Handloom",
      desc: "Woven exclusively on traditional wooden pit-looms with zero electrical power. Pockets of living air trapped within the weave create natural thermal comfort.",
    },
    {
      icon: ShieldCheck,
      title: "Slow, Small-Batch Craft",
      desc: "Strictly limited editions of 25 to 50 numbered pieces. We never mass produce, never discount to landfill, and honor every meter of cotton.",
    },
    {
      icon: Sparkles,
      title: "Cultural Storytelling",
      desc: "Our clothes are living fragments of memory — temple lotus ponds, 5th-century Sigiriya fresco clays, and coastal pearl divers translated into quiet luxury.",
    },
    {
      icon: Leaf,
      title: "Deep Sustainability",
      desc: "100% natural, biodegradable fibers, organic mother-of-pearl and coconut buttons, certified non-toxic dyes, and plastic-free home-compostable mailers.",
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

      {/* 1. HERO MANIFESTO */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 px-4 sm:px-6 lg:px-8 bg-paper-dark border-b border-sand/40 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Manifesto Copy (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-[10px] font-sans uppercase tracking-[0.35em] text-gold font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span>Our Origin & Manifesto</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-wide text-charcoal-rich leading-[1.1]">
                Two Islands. <span className="font-editorial-italic text-gold">One Thread.</span>
              </h1>

              <p className="font-serif italic text-lg sm:text-xl text-muted font-light leading-relaxed">
                “We believe what you wear should ground your spirit. Clothes created at the human pace of memory, connecting ancient Sri Lankan soil to warm Australian sunlight.”
              </p>

              <div className="space-y-4 text-xs sm:text-sm font-sans text-charcoal/85 font-light leading-relaxed pt-2 border-t border-sand/30">
                <p>
                  BINDY brings Sri Lankan inspiration to an Australian wardrobe. Our collections explore relaxed silhouettes, considered details and pieces you can make your own — worn together, styled separately and reached for again.
                </p>
                <p>
                  Every button is carved from organic mother-of-pearl or reclaimed coconut husk. Every seam is finished with couture dignity. We do not design for the trend cycle; we design for quiet, meaningful moments under the sun.
                </p>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Link href="/collection">
                  <Button variant="primary" size="md">
                    Explore the Collection
                  </Button>
                </Link>
                <a href="#artisan-process">
                  <Button variant="outline" size="md">
                    Our Handloom Craft
                  </Button>
                </a>
              </div>
            </div>

            {/* Right: Evocative Location Image (5 cols) */}
            <div className="lg:col-span-5 relative aspect-[4/5] rounded-3xl overflow-hidden bg-paper shadow-luxury border border-sand/40">
              <ResponsiveImage
                src="/images/destinations/garden.jpg"
                alt="Sri Lankan courtyard colonial doorway"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-gold font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-gold" />
                  Galle Fort & Brisbane
                </span>
                <p className="font-serif text-lg leading-tight">
                  Where ancestral memories meet the Australian sun.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ARTISAN HANDLOOM PROCESS & COMMUNITY IMPACT */}
      <section id="artisan-process" className="py-24 sm:py-32 bg-paper border-b border-sand/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Village Cooperatives"
            title="The Artisan Handloom Process"
            italicWord="Handloom Process"
            description="Four deliberate steps guided entirely by human hands on traditional pit-looms in Gampaha and Western Province."
            align="center"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {CRAFT_PROCESS_STEPS.map((step) => (
              <div
                key={step.step}
                className="p-6 rounded-3xl bg-paper-light border border-sand/40 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs tracking-widest text-gold font-bold">
                      STEP {step.step}
                    </span>
                    <span className="text-[10px] font-sans text-muted font-light">
                      {step.duration}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg text-charcoal font-medium leading-snug">
                    {step.title}
                  </h3>

                  <p className="text-[11px] font-sans text-gold font-semibold uppercase tracking-wider">
                    {step.subtitle}
                  </p>

                  <p className="text-xs font-sans text-charcoal/80 font-light leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-sand/30 text-[10px] font-sans text-muted">
                  Conducted by generational artisans
                </div>
              </div>
            ))}
          </div>

          {/* Ethical Commitment Banner */}
          <div className="p-8 sm:p-10 rounded-3xl bg-charcoal text-paper-light border border-sand/40 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-2">
                <span className="text-[10px] uppercase font-sans tracking-[0.3em] text-gold font-semibold block">
                  Fair Trade & Dignified Livelihoods
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-light text-white">
                  Our Direct Artisan Wage Pledge
                </h3>
                <p className="font-sans text-xs sm:text-sm text-sand/80 font-light leading-relaxed max-w-2xl">
                  We bypass export agents and middle tiers, funding village cooperatives directly and paying 1.8 times the standard artisan rate. This ensures our female weavers can work from their village homes while supporting children through higher education.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
                <span className="font-serif text-5xl sm:text-6xl text-gold font-light">
                  1.8×
                </span>
                <span className="text-xs font-sans uppercase tracking-wider text-sand-light mt-1">
                  Living Wage Standard
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VALUES GRID */}
      <section className="py-24 sm:py-28 bg-paper-dark/50 border-b border-sand/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Ethical Foundations"
            title="What We Stand For"
            italicWord="Stand For"
            description="Four uncompromising pillars shaping every thread, pattern, and package."
            align="center"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {brandValues.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={i}
                  className="p-7 rounded-3xl bg-paper-light border border-sand/40 space-y-4 shadow-paper-card"
                >
                  <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="font-serif text-xl text-charcoal font-medium">
                    {v.title}
                  </h3>
                  <p className="text-xs font-sans text-charcoal/80 font-light leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. CLOSING CTA INTO THE COLLECTION */}
      <section className="py-24 sm:py-32 bg-paper-dark text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="text-[10px] font-sans uppercase tracking-[0.35em] text-gold font-semibold block">
            Begin Your Journey
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-charcoal-rich">
            Wear Your Calm. <span className="font-editorial-italic text-gold">Feel Your Story.</span>
          </h2>

          <p className="font-serif italic text-base sm:text-lg text-muted font-light max-w-xl mx-auto">
            Discover seventeen handcrafted silhouettes woven from ancestral Sri Lankan memory for the modern Australian wardrobe.
          </p>

          <div className="pt-4">
            <Link href="/collection">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Explore Collection 01
              </Button>
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
        onUpdateQuantity={(id, size, delta) => {
          setCartItems((prev) =>
            prev
              .map((item) => {
                if (item.product.id === id && item.size === size) {
                  const newQty = item.quantity + delta;
                  return newQty > 0 ? { ...item, quantity: newQty } : null;
                }
                return item;
              })
              .filter(Boolean) as CartItem[]
          );
        }}
        onRemoveItem={(id, size) => {
          setCartItems((prev) =>
            prev.filter((item) => !(item.product.id === id && item.size === size))
          );
        }}
      />
    </main>
  );
}
