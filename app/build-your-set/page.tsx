"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ResponsiveImage from "@/components/ResponsiveImage";
import {
  Sparkles,
  ArrowRight,
  Check,
  Layers,
  Sun,
  Ruler,
  ShoppingBag,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import { getCart, subscribe } from "@/lib/cart";
import { ambientPlayer } from "@/lib/ambientSound";

export default function VirtualFitOnRoomPage() {
  const [isMuted, setIsMuted] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Early Access Form
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setCartItems(getCart());
    const unsub = subscribe(() => setCartItems(getCart()));
    return () => unsub();
  }, []);

  const toggleAudio = () => {
    if (ambientPlayer) setIsMuted(ambientPlayer.toggle());
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setBusy(true);
    setError("");

    try {
      const res = await fetch("/api/storefront/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save your email.");
      setSubmitted(true);
    } catch (err) {
      setError((err as Error).message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const totalCartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1F1E1D] selection:bg-[#C5A059] selection:text-white flex flex-col font-sans">
      {/* 1. NAVBAR */}
      <Navbar
        isMuted={isMuted}
        toggleAudio={toggleAudio}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="flex-1 pt-12 sm:pt-20 pb-20 sm:pb-32">
        {/* HERO HEADER */}
        <section className="max-w-5xl mx-auto px-5 sm:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/15 border border-gold/35 text-[#8E6E34] text-[11px] font-mono uppercase tracking-[0.25em] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#8E6E34]" />
            <span>Style Studio Innovation</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-[#1F1E1D] tracking-tight leading-[1.08] max-w-4xl mx-auto">
            The Virtual <span className="italic font-normal text-[#8E6E34]">Fit-On Room</span>
          </h1>

          <div className="inline-block px-3 py-1 rounded-full bg-[#1F1E1D] text-[#FAF7F2] text-[10px] font-mono uppercase tracking-[0.3em] font-medium">
            Coming Soon
          </div>

          <p className="text-base sm:text-lg font-cormorant italic text-charcoal/80 max-w-2xl mx-auto leading-relaxed">
            Experience the drape before the first stitch. A digital atelier merging Sri Lankan handloom artistry with silhouette draping precision.
          </p>

          <p className="text-xs sm:text-sm font-sans text-charcoal-subtle max-w-xl mx-auto leading-relaxed">
            We are tailoring a bespoke virtual fitting experience. Soon, you will be able to visualize how natural hand-spun cotton and raw linen flow together on your silhouette, mix and match separate tops and bottoms with zero guesswork, and preview styling in authentic natural daylight.
          </p>

          {/* VIP EARLY ACCESS WAITLIST */}
          <div className="max-w-md mx-auto pt-4">
            {submitted ? (
              <div className="p-5 rounded-3xl bg-gold/15 border border-gold/40 text-center space-y-2 shadow-sm">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold/25 text-[#8E6E34]">
                  <Check className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-lg text-[#1F1E1D] font-medium">
                  You&apos;re on the VIP Private Beta list
                </h3>
                <p className="text-xs text-charcoal-subtle font-sans leading-relaxed">
                  We will email <strong className="text-charcoal font-semibold">{email}</strong> as soon as the Virtual Fit-On Room opens its doors, along with an exclusive preview privilege.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch gap-2.5 p-1.5 rounded-2xl bg-paper-light border border-sand/60 shadow-paper-card">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email for private early access"
                    className="flex-1 bg-transparent px-4 py-3 text-xs sm:text-sm text-charcoal placeholder:text-charcoal-subtle/60 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={busy}
                    className="px-6 py-3 rounded-xl bg-charcoal hover:bg-black text-[#FAF7F2] text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:opacity-50 shrink-0 flex items-center justify-center gap-2"
                  >
                    <span>{busy ? "Securing Spot…" : "Request Early Access"}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gold" />
                  </button>
                </div>
                {error && <p className="text-xs text-red-600 font-sans">{error}</p>}
                <p className="text-[11px] text-charcoal-subtle/70 font-sans">
                  Exclusive early access • No spam • Unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </section>

        {/* VISUAL TEASER SHOWCASE */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
          <div className="relative rounded-3xl overflow-hidden border border-sand/60 shadow-2xl bg-[#EFE8DD]">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-sand/40">
              {/* Preview 1 */}
              <div className="relative aspect-[3/4] overflow-hidden group">
                <ResponsiveImage
                  src="/images/bindi-real/campaign-together.webp"
                  alt="Virtual Fit-on Room drape simulation"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 text-[#FAF7F2]">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold mb-1">
                    01 • True Draping
                  </span>
                  <h4 className="font-serif text-lg font-light leading-snug">
                    Natural Motion Simulation
                  </h4>
                  <p className="text-xs text-white/70 mt-1">
                    Witness how hand-loomed fibers drape with ease through hips and torso.
                  </p>
                </div>
              </div>

              {/* Preview 2 */}
              <div className="relative aspect-[3/4] overflow-hidden group">
                <ResponsiveImage
                  src="/images/campaign/blue.webp"
                  alt="Mix and match color harmony"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 text-[#FAF7F2]">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold mb-1">
                    02 • Coordinated Sets
                  </span>
                  <h4 className="font-serif text-lg font-light leading-snug">
                    Independent Silhouette Sizing
                  </h4>
                  <p className="text-xs text-white/70 mt-1">
                    Pair an AU 8 top with an AU 10 skirt effortlessly with live aesthetic scores.
                  </p>
                </div>
              </div>

              {/* Preview 3 */}
              <div className="relative aspect-[3/4] overflow-hidden group">
                <ResponsiveImage
                  src="/images/campaign/coast.webp"
                  alt="Natural daylight simulation"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 text-[#FAF7F2]">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold mb-1">
                    03 • Island Daylight
                  </span>
                  <h4 className="font-serif text-lg font-light leading-snug">
                    Botanical Dyes Under Real Light
                  </h4>
                  <p className="text-xs text-white/70 mt-1">
                    Switch between Melbourne afternoon sun and Galle Fort coastal light.
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Innovation Pill */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 px-3.5 py-1.5 rounded-full bg-paper/90 backdrop-blur-md border border-sand/50 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-charcoal shadow-md flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span>In Development • BINDY Lab</span>
            </div>
          </div>
        </section>

        {/* 3 ARCHITECTURAL PILLARS */}
        <section className="max-w-5xl mx-auto px-5 sm:px-8 pt-20 sm:pt-28">
          <div className="text-center space-y-3 mb-14">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8E6E34] font-semibold">
              The Architecture
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1F1E1D] font-light">
              Craft Meets Computer Vision
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-7 rounded-3xl bg-paper-light border border-sand/50 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-gold/15 border border-gold/30 flex items-center justify-center text-[#8E6E34]">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-[#1F1E1D] font-medium">
                Silhouette Draping
              </h3>
              <p className="text-xs font-sans text-charcoal/75 leading-relaxed">
                Precision physics calibrated for real hand-spun natural cotton, raw linen, and satin voile so you know exactly how each hem falls.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-paper-light border border-sand/50 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-gold/15 border border-gold/30 flex items-center justify-center text-[#8E6E34]">
                <Ruler className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-[#1F1E1D] font-medium">
                Split-Size Custom Sets
              </h3>
              <p className="text-xs font-sans text-charcoal/75 leading-relaxed">
                No two bodies are identical. Choose different sizing for tops and skirts, and preview them styled harmoniously as a complete look.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-paper-light border border-sand/50 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-gold/15 border border-gold/30 flex items-center justify-center text-[#8E6E34]">
                <Sun className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-[#1F1E1D] font-medium">
                True Ambient Lighting
              </h3>
              <p className="text-xs font-sans text-charcoal/75 leading-relaxed">
                Botanical tea dyes, sage washes, and cinnamon tints react dynamically to warm and cool light environments.
              </p>
            </div>
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION */}
        <section className="max-w-3xl mx-auto px-5 sm:px-8 pt-20 text-center space-y-6">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#1F1E1D] to-[#2B2927] text-[#FAF7F2] space-y-5 shadow-xl">
            <h3 className="font-serif text-2xl sm:text-3xl font-light">
              While our weavers &amp; engineers build the studio…
            </h3>
            <p className="text-xs sm:text-sm font-sans text-white/70 max-w-lg mx-auto leading-relaxed">
              Explore our current collection of artisan midi dresses, handloom blouses, and tailored coordinates available for immediate delivery across Australia &amp; Sri Lanka.
            </p>
            <div className="pt-2">
              <Link
                href="/collection"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gold hover:bg-[#B38F46] text-[#1F1E1D] text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-luxury hover:shadow-luxury-hover cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Explore Current Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <Footer />

      {/* CART DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
      />
    </div>
  );
}
