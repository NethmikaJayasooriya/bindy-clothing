"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
  Compass,
  MapPin,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Palette,
  Check,
  ShoppingBag,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import ProductModal from "@/components/ProductModal";
import { getCart, addToCart } from "@/lib/cart";
import { ambientPlayer } from "@/lib/ambientSound";
import { getStory, STORIES } from "@/data/stories";
import { PRODUCTS, type Product } from "@/data/products";
import { ProductCard, Button } from "@/components/ui";

export default function StoryDetailPage() {
  const params = useParams();
  const storyId = params?.id as string;
  const story = getStory(storyId);

  const [isMuted, setIsMuted] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const toggleAudio = () => {
    if (!ambientPlayer) return;
    const muted = ambientPlayer.toggle();
    setIsMuted(muted);
  };

  if (!story) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-4 text-center">
        <div className="space-y-4">
          <h1 className="font-serif text-3xl">Story Chapter Not Found</h1>
          <Link href="/stories" className="text-gold font-sans uppercase text-xs tracking-wider">
            ← Return to Heritage Stories
          </Link>
        </div>
      </div>
    );
  }

  // Find products associated with this story
  const inspiredProducts = PRODUCTS.filter((p) =>
    story.inspiredProductIds.includes(p.id)
  );

  // Find next and previous stories for footer navigation
  const currentIndex = STORIES.findIndex((s) => s.id === story.id);
  const prevStory = currentIndex > 0 ? STORIES[currentIndex - 1] : null;
  const nextStory = currentIndex < STORIES.length - 1 ? STORIES[currentIndex + 1] : null;

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

      {/* BREADCRUMB */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32">
        <nav className="text-[11px] font-sans tracking-wide text-muted flex items-center gap-2">
          <Link href="/" className="hover:text-gold">Home</Link>
          <span>/</span>
          <Link href="/stories" className="hover:text-gold">Heritage Stories</Link>
          <span>/</span>
          <span className="text-charcoal font-medium">{story.title}</span>
        </nav>
      </div>

      {/* 1. EDITORIAL CHAPTER HERO */}
      <section className="pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-4xl space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 text-[11px] font-sans uppercase tracking-[0.3em] text-gold font-semibold">
            <MapPin className="w-3.5 h-3.5 text-gold" />
            <span>Chapter {story.number} • {story.subtitle}</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-charcoal-rich leading-tight">
            {story.title}
          </h1>

          <p className="text-xs font-mono text-muted tracking-wider">
            Coordinates: {story.coordinates} · {story.location}
          </p>
        </div>

        {/* Hero Visual Frame */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden bg-paper-dark border border-sand/40 shadow-2xl mb-16">
          <img
            src={story.image}
            alt={story.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-white max-w-2xl">
            <blockquote className="font-editorial-italic text-2xl sm:text-3xl text-white/95 font-light leading-snug">
              &ldquo;{story.quote}&rdquo;
            </blockquote>
          </div>
        </div>

        {/* 2. NARRATIVE ESSAY & PALETTE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-start">
          {/* Main Essay (8 cols) */}
          <div className="lg:col-span-8 space-y-6 font-sans text-sm sm:text-base text-charcoal/85 font-light leading-relaxed">
            {story.longNarrative.map((p, idx) => (
              <p key={idx} className={idx === 0 ? "text-base sm:text-lg text-charcoal leading-relaxed font-normal" : ""}>
                {p}
              </p>
            ))}

            {/* Artisan Technique Box */}
            <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-paper-light border border-sand/40 space-y-2">
              <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-gold font-semibold block">
                Artisan Handloom Technique
              </span>
              <h4 className="font-serif text-lg text-charcoal font-medium">
                Living Textile Architecture
              </h4>
              <p className="text-xs sm:text-[13px] font-sans text-charcoal/80 font-light leading-relaxed">
                {story.artisanTechnique}
              </p>
            </div>
          </div>

          {/* Sidebar: Palette & Design Motifs (4 cols) */}
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-24">
            {/* Palette breakdown */}
            <div className="p-6 rounded-3xl bg-paper-light border border-sand/40 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-wider text-charcoal font-semibold">
                <Palette className="w-4 h-4 text-gold" />
                <span>Color Story</span>
              </div>

              <div className="space-y-3">
                {story.colorPalette.map((col, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span
                      className="w-7 h-7 rounded-full border border-sand/60 shrink-0 shadow-sm"
                      style={{ backgroundColor: col.hex }}
                    />
                    <div>
                      <span className="text-xs font-sans font-medium text-charcoal block">
                        {col.name}
                      </span>
                      <span className="text-[10px] font-sans text-muted font-light">
                        {col.note}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Design elements */}
            <div className="p-6 rounded-3xl bg-paper-light border border-sand/40 space-y-3 shadow-sm">
              <span className="text-[10px] font-sans uppercase tracking-wider text-muted font-semibold block">
                Design Motifs
              </span>
              <div className="flex flex-wrap gap-2">
                {story.elements.map((el, i) => (
                  <span
                    key={i}
                    className="text-xs font-sans px-3 py-1 rounded-full bg-gold/15 text-charcoal border border-gold/30 font-medium"
                  >
                    {el}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INSPIRED SILHOUETTES */}
      {inspiredProducts.length > 0 && (
        <section className="py-20 sm:py-24 bg-paper-dark border-t border-sand/40 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
              <span className="text-[10px] font-sans uppercase tracking-[0.35em] text-gold font-semibold block">
                Garments Born from this Chapter
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-charcoal-rich font-light">
                Shop the Silhouette
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {inspiredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onQuickView={(prod) => setQuickViewProduct(prod)}
                  onQuickAdd={(prod, s) => addToCart(prod, s, 1)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. CHAPTER PAGINATION FOOTER */}
      <section className="py-12 border-t border-sand/40 bg-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {prevStory ? (
            <Link
              href={`/stories/${prevStory.id}`}
              className="flex items-center gap-2 text-xs font-sans uppercase tracking-wider text-charcoal hover:text-gold transition-colors font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Chapter {prevStory.number}: {prevStory.title}</span>
            </Link>
          ) : (
            <div />
          )}

          <Link
            href="/stories"
            className="text-xs font-sans uppercase tracking-widest text-muted hover:text-charcoal"
          >
            All Chapters
          </Link>

          {nextStory ? (
            <Link
              href={`/stories/${nextStory.id}`}
              className="flex items-center gap-2 text-xs font-sans uppercase tracking-wider text-charcoal hover:text-gold transition-colors font-semibold"
            >
              <span>Chapter {nextStory.number}: {nextStory.title}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </section>

      {/* FOOTER */}
      <Footer />

      {/* QUICK VIEW MODAL */}
      <ProductModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(p, s) => addToCart(p, s, 1)}
      />

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
