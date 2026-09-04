"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  MapPin,
  Heart,
  Leaf,
  ShieldCheck,
  Award,
  Calendar,
  Quote,
  CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import { getCart, saveCart } from "@/lib/cart";
import { ambientPlayer } from "@/lib/ambientSound";
import { FOUNDERS } from "@/data/founders";
import { CRAFT_PROCESS_STEPS, ETHICAL_PILLARS } from "@/data/craft";
import { PRESS_QUOTES } from "@/data/socialProof";
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

  const timelineMilestones = [
    {
      year: "2020",
      title: "The Seed in Two Continents",
      subtitle: "Colombo & Brisbane",
      desc: "Separated by ocean during global lockdowns, Dilrukshi in Colombo and her daughters Binadhi and Vinudhi in Brisbane dreamed of building a bridge between their ancestral home and their modern lives. The concept of 'Two Islands, One Thread' was born over long late-night video calls.",
    },
    {
      year: "2022",
      title: "Loom Revivals & Village Alliances",
      subtitle: "Western & Central Provinces",
      desc: "Dilrukshi spent months traveling through rural Sri Lankan weaving villages, partnering directly with master women weavers operating ancestral teak pit-looms. We pledged 1.8× fair living wages and funded the restoration of 14 heritage looms.",
    },
    {
      year: "2024",
      title: "Launch of Collection 01 • Serendipity",
      subtitle: "Australian Wardrobe Debut",
      desc: "Our inaugural capsule of nineteen handcrafted silhouettes launched across Australia. Featured in Vogue Australia and Broadsheet for its poetic storytelling and uncompromising slow-fashion integrity.",
    },
    {
      year: "Today",
      title: "Generational Heirlooms",
      subtitle: "Two Islands, Bound in Grace",
      desc: "With studios in both Brisbane and Colombo, BINDY remains an intimate, family-run atelier. Every limited edition piece continues to be cut, sewn, and numbered by hand.",
    },
  ];

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
                  BINDY was founded by three women — a mother and her two daughters — rooted in Colombo and blossoming in Brisbane. Frustrated by the frenetic obsolescence of global fast fashion, we returned to first principles: honest cotton, ancestral wooden looms, and silhouettes designed to be worn slowly and cherished for decades.
                </p>
                <p>
                  Every button is carved from organic mother-of-pearl or reclaimed coconut husk. Every seam is finished with couture dignity. We do not design for the trend cycle; we design for quiet, meaningful moments under the sun.
                </p>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <a href="#founders">
                  <Button variant="primary" size="md">
                    Meet the Founders
                  </Button>
                </a>
                <a href="#artisan-process">
                  <Button variant="outline" size="md">
                    Our Handloom Craft
                  </Button>
                </a>
              </div>
            </div>

            {/* Right: Evocative Location Image (5 cols) */}
            <div className="lg:col-span-5 relative aspect-[4/5] rounded-3xl overflow-hidden bg-paper shadow-luxury border border-sand/40">
              <img
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

      {/* 2. "TWO ISLANDS, ONE THREAD" INTERACTIVE TIMELINE */}
      <section className="py-24 sm:py-32 bg-paper border-b border-sand/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Journey"
            title="The Unfolding Timeline"
            italicWord="Timeline"
            description="From late-night calls across the Indian Ocean to a community of women wearing conscious handloom across Australia."
            align="center"
          />

          <div className="relative border-l-2 border-gold/40 ml-4 sm:ml-32 md:ml-48 space-y-12 sm:space-y-16 py-4">
            {timelineMilestones.map((m, idx) => (
              <div key={idx} className="relative pl-8 sm:pl-12">
                {/* Year Badge on left */}
                <div className="absolute -left-[45px] sm:-left-[120px] top-0 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-gold ring-4 ring-paper shrink-0" />
                  <span className="font-serif text-lg sm:text-2xl font-bold text-gold">
                    {m.year}
                  </span>
                </div>

                <div className="p-6 sm:p-8 rounded-3xl bg-paper-light border border-sand/40 shadow-sm space-y-2">
                  <span className="text-[10px] uppercase font-sans tracking-widest text-gold font-semibold">
                    {m.subtitle}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-charcoal font-medium">
                    {m.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-charcoal/85 leading-relaxed font-light">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FULL FOUNDER PROFILES & INTERVIEWS */}
      <section id="founders" className="py-24 sm:py-32 bg-paper-dark/60 border-b border-sand/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          <SectionHeading
            eyebrow="Three Women. One Vision."
            title="Meet Our Founders"
            italicWord="Founders"
            description="A mother and her two daughters uniting ancestral Sri Lankan manufacturing mastery with relaxed Australian lifestyle ease."
            align="center"
          />

          {FOUNDERS.map((founder, idx) => (
            <div
              key={founder.id}
              id={founder.id}
              className="p-8 sm:p-12 lg:p-16 rounded-3xl bg-paper-light border border-sand/40 shadow-paper-card scroll-mt-24"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
                {/* Portrait (4 cols) */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-paper-dark border border-sand/40 shadow-md">
                    <img
                      src={founder.image}
                      alt={founder.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 font-display text-4xl text-gold select-none">
                      {founder.monogram}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif text-2xl text-charcoal font-medium">
                      {founder.name}
                    </h3>
                    <p className="text-xs uppercase font-sans tracking-wider text-gold font-semibold mt-0.5">
                      {founder.role}
                    </p>
                    <p className="text-[11px] font-sans text-muted mt-0.5">
                      {founder.location}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-sand/30">
                    <span className="text-[10px] uppercase font-sans tracking-wider text-muted font-semibold block mb-2">
                      Specialist Focus
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {founder.focus.map((f, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-paper px-3 py-1 rounded-full border border-sand/40 text-charcoal/90"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Narrative Bio & In-Depth Q&A Interview (8 cols) */}
                <div className="lg:col-span-8 space-y-8">
                  {/* Quote */}
                  <blockquote className="font-editorial-italic text-xl sm:text-2xl text-charcoal font-light leading-relaxed border-l-2 border-gold/70 pl-5 py-1">
                    &ldquo;{founder.quote}&rdquo;
                  </blockquote>

                  {/* Long Bio Paragraphs */}
                  <div className="space-y-3 font-sans text-xs sm:text-sm text-charcoal/85 font-light leading-relaxed">
                    {founder.longBio.map((paragraph, pIdx) => (
                      <p key={pIdx}>{paragraph}</p>
                    ))}
                  </div>

                  {/* 3-Question Interview Spread */}
                  <div className="pt-6 border-t border-sand/30 space-y-5">
                    <h4 className="font-serif text-lg text-charcoal font-medium flex items-center gap-2">
                      <Quote className="w-4 h-4 text-gold" />
                      <span>In Conversation with {founder.name.split(" ")[0]}</span>
                    </h4>

                    <div className="space-y-4">
                      {founder.interview.map((item, qIdx) => (
                        <div
                          key={qIdx}
                          className="p-5 rounded-2xl bg-paper border border-sand/30 space-y-2"
                        >
                          <p className="font-serif italic text-sm font-semibold text-charcoal">
                            Q: {item.question}
                          </p>
                          <p className="font-sans text-xs sm:text-[13px] text-charcoal/80 font-light leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
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

      {/* 6. PRESS RECOGNITION STRIP */}
      <section className="py-20 bg-paper border-b border-sand/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[10px] font-sans uppercase tracking-[0.35em] text-gold font-semibold block">
              In The Press
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRESS_QUOTES.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-paper-light border border-sand/40 shadow-sm space-y-3"
              >
                <blockquote className="font-serif italic text-xs sm:text-sm text-charcoal leading-relaxed">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <div className="pt-2 border-t border-sand/30 flex items-center justify-between text-[11px] font-sans">
                  <span className="font-semibold text-gold uppercase tracking-wider">
                    {item.publication}
                  </span>
                  <span className="text-muted">{item.location}</span>
                </div>
              </div>
            ))}
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
            Discover nineteen handcrafted silhouettes woven from ancestral Sri Lankan memory for the modern Australian wardrobe.
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
