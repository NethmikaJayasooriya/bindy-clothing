"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Sparkles, Clock, ArrowRight, Calendar, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import { getCart } from "@/lib/cart";
import { ambientPlayer } from "@/lib/ambientSound";
import { JOURNAL_ARTICLES, type JournalArticle } from "@/data/journal";
import { Button, SectionHeading } from "@/components/ui";

export default function JournalPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
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

  const categories = ["All", "Field Notes", "Artisan Voices", "Wardrobe Rituals", "Heritage"];

  const filteredArticles = activeCategory === "All"
    ? JOURNAL_ARTICLES
    : JOURNAL_ARTICLES.filter((a) => a.category === activeCategory);

  const featuredArticle = JOURNAL_ARTICLES[0];
  const gridArticles = filteredArticles.filter((a) => a.id !== featuredArticle.id || activeCategory !== "All");

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
            <BookOpen className="w-3.5 h-3.5 text-gold" />
            <span>Field Notes & Essays</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-wide text-charcoal-rich leading-tight">
            The BINDY <span className="font-editorial-italic text-gold">Journal</span>
          </h1>

          <p className="font-serif italic text-base sm:text-lg text-muted font-light max-w-2xl mx-auto leading-relaxed">
            Reflections on generational handloom, natural dye foraging, intentional living, and the dialogue between Colombo and Brisbane.
          </p>

          {/* Category Filter Pills */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-sans uppercase tracking-wider transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-gold text-charcoal font-bold shadow-sm"
                    : "bg-paper-light border border-sand/50 text-charcoal hover:border-gold"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 1. FEATURED HERO ESSAY (when 'All' is selected) */}
      {activeCategory === "All" && featuredArticle && (
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-sand/30">
          <div className="p-8 sm:p-12 rounded-3xl bg-paper-light border border-sand/40 shadow-paper-card grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 relative aspect-[16/10] rounded-2xl overflow-hidden bg-paper-dark">
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase tracking-wider text-gold font-semibold">
                Featured Essay
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-3 text-xs font-sans text-muted">
                <span>{featuredArticle.date}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gold" />
                  {featuredArticle.readTime}
                </span>
                <span>•</span>
                <span className="text-gold font-medium">{featuredArticle.category}</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-light leading-snug">
                {featuredArticle.title}
              </h2>

              <p className="font-sans text-xs sm:text-sm text-charcoal/80 font-light leading-relaxed">
                {featuredArticle.excerpt}
              </p>

              <div className="pt-3 border-t border-sand/30 flex items-center justify-between">
                <span className="text-xs font-sans text-muted">
                  By {featuredArticle.author}
                </span>
                <div className="inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-wider text-gold font-semibold">
                  <span>Read Essay</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. ARTICLES GRID */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gridArticles.map((article) => (
            <div
              key={article.id}
              className="p-6 sm:p-7 rounded-3xl bg-paper-light border border-sand/40 shadow-paper-card flex flex-col justify-between space-y-4 hover:border-gold/60 transition-colors"
            >
              <div className="space-y-4">
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-paper-dark">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-black/55 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider text-gold font-semibold">
                    {article.category}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-sans text-muted">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>

                  <h3 className="font-serif text-xl text-charcoal font-medium leading-snug">
                    {article.title}
                  </h3>

                  <p className="font-sans text-xs text-charcoal/80 font-light line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-sand/30 flex items-center justify-between text-[11px] font-sans">
                <span className="text-muted font-light">By {article.author}</span>
                <span className="text-gold uppercase tracking-wider font-semibold flex items-center gap-1">
                  <span>Read</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
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
