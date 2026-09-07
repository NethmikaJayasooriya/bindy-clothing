"use client";

import React, { useState, useEffect, useRef } from "react";
import { getCart, saveCart } from "@/lib/cart";
import { type Product } from "@/data/products";
import SplashScreen from "@/components/SplashScreen";
import Navbar from "@/components/Navbar";
import CinematicHero from "@/components/CinematicHero";
import HeritageTicker from "@/components/HeritageTicker";
import TrustStrip from "@/components/home/TrustStrip";
import SpotlightSection from "@/components/home/SpotlightSection";
import FlashArchiveSection from "@/components/home/FlashArchiveSection";
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
      <div className="h-[calc(100vh-36px)] sm:h-[calc(100vh-38px)]" aria-hidden />

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

        {/* SECTION 3.5: LIMITED 24-HOUR ARCHIVE WINDOW (FLASH PRIVILEGE) */}
        <FlashArchiveSection
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
    </main>
  );
}
