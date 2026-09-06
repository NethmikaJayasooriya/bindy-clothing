"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Sparkles, Filter, ChevronDown, ChevronRight, X, ArrowUpDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import ProductModal from "@/components/ProductModal";
import { getCart, addToCart } from "@/lib/cart";
import { ambientPlayer } from "@/lib/ambientSound";
import {
  PRODUCTS,
  type EnrichedProduct,
  type Product,
} from "@/data/products";
import { ProductCard, SectionHeading } from "@/components/ui";

const TAXONOMY_HIERARCHY = [
  {
    parent: "Tops",
    subs: ["Blouses & Shirts", "Crop Tops"],
  },
  {
    parent: "Bottoms",
    subs: ["Pants", "Skirts", "Shorts"],
  },
  {
    parent: "Dresses",
    subs: ["Mini", "Maxi", "Linen", "Floral", "Casual", "Formal"],
  },
  {
    parent: "Resort Wear",
    subs: [],
  },
];

const OCCASIONS_LIST = [
  "Beach & Coast",
  "Evening & Party",
  "Everyday Calm",
  "Garden & High Tea",
];

function CollectionContent() {
  const searchParams = useSearchParams();

  // Read initial params
  const paramParent = searchParams.get("parent");
  const paramSub = searchParams.get("sub");
  const paramOccasion = searchParams.get("occasion");
  const paramCollection = searchParams.get("collection");
  const paramNew = searchParams.get("filter") === "new";

  const [selectedParent, setSelectedParent] = useState<string | null>(paramParent);
  const [selectedSub, setSelectedSub] = useState<string | null>(paramSub);
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(paramOccasion);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(paramCollection);
  const [filterNewOnly, setFilterNewOnly] = useState<boolean>(paramNew);

  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [isMuted, setIsMuted] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync state if URL query params change
  useEffect(() => {
    setSelectedParent(searchParams.get("parent"));
    setSelectedSub(searchParams.get("sub"));
    setSelectedOccasion(searchParams.get("occasion"));
    setSelectedCollection(searchParams.get("collection"));
    setFilterNewOnly(searchParams.get("filter") === "new");
  }, [searchParams]);

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const toggleAudio = () => {
    if (!ambientPlayer) return;
    const muted = ambientPlayer.toggle();
    setIsMuted(muted);
  };

  const handleClearFilters = () => {
    setSelectedParent(null);
    setSelectedSub(null);
    setSelectedOccasion(null);
    setSelectedCollection(null);
    setFilterNewOnly(false);
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (filterNewOnly && p.badge !== "NEW") return false;
      if (selectedParent && p.parentCategory !== selectedParent) return false;
      if (selectedSub && p.subCategory !== selectedSub) return false;
      if (selectedOccasion && !p.occasions.includes(selectedOccasion)) return false;
      if (selectedCollection && p.collectionName !== selectedCollection) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.priceAud - b.priceAud;
      if (sortBy === "price-desc") return b.priceAud - a.priceAud;
      if (sortBy === "rating") return (b.reviews?.length || 0) - (a.reviews?.length || 0);
      return 0;
    });
  }, [selectedParent, selectedSub, selectedOccasion, selectedCollection, filterNewOnly, sortBy]);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const hasActiveFilters = Boolean(
    selectedParent || selectedSub || selectedOccasion || selectedCollection || filterNewOnly
  );

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#1F1E1D]">
      {/* NAVBAR */}
      <Navbar
        isMuted={isMuted}
        toggleAudio={toggleAudio}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* EDITORIAL HERO HEADER */}
      <section className="pt-32 pb-14 px-4 sm:px-6 lg:px-8 bg-[#F2ECE1]/60 border-b border-[#DCC7AF]/40 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.3em] text-[#C5A059] font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>ORIGINS &amp; SERENDIPITY</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1F1E1D] leading-tight">
            The Complete Collection
          </h1>

          <p className="font-serif italic text-base sm:text-lg text-[#78716A] max-w-2xl mx-auto leading-relaxed">
            Handcrafted silhouettes in lightweight cotton voile, organic handloom linen, and fluid recycled silk.
          </p>
        </div>
      </section>

      {/* MAIN CATALOGUE LAYOUT (SIDEBAR + GRID) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#DCC7AF]/40">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden px-4 py-2 bg-white border border-[#DCC7AF] rounded-full text-xs font-mono tracking-wider uppercase flex items-center space-x-2 text-[#1F1E1D]"
            >
              <Filter className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Filters {hasActiveFilters && "•"}</span>
            </button>
            <p className="text-xs text-[#78716A] font-mono">
              Showing <span className="font-semibold text-[#1F1E1D]">{filteredProducts.length}</span> pieces
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-[#78716A] uppercase tracking-wider hidden sm:inline">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-white border border-[#DCC7AF] rounded-xl text-xs font-sans text-[#1F1E1D] focus:outline-none focus:border-[#C5A059]"
            >
              <option value="featured">Featured Curations</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Most Loved / Reviews</option>
            </select>
          </div>
        </div>

        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-8 bg-white/60 p-3.5 rounded-2xl border border-[#DCC7AF]/40">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716A] mr-1">
              Active Filters:
            </span>
            {filterNewOnly && (
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-[#C5A059]/15 text-[#1F1E1D] text-xs font-medium border border-[#C5A059]/30">
                <span>New Arrivals</span>
                <button onClick={() => setFilterNewOnly(false)} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedParent && (
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-white text-[#1F1E1D] text-xs font-medium border border-[#DCC7AF]">
                <span>Category: {selectedParent}</span>
                <button onClick={() => { setSelectedParent(null); setSelectedSub(null); }} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedSub && (
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-white text-[#1F1E1D] text-xs font-medium border border-[#DCC7AF]">
                <span>Sub: {selectedSub}</span>
                <button onClick={() => setSelectedSub(null)} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedOccasion && (
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-white text-[#1F1E1D] text-xs font-medium border border-[#DCC7AF]">
                <span>Occasion: {selectedOccasion}</span>
                <button onClick={() => setSelectedOccasion(null)} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedCollection && (
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-white text-[#1F1E1D] text-xs font-medium border border-[#DCC7AF]">
                <span>Collection: {selectedCollection}</span>
                <button onClick={() => setSelectedCollection(null)} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={handleClearFilters}
              className="text-xs font-mono text-[#C5A059] hover:underline uppercase tracking-wider ml-auto"
            >
              Clear All
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 5.1 FILTER SIDEBAR (DESKTOP + MOBILE DRAWER) */}
          <aside
            className={`space-y-8 ${
              mobileFilterOpen
                ? "fixed inset-0 z-50 bg-[#FAF7F2] p-6 overflow-y-auto block"
                : "hidden lg:block"
            }`}
          >
            {mobileFilterOpen && (
              <div className="flex items-center justify-between pb-4 border-b border-[#DCC7AF] lg:hidden mb-4">
                <h3 className="font-serif text-xl text-[#1F1E1D]">Filter Wardrobe</h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-full border border-[#DCC7AF]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* 1. NEW ARRIVALS */}
            <div>
              <button
                type="button"
                onClick={() => setFilterNewOnly(!filterNewOnly)}
                className={`w-full text-left py-2.5 px-3 rounded-xl border text-xs font-mono uppercase tracking-widest transition-all ${
                  filterNewOnly
                    ? "bg-[#C5A059] text-white border-[#C5A059] font-bold shadow-sm"
                    : "bg-white border-[#DCC7AF]/60 text-[#1F1E1D] hover:border-[#C5A059]"
                }`}
              >
                ✦ New Arrivals
              </button>
            </div>

            {/* 2. CATEGORY TAXONOMY HIERARCHY */}
            <div className="bg-white border border-[#DCC7AF]/60 rounded-3xl p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#78716A] font-semibold">
                  Categories
                </h3>
                {selectedParent && (
                  <button
                    onClick={() => { setSelectedParent(null); setSelectedSub(null); }}
                    className="text-[10px] font-mono text-[#C5A059] hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => { setSelectedParent(null); setSelectedSub(null); }}
                  className={`w-full text-left text-xs font-medium transition-colors ${
                    !selectedParent ? "text-[#C5A059] font-bold" : "text-[#78716A] hover:text-[#1F1E1D]"
                  }`}
                >
                  All Pieces ({PRODUCTS.length})
                </button>

                {TAXONOMY_HIERARCHY.map((group) => {
                  const isParentActive = selectedParent === group.parent;
                  return (
                    <div key={group.parent} className="border-t border-[#DCC7AF]/20 pt-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedParent === group.parent) {
                            setSelectedParent(null);
                            setSelectedSub(null);
                          } else {
                            setSelectedParent(group.parent);
                            setSelectedSub(null);
                          }
                        }}
                        className={`w-full text-left flex items-center justify-between text-xs font-serif text-sm transition-colors ${
                          isParentActive ? "text-[#C5A059] font-medium" : "text-[#1F1E1D] hover:text-[#C5A059]"
                        }`}
                      >
                        <span>{group.parent}</span>
                        {group.subs.length > 0 && (
                          <ChevronRight
                            className={`w-3.5 h-3.5 transition-transform ${
                              isParentActive ? "rotate-90 text-[#C5A059]" : "text-[#78716A]"
                            }`}
                          />
                        )}
                      </button>

                      {/* Subcategory List */}
                      {isParentActive && group.subs.length > 0 && (
                        <div className="pl-3.5 pt-2 pb-1 space-y-1.5 text-xs">
                          {group.subs.map((sub) => {
                            const isSubActive = selectedSub === sub;
                            return (
                              <button
                                key={sub}
                                type="button"
                                onClick={() => setSelectedSub(isSubActive ? null : sub)}
                                className={`block w-full text-left py-1 text-xs transition-colors ${
                                  isSubActive
                                    ? "text-[#C5A059] font-bold"
                                    : "text-[#78716A] hover:text-[#1F1E1D]"
                                }`}
                              >
                                • {sub}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. OCCASION CROSS-CUTTING TAGS */}
            <div className="bg-white border border-[#DCC7AF]/60 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#78716A] font-semibold">
                  Occasion
                </h3>
                {selectedOccasion && (
                  <button
                    onClick={() => setSelectedOccasion(null)}
                    className="text-[10px] font-mono text-[#C5A059] hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {OCCASIONS_LIST.map((occ) => {
                  const isActive = selectedOccasion === occ;
                  return (
                    <button
                      key={occ}
                      type="button"
                      onClick={() => setSelectedOccasion(isActive ? null : occ)}
                      className={`w-full text-left py-1.5 px-3 rounded-lg text-xs transition-colors flex items-center justify-between ${
                        isActive
                          ? "bg-[#C5A059]/15 text-[#1F1E1D] font-semibold border border-[#C5A059]/40"
                          : "text-[#78716A] hover:bg-[#FAF7F2] hover:text-[#1F1E1D]"
                      }`}
                    >
                      <span>{occ}</span>
                      {isActive && <span className="text-[#C5A059] text-xs">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. COLLECTION TAGS */}
            <div className="bg-white border border-[#DCC7AF]/60 rounded-3xl p-6 shadow-sm space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#78716A] font-semibold">
                Collection
              </h3>
              <button
                type="button"
                onClick={() =>
                  setSelectedCollection(selectedCollection === "Serendipity" ? null : "Serendipity")
                }
                className={`w-full text-left py-2 px-3 rounded-lg text-xs transition-colors flex items-center justify-between ${
                  selectedCollection === "Serendipity"
                    ? "bg-[#C5A059]/15 text-[#1F1E1D] font-semibold border border-[#C5A059]/40"
                    : "text-[#78716A] hover:bg-[#FAF7F2] hover:text-[#1F1E1D]"
                }`}
              >
                <span>Serendipity (Collection 01)</span>
                {selectedCollection === "Serendipity" && (
                  <span className="text-[#C5A059] text-xs">✓</span>
                )}
              </button>
            </div>

            {mobileFilterOpen && (
              <div className="pt-4 lg:hidden">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-3.5 bg-[#1F1E1D] text-white rounded-full text-xs font-mono tracking-widest uppercase"
                >
                  Apply &amp; View ({filteredProducts.length} Pieces)
                </button>
              </div>
            )}
          </aside>

          {/* PRODUCT GRID */}
          <div className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            ) : (
              /* EMPTY STATE IN POETIC BRAND VOICE */
              <div className="py-24 text-center space-y-5 bg-white border border-[#DCC7AF]/50 rounded-3xl p-8">
                <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#DCC7AF] flex items-center justify-center mx-auto text-[#C5A059]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-2xl text-[#1F1E1D]">
                  Your story hasn&apos;t started yet.
                </h3>
                <p className="text-xs text-[#78716A] max-w-sm mx-auto leading-relaxed">
                  No pieces matched this exact combination of filters. Explore our complete collection or reset filters to discover all silhouettes.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-6 py-3 bg-[#1F1E1D] text-white rounded-full text-xs font-mono tracking-widest uppercase hover:bg-[#C5A059] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <Footer />

      {/* QUICK VIEW MODAL */}
      <ProductModal
        product={quickViewProduct as any}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(p, size) => {
          addToCart(p, size);
          setCartItems(getCart());
          setIsCartOpen(true);
        }}
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
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center font-mono text-xs text-[#78716A]">Loading Collection...</div>}>
      <CollectionContent />
    </Suspense>
  );
}
