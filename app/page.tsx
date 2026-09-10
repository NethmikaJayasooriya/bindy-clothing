"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { getCart, saveCart } from "@/lib/cart";
import { type Product } from "@/data/products";
import SplashScreen from "@/components/SplashScreen";
import Navbar from "@/components/Navbar";
import CinematicHero from "@/components/CinematicHero";
import HeritageTicker from "@/components/HeritageTicker";
import TrustStrip from "@/components/home/TrustStrip";
import SpotlightSection from "@/components/home/SpotlightSection";
import FlashArchiveSection from "@/components/home/FlashArchiveSection";
import FlashDiscountRibbon from "@/components/home/FlashDiscountRibbon";
import CapsuleWardrobeSection from "@/components/home/CapsuleWardrobeSection";
import JourneyTiles from "@/components/home/JourneyTiles";
import BrowseSection from "@/components/home/BrowseSection";
import StoriesSection from "@/components/home/StoriesSection";
import FoundersSection from "@/components/home/FoundersSection";
import MaterialsSection from "@/components/home/MaterialsSection";
import SocialProofStrip from "@/components/home/SocialProofStrip";
import JourneySignup from "@/components/home/JourneySignup";
import FilmModal from "@/components/home/FilmModal";
import ProductModal from "@/components/ProductModal";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { ambientPlayer } from "@/lib/ambientSound";
import type { Destination } from "@/data/products";

export default function Home() {
  const [showSplash, setShowSplash] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isFilmModalOpen, setIsFilmModalOpen] = useState(false);
  const [selectedJourney, setSelectedJourney] = useState<Destination | "All">("All");
  const [showStickyMobile, setShowStickyMobile] = useState(false);

  // Track scroll position for sticky mobile CTA bar
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        setShowStickyMobile(window.scrollY > window.innerHeight * 0.7);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if splash screen was already viewed in this browser session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const seen = sessionStorage.getItem("bindy_splash_seen");
      if (!seen) {
        setShowSplash(true);
      }
    }
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
      {/* 1. SPLASH SCREEN (Once per session) */}
      {showSplash && (
        <SplashScreen
          onComplete={() => {
            if (typeof window !== "undefined") {
              sessionStorage.setItem("bindy_splash_seen", "true");
            }
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

      {/* 3. HERO (SECTION 1) — fixed behind; the shop rises up and covers it */}
      <div className="fixed inset-0 h-screen z-0">
        <CinematicHero
          onExploreCollection={() => {
            const el = document.getElementById("browse-collection");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          onWatchFilm={() => setIsFilmModalOpen(true)}
          isMuted={isMuted}
          toggleAudio={toggleAudio}
        />
      </div>

      {/* Spacer to dock flush at bottom edge of hero */}
      <div className="h-[calc(100vh-52px)] sm:h-[calc(100vh-58px)]" aria-hidden />

      {/* Everything below rises up over the fixed hero in 11 sharp modules */}
      <div className="relative z-10 bg-paper shadow-[0_-20px_50px_rgba(0,0,0,0.15)]">
        {/* HERITAGE TICKER */}
        <HeritageTicker />

        {/* SECTION 2: TRUST / VALUE STRIP */}
        <TrustStrip />

        {/* SECTION 3: THIS WEEK'S SPOTLIGHT (with quick-add hover state) */}
        <SpotlightSection
          onSelectProduct={(prod) => setQuickViewProduct(prod)}
          onAddToCart={handleAddToCart}
        />

        {/* DYNAMIC DISCOUNT INFINITE RIBBON */}
        <FlashDiscountRibbon />

        {/* SECTION 3.5: LIMITED 24-HOUR ARCHIVE WINDOW (FLASH PRIVILEGE) */}
        <FlashArchiveSection
          onQuickView={(prod) => setQuickViewProduct(prod)}
          onAddToCart={handleAddToCart}
        />

        {/* SECTION 3.8: PACK YOUR CAPSULE (4-PIECE VACATION WARDROBE STYLER) */}
        <CapsuleWardrobeSection
          onQuickView={(prod) => setQuickViewProduct(prod)}
          onAddToCart={handleAddToCart}
        />

        {/* SECTION 4: SHOP BY JOURNEY */}
        <JourneyTiles
          selectedJourney={selectedJourney}
          onSelectJourney={(dest) => setSelectedJourney(dest)}
        />

        {/* SECTION 5: BROWSE BY PIECE (grid, filter pills, micro-badges, load more) */}
        <BrowseSection
          onQuickView={(prod) => setQuickViewProduct(prod)}
          onAddToCart={handleAddToCart}
          selectedJourney={selectedJourney}
          onClearJourney={() => setSelectedJourney("All")}
        />

        {/* SECTION 6: THE STORIES BEHIND EVERY THREAD (tabbed story with deep-links) */}
        <StoriesSection />

        {/* SECTION 7: THREE WOMEN. ONE VISION. (click-through to full founder bios) */}
        <FoundersSection />

        {/* SECTION 8: CRAFTED WITH HEART / MATERIALS (with link to /craft) */}
        <MaterialsSection />

        {/* SECTION 9: SOCIAL PROOF BAND (aggregate rating, press quotes, Instagram UGC) */}
        <SocialProofStrip />

        {/* SECTION 10: NEWSLETTER / JOURNEY SIGNUP (distinct closing section) */}
        <JourneySignup />

        {/* SECTION 11: FOOTER (full sitemap) */}
        <Footer />
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

      {/* STICKY MOBILE CONVERSION BAR (Section 7.8) */}
      <AnimatePresence>
        {showStickyMobile && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-white/95 backdrop-blur-md border-t border-[#DCC7AF]/80 p-3 px-4 flex items-center justify-between gap-3 shadow-[0_-8px_30px_rgba(0,0,0,0.1)]"
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
