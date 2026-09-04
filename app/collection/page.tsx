"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Sparkles, Filter, ArrowUpDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import ProductModal from "@/components/ProductModal";
import { getCart, addToCart } from "@/lib/cart";
import { ambientPlayer } from "@/lib/ambientSound";
import {
  PRODUCTS,
  CATEGORIES,
  DESTINATIONS,
  type Category,
  type Destination,
  type Product,
} from "@/data/products";
import { ProductCard, SectionHeading } from "@/components/ui";

function CollectionContent() {
  const searchParams = useSearchParams();
  const initialJourney = (searchParams.get("journey") as Destination) || "All";

  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [activeJourney, setActiveJourney] = useState<Destination | "All">(initialJourney);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

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

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCat = activeCategory === "All" || p.category === activeCategory;
      const matchJourney = activeJourney === "All" || p.destinations.includes(activeJourney);
      return matchCat && matchJourney;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.priceAud - b.priceAud;
      if (sortBy === "price-desc") return b.priceAud - a.priceAud;
      if (sortBy === "rating") return (b.reviews?.length || 0) - (a.reviews?.length || 0);
      return 0;
    });
  }, [activeCategory, activeJourney, sortBy]);

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

      {/* HERO HEADER */}
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-24 px-4 sm:px-6 lg:px-8 bg-paper-dark border-b border-sand/40 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-[10px] font-sans uppercase tracking-[0.35em] text-gold font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>Collection 01 • Serendipity</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-wide text-charcoal-rich leading-tight">
            The Complete <span className="font-editorial-italic text-gold">Wardrobe</span>
          </h1>

          <p className="font-serif italic text-base sm:text-lg text-muted font-light max-w-2xl mx-auto leading-relaxed">
            Handcrafted silhouettes in lightweight cotton voile, organic linen, and fluid recycled silk.
          </p>

          {/* Category Filter Pills */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-2.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-sans uppercase tracking-wider transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-gold text-charcoal font-bold shadow-sm scale-102"
                    : "bg-paper-light border border-sand/50 text-charcoal hover:border-gold"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CONTROLS BAR: Journey Filter + Sorting */}
      <section className="py-4 border-b border-sand/40 bg-paper-light sticky top-16 z-30 shadow-sm px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Journey Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar text-xs font-sans">
            <span className="text-[10px] uppercase tracking-wider text-muted font-semibold shrink-0">
              Journey:
            </span>
            <button
              type="button"
              onClick={() => setActiveJourney("All")}
              className={`px-3 py-1 rounded-full text-[11px] font-sans uppercase tracking-wider transition-colors shrink-0 ${
                activeJourney === "All"
                  ? "bg-charcoal text-paper-light font-medium"
                  : "bg-paper text-charcoal/80 border border-sand/40 hover:border-gold"
              }`}
            >
              All
            </button>
            {DESTINATIONS.map((d) => (
              <button
                key={d.key}
                type="button"
                onClick={() => setActiveJourney(d.key)}
                className={`px-3 py-1 rounded-full text-[11px] font-sans uppercase tracking-wider transition-colors shrink-0 ${
                  activeJourney === d.key
                    ? "bg-charcoal text-paper-light font-medium"
                    : "bg-paper text-charcoal/80 border border-sand/40 hover:border-gold"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown & Count */}
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 text-xs font-sans">
            <span className="text-muted text-[11px]">
              Showing {filteredProducts.length} pieces
            </span>

            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-gold" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-paper border border-sand/50 rounded-full px-3 py-1.5 text-xs font-sans text-charcoal focus:outline-none focus:border-gold"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Most Loved</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS GRID */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
              onQuickAdd={(p, s) => addToCart(p, s, 1)}
              stockStatus={product.inventoryStatus}
              stockText={product.inventoryStatus === "low_stock" ? "Low Stock" : undefined}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-24 max-w-md mx-auto space-y-3">
            <p className="font-serif italic text-xl text-charcoal">
              No pieces match your selected journey and category filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory("All");
                setActiveJourney("All");
              }}
              className="text-xs font-sans uppercase tracking-wider text-gold underline underline-offset-4"
            >
              Reset all filters
            </button>
          </div>
        )}
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

export default function CollectionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-paper flex items-center justify-center">
          <div className="font-serif italic text-lg text-muted">Loading collection...</div>
        </div>
      }
    >
      <CollectionContent />
    </Suspense>
  );
}
