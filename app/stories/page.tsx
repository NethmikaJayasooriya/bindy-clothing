"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Compass, Sparkles, MapPin, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import { getCart } from "@/lib/cart";
import { ambientPlayer } from "@/lib/ambientSound";
import { STORIES, type StoryChapter } from "@/data/stories";
import { StoryCard, SectionHeading } from "@/components/ui";

export default function StoriesPage() {
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

      {/* HEADER HERO */}
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-24 px-4 sm:px-6 lg:px-8 bg-paper-dark border-b border-sand/40 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-[10px] font-sans uppercase tracking-[0.35em] text-gold font-semibold">
            <Compass className="w-3.5 h-3.5 text-gold" />
            <span>Narrative Archives</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-wide text-charcoal-rich leading-tight">
            Heritage <span className="font-editorial-italic text-gold">Stories</span>
          </h1>

          <p className="font-serif italic text-base sm:text-lg text-muted font-light max-w-2xl mx-auto leading-relaxed">
            Every garment in Collection 01 carries a fragment of Sri Lankan geography, temple architecture, and timeless memory into the modern Australian wardrobe.
          </p>
        </div>
      </section>

      {/* STORIES GRID */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {STORIES.map((story) => (
            <StoryCard
              key={story.id}
              id={story.id}
              number={story.number}
              title={story.title}
              subtitle={story.subtitle}
              quote={story.quote}
              image={story.image}
              colorPalette={story.colorPalette}
              elements={story.elements}
            />
          ))}
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
