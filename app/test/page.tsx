"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ExternalLink, ArrowLeft, FlaskConical } from "lucide-react";
import { getCart, saveCart } from "@/lib/cart";
import { type Product } from "@/data/products";
import SplashScreen from "@/components/SplashScreen";
import Navbar from "@/components/Navbar";
import DepthFlipHero from "@/components/DepthFlipHero";
import HeroJacquemusKinetic from "@/components/heroes/HeroJacquemusKinetic";
import HeroLoeweCarousel from "@/components/heroes/HeroLoeweCarousel";
import HeroLemaireSplit from "@/components/heroes/HeroLemaireSplit";
import HeroCraftCurtain from "@/components/heroes/HeroCraftCurtain";
import HeroShopHotspot from "@/components/heroes/HeroShopHotspot";
import HeroStyleControlSection from "@/components/home/HeroStyleControlSection";
import HeritageTicker from "@/components/HeritageTicker";
import TrustStrip from "@/components/home/TrustStrip";
import SpotlightSection from "@/components/home/SpotlightSection";
import FlashArchiveSection from "@/components/home/FlashArchiveSection";
import FlashDiscountRibbon from "@/components/home/FlashDiscountRibbon";
import BrowseSection from "@/components/home/BrowseSection";
import ShopTheLookSection from "@/components/home/ShopTheLookSection";
import VerifiedReviewsSellingSection from "@/components/home/VerifiedReviewsSellingSection";
import JourneySignup from "@/components/home/JourneySignup";
import FilmModal from "@/components/home/FilmModal";
import ProductModal from "@/components/ProductModal";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { ambientPlayer } from "@/lib/ambientSound";
import type { Destination } from "@/data/products";

export default function TestHomePage() {
  const [heroStyle, setHeroStyle] = useState<number>(1);
  const [showSplash, setShowSplash] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isFilmModalOpen, setIsFilmModalOpen] = useState(false);
  const [selectedJourney, setSelectedJourney] = useState<Destination | "All">("All");
  const [showStickyMobile, setShowStickyMobile] = useState(false);
  const [isHeroOffscreen, setIsHeroOffscreen] = useState(false);

  const handleSelectHeroStyle = (style: number) => {
    setHeroStyle(style);
    if (typeof window !== "undefined") {
      localStorage.setItem("bindy_test_hero_style", style.toString());
      const url = new URL(window.location.href);
      url.searchParams.set("hero", style.toString());
      window.history.replaceState({}, "", url.toString());
    }
  };

  // Sync heroStyle from URL query or localStorage on mount & keyboard 1-6 toggle
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const queryStyle = urlParams.get("hero");
      if (queryStyle) {
        const parsed = parseInt(queryStyle, 10);
        if (parsed >= 1 && parsed <= 6) {
          setHeroStyle(parsed);
        }
      } else {
        const saved = localStorage.getItem("bindy_test_hero_style");
        if (saved) {
          const parsed = parseInt(saved, 10);
          if (parsed >= 1 && parsed <= 6) {
            setHeroStyle(parsed);
          }
        }
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (
          document.activeElement?.tagName === "INPUT" ||
          document.activeElement?.tagName === "TEXTAREA"
        ) {
          return;
        }
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= 6) {
          handleSelectHeroStyle(num);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, []);

  // Track scroll position for sticky mobile CTA bar & offscreen hero deactivation
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking && typeof window !== "undefined") {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const h = window.innerHeight;
          const shouldSticky = scrollY > h * 0.7;
          const offscreen = scrollY > h * 1.05;
          setShowStickyMobile((prev) => (prev !== shouldSticky ? shouldSticky : prev));
          setIsHeroOffscreen((prev) => (prev !== offscreen ? offscreen : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hydrate the cart from localStorage
  const firstPersist = useRef(true);
  useEffect(() => {
    setCartItems(getCart());
  }, []);
  useEffect(() => {
    if (firstPersist.current) {
      firstPersist.current = false;
      return;
    }
    saveCart(cartItems);
  }, [cartItems]);

  // Audio Toggle
  const toggleAudio = () => {
    if (!ambientPlayer) return;
    const muted = ambientPlayer.toggle();
    setIsMuted(muted);
  };

  // Cart operations
  const handleAddToCart = (product: Product, size: string) => {
    if (!size) return;
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.size === size
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, size, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, size: string, delta: number) => {
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
  };

  const handleRemoveItem = (id: string, size: string) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.product.id === id && item.size === size))
    );
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="relative min-h-screen bg-paper text-charcoal selection:bg-gold selection:text-white">
      {/* 0. TESTING SANDBOX BANNER */}
      <div className="fixed top-2.5 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        <div className="bg-[#1F1E1D]/95 text-white backdrop-blur-xl border border-[#C5A059]/60 px-4 py-1.5 rounded-full text-xs font-mono shadow-2xl flex items-center gap-2.5 select-none">
          <span className="flex items-center gap-1.5 text-[#C5A059] font-bold">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>TESTING SANDBOX</span>
          </span>
          <span className="text-white/40">•</span>
          <span className="text-white/80 hidden sm:inline">Route: /test</span>
          <span className="text-white/40 hidden sm:inline">•</span>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-[#C5A059] hover:underline font-semibold ml-1"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Live Home</span>
          </Link>
        </div>
      </div>

      {/* 1. SPLASH SCREEN (Disabled on test route for immediate inspection) */}
      {showSplash && (
        <SplashScreen
          onComplete={() => {
            setShowSplash(false);
          }}
        />
      )}

      {/* 2. NAVBAR */}
      <Navbar
        isMuted={isMuted}
        toggleAudio={toggleAudio}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 3. HERO (SECTION 1) — Dynamically switched between 6 Luxury Styles */}
      <div
        className={`fixed inset-0 h-screen z-0 ${
          isHeroOffscreen ? "invisible pointer-events-none" : "visible pointer-events-auto"
        }`}
        aria-hidden={isHeroOffscreen}
      >
        {heroStyle === 1 && (
          <DepthFlipHero
            onExploreCollection={() => {
              const el = document.getElementById("browse-collection");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            onWatchFilm={() => setIsFilmModalOpen(true)}
            isMuted={isMuted}
            toggleAudio={toggleAudio}
          />
        )}
        {heroStyle === 2 && (
          <HeroJacquemusKinetic
            onExploreCollection={() => {
              const el = document.getElementById("browse-collection");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            onWatchFilm={() => setIsFilmModalOpen(true)}
            isMuted={isMuted}
            toggleAudio={toggleAudio}
          />
        )}
        {heroStyle === 3 && (
          <HeroLoeweCarousel
            onExploreCollection={() => {
              const el = document.getElementById("browse-collection");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            onWatchFilm={() => setIsFilmModalOpen(true)}
            isMuted={isMuted}
            toggleAudio={toggleAudio}
          />
        )}
        {heroStyle === 4 && (
          <HeroLemaireSplit
            onExploreCollection={() => {
              const el = document.getElementById("browse-collection");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            onWatchFilm={() => setIsFilmModalOpen(true)}
            isMuted={isMuted}
            toggleAudio={toggleAudio}
          />
        )}
        {heroStyle === 5 && (
          <HeroCraftCurtain
            onExploreCollection={() => {
              const el = document.getElementById("browse-collection");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            onWatchFilm={() => setIsFilmModalOpen(true)}
            isMuted={isMuted}
            toggleAudio={toggleAudio}
          />
        )}
        {heroStyle === 6 && (
          <HeroShopHotspot
            onExploreCollection={() => {
              const el = document.getElementById("browse-collection");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            onWatchFilm={() => setIsFilmModalOpen(true)}
            onAddToCart={handleAddToCart}
            onQuickView={(prod) => setQuickViewProduct(prod)}
            isMuted={isMuted}
            toggleAudio={toggleAudio}
          />
        )}
      </div>

      {/* Spacer to dock flush at bottom edge of hero */}
      <div className="h-[calc(100dvh-52px)] sm:h-[calc(100vh-58px)]" aria-hidden />

      {/* Everything below rises up over the fixed hero in 11 sharp modules */}
      <div className="relative z-10 bg-paper shadow-[0_-20px_50px_rgba(0,0,0,0.15)]">
        {/* HERITAGE TICKER */}
        <HeritageTicker />

        {/* SECTION 2: TRUST / VALUE STRIP */}
        <TrustStrip />

        {/* STYLE CHANGING SECTION: HERO & DESIGN LAB CONTROL */}
        <HeroStyleControlSection
          currentStyle={heroStyle}
          onSelectStyle={handleSelectHeroStyle}
          onScrollToHero={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />

        {/* SECTION 5: BROWSE BY PIECE (grid, filter pills, micro-badges, load more) */}
        <BrowseSection
          onQuickView={(prod) => setQuickViewProduct(prod)}
          onAddToCart={handleAddToCart}
          selectedJourney={selectedJourney}
          onClearJourney={() => setSelectedJourney("All")}
        />

        {/* ELEGANT DIVIDER BETWEEN BROWSE AND SPOTLIGHT */}
        <ScrollReveal>
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <hr className="border-t border-sand/40 my-8 sm:my-12" />
          </div>
        </ScrollReveal>

        {/* SECTION 3: THIS WEEK'S SPOTLIGHT (Curated Top Silhouettes + 1-Tap Size Add) */}
        <SpotlightSection
          onSelectProduct={(prod) => setQuickViewProduct(prod)}
          onAddToCart={handleAddToCart}
        />

        {/* SECTION 4: SHOP THE LOOK / EDITORIAL STYLING HOTSPOTS (AOV Bundle Booster) */}
        <ShopTheLookSection
          onQuickView={(prod) => setQuickViewProduct(prod)}
          onAddToCart={handleAddToCart}
        />

        {/* DYNAMIC DISCOUNT INFINITE RIBBON */}
        <ScrollReveal>
          <FlashDiscountRibbon />
        </ScrollReveal>

        {/* SECTION 5: LIMITED 24-HOUR ARCHIVE WINDOW (Obsidian Private Vault) */}
        <FlashArchiveSection
          onQuickView={(prod) => setQuickViewProduct(prod)}
          onAddToCart={handleAddToCart}
        />

        {/* BELOW-THE-FOLD SECTIONS (High-Performance content-visibility: auto) */}
        <div className="content-auto">
          {/* SECTION 6: LOVED ACROSS AUSTRALIA — VERIFIED REVIEWS THAT SELL */}
          <VerifiedReviewsSellingSection
            onQuickView={(prod) => setQuickViewProduct(prod)}
            onAddToCart={handleAddToCart}
          />

          {/* SECTION 7: VIP FIRST-ORDER PRIVILEGE (Instant 10% Off Activation) */}
          <ScrollReveal>
            <JourneySignup />
          </ScrollReveal>

          {/* SECTION 11: FOOTER (full sitemap) */}
          <ScrollReveal>
            <Footer />
          </ScrollReveal>
        </div>
      </div>

      {/* FILM MODAL */}
      <FilmModal
        isOpen={isFilmModalOpen}
        onClose={() => setIsFilmModalOpen(false)}
      />

      {/* PRODUCT QUICK VIEW MODAL */}
      <ProductModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* CART DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      {/* STICKY MOBILE CONVERSION BAR */}
      <AnimatePresence>
        {showStickyMobile && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-white/95 backdrop-blur-md border-t border-[#DCC7AF]/80 p-3 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center justify-between gap-3 shadow-[0_-8px_30px_rgba(0,0,0,0.1)]"
          >
            <div className="min-w-0">
              <p className="font-serif text-xs font-semibold text-[#1F1E1D] truncate">
                Serendipity Collection
              </p>
              <p className="text-[10px] font-mono text-[#78716A]">
                Ethical Handloom
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("browse-collection");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-4 py-2 rounded-full bg-[#B86B4B] hover:bg-[#9B5538] text-white font-mono text-xs uppercase tracking-wider font-semibold shadow-md active:scale-95 transition-all"
              >
                Shop Now
              </button>
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-full bg-[#FAF7F2] border border-[#DCC7AF] text-[#1F1E1D] shadow-sm hover:border-[#B86B4B] transition-colors"
                aria-label="Open Shopping Bag"
              >
                <ShoppingBag className="w-4 h-4 text-[#B86B4B]" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#1F1E1D] text-white text-[9px] font-mono flex items-center justify-center font-bold">
                    {totalCartCount}
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
