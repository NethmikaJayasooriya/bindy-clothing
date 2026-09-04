"use client";

import React, { useState, useEffect, useRef } from "react";
import { getCart, saveCart } from "@/lib/cart";
import SplashScreen from "@/components/SplashScreen";
import Navbar from "@/components/Navbar";
import CinematicHero from "@/components/CinematicHero";
import HeritageTicker from "@/components/HeritageTicker";
import HeroSpotlightStrip from "@/components/HeroSpotlightStrip";
import CollectionShowcase, { Product, PRODUCTS } from "@/components/CollectionShowcase";
import HeritageStories from "@/components/HeritageStories";
import ThreeWomenStory from "@/components/ThreeWomenStory";
import ArtisanCraft from "@/components/ArtisanCraft";
import ProductModal from "@/components/ProductModal";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { ambientPlayer } from "@/lib/ambientSound";

export default function Home() {
  const [showSplash, setShowSplash] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Check if splash screen was already viewed in this browser session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const seen = sessionStorage.getItem("bindy_splash_seen");
      if (!seen) {
        setShowSplash(true);
      }
    }
  }, []);

  // Hydrate the cart from localStorage (so items added on product pages appear here)
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
      {/* 1. PLEATED SILK & UNRAVELLING THREAD SPLASH SCREEN */}
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

      {/* 2. LUXURY NAVBAR */}
      <Navbar
        isMuted={isMuted}
        toggleAudio={toggleAudio}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 3. DUAL-REEL CINEMATIC HERO — fixed behind; the shop rises up and covers it */}
      <div className="fixed inset-0 h-screen z-0">
        <CinematicHero
          onExploreCollection={() => {
            const el = document.getElementById("collection");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          isMuted={isMuted}
          toggleAudio={toggleAudio}
        />
      </div>

      {/* spacer: reserves viewport minus slim ticker height so it docks flush at bottom edge */}
      <div className="h-[calc(100vh-36px)] sm:h-[calc(100vh-38px)]" aria-hidden />

      {/* Everything below rises up over the fixed hero */}
      <div className="relative z-10 bg-paper shadow-[0_-20px_50px_rgba(0,0,0,0.15)]">
        {/* 4. HERITAGE VALUES TICKER (Untouched at the bottom edge of hero) */}
        <HeritageTicker />

        {/* 5. THIS WEEK'S SPOTLIGHT (Curated signature silhouettes) */}
        <HeroSpotlightStrip
          onSelectProduct={(prod: Product) => setQuickViewProduct(prod)}
        />

        {/* 6. SERENDIPITY COLLECTION 01 SHOWCASE */}
        <CollectionShowcase
          onQuickView={(prod) => setQuickViewProduct(prod)}
          onAddToCart={(prod, size) => handleAddToCart(prod, size)}
        />

        {/* 7. HERITAGE CHAPTER STORIES (LOTUS, RED MOSQUE, SIGIRIYA, TEA HILLS, MANNAR) */}
        <HeritageStories />

        {/* 8. THREE WOMEN FOUNDER'S JOURNEY */}
        <ThreeWomenStory />

        {/* 9. ARTISAN CRAFT & SUSTAINABLE FABRICS */}
        <ArtisanCraft />

        {/* 10. LUXURY EDITORIAL FOOTER */}
        <Footer />
      </div>

      {/* 10. PRODUCT QUICK VIEW MODAL */}
      <ProductModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(prod, size) => handleAddToCart(prod, size)}
      />

      {/* 11. SLIDE-OUT CART DRAWER */}
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
